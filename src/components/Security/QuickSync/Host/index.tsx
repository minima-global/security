import { useContext, useState } from "react";
import { appContext } from "../../../../AppContext";
import { Formik } from "formik";
import * as yup from "yup";
import AnimatedDialog from "../../../UI/AnimatedDialog";

const Host = () => {
  const { _currentRestoreWindow } = useContext(appContext);
  const [f, setF] = useState(false);

  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [shutdown, setShutdown] = useState(false);

  if (_currentRestoreWindow !== "host") {
    return null;
  }

  const DEFAULT = !loading && !error && !shutdown;
  const RESYNCING = loading && !error && !shutdown;
  const ERROR = !loading && error && !shutdown;
  const SUCCESS = !loading && !error && shutdown;

  return (
    <div>
      <h3 className="text-xl mb-2 font-bold">Host</h3>
      <p>
        QuickSync will restore the coins for this node and re-sync the chain to
        the latest block.
      </p>
      <Formik
        validateOnMount
        initialValues={{ ip: "" }}
        validationSchema={yup.object().shape({
          ip: yup
            .string()
            .matches(
              /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/,
              "Invalid IP:Port format"
            )
            .required("IP:Port is required").trim(),
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

            setError("Host re-sync failed, please try again.");
          }
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          errors,
          values,
          isValid,
          submitForm,
          isSubmitting
        }) => (
          <form
            onSubmit={handleSubmit}
            className={`my-3 core-black-contrast-2 p-4 rounded ${
              f && "outline outline-[#1B1B1B]"
            }`}
          >
            <div className=" grid grid-rows-[auto_1fr]">
              <label className="text-sm mb-3">
                Enter the IP:Port of a mega node to restore from
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
                className={`truncate !focus:outline-none px-4 py-3 core-black-contrast ${
                  errors.ip && "!outline !outline-[#FF627E]"
                }`}
              />
              {errors.ip && (
                <span className="mt-3 text-[#FF627E]">{errors.ip}</span>
              )}
            </div>
            <button
              onClick={() => setConfirm(true)}
              type="button"
              disabled={!isValid}
              className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
            >
              Restore
            </button>

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
                    <h3 className="my-auto font-bold ml-2">Host Resync</h3>
                  </div>
                </div>

                <div className="px-4 h-full flex flex-col justify-between">
                  {DEFAULT && (
                    <p className="text-sm my-3">
                      Are you sure you wish to restore the coins for this node
                      and re-sync to the latest block?
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
                      {!SUCCESS && (
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

export default Host;
