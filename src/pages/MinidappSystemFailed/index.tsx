import { useContext } from "react";
import { appContext } from "../../AppContext";

import styles from "./ReadMode.module.css";
import FadeIn from "../../components/UI/Animations/FadeIn";
import useIsMinimaBrowser from "../../hooks/useIsMinimaBrowser";

export function MinidappSystemFailed() {
  const { minidappSystemFailed } = useContext(appContext);
  const isMinimaBrowser = useIsMinimaBrowser();
  const display = minidappSystemFailed === true;

  return (
    <FadeIn delay={100} isOpen={display}>
      <div>
        <div className={styles["backdrop"]}></div>
        <div className={styles["grid"]}>
          <header></header>
          <main>
            <section>
              <div className={styles["dialog"]}>
                <div>
                  <img className="mb-4" alt="download" src="./assets/mds.svg" />
                  <h1 className="text-2xl mb-8">Minidapp System is offline</h1>
                  <p>Try to re-login into your hub and re-open this app.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className={`${styles.primaryActions}`}></div>

                  {/* this button is rendered in the dialog but only for desktop */}
                  <div
                    className={`${styles.desktop_only} ${styles.secondaryActions}`}
                  >
                    <button
                      onClick={() => {
                        return window.close();
                      }}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`${styles.mobile_only} ${styles.secondaryActions}`}
              >
                <button
                  onClick={() => {
                    if (isMinimaBrowser) {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      return Android.closeWindow();
                    }

                    return window.close();
                  }}
                >
                  Close Window
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </FadeIn>
  );
}

export default MinidappSystemFailed;
