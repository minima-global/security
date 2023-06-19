import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IAuthContext {
  permissions: string[];
  authNavigate: any;
}
const defaultValue: IAuthContext = {
  permissions: [],
  authNavigate: null,
};

const AuthContext = createContext<IAuthContext>(defaultValue);

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const navigate = useNavigate();

  const authNavigate = (
    pathname: string,
    permissions: string[],
    state: any
  ) => {
    setPermissions(permissions);
    navigate(pathname, state);
  };

  return (
    <AuthContext.Provider value={{ permissions, authNavigate }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
