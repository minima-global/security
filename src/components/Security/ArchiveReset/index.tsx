import { useContext, useEffect, useState } from "react";
import SlideIn from "../../UI/Animations/SlideIn";
import { appContext } from "../../../AppContext";
import BackButton from "../../UI/BackButton";
import { useAuth } from "../../../providers/authProvider";
import Button from "../../UI/Button";
import CommonDialogLayout from "../../UI/CommonDialogLayout";
import FadeIn from "../../UI/Animations/FadeIn";

import { format } from "date-fns";
import * as fileManager from "../../../__minima__/libs/fileManager";

interface ExportedArchive {
  fileLocation: string;
  size: string;
}
const ArchiveReset = () => {
  const {
    displayBackButton: displayHeaderBackButton,
    setBackButton,
    isMinimaBrowser,
  } = useContext(appContext);
  const { authNavigate } = useAuth();

  const [exportingArchive, setExportingArchive] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportedArchive, setExportedArchive] =
    useState<ExportedArchive | null>(null);
  const [error, setError] = useState<false | string>(false);
  const [fileName, setFileName] = useState("");

  function downloadFile(mdsfile: string) {
    return new Promise((resolve) => {
      // webview download support
      // do not load binary
      if (isMinimaBrowser) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Android.fileDownload(MDS.minidappuid, mdsfile);
        return resolve(true);
      }

      const origFilePath = `/archives/${mdsfile}`;
      const newFilePath = `/my_downloads/${mdsfile}_minima_download_as_file_`;

      //Copy the original file to webfolder - WITH the special name
      (window as any).MDS.file.copytoweb(
        origFilePath,
        newFilePath,
        function () {
          const url = `my_downloads/${mdsfile}` + "_minima_download_as_file_";
          // Now create a normal link - that when clicked downloads it..
          const link = document.createElement("a");
          link.href = url;
          document.body.appendChild(link);
          link.click();
          resolve(true);
        }
      );
    });
  }

  useEffect(() => {
    setBackButton({
      display: true,
      to: "/dashboard",
      title: "Security",
    });
  }, []);

  return (
    <>
      {!exportingArchive && (
        <SlideIn isOpen={true} delay={0}>
          <div className="flex flex-col h-full bg-black px-4 pb-4">
            <div className="flex flex-col h-full">
              {!displayHeaderBackButton && (
                <BackButton to="/dashboard" title="Security" />
              )}
              <div className="mt-6 text-2xl mb-8 text-left">Reset node</div>
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
                  Make sure you have your seed phrase written down before
                  resetting your node or you could lose access to your coins.
                </p>
              </div>

              <div
                onClick={() =>
                  authNavigate("/dashboard/archivereset/restorebackup", [])
                }
                className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mb-4"
              >
                Restore a backup
                <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                      fill="#F4F4F5"
                    />
                  </svg>
                </div>
              </div>
              <div
                onClick={() =>
                  authNavigate("/dashboard/archivereset/chainresync", [])
                }
                className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mb-4"
              >
                Chain re-sync
                <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                      fill="#F4F4F5"
                    />
                  </svg>
                </div>
              </div>
              <div
                onClick={() =>
                  authNavigate("/dashboard/archivereset/seedresync", [])
                }
                className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mb-4"
              >
                Import seed phrase
                <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                      fill="#F4F4F5"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-sm text-left password-label mb-6">
                If you are running an archive node, you can export it as a file.
              </p>

              <Button onClick={() => setExportingArchive(true)}>
                Archive export
              </Button>
              <div
                onClick={() =>
                  authNavigate("/dashboard/archivereset/archives", [])
                }
                className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mt-4"
              >
                Browse internal archives{" "}
                <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                      fill="#F4F4F5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>
      )}

      {!!exportingArchive && (
        <FadeIn isOpen={true} delay={0}>
          <CommonDialogLayout
            status={undefined}
            primaryActions={
              <>
                {error && (
                  <div className="text-sm form-error-message text-left mb-4 break-words">
                    {error}
                  </div>
                )}

                {exportedArchive === null && (
                  <Button
                    disabled={exporting}
                    onClick={async () => {
                      setError(false);
                      setExporting(true);

                      const rootPath = await fileManager.getPath("");
                      const dateCreation = format(new Date(), "_dMMMyyyy_Hmm");
                      const fileName = "archive_export_" + dateCreation;
                      setFileName(fileName);

                      (window as any).MDS.cmd(
                        `archive action:export file:"${rootPath}/archives/${fileName}"`,
                        async function (resp) {
                          if (!resp.status) {
                            setError(
                              resp.error
                                ? resp.error
                                : "Exporting archive failed, please try again..."
                            );

                            setExporting(false);
                          }

                          if (resp.status) {
                            setExporting(false);
                            setExportedArchive({
                              fileLocation: resp.response.file,
                              size: resp.response.size,
                            });
                          }
                        }
                      );
                    }}
                  >
                    {!exporting ? "Export archive file" : "Exporting..."}
                  </Button>
                )}

                {!exporting && exportedArchive !== null && (
                  <Button
                    variant="primary"
                    onClick={async () => {
                      await downloadFile(fileName);
                    }}
                  >
                    Download now
                  </Button>
                )}
              </>
            }
            secondaryActions={
              <>
                {!exporting && (
                  <Button
                    onClick={() => {
                      setExportingArchive(false);
                      setExportedArchive(null);
                    }}
                  >
                    {exportedArchive === null ? "Cancel" : "Done"}
                  </Button>
                )}
              </>
            }
            content={
              <>
                {exportedArchive !== null && (
                  <div>
                    <svg
                      className="inline mb-6"
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 28 28"
                      fill="none"
                    >
                      <mask
                        id="mask0_1546_39369"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="28"
                        height="28"
                      >
                        <rect width="28" height="28" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1546_39369)">
                        <path
                          d="M11.9085 20.2688L21.8162 10.3611L20.2632 8.80812L11.9085 17.1628L7.70849 12.9628L6.15548 14.5158L11.9085 20.2688ZM14.0025 28C12.0661 28 10.2461 27.6326 8.54231 26.8977C6.8385 26.1628 5.35644 25.1655 4.09612 23.9057C2.83577 22.6459 1.838 21.1645 1.1028 19.4615C0.367599 17.7585 0 15.9388 0 14.0025C0 12.0661 0.36744 10.2461 1.10232 8.54231C1.8372 6.8385 2.83452 5.35644 4.09427 4.09612C5.35406 2.83577 6.83547 1.838 8.53851 1.1028C10.2415 0.367601 12.0612 0 13.9975 0C15.9339 0 17.7539 0.367441 19.4577 1.10232C21.1615 1.8372 22.6436 2.83452 23.9039 4.09427C25.1642 5.35406 26.162 6.83547 26.8972 8.53851C27.6324 10.2415 28 12.0612 28 13.9975C28 15.9339 27.6326 17.7539 26.8977 19.4577C26.1628 21.1615 25.1655 22.6436 23.9057 23.9039C22.6459 25.1642 21.1645 26.162 19.4615 26.8972C17.7585 27.6324 15.9388 28 14.0025 28Z"
                          fill="#F4F4F5"
                        />
                      </g>
                    </svg>
                    <h1 className="text-2xl mb-8">Export completed</h1>
                    <p className="mb-6">
                      An archive <span className="font-bold">{fileName}</span>{" "}
                      with size {exportedArchive.size} has been saved in your
                      internal archives directory. Click{" "}
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          authNavigate("/dashboard/archivereset/archives", [])
                        }
                      >
                        here
                      </a>{" "}
                      to browse your archives. You can also download it below:
                    </p>
                  </div>
                )}

                {exportedArchive === null && (
                  <div>
                    <img
                      className="mb-4 inline"
                      alt="informative"
                      src="./assets/error.svg"
                    />{" "}
                    <h1 className="text-2xl mb-8">Please note</h1>
                    <p className="mb-6">
                      Only do this if you are an archive node.
                    </p>
                  </div>
                )}
              </>
            }
          />
        </FadeIn>
      )}
    </>
  );
};

export default ArchiveReset;
