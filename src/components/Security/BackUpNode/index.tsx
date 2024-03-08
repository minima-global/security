import Button from "../../UI/Button";
import { useContext, useEffect, useState } from "react";

import { Formik } from "formik";
import * as yup from "yup";
import Input from "../../UI/Input";
import * as rpc from "../../../__minima__/libs/RPC";
import * as fileManager from "../../../__minima__/libs/fileManager";

import { format } from "date-fns";

import { appContext } from "../../../AppContext";
import BackButton from "../../UI/BackButton";
import Toggle from "../../UI/Toggle";
import PERMISSIONS from "../../../permissions";
import { useAuth } from "../../../providers/authProvider";
import SlideIn from "../../UI/Animations/SlideIn";
import FadeIn from "../../UI/Animations/FadeIn";
import { useNavigate } from "react-router-dom";
import TogglePasswordIcon from "../../UI/TogglePasswordIcon/TogglePasswordIcon";
import { createPortal } from "react-dom";
import SharedDialog from "../../SharedDialog";

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

interface Files {
  cascade: string;
  chain: string;
  p2p: string;
  txpow: string;
  user: string;
  wallet: string;
}
interface Backup {
  auto: boolean;
  block: number;
  file: string;
  files: Files;
  size: string;
  uncompressed: string;
}
const BackupNode = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [hidePassword, togglePasswordVisibility] = useState(false);
  const [hideConfirmPassword, toggleConfirmPasswordVisiblity] = useState(false);
  const [autoBackupStatus, setAutoBackupStatus] = useState(false);

  const [error, setError] = useState<false | string>(false);
  const [data, setData] = useState<Backup | false>(false);
  const { authNavigate } = useAuth();

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
  }, [step, setBackButton]);

  const createDownloadLink = (folder: string, mdsfile: string) => {
    const origFilePath = `/${folder}/${mdsfile}`;
    const newFilePath = `/my_downloads/${mdsfile}_minima_download_as_file_`;

    (window as any).MDS.file.copytoweb(origFilePath, newFilePath, function () {
      const url = `my_downloads/${mdsfile}` + "_minima_download_as_file_";
      // create an a
      const temporaryLink = document.createElement("a");
      temporaryLink.style.display = "none";
      temporaryLink.target = "_blank";
      temporaryLink.href = url;
      temporaryLink.click();
      (window as any).MDS.file.deletefromweb(url, function () {
        temporaryLink.remove();
      });
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
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    password: "",
                    confirmPassword: "",
                  }}
                  onSubmit={async (formData) => {
                    try {
                      const now = new Date();
                      const dateCreation = format(now, "__dMMMyyyy_Hmm");
                      const fileName =
                        `minima_backup_${now.getTime()}` +
                        dateCreation +
                        ".bak";

                      const fullPath = await fileManager.getPath(
                        "/backups/" + fileName
                      );

                      const { password } = formData;
                      await rpc
                        .createBackup(fullPath, password)
                        .then((resp) => {
                          setData(resp);
                        })
                        .catch((err) => {
                          throw err;
                        });
                    } catch (error) {
                      setError(error as string);
                    }
                  }}
                >
                  {({
                    handleSubmit,
                    isSubmitting,
                    isValid,
                    errors,
                    values,
                    touched,
                    handleChange,
                    handleBlur,
                  }) => (
                    <>
                      <div className="core-black-contrast-2 p-4 rounded flex flex-col gap-6">
                        <form
                          autoComplete="off"
                          onSubmit={handleSubmit}
                          className="flex flex-col gap-4"
                        >
                          <Input
                            disabled={isSubmitting}
                            extraClass="core-black-contrast"
                            autoComplete="new-password"
                            handleEndIconClick={() =>
                              togglePasswordVisibility(
                                (prevState) => !prevState
                              )
                            }
                            type={!hidePassword ? "password" : "text"}
                            placeholder="Enter password"
                            name="password"
                            id="password"
                            error={
                              touched.password && errors.password
                                ? errors.password
                                : false
                            }
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            endIcon={
                              <TogglePasswordIcon toggle={hidePassword} />
                            }
                          />
                          <Input
                            disabled={isSubmitting}
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
                            error={
                              touched.confirmPassword && errors.confirmPassword
                                ? errors.confirmPassword
                                : false
                            }
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            endIcon={
                              <TogglePasswordIcon
                                toggle={hideConfirmPassword}
                              />
                            }
                          />
                          <div className="flex flex-col">
                            <Button
                              type="submit"
                              disabled={isSubmitting || !isValid}
                            >
                              Backup node
                            </Button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                </Formik>

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

      {data &&
        createPortal(
          <SharedDialog
            main={
              <FadeIn delay={0}>
                <div className="mb-8 flex items-center flex-col text-center">
                  <svg
                    className="mb-2"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_850_14572"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="64"
                      height="64"
                    >
                      <rect width="64" height="64" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_850_14572)">
                      <path
                        d="M16.8205 51.9997C15.4735 51.9997 14.3333 51.5331 13.4 50.5997C12.4667 49.6664 12 48.5262 12 47.1792V39.9998H15.9999V47.1792C15.9999 47.3844 16.0854 47.5724 16.2563 47.7434C16.4273 47.9143 16.6154 47.9998 16.8205 47.9998H47.1793C47.3845 47.9998 47.5726 47.9143 47.7435 47.7434C47.9145 47.5724 47.9999 47.3844 47.9999 47.1792V39.9998H51.9999V47.1792C51.9999 48.5262 51.5332 49.6664 50.5999 50.5997C49.6665 51.5331 48.5264 51.9997 47.1793 51.9997H16.8205ZM31.9999 41.6407L20.6155 30.2563L23.4257 27.3641L30 33.9384V11.5383H33.9999V33.9384L40.5742 27.3641L43.3844 30.2563L31.9999 41.6407Z"
                        fill="#F4F4F5"
                      />
                    </g>
                  </svg>{" "}
                  <h1 className="text-2xl mb-8">Download your backup</h1>
                  <p className="break-all">
                    Download your backup file locally <br />
                    <span className="text-good">
                      {data.file.split("/backups/")[1]
                        ? data.file.split("/backups/")[1]
                        : data.file.split("\\backups\\")[1]}
                    </span>{" "}
                    which was create on block{" "}
                    <span className="text-good">{data.block}</span> with a size
                    of <span className="text-good">{data.size}</span> and save
                    it in <br />a secure location.
                  </p>
                  <p className="text-sm mt-4 opacity-80">
                    (It will already be stored in your internal backups)
                  </p>
                </div>
              </FadeIn>
            }
            primary={
              <Button
                variant="primary"
                onClick={() => {
                  if (window.navigator.userAgent.includes("Minima Browser")) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return Android.fileDownload(
                      (window as any).MDS.minidappuid,
                      "/backups/" + data.file.split("/backups/")[1]
                    );
                  }

                  createDownloadLink(
                    "backups",
                    data.file.split("/backups/")[1]
                      ? data.file.split("/backups/")[1]
                      : data.file.split("\\backups\\")[1]
                  );
                }}
              >
                Download backup
              </Button>
            }
            secondary={
              <Button
                extraClass="mt-4"
                variant="tertiary"
                onClick={() => {
                  setData(false);
                  setStep(0);
                }}
              >
                Close
              </Button>
            }
          />,
          document.body
        )}

      {error &&
        createPortal(
          <SharedDialog
            main={
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
                    {error}
                  </p>
                )}
                {typeof error === "object" && (
                  <p className="mb-8 text-center text-error truncate whitespace-normal break-all">
                    {JSON.stringify(error)}
                  </p>
                )}
              </div>
            }
            primary={null}
            secondary={
              <Button
                variant="tertiary"
                onClick={() => {
                  setError(false);
                }}
              >
                Cancel
              </Button>
            }
          />,
          document.body
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
