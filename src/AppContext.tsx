import {
  createContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactElement,
} from "react";

import * as rpc from "./__minima__/libs/RPC";
import * as fileManager from "./__minima__/libs/fileManager";
import { To } from "react-router-dom";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const [displayBackButton, setDisplayHeaderBackButton] = useState(false);
  const [backButton, setBackButton] = useState<{
    display: boolean;
    to: To;
    title: string;
  }>({
    display: false,
    to: "/dashboard",
    title: "Security",
  });
  const loaded = useRef(false);
  const [mode, setMode] = useState("desktop");
  const [showSecurity, setShowSecurity] = useState(true);
  const [vaultLocked, setVaultLocked] = useState<null | boolean>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [modal, setModal] = useState<{
    content: ReactElement<any, any> | null;
    primaryActions: ReactElement<any, any> | null;
    secondaryActions: ReactElement<any, any> | null;
  }>({
    content: null,
    primaryActions: null,
    secondaryActions: null,
  });

  // Seed phrase stuff
  const [_vault, setVault] = useState<{ phrase: string } | null>(null);
  const [_phrase, setPhrase] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
    12: "",
    13: "",
    14: "",
    15: "",
    16: "",
    17: "",
    18: "",
    19: "",
    20: "",
    21: "",
    22: "",
    23: "",
    24: "",
  });
  // backups stuff

  const [backups, setBackups] = useState<string[]>([]);
  const [appIsInWriteMode, setAppIsInWriteMode] = useState<boolean | null>(
    null
  );

  const [minidappSystemFailed, setMinidappSystemFailed] = useState<
    boolean | null
  >(null);

  const [shuttingDown, setShuttingDown] = useState(false);

  // apply these whenever vault is locked or unlocked
  useEffect(() => {
    if (loaded.current) {
      if (vaultLocked) {
        resetVault();
      }

      if (!vaultLocked) {
        fetchVault();
      }
    }
  }, [vaultLocked]);

  useEffect(() => {
    if (window.innerWidth < 568) {
      return setDisplayHeaderBackButton(true);
    }

    if (window.innerWidth > 568) {
      return setDisplayHeaderBackButton(false);
    }
    (window as any).addEventListener("resize", () => {
      if (window.innerWidth < 568) {
        return setDisplayHeaderBackButton(true);
      }

      if (window.innerWidth > 568) {
        return setDisplayHeaderBackButton(false);
      }
    });
  }, [window]);

  useEffect(() => {
    if (window.innerWidth < 568) {
      setMode("mobile");
    }
  }, []);

  useEffect(() => {
    if (appIsInWriteMode) {
      rpc.vault().then((response) => {
        setVault(response as any);
      });
    }
  }, [appIsInWriteMode]);

  const fetchVault = useCallback(() => {
    return rpc.vault().then((response) => {
      setVault(response as any);
    });
  }, []);

  const resetVault = () => {
    setVault(null);
  };

  const phraseAsArray = useMemo(() => {
    if (!_vault) {
      return [];
    }

    return _vault.phrase.split(" ");
  }, [_vault]);

  const clearPhrase = () => {
    setPhrase({
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
      10: "",
      11: "",
      12: "",
      13: "",
      14: "",
      15: "",
      16: "",
      17: "",
      18: "",
      19: "",
      20: "",
      21: "",
      22: "",
      23: "",
      24: "",
    });
  };

  const getBackups = () => {
    fileManager.listFiles("/backups").then((response: any) => {
      if (response.status) {
        setBackups(response.response.list.reverse());
      }
    });
  };

  const checkVaultLocked = () => {
    rpc.isVaultLocked().then((r) => {
      setVaultLocked(r);
    });
  };

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      (window as any).MDS.init((msg: any) => {
        if (msg.event === "MINIMALOG") {
          const log = msg.data.message;
          setLogs((prevState) => [...prevState, log]);
        }

        if (msg.event === "MDS_SHUTDOWN") {
          setShuttingDown(true);
        }

        if (msg.event === "MDSFAIL") {
          setMinidappSystemFailed(true);
        }

        if (msg.event === "inited") {
          rpc.isWriteMode().then((appIsInWriteMode) => {
            setAppIsInWriteMode(appIsInWriteMode);
          });

          /** create the backups folder */
          fileManager.createFolder("backups");

          /** get and set all current backups */
          getBackups();
          /** get latest backup for display reasons */
          // getLatestBackup();

          /** */
          checkVaultLocked();
        }
      });
    }
  }, [loaded]);

  return (
    <appContext.Provider
      value={{
        showSecurity,
        setShowSecurity,
        modal,
        setModal,
        vaultLocked,
        checkVaultLocked,
        logs,
        setLogs,
        appIsInWriteMode,
        minidappSystemFailed,
        setPhrase,
        clearPhrase,
        phraseAsArray,
        resetVault,
        fetchVault,
        mode,
        isMobile: mode === "mobile",

        // heading back button stuff
        backButton,
        setBackButton,
        displayBackButton,

        //backups
        backups,
        getBackups,

        // mds shutting down
        shuttingDown,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
