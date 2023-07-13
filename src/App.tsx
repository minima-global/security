import "./App.css";
import AppProvider from "./AppContext";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider";
import { useEffect, useState } from "react";
import * as utils from "./utils";

function App() {
  const navigate = useNavigate();
  const ls = useLoaderData();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!load) {
      setLoad(true);
      if (!ls) {
        return localStorage.setItem(utils.getAppUID(), "1");
      }

      if (ls) {
        navigate("/dashboard");
      }
    }
  }, [ls, navigate, load]);

  return (
    <AuthProvider>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
