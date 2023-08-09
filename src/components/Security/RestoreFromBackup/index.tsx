import { useLocation } from "react-router-dom";
import Button from "../../UI/Button";
import { useContext, useEffect } from "react";
import { appContext } from "../../../AppContext";
import { useAuth } from "../../../providers/authProvider";
import PERMISSIONS from "../../../permissions";
import BackButton from "../../UI/BackButton";
import { useArchiveContext } from "../../../providers/archiveProvider";

const RestoreFromBackup = () => {
  const {
    setModal,
    setBackButton,
    displayBackButton: displayHeaderBackButton,
  } = useContext(appContext);
  const location = useLocation();
  const { userWantsToArchiveReset } = useArchiveContext();
  const { authNavigate } = useAuth();

  useEffect(() => {
    setBackButton({ display: true, to: "/dashboard", title: "Security" });
  }, [location]);

  const InformativeDialog = {
    content: (
      <div>
        <img className="mb-4" alt="informative" src="./assets/error.svg" />{" "}
        <h1 className="text-2xl mb-8">Please note</h1>
        <p className="mb-6">
          Restoring a backup is irreversible. <br /> Consider taking a backup of
          this node before restoring.
        </p>
      </div>
    ),
    primaryActions: (
      <Button
        onClick={() => {
          if (userWantsToArchiveReset) {
            authNavigate("/upload", [PERMISSIONS["CAN_VIEW_UPLOADING"]]);
          }

          if (!userWantsToArchiveReset) {
            authNavigate("dashboard/restore/frombackup", [
              PERMISSIONS.CAN_VIEW_RESTORE,
            ]);
          }
        }}
      >
        Continue
      </Button>
    ),
    secondaryActions: (
      <Button onClick={() => authNavigate("/dashboard/restore", [])}>
        Cancel
      </Button>
    ),
  };

  const handleWarningClick = () => {
    authNavigate("/dashboard/modal", [PERMISSIONS.CAN_VIEW_MODAL]);
    setModal({
      content: InformativeDialog.content,
      primaryActions: InformativeDialog.primaryActions,
      secondaryActions: InformativeDialog.secondaryActions,
    });
  };

  return (
    <>
      <div className="flex flex-col h-full bg-black px-4 pb-4">
        <div className="flex flex-col h-full">
          {!displayHeaderBackButton && (
            <BackButton to="/dashboard" title="Security" />
          )}
          <div className="mt-6 text-2xl mb-8 text-left">
            Restore from backup
          </div>
          <div className="flex flex-col gap-5">
            <div className="core-black-contrast-2 p-4 rounded">
              <div className="mb-6 text-left">
                Restoring a backup will wipe this node and import the private
                keys, coin proofs and chain state provided in the backup. <br />{" "}
                <br /> Once restored, the node will attempt to sync to the
                latest block, please be patient.
              </div>
              <Button onClick={handleWarningClick}>Restore</Button>
            </div>
            <div className="text-left">
              <p className="text-sm password-label mr-4 ml-4">
                Once the syncing process has finished, the node will shutdown.
                Restart the node for the restore to take effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestoreFromBackup;
