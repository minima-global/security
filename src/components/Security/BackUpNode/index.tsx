import Button from "../../UI/Button";
import { RefObject, useContext, useEffect, useRef, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import Input from "../../UI/Input";
import * as rpc from "../../../__minima__/libs/RPC";
import * as fileManager from "../../../__minima__/libs/fileManager";

import { format } from "date-fns";

import { appContext } from "../../../AppContext";
import useIsMinimaBrowser from "../../../hooks/useIsMinimaBrowser";
import BackButton from "../../UI/BackButton";
import Toggle from "../../UI/Toggle";
import PERMISSIONS from "../../../permissions";
import { useAuth } from "../../../providers/authProvider";
import SlideIn from "../../UI/Animations/SlideIn";
import FadeIn from "../../UI/Animations/FadeIn";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^[~!@#=?+<>,._'()?a-zA-Z0-9-]+$/, "Invalid character")
    .min(12, "Password must be at least 12 characters long"),
  confirmPassword: yup.string().test("matchy-passwords", function (val) {
    const { path, parent, createError } = this;
    if (parent.password === undefined) {
      return true;
    }
    if (val === undefined && parent.password !== undefined) {
      return createError({ path, message: "Please re-enter your password" });
    }

    const pwd = parent.password;
    const matching = pwd === val;
    if (matching) {
      return true;
    }

    return createError({ path, message: "Passwords do not match" });
  }),
});

