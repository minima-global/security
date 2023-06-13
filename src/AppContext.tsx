import { createContext, useRef, useState, useEffect } from "react";

import * as rpc from "./__minima__/libs/RPC";
import * as fileManager from "./__minima__/libs/fileManager";
import { useNavigate } from "react-router-dom";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const navigate = useNavigate();

  const [showSecurity, setShowSecurity] = useState(true);
  const [vaultLocked, setVaultLocked] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [modal, setModal] = useState({
    display: false,
    content: null,
    primaryActions: null,
    secondaryActions: null,
  });

  const [appIsInWriteMode, setAppIsInWriteMode] = useState<boolean | null>(
    null
  );

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

        if (msg.event === "inited") {
          rpc.isWriteMode().then((appIsInWriteMode) => {
            setAppIsInWriteMode(appIsInWriteMode);
          });

          fileManager.listFiles("/").then((r: any) => {
            console.log(r);
          });
          fileManager.createFolder("backups").then((r) => {
            console.log(r);
          });
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
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
