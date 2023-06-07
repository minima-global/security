import { createContext, useRef, useState, useEffect } from "react";

import * as rpc from "./__minima__/libs/RPC";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);

  const [showSecurity, setShowSecurity] = useState(true);
  const [vaultLocked, setVaultLocked] = useState(false);
  const [modal, setModal] = useState({
    display: false,
    content: null,
    primaryActions: null,
    secondaryActions: null,
  });

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      (window as any).MDS.init(() => {
        rpc.isVaultLocked().then((r) => {
          setVaultLocked(r);
        });
      });
    }
  }, [loaded]);

  return (
    <appContext.Provider
      value={{ showSecurity, setShowSecurity, modal, setModal, vaultLocked }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
