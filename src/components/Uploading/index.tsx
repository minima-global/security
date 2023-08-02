import { RefObject, useEffect, useRef, useState } from "react";
import loadingSpinner from "../../assets/spinner.json";
import Lottie from "@amelix/react-lottie";
import { useNavigate } from "react-router-dom";
import Grid from "../UI/Grid";
import CommonDialogLayout from "../UI/CommonDialogLayout";
import Button from "../UI/Button";
import { useArchiveContext } from "../../providers/archiveProvider";
import { useAuth } from "../../providers/authProvider";
import PERMISSIONS from "../../permissions";

const Uploading = () => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  const navigate = useNavigate();

  const { authNavigate } = useAuth();

  const [error, setError] = useState<false | string>(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [integrityCheck, setIntegrityCheck] = useState(false);

  const {
    context,
    resetArchiveContext,
    checkArchiveIntegrity,
    setArchive,
    archive,
    archiveFileToUpload,
    setArchiveFileToUpload,
  } = useArchiveContext();

  useEffect(() => {
    if (archiveFileToUpload) {
      handleFileUpload(archiveFileToUpload);
    }
  }, [location, archiveFileToUpload]);

  const handleFileUpload = (file: File) => {
    setUploading(true);
    try {
      (window as any).MDS.file.upload(file, async function (resp: any) {
        if (resp.allchunks >= 10) {
          setProgress(resp.chunk / resp.allchunks);
        }

        if (resp.allchunks === resp.chunk) {
          // setArchiveFileToUpload(undefined);
          setIntegrityCheck(true);

          await checkArchiveIntegrity(file.name)
            .then((archive) => {
              setIntegrityCheck(false);
              setUploading(false);
              setArchive(archive);
            })
            .catch((error) => {
              console.error(error);
              setIntegrityCheck(false);
              setUploading(false);

              setError(error);
            });
        }
      });
    } catch (error: any) {
      console.error(error);
      setError(error);
      setUploading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingSpinner,
  };

  const complete = archive && archive.first === "1";
  const warning = archive && parseInt(archive.first) > 1;

  return (
    <Grid
      header={null}
      content={
        <CommonDialogLayout
          status={undefined}
          primaryActions={
            <>
              {!uploading && !error && (
                <Button
                  onClick={() => {
                    if (context === "restore") {
                      authNavigate("/dashboard/restore/frombackup", [
                        PERMISSIONS.CAN_VIEW_RESTORE,
                      ]);
                    }
                  }}
                >
                  Continue
                </Button>
              )}

              {!uploading && error && (
                <>
                  <input
                    className="hidden"
                    type="file"
                    ref={inputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        // let's re-upload..
                        setError(false);
                        setArchiveFileToUpload(file);
                        authNavigate("/upload", []);
                      }
                    }}
                  />
                  <Button onClick={() => inputRef.current?.click()}>
                    Upload a different file
                  </Button>
                </>
              )}
            </>
          }
          secondaryActions={
            <>
              <Button
                disabled={uploading}
                onClick={() => {
                  resetArchiveContext();
                  navigate("/dashboard/archivereset");
                }}
              >
                Cancel
              </Button>
            </>
          }
          content={
            <>
              <div className="grid h-full">
                <div>
                  <div className="flex w-full justify-between px-2 py-2">
                    {!!uploading && !integrityCheck && (
                      <h1 className="text-2xl">Uploading file...</h1>
                    )}
                    {!!uploading && !!integrityCheck && (
                      <h1 className="text-2xl">Inspecting file...</h1>
                    )}

                    {!uploading && !integrityCheck && (
                      <h1 className="text-2xl">Upload complete</h1>
                    )}

                    {!!uploading && !integrityCheck && (
                      <div className="col-span-1 flex justify-end">
                        <div>
                          <Lottie
                            options={defaultOptions}
                            height={32}
                            width={32}
                          />
                        </div>
                      </div>
                    )}
                    {!!uploading && !!integrityCheck && (
                      <div className="col-span-1 flex justify-end">
                        <div>
                          <Lottie
                            options={defaultOptions}
                            height={32}
                            width={32}
                          />
                        </div>
                      </div>
                    )}
                    {!uploading && !integrityCheck && (
                      <div className="col-span-1 flex justify-end">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
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
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full p-4 text-white mt-4 text-left core-black-contrast-2 rounded mb-4">
                    {archiveFileToUpload ? archiveFileToUpload.name : "N/A"}
                  </div>

                  {!!progress && (
                    <div className="core-black-contrast-2 h-[56px] rounded p-4 mt-6 mb-8 relative">
                      <div className="absolute text-left blend z-10 left-[16px] top-[15px] font-black">
                        {(Number(progress) * 100).toFixed(0)}%
                      </div>
                      <div
                        className="bg-white absolute w-full h-[56px] rounded transition-all origin-left"
                        style={{
                          transform: `scaleX(${progress})`,
                          left: "-1px",
                          top: "-2px",
                          width: "calc(100% + 1px)",
                        }}
                      ></div>
                    </div>
                  )}

                  {!uploading && complete && (
                    <div className="px-4 py-3 mb-4 flex rounded gap-4 form-success-box">
                      <svg
                        className="flex-none"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="8" fill="white" />
                        <mask
                          id="mask0_1546_39376"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_1546_39376)">
                          <path
                            d="M10.5061 16.4777L17.583 9.40081L16.4737 8.29152L10.5061 14.2591L7.50607 11.2591L6.39677 12.3684L10.5061 16.4777ZM12.0018 22C10.6187 22 9.31863 21.7375 8.10165 21.2126C6.88464 20.6877 5.82603 19.9753 4.9258 19.0755C4.02555 18.1757 3.31285 17.1175 2.78771 15.9011C2.26257 14.6846 2 13.3849 2 12.0018C2 10.6187 2.26246 9.31863 2.78737 8.10165C3.31228 6.88464 4.02465 5.82603 4.92448 4.9258C5.82433 4.02555 6.88248 3.31286 8.09894 2.78771C9.31538 2.26257 10.6151 2 11.9982 2C13.3813 2 14.6814 2.26246 15.8984 2.78737C17.1154 3.31229 18.174 4.02465 19.0742 4.92448C19.9745 5.82433 20.6871 6.88248 21.2123 8.09894C21.7374 9.31538 22 10.6151 22 11.9982C22 13.3813 21.7375 14.6814 21.2126 15.8984C20.6877 17.1154 19.9753 18.174 19.0755 19.0742C18.1757 19.9745 17.1175 20.6871 15.9011 21.2123C14.6846 21.7374 13.3849 22 12.0018 22Z"
                            fill="#00CBB6"
                          />
                        </g>
                      </svg>

                      <p className="text-sm my-auto text-left text-black">
                        This archive file contains no errors.
                      </p>
                    </div>
                  )}
                  {!uploading && warning && (
                    <div className="px-4 py-3 rounded mb-4 flex gap-4 form-info-box">
                      <svg
                        className="flex-none"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.99998 14.7307C10.2288 14.7307 10.4207 14.6533 10.5755 14.4985C10.7303 14.3437 10.8077 14.1519 10.8077 13.9231C10.8077 13.6942 10.7303 13.5024 10.5755 13.3476C10.4207 13.1928 10.2288 13.1154 9.99998 13.1154C9.77113 13.1154 9.5793 13.1928 9.4245 13.3476C9.2697 13.5024 9.1923 13.6942 9.1923 13.9231C9.1923 14.1519 9.2697 14.3437 9.4245 14.4985C9.5793 14.6533 9.77113 14.7307 9.99998 14.7307ZM9.25 11.0769H10.75V5.0769H9.25V11.0769ZM10.0017 19.5C8.68772 19.5 7.45268 19.2506 6.29655 18.752C5.1404 18.2533 4.13472 17.5765 3.2795 16.7217C2.42427 15.8669 1.74721 14.8616 1.24833 13.706C0.749442 12.5504 0.5 11.3156 0.5 10.0017C0.5 8.68772 0.749334 7.45268 1.248 6.29655C1.74667 5.1404 2.42342 4.13472 3.27825 3.2795C4.1331 2.42427 5.13834 1.74721 6.29398 1.24833C7.44959 0.749443 8.68437 0.5 9.9983 0.5C11.3122 0.5 12.5473 0.749334 13.7034 1.248C14.8596 1.74667 15.8652 2.42342 16.7205 3.27825C17.5757 4.1331 18.2527 5.13834 18.7516 6.29398C19.2505 7.44959 19.5 8.68437 19.5 9.9983C19.5 11.3122 19.2506 12.5473 18.752 13.7034C18.2533 14.8596 17.5765 15.8652 16.7217 16.7205C15.8669 17.5757 14.8616 18.2527 13.706 18.7516C12.5504 19.2505 11.3156 19.5 10.0017 19.5Z"
                          fill="#FFD028"
                        />
                      </svg>

                      <p className="text-sm text-left my-auto text-black">
                        This archive file can only re-sync from block{" "}
                        {archive.first} and may not be able to re-sync all
                        coins, consider using a different archive file.
                      </p>
                    </div>
                  )}
                  {!uploading && error && (
                    <div className="px-4 py-3 mb-4 rounded flex  gap-4 form-error-box">
                      <svg
                        className="flex-none"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.4 15L10 11.4L13.6 15L15 13.6L11.4 10L15 6.4L13.6 5L10 8.6L6.4 5L5 6.4L8.6 10L5 13.6L6.4 15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                          fill="#FF627E"
                        />
                      </svg>

                      <p className="text-sm text-left my-auto text-black">
                        This archive file contains errors, please use another
                        file.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          }
        />
      }
    ></Grid>
  );
};

export default Uploading;
