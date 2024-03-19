import React, { useContext, useEffect, useState } from "react";
import SlideIn from "../../../UI/Animations/SlideIn";
import { appContext } from "../../../../AppContext";
import BackButton from "../../../UI/BackButton";
import { useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import { createPortal } from "react-dom";
import { Formik } from "formik";
import SharedDialog from "../../../SharedDialog";
import List from "../../../UI/List";
import * as yup from "yup";

import * as rpc from "../../../../__minima__/libs/RPC";
import * as fM from "../../../../__minima__/libs/fileManager";
import FileChooser from "../../../UI/FileChooser";

import Lottie from "lottie-react";
import Loading from "../../../../assets/loading.json";
import Logs from "../../../Logs";
import FadeIn from "../../../UI/Animations/FadeIn";
import Input from "../../../UI/Input";
import Tooltip from "../../../UI/Tooltip";

const validationSchema = yup.object().shape({
  host: yup.string().required("Enter an archive node host"),
});
const ChainResyncReset = () => {
  const {
    displayBackButton: displayHeaderBackButton,
    setBackButton,
    shuttingDown,
  } = useContext(appContext);
  const { archives, getArchives } = useContext(appContext);

  const navigate = useNavigate();

  const [MDSShutdown, setMDSShutdown] = useState(false);

  const [haveArchive, setHaveArchive] = useState(false);
  const [noHaveArchive, setNoHaveArchive] = useState(false);

  const [resetFileField, setResetFileField] = useState(0);
  const [archiveFileSelection, setArchiveFileSelection] = useState("local");
  const [beginResyncing, setBeginResyncing] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [progress, setProgress] = useState(0);
  const [fileUpload, setFileUpload] = useState(false);

  const [stepNo, setStepNo] = useState(0);
  const [tooltip, setTooltip] = useState({ host: false });

  useEffect(() => {
    if (shuttingDown) {
      setMDSShutdown(true);
    }
  }, [shuttingDown]);

  useEffect(() => {
    setBackButton({
      display: true,
      onClickHandler: () => navigate("/dashboard/archivereset"),
      title: "Archive Reset",
    });
  }, []);

  const handleArchiveSelector = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setArchiveFileSelection(event.target.value);
  };

  return (
    <>
      {haveArchive &&
        createPortal(
          <SharedDialog
            main={
              <>
                <Formik
                  initialValues={{
                    file: "",
                    upload: null,
                  }}
                  onSubmit={async (formData) => {
                    setBeginResyncing(true);

                    try {
                      // do your thing
                      const { file: archivefilepath } = formData;
                      const fullPath = await fM.getPath(archivefilepath);
                      await rpc.resetChainResync(fullPath).catch((error) => {
                        throw new Error(error);
                      });
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "An unexpected error occurred"
                      );
                    }
                  }}
                >
                  {({
                    handleSubmit,
                    setFieldValue,
                    errors,
                    values,
                    handleBlur,
                    isSubmitting,
                    resetForm,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <h1 className="text-2xl mb-8 text-center">
                        Select an archive
                      </h1>
                      <p className="mb-6 text-center">
                        Select a local archive or upload a new one
                      </p>

                      <div className="relative mb-4">
                        <select
                          disabled={fileUpload}
                          defaultValue={archiveFileSelection}
                          onChange={(e) => {
                            handleArchiveSelector(e);
                            resetForm();
                          }}
                          className="p-4 bg-black hover:cursor-pointer rounded w-full hover:opacity-80"
                        >
                          <option id="value" value="local">
                            Select an internal archive file
                          </option>
                          <option id="split" value="upload">
                            Upload an archive file
                          </option>
                        </select>

                        <svg
                          className="my-auto absolute right-2 top-[12px]"
                          width="32"
                          height="33"
                          viewBox="0 0 32 33"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_2226_53255"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="32"
                            height="33"
                          >
                            <rect
                              y="0.550781"
                              width="32"
                              height="32"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_2226_53255)">
                            <path
                              d="M16.0004 20.6172L8.4668 13.0508L9.6668 11.8844L16.0004 18.2172L22.334 11.8844L23.534 13.0844L16.0004 20.6172Z"
                              fill="#FaFaFF"
                            />
                          </g>
                        </svg>
                      </div>

                      <>
                        {archiveFileSelection === "local" && (
                          <>
                            <List
                              disabled={archives.length === 0}
                              options={archives}
                              setForm={async (option) => {
                                if (option.length) {
                                  setFieldValue("file", "/archives/" + option);
                                }
                              }}
                            />
                            {archives.length === 0 && (
                              <p className="text-sm mt-2 text-good">
                                No archives found in your internal files. Upload
                                a new one!
                              </p>
                            )}
                          </>
                        )}
                        {!fileUpload &&
                          archiveFileSelection === "upload" &&
                          !values.file.length && (
                            <FileChooser
                              disabled={isSubmitting}
                              keyValue={resetFileField}
                              handleEndIconClick={() => {
                                setResetFileField((prev) => prev + 1);
                                setFieldValue("upload", undefined);
                              }}
                              error={
                                errors.upload && errors.upload
                                  ? errors.upload
                                  : false
                              }
                              extraClass="core-grey-20"
                              accept=".gzip,.dat"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                if (e.target.files) {
                                  setFieldValue("upload", e.target.files[0]);
                                }
                              }}
                              onBlur={handleBlur}
                              placeholder="Select file"
                              type="file"
                              id="upload"
                              name="upload"
                              endIcon={
                                values.upload && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="24"
                                    viewBox="0 0 25 24"
                                    fill="none"
                                  >
                                    <mask
                                      id="mask0_645_17003"
                                      maskUnits="userSpaceOnUse"
                                      x="0"
                                      y="0"
                                      width="25"
                                      height="24"
                                    >
                                      <rect
                                        x="0.5"
                                        width="24"
                                        height="24"
                                        fill="#D9D9D9"
                                      />
                                    </mask>
                                    <g mask="url(#mask0_645_17003)">
                                      <path
                                        d="M9.89997 16.1539L12.5 13.5539L15.1 16.1539L16.1538 15.1001L13.5538 12.5001L16.1538 9.90005L15.1 8.84623L12.5 11.4462L9.89997 8.84623L8.84615 9.90005L11.4461 12.5001L8.84615 15.1001L9.89997 16.1539ZM7.8077 20.5C7.30257 20.5 6.875 20.325 6.525 19.975C6.175 19.625 6 19.1975 6 18.6923V6.00005H5V4.50008H9.49997V3.61548H15.5V4.50008H20V6.00005H19V18.6923C19 19.1975 18.825 19.625 18.475 19.975C18.125 20.325 17.6974 20.5 17.1922 20.5H7.8077ZM17.5 6.00005H7.49997V18.6923C7.49997 18.7693 7.53203 18.8398 7.59613 18.9039C7.66024 18.968 7.73077 19.0001 7.8077 19.0001H17.1922C17.2692 19.0001 17.3397 18.968 17.4038 18.9039C17.4679 18.8398 17.5 18.7693 17.5 18.6923V6.00005Z"
                                        fill="#91919D"
                                      />
                                    </g>
                                  </svg>
                                )
                              }
                            />
                          )}
                        {fileUpload && archiveFileSelection === "upload" && (
                          <div className="core-black-contrast-2 h-[56px] rounded p-4 mt-4 relative">
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
                        {fileUpload && values.upload && (
                          <p className="text-sm mt-2">
                            Uploading{" "}
                            {(values.upload as any).name
                              ? (values.upload as any).name + "..."
                              : ""}
                          </p>
                        )}
                        {!fileUpload &&
                          !!values.file.length &&
                          archiveFileSelection === "upload" && (
                            <p className="text-sm text-good flex items-center mt-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 -960 960 960"
                                width="24"
                              >
                                <path
                                  fill="#4FE3C1"
                                  d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
                                />
                              </svg>
                              {values.file.split("/archives/")[1].length
                                ? values.file.split("/archives/")[1]
                                : values.file.split("\\archives\\")[1]}
                            </p>
                          )}
                        {values.upload && (
                          <>
                            {!fileUpload && (
                              <Button
                                variant="primary"
                                extraClass="mt-4"
                                onClick={async () => {
                                  setFileUpload(true);
                                  setFieldValue("file", "");

                                  (window as any).MDS.file.upload(
                                    values.upload,
                                    async function (resp: any) {
                                      if (resp.allchunks >= 10) {
                                        setProgress(
                                          resp.chunk / resp.allchunks
                                        );
                                      }
                                      const fileName = resp.filename;
                                      if (resp.allchunks === resp.chunk) {
                                        setFileUpload(false);

                                        // Move uploaded file to internal, then set full path to prepare for reset command
                                        (window as any).MDS.file.move(
                                          "/fileupload/" + fileName,
                                          "/archives/" + fileName,
                                          (resp: any) => {
                                            if (resp.status) {
                                              setFieldValue(
                                                "file",
                                                "/archives/" + fileName
                                              );
                                              setFieldValue(
                                                "upload",
                                                undefined
                                              );
                                              setFileUpload(false);
                                              getArchives();
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }}
                              >
                                Upload
                              </Button>
                            )}
                          </>
                        )}
                        {values.file && values.file.length > 0 && (
                          <Button
                            type="submit"
                            variant="primary"
                            extraClass="mt-4"
                          >
                            Continue
                          </Button>
                        )}
                        {!fileUpload &&
                          archiveFileSelection === "upload" &&
                          !!values.file.length && (
                            <Button
                              onClick={() => setFieldValue("file", "")}
                              variant="tertiary"
                              extraClass="mt-4"
                            >
                              Upload a different file
                            </Button>
                          )}
                      </>
                    </form>
                  )}
                </Formik>
              </>
            }
            primary={<div />}
            secondary={
              <>
                {error && (
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      setError(false);
                      setBeginResyncing(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {!fileUpload && !error && (
                  <Button
                    variant="tertiary"
                    extraClass="mt-4"
                    onClick={() => {
                      setHaveArchive(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </>
            }
          />,
          document.body
        )}

      {noHaveArchive &&
        createPortal(
          <SharedDialog
            main={
              <>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    host: "",
                  }}
                  onSubmit={async (formData) => {
                    setBeginResyncing(true);

                    const { host } = formData;
                    (window as any).MDS.cmd(
                      `archive action:resync host:"${host}"`,
                      (response: any) => {
                        if (!response.status) {
                          setError(response.error);
                        }
                      }
                    );
                  }}
                >
                  {({
                    handleSubmit,
                    values,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    isValid,
                    errors,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      {stepNo === 0 && (
                        <FadeIn delay={0}>
                          <h1 className="text-2xl mb-8 text-center">
                            Re-sync your node?
                          </h1>
                          <p className="mb-6 text-center">
                            The full chain will be downloaded from your chosen
                            archive node. <br />
                            <br />
                            This action is irreversible, consider taking a
                            backup before starting re-sync. <br />
                            <br />
                            This process should take up to 2 hours to complete
                            but could take longer. Please connect your device to
                            a power source before continuing.
                          </p>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={() => setStepNo(1)}
                          >
                            Continue
                          </Button>
                        </FadeIn>
                      )}
                      {stepNo === 1 && (
                        <FadeIn delay={0}>
                          <div className="flex flex-col items-center">
                            <svg
                              className="mb-2"
                              width="64"
                              height="64"
                              viewBox="0 0 64 64"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_1607_21111"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="64"
                                height="64"
                              >
                                <rect width="64" height="64" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_1607_21111)">
                                <path
                                  d="M31.9993 44.6146C32.6096 44.6146 33.1211 44.4082 33.5339 43.9954C33.9467 43.5826 34.1531 43.071 34.1531 42.4608C34.1531 41.8506 33.9467 41.339 33.5339 40.9262C33.1211 40.5134 32.6096 40.307 31.9993 40.307C31.389 40.307 30.8775 40.5134 30.4647 40.9262C30.0519 41.339 29.8455 41.8506 29.8455 42.4608C29.8455 43.071 30.0519 43.5826 30.4647 43.9954C30.8775 44.4082 31.389 44.6146 31.9993 44.6146ZM29.9994 34.8711H33.9992V18.8711H29.9994V34.8711ZM32.0037 57.3326C28.4999 57.3326 25.2065 56.6677 22.1235 55.3379C19.0404 54.0081 16.3586 52.2034 14.078 49.9239C11.7974 47.6443 9.99191 44.9636 8.66155 41.882C7.33119 38.8003 6.66602 35.5076 6.66602 32.0038C6.66602 28.4999 7.3309 25.2065 8.66068 22.1235C9.99046 19.0404 11.7951 16.3586 14.0747 14.078C16.3543 11.7974 19.0349 9.99191 22.1166 8.66155C25.1983 7.3312 28.491 6.66602 31.9948 6.66602C35.4986 6.66602 38.7921 7.33091 41.8751 8.66069C44.9582 9.99046 47.64 11.7951 49.9206 14.0747C52.2012 16.3543 54.0067 19.0349 55.337 22.1166C56.6674 25.1983 57.3326 28.491 57.3326 31.9948C57.3326 35.4986 56.6677 38.7921 55.3379 41.8751C54.0081 44.9582 52.2034 47.64 49.9239 49.9206C47.6443 52.2012 44.9636 54.0067 41.882 55.337C38.8003 56.6674 35.5076 57.3326 32.0037 57.3326Z"
                                  fill="#F4F4F5"
                                />
                              </g>
                            </svg>

                            <h1 className="text-2xl mb-8 text-center">
                              Restore without archive file
                            </h1>
                            <p className="mb-6 text-center">
                              Restoring without an archive file can take much
                              longer to re-sync the chain. <br />
                              <br /> Please ensure you have a stable internet
                              connection and plug your device into a power
                              source before continuing.
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={() => setStepNo(2)}
                          >
                            Continue
                          </Button>
                        </FadeIn>
                      )}
                      {stepNo === 2 && (
                        <FadeIn delay={0}>
                          <h1 className="text-2xl mb-8 text-center">
                            Enter your archive host
                          </h1>
                          <div className="mb-4 rounded">
                            <span className="mb-2 flex gap-2 items-center">
                              <div className="text-left">Archive node host</div>
                              {!tooltip.host && (
                                <img
                                  className="w-4 h-4"
                                  onClick={() =>
                                    setTooltip({ ...tooltip, host: true })
                                  }
                                  alt="tooltip"
                                  src="./assets/help_filled.svg"
                                />
                              )}
                              {!!tooltip.host && (
                                <img
                                  className="w-4 h-4"
                                  onClick={() =>
                                    setTooltip({ ...tooltip, host: false })
                                  }
                                  alt="tooltip-dismiss"
                                  src="./assets/cancel_filled.svg"
                                />
                              )}
                            </span>
                            {tooltip.host && (
                              <Tooltip
                                extraClass="!mb-0 !mt-0 !mb-4"
                                onClick={() =>
                                  setTooltip({ ...tooltip, host: false })
                                }
                                content="Enter an ip:port of the archive node to sync from."
                                position={148}
                              />
                            )}
                            <div className="mb-6">
                              <Input
                                disabled={isSubmitting}
                                extraClass=""
                                id="host"
                                name="host"
                                placeholder="host"
                                type="text"
                                value={values.host}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="off"
                                error={
                                  errors && errors.host ? errors.host : false
                                }
                              />
                            </div>
                          </div>
                          <Button
                            disabled={!isValid || isSubmitting}
                            variant="primary"
                            type="submit"
                          >
                            Re-sync
                          </Button>
                        </FadeIn>
                      )}
                    </form>
                  )}
                </Formik>
              </>
            }
            primary={<div />}
            secondary={
              <>
                <Button
                  extraClass="mt-4"
                  variant="tertiary"
                  onClick={() => {
                    {
                      stepNo === 0 ? setNoHaveArchive(false) : setStepNo(0);
                    }
                  }}
                >
                  Cancel
                </Button>
              </>
            }
          />,
          document.body
        )}

      {error &&
        createPortal(
          <SharedDialog
            main={
              <div className="flex flex-col items-center">
                <svg
                  className="mb-3 inline"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_594_13339"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="64"
                    height="64"
                  >
                    <rect width="64" height="64" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_594_13339)">
                    <path
                      d="M31.9998 44.6151C32.61 44.6151 33.1216 44.4087 33.5344 43.9959C33.9472 43.5831 34.1536 43.0715 34.1536 42.4613C34.1536 41.851 33.9472 41.3395 33.5344 40.9267C33.1216 40.5139 32.61 40.3075 31.9998 40.3075C31.3895 40.3075 30.878 40.5139 30.4652 40.9267C30.0524 41.3395 29.846 41.851 29.846 42.4613C29.846 43.0715 30.0524 43.5831 30.4652 43.9959C30.878 44.4087 31.3895 44.6151 31.9998 44.6151ZM29.9998 34.8716H33.9997V18.8716H29.9998V34.8716ZM32.0042 57.333C28.5004 57.333 25.207 56.6682 22.124 55.3384C19.0409 54.0086 16.3591 52.2039 14.0785 49.9244C11.7979 47.6448 9.99239 44.9641 8.66204 41.8824C7.33168 38.8008 6.6665 35.5081 6.6665 32.0042C6.6665 28.5004 7.33139 25.207 8.66117 22.124C9.99095 19.0409 11.7956 16.3591 14.0752 14.0785C16.3548 11.7979 19.0354 9.9924 22.1171 8.66204C25.1987 7.33168 28.4915 6.6665 31.9953 6.6665C35.4991 6.6665 38.7926 7.3314 41.8756 8.66117C44.9586 9.99095 47.6405 11.7956 49.921 14.0752C52.2017 16.3548 54.0072 19.0354 55.3375 22.1171C56.6679 25.1988 57.333 28.4915 57.333 31.9953C57.333 35.4991 56.6682 38.7925 55.3384 41.8756C54.0086 44.9586 52.2039 47.6405 49.9244 49.921C47.6448 52.2017 44.9641 54.0072 41.8824 55.3375C38.8008 56.6679 35.5081 57.333 32.0042 57.333Z"
                      fill="#F4F4F5"
                    />
                  </g>
                </svg>

                <h1 className="text-2xl mb-8 text-center">
                  Hmm.. something went wrong.
                </h1>

                {typeof error === "string" && (
                  <p className="mb-8 text-center text-error truncate whitespace-normal break-all">
                    {typeof error.includes !== "undefined" &&
                    error.toString().includes("GZIP")
                      ? "Invalid password."
                      : typeof error.includes !== "undefined" &&
                        error.toString().includes("connectdata")
                      ? "Host is invalid."
                      : typeof error.includes !== "undefined" &&
                        error.toString().includes("Incorrect Password!")
                      ? "Incorrect password!"
                      : error.toString()}
                  </p>
                )}
                {typeof error === "object" && (
                  <p className="mb-8 text-center text-error truncate whitespace-normal break-all">
                    {JSON.stringify(error)}
                  </p>
                )}
              </div>
            }
            primary={null}
            secondary={
              <Button
                variant="tertiary"
                onClick={() => {
                  setError(false);
                  setBeginResyncing(false);
                }}
              >
                Cancel
              </Button>
            }
          />,
          document.body
        )}

      {beginResyncing &&
        createPortal(
          <SharedDialog
            size="lg"
            main={
              <div className="flex flex-col align-center">
                <Lottie
                  className="mb-4 inline"
                  width={4}
                  height={4}
                  style={{ maxWidth: 80, alignSelf: "center" }}
                  animationData={Loading}
                />
                <h1 className="text-2xl mb-8 text-center">Re-syncing</h1>

                <p className="mb-8 text-center">
                  Please don’t leave this screen whilst the chain is re-syncing.
                  <br /> <br />
                  Your node will shutdown when it is complete.
                </p>

                <Logs />
              </div>
            }
            primary={null}
            secondary={null}
          />,
          document.body
        )}

      {MDSShutdown &&
        createPortal(
          <SharedDialog
            bg="primary"
            main={
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="mb-3 inline"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_1102_25908"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="64"
                    height="64"
                  >
                    <rect width="64" height="64" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_1102_25908)">
                    <path
                      d="M28.2157 43.3436L46.1438 25.4154L43.3336 22.6052L28.2157 37.7232L20.6157 30.1232L17.8055 32.9334L28.2157 43.3436ZM32.0047 57.3333C28.5009 57.3333 25.2075 56.6684 22.1245 55.3386C19.0414 54.0088 16.3596 52.2042 14.079 49.9246C11.7984 47.645 9.99288 44.9644 8.66253 41.8827C7.33217 38.801 6.66699 35.5083 6.66699 32.0045C6.66699 28.5007 7.33188 25.2072 8.66166 22.1242C9.99144 19.0411 11.7961 16.3593 14.0757 14.0788C16.3553 11.7981 19.0359 9.99264 22.1176 8.66228C25.1992 7.33193 28.492 6.66675 31.9958 6.66675C35.4996 6.66675 38.793 7.33164 41.8761 8.66142C44.9591 9.9912 47.641 11.7959 49.9215 14.0754C52.2022 16.355 54.0076 19.0357 55.338 22.1174C56.6684 25.199 57.3335 28.4917 57.3335 31.9956C57.3335 35.4994 56.6686 38.7928 55.3389 41.8758C54.0091 44.9589 52.2044 47.6407 49.9249 49.9213C47.6453 52.2019 44.9646 54.0074 41.8829 55.3378C38.8013 56.6681 35.5085 57.3333 32.0047 57.3333Z"
                      fill="#F4F4F5"
                    />
                  </g>
                </svg>

                <h1 className="text-2xl mb-4 font-semibold text-center">
                  Re-sync complete
                </h1>
                <p className="font-medium mb-6 mt-6 text-center">
                  Your node was successfully re-synced and will shutdown.
                  Restart Minima for the re-sync to take effect.
                </p>
              </div>
            }
            secondary={<div />}
            primary={
              <Button
                variant="primary"
                onClick={() => {
                  if (window.navigator.userAgent.includes("Minima Browser")) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return Android.shutdownMinima();
                  }

                  return window.close();
                }}
              >
                Close application
              </Button>
            }
          />,
          document.body
        )}

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
                If your node is on the wrong chain or has been offline for a
                long time, you can re-sync all blocks from an archive file.{" "}
                <br /> <br /> Before doing a chain re-sync, you can attempt to
                get back in sync with the chain by:
                <ul className="list-disc list-inside mb-4">
                  <li className="pt-4 pl-2.5">
                    Shutting down your node from Settings and restarting it
                    (please allow 10-15 minutes for the node to sync)
                  </li>
                  <li className="pl-2.5">
                    Checking your internet connection is stable
                  </li>
                  <li className="pl-2.5">
                    Checking the battery settings for the Minima app to ensure
                    it is allowed to run in the background
                  </li>
                </ul>
                The archive file will be used to sync your node to the chain's
                top block and must be recently extracted from an archive node.
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
                If you don't have an archive file, you can visit the archive
                file channel on our Discord server{" "}
                <a target="_blank" href="https://discord.com/invite/minima">
                  https://discord.com/invite/minima
                </a>
              </p>
            </div>

            <Button extraClass="mb-4" onClick={() => setHaveArchive(true)}>
              I have an archive file
            </Button>

            <Button variant="tertiary" onClick={() => setNoHaveArchive(true)}>
              I don't have an archive file
            </Button>
          </div>
        </div>
      </SlideIn>
    </>
  );
};

export default ChainResyncReset;
