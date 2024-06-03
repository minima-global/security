import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import AnimatedDialog from "../../../UI/AnimatedDialog";
import RightArrow from "../../../Icons/RightArrow";
import bip39 from "../../../../utils/bip39";
import EnterSeedPhrase from "./EnterSeedPhrase";
import DialogLogs from "../DialogLogs";
import SlideIn from "../../../UI/Animations/SlideIn";

const FromSeedPhrase = () => {
  const [f, setF] = useState(false);
  const [step, setStep] = useState(1);

  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [shutdown, setShutdown] = useState(false);

  // if (_currentRestoreWindow !== "fromseedphrase") {
  //   return null;
  // }

  const DEFAULT = !loading && !error && !shutdown;
  const RESYNCING = loading && !error && !shutdown;
  const ERROR = !loading && error && !shutdown;
  const SUCCESS = !loading && !error && shutdown;

  return (
    <SlideIn isOpen={true} delay={0}>
      <h3 className="text-xl mb-2 font-bold">Import Seed Phrase with QuickSync</h3>
      <p>
      Importing your seed phrase with QuickSync will wipe this node, restore your coins using the seed phrase provided and re-sync the chain to the latest block using the QuickSync host provided.
      </p>
      <p className="text-center text-violet-300 mt-3">Step {step}/4</p>
      <div className="grid grid-cols-[auto_16px_auto_16px_auto_16px_auto] my-3 text-center items-center">
        <p
          onClick={() => (!RESYNCING && step === 2 ? setStep(1) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 1 && "opacity-100 text-yellow-300 font-bold"
          } ${step > 1 && "opacity-100 text-violet-300 font-bold"}`}
        >
          QuickSync
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
          Seed Phrase
        </p>
        <span className={`${step > 2 && "text-violet-300 opacity-50"}`}>
          <RightArrow />
        </span>
        <p
          onClick={() => (!RESYNCING && step === 4 ? setStep(3) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 3 && "opacity-100 text-yellow-300"
          } ${step > 2 && "opacity-100 text-violet-300 font-bold"}`}
        >
          Keys
        </p>
        <span className={`${step > 3 && "text-violet-300 opacity-50"}`}>
          <RightArrow />
        </span>
        <p
          //   onClick={() => (!RESYNCING ? setStep(3) : null)}
          className={`text-xs opacity-50 cursor-pointer ${
            step === 4 && "opacity-100 text-yellow-300"
          } ${step > 3 && "opacity-100 text-violet-300 font-bold"}`}
        >
          Key Uses
        </p>
      </div>
      <Formik
        validateOnMount
        initialValues={{
          ip: "",
          keys: 64,
          keyuses: 1000,
          seedPhrase: Array.from({ length: 24 }, (_, i) => ({
            [i + 1]: "".toUpperCase(),
          })).reduce((acc, cur) => Object.assign(acc, cur), {}),
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
          seedPhrase: yup.object({
            "1": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "2": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "3": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "4": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "5": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "6": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "7": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "8": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "9": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "10": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "11": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "12": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "13": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "14": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "15": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "16": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "17": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "18": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "19": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "20": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "21": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "22": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "23": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
            "24": yup
              .string()
              .uppercase()
              .oneOf(bip39, "Invalid word.")
              .required("Looks like you missed a word"),
          }),
          keys: yup.number().required("This field is required"),
          keyuses: yup.number().required("This field is required"),
        })}
        onSubmit={async ({ ip, seedPhrase, keys, keyuses }) => {
          setLoading(true);
          setError(false);

          try {
            // do your thing
            const phraseAsString = Object.values(seedPhrase)
              .toString()
              .replaceAll(",", " ");
            await new Promise((resolve, reject) => {
              (window as any).MDS.cmd(
                `megammrsync action:resync host:${ip.trim()} phrase:"${phraseAsString}" keys:${keys} keyuses:${keyuses}`,
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
            {step === 1 && (
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
                  onClick={() => setStep(2)}
                  disabled={!!errors.ip}
                  type="button"
                  className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <EnterSeedPhrase
                  formNext={() => setStep((prevState) => prevState + 1)}
                  formPrev={() => setStep((prevState) => prevState - 1)}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <div className=" grid grid-rows-[auto_1fr]">
                  <label className="text-sm mb-3">
                    Enter the number of keys (addresses) to create (default is
                    64)
                  </label>

                  <input
                    id="keys"
                    name="keys"
                    onChange={handleChange}
                    value={values.keys}
                    onFocus={() => setF(true)}
                    onBlur={(e) => {
                      handleBlur(e);
                      setF(false);
                    }}
                    placeholder="Number of keys (addresses)"
                    className={`truncate focus:!outline-violet-300 px-4 py-3 core-black-contrast ${
                      errors.ip && "!outline !outline-[#FF627E]"
                    }`}
                    type="number"
                  />
                  {errors.keys && (
                    <span className="mt-3 text-[#FF627E]">{errors.keys}</span>
                  )}

                  <p className="my-2">
                    All Minima nodes are started with 64 addresses by default.
                    If you created more, you can set the number of addresses to
                    create manually here. Note that in future you should always
                    create at least this many addresses to ensure all your coins
                    are recovered.
                  </p>

                  <button
                    onClick={() => setStep(4)}
                    disabled={!!errors.keys}
                    type="button"
                    className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <div className=" grid grid-rows-[auto_1fr]">
                  <label className="text-sm mb-3">
                    Enter the number of key uses
                  </label>

                  <input
                    id="keyuses"
                    name="keyuses"
                    onChange={handleChange}
                    value={values.keyuses}
                    onFocus={() => setF(true)}
                    onBlur={(e) => {
                      handleBlur(e);
                      setF(false);
                    }}
                    placeholder="Number of signatures"
                    className={`truncate focus:!outline-violet-300 px-4 py-3 core-black-contrast ${
                      errors.ip && "!outline !outline-[#FF627E]"
                    }`}
                    type="number"
                  />
                  {errors.keyuses && (
                    <span className="mt-3 text-[#FF627E]">
                      {errors.keyuses}
                    </span>
                  )}

                  <p className="my-2">
                  Enter the maximum times you have signed a transaction or leave the default if you think you haven't signed over 1000 transactions.
                  </p>

                  <button
                    onClick={() => setConfirm(true)}
                    disabled={!!errors.keyuses}
                    type="button"
                    className="bg-white text-black w-full mt-4 font-bold hover:bg-opacity-80 disabled:opacity-10"
                  >
                    Next
                  </button>
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
                      Re-sync complete. Please close this screen and re-login
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

export default FromSeedPhrase;
