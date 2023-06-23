import styles from "./Dialog.module.css";
import Button from "../../../UI/Button";
import { useFormik } from "formik";

import * as rpc from "../../../../__minima__/libs/RPC";
import { useLocation, useNavigate } from "react-router-dom";
import PERMISSIONS from "../../../../permissions";
import { useAuth } from "../../../../providers/authProvider";

const WipeThisNode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authNavigate } = useAuth();
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      formik.setStatus(undefined);
      //  Run RPC..
      rpc
        .importSeedPhrase(
          location.state.seedPhrase,
          location.state.host,
          location.state.keyuses
        )
        .catch(() => {
          formik.setStatus("Something went wrong, please try again.");

          setTimeout(() => formik.setStatus(undefined), 2500);
        });
      authNavigate("/dashboard/resyncing", [PERMISSIONS.CAN_VIEW_RESYNCING]);
    },
  });

  return (
    <div>
      <div className={styles["backdrop"]}></div>
      <div className={styles["grid"]}>
        <header></header>
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div>
                <h1 className="text-2xl mb-8">Wipe this node?</h1>
                <p>
                  This node will be wiped and recreated <br /> with the given
                  seed phrase.
                  <br /> <br /> This process can take up to 2 hours, <br />{" "}
                  please connect your device to a power source before you
                  continue.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className={`${styles.primaryActions}`}>
                  {formik.status && (
                    <div className="text-sm form-error-message text-left">
                      {formik.status}
                    </div>
                  )}
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    type="submit"
                    onClick={() => formik.submitForm()}
                  >
                    Start re-sync
                  </Button>
                </div>
                <div
                  className={`${styles.desktop_only} ${styles.secondaryActions}`}
                >
                  <Button
                    disabled={formik.isSubmitting}
                    onClick={() =>
                      navigate("/dashboard/manageseedphrase/enterseedphrase")
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
              <Button
                disabled={formik.isSubmitting}
                onClick={() =>
                  navigate("/dashboard/manageseedphrase/enterseedphrase")
                }
              >
                Cancel
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default WipeThisNode;
