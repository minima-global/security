import { createContext } from "react";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  return <appContext.Provider value={{}}>{children}</appContext.Provider>;
};

export default AppProvider;
