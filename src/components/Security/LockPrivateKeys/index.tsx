import Button from "../../UI/Button";
import Input from "../../UI/Input";
import UnderstandRadio from "../../UI/UnderstandRadio";
import { useFormik } from "formik";
import * as yup from "yup";
import * as rpc from "../../../__minima__/libs/RPC";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../AppContext";
import { useLocation } from "react-router-dom";
import BackButton from "../../UI/BackButton";
import { useAuth } from "../../../providers/authProvider";
import PERMISSIONS from "../../../permissions";
import TogglePasswordIcon from "../../UI/TogglePasswordIcon/TogglePasswordIcon";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^[~!@#=?+<>,._'/()?a-zA-Z0-9-]+$/, "Invalid character")
    .required("Please enter a password")
    .min(12, "Password must be at least 12 characters long"),
  confirmPassword: yup
    .string()
    .required("Please re-enter your password")
    .test("matchy-passwords", function (val) {
      const { path, parent, createError } = this;
      if (val === undefined) {
        return false;
      }

      const pwd = parent.password;
      const matching = pwd === val;
      if (matching) {
        return true;
      }

      return createError({ path, message: "Passwords do not match" });
    }),
  understand: yup.boolean().required("Field is required"),
});
const validationSchemaUnlock = yup.object().shape({
  password: yup.string().required("Please enter a password"),
});

const LockPrivateKeys = () => {
  const {
    setModal,
    vaultLocked,
    checkVaultLocked,

    setBackButton,
    displayBackButton: displayHeaderBackButton,
  } = useContext(appContext);
  const location = useLocation();

  const { authNavigate } = useAuth();
  const [hidePassword, togglePasswordVisibility] = useState(false);
  const [hideConfirmPassword, toggleConfirmPasswordVisiblity] = useState(false);

  useEffect(() => {
    setBackButton({ display: true, to: "/dashboard", title: "Back" });
  }, [location]);

  const UnlockDialog = {
    content: (
      <div>
        <img className="mb-8" alt="unlock" src="./assets/lock_open.svg" />{" "}
        <h1 className="text-2xl font-semibold">
          You have unlocked <br /> your private keys
        </h1>
      </div>
    ),
    primaryActions: <div></div>,
    secondaryActions: (
      <Button
        extraClass="mt-4"
        onClick={() => {
          authNavigate("/dashboard/lockprivatekeys", []);
          checkVaultLocked();
        }}
      >
        Close
      </Button>
    ),
  };
  const LockDialog = {
    content: (
      <div>
        <img className="mb-8" alt="unlock" src="./assets/lock.svg" />{" "}
        <h1 className="text-2xl font-semibold">
          You have locked <br /> your private keys
        </h1>
      </div>
    ),
    primaryActions: <div></div>,
    secondaryActions: (
      <Button
        extraClass="mt-4"
        onClick={() => {
          authNavigate("/dashboard/lockprivatekeys", []);
          checkVaultLocked();
        }}
      >
        Close
      </Button>
    ),
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      understand: false,
    },
    onSubmit: async (formData) => {
      formik.setStatus(undefined);
      if (!vaultLocked) {
        await rpc
          .vaultPasswordLock(formData.password)
          .then((response) => {
            const isConfirmed = response === 1;

            if (isConfirmed) {
              authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
              setModal({
                content: LockDialog.content,
                primaryActions: LockDialog.primaryActions,
                secondaryActions: LockDialog.secondaryActions,
              });
            }
          })
          .catch((error: any) => {
            formik.setStatus(error);

            setTimeout(() => formik.setStatus(undefined), 2500);
          });
      }

      if (vaultLocked) {
        await rpc
          .vaultPasswordUnlock(formData.password)
          .then((response) => {
            const isConfirmed = response === 1;

            if (isConfirmed) {
              authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
              setModal({
                content: UnlockDialog.content,
                primaryActions: UnlockDialog.primaryActions,
                secondaryActions: UnlockDialog.secondaryActions,
              });
            }
          })
          .catch((error: any) => {
            formik.setStatus(error);

            setTimeout(() => formik.setStatus(undefined), 2500);
          });
      }
    },
    validationSchema: !vaultLocked ? validationSchema : validationSchemaUnlock,
  });

  return (
    <>
      {!vaultLocked && (
        <div className="flex flex-col h-full bg-black px-4 pb-4">
          <div className="flex flex-col h-full">
            {!displayHeaderBackButton && (
              <BackButton to="/dashboard" title="Back" />
            )}

            <div className="mt-6 text-2xl mb-8 text-left bg-inherit">
              Lock private keys
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded">
                <div>
                  <div className="mb-3 text-left pb-2">
                    Locking your node prevents unauthorised access to your
                    wallet and seed phrase. <br />
                    <br /> Your private keys will be encrypted with a password
                    which you will be required to enter when transacting. You
                    will still be able to receive funds as usual.
                  </div>
                  <p className="text-core-grey-80 text-left">
                    Before locking, ensure you have a copy of your seed phrase
                    written down.
                  </p>
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
                    handleEndIconClick={() =>
                      togglePasswordVisibility((prevState) => !prevState)
                    }
                    type={!hidePassword ? "password" : "text"}
                    autoComplete="new-password"
                    placeholder="Enter password"
                    name="password"
                    id="password"
                    error={formik.errors.password}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                  />
                  <Input
                    disabled={formik.isSubmitting}
                    extraClass="core-black-contrast"
                    handleEndIconClick={() =>
                      toggleConfirmPasswordVisiblity((prevState) => !prevState)
                    }
                    type={!hideConfirmPassword ? "password" : "text"}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    id="confirmPassword"
                    error={formik.errors.confirmPassword}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    endIcon={
                      <TogglePasswordIcon toggle={hideConfirmPassword} />
                    }
                  />
                  <div className="flex flex-col gap-8">
                    <UnderstandRadio
                      id="understand"
                      htmlFor="understand"
                      name="understand"
                      children="I understand I am responsible for keeping a record of my Seed Phrase."
                      onChange={() => {
                        formik.setFieldValue(
                          "understand",
                          !formik.values.understand
                        );
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={
                        !(formik.isValid && formik.values.understand) ||
                        formik.isSubmitting
                      }
                    >
                      Lock private keys
                    </Button>
                  </div>
                  {formik.status && (
                    <div className="text-sm form-error-message text-left">
                      {formik.status}
                    </div>
                  )}
                </form>
              </div>
              <div className="text-left">
                <p className="text-sm password-label mr-4 ml-4">
                  Enter a password over 12 characters using a-z, A-Z, 0-9 and{" "}
                  {"!@#=?+<>,.-_ '()/"}
                  symbols only. <br /> <br />
                  Your password cannot contain spaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!!vaultLocked && (
        <div className="flex flex-col h-full bg-black px-4 pb-4">
          <div className="flex flex-col h-full">
            {!displayHeaderBackButton && (
              <BackButton to="/dashboard" title="Security" />
            )}
            <div className="mt-6 text-2xl mb-8 text-left bg-inherit">
              Unlock private keys
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded">
                <div>
                  <div className="mb-3 text-left pb-2">
                    Your seed phrase and private keys will be visible and
                    unprotected against unauthorised access. <br /> <br />
                    You should only unlock your private keys temporarily if
                    required.
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
                    endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                  />
                  <div className="flex flex-col gap-8">
                    <Button
                      type="submit"
                      disabled={!formik.isValid || formik.isSubmitting}
                    >
                      Unlock private keys
                    </Button>
                  </div>
                  {formik.status && (
                    <div className="text-sm form-error-message text-left">
                      {formik.status}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LockPrivateKeys;
