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
import useIsMinimaBrowser from "../../hooks/useIsMinimaBrowser";
import { useArchiveContext } from "../../providers/archiveProvider";

const validationSchema = yup.object().shape({
  host: yup
    .string()
    .required("Please enter an archive host node")
    .test("test-host", function (val) {
      const { createError, path } = this;
      if (val === undefined) {
        return createError({
          path,
          message: "Please enter an archive host node",
        });
      }

      if (val === "auto") {
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

  const { setModal, backups, getBackups, shuttingDown, isMobile } =
    useContext(appContext);
  const [mode, setMode] = useState<"files" | "backups" | false>(false);
  const [tooltip, setTooltip] = useState({ host: false });

  const isMinimaBrowser = useIsMinimaBrowser();
  const {
    userWantsToArchiveReset,
    lastUploadPath,
    resetArchiveContext,
    deleteLastUploadedArchive,
    archiveFileToUpload,
  } = useArchiveContext();

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
              if (isMobile === "mobile") {
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
          <p className="font-medium">
            {error.length ? error : "Please go back and try again."}
          </p>
        </div>
      ),
      primaryActions: <div></div>,
      secondaryActions: (
        <Button
          onClick={() => {
            authNavigate("/dashboard/restore", []);
          }}
        >
          Close
        </Button>
      ),
    };
  };
  const SuccessDialog = {
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

        <h1 className="text-2xl mb-4 font-semibold">Restoring complete</h1>
        <p className="font-medium mb-6 mt-6">
          Your node was successfully restored and will shutdown. Restart Minima
          for the restore to take effect.
        </p>
      </div>
    ),
    primaryActions: <div />,
    secondaryActions: (
      <Button
        onClick={() => {
          if (isMinimaBrowser) {
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
  };

  const formik = useFormik({
    initialValues: {
      host: "auto",
      password: "",
      file: undefined,
    },
    onSubmit: async (formData) => {
      try {
        if (!formData.file) {
          formik.setFieldError(
            "file",
            "Please select a valid (.bak) backup file."
          );
        }

        let fullPath = "";
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

        if (!userWantsToArchiveReset) {
          await rpc.restoreFromBackup(
            formData.host,
            fullPath,
            formData.password
          );
        }

        if (userWantsToArchiveReset && lastUploadPath) {
          await rpc
            .reset(lastUploadPath, fullPath, formData.password)
            .then(() => {
              resetArchiveContext();
              if (archiveFileToUpload) {
                deleteLastUploadedArchive(archiveFileToUpload.name);
              }
            })
            .catch((error) => {
              if (archiveFileToUpload) {
                deleteLastUploadedArchive(archiveFileToUpload.name);
              }
              throw error;
            });
        }

        authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
        setModal({
          content: SuccessDialog.content,
          primaryActions: SuccessDialog.primaryActions,
          secondaryActions: SuccessDialog.secondaryActions,
        });
      } catch (error: any) {
        const wrongPassword = error.includes("Not in GZIP format");
        const dialog = SomethingWentWrong(
          wrongPassword ? "Incorrect password or file format" : error
        );

        resetArchiveContext();

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
                <FileChooser
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
                          <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
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
                  type={hidePassword ? "password" : "text"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  endIcon={
                    <>
                      {hidePassword ? (
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_1102_25545"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="21"
                            height="20"
                          >
                            <rect
                              x="0.5"
                              width="20"
                              height="20"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_1102_25545)">
                            <path
                              d="M10.5 13.5C11.472 13.5 12.2983 13.1597 12.979 12.479C13.6597 11.7983 14 10.972 14 10C14 9.028 13.6597 8.20167 12.979 7.521C12.2983 6.84033 11.472 6.5 10.5 6.5C9.528 6.5 8.70167 6.84033 8.021 7.521C7.34033 8.20167 7 9.028 7 10C7 10.972 7.34033 11.7983 8.021 12.479C8.70167 13.1597 9.528 13.5 10.5 13.5ZM10.5 12C9.94467 12 9.47233 11.8057 9.083 11.417C8.69433 11.0277 8.5 10.5553 8.5 10C8.5 9.44467 8.69433 8.97233 9.083 8.583C9.47233 8.19433 9.94467 8 10.5 8C11.0553 8 11.5277 8.19433 11.917 8.583C12.3057 8.97233 12.5 9.44467 12.5 10C12.5 10.5553 12.3057 11.0277 11.917 11.417C11.5277 11.8057 11.0553 12 10.5 12ZM10.5 16C8.514 16 6.70833 15.455 5.083 14.365C3.45833 13.2743 2.264 11.8193 1.5 10C2.264 8.18067 3.45833 6.72567 5.083 5.635C6.70833 4.545 8.514 4 10.5 4C12.486 4 14.2917 4.545 15.917 5.635C17.5417 6.72567 18.736 8.18067 19.5 10C18.736 11.8193 17.5417 13.2743 15.917 14.365C14.2917 15.455 12.486 16 10.5 16ZM10.5 14.5C12.0553 14.5 13.4927 14.0973 14.812 13.292C16.132 12.486 17.146 11.3887 17.854 10C17.146 8.61133 16.132 7.514 14.812 6.708C13.4927 5.90267 12.0553 5.5 10.5 5.5C8.94467 5.5 7.50733 5.90267 6.188 6.708C4.868 7.514 3.854 8.61133 3.146 10C3.854 11.3887 4.868 12.486 6.188 13.292C7.50733 14.0973 8.94467 14.5 10.5 14.5Z"
                              fill="#A7A7B0"
                            />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <mask
                            id="mask0_762_271"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="20"
                            height="20"
                          >
                            <rect width="20" height="20" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_762_271)">
                            <path
                              d="M13.271 11.146L11.979 9.85399C12.0343 9.32599 11.8747 8.87133 11.5 8.48999C11.1253 8.10799 10.674 7.94466 10.146 7.99999L8.854 6.70799C9.03467 6.63866 9.22233 6.58666 9.417 6.55199C9.611 6.51733 9.80533 6.49999 10 6.49999C10.972 6.49999 11.7983 6.84033 12.479 7.52099C13.1597 8.20166 13.5 9.02799 13.5 9.99999C13.5 10.1947 13.4827 10.389 13.448 10.583C13.4133 10.7777 13.3543 10.9653 13.271 11.146ZM16.042 13.917L14.958 12.833C15.458 12.4443 15.913 12.0173 16.323 11.552C16.733 11.0867 17.0767 10.5693 17.354 9.99999C16.6733 8.59733 15.67 7.49666 14.344 6.69799C13.0173 5.89933 11.5693 5.49999 10 5.49999C9.63867 5.49999 9.28467 5.52066 8.938 5.56199C8.59067 5.60399 8.25033 5.67366 7.917 5.77099L6.708 4.56199C7.236 4.35399 7.77433 4.20833 8.323 4.12499C8.87167 4.04166 9.43067 3.99999 10 3.99999C11.986 3.99999 13.802 4.53833 15.448 5.61499C17.094 6.69099 18.278 8.15266 19 9.99999C18.6947 10.792 18.2883 11.5107 17.781 12.156C17.2743 12.802 16.6947 13.389 16.042 13.917ZM16 18.125L13.292 15.417C12.764 15.611 12.2257 15.7567 11.677 15.854C11.1283 15.9513 10.5693 16 10 16C8.014 16 6.198 15.4617 4.552 14.385C2.906 13.309 1.722 11.8473 1 9.99999C1.30533 9.20799 1.708 8.48566 2.208 7.83299C2.708 7.18033 3.29133 6.58999 3.958 6.06199L1.875 3.97899L2.938 2.91699L17.062 17.062L16 18.125ZM5.021 7.14599C4.535 7.53466 4.08367 7.96166 3.667 8.42699C3.25033 8.89233 2.91 9.41666 2.646 9.99999C3.32667 11.4027 4.33 12.5033 5.656 13.302C6.98267 14.1007 8.43067 14.5 10 14.5C10.3613 14.5 10.7153 14.4757 11.062 14.427C11.4093 14.3783 11.7567 14.3123 12.104 14.229L11.167 13.292C10.9723 13.3613 10.7777 13.4133 10.583 13.448C10.389 13.4827 10.1947 13.5 10 13.5C9.028 13.5 8.20167 13.1597 7.521 12.479C6.84033 11.7983 6.5 10.972 6.5 9.99999C6.5 9.80533 6.52433 9.61099 6.573 9.41699C6.62167 9.22233 6.66667 9.02766 6.708 8.83299L5.021 7.14599Z"
                              fill="#A7A7B0"
                            />
                          </g>
                        </svg>
                      )}
                    </>
                  }
                />

                {!userWantsToArchiveReset && (
                  <>
                    <span className="mb-2 flex gap-2 items-center">
                      <div className="text-left">Archive node host</div>
                      {!tooltip.host && (
                        <img
                          className="w-4 h-4"
                          onClick={() => setTooltip({ ...tooltip, host: true })}
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
                        onClick={() => setTooltip({ ...tooltip, host: false })}
                        content=" ip:port of the archive node to sync from. Use 'auto' to connect to a default archive node."
                        position={148}
                      />
                    </CSSTransition>
                    <div>
                      <Input
                        id="host"
                        name="host"
                        placeholder="Auto"
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
                  <Button onClick={() => setMode(false)}>Cancel</Button>
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
                  type={hidePassword ? "password" : "text"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  endIcon={
                    <>
                      {hidePassword ? (
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_1102_25545"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="21"
                            height="20"
                          >
                            <rect
                              x="0.5"
                              width="20"
                              height="20"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_1102_25545)">
                            <path
                              d="M10.5 13.5C11.472 13.5 12.2983 13.1597 12.979 12.479C13.6597 11.7983 14 10.972 14 10C14 9.028 13.6597 8.20167 12.979 7.521C12.2983 6.84033 11.472 6.5 10.5 6.5C9.528 6.5 8.70167 6.84033 8.021 7.521C7.34033 8.20167 7 9.028 7 10C7 10.972 7.34033 11.7983 8.021 12.479C8.70167 13.1597 9.528 13.5 10.5 13.5ZM10.5 12C9.94467 12 9.47233 11.8057 9.083 11.417C8.69433 11.0277 8.5 10.5553 8.5 10C8.5 9.44467 8.69433 8.97233 9.083 8.583C9.47233 8.19433 9.94467 8 10.5 8C11.0553 8 11.5277 8.19433 11.917 8.583C12.3057 8.97233 12.5 9.44467 12.5 10C12.5 10.5553 12.3057 11.0277 11.917 11.417C11.5277 11.8057 11.0553 12 10.5 12ZM10.5 16C8.514 16 6.70833 15.455 5.083 14.365C3.45833 13.2743 2.264 11.8193 1.5 10C2.264 8.18067 3.45833 6.72567 5.083 5.635C6.70833 4.545 8.514 4 10.5 4C12.486 4 14.2917 4.545 15.917 5.635C17.5417 6.72567 18.736 8.18067 19.5 10C18.736 11.8193 17.5417 13.2743 15.917 14.365C14.2917 15.455 12.486 16 10.5 16ZM10.5 14.5C12.0553 14.5 13.4927 14.0973 14.812 13.292C16.132 12.486 17.146 11.3887 17.854 10C17.146 8.61133 16.132 7.514 14.812 6.708C13.4927 5.90267 12.0553 5.5 10.5 5.5C8.94467 5.5 7.50733 5.90267 6.188 6.708C4.868 7.514 3.854 8.61133 3.146 10C3.854 11.3887 4.868 12.486 6.188 13.292C7.50733 14.0973 8.94467 14.5 10.5 14.5Z"
                              fill="#A7A7B0"
                            />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <mask
                            id="mask0_762_271"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="20"
                            height="20"
                          >
                            <rect width="20" height="20" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_762_271)">
                            <path
                              d="M13.271 11.146L11.979 9.85399C12.0343 9.32599 11.8747 8.87133 11.5 8.48999C11.1253 8.10799 10.674 7.94466 10.146 7.99999L8.854 6.70799C9.03467 6.63866 9.22233 6.58666 9.417 6.55199C9.611 6.51733 9.80533 6.49999 10 6.49999C10.972 6.49999 11.7983 6.84033 12.479 7.52099C13.1597 8.20166 13.5 9.02799 13.5 9.99999C13.5 10.1947 13.4827 10.389 13.448 10.583C13.4133 10.7777 13.3543 10.9653 13.271 11.146ZM16.042 13.917L14.958 12.833C15.458 12.4443 15.913 12.0173 16.323 11.552C16.733 11.0867 17.0767 10.5693 17.354 9.99999C16.6733 8.59733 15.67 7.49666 14.344 6.69799C13.0173 5.89933 11.5693 5.49999 10 5.49999C9.63867 5.49999 9.28467 5.52066 8.938 5.56199C8.59067 5.60399 8.25033 5.67366 7.917 5.77099L6.708 4.56199C7.236 4.35399 7.77433 4.20833 8.323 4.12499C8.87167 4.04166 9.43067 3.99999 10 3.99999C11.986 3.99999 13.802 4.53833 15.448 5.61499C17.094 6.69099 18.278 8.15266 19 9.99999C18.6947 10.792 18.2883 11.5107 17.781 12.156C17.2743 12.802 16.6947 13.389 16.042 13.917ZM16 18.125L13.292 15.417C12.764 15.611 12.2257 15.7567 11.677 15.854C11.1283 15.9513 10.5693 16 10 16C8.014 16 6.198 15.4617 4.552 14.385C2.906 13.309 1.722 11.8473 1 9.99999C1.30533 9.20799 1.708 8.48566 2.208 7.83299C2.708 7.18033 3.29133 6.58999 3.958 6.06199L1.875 3.97899L2.938 2.91699L17.062 17.062L16 18.125ZM5.021 7.14599C4.535 7.53466 4.08367 7.96166 3.667 8.42699C3.25033 8.89233 2.91 9.41666 2.646 9.99999C3.32667 11.4027 4.33 12.5033 5.656 13.302C6.98267 14.1007 8.43067 14.5 10 14.5C10.3613 14.5 10.7153 14.4757 11.062 14.427C11.4093 14.3783 11.7567 14.3123 12.104 14.229L11.167 13.292C10.9723 13.3613 10.7777 13.4133 10.583 13.448C10.389 13.4827 10.1947 13.5 10 13.5C9.028 13.5 8.20167 13.1597 7.521 12.479C6.84033 11.7983 6.5 10.972 6.5 9.99999C6.5 9.80533 6.52433 9.61099 6.573 9.41699C6.62167 9.22233 6.66667 9.02766 6.708 8.83299L5.021 7.14599Z"
                              fill="#A7A7B0"
                            />
                          </g>
                        </svg>
                      )}
                    </>
                  }
                />

                {!userWantsToArchiveReset && (
                  <>
                    <span className="mb-2 flex gap-2 items-center">
                      <div className="text-left">Archive node host</div>
                      {!tooltip.host && (
                        <img
                          className="w-4 h-4"
                          onClick={() => setTooltip({ ...tooltip, host: true })}
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
                        onClick={() => setTooltip({ ...tooltip, host: false })}
                        content=" ip:port of the archive node to sync from. Use 'auto' to connect to a default archive node."
                        position={148}
                      />
                    </CSSTransition>
                    <div>
                      <Input
                        id="host"
                        name="host"
                        placeholder="Auto"
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
                          if (archiveFileToUpload) {
                            deleteLastUploadedArchive(
                              "/fileupload/" + archiveFileToUpload.name
                            );
                          }

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

      {!mode && (
        <FadeIn isOpen={true} delay={0}>
          <div className={styles["dialog"]}>
            <div>
              <h1 className="text-2xl mb-4">Restore from backup</h1>
              <p className="mb-8">
                Select a backup stored internally within the app or upload a new
                backup from an external location.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className={`${styles.primaryActions} mb-1`}>
                <Button
                  extraClass="mb-4"
                  onClick={() => {
                    getBackups();
                    setMode("backups");
                  }}
                >
                  Select an internal backup
                </Button>
                <Button onClick={() => setMode("files")}>
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
                          if (archiveFileToUpload) {
                            deleteLastUploadedArchive(
                              "/fileupload/" + archiveFileToUpload.name
                            );
                          }

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
                  if (archiveFileToUpload) {
                    deleteLastUploadedArchive(
                      "/fileupload/" + archiveFileToUpload.name
                    );
                  }

                  navigate("/dashboard/archivereset/restorebackup");
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
  );
};

export default RestoreDialog;
