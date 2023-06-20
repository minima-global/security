import Button from "../../UI/Button";
import Input from "../../UI/Input";
import UnderstandRadio from "../../UI/UnderstandRadio";
import { useFormik } from "formik";
import * as yup from "yup";
import * as rpc from "../../../__minima__/libs/RPC";
import { useContext, useState } from "react";
import { appContext } from "../../../AppContext";
import { useNavigate } from "react-router-dom";

import styles from "./LockPrivateKeys.module.css";

import { CSSTransition } from "react-transition-group";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^[~!@#=?+<>,._'()?a-zA-Z0-9-]+$/, "Invalid character")
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
  const navigate = useNavigate();
  const { setModal, vaultLocked, checkVaultLocked, clearPhrase } =
    useContext(appContext);
  const [hidePassword, togglePasswordVisibility] = useState(true);
  const [hideConfirmPassword, toggleConfirmPasswordVisiblity] = useState(true);

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
        onClick={() => {
          setModal(false);
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
        onClick={() => {
          setModal(false);
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
              // get rid of phrase if in memory
              clearPhrase();
              return setModal({
                display: true,
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
              return setModal({
                display: true,
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
      <CSSTransition
        in={!vaultLocked}
        unmountOnExit
        timeout={2000}
        classNames={{
          enter: styles.slideEnter,
          enterDone: styles.slideEnterActive,
          exit: styles.slideExit,
          exitActive: styles.slideExitActive,
        }}
      >
        <div className="flex flex-col h-full bg-black">
          <div className="flex flex-col h-full">
            <div
              onClick={() => navigate(-1)}
              className="cursor-pointer mb-4 flex items-center"
            >
              <svg
                className="mt-0.5 mr-4"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90017 13.1693L0.730957 7.00009L6.90017 0.830872L7.79631 1.72701L2.52324 7.00009L7.79631 12.2732L6.90017 13.1693Z"
                  fill="#F9F9FA"
                />
              </svg>
              Security
            </div>
            <div className="mt-6 text-2xl mb-8 text-left bg-inherit">
              Lock private keys
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded">
                <div>
                  <div className="mb-3 text-left pb-2">
                    Locking your private keys prevents unauthorised access to
                    your wallet and seed phrase. Your private keys will be
                    encrypted with a password which you will be required to
                    enter when transacting. You will still be able to receive
                    funds as usual.
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
                    handleEndIconClick={() =>
                      togglePasswordVisibility((prevState) => !prevState)
                    }
                    type={hidePassword ? "password" : "text"}
                    autoComplete="new-password"
                    placeholder="Enter password"
                    name="password"
                    id="password"
                    error={formik.errors.password}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    endIcon={
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
                    }
                  />
                  <Input
                    handleEndIconClick={() =>
                      toggleConfirmPasswordVisiblity((prevState) => !prevState)
                    }
                    type={hideConfirmPassword ? "password" : "text"}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    id="confirmPassword"
                    error={formik.errors.confirmPassword}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    endIcon={
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
                  {"!@#=?+<>,.-_ '() "}
                  symbols only. <br /> <br />
                  Your password cannot contain spaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={!!vaultLocked}
        unmountOnExit
        timeout={2000}
        classNames={{
          enter: styles.slideEnter,
          enterDone: styles.slideEnterActive,
          exit: styles.slideExit,
          exitActive: styles.slideExitActive,
        }}
      >
        <div className="flex flex-col h-full bg-black">
          <div className="flex flex-col h-full">
            <div
              onClick={() => navigate(-1)}
              className="cursor-pointer mb-4 flex items-center"
            >
              <svg
                className="mt-0.5 mr-4"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90017 13.1693L0.730957 7.00009L6.90017 0.830872L7.79631 1.72701L2.52324 7.00009L7.79631 12.2732L6.90017 13.1693Z"
                  fill="#F9F9FA"
                />
              </svg>
              Security
            </div>
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
                    endIcon={
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
                    }
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
      </CSSTransition>
    </>
  );
};

export default LockPrivateKeys;
