import styles from "./Dialog.module.css";
import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";
import Logs from "../../Logs";
import { useContext, useEffect } from "react";
import { appContext } from "../../../AppContext";

const ResyncDialog = () => {
  const navigate = useNavigate();

  const { isMobile, restoreFinished, setModal } = useContext(appContext);

  useEffect(() => {
    if (restoreFinished) {
      setModal({
        display: true,
        content: SuccessDialog.content,
        primaryActions: SuccessDialog.primaryActions,
        secondaryActions: null,
      });
    }
  }, [restoreFinished]);

  const SuccessDialog = {
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

        <h1 className="text-2xl mb-4 font-semibold">Re-sync complete</h1>
        <p className="font-medium mb-6">
          Your node was successfully re-synced and will shutdown. Restart Minima
          for the re-sync to take effect.
        </p>
        <Button
          onClick={() => {
            if (isMobile) {
              // @ts-ignore
              return Android.closeWindow();
            }

            return window.close();
          }}
        >
          Close application
        </Button>
      </div>
    ),
    primaryActions: <div></div>,
    secondaryActions: null,
  };

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
