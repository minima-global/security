import { appContext } from "../../../../AppContext";
import { useFormik } from "formik";
import Input from "../../../UI/Input";
import BackButton from "../../../UI/BackButton";
import * as yup from "yup";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import * as fileManager from "../../../../__minima__/libs/fileManager";
import { useAuth } from "../../../../providers/authProvider";
import PERMISSIONS from "../../../../permissions";
import TogglePasswordIcon from "../../../UI/TogglePasswordIcon/TogglePasswordIcon";

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

const AutoCreatePassword = () => {
  const navigate = useNavigate();
  const [hidePassword, togglePasswordVisibility] = useState(false);
  const [hideConfirmPassword, toggleConfirmPasswordVisiblity] = useState(false);
  const {
    displayBackButton: displayHeaderBackButton,
    setBackButton,
    setModal,
  } = useContext(appContext);
  const { authNavigate } = useAuth();

  useEffect(() => {
    return setBackButton({
      display: true,
      to: "/dashboard/backup",
      title: "Back",
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (formData) => {
      // save auto back up password as a key
      (window as any).MDS.keypair.set("autopassword", formData.password);
      // turn on auto-backup
      await fileManager.toggleBackupStatus(true);
      // authNavigate
      authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
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

            <h1 className="text-2xl mb-4 font-semibold">
              Auto-backup activated
            </h1>
            <p className="font-medium mb-6 mt-6">
              Auto backups will be taken every 24 hours. <br />
              <br />
              Only the most recent 14 backups will be stored (including manual
              backups), so you should download and move them to an offline
              device. The password provided will be required if you need to
              restore the backup.
            </p>
          </div>
        ),
        primaryActions: <div />,
        secondaryActions: (
          <Button
            onClick={() => {
              authNavigate("dashboard/backup", []);
            }}
          >
            Close
          </Button>
        ),
      });
    },
    validationSchema: validationSchema,
  });

  return (
    <div className="flex flex-col h-full bg-black px-4 pb-4">
      <div className="flex flex-col h-full">
        {!displayHeaderBackButton && (
          <BackButton
            onClickHandler={() => navigate("/dashboard/backup")}
            title="Back"
          />
        )}
        <div className="mt-6 text-2xl mb-8 text-left">Create password</div>
        <div className="flex flex-col gap-5">
          <div className="text-left">
            <div>
              <div className="mb-3">
                Create a password to protect your backups, you will be required
                to enter this password if you need to restore from an
                auto-backup. <br />
                <br />
                This is not the same as the password used to lock your private
                keys.
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
                extraClass="core-black-contrast"
                autoComplete="new-password"
                handleEndIconClick={() =>
                  toggleConfirmPasswordVisiblity((prevState) => !prevState)
                }
                type={!hideConfirmPassword ? "password" : "text"}
                placeholder="Confirm password"
                name="confirmPassword"
                id="confirmPassword"
                error={formik.errors.confirmPassword}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                endIcon={<TogglePasswordIcon toggle={hideConfirmPassword} />}
              />
              <div className="flex flex-col">
                <Button type="submit" disabled={!formik.isValid}>
                  Turn on auto-backup
                </Button>
              </div>
            </form>
          </div>

          <div className="text-left">
            <p className="text-sm password-label mr-4 ml-4">
              Enter a password over 12 characters using a-z, A-Z, 0-9 and{" "}
              {"!@#=?+<>,.-_'()/"} symbols only. <br /> <br />
              Your password cannot contain spaces. <br /> <br /> Please make
              sure you save this password somewhere safe, it cannot be recovered
              if lost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoCreatePassword;
