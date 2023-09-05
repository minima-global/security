import { RefObject, useContext, useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "../UI/Grid";
import CommonDialogLayout from "../UI/CommonDialogLayout";
import Button from "../UI/Button";
import { useArchiveContext } from "../../providers/archiveProvider";
import { useAuth } from "../../providers/authProvider";
import PERMISSIONS from "../../permissions";
import * as rpc from "../../__minima__/libs/RPC";

import Loading from "../../assets/loading.json";
import { appContext } from "../../AppContext";

const Uploading = () => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { authNavigate } = useAuth();

  const [error, setError] = useState<false | string>(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const {
    context,
    resetArchiveContext,
    handleArchivePathContext,
    archivePathToResetWith,
    archiveFileToUpload,
  } = useArchiveContext();

  const { getArchives } = useContext(appContext);

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
        const fileName = resp.filename;
        if (resp.allchunks === resp.chunk) {
          setUploading(false);

          // Move uploaded file to internal, then set full path to prepare for reset command
          (window as any).MDS.file.move(
            "/fileupload/" + fileName,
            "/archives/" + fileName,
            (resp: any) => {
              if (resp.status) {
                handleArchivePathContext(
                  "/archives/" + fileName,
                  location.state && location.state.context
                    ? location.state.context
                    : null
                );

                getArchives();
              }
            }
          );
        }
      });
    } catch (error: any) {
      console.error(error);
      setError(error);
      setUploading(false);
    }
  };

  return (
    <Grid
      header={null}
      content={
        <CommonDialogLayout
          status={undefined}
          primaryActions={
            <>
              {location.state &&
                !location.state.justUploading &&
                !uploading &&
                !error && (
                  <Button
                    onClick={async () => {
                      if (context === "restore") {
                        authNavigate("/dashboard/restore/frombackup", [
                          PERMISSIONS.CAN_VIEW_RESTORE,
                        ]);
                      }
                      if (context === "chainresync") {
                        authNavigate("/dashboard/resyncing", [
                          PERMISSIONS.CAN_VIEW_RESYNCING,
                        ]);

                        await rpc
                          .resetChainResync(archivePathToResetWith)
                          .catch((error) => {
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
                      if (context === "seedresync") {
                        authNavigate(
                          "/dashboard/manageseedphrase/importseedphrase",
                          [PERMISSIONS.CAN_VIEW_IMPORTSEEDPHRASE],
                          { state: { seedresync: true } }
                        );
                      }
                    }}
                  >
                    Continue
                  </Button>
                )}

              {!uploading && error && (
                <>
                  <input
                    accept=".gzip"
                    className="hidden"
                    type="file"
                    ref={inputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        // let's re-upload..
                        setError(false);
                        handleFileUpload(file);
                        authNavigate(
                          "/upload",
                          [PERMISSIONS["CAN_VIEW_UPLOADING"]],
                          location.state
                        );
                      }
                    }}
                  />
                  <Button
                    extraClass="mt-4"
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload a different file
                  </Button>
                </>
              )}
            </>
          }
          secondaryActions={
            <>
              {!uploading && (
                <Button
                  onClick={() => {
                    if (location.state && location.state.justUploading) {
                      return navigate(-1);
                    }

                    resetArchiveContext();
                    navigate("/dashboard/archivereset");
                  }}
                >
                  Cancel
                </Button>
              )}
            </>
          }
          content={
            <>
              <div className="grid h-full">
                <div>
                  <div className="flex w-full justify-between px-2 py-2">
                    {!!uploading && (
                      <h1 className="text-2xl">Uploading file...</h1>
                    )}

                    {!uploading && (
                      <h1 className="text-2xl">Upload complete</h1>
                    )}

                    {!!uploading && (
                      <div className="col-span-1 flex justify-end">
                        <div>
                          <Lottie
                            className="mb-4"
                            style={{
                              width: 32,
                              height: 32,
                              alignSelf: "center",
                            }}
                            animationData={Loading}
                          />
                        </div>
                      </div>
                    )}

                    {!uploading && (
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

                  <div
                    className={`break-all w-full p-4 text-white mt-4 text-left core-black-contrast-2 rounded mb-4 ${
                      error ? "upload-error" : ""
                    }`}
                  >
                    {archiveFileToUpload ? archiveFileToUpload.name : "N/A"}
                  </div>

                  {uploading && !!progress && (
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
