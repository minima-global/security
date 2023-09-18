import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Formik } from "formik";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import { appContext } from "../../../AppContext";

import Button from "../../UI/Button";
import BackButton from "../../UI/BackButton";
import SharedDialog from "../../SharedDialog";
import FileChooser from "../../UI/FileChooser";
import Input from "../../UI/Input";
import Tooltip from "../../UI/Tooltip";
import TogglePasswordIcon from "../../UI/TogglePasswordIcon/TogglePasswordIcon";
import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";

import * as utils from "../../../utils";
import * as rpc from "../../../__minima__/libs/RPC";
import * as fM from "../../../__minima__/libs/fileManager";

import Logs from "../../Logs";
import List from "../../UI/List";

const RestoreFromBackup = () => {
  const {
    setBackButton,
    displayBackButton: displayHeaderBackButton,
    backups,
    getBackups,
    shuttingDown,
  } = useContext(appContext);
  const location = useLocation();
  const [tooltip, setTooltip] = useState({ host: false });
  const [hidePassword, togglePasswordVisibility] = useState(false);
  const [MDSShutdown, setMDSShutdown] = useState(false);

  const [beginRestoring, setBeginRestoring] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [step, setStep] = useState<false | number>(false);

  const [resetFileField, setResetFileField] = useState(0);

  useEffect(() => {
    if (shuttingDown) {
      setMDSShutdown(true);
    }
  }, [shuttingDown]);

  useEffect(() => {
    setBackButton({ display: true, to: -1, title: "Back" });
  }, [location]);

  return (
    <>
      {step &&
        step === 1 &&
        createPortal(
          <SharedDialog
            main={
              <div className="flex flex-col items-center">
                <img
                  className="mb-4"
                  alt="informative"
                  src="./assets/error.svg"
                />{" "}
                <h1 className="text-2xl mb-8">Please note</h1>
                <p className="mb-6 text-center">
                  Restoring a backup is irreversible. <br /> Consider taking a
                  backup of this node before restoring
                </p>
              </div>
            }
            primary={
              <Button
                onClick={() => {
                  setStep(2);
                }}
              >
                Continue
              </Button>
            }
            secondary={
              <Button
                variant="tertiary"
                onClick={() => setStep(false)}
                extraClass="mt-4"
              >
                Cancel
              </Button>
            }
          />,
          document.body
        )}

      {step &&
        step === 2 &&
        createPortal(
          <SharedDialog
            main={
              <div className="flex flex-col items-center">
                <img
                  className="mb-4"
                  alt="informative"
                  src="./assets/error.svg"
                />{" "}
                <h1 className="text-2xl mb-8">Restore from backup</h1>
                <p className="mb-6 text-center">
                  Select a backup stored internally within the app or upload a
                  new backup from an external location.
                </p>
              </div>
            }
            primary={
              <>
                <Button
                  extraClass="mb-2"
                  onClick={() => {
                    setStep(3);
                    getBackups();
                  }}
                >
                  Select an internal backup
                </Button>
                <Button
                  onClick={() => {
                    setStep(4);
                  }}
                >
                  Upload an external backup
                </Button>
              </>
            }
            secondary={
              <Button
                variant="tertiary"
                onClick={() => setStep(step - 1)}
                extraClass="mt-4"
              >
                Cancel
              </Button>
            }
          />,
          document.body
        )}

      {step &&
        step === 3 &&
        createPortal(
          <SharedDialog
            bg="primary"
            main={
              <>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    host: "",
                    password: "",
                    file: undefined,
                  }}
                  onSubmit={async (formData) => {
                    setBeginRestoring(true);

                    try {
                      await rpc
                        .restoreFromBackup(
                          formData.host,
                          formData.file!,
                          formData.password
                        )
                        .catch((error) => {
                          throw error;
                        });
                    } catch (error) {
                      setError(error as string);
                    }
                  }}
                >
                  {({
                    handleSubmit,
                    setFieldValue,
                    errors,
                    touched,
                    values,
                    handleBlur,
                    handleChange,
                    isValid,
                    isSubmitting,
                  }) => (
                    <>
                      {!beginRestoring && (
                        <form
                          autoComplete="off"
                          className="flex flex-col gap-4"
                          onSubmit={handleSubmit}
                        >
                          <h1 className="text-2xl mb-4 text-center">
                            Restore from backup
                          </h1>
                          <p className="mb-12 text-center">
                            Once restored, the node will attempt to <br /> sync
                            to the latest block, please be patient.
                          </p>
                          <List
                            options={backups}
                            setForm={async (option) => {
                              if (option.length) {
                                const fullPath = await fM.getPath(
                                  "/backups/" + option
                                );

                                setFieldValue("file", fullPath);
                              }
                            }}
                          />

                          <Input
                            disabled={isSubmitting}
                            error={errors.password ? errors.password : false}
                            autoComplete="new-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter password"
                            handleEndIconClick={() =>
                              togglePasswordVisibility(
                                (prevState) => !prevState
                              )
                            }
                            type={!hidePassword ? "password" : "text"}
                            id="password"
                            name="password"
                            value={values.password}
                            endIcon={
                              <TogglePasswordIcon toggle={hidePassword} />
                            }
                          />

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
                              extraClass="!mb-0 !mt-0"
                              onClick={() =>
                                setTooltip({ ...tooltip, host: false })
                              }
                              content=" ip:port of the archive node to sync from. Use 'auto' to connect to a default archive node."
                              position={148}
                            />
                          )}
                          <div>
                            <Input
                              disabled={isSubmitting}
                              id="host"
                              name="host"
                              placeholder="host (optional)"
                              type="text"
                              value={values.host}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="off"
                              error={
                                touched.host && errors.host
                                  ? errors.host
                                  : false
                              }
                            />
                          </div>
                          <Button
                            disabled={!isValid || isSubmitting || !values.file}
                            type="submit"
                          >
                            Restore
                          </Button>
                        </form>
                      )}
                    </>
                  )}
                </Formik>
                {error && (
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
                        {error.includes("GZIP")
                          ? "Invalid password."
                          : error.includes("connectdata")
                          ? "Host is invalid."
                          : error.includes("Incorrect Password!")
                          ? "Incorrect password!"
                          : error}
                      </p>
                    )}
                    {typeof error === "object" && (
                      <p className="mb-8 text-center text-error truncate whitespace-normal break-all">
                        {JSON.stringify(error)}
                      </p>
                    )}
                  </div>
                )}

                {!!beginRestoring && !error && (
                  <div className="flex flex-col align-center">
                    <Lottie
                      className="mb-4 inline"
                      width={4}
                      height={4}
                      style={{ maxWidth: 80, alignSelf: "center" }}
                      animationData={Loading}
                    />
                    <h1 className="text-2xl mb-8 text-center">Restoring</h1>

                    <p className="mb-8 text-center">
                      Please don’t leave this screen whilst the chain is
                      re-syncing.
                      <br /> <br />
                      Your node will shutdown once it is complete.
                    </p>

                    <Logs />
                  </div>
                )}
              </>
            }
            primary={null}
            secondary={
              <>
                {!beginRestoring && (
                  <Button
                    variant="tertiary"
                    extraClass="mt-4"
                    onClick={() => setStep(2)}
                  >
                    Cancel
                  </Button>
                )}

                {error && (
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      setError(false);
                      setBeginRestoring(false);
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

      {step &&
        step === 4 &&
        createPortal(
          <SharedDialog
            bg="primary"
            main={
              <>
                {!beginRestoring && (
                  <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                      host: "",
                      password: "",
                      file: undefined,
                    }}
                    onSubmit={async (formData) => {
                      setBeginRestoring(true);

                      try {
                        const arrayBuffer = await utils.blobToArrayBuffer(
                          formData.file
                        );
                        const hex = utils.bufferToHex(arrayBuffer);
                        await fM.saveFileAsBinary(
                          "/backups/" + (formData.file as any).name,
                          hex
                        );
                        const fullPath = await fM.getPath(
                          "/backups/" + (formData.file as any).name
                        );

                        await rpc
                          .restoreFromBackup(
                            formData.host,
                            fullPath,
                            formData.password
                          )
                          .catch((error) => {
                            throw error;
                          });
                      } catch (error) {
                        setError(error as string);
                      }
                    }}
                  >
                    {({
                      handleSubmit,
                      setFieldValue,
                      errors,
                      touched,
                      values,
                      handleBlur,
                      handleChange,
                      isValid,
                      isSubmitting,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <h1 className="text-2xl mb-4 text-center">
                          Restore from backup
                        </h1>
                        <p className="mb-12 text-center">
                          Once restored, the node will attempt to <br /> sync to
                          the latest block, please be patient.
                        </p>
                        <FileChooser
                          disabled={isSubmitting}
                          keyValue={resetFileField}
                          handleEndIconClick={() => {
                            setResetFileField((prev) => prev + 1);
                            setFieldValue("file", undefined);
                          }}
                          error={
                            errors.file && errors.file ? errors.file : false
                          }
                          extraClass="core-grey-20"
                          accept=".bak"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (e.target.files) {
                              setFieldValue("file", e.target.files[0]);
                            }
                          }}
                          onBlur={handleBlur}
                          placeholder="Select file"
                          type="file"
                          id="file"
                          name="file"
                          endIcon={
                            values.file && (
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

                        <Input
                          disabled={isSubmitting}
                          mb="mb-4"
                          mt="mt-4"
                          error={errors.password ? errors.password : false}
                          autoComplete="new-password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter password"
                          handleEndIconClick={() =>
                            togglePasswordVisibility((prevState) => !prevState)
                          }
                          type={!hidePassword ? "password" : "text"}
                          id="password"
                          name="password"
                          value={values.password}
                          endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                        />
                        <>
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

                          {!!tooltip.host && (
                            <Tooltip
                              extraClass="!mt-0 mb-2"
                              onClick={() =>
                                setTooltip({ ...tooltip, host: false })
                              }
                              content=" ip:port of the archive node to sync from."
                              position={148}
                            />
                          )}
                          <div>
                            <Input
                              disabled={isSubmitting}
                              mb="mb-4"
                              id="host"
                              name="host"
                              placeholder="host (optional)"
                              type="text"
                              value={values.host}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="off"
                              error={
                                touched.host && errors.host
                                  ? errors.host
                                  : false
                              }
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                          >
                            Restore
                          </Button>
                        </>
                      </form>
                    )}
                  </Formik>
                )}
                {error && (
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
                        {error.includes("GZIP")
                          ? "Invalid password."
                          : error.includes("connectdata")
                          ? "Host is invalid."
                          : error.includes("Incorrect Password!")
                          ? "Incorrect password!"
                          : error}
                      </p>
                    )}
                    {typeof error === "object" && (
                      <p className="mb-8 text-center text-error truncate whitespace-normal break-all">
                        {JSON.stringify(error)}
                      </p>
                    )}
                  </div>
                )}

                {!!beginRestoring && !error && (
                  <div className="flex flex-col align-center">
                    <Lottie
                      className="mb-4 inline"
                      width={4}
                      height={4}
                      style={{ maxWidth: 80, alignSelf: "center" }}
                      animationData={Loading}
                    />
                    <h1 className="text-2xl mb-8 text-center">Restoring</h1>

                    <p className="mb-8 text-center">
                      Please don’t leave this screen whilst the chain is
                      re-syncing.
                      <br /> <br />
                      Your node will shutdown once it is complete.
                    </p>

                    <Logs />
                  </div>
                )}
              </>
            }
            primary={null}
            secondary={
              <>
                {!beginRestoring && (
                  <Button
                    variant="tertiary"
                    extraClass="mt-4"
                    onClick={() => setStep(2)}
                  >
                    Cancel
                  </Button>
                )}
                {error && (
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      setError(false);
                      setBeginRestoring(false);
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

      <div className="flex flex-col h-full bg-black px-4 pb-4">
        <div className="flex flex-col h-full">
          {!displayHeaderBackButton && <BackButton to={-1} title="Back" />}
          <div className="mt-6 text-2xl mb-8 text-left">
            Restore from backup
          </div>
          <div className="flex flex-col gap-5">
            <div className="core-black-contrast-2 p-4 rounded">
              <div className="mb-6 text-left">
                Restoring a backup will wipe this node and import the private
                keys, coin proofs and chain state provided in the backup. <br />{" "}
                <br /> Once restored, the node will attempt to sync to the
                latest block, please be patient.
              </div>
              <Button onClick={() => setStep(1)}>Restore</Button>
            </div>
            <div className="text-left">
              <p className="text-sm password-label mr-4 ml-4">
                Once the syncing process has finished, the node will shutdown.
                Restart the node for the restore to take effect.
              </p>
            </div>
          </div>
        </div>
      </div>

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
                  Restore complete
                </h1>
                <p className="font-medium mb-6 mt-6 text-center">
                  Your node was successfully restored and will shutdown. Restart
                  Minima for the restore to take effect.
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
    </>
  );
};

export default RestoreFromBackup;

const validationSchema = yup.object().shape({
  host: yup.string(),
  file: yup
    .mixed()
    .required("Please select a (.bak) file")
    .test("Test extension", function (val: any) {
      const { path, createError } = this;
      const re = /(?:\.([^.]+))?$/;

      if (val === undefined || val === null || val.length === 0) {
        return createError({
          path: "file",
          message: "Please select a valid (.bak) file",
        });
      }

      if (val && val.name && typeof val.name === "string") {
        const extension = re.exec(val.name);

        if (
          extension &&
          typeof extension[1] === "string" &&
          extension[1] !== "bak"
        ) {
          return createError({
            path,
            message: "Please select a valid file extension type.",
          });
        }
      }

      return true;
    }),
  password: yup.string(),
});
