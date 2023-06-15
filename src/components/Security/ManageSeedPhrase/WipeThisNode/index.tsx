import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Dialog.module.css";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import * as utils from "../../../../utils";
import * as fM from "../../../../__minima__/libs/fileManager";
import * as rpc from "../../../../__minima__/libs/RPC";
import { useContext, useState } from "react";
import { appContext } from "../../../../AppContext";

const validationSchema = yup.object().shape({
  file: yup.mixed().required("Please select a backup file (.bak)"),
  password: yup.string().required("Please enter a password"),
});

const WipeThisNode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setModal } = useContext(appContext);

  const SomethingWentWrong = (error: string) => {
    return {
      content: (
        <div>
          <img alt="download" src="./assets/download.svg" />{" "}
          <h1 className="text-2xl mb-8">Something went wrong!</h1>
          <p>{error.length ? error : "Please go back and try again."}</p>
        </div>
      ),
      primaryActions: <div></div>,
      secondaryActions: <Button onClick={() => setModal(false)}>Close</Button>,
    };
  };
  const SuccessDialog = {
    content: (
      <div>
        <img alt="informative" src="./assets/error.svg" />{" "}
        <h1 className="text-2xl mb-4">Good news.</h1>
        <p>You have restored from backup!</p>
      </div>
    ),
    primaryActions: (
      <Button
        onClick={() => {
          setModal(false);
          navigate("/dashboard/restore");
        }}
      >
        Continue
      </Button>
    ),
    secondaryActions: null,
  };

  const formik = useFormik({
    initialValues: {
      keyuses: 1000,
    },
    onSubmit: async (formData) => {
      console.log("submitting!");
      try {
        rpc
          .importSeedPhrase(location.state.seedPhrase, "auto", formData.keyuses)
          .catch((err) => {
            throw err;
          });

        setModal({
          display: true,
          content: SuccessDialog.content,
          primaryActions: SuccessDialog.primaryActions,
          secondaryActions: null,
        });
      } catch (error: any) {
        console.error(error);

        const dialog = SomethingWentWrong(error);
        setModal({
          display: true,
          content: dialog.content,
          primaryActions: dialog.primaryActions,
          secondaryActions: dialog.secondaryActions,
        });
      }
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
                  />
                </form>
              </div>

              <div className="flex flex-col gap-3">
                <div className={`${styles.primaryActions}`}>
                  <Button
                    type="submit"
                    onClick={() => {
                      console.log("submitting");
                      try {
                        rpc
                          .importSeedPhrase(
                            location.state.seedPhrase,
                            "auto",
                            1000
                          )
                          .catch((err) => {
                            throw err;
                          });

                        setModal({
                          display: true,
                          content: SuccessDialog.content,
                          primaryActions: SuccessDialog.primaryActions,
                          secondaryActions: null,
                        });
                      } catch (error: any) {
                        console.error(error);

                        const dialog = SomethingWentWrong(error);
                        setModal({
                          display: true,
                          content: dialog.content,
                          primaryActions: dialog.primaryActions,
                          secondaryActions: dialog.secondaryActions,
                        });
                      }
                    }}
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
