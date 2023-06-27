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

import * as utils from "./utils";
import ImportSeedPhrase from "./components/Security/ManageSeedPhrase/ImportSeedPhrase/index.tsx";
import Backups from "./components/Security/BackUpNode/Backups/index.tsx";
import Security from "./components/Security/index.tsx";
import Dialog from "./components/Dialog/index.tsx";

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
      loader={() => {
        return localStorage.getItem(utils.getAppUID());
      }}
    >
      <Route index element={<Splash />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Security />} />
        <Route
          element={
            <Authorisation permissions={[PERMISSIONS["CAN_VIEW_RESYNCING"]]} />
          }
        >
          <Route path="resyncing" element={<ResyncDialog />} />
        </Route>
        <Route path="lockprivatekeys" element={<LockPrivateKeys />} />
        <Route path="backup">
          <Route index element={<BackupNode />} />
          <Route path="backups" element={<Backups />} />
        </Route>
        <Route path="resync" element={<ChainResync />} />
        <Route path="manageseedphrase">
          <Route index element={<ManageSeedPhrase />} />
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_IMPORTSEEDPHRASE"]]}
              />
            }
          >
            <Route path="importseedphrase" element={<ImportSeedPhrase />} />
          </Route>
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
            <Route path="enterseedphrase">
              <Route index element={<EnterSeedPhrase />} />
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
        <Route path="restore">
          <Route index element={<RestoreFromBackup />} />
          <Route
            element={
              <Authorisation permissions={[PERMISSIONS["CAN_VIEW_RESTORE"]]} />
            }
          >
            <Route path="frombackup" element={<RestoreDialog />} />
          </Route>
        </Route>

        <Route
          element={
            <Authorisation permissions={[PERMISSIONS["CAN_VIEW_MODAL"]]} />
          }
        >
          <Route path="modal" element={<Dialog />} />
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