const BackupNode = () => {
  const [step, setStep] = useState<0 | 1>(0);
  const linkDownload: RefObject<HTMLAnchorElement> = useRef(null);
  const [hidePassword, togglePasswordVisibility] = useState(true);
  const [hideConfirmPassword, toggleConfirmPasswordVisiblity] = useState(true);
  const [autoBackupStatus, setAutoBackupStatus] = useState(false);

  const { authNavigate } = useAuth();
  const isMinimaBrowser = useIsMinimaBrowser();
  const {
    vaultLocked,
    setModal,
    setBackButton,
    displayBackButton: displayHeaderBackButton,
  } = useContext(appContext);

  useEffect(() => {
    if (step === 0) {
      return setBackButton({
        display: true,
        to: "/dashboard",
        title: "Security",
      });
    }

    if (step === 1) {
      return setBackButton({
        display: true,
        onClickHandler: () => setStep(0),
        title: "Back",
      });
    }
  }, [step]);

  const getFileData = async (mdsfile: string) => {
    try {
      const hexstring = await fileManager.loadBinaryToHex(mdsfile);

      const filedata = hexstring;

      return filedata;
    } catch (error) {
      return "";
    }
  };

  const createDownloadLink = async (mdsfile: string) => {
    try {
      const hexstring = await fileManager.loadBinaryToHex(mdsfile);

      await fileManager.saveFileAsBinary(mdsfile, hexstring);
      const filedata = hexstring;
      const b64 = (window as any).MDS.util.hexToBase64(filedata);
      const binaryData = (window as any).MDS.util.base64ToArrayBuffer(b64);
      const blob = new Blob([binaryData], {
        type: "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      return "";
    }
  };

  const getBackupStatus = async () => {
    await fileManager.getBackupStatus().then((response: any) => {
      if (response.status) {
        // console.log(response);
        const backupStatus = JSON.parse(response.value);
        return setAutoBackupStatus(backupStatus.active);
      }

      return setAutoBackupStatus(false);
    });
  };

  useEffect(() => {
    getBackupStatus();
  }, []);

  const toggleBackupStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const togglingOff = e.target.checked === false;
    const togglingOn = e.target.checked === true;
    if (togglingOff) {
      authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
      setModal({
        content: (
          <div>
            <img className="mb-4" alt="informative" src="./assets/error.svg" />{" "}
            <h1 className="text-2xl mb-8">Deactivate auto backup?</h1>
            <p className="mb-6">Daily backups help protect your node.</p>
          </div>
        ),
        primaryActions: (
          <Button
            onClick={async () => {
              // toggle off
              await fileManager.toggleBackupStatus(e.target.checked);
              (window as any).MDS.keypair.set("autopassword", "");

              setModal({
                content: (
                  <div>
                    <img
                      className="mb-4"
                      alt="informative"
                      src="./assets/error.svg"
                    />{" "}
                    <h1 className="text-2xl mb-8">Auto-backup deactivated</h1>
                    <p className="mb-6">
                      To re-activate auto-backup, go to Backup Node in the
                      Settings menu.
                    </p>
                  </div>
                ),
                primaryActions: <div></div>,
                secondaryActions: (
                  <Button onClick={() => authNavigate("/dashboard/backup", [])}>
                    Cancel
                  </Button>
                ),
              });
            }}
          >
            Turn off auto-backup
          </Button>
        ),
        secondaryActions: (
          <Button onClick={() => authNavigate("/dashboard/backup", [])}>
            Cancel
          </Button>
        ),
      });
    }

    if (togglingOn) {
      authNavigate(
        "/dashboard/backup/autocreatepassword",
        PERMISSIONS.CAN_VIEW_AUTOCREATEPASSWORD
      );
    }

    getBackupStatus();
  };

  const SomethingWentWrong = (error: string) => {
    return {
      content: (
        <div>
          <img alt="download" src="./assets/download.svg" />{" "}
          <h1 className="text-2xl mb-8">Something went wrong!</h1>
          <p className="mb-8">{error}</p>
        </div>
      ),
      primaryActions: null,
      secondaryActions: (
        <Button onClick={() => authNavigate(-1, [])}>Close</Button>
      ),
    };
  };
  const downloadBackupDialog = (download: string, name: string) => {
    return {
      content: (
        <div className="mb-8">
          <img alt="download" src="./assets/download.svg" />{" "}
          <h1 className="text-2xl mb-8">Download your backup</h1>
          <p>
            Download your backup file and save it in <br />a secure location.
          </p>
        </div>
      ),
      primaryActions: (
        <Button
          onClick={() => {
            if (linkDownload.current) {
              linkDownload.current.click();
            }
          }}
        >
          Download
          <a
            ref={linkDownload}
            className="hidden"
            target="_blank"
            href={download}
            download={name}
          ></a>
        </Button>
      ),
      secondaryActions: (
        <Button onClick={() => authNavigate(-1, [])}>Close</Button>
      ),
    };
  };
  const downloadBackupDialogAndroid = (file: string, filedata: string) => {
    return {
      content: (
        <div className="mb-8">
          <img alt="download" src="./assets/download.svg" />{" "}
          <h1 className="text-2xl mb-8">Download your backup</h1>
          <p>
            Download your backup file and save it in <br />a secure location.
          </p>
        </div>
      ),
      primaryActions: (
        <div className="flex flex-col gap-2">
          {!!isMinimaBrowser && (
            <Button
              onClick={async () => {
                const fullPath = await fileManager.getPath("/backups/" + file);

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                Android.shareFile(fullPath, "*/*");
              }}
            >
              Share
            </Button>
          )}

          <Button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              Android.blobDownload(file, filedata);
            }}
          >
            Download
          </Button>
        </div>
      ),
      secondaryActions: (
        <Button onClick={() => authNavigate(-1, [])}>Close</Button>
      ),
    };
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (formData) => {
      try {
        const minidappPath = await fileManager.getPath("/");

        const dateCreation = format(new Date(), "_dMMMyyyy_Hmm");
        const fileName = "minima_backup_" + dateCreation + ".bak";
        await rpc.createBackup(
          minidappPath + "/backups/" + fileName,
          formData.password
        );

        if (isMinimaBrowser) {
          const filedata = await getFileData("/backups/" + fileName);

          const dialog = downloadBackupDialogAndroid(fileName, filedata);

          authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
          setModal({
            content: dialog.content,
            primaryActions: dialog.primaryActions,
            secondaryActions: dialog.secondaryActions,
          });
        }

        if (!isMinimaBrowser) {
          const downloadlink = await createDownloadLink("/backups/" + fileName);
          const dialog = downloadBackupDialog(downloadlink, fileName);

          authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
          setModal({
            content: dialog.content,
            primaryActions: dialog.primaryActions,
            secondaryActions: dialog.secondaryActions,
          });
        }
      } catch (error: any) {
        console.error(error);
        const somethingwrong = SomethingWentWrong(error);

        authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
        setModal({
          content: somethingwrong.content,
          primaryActions: <div></div>,
          secondaryActions: somethingwrong.secondaryActions,
        });
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      {step === 0 && (
        <SlideIn isOpen={true} delay={0}>
          <div className="flex flex-col h-full bg-black px-4 pb-4">
            <div className="flex flex-col h-full">
              {!displayHeaderBackButton && (
                <BackButton to="/dashboard" title="Security" />
              )}
              <div className="mt-6 text-2xl mb-8 text-left">Backup node</div>
              <div className="flex flex-col gap-5">
                <div className="text-left">
                  <div>
                    <div className="mb-3">
                      Your backup will contain your private keys, current chain
                      and the proofs of your coins that no one else has. <br />{" "}
                      <br />
                      It is recommended to backup your node at least monthly to
                      ensure a successful restore. The more recent your backup
                      is, the easier it will be to re-sync to the chain when
                      restoring.
                    </div>
                  </div>
                </div>
                <div className="core-black-contrast-2 p-4 rounded">
                  <div className="mb-6 text-left">
                    Before taking a backup, check that you are in sync with the
                    chain.
                  </div>
                  {!vaultLocked && (
                    <div className="form-error-border p-4 text-left mb-6">
                      <h1 className="text-base text-error pb-4 font-bold">
                        Your node is unlocked.
                      </h1>
                      <p className="text-base text-error font-medium">
                        Consider locking your private keys so they are not
                        exposed if someone gets hold of your backup.
                      </p>
                    </div>
                  )}

                  <Button onClick={() => setStep(1)}>Backup node</Button>
                </div>
                <div className="text-left">
                  <p className="text-sm password-label mr-4 ml-4">
                    Always store your backup in a secure location offline and
                    never share your backup with anyone.
                  </p>
                </div>
                <div
                  onClick={() => authNavigate("/dashboard/backup/backups", [])}
                  className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer"
                >
                  View backups{" "}
                  <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                    <svg
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                        fill="#F4F4F5"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer">
                  <span className="make-svg-inline">
                    Auto-backup{" "}
                    <svg
                      className="mx-2 mb-1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <mask
                        id="mask0_583_16266"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <rect width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_583_16266)">
                        <path
                          d="M6.49998 19.5C5.11794 19.5 3.9391 19.0205 2.96345 18.0617C1.98782 17.1029 1.5 15.9311 1.5 14.5461C1.5 13.3038 1.89968 12.2112 2.69905 11.2683C3.49842 10.3253 4.48976 9.76667 5.67308 9.59232C5.99359 8.09744 6.74519 6.875 7.92788 5.925C9.11056 4.975 10.4679 4.5 12 4.5C13.8107 4.5 15.3467 5.13066 16.608 6.39198C17.8693 7.65328 18.5 9.18928 18.5 11V11.5H18.8077C19.8615 11.5821 20.7403 12.0058 21.4442 12.7712C22.148 13.5365 22.5 14.4461 22.5 15.5C22.5 16.6153 22.1153 17.5609 21.3461 18.3365C20.5769 19.1121 19.6346 19.5 18.5192 19.5H13.0577C12.5525 19.5 12.125 19.325 11.775 18.975C11.425 18.625 11.25 18.1974 11.25 17.6923V12.2153L9.39998 14.0346L8.34615 12.9904L12 9.33655L15.6538 12.9904L14.6 14.0346L12.75 12.2153V17.6923C12.75 17.7692 12.782 17.8397 12.8461 17.9038C12.9102 17.9679 12.9807 18 13.0577 18H18.5C19.2 18 19.7916 17.7583 20.275 17.275C20.7583 16.7916 21 16.2 21 15.5C21 14.8 20.7583 14.2083 20.275 13.725C19.7916 13.2416 19.2 13 18.5 13H17V11C17 9.61664 16.5125 8.43748 15.5375 7.46248C14.5625 6.48748 13.3833 5.99998 12 5.99998C10.6166 5.99998 9.43748 6.48748 8.46248 7.46248C7.48748 8.43748 6.99998 9.61664 6.99998 11H6.48075C5.53332 11 4.71633 11.3416 4.02978 12.025C3.34324 12.7083 2.99998 13.5333 2.99998 14.5C2.99998 15.4666 3.34164 16.2916 4.02498 16.975C4.70831 17.6583 5.53331 18 6.49998 18H8.99998V19.5H6.49998Z"
                          fill="#F9F9FA"
                        />
                      </g>
                    </svg>
                  </span>

                  <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                    <Toggle
                      checkedStatus={autoBackupStatus}
                      onChange={toggleBackupStatus}
                    />
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-sm password-label mr-4 ml-4">
                    Auto backups will be taken every 24 hours. <br />
                    <br />
                    Only the most recent 14 backups will be stored (including
                    manual backups), so you should download and move them to an
                    offline device. The password provided will be required if
                    you need to restore the backup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>
      )}

      {step === 1 && (
        <FadeIn isOpen={true} delay={0}>
          <div className="flex flex-col h-full bg-black px-4 pb-4">
            <div className="flex flex-col h-full">
              {!displayHeaderBackButton && (
                <BackButton onClickHandler={() => setStep(0)} title="Back" />
              )}
              <div className="mt-6 text-2xl mb-8 text-left">
                Create password
              </div>
              <div className="flex flex-col gap-5">
                <div className="text-left">
                  <div>
                    <div className="mb-3">
                      Create a password for this backup, you will be required to
                      enter this password if you need to restore this backup.{" "}
                      <br /> <br />
                      This is not the same as the password used to lock your
                      private keys.
                    </div>
                  </div>
                </div>
                <div className="core-black-contrast-2 p-4 rounded flex flex-col gap-6">
                  <form
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      autoComplete="new-password"
                      handleEndIconClick={() =>
                        togglePasswordVisibility((prevState) => !prevState)
                      }
                      type={hidePassword ? "password" : "text"}
                      placeholder="Enter password"
                      name="password"
                      id="password"
                      error={formik.errors.password}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endIcon={
                        hidePassword ? (
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
                              <rect width="20" height="20" fill="#A7A7B0" />
                            </mask>
                            <g mask="url(#mask0_762_271)">
                              <path
                                d="M13.271 11.146L11.979 9.85399C12.0343 9.32599 11.8747 8.87133 11.5 8.48999C11.1253 8.10799 10.674 7.94466 10.146 7.99999L8.854 6.70799C9.03467 6.63866 9.22233 6.58666 9.417 6.55199C9.611 6.51733 9.80533 6.49999 10 6.49999C10.972 6.49999 11.7983 6.84033 12.479 7.52099C13.1597 8.20166 13.5 9.02799 13.5 9.99999C13.5 10.1947 13.4827 10.389 13.448 10.583C13.4133 10.7777 13.3543 10.9653 13.271 11.146ZM16.042 13.917L14.958 12.833C15.458 12.4443 15.913 12.0173 16.323 11.552C16.733 11.0867 17.0767 10.5693 17.354 9.99999C16.6733 8.59733 15.67 7.49666 14.344 6.69799C13.0173 5.89933 11.5693 5.49999 10 5.49999C9.63867 5.49999 9.28467 5.52066 8.938 5.56199C8.59067 5.60399 8.25033 5.67366 7.917 5.77099L6.708 4.56199C7.236 4.35399 7.77433 4.20833 8.323 4.12499C8.87167 4.04166 9.43067 3.99999 10 3.99999C11.986 3.99999 13.802 4.53833 15.448 5.61499C17.094 6.69099 18.278 8.15266 19 9.99999C18.6947 10.792 18.2883 11.5107 17.781 12.156C17.2743 12.802 16.6947 13.389 16.042 13.917ZM16 18.125L13.292 15.417C12.764 15.611 12.2257 15.7567 11.677 15.854C11.1283 15.9513 10.5693 16 10 16C8.014 16 6.198 15.4617 4.552 14.385C2.906 13.309 1.722 11.8473 1 9.99999C1.30533 9.20799 1.708 8.48566 2.208 7.83299C2.708 7.18033 3.29133 6.58999 3.958 6.06199L1.875 3.97899L2.938 2.91699L17.062 17.062L16 18.125ZM5.021 7.14599C4.535 7.53466 4.08367 7.96166 3.667 8.42699C3.25033 8.89233 2.91 9.41666 2.646 9.99999C3.32667 11.4027 4.33 12.5033 5.656 13.302C6.98267 14.1007 8.43067 14.5 10 14.5C10.3613 14.5 10.7153 14.4757 11.062 14.427C11.4093 14.3783 11.7567 14.3123 12.104 14.229L11.167 13.292C10.9723 13.3613 10.7777 13.4133 10.583 13.448C10.389 13.4827 10.1947 13.5 10 13.5C9.028 13.5 8.20167 13.1597 7.521 12.479C6.84033 11.7983 6.5 10.972 6.5 9.99999C6.5 9.80533 6.52433 9.61099 6.573 9.41699C6.62167 9.22233 6.66667 9.02766 6.708 8.83299L5.021 7.14599Z"
                                fill="#A7A7B0"
                              />
                            </g>
                          </svg>
                        )
                      }
                    />
                    <Input
                      autoComplete="new-password"
                      handleEndIconClick={() =>
                        toggleConfirmPasswordVisiblity(
                          (prevState) => !prevState
                        )
                      }
                      type={hideConfirmPassword ? "password" : "text"}
                      placeholder="Confirm password"
                      name="confirmPassword"
                      id="confirmPassword"
                      error={formik.errors.confirmPassword}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endIcon={
                        <>
                          {hideConfirmPassword ? (
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
                                  fill="#A7A7B0"
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
                                <rect width="20" height="20" fill="#A7A7B0" />
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
                    <div className="flex flex-col">
                      <Button
                        type="submit"
                        disabled={formik.isSubmitting || !formik.isValid}
                      >
                        Backup node
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="text-left">
                  <p className="text-sm password-label mr-4 ml-4">
                    Enter a password over 12 characters using a-z, A-Z, 0-9 and{" "}
                    {"!@#=?+<>,.-_'()"} symbols only. <br /> <br />
                    Your password cannot contain spaces. <br /> <br /> Please
                    make sure you save this password somewhere safe, it cannot
                    be recovered if lost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}
    </>
  );
};

export default BackupNode;

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string; // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}
