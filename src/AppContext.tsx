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
import Button from "./components/UI/Button";
import { useAuth } from "./providers/authProvider";
import PERMISSIONS from "./permissions";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const { authNavigate } = useAuth();
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

  const SuccessDialog = {
    content: (
      <div>
        <svg
          className="mb-3 inline"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_1102_25908"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="64"
            height="64"
          >
            <rect width="64" height="64" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_1102_25908)">
            <path
              d="M28.2157 43.3436L46.1438 25.4154L43.3336 22.6052L28.2157 37.7232L20.6157 30.1232L17.8055 32.9334L28.2157 43.3436ZM32.0047 57.3333C28.5009 57.3333 25.2075 56.6684 22.1245 55.3386C19.0414 54.0088 16.3596 52.2042 14.079 49.9246C11.7984 47.645 9.99288 44.9644 8.66253 41.8827C7.33217 38.801 6.66699 35.5083 6.66699 32.0045C6.66699 28.5007 7.33188 25.2072 8.66166 22.1242C9.99144 19.0411 11.7961 16.3593 14.0757 14.0788C16.3553 11.7981 19.0359 9.99264 22.1176 8.66228C25.1992 7.33193 28.492 6.66675 31.9958 6.66675C35.4996 6.66675 38.793 7.33164 41.8761 8.66142C44.9591 9.9912 47.641 11.7959 49.9215 14.0754C52.2022 16.355 54.0076 19.0357 55.338 22.1174C56.6684 25.199 57.3335 28.4917 57.3335 31.9956C57.3335 35.4994 56.6686 38.7928 55.3389 41.8758C54.0091 44.9589 52.2044 47.6407 49.9249 49.9213C47.6453 52.2019 44.9646 54.0074 41.8829 55.3378C38.8013 56.6681 35.5085 57.3333 32.0047 57.3333Z"
              fill="#F4F4F5"
            />
          </g>
        </svg>

        <h1 className="text-2xl mb-4 font-semibold">Re-sync complete</h1>
        <p className="font-medium mb-6 mt-6">
          Your node was successfully re-synced and will shutdown. Restart Minima
          for the re-sync to take effect.
        </p>
      </div>
    ),
    primaryActions: <div />,
    secondaryActions: (
      <Button
        onClick={() => {
          if (mode === "mobile") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return Android.shutdownMinima();
          }

          return window.close();
        }}
      >
        Close application
      </Button>
    ),
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
          authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
          setModal({
            content: SuccessDialog.content,
            primaryActions: SuccessDialog.primaryActions,
            secondaryActions: SuccessDialog.secondaryActions,
          });
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
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
