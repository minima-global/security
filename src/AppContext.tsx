import { createContext, useState } from "react";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const [showSecurity, setShowSecurity] = useState(true);

  return (
    <appContext.Provider value={{ showSecurity, setShowSecurity }}>
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
