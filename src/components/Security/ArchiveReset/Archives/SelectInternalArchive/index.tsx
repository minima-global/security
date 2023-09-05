import { createPortal } from "react-dom";
import { useArchiveContext } from "../../../../../providers/archiveProvider";
import List from "../../../../UI/List";
import { appContext } from "../../../../../AppContext";
import { useContext } from "react";
import Button from "../../../../UI/Button";
import { useAuth } from "../../../../../providers/authProvider";
import PERMISSIONS from "../../../../../permissions";
import * as rpc from "../../../../../__minima__/libs/RPC";

interface IProps {
  open: boolean;
  cancel: () => void;
  context?: "seedresync" | "chainresync" | "restore";
}
const SelectInternalArchive = ({ open, context, cancel }: IProps) => {
  const { archives } = useContext(appContext);
  const { authNavigate } = useAuth();
  const {
    handleArchivePathContext,
    resetArchiveContext,
    archivePathToResetWith,
  } = useArchiveContext();

  const handleContinueClick = async () => {
    if (context === "restore") {
      authNavigate("/dashboard/restore/frombackup", [
        PERMISSIONS.CAN_VIEW_RESTORE,
      ]);
    }
    if (context === "seedresync") {
      authNavigate(
        "/dashboard/manageseedphrase/importseedphrase",
        [PERMISSIONS.CAN_VIEW_IMPORTSEEDPHRASE],
        { state: { seedresync: true } }
      );
    }
    if (context === "chainresync") {
      authNavigate("/dashboard/resyncing", [PERMISSIONS.CAN_VIEW_RESYNCING]);

      await rpc.resetChainResync(archivePathToResetWith).catch((error) => {
        authNavigate("/dashboard/resyncing", [PERMISSIONS.CAN_VIEW_RESYNCING], {
          state: {
            error: error ? error : "Something went wrong, please try again.",
          },
        });
      });
    }
  };

  return (
    open &&
    createPortal(
      <div className="absolute top-[54px] left-0 right-0 bottom-0">
        <div className="grid grid-cols-[1fr_minmax(0,_560px)_1fr] grid-rows-1 bg-black h-full">
          <div />
          <div className="flex justify-center items-center">
            <div className="core-black-contrast p-4 rounded w-full mx-4">
              <h1 className="text-2xl mb-4 flex items-center justify-between">
                Select an archive
                <svg
                  className="hover:cursor-pointer"
                  onClick={() => {
                    cancel();
                    resetArchiveContext();
                  }}
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23077 16.5L0 15.2692L6.76923 8.5C4.12568 5.85645 2.64355 4.37432 0 1.73077L1.23077 0.5L8 7.26923L14.7692 0.5L16 1.73077L9.23077 8.5L16 15.2692L14.7692 16.5L8 9.73077L1.23077 16.5Z"
                    fill="#F9F9FA"
                  />
                </svg>
              </h1>
              <List
                options={archives}
                setForm={(option) => {
                  handleArchivePathContext("/archives/" + option, context);
                }}
              />

              <Button
                onClick={handleContinueClick}
                variant="primary"
                extraClass="mt-6"
              >
                Continue
              </Button>
            </div>
          </div>
          <div />
        </div>
      </div>,
      document.body
    )
  );
};

export default SelectInternalArchive;
