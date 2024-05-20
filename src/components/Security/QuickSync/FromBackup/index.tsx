import { useContext, useState } from "react";
import { appContext } from "../../../../AppContext";
import { Formik } from "formik";
import * as yup from "yup";
import AnimatedDialog from "../../../UI/AnimatedDialog";
import RightArrow from "../../../Icons/RightArrow";
import MinimaFileUploader from "../../MinimaFileUploader";
import { format } from "date-fns";
import * as utils from "../../../../utils";

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
  const { _currentRestoreWindow, backups } = useContext(appContext);
  const [f, setF] = useState(false);
  const [step, setStep] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [shutdown, setShutdown] = useState(false);

  if (_currentRestoreWindow !== "frombackup") {
    return null;
  }

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
      <>
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
      </>
    );
  };

  const DEFAULT = !loading && !error && !shutdown;
  const RESYNCING = loading && !error && !shutdown;
  const ERROR = !loading && error && !shutdown;
  const SUCCESS = !loading && !error && shutdown;

  return (
    <div>
      <h3 className="text-xl mb-2 font-bold">From Backup</h3>
      <p>
        Restoring a backup will restore the node to its locked or unlocked state
        when the backup was taken. Restore the backup with QuickSync to ensure
        all your coins are restored and the chain is synced to the latest block.
      </p>
      <p className="text-center text-teal-300 mt-3">Step {step}/2</p>
      <div className="grid grid-cols-[auto_16px_auto] my-3 text-center items-center">
        <p
          onClick={() => (!RESYNCING && step === 2 ? setStep(1) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 1 && "opacity-100 text-yellow-300 font-bold"
          } ${step > 1 && "opacity-100 text-teal-300 font-bold"}`}
        >
          Back up
        </p>
        <span className={`${step > 1 && "text-teal-300 opacity-50"}`}>
          <RightArrow />
        </span>
        <p
          onClick={() => (!RESYNCING && step === 3 ? setStep(2) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 2 && "opacity-100 text-yellow-300"
          } ${step > 2 && "opacity-100 text-teal-300 font-bold"}`}
        >
          Host
        </p>
      </div>
      <Formik
        validateOnMount
        initialValues={{
          ip: "",
        }}
        validationSchema={yup.object().shape({
          ip: yup
            .string()
            .matches(
              /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/,
              "Invalid IP:Port format"
            )
            .required("IP:Port is required")
            .trim(),
        })}
        onSubmit={async ({ ip }) => {
          setLoading(true);
          setError(false);

          try {
            await new Promise((resolve, reject) => {
              (window as any).MDS.cmd(
                `megammrsync action:resync host:${ip.trim()}`,
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
            }).catch((error) => {
              throw error;
            });

            setShutdown(true);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            if (error instanceof Error) {
              return setError(error.message);
            }

            setError("Seed phrase re-sync failed, please try again.");
          }
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          errors,
          values,
          submitForm,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className={`my-3 core-black-contrast-2 p-4 rounded ${
              f && "outline outline-none"
            }`}
          >
            {JSON.stringify(values)}
            {step === 2 && (
              <div className=" grid grid-rows-[auto_1fr]">
                <label className="text-sm mb-3">
                  Enter the IP:Port of a Mega node to restore from
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
                  placeholder="e.g. xxx.xxx.xxx.xxx:9001"
                  className={`truncate focus:!outline-violet-300 px-4 py-3 core-black-contrast ${
                    errors.ip && "!outline !outline-[#FF627E]"
                  }`}
                />
                {errors.ip && (
                  <span className="mt-3 text-[#FF627E]">{errors.ip}</span>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!!errors.ip}
                  type="button"
                  className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
                >
                  Next
                </button>
              </div>
            )}

            {step === 1 && (
              <div>
                <label className="text-sm mb-3">
                  Select a backup to restore
                </label>

                <div className="grid grid-rows-[2px_1fr] my-4 gap-2">
                  <div />
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
                </div>
              </div>
            )}

            <AnimatedDialog
              isOpen={confirm}
              onClose={() => null}
              position="items-start mt-20"
              extraClass="max-w-sm mx-auto"
              dialogStyles="h-[400px] rounded-lg !shadow-teal-800 !shadow-sm overflow-hidden bg-black"
            >
              <div className="h-full">
                <div className="flex justify-between items-center pr-4">
                  <div className="grid grid-cols-[auto_1fr] ml-2">
                    <h3 className="my-auto font-bold ml-2">
                      Seed Phrase Restore
                    </h3>
                  </div>
                </div>

                <div className="px-4 h-full flex flex-col justify-between">
                  {DEFAULT && (
                    <p className="text-sm my-3">
                      Are you sure you wish to wipe and restore this node to the
                      seed phrase provided? Your coins will be restored and the
                      node will re-sync to the latest block.
                    </p>
                  )}
                  {SUCCESS && (
                    <p>
                      Re-sync completed. Please close this screen and re-login
                      to the Minihub.
                    </p>
                  )}
                  {ERROR && <p>{error}</p>}
                  {RESYNCING && (
                    <div>
                      <p className="animate-pulse">Re-syncing...</p>
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
                        className="disabled:bg-opacity-50 font-bold !py-2 text-black bg-teal-300"
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
    </div>
  );
};

export default FromBackup;
