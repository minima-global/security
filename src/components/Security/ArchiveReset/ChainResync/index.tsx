import React, { useContext, useRef, RefObject, useEffect } from "react";
import SlideIn from "../../../UI/Animations/SlideIn";
import { appContext } from "../../../../AppContext";
import BackButton from "../../../UI/BackButton";
import { useAuth } from "../../../../providers/authProvider";
import { useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import PERMISSIONS from "../../../../permissions";
import { useArchiveContext } from "../../../../providers/archiveProvider";

const ChainResyncReset = () => {
  const {
    displayBackButton: displayHeaderBackButton,
    setModal,
    setBackButton,
  } = useContext(appContext);
  const { authNavigate } = useAuth();
  const navigate = useNavigate();

  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  const { setArchiveFileToUpload, setContext } = useArchiveContext();

  useEffect(() => {
    setBackButton({
      display: true,
      onClickHandler: () => navigate("/dashboard/archivereset"),
      title: "Archive Reset",
    });
  }, []);

  const InformativeDialog = {
    content: (
      <div>
        <img className="mb-4" alt="informative" src="./assets/error.svg" />{" "}
        <h1 className="text-2xl mb-8">Re-sync your node?</h1>
        <p className="mb-6">
          The full chain will be downloaded from your chosen archive node.{" "}
          <br />
          <br /> This action is irreversible, consider taking a backup before
          starting re-sync. <br />
          <br /> This process should take up to 2 hours to complete but could
          take longer. Please connect your device to a power source before
          continuing.
        </p>
      </div>
    ),
    primaryActions: (
      <>
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
              setArchiveFileToUpload(file);
              setContext("chainresync");
              authNavigate("/upload", []);
            }
          }}
        />
        <Button onClick={() => inputRef.current?.click()}>
          Upload archive file
        </Button>
      </>
    ),
    secondaryActions: (
      <Button
        onClick={() => authNavigate("/dashboard/archivereset/chainresync", [])}
      >
        Cancel
      </Button>
    ),
  };

  const NoArchiveDialog = {
    content: (
      <div>
        <img className="mb-4" alt="informative" src="./assets/error.svg" />{" "}
        <h1 className="text-2xl mb-8">Restore without archive file</h1>
        <p className="mb-6">
          Restoring without an archive file can take much longer to re-sync the
          chain. <br /> <br />
          Please ensure you have a stable internet connection and plug your
          device into a power source before continuing.
        </p>
      </div>
    ),
    primaryActions: (
      <>
        <Button
          onClick={() =>
            authNavigate("/dashboard/resync", [
              PERMISSIONS["CAN_VIEW_RESYNCING"],
            ])
          }
        >
          Continue
        </Button>
      </>
    ),
    secondaryActions: (
      <Button
        onClick={() => authNavigate("/dashboard/archivereset/chainresync", [])}
      >
        Cancel
      </Button>
    ),
  };

  const handleUploadClick = () => {
    authNavigate("/dashboard/modal", [PERMISSIONS.CAN_VIEW_MODAL]);
    setModal({
      content: InformativeDialog.content,
      primaryActions: InformativeDialog.primaryActions,
      secondaryActions: InformativeDialog.secondaryActions,
    });
  };

  const handleNoArchiveClick = () => {
    authNavigate("/dashboard/modal", [PERMISSIONS.CAN_VIEW_MODAL]);
    setModal({
      content: NoArchiveDialog.content,
      primaryActions: NoArchiveDialog.primaryActions,
      secondaryActions: NoArchiveDialog.secondaryActions,
    });
  };

  return (
    <SlideIn isOpen={true} delay={0}>
      <div className="flex flex-col h-full bg-black px-4 pb-4">
        <div className="flex flex-col h-full">
          {!displayHeaderBackButton && (
            <BackButton
              onClickHandler={() => navigate("/dashboard/archivereset")}
              title="Archive Reset"
            />
          )}
          <div className="mt-6 text-2xl mb-8 text-left">Chain re-sync</div>
          <div className="mb-4">
            <div className="mb-3 text-left">
              If your node is on the wrong chain or has been offline for a long
              time, you can re-sync all blocks from an archive file. <br />{" "}
              <br /> Before doing a chain re-sync, you can attempt to get back
              in sync with the chain by:
              <ul className="list-disc list-inside mb-4">
                <li className="pt-4 pl-2.5">
                  Shutting down your node from Settings and restarting it
                  (please allow 10-15 minutes for the node to sync)
                </li>
                <li className="pl-2.5">
                  Checking your internet connection is stable
                </li>
                <li className="pl-2.5">
                  Checking the battery settings for the Minima app to ensure it
                  is allowed to run in the background
                </li>
              </ul>
              The archive file will be used to sync your node to the chain's top
              block and must be recently extracted from an archive node.
            </div>
          </div>

          <div className="text-left flex gap-2 mb-8">
            <svg
              className="flex-none w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="8" fill="#08090B" />
              <mask
                id="mask0_1607_18879"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1607_18879)">
                <path
                  d="M12 16.7307C12.2288 16.7307 12.4207 16.6533 12.5755 16.4985C12.7303 16.3437 12.8077 16.1519 12.8077 15.9231C12.8077 15.6942 12.7303 15.5024 12.5755 15.3476C12.4207 15.1928 12.2288 15.1154 12 15.1154C11.7711 15.1154 11.5793 15.1928 11.4245 15.3476C11.2697 15.5024 11.1923 15.6942 11.1923 15.9231C11.1923 16.1519 11.2697 16.3437 11.4245 16.4985C11.5793 16.6533 11.7711 16.7307 12 16.7307ZM11.25 13.0769H12.75V7.0769H11.25V13.0769ZM12.0017 21.5C10.6877 21.5 9.45268 21.2506 8.29655 20.752C7.1404 20.2533 6.13472 19.5765 5.2795 18.7217C4.42427 17.8669 3.74721 16.8616 3.24833 15.706C2.74944 14.5504 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45268 3.248 8.29655C3.74667 7.1404 4.42342 6.13472 5.27825 5.2795C6.1331 4.42427 7.13834 3.74721 8.29398 3.24833C9.44959 2.74944 10.6844 2.5 11.9983 2.5C13.3122 2.5 14.5473 2.74933 15.7034 3.248C16.8596 3.74667 17.8652 4.42342 18.7205 5.27825C19.5757 6.1331 20.2527 7.13834 20.7516 8.29398C21.2505 9.44959 21.5 10.6844 21.5 11.9983C21.5 13.3122 21.2506 14.5473 20.752 15.7034C20.2533 16.8596 19.5765 17.8652 18.7217 18.7205C17.8669 19.5757 16.8616 20.2527 15.706 20.7516C14.5504 21.2505 13.3156 21.5 12.0017 21.5Z"
                  fill="#E9E9EB"
                />
              </g>
            </svg>

            <p className="text-sm password-label">
              If you don't have an archive file, you can download a file here:{" "}
              <a
                className=""
                target="_blank"
                href="https://www.github.com/archivenode"
              >
                www.github.com/archivenode
              </a>
            </p>
          </div>

          <Button onClick={handleUploadClick} extraClass="mb-4">
            Upload archive file
          </Button>
          <Button variant="tertiary" onClick={handleNoArchiveClick}>
            I don't have an archive file
          </Button>
        </div>
      </div>
    </SlideIn>
  );
};

export default ChainResyncReset;
