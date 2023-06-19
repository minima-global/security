import "./App.css";
import AppProvider from "./AppContext";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider";

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
