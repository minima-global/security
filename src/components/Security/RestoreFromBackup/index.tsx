import { Outlet, matchPath, useLocation, useNavigate } from "react-router-dom";
import SlideScreen from "../../UI/SlideScreen";
import Button from "../../UI/Button";
import { useContext } from "react";
import { appContext } from "../../../AppContext";

const RestoreFromBackup = () => {
  const navigate = useNavigate();
  const { setModal } = useContext(appContext);
  const location = useLocation();
  const isRestoring = matchPath(
    { path: "/dashboard/restore/frombackup" },
    location.pathname
  );

  const InformativeDialog = {
    content: (
      <div>
        <img alt="informative" src="./assets/error.svg" />{" "}
        <h1 className="text-2xl mb-4">Please note</h1>
        <p>
          Restoring a backup is irreversible. <br /> Consider taking a backup of
          this node before restoring.
        </p>
      </div>
    ),
    primaryActions: (
      <Button
        onClick={() => {
          setModal(false);
          navigate("frombackup");
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
        <div className="flex flex-col h-full bg-black">
          <div className="flex flex-col h-full">
            <div
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer mb-4 flex items-center"
            >
              <svg
                className="mt-0.5 mr-4"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90017 13.1693L0.730957 7.00009L6.90017 0.830872L7.79631 1.72701L2.52324 7.00009L7.79631 12.2732L6.90017 13.1693Z"
                  fill="#F9F9FA"
                />
              </svg>
              Security
            </div>
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
