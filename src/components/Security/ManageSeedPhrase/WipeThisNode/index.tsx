import styles from "./Dialog.module.css";
import Button from "../../../UI/Button";
import { useFormik } from "formik";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../providers/authProvider";
import PERMISSIONS from "../../../../permissions";
import * as rpc from "../../../../__minima__/libs/RPC";
import { useArchiveContext } from "../../../../providers/archiveProvider";

const WipeThisNode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authNavigate } = useAuth();
  const {
    userWantsToArchiveReset,
    lastUploadPath,
    archiveFileToUpload,
    resetArchiveContext,
    deleteLastUploadedArchive,
  } = useArchiveContext();

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      formik.setStatus(undefined);
      //  Run RPC..
      authNavigate("/dashboard/resyncing", [PERMISSIONS.CAN_VIEW_RESYNCING]);

      if (!userWantsToArchiveReset) {
        rpc
          .importSeedPhrase(
            location.state.seedPhrase,
            location.state.host,
            location.state.keyuses
          )
          .catch((error) => {
            authNavigate(
              "/dashboard/resyncing",
              [PERMISSIONS.CAN_VIEW_RESYNCING],
              {
                state: {
                  error: error
                    ? JSON.stringify(error)
                    : "Something went wrong, please try again.",
                },
              }
            );
          });
      }

      if (userWantsToArchiveReset) {
        if (!lastUploadPath) {
          resetArchiveContext();
          if (archiveFileToUpload) {
            deleteLastUploadedArchive(archiveFileToUpload.name);
          }
          return authNavigate(
            "/dashboard/resyncing",
            [PERMISSIONS.CAN_VIEW_RESYNCING],
            {
              state: {
                error: "Archive path not found, please try again",
              },
            }
          );
        }
        rpc
          .resetSeedSync(
            lastUploadPath,
            location.state.seedPhrase,
            location.state.keyuses
          )
          .catch((error) => {
            resetArchiveContext();
            if (archiveFileToUpload) {
              deleteLastUploadedArchive(archiveFileToUpload.name);
            }

            authNavigate(
              "/dashboard/resyncing",
              [PERMISSIONS.CAN_VIEW_RESYNCING],
              {
                state: {
                  error: error
                    ? error
                    : "Something went wrong, please try again.",
                },
              }
            );
          });
      }
    },
  });

  return (
    <div className="grid">
      <div className={styles["dialog"]}>
        <div>
          <h1 className="text-2xl mb-8">Wipe this node?</h1>
          <p>
            This node will be wiped and recreated <br /> with the given seed
            phrase.
            <br /> <br /> This process can take up to 2 hours, <br /> please
            connect your device to a power source before you continue.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className={`${styles.primaryActions}`}>
            {formik.status && (
              <div className="text-sm form-error-message text-left">
                {formik.status}
              </div>
            )}
            <Button
              disabled={!formik.isValid || formik.isSubmitting}
              type="submit"
              onClick={() => formik.submitForm()}
            >
              Start re-sync
            </Button>
          </div>
          <div className={`${styles.desktop_only} ${styles.secondaryActions}`}>
            {!formik.isSubmitting && (
              <Button
                onClick={() => {
                  if (userWantsToArchiveReset) {
                    resetArchiveContext();
                    if (archiveFileToUpload) {
                      deleteLastUploadedArchive(
                        "/fileupload/" + archiveFileToUpload.name
                      );
                    }
                  }
                  navigate("/dashboard/archivereset/restorebackup");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
        {!formik.isSubmitting && (
          <Button
            onClick={() => {
              if (userWantsToArchiveReset) {
                resetArchiveContext();
                if (archiveFileToUpload) {
                  deleteLastUploadedArchive(
                    "/fileupload/" + archiveFileToUpload.name
                  );
                }
              }
              navigate("/dashboard/archivereset/restorebackup");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default WipeThisNode;
