import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Formik } from "formik";

import { appContext } from "../../../AppContext";
import { useArchiveContext } from "../../../providers/archiveProvider";

import BackButton from "../../UI/BackButton";
import Button from "../../UI/Button";
import SlideIn from "../../UI/Animations/SlideIn";
import { format } from "date-fns";
import SharedDialog from "../../SharedDialog";
import FileChooser from "../../UI/FileChooser";
import List from "../../UI/List";
import { useAuth } from "../../../providers/authProvider";
import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";

import PERMISSIONS from "../../../permissions";
import * as fileManager from "../../../__minima__/libs/fileManager";
import Logs from "../../Logs";

interface ArchiveResponse {
  archive: {
    blocks: number;
    end: string;
    start: string;
  };
  cascade: {
    exists: boolean;
    length: number;
    tip: string;
  };
  errors: number;
  from: number;
  message: string;
  recommend: string;
  valid: boolean;
}
const IntegrityCheck = () => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<false | string>(false);
  const [archiveFileSelection, setArchiveFileSelection] = useState("local");
  const [resetFileField, setResetFileField] = useState(0);
  const [fileUpload, setFileUpload] = useState(false);

  const [myIntegrity, setMyIntegrity] = useState<ArchiveResponse | null>(null);
  const [lastCheck, setLastCheck] = useState<number | null>(null);
  const [errorIntegrity, setErrorIntegrity] = useState<string | false>(false);

  const [showExternal, setShowExternal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showIntegrity, setShowIntegrity] = useState(false);
  const [externalPath, setExternalPath] = useState("");
  const [inspection, setExternalInspection] = useState<any>(null);

  const { authNavigate } = useAuth();
  const { getArchives } = useContext(appContext);
  const { handleUploadContext } = useArchiveContext();

  const {
    setBackButton,
    displayBackButton: displayHeaderBackButton,
    archives,
  } = useContext(appContext);

  useEffect(() => {
    setBackButton({ display: true, to: -1, title: "Back" });
  }, []);

  useEffect(() => {
    (window as any).MDS.keypair.get("integritycheck", function (res: any) {
      if (res.status) {
        const lastCheck = JSON.parse(res.value);
        setLastCheck(parseInt(lastCheck.ms));
        setMyIntegrity(lastCheck.integrity);
      }
    });
  }, []);

  const handleExternalClick = () => {
    setShowExternal(true);
  };

  const handleArchiveSelector = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setArchiveFileSelection(event.target.value);
  };

  const handleExternalIntegrityCheck = () => {
    setLoading(true);
    setError(false);
    (window as any).MDS.cmd(
      `archive action:inspect file:"${externalPath}"`,
      async function (resp) {
        if (!resp.status) {
          setError(resp.error ? resp.error : "Inspection failed!");
          setLoading(false);
        }
        if (resp.status) {
          setLoading(false);
          setExternalInspection(resp.response);
        }
      }
    );
  };

  const handleIntegrityCheckOwn = () => {
    setLastCheck(null);
    setMyIntegrity(null);
    setLoading(true);
    setErrorIntegrity(false);

    (window as any).MDS.cmd("archive action:integrity", function (resp: any) {
      if (resp.status) {
        const ms = new Date().getTime();
        (window as any).MDS.keypair.set(
          "integritycheck",
          JSON.stringify({ ms: ms, integrity: { ...resp.response } })
        );
        setLoading(false);
        setLastCheck(ms);
        setMyIntegrity(resp.response);
      }

      if (!resp.status) {
        setLoading(false);
        setErrorIntegrity(resp.error);
      }
    });
  };

  // external inspection checks
  const complete = inspection && inspection.archive.last === "1"; // can re-sync from genesis
  const warning = inspection && parseInt(inspection.archive.last) > 1; // can re-sync from that block
  const bad = inspection && parseInt(inspection.archive.last) <= 0; // bad

  return (
    <SlideIn isOpen={true} delay={0}>
      <div className="flex flex-col h-full bg-black px-4 pb-4">
        {!displayHeaderBackButton && <BackButton to={-1} title="Back" />}

        <h1 className="mt-6 text-2xl mb-8 text-left bg-inherit">
          Archive integrity check
        </h1>

        <div className="mb-4">
          <div className="mb-3 text-left">
            Check the integrity of your archive database. No host is required.{" "}
            <br />
            <br />
            You can either check the integrity of your node's archive database.
            Or you can check an external file.
          </div>
        </div>

        {loading && (
          <ul className="mb-2">
            <li
              className={`core-black-contrast-2 flex rounded justify-between p-4 ${
                showIntegrity ? "border-b-0" : ""
              }`}
            >
              <h1 className="text-base">Checking archive integrity...</h1>
              <Lottie
                style={{ width: 26, height: 26, alignSelf: "center" }}
                animationData={Loading}
              />
            </li>
          </ul>
        )}
        {!loading && myIntegrity && (
          <>
            <ul className="mb-2">
              <li
                className={`core-black-contrast-2 flex rounded justify-between p-4 ${
                  showIntegrity ? "border-b-0" : ""
                }`}
                onClick={() => setShowIntegrity((prevState) => !prevState)}
              >
                <h1 className="text-base">Archive Integrity</h1>
                <svg
                  className={`${
                    showIntegrity ? "arrow-active" : "arrow-passive"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path
                    d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"
                    fill="#d9d9d9"
                  />
                </svg>
              </li>

              <li
                aria-expanded={!showIntegrity}
                className="accordion-content flex flex-col gap-4 drawer-active"
              >
                <ul className="text-left p-4 rounded-b-lg core-black-contrast">
                  <li className="mb-4">
                    <p
                      className={`${
                        myIntegrity.valid
                          ? "form-success-message"
                          : "text-error"
                      }`}
                    >
                      {myIntegrity?.recommend}
                    </p>
                  </li>

                  <li>
                    <h1 className="text-lg text-white">Archive</h1>
                  </li>
                  <li className="text-black mt-2">
                    <h1 className="text-sm text-white">Blocks</h1>
                    <p className="text-base text-white opacity-50">
                      {myIntegrity?.archive.blocks}
                    </p>
                  </li>
                  <li className="text-black mt-2">
                    <h1 className="text-sm text-white">End</h1>
                    <p className="text-base text-white opacity-50">
                      {myIntegrity?.archive.end}
                    </p>
                  </li>
                  <li className="text-black mt-2">
                    <h1 className="text-sm text-white">Start</h1>
                    <p className="text-base text-white opacity-50">
                      {myIntegrity?.archive.start}
                    </p>
                  </li>
                  {myIntegrity?.cascade.exists && (
                    <>
                      <li className="mt-2">
                        <h1 className="text-lg text-white">Cascade</h1>
                      </li>
                      <li className="text-black mt-2">
                        <h1 className="text-sm text-white">Exists</h1>
                        <p className="text-base text-white opacity-50">
                          {myIntegrity?.cascade.exists ? "True" : "False"}
                        </p>
                      </li>
                      <li className="text-black mt-2">
                        <h1 className="text-sm text-white">Tip</h1>
                        <p className="text-base text-white opacity-50">
                          {myIntegrity?.cascade.tip}
                        </p>
                      </li>
                      <li className="text-black mt-2">
                        <h1 className="text-sm text-white">Start</h1>
                        <p className="text-base text-white opacity-50">
                          {myIntegrity?.cascade.length}
                        </p>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
            {lastCheck && (
              <div className="mb-6">
                <p className="text-sm text-left flex gap-1 items-center">
                  Your last check was on{" "}
                  {format(lastCheck, "yyyy/dd/MM - hh:mm:ss a")}{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                  >
                    <path
                      fill="#4FE3C1"
                      d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Zm0 0Zm-80-120Z"
                    />
                  </svg>
                </p>
              </div>
            )}
          </>
        )}

        {!loading && (
          <div className="core-black-contrast-2 rounded text-left p-4">
            {errorIntegrity && errorIntegrity.length && (
              <div className="text-sm form-error-message text-left mb-4 break-words">
                {errorIntegrity}
              </div>
            )}
            <Button
              disabled={loading}
              onClick={handleIntegrityCheckOwn}
              extraClass="core-black-contrast-1 mb-4"
            >
              Check my integrity
            </Button>
            <Button onClick={handleExternalClick} variant="primary">
              Check external
            </Button>
          </div>
        )}

        {showExternal &&
          createPortal(
            <div className="absolute top-[54px] left-0 right-0 bottom-0">
              <div className="grid grid-cols-[1fr_minmax(0,_560px)_1fr] grid-rows-1 bg-black h-full">
                <div />
                <div className="flex justify-center items-center">
                  <div className="core-black-contrast p-4 rounded w-full mx-4">
                    <h1 className="text-2xl mb-12 flex items-center justify-between">
                      {!loading && "External integrity check"}
                      {loading && "Inspecting file..."}

                      {loading && (
                        <Lottie
                          style={{ width: 26, height: 26, alignSelf: "center" }}
                          animationData={Loading}
                        />
                      )}
                      {!loading && (
                        <svg
                          className="hover:cursor-pointer"
                          onClick={() => {
                            setShowExternal(false);
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
                      )}
                    </h1>

                    <List
                      disabled={loading}
                      options={archives}
                      setForm={async (option) => {
                        setLoading(true);
                        await fileManager
                          .getPath("/archives/" + option)
                          .then((path) => {
                            setExternalPath(path);
                            setLoading(false);
                          })
                          .catch((err) => {
                            return setError(err);
                          });
                      }}
                    />

                    {!loading && error && (
                      <div className="text-sm form-error-message text-left mb-4 break-words mt-4">
                        {error}
                      </div>
                    )}
                    {!loading && complete && (
                      <div className="px-4 py-3 mb-4 flex rounded gap-4 form-success-box mt-4">
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
                    {!loading && warning && (
                      <div className="px-4 py-3 rounded mb-4 flex gap-4 form-info-box mt-4">
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
                          {inspection.archive.last} and may not be able to
                          re-sync all coins, consider using a different archive
                          file.
                        </p>
                      </div>
                    )}
                    {!loading && bad && (
                      <div className="px-4 py-3 mb-4 rounded flex  gap-4 form-error-box mt-4">
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
                    {!loading && (complete || warning) && (
                      <ul className="text-left p-4 rounded core-black-contrast-2">
                        <li>
                          <h1 className="text-lg text-white">Archive</h1>
                        </li>
                        <li className="text-black mt-2">
                          <h1 className="text-sm text-white">First</h1>
                          <p className="text-base text-white opacity-50">
                            {inspection?.archive.first}
                          </p>
                        </li>
                        <li className="text-black mt-2">
                          <h1 className="text-sm text-white">Last</h1>
                          <p className="text-base text-white opacity-50">
                            {inspection?.archive.last}
                          </p>
                        </li>
                        <li className="text-black mt-2">
                          <h1 className="text-sm text-white">Size</h1>
                          <p className="text-base text-white opacity-50">
                            {inspection?.archive.size}
                          </p>
                        </li>
                      </ul>
                    )}

                    <Button
                      onClick={handleExternalIntegrityCheck}
                      disabled={loading || !archives.length}
                      variant="primary"
                      extraClass="mt-6 flex justify-center bg-white"
                    >
                      {!loading && "Check integrity"}
                      {loading && "Inspecting..."}
                    </Button>
                    {!loading && (
                      <>
                        <input
                          accept=".gzip"
                          className="hidden"
                          type="file"
                          ref={inputRef}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const file = e.target.files
                              ? e.target.files[0]
                              : null;
                            if (file) {
                              setError(false);
                              handleUploadContext(file);
                              authNavigate(
                                "/upload",
                                [PERMISSIONS["CAN_VIEW_UPLOADING"]],
                                { state: { justUploading: true } }
                              );
                            }
                          }}
                        />
                        <Button
                          onClick={() => inputRef.current?.click()}
                          variant="tertiary"
                          extraClass="mt-2"
                        >
                          {!archives.length
                            ? "Upload file"
                            : "Upload another file"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div />
              </div>
            </div>,
            document.body
          )}

        {showExternal &&
          createPortal(
            <SharedDialog
              main={
                <Formik
                  initialValues={{ file: "", upload: null }}
                  onSubmit={async (formData) => {
                    setLoading(true);

                    try {
                      const fullPath = await fileManager.getPath(formData.file);

                      (window as any).MDS.cmd(
                        `archive action:inspect file:"${fullPath}"`,
                        async function (resp) {
                          if (resp.status) {
                            setExternalInspection(resp.response);
                          }
                          if (!resp.status) {
                            throw new Error(
                              resp.error
                                ? resp.error
                                : "Failed to inspect archive"
                            );
                          }
                        }
                      );
                    } catch (error) {
                      setError(error as string);
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
                      {" "}
                      <h1 className="text-2xl mb-8 text-center">
                        Select an archive
                      </h1>
                      <p className="mb-6 text-center">
                        Select a local archive or upload a new one, <br /> then
                        you can then inspect its integrity
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
                              accept=".gzip"
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
                              {values.file.split("/archives/")[1]}
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
                            Inspect integrity
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
              }
              primary={null}
              secondary={
                <>
                  {!fileUpload && (
                    <Button
                      extraClass="mt-4"
                      onClick={() => setShowExternal(false)}
                      variant="tertiary"
                    >
                      Cancel
                    </Button>
                  )}
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

                  <p className="mb-8 text-center text-error truncate whitespace-normal break-all">
                    {error.includes("GZIP")
                      ? "Invalid password."
                      : error.includes("connectdata")
                      ? "Host is invalid."
                      : error.includes("Incorrect Password!")
                      ? "Incorrect password!"
                      : error}
                  </p>
                </div>
              }
              primary={null}
              secondary={
                <>
                  <Button
                    extraClass="mt-4"
                    variant="tertiary"
                    onClick={() => {
                      setError(false);
                      setLoading(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              }
            />,
            document.body
          )}

        {loading &&
          createPortal(
            <SharedDialog
              main={
                <div className="flex flex-col align-center">
                  <Lottie
                    className="mb-4 inline"
                    width={4}
                    height={4}
                    style={{ maxWidth: 80, alignSelf: "center" }}
                    animationData={Loading}
                  />
                  <h1 className="text-2xl mb-8 text-center">Inspecting...</h1>

                  <p className="mb-8 text-center">
                    Please don’t leave this screen whilst the archive is being
                    inspected.
                    <br /> <br />
                    This may take a few minutes to finish.
                  </p>

                  <Logs />
                </div>
              }
              primary={null}
              secondary={null}
            />,
            document.body
          )}
        {inspection &&
          createPortal(
            <SharedDialog
              main={
                <div className="flex flex-col items-center">
                  <svg
                    className="mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="64"
                    viewBox="0 -960 960 960"
                    width="64"
                  >
                    <path
                      fill="#4FE3C1"
                      d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Zm0 0Zm-80-120Z"
                    />
                  </svg>
                  <h1 className="text-2xl mb-4 font-semibold text-center">
                    Inspection completed
                  </h1>
                  {/* <code>{JSON.stringify(inspection)}</code> */}

                  <div className="w-full bg-black rounded">
                    <h1 className="text-base text-center font-bold core-black-contrast-2 p-4 w-full rounded-t">
                      Your results...
                    </h1>
                    {inspection?.cascade.exists && (
                      <ul className="text-left pt-4 pl-4">
                        <li className="text-bold">Cascade</li>
                        <li className="pt-1">
                          <h1 className="text-sm opacity-80">Start</h1>
                          <p>{inspection?.cascade.start}</p>
                        </li>
                        <li className="pt-1">
                          <h1 className="text-sm opacity-80">Length</h1>
                          <p>{inspection?.cascade.length}</p>
                        </li>
                      </ul>
                    )}
                    {!inspection?.cascade.exists && (
                      <ul className="text-left pt-4 pl-4">
                        <li className="text-bold">Cascade</li>
                        <li className="pt-1">
                          <h1 className="text-sm opacity-80">Exists</h1>
                          <p>False</p>
                        </li>
                      </ul>
                    )}

                    <ul className="pt-4 pl-4 pb-4">
                      <li className="text-left text-bold">Archive</li>
                      <li className="pt-1">
                        <h1 className="text-sm opacity-80">First</h1>
                        <p>{inspection?.archive.first}</p>
                      </li>
                      <li className="pt-1">
                        <h1 className="text-sm opacity-80">Last</h1>
                        <p>{inspection?.archive.last}</p>
                      </li>
                      <li className="pt-1">
                        <h1 className="text-sm opacity-80">Size</h1>
                        <p>{inspection?.archive.size}</p>
                      </li>
                    </ul>
                  </div>

                  <Button
                    extraClass="mt-4"
                    onClick={() => {
                      setLoading(false);
                      setExternalInspection(false);
                    }}
                  >
                    Inspect another file
                  </Button>
                </div>
              }
              primary={null}
              secondary={
                <Button
                  extraClass="mt-4"
                  variant="tertiary"
                  onClick={() => {
                    setLoading(false);
                    setShowExternal(false);
                    setExternalInspection(false);
                  }}
                >
                  Done
                </Button>
              }
            />,
            document.body
          )}
      </div>
    </SlideIn>
  );
};

export default IntegrityCheck;
