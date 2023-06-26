import { useContext, useEffect, useState } from "react";
import SlideScreen from "../../../UI/SlideScreen";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";

import { useAuth } from "../../../../providers/authProvider";
import PERMISSIONS from "../../../../permissions";
import BackButton from "../../../UI/BackButton";
import { appContext } from "../../../../AppContext";

import { CSSTransition } from "react-transition-group";
import Tooltip from "../../../UI/Tooltip";

import styles from "../ManageSeed.module.css";

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
  keyuses: yup
    .number()
    .required(
      "Please enter the maximum times you have signed a transaction.  Otherwise leave the default 1000 if you think you haven't signed over 1000 transactions"
    ),
});

const ImportSeedPhrase = () => {
  const { setBackButton, displayBackButton: displayHeaderBackButton } =
    useContext(appContext);
  const { authNavigate } = useAuth();
  const location = useLocation();
  const wipeThisNode = matchPath(
    "/dashboard/manageseedphrase/enterseedphrase/wipethisnode",
    location.pathname
  );

  const [tooltip, setTooltip] = useState({ host: false, keyuses: false });

  useEffect(() => {
    setBackButton({
      display: true,
      to: "/dashboard/manageseedphrase",
      title: "Security",
    });
  }, [location]);

  const formik = useFormik({
    initialValues: {
      host: "auto",
      keyuses: 1000,
    },
    onSubmit: (formData) => {
      authNavigate(
        "/dashboard/manageseedphrase/enterseedphrase",
        [PERMISSIONS.CAN_VIEW_ENTERSEEDPHRASE],
        { state: { host: formData.host, keyuses: formData.keyuses } }
      );
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <SlideScreen display={!!wipeThisNode}>
        <Outlet />
      </SlideScreen>
      <SlideScreen display={!wipeThisNode}>
        <div className="h-full bg-black px-4 pb-4">
          {!displayHeaderBackButton && (
            <BackButton to="/dashboard/manageseedphrase" title="Security" />
          )}
          <div className="mt-6 text-2xl mb-8 text-left">Import seed phrase</div>

          <div className="flex flex-col gap-5">
            <div>
              <form onSubmit={formik.handleSubmit}>
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
                          onClick={() =>
                            setTooltip({ ...tooltip, host: false })
                          }
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
                        error={
                          formik.touched.host && formik.errors.host
                            ? formik.errors.host
                            : false
                        }
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
                        error={
                          formik.touched.keyuses && formik.errors.keyuses
                            ? formik.errors.keyuses
                            : false
                        }
                      />
                    </div>
                    {formik.status && (
                      <div className="text-sm form-error-message text-left">
                        {formik.status}
                      </div>
                    )}
                  </form>
                </div>
                <div className="text-left">
                  <p className="text-sm password-label mt-4 mr-4 ml-4">
                    You should only re-sync from your own archive node or one
                    from a trusted source. <br /> <br /> For a successful
                    restore, the archive node used must have been started prior
                    to the date your coins were received.
                  </p>
                </div>
                <div className="mt-6 desktop-only">
                  <Button
                    disabled={!formik.isValid}
                    onClick={formik.handleSubmit}
                  >
                    Next
                  </Button>
                </div>

                {formik.status && (
                  <div className="text-sm form-error-message text-left">
                    {formik.status}
                  </div>
                )}
              </form>
            </div>
            <div className="mobile-only">
              <Button
                disabled={!formik.isValid || formik.isSubmitting}
                onClick={formik.handleSubmit}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </SlideScreen>
    </>
  );
};

export default ImportSeedPhrase;
