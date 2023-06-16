import styles from "./Dialog.module.css";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import * as rpc from "../../../../__minima__/libs/RPC";
import { useLocation, useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  keyuses: yup
    .number()
    .required(
      "Please enter the maximum times you have signed a transaction.  Otherwise leave the default 1000 if you think you haven't signed over 1000 transactions."
    ),
});

const WipeThisNode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formik = useFormik({
    initialValues: {
      keyuses: 1000,
    },
    onSubmit: (formData) => {
      formik.setStatus(undefined);
      //  Run RPC..
      rpc
        .importSeedPhrase(location.state.seedPhrase, "auto", formData.keyuses)
        .catch(() => {
          return formik.setStatus("Something went wrong, please try again.");
        });
      navigate("/dashboard/resyncing");
    },
    validationSchema: validationSchema,
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
                <h1 className="text-2xl mb-4">Wipe this node?</h1>
                <p className="mb-12">
                  This node will be wiped and recreated <br /> with the given
                  seed phrase.
                  <br /> <br /> This process can take up to 2 hours, <br />{" "}
                  please connect your device to a power source before you
                  continue.
                </p>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-4"
                  onSubmit={formik.handleSubmit}
                >
                  <Input
                    extraClass="core-grey-20"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Key uses"
                    type="text"
                    id="keyuses"
                    name="keyuses"
                    value={formik.values.keyuses}
                    error={
                      formik.touched.keyuses && formik.errors.keyuses
                        ? formik.errors.keyuses
                        : false
                    }
                  />
                </form>
              </div>

              <div className="flex flex-col gap-3">
                <div className={`${styles.primaryActions}`}>
                  {formik.status && (
                    <div className="text-sm form-error-message text-left">
                      {formik.status}
                    </div>
                  )}
                  <Button
                    disabled={!formik.isValid}
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
                onClick={() =>
                  navigate("/dashboard/manageseedphrase/enterseedphrase")
                }
              >
                Cancel
              </Button>
            </div>
          </section>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default WipeThisNode;
