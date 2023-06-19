import "./App.css";
import AppProvider from "./AppContext";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider";
import { useEffect } from "react";
import * as utils from "./utils";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const ls = localStorage.getItem(utils.getAppUID());

    if (!ls) {
      return localStorage.setItem(utils.getAppUID(), "1");
    }

    if (ls) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <AppProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
