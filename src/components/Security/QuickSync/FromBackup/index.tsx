import { useContext, useState } from "react";
import { appContext } from "../../../../AppContext";
import { Formik } from "formik";
import * as yup from "yup";
import AnimatedDialog from "../../../UI/AnimatedDialog";
import RightArrow from "../../../Icons/RightArrow";
import MinimaFileUploader from "../../MinimaFileUploader";
import { format } from "date-fns";
import * as utils from "../../../../utils";

import * as fileManager from "../../../../__minima__/libs/fileManager";
import TogglePasswordIcon from "../../../UI/TogglePasswordIcon/TogglePasswordIcon";
import DialogLogs from "../DialogLogs";
import SlideIn from "../../../UI/Animations/SlideIn";

const makeTimestamp = (filename: string) => {
  const regex = /^(auto_)?minima_backup_(\d+)__([^_]+)_(\d+)\.bak$/;
  // Extracting components from the filename using regex
  const match = filename.match(regex);
  filename.match(regex);
  if (!match) return "";

  const timestamp = parseInt(match[2]);

  // Convert timestamp to Date object
  const timestampDate = new Date(timestamp);

  // Format the timestamp using date-fns
  return format(timestampDate, "dd/MM/yyyy HH:mm");
};

const makeAuto = (filename: string) => {
  const regex = /^(auto_)?minima_backup_(\d+)__([^_]+)_(\d+)\.bak$/;
  // Extracting components from the filename using regex
  const match = filename.match(regex);
  filename.match(regex);
  if (!match) return null;

  const isAuto = match[1] === "auto_";

  return isAuto ? "Auto" : "";
};

