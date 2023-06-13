import { useContext } from "react";
import { appContext } from "../../AppContext";

import styles from "./ReadMode.module.css";
import SlideScreen from "../../components/UI/SlideScreen";

export function AppIsInReadMode() {
  const { appIsInWriteMode } = useContext(appContext);
  const display = appIsInWriteMode === false;

  return (
    <SlideScreen display={!display}>
      <div>
        <div className={styles["backdrop"]}></div>
        <div className={styles["grid"]}>
          <header></header>
          <main>
            <section>
              <div className={styles["dialog"]}>
                <div>
                  <img alt="download" src="./assets/read.svg" />{" "}
                  <h1 className="text-2xl mb-8">App is in read mode</h1>
                  <p>
                    Please ensure you set the Security minidapp in write mode
                    then reload this page.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className={`${styles.primaryActions}`}></div>

                  {/* this button is rendered in the dialog but only for desktop */}
                  <div
                    className={`${styles.desktop_only} ${styles.secondaryActions}`}
                  >
                    <button onClick={() => window.location.reload()}>
                      Reload
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`${styles.mobile_only} ${styles.secondaryActions}`}
              >
                <button onClick={() => window.location.reload()}>Reload</button>
              </div>
            </section>
          </main>
          <footer></footer>
        </div>
      </div>
    </SlideScreen>
  );
}

export default AppIsInReadMode;
