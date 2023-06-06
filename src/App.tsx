import "./App.css";
import AppProvider from "./AppContext";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export default App;
