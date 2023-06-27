import styles from "./Dialog.module.css";
import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";
import Logs from "../../Logs";

const ResyncDialog = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles["backdrop"]} />
      <div className={styles["grid"]}>
        <header></header>
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div className="flex flex-col align-center">
                <Lottie
                  className="mb-4"
                  style={{ width: 40, height: 40, alignSelf: "center" }}
                  animationData={Loading}
                />
                <h1 className="text-2xl mb-8">Re-syncing</h1>

                <p className="mb-8">
                  Please don’t leave this screen whilst the chain is re-syncing.
                  <br /> <br />
                  Your node will reboot once it is complete.
                </p>

                <Logs />
              </div>

              <div className="flex flex-col gap-3">
                <div
                  className={`${styles.desktop_only} ${styles.secondaryActions}`}
                >
                  <Button
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                  >
                    Run in background
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`${styles.actions} ${styles.mobile_only} ${styles.secondaryActions}`}
            >
              <Button
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Run in background
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ResyncDialog;
