import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Splash from "./components/Splash/index.tsx";
import Dashboard from "./pages/Dashboard/index.tsx";
import LockPrivateKeys from "./components/Security/LockPrivateKeys/index.tsx";
import BackupNode from "./components/Security/BackUpNode/index.tsx";
import RestoreFromBackup from "./components/Security/RestoreFromBackup/index.tsx";
import RestoreDialog from "./components/RestoreDialog/index.tsx";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Splash />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="lockprivatekeys" element={<LockPrivateKeys />} />
        <Route path="backup" element={<BackupNode />} />
        <Route path="restore" element={<RestoreFromBackup />}>
          <Route path="frombackup" element={<RestoreDialog />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
