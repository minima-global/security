import { useNavigate } from "react-router-dom";
import styles from "./Dialog.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import * as utils from "../../utils";
import * as fM from "../../__minima__/libs/fileManager";
import * as rpc from "../../__minima__/libs/RPC";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../AppContext";
import FileChooser from "../UI/FileChooser";

import { CSSTransition } from "react-transition-group";
import Tooltip from "../UI/Tooltip";
import List from "../UI/List";
import PERMISSIONS from "../../permissions";
import { useAuth } from "../../providers/authProvider";
import FadeIn from "../UI/Animations/FadeIn";
import Lottie from "lottie-react";

import { useArchiveContext } from "../../providers/archiveProvider";
import CommonDialogLayout from "../UI/CommonDialogLayout";

import Loading from "../../assets/loading.json";
import Logs from "../Logs";
import TogglePasswordIcon from "../UI/TogglePasswordIcon/TogglePasswordIcon";

const validationSchema = yup.object().shape({
  host: yup.string().test("test-host", function (val) {
    const { createError, path } = this;
    if (val === undefined) {
      return true;
    }

    const regexp = new RegExp(
      /([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}):?([0-9]{1,5})?/
    );
    if (!regexp.test(val)) {
      return createError({
        path,
        message: "Please enter a valid archive host node",
      });
    }

    return true;
  }),
  file: yup
    .mixed()
    .required("Please select a (.bak) file")
    .test("Test extension", function (val: any) {
      const { path, createError } = this;
      const re = /(?:\.([^.]+))?$/;

      if (val === undefined || val === null) {
        return false;
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

const RestoreDialog = () => {
  const navigate = useNavigate();
  const [hidePassword, togglePasswordVisibility] = useState(true);
  const { authNavigate } = useAuth();

  const [resetFileField, setResetFileField] = useState<number>(0);

  const { setModal, backups, getBackups, shuttingDown } =
    useContext(appContext);
  const [mode, setMode] = useState<"files" | "backups" | false>(false);
  const [tooltip, setTooltip] = useState({ host: false });

  const {
    userWantsToArchiveReset,
    archivePathToResetWith,
    resetArchiveContext,
  } = useArchiveContext();

  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    getBackups();
  }, [navigate]);

  useEffect(() => {
    if (shuttingDown) {
      setModal({
        content: (
          <div>
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

            <h1 className="text-2xl mb-4 font-semibold">Restore complete</h1>
            <p className="font-medium mb-6 mt-6">
              Your node was successfully restored and will shutdown. Restart
              Minima for the restore to take effect.
            </p>
          </div>
        ),
        primaryActions: <div />,
        secondaryActions: (
          <Button
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
        ),
      });
      authNavigate("/dashboard/modal", PERMISSIONS["CAN_VIEW_MODAL"]);
    }
  }, [shuttingDown]);

  const handleSelectedBackupFromList = async (mdsFilename: string) => {
    const fullPath = await fM.getPath("/backups/" + mdsFilename);
    formik.setFieldValue("file", fullPath);
  };

  const SomethingWentWrong = (error: string) => {
    return {
      content: (
        <div>
          <img className="mb-3" alt="download" src="./assets/error.svg" />{" "}
          <h1 className="text-2xl mb-8 font-semibold">Something went wrong!</h1>
          <p className="font-medium">{error}</p>
        </div>
      ),
      primaryActions: <div></div>,
      secondaryActions: (
        <Button
          onClick={() => {
            authNavigate("/dashboard/restore/frombackup", [
              PERMISSIONS.CAN_VIEW_RESTORE,
            ]);
          }}
        >
          Close
        </Button>
      ),
    };
  };

  const formik = useFormik({
    initialValues: {
      host: "",
      password: "",
      file: undefined,
    },
    onSubmit: async (formData) => {
      if (!formData.file) {
        formik.setFieldError(
          "file",
          "Please select a valid (.bak) backup file."
        );
      }
      let fullPath = "";

      try {
        if (mode === "files") {
          const arrayBuffer = await utils.blobToArrayBuffer(formData.file);
          const hex = utils.bufferToHex(arrayBuffer);
          await fM.saveFileAsBinary(
            "/backups/" + (formData.file as any).name,
            hex
          );
          fullPath = await fM.getPath(
            "/backups/" + (formData.file as any).name
          );
        }

        if (mode === "backups") {
          fullPath = formData.file || "";
        }

        setRestoring(true);

        if (!userWantsToArchiveReset) {
          await rpc.restoreFromBackup(
            formData.host,
            fullPath,
            formData.password
          );
        }

        if (userWantsToArchiveReset && archivePathToResetWith) {
          await rpc
            .reset(archivePathToResetWith, fullPath, formData.password)
            .then(() => {
              resetArchiveContext();
            });
        }
      } catch (error: any) {
        const dialog = SomethingWentWrong(
          typeof error === "string"
            ? error
            : error && error.message
            ? error.message
            : "Something went wrong"
        );

        authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
        setModal({
          content: dialog.content,
          primaryActions: dialog.primaryActions,
          secondaryActions: dialog.secondaryActions,
        });
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      {!!restoring && (
        <CommonDialogLayout
          primaryActions={<div />}
          secondaryActions={<div />}
          content={
            <div>
              <div className="flex flex-col align-center">
                <Lottie
                  className="mb-4 inline"
                  width={4}
                  height={4}
                  style={{ maxWidth: 80, alignSelf: "center" }}
                  animationData={Loading}
                />
                <h1 className="text-2xl mb-8">Restoring</h1>

                <p className="mb-8">
                  Please don’t leave this screen whilst the chain is re-syncing.
                  <br /> <br />
                  Your node will reboot once it is complete.
                </p>

                <Logs />
              </div>
            </div>
          }
        />
      )}

      {!restoring && (
        <div className="grid">
          {mode === "files" && (
            <FadeIn delay={0} isOpen={true}>
              <div className={styles["dialog"]}>
                <div>
                  <h1 className="text-2xl mb-4">Restore from backup</h1>
                  <p className="mb-12">
                    Once restored, the node will attempt to <br /> sync to the
                    latest block, please be patient.
                  </p>
                  <form
                    autoComplete="off"
                    className="flex flex-col gap-4"
                    onSubmit={formik.handleSubmit}
                  >
                    {/* <FileChooser
                      keyValue={resetFileField}
                      handleEndIconClick={() => {
                        setResetFileField((prev) => prev + 1);
                        formik.setFieldValue("file", undefined);
                      }}
                      error={formik.errors.file ? formik.errors.file : false}
                      extraClass="core-grey-20"
                      accept=".bak"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                          formik.setFieldValue("file", e.target.files[0]);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      placeholder="Select file"
                      type="file"
                      id="file"
                      name="file"
                      endIcon={
                        formik.values.file && (
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
                    /> */}
                    {/* 
                    <Input
                      error={
                        formik.errors.password ? formik.errors.password : false
                      }
                      autoComplete="new-password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter password"
                      handleEndIconClick={() =>
                        togglePasswordVisibility((prevState) => !prevState)
                      }
                      type={!hidePassword ? "password" : "text"}
                      id="password"
                      name="password"
                      value={formik.values.password}
                      endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                    /> */}

                    {!userWantsToArchiveReset && (
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
                        <CSSTransition
                          in={tooltip.host}
                          unmountOnExit
                          timeout={200}
                          classNames={{
                            enter: styles.backdropEnter,
                            enterDone: styles.backdropEnterActive,
                            exit: styles.backdropExit,
                            exitActive: styles.backdropExitActive,
                          }}
                        >
                          <Tooltip
                            extraClass="!mb-0 !mt-0"
                            onClick={() =>
                              setTooltip({ ...tooltip, host: false })
                            }
                            content=" ip:port of the archive node to sync from."
                            position={148}
                          />
                        </CSSTransition>
                        <div>
                          {/* <Input
                            id="host"
                            name="host"
                            placeholder="host (optional)"
                            type="text"
                            value={formik.values.host}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                            error={
                              formik.touched.host && formik.errors.host
                                ? formik.errors.host
                                : false
                            }
                          /> */}
                        </div>
                      </>
                    )}
                  </form>
                </div>

                <div className="flex flex-col gap-3">
                  <div className={`${styles.primaryActions}`}>
                    <Button
                      disabled={!formik.isValid || formik.isSubmitting}
                      type="submit"
                      onClick={() => formik.submitForm()}
                    >
                      Restore
                    </Button>
                  </div>

                  <div
                    className={`${styles.desktop_only} ${styles.secondaryActions}`}
                  >
                    {!formik.isSubmitting && (
                      <Button
                        onClick={() => {
                          if (!mode) {
                            if (!userWantsToArchiveReset) {
                              navigate(-1);
                            }
                            if (userWantsToArchiveReset) {
                              resetArchiveContext();

                              navigate("/dashboard/archivereset/restorebackup");
                            }
                          }

                          if (mode) {
                            if (!mode) {
                              if (!userWantsToArchiveReset) {
                                navigate(-1);
                              }
                              if (userWantsToArchiveReset) {
                                resetArchiveContext();

                                navigate(
                                  "/dashboard/archivereset/restorebackup"
                                );
                              }
                            }

                            if (mode) {
                              setMode(false);
                            }
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {mode === "backups" && (
            <FadeIn delay={0} isOpen={true}>
              <div className={styles["dialog"]}>
                <div>
                  <h1 className="text-2xl mb-4">Restore from backup</h1>
                  <p className="mb-12">
                    Once restored, the node will attempt to <br /> sync to the
                    latest block, please be patient.
                  </p>
                  <form
                    autoComplete="off"
                    className="flex flex-col gap-4"
                    onSubmit={formik.handleSubmit}
                  >
                    <List
                      options={backups}
                      setForm={(option) => {
                        formik.setFieldValue("file", option);
                        handleSelectedBackupFromList(option);
                      }}
                    />

                    <Input
                      disabled={isSubmitting}
                      error={
                        formik.errors.password ? formik.errors.password : false
                      }
                      autoComplete="new-password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter password"
                      handleEndIconClick={() =>
                        togglePasswordVisibility((prevState) => !prevState)
                      }
                      type={!hidePassword ? "password" : "text"}
                      id="password"
                      name="password"
                      value={formik.values.password}
                      endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                    />

                    {!userWantsToArchiveReset && (
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
                            value={formik.values.host}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                            error={
                              formik.touched.host && formik.errors.host
                                ? formik.errors.host
                                : false
                            }
                          />
                        </div>
                      </>
                    )}
                  </form>
                </div>

                <div className="flex flex-col gap-3">
                  <div className={`${styles.primaryActions}`}>
                    <Button
                      disabled={!formik.isValid || formik.isSubmitting}
                      type="submit"
                      onClick={() => formik.submitForm()}
                    >
                      Restore
                    </Button>
                  </div>
                  <div
                    className={`${styles.desktop_only} ${styles.secondaryActions}`}
                  >
                    {!formik.isSubmitting && (
                      <Button
                        onClick={() => {
                          if (!mode) {
                            if (!userWantsToArchiveReset) {
                              navigate(-1);
                            }
                            if (userWantsToArchiveReset) {
                              resetArchiveContext();

                              navigate("/dashboard/archivereset/restorebackup");
                            }
                          }

                          if (mode) {
                            if (!mode) {
                              if (!userWantsToArchiveReset) {
                                navigate(-1);
                              }
                              if (userWantsToArchiveReset) {
                                resetArchiveContext();

                                navigate(
                                  "/dashboard/archivereset/restorebackup"
                                );
                              }
                            }

                            if (mode) {
                              setMode(false);
                            }
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {!mode && (
            <FadeIn isOpen={true} delay={0}>
              <div className={styles["dialog"]}>
                <div>
                  <h1 className="text-2xl mb-4">Restore from backup</h1>
                  <p className="mb-8">
                    Select a backup stored internally within the app or upload a
                    new backup from an external location.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className={`${styles.primaryActions} mb-1`}>
                    <Button
                      extraClass="mb-4"
                      onClick={() => {
                        getBackups();
                        setMode("backups");
                        formik.resetForm();
                      }}
                    >
                      Select an internal backup
                    </Button>
                    <Button
                      onClick={() => {
                        setMode("files");
                        formik.resetForm();
                      }}
                    >
                      Upload an external backup
                    </Button>
                  </div>
                  <div
                    className={`${styles.desktop_only} ${styles.secondaryActions}`}
                  >
                    {!formik.isSubmitting && (
                      <Button
                        onClick={() => {
                          if (!mode) {
                            if (!userWantsToArchiveReset) {
                              navigate(-1);
                            }
                            if (userWantsToArchiveReset) {
                              resetArchiveContext();

                              navigate("/dashboard/archivereset/restorebackup");
                            }
                          }

                          if (mode) {
                            setMode(false);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          <div
            className={`${styles.actions} ${styles.mobile_only} ${styles.secondaryActions}`}
          >
            {!formik.isSubmitting && (
              <Button
                onClick={() => {
                  if (!mode) {
                    if (!userWantsToArchiveReset) {
                      navigate(-1);
                    }
                    if (userWantsToArchiveReset) {
                      resetArchiveContext();

                      navigate("/dashboard/archivereset/restorebackup");
                    }
                  }

                  if (mode) {
                    setMode(false);
                  }
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RestoreDialog;
