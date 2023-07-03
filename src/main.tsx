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
import AutoCreatePassword from "./components/Security/BackUpNode/AutoCreatePassword/index.tsx";
import FadeIn from "./components/UI/Animations/FadeIn/index.tsx";
import SlideIn from "./components/UI/Animations/SlideIn/index.tsx";

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
        <Route
          index
          element={
            <FadeIn delay={0}>
              <Security />
            </FadeIn>
          }
        />
        <Route
          element={
            <Authorisation permissions={[PERMISSIONS["CAN_VIEW_RESYNCING"]]} />
          }
        >
          <Route
            path="resyncing"
            element={
              <FadeIn delay={100}>
                <ResyncDialog />
              </FadeIn>
            }
          />
        </Route>
        <Route
          path="lockprivatekeys"
          element={
            <SlideIn delay={100}>
              <LockPrivateKeys />
            </SlideIn>
          }
        />
        <Route path="backup">
          <Route
            index
            element={
              <SlideIn delay={100}>
                <BackupNode />
              </SlideIn>
            }
          />
          <Route
            path="backups"
            element={
              <FadeIn delay={100}>
                <Backups />
              </FadeIn>
            }
          />
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_AUTOCREATEPASSWORD"]]}
              />
            }
          >
            <Route
              path="autocreatepassword"
              element={
                <FadeIn delay={100}>
                  <AutoCreatePassword />
                </FadeIn>
              }
            />
          </Route>
        </Route>
        <Route
          path="resync"
          element={
            <SlideIn delay={100}>
              <ChainResync />
            </SlideIn>
          }
        />
        <Route path="manageseedphrase">
          <Route
            index
            element={
              <SlideIn delay={100}>
                <ManageSeedPhrase />
              </SlideIn>
            }
          />
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_IMPORTSEEDPHRASE"]]}
              />
            }
          >
            <Route
              path="importseedphrase"
              element={
                <SlideIn delay={100}>
                  <ImportSeedPhrase />
                </SlideIn>
              }
            />
          </Route>
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_VIEWSEEDPHRASE"]]}
              />
            }
          >
            <Route
              path="viewseedphrase"
              element={
                <SlideIn delay={100}>
                  <ViewSeedPhrase />
                </SlideIn>
              }
            />
          </Route>
          <Route
            element={
              <Authorisation
                permissions={[PERMISSIONS["CAN_VIEW_ENTERSEEDPHRASE"]]}
              />
            }
          >
            <Route path="enterseedphrase">
              <Route
                index
                element={
                  <FadeIn delay={0}>
                    <EnterSeedPhrase />
                  </FadeIn>
                }
              />
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
          <Route
            index
            element={
              <SlideIn delay={100}>
                <RestoreFromBackup />
              </SlideIn>
            }
          />
          <Route
            element={
              <Authorisation permissions={[PERMISSIONS["CAN_VIEW_RESTORE"]]} />
            }
          >
            <Route
              path="frombackup"
              element={
                <FadeIn delay={100}>
                  <RestoreDialog />
                </FadeIn>
              }
            />
          </Route>
        </Route>

        <Route
          element={
            <Authorisation permissions={[PERMISSIONS["CAN_VIEW_MODAL"]]} />
          }
        >
          <Route
            path="modal"
            element={
              <FadeIn delay={100}>
                <Dialog />
              </FadeIn>
            }
          />
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
