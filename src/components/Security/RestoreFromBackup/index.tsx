import { Outlet, To, matchPath, useLocation } from "react-router-dom";
import SlideScreen from "../../UI/SlideScreen";
import Button from "../../UI/Button";
import { useContext, useEffect } from "react";
import { appContext } from "../../../AppContext";
import { useAuth } from "../../../providers/authProvider";
import PERMISSIONS from "../../../permissions";
import BackButton from "../../UI/BackButton";

const RestoreFromBackup = () => {
  const {
    setModal,
    setBackButton,
    displayBackButton: displayHeaderBackButton,
  } = useContext(appContext);
  const location = useLocation();
  const { authNavigate } = useAuth();
  const isRestoring = matchPath(
    { path: "/dashboard/restore/frombackup" },
    location.pathname
  );

  useEffect(() => {
    setBackButton({ display: true, to: -1 as To, title: "Security" });
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
          setModal(false);
          authNavigate("dashboard/restore/frombackup", [
            PERMISSIONS.CAN_VIEW_RESTORE,
          ]);
        }}
      >
        Continue
      </Button>
    ),
    secondaryActions: <Button onClick={() => setModal(false)}>Cancel</Button>,
  };

  const handleWarningClick = () => {
    setModal({
      display: true,
      content: InformativeDialog.content,
      primaryActions: InformativeDialog.primaryActions,
      secondaryActions: InformativeDialog.secondaryActions,
    });
  };

  return (
    <>
      {isRestoring && <Outlet />}
      <SlideScreen display={!isRestoring}>
        <div className="flex flex-col h-full bg-black px-4 pb-4">
          <div className="flex flex-col h-full">
            {!displayHeaderBackButton && (
              <BackButton to={-1 as To} title="Security" />
            )}
            <div className="mt-6 text-2xl mb-8 text-left">
              Restore from backup
            </div>
            <div className="flex flex-col gap-5">
              <div className="core-black-contrast-2 p-4 rounded">
                <div className="mb-6 text-left">
                  Restoring a backup will wipe this node and import the private
                  keys, coin proofs and chain state provided in the backup.{" "}
                  <br /> <br /> Once restored, the node will attempt to sync to
                  the latest block, please be patient.
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
      </SlideScreen>
    </>
  );
};

export default RestoreFromBackup;
