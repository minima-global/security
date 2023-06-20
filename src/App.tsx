import "./App.css";
import AppProvider from "./AppContext";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider";
import { useEffect } from "react";
import * as utils from "./utils";

function App() {
  const navigate = useNavigate();
  const ls = useLoaderData();

  useEffect(() => {
    if (!ls) {
      return localStorage.setItem(utils.getAppUID(), "1");
    }

    if (ls) {
      navigate("/dashboard");
    }
  }, [ls]);

  return (
    <AppProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
