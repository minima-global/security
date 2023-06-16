import styles from "./Dialog.module.css";
import Button from "../../UI/Button";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { appContext } from "../../../AppContext";
import { useEffect, createRef, useCallback } from "react";

import SlideScreen from "../../UI/SlideScreen";

import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";
import Logs from "../../Logs";

const ResyncDialog = () => {
  const navigate = useNavigate();

  return (
    <SlideScreen display={true}>
      <div className={styles["backdrop"]}></div>
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
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
              <Button
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Cancel
              </Button>
            </div>
          </section>
        </main>
        <footer></footer>
      </div>
    </SlideScreen>
  );
};

export default ResyncDialog;
