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
import ChainResync from "./components/Security/ChainResync/index.tsx";
import ManageSeedPhrase from "./components/Security/ManageSeedPhrase/index.tsx";
import ResyncDialog from "./components/Security/ResyncDialog/index.tsx";
import EnterSeedPhrase from "./components/Security/ManageSeedPhrase/EnterSeedPhrase/index.tsx";
import WipeThisNode from "./components/Security/ManageSeedPhrase/WipeThisNode/index.tsx";
import ViewSeedPhrase from "./components/Security/ViewSeedPhrase/index.tsx";
import Authorisation from "./authorisation/index.tsx";
import PERMISSIONS from "./permissions.ts";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Splash />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route
          element={
            <Authorisation permissions={[PERMISSIONS["CAN_VIEW_RESYNCING"]]} />
          }
        >
          <Route path="resyncing" element={<ResyncDialog />} />
        </Route>
        <Route path="lockprivatekeys" element={<LockPrivateKeys />} />
        <Route path="backup" element={<BackupNode />} />
        <Route path="resync" element={<ChainResync />} />
        <Route path="manageseedphrase" element={<ManageSeedPhrase />}>
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_VIEWSEEDPHRASE"]]}
              />
            }
          >
            <Route path="viewseedphrase" element={<ViewSeedPhrase />} />
          </Route>
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_ENTERSEEDPHRASE"]]}
              />
            }
          >
            <Route path="enterseedphrase" element={<EnterSeedPhrase />}>
              <Route
                element={
                  <Authorisation
                    permissions={[PERMISSIONS["CAN_VIEW_WIPETHISNODE"]]}
                  />
                }
              >
                <Route path="wipethisnode" element={<WipeThisNode />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="restore" element={<RestoreFromBackup />}>
          <Route
            element={
              <Authorisation permissions={[PERMISSIONS["CAN_VIEW_RESTORE"]]} />
            }
          >
            <Route path="frombackup" element={<RestoreDialog />} />
          </Route>
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
