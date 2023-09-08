import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";

import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { appContext } from "../../../AppContext";
import BackButton from "../../UI/BackButton";
import Button from "../../UI/Button";
import { format } from "date-fns";
import { createPortal } from "react-dom";
import List from "../../UI/List";
import * as fileManager from "../../../__minima__/libs/fileManager";
import { useArchiveContext } from "../../../providers/archiveProvider";
import PERMISSIONS from "../../../permissions";
import { useAuth } from "../../../providers/authProvider";

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

  const [myIntegrity, setMyIntegrity] = useState<ArchiveResponse | null>(null);
  const [lastCheck, setLastCheck] = useState<number | null>(null);
  const [errorIntegrity, setErrorIntegrity] = useState<string | false>(false);

  const [showExternal, setShowExternal] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [loading, setLoading] = useState(false);

  const [showIntegrity, setShowIntegrity] = useState(false);
  const [externalPath, setExternalPath] = useState("");
  const [inspection, setExternalInspection] = useState<any>(null);

  const { authNavigate } = useAuth();
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
  const bad = inspection && parseInt(inspection.archive.last) < 0; // bad

  return (
    <div className="flex flex-col h-full bg-black px-4 pb-4">
      {!displayHeaderBackButton && <BackButton to="-1" title="Back" />}

      <h1 className="mt-6 text-2xl mb-8 text-left bg-inherit">
        Archive integrity check
      </h1>

      <div className="mb-4">
        <div className="mb-3 text-left">
          Check the integrity of your archive database. No host is required.{" "}
          <br />
          <br />
          You can either check the integrity of your node's archive database. Or
          you can check an external file.
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
                      myIntegrity.valid ? "form-success-message" : "text-error"
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
                        {inspection.archive.last} and may not be able to re-sync
                        all coins, consider using a different archive file.
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                        variant="secondary"
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
    </div>
  );
};

export default IntegrityCheck;
