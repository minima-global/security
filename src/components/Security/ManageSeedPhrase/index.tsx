import { Outlet, matchPath, useLocation, useNavigate } from "react-router-dom";
import Button from "../../UI/Button";
import SlideScreen from "../../UI/SlideScreen";
import { useContext, useState } from "react";
import { appContext } from "../../../AppContext";
import Input from "../../UI/Input";
import { useAuth } from "../../../providers/authProvider";
import PERMISSIONS from "../../../permissions";
import { useFormik } from "formik";

import * as yup from "yup";
import Tooltip from "../../UI/Tooltip";

import styles from "./ManageSeed.module.css";
import { CSSTransition } from "react-transition-group";

const validationSchema = yup.object().shape({
  host: yup.string().required("Please enter an archive host node"),
  keyuses: yup
    .number()
    .required(
      "Please enter the maximum times you have signed a transaction.  Otherwise leave the default 1000 if you think you haven't signed over 1000 transactions"
    ),
});
const ManageSeedPhrase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authNavigate } = useAuth();
  const { vaultLocked } = useContext(appContext);

  const [tooltip, setTooltip] = useState({ host: false, keyuses: false });

  const formik = useFormik({
    initialValues: {
      host: "auto",
      keyuses: 1000,
    },
    onSubmit: (formData) => {
      authNavigate(
        "/dashboard/manageseedphrase/wipethisnode",
        [PERMISSIONS.CAN_VIEW_WIPETHISNODE],
        { state: { host: formData.host, keyuses: formData.keyuses } }
      );
    },
    validationSchema: validationSchema,
  });

  const wantsToEnterSeedPhrase = matchPath(
    { path: "/dashboard/manageseedphrase/enterseedphrase" },
    location.pathname
  );
  const wantsToWipeNode = matchPath(
    { path: "/dashboard/manageseedphrase/enterseedphrase/wipethisnode" },
    location.pathname
  );
  const wantsToViewSeedPhrase = matchPath(
    { path: "/dashboard/manageseedphrase/viewseedphrase" },
    location.pathname
  );

  return (
    <>
      <SlideScreen
        display={
          !!wantsToEnterSeedPhrase ||
          !!wantsToWipeNode ||
          !!wantsToViewSeedPhrase
        }
      >
        <Outlet />
      </SlideScreen>
      <SlideScreen
        display={
          !wantsToEnterSeedPhrase && !wantsToWipeNode && !wantsToViewSeedPhrase
        }
      >
        <div className="flex flex-col h-full bg-black">
          <div className="flex flex-col h-full">
            <div
              onClick={() => navigate("/dashboard")}
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
            <div className="mt-6 text-2xl mb-8 text-left">
              Manage seed phrase
            </div>
            <div
              onClick={() => {
                if (!vaultLocked) {
                  return authNavigate(
                    "/dashboard/manageseedphrase/viewseedphrase",
                    [PERMISSIONS.CAN_VIEW_VIEWSEEDPHRASE]
                  );
                }
              }}
              className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer mb-4"
            >
              Show seed phrase
              {!!vaultLocked && (
                <div className="form-error-message absolute flex-row gap-2 right-0 top-0 h-full px-5 flex items-center">
                  Node locked
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                  >
                    <path
                      d="M2.3077 19.4999C1.81058 19.4999 1.38502 19.3229 1.03102 18.9689C0.677008 18.6149 0.5 18.1893 0.5 17.6922V8.30765C0.5 7.81053 0.677008 7.38498 1.03102 7.03098C1.38502 6.67696 1.81058 6.49995 2.3077 6.49995H3.5V4.49995C3.5 3.25125 3.93782 2.18908 4.81345 1.31345C5.6891 0.437817 6.75127 0 7.99997 0C9.24867 0 10.3108 0.437817 11.1865 1.31345C12.0621 2.18908 12.5 3.25125 12.5 4.49995V6.49995H13.6922C14.1894 6.49995 14.6149 6.67696 14.9689 7.03098C15.3229 7.38498 15.5 7.81053 15.5 8.30765V17.6922C15.5 18.1893 15.3229 18.6149 14.9689 18.9689C14.6149 19.3229 14.1894 19.4999 13.6922 19.4999H2.3077ZM7.99997 14.7499C8.48587 14.7499 8.89901 14.5797 9.23938 14.2393C9.57976 13.899 9.74995 13.4858 9.74995 12.9999C9.74995 12.514 9.57976 12.1009 9.23938 11.7605C8.89901 11.4201 8.48587 11.25 7.99997 11.25C7.51407 11.25 7.10094 11.4201 6.76058 11.7605C6.42019 12.1009 6.25 12.514 6.25 12.9999C6.25 13.4858 6.42019 13.899 6.76058 14.2393C7.10094 14.5797 7.51407 14.7499 7.99997 14.7499ZM4.99997 6.49995H11V4.49995C11 3.66662 10.7083 2.95828 10.125 2.37495C9.54164 1.79162 8.83331 1.49995 7.99997 1.49995C7.16664 1.49995 6.45831 1.79162 5.87497 2.37495C5.29164 2.95828 4.99997 3.66662 4.99997 4.49995V6.49995Z"
                      fill="#FF627E"
                    />
                  </svg>
                </div>
              )}
              {!vaultLocked && (
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
              )}
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-left">
                <div>
                  {!!vaultLocked && (
                    <div className="text-left">
                      <p className="text-sm password-label mr-4 ml-4 mb-4">
                        Unlock your node to view your seed phrase.
                      </p>
                    </div>
                  )}
                  {!vaultLocked && (
                    <div className="mb-3">
                      If you have lost your phone or do not have a valid backup,
                      you can import your seed phrase.
                      <br /> <br /> Your wallet and keys will be re-created and
                      all blocks downloaded from an archive node.
                    </div>
                  )}
                </div>
              </div>
              <div className="core-black-contrast-2 p-4 rounded">
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
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
                        onClick={() => setTooltip({ ...tooltip, host: false })}
                        content=" ip:port of the archive node to sync from. Use 'auto' to connect to a default archive node."
                        position={148}
                      />
                    </CSSTransition>

                    <Input
                      id="host"
                      name="host"
                      placeholder="Auto"
                      type="text"
                      value={formik.values.host}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <span className="mb-2 flex gap-2 items-center">
                      <div className="text-left">Key uses</div>
                      {!tooltip.keyuses && (
                        <img
                          className="w-4 h-4"
                          onClick={() =>
                            setTooltip({ ...tooltip, keyuses: true })
                          }
                          alt="tooltip"
                          src="./assets/help_filled.svg"
                        />
                      )}
                      {!!tooltip.keyuses && (
                        <img
                          className="w-4 h-4"
                          onClick={() =>
                            setTooltip({ ...tooltip, keyuses: false })
                          }
                          alt="tooltip-dismiss"
                          src="./assets/cancel_filled.svg"
                        />
                      )}
                    </span>

                    <CSSTransition
                      in={tooltip.keyuses}
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
                        onClick={() =>
                          setTooltip({ ...tooltip, keyuses: false })
                        }
                        content="How many times at most you used your keys. Your keys are used for signing every transaction you make. Every time you import your seed phrase this needs to be higher."
                        position={75}
                      />
                    </CSSTransition>
                    <Input
                      id="keyuses"
                      name="keyuses"
                      placeholder="Key uses"
                      type="number"
                      value={formik.values.keyuses}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                    />
                  </div>
                  {formik.status && (
                    <div className="text-sm form-error-message text-left">
                      {formik.status}
                    </div>
                  )}
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    onClick={() =>
                      authNavigate(
                        "/dashboard/manageseedphrase/enterseedphrase",
                        [PERMISSIONS.CAN_VIEW_ENTERSEEDPHRASE]
                      )
                    }
                  >
                    Import seed phrase
                  </Button>
                </form>
              </div>
              <div className="text-left">
                <p className="text-sm password-label mr-4 ml-4">
                  You should only re-sync from your own archive node or one from
                  a trusted source. <br /> <br /> For a successful restore, the
                  archive node used must have been started prior to the date
                  your coins were received.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlideScreen>
    </>
  );
};

export default ManageSeedPhrase;
