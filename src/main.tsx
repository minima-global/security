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

import ChainResyncReset from "./components/Security/ArchiveReset/ChainResync/index.tsx";
import ManageSeedPhrase from "./components/Security/ManageSeedPhrase/index.tsx";

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
import DeleteBackup from "./components/Security/BackUpNode/Backups/DeleteBackup/index.tsx";
import DeleteArchive from "./components/Security/ArchiveReset/Archives/DeleteArchive/index.tsx";
import ArchiveReset from "./components/Security/ArchiveReset/index.tsx";
import Restore from "./components/Security/ArchiveReset/Restore/index.tsx";
import Uploading from "./components/Uploading/index.tsx";
import SeedResyncReset from "./components/Security/ArchiveReset/SeedResync/index.tsx";
import Archives from "./components/Security/ArchiveReset/Archives/index.tsx";
import IntegrityCheck from "./components/Security/IntegrityCheck/index.tsx";

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

      <Route
        element={
          <Authorisation permissions={[PERMISSIONS["CAN_VIEW_UPLOADING"]]} />
        }
      >
        <Route path="upload" element={<Uploading />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard />}>
        <Route
          index
          element={
            <FadeIn delay={0}>
              <Security />
            </FadeIn>
          }
        />

        <Route path="integritycheck" element={<IntegrityCheck />} />

        <Route path="archivereset">
          <Route
            index
            element={
              <FadeIn delay={0}>
                <ArchiveReset />
              </FadeIn>
            }
          />
          <Route
            path="restorebackup"
            element={
              <FadeIn delay={0}>
                <Restore />
              </FadeIn>
            }
          />
          <Route
            path="chainresync"
            element={
              <FadeIn delay={0}>
                <ChainResyncReset />
              </FadeIn>
            }
          />
          <Route
            path="seedresync"
            element={
              <FadeIn delay={0}>
                <SeedResyncReset />
              </FadeIn>
            }
          />
          <Route path="archives">
            <Route
              index
              element={
                <FadeIn delay={100}>
                  <Archives />
                </FadeIn>
              }
            />
            <Route
              element={
                <Authorisation
                  permissions={[PERMISSIONS["CAN_VIEW_DELETE_ARCHIVE"]]}
                />
              }
            >
              <Route
                path="delete"
                element={
                  <FadeIn delay={100}>
                    <DeleteArchive />
                  </FadeIn>
                }
              />
            </Route>
          </Route>
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
          <Route path="backups">
            <Route
              index
              element={
                <FadeIn delay={100}>
                  <Backups />
                </FadeIn>
              }
            />
            <Route
              element={
                <Authorisation
                  permissions={[PERMISSIONS["CAN_VIEW_DELETE_BACKUP"]]}
                />
              }
            >
              <Route
                path="delete"
                element={
                  <FadeIn delay={100}>
                    <DeleteBackup />
                  </FadeIn>
                }
              />
            </Route>
          </Route>
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