const FromBackup = () => {
  const { backups } = useContext(appContext);
  const [f, setF] = useState(false);
  const [step, setStep] = useState(2);

  const [hidePassword, setHidePassword] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [shutdown, setShutdown] = useState(false);

  // if (_currentRestoreWindow !== "frombackup") {
  //   return null;
  // }

  const handleSearchEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const renderBackups = ({ setFieldValue, setPromptInternal }) => {
    if (
      backups.filter((b) => makeTimestamp(b.name).includes(searchText))
        .length === 0
    ) {
      return (
        <li className="px-4">
          <p className="text-xs text-center">
            No backup found with the specified date/time
          </p>
        </li>
      );
    }

    return (
      <SlideIn isOpen={true} delay={0}>
        {backups
          .filter((b) => makeTimestamp(b.name).includes(searchText))
          .sort((a, b) => {
            // Extract the date strings from backup names
            const dateA: any = new Date(makeTimestamp(a.name));
            const dateB: any = new Date(makeTimestamp(b.name));

            // Compare the dates
            return dateA - dateB; // Sort in ascneding order (most recent first)
          })
          .map((backup, index) => (
            <li
              className="grid grid-cols-[1fr_auto] bg-[#1B1B1B] px-4 py-3 mb-3"
              onClick={() => {
                setFieldValue("file", backup.location);
                setPromptInternal(false);
              }}
              key={index}
            >
              <h3 className="text-white font-bold">
                My {makeAuto(backup.name)} Backup
              </h3>
              <div className="my-auto">
                <p className="text-xs">{makeTimestamp(backup.name)}</p>
                <p className="text-xs text-right fotn-bold">
                  {utils.formatBytes(backup.size)}
                </p>
              </div>
            </li>
          ))}
      </SlideIn>
    );
  };

  const DEFAULT = !loading && !error && !shutdown;
  const RESYNCING = loading && !error && !shutdown;
  const ERROR = !loading && error && !shutdown;
  const SUCCESS = !loading && !error && shutdown;

  return (
    <SlideIn isOpen={true} delay={0}>
      <h3 className="text-xl mb-2 font-bold">Import a Backup</h3>
      <p>
      Importing a backup will restore the node to its locked or unlocked state when the backup was taken. QuickSync will ensure your coins are restored and the chain is synced to the latest block (optional but recommended)
      </p>
      <p className="text-center text-violet-300 mt-3">Step {step}/3</p>
      <div className="grid grid-cols-[auto_16px_auto_16px_auto] my-3 text-center items-center">
        <p
          onClick={() => (!RESYNCING && step === 2 ? setStep(1) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 1 && "opacity-100 text-yellow-300 font-bold"
          } ${step > 1 && "opacity-100 text-violet-300 font-bold"}`}
        >
          Back up
        </p>
        <span className={`${step > 1 && "text-violet-300 opacity-50"}`}>
          <RightArrow />
        </span>
        <p
          onClick={() => (!RESYNCING && step === 3 ? setStep(2) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 2 && "opacity-100 text-yellow-300"
          } ${step > 2 && "opacity-100 text-violet-300 font-bold"}`}
        >
          Password
        </p>
        <span className={`${step > 2 && "text-violet-300 opacity-50"}`}>
          <RightArrow />
        </span>
        <p
          className={`text-xs opacity-50 cursor-pointer ${
            step === 3 && "opacity-100 text-yellow-300"
          } ${step > 3 && "opacity-100 text-violet-300 font-bold"}`}
        >
          QuickSync
        </p>
      </div>
      <Formik
        // validateOnMount
        initialValues={{
          ip: "",
          file: "",
          password: "",
        }}
        validationSchema={yup.object().shape({
          ip: yup
            .string()
            .matches(
              /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/,
              "Invalid IP:Port format"
            )
            // .required("IP:Port is required")
            .trim(),
          file: yup.string().required("Backup required").min(1).trim(),
        })}
        onSubmit={async ({ ip, file, password }) => {
          setLoading(true);
          setError(false);

          try {
            const fullPath = await fileManager.getPath(file);
            await new Promise((resolve, reject) => {
              (window as any).MDS.cmd(
                `megammrsync action:resync ${ip.length && `host:${ip.trim()}`} file:"${fullPath}" ${
                  password.length > 0 && "password:" + password
                }`,
                (resp) => {
                  if (!resp.status)
                    reject(
                      resp.error
                        ? resp.error
                        : `Mega node re-sync failed with host:${ip}`
                    );

                  resolve(resp);
                }
              );
            });

            setShutdown(true);
            setLoading(false);
          } catch (error) {
            setLoading(false);

            if (typeof error === "string") {
              return setError(
                error.includes("Incorrect Password!")
                  ? "Incorrect password!"
                  : error
              );
            }
            if (error instanceof Error) {
              return setError(error.message);
            }

            setError("Backup re-sync failed, please try again.");
          }
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          submitForm,
          errors,
          values,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className={`my-3 core-black-contrast-2 p-4 rounded ${
              f && "outline outline-none"
            }`}
          >
            {step === 1 && (
              <div>
                <label className="text-sm mb-3">
                  Select a backup to restore
                </label>

                <div className="grid grid-rows-[16px_1fr]">
                  <div />
                  {values.file.length === 0 && (
                    <MinimaFileUploader
                      renderData={renderBackups}
                      internalDataName="backups"
                      internalListStyle="my-3"
                      internalSearch={
                        <div className="px-3">
                          <input
                            value={searchText}
                            onChange={handleSearchEvent}
                            placeholder="Search by date/time"
                            className="w-full rounded px-3 mt-3 !text-black focus:!outline focus:outline-violet-300 py-2"
                          />
                        </div>
                      }
                      externalAcceptFileType=".bak"
                    />
                  )}

                  {values.file.length > 0 && (
                    <div>
                      <div className="grid grid-rows-2 bg-[#1B1B1B] px-3 my-2 rounded py-2">
                        <p className="text-violet-300">Selected file</p>
                        <p className="text-sm break-all">{values.file}</p>
                      </div>
                      <button
                        onClick={() => setFieldValue("file", "")}
                        type="button"
                        className="!p-2 bg-black focus:outline focus:outline-violet-300 text-white hover:!cursor-pointer w-full font-bold mb-2"
                      >
                        Use another file
                      </button>

                      <button
                        disabled={!!errors.file}
                        onClick={() => setStep(2)}
                        type="button"
                        className="bg-white focus:outline focus:outline-violet-300 text-black hover:bg-opacity-80 w-full font-bold disabled:opacity-10"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className=" grid grid-rows-[auto_1fr]">
                <label className="text-sm mb-3">
                  Enter the IP:Port of a Mega node to QuickSync from
                </label>

                <input
                  id="ip"
                  name="ip"
                  onChange={handleChange}
                  value={values.ip}
                  onFocus={() => setF(true)}
                  onBlur={(e) => {
                    handleBlur(e);
                    setF(false);
                  }}
                  placeholder="e.g. 34.32.59.133:9001"
                  className={`truncate focus:!outline-violet-300 px-4 py-3 core-black-contrast ${
                    errors.ip && "!outline !outline-[#FF627E]"
                  }`}
                />
                {errors.ip && (
                  <span className="mt-3 text-[#FF627E]">{errors.ip}</span>
                )}

                <button                  
                  onClick={() => setConfirm(true)}
                  disabled={!!errors.ip}
                  type="button"
                  className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className=" grid grid-rows-[auto_1fr]">
                <label className="text-sm mb-3">
                  Enter your backup password{" "}
                  <span className="text-xs">(if applicable)</span>
                </label>

                <div
                  className={`w-full bg-[#1B1B1B] grid grid-cols-[1fr_auto] ${
                    errors.password && "!outline !outline-[#FF627E]"
                  } ${f && "outline outline-violet-300"} rounded`}
                >
                  <input
                    id="password"
                    name="password"
                    type={hidePassword ? "password" : "text"}
                    onChange={handleChange}
                    value={values.password}
                    onFocus={() => setF(true)}
                    onBlur={(e) => {
                      handleBlur(e);
                      setF(false);
                    }}
                    placeholder="Enter password"
                    className={`truncate focus:outline-none px-4 py-3 core-black-contrast `}
                  />
                  <div
                    className="my-auto px-3"
                    onClick={() => setHidePassword((prevState) => !prevState)}
                  >
                    <TogglePasswordIcon toggle={!hidePassword} />
                  </div>
                </div>
                {errors.password && (
                  <span className="mt-3 text-[#FF627E]">{errors.password}</span>
                )}

                <p className="my-2">
                  Keep the field empty if you haven't set any.
                </p>

                <button   
                  onClick={() => setStep(3)}               
                  disabled={!!errors.password}
                  type="button"
                  className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
                >
                  Next
                </button>
              </div>
            )}

            <AnimatedDialog
              isOpen={confirm}
              onClose={() => null}
              position="items-start mt-20"
              extraClass="max-w-sm mx-auto"
              dialogStyles="h-[400px] rounded-lg !shadow-violet-800 !shadow-sm overflow-hidden bg-black"
            >
              <div className="h-full">
                <div className="flex justify-between items-center pr-4">
                  <div className="grid grid-cols-[auto_1fr] ml-2">
                    <h3 className="my-auto font-bold ml-2">Import backup</h3>
                  </div>
                </div>

                <div className="px-4 h-full flex flex-col justify-between">
                  {DEFAULT && (
                    <p className="text-sm my-3">
                      {!values.ip.length && "This will restore the backup and attempt to sync to the latest block. If not using QuickSync and the backup is old or was taken when out of sync with the chain, it may not be possible to sync to the latest block. Continue?"}
                      {!!values.ip.length && "This will restore the backup and attempt to re-sync the chain to the latest block using the QuickSync host provided.” Continue?"}                      
                    </p>
                  )}
                  {SUCCESS && (
                    <p>
                      Re-sync completed. Please close this screen and re-login
                      to the Minihub.
                    </p>
                  )}
                  {ERROR && <p>{error.replace("Archive", "")}</p>}
                  {RESYNCING && (
                    <div>
                      <p className="animate-pulse">Re-syncing...</p>

                      <DialogLogs />
                    </div>
                  )}

                  <div className="flex justify-end mb-4">
                    <div></div>
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                      {!SUCCESS && !RESYNCING && (
                        <button
                          disabled={isSubmitting}
                          className="disabled:bg-opacity-10 bg-gray-600 !py-2  font-bold tracking-tighter"
                          type="button"
                          onClick={() => setConfirm(false)}
                        >
                          Dismiss
                        </button>
                      )}
                      <button
                        disabled={isSubmitting}
                        onClick={() => {
                          if (!SUCCESS) {
                            return submitForm();
                          }

                          if (
                            window.navigator.userAgent.includes(
                              "Minima Browser"
                            )
                          ) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            return Android.shutdownMinima();
                          }

                          return window.close();
                        }}
                        type="button"
                        className="disabled:bg-opacity-50 font-bold !py-2 text-black bg-violet-300"
                      >
                        {DEFAULT && "Okay"}
                        {ERROR && "Re-try"}
                        {SUCCESS && "Close"}
                        {RESYNCING && "Re-syncing"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedDialog>
          </form>
        )}
      </Formik>
    </SlideIn>
  );
};

export default FromBackup;
