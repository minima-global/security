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
import { useNavigate } from "react-router-dom";
import TogglePasswordIcon from "../../UI/TogglePasswordIcon/TogglePasswordIcon";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^[~!@#=?+<>,._'/()?a-zA-Z0-9-]+$/, "Invalid character")
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
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0);
  const linkDownload: RefObject<HTMLAnchorElement> = useRef(null);
  const [hidePassword, togglePasswordVisibility] = useState(false);
  const [hideConfirmPassword, toggleConfirmPasswordVisiblity] = useState(false);
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
        title: "Back",
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

  const createDownloadLink = (mdsfile: string): Promise<string> => {
    return new Promise((resolve) => {
      const origFilePath = `/backups/${mdsfile}`;
      const newFilePath = `/my_downloads/${mdsfile}_minima_download_as_file_`;

      (window as any).MDS.file.copytoweb(
        origFilePath,
        newFilePath,
        function () {
          const url = `my_downloads/${mdsfile}` + "_minima_download_as_file_";
          resolve(url);
        }
      );
    });
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
                  <Button
                    variant="tertiary"
                    onClick={() => authNavigate("/dashboard/backup", [])}
                  >
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
          <Button
            variant="tertiary"
            onClick={() => authNavigate("/dashboard/backup", [])}
          >
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
  const downloadBackupDialog = (download: string) => {
    return {
      content: (
        <div className="mb-8">
          <img className="mb-2" alt="download" src="./assets/download.svg" />{" "}
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
          ></a>
        </Button>
      ),
      secondaryActions: (
        <Button variant="tertiary" onClick={() => authNavigate(-1, [])}>
          Close
        </Button>
      ),
    };
  };
  const downloadBackupDialogAndroid = (mdsfile: string) => {
    return {
      content: (
        <div className="mb-8">
          <img className="mb-2" alt="download" src="./assets/download.svg" />{" "}
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
                const fullPath = await fileManager.getPath(
                  "/backups/" + mdsfile
                );

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
              Android.fileDownload(MDS.minidappuid, "/backups/" + mdsfile);
            }}
          >
            Download
          </Button>
        </div>
      ),
      secondaryActions: (
        <Button variant="tertiary" onClick={() => authNavigate(-1, [])}>
          Close
        </Button>
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
        const now = new Date();
        const dateCreation = format(now, "__dMMMyyyy_Hmm");
        const fileName =
          `minima_backup_${now.getTime()}` + dateCreation + ".bak";

        const fullPath = await fileManager.getPath("/backups/" + fileName);

        await rpc.createBackup(fullPath, formData.password);

        if (isMinimaBrowser) {
          const dialog = downloadBackupDialogAndroid(fileName);

          authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
          setModal({
            content: dialog.content,
            primaryActions: dialog.primaryActions,
            secondaryActions: dialog.secondaryActions,
          });
        }

        if (!isMinimaBrowser) {
          const downloadlink = await createDownloadLink(fileName);
          const dialog = downloadBackupDialog(downloadlink);

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
                <BackButton to="/dashboard" title="Back" />
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
                <div className=" text-left">
                  Before taking a backup, check that you are in sync with the
                  chain.
                </div>
                <div className="core-black-contrast-2 p-4 rounded">
                  {!vaultLocked && (
                    <div className=" text-left mb-6">
                      <h1 className="text-base pb-4 font-bold">
                        Your node is unlocked.
                      </h1>
                      <p className="text-base font-medium">
                        Consider{" "}
                        <a
                          className="hover:cursor-pointer"
                          onClick={() => navigate("/dashboard/lockprivatekeys")}
                        >
                          locking
                        </a>{" "}
                        your private keys so they are not exposed if someone
                        gets hold of your backup.
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
                  Browse internal backups{" "}
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
                      disabled={formik.isSubmitting}
                      extraClass="core-black-contrast"
                      autoComplete="new-password"
                      handleEndIconClick={() =>
                        togglePasswordVisibility((prevState) => !prevState)
                      }
                      type={!hidePassword ? "password" : "text"}
                      placeholder="Enter password"
                      name="password"
                      id="password"
                      error={formik.errors.password}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                    />
                    <Input
                      disabled={formik.isSubmitting}
                      extraClass="core-black-contrast"
                      autoComplete="new-password"
                      handleEndIconClick={() =>
                        toggleConfirmPasswordVisiblity(
                          (prevState) => !prevState
                        )
                      }
                      type={!hideConfirmPassword ? "password" : "text"}
                      placeholder="Confirm password"
                      name="confirmPassword"
                      id="confirmPassword"
                      error={formik.errors.confirmPassword}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endIcon={
                        <TogglePasswordIcon toggle={hideConfirmPassword} />
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
                    {"!@#=?+<>,.-_'()/"} symbols only. <br /> <br />
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
