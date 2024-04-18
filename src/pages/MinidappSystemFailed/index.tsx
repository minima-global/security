import { useContext } from "react";
import { appContext } from "../../AppContext";

import styles from "./ReadMode.module.css";
import useIsMinimaBrowser from "../../hooks/useIsMinimaBrowser";

export function MinidappSystemFailed() {
  const { minidappSystemFailed } = useContext(appContext);
  const isMinimaBrowser = useIsMinimaBrowser();
  const display = minidappSystemFailed === true;

  return (
    display && (
      <div>
        <div className={styles["backdrop"]}></div>
        <div className={styles["grid"]}>
          <header></header>
          <main>
            <section>
              <div className={styles["dialog"]}>
                <div className="flex flex-col items-center justify-center">
                  <svg
                    width="116"
                    height="116"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M315.717 217.542L328.832 159.576L387.722 183.267L371.138 256.529C365.845 257.805 360.974 261.126 357.875 266.494L306.544 355.402H284.569L267.797 285.338L252.034 355.402H187.722L173.724 273.24L155.187 355.402H91L151.53 88L210.294 111.691L224.292 193.852L240.181 123.788L298.945 147.605L315.717 217.542Z"
                      fill="white"
                    />
                    <path
                      d="M368.012 270.337L348.756 355.402H318.74L367.022 271.775C367.32 271.258 367.652 270.778 368.012 270.337Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M385.315 271.775C381.25 264.734 371.087 264.734 367.022 271.775L306.653 376.337C302.588 383.378 307.669 392.18 315.8 392.18H436.537C444.668 392.18 449.749 383.378 445.684 376.337L385.315 271.775ZM371.809 371.083C373.168 372.442 374.801 373.121 376.709 373.121C378.617 373.121 380.251 372.442 381.61 371.083C382.968 369.724 383.648 368.091 383.648 366.183C383.648 364.275 382.968 362.641 381.61 361.282C380.251 359.924 378.617 359.244 376.709 359.244C374.801 359.244 373.168 359.924 371.809 361.282C370.45 362.641 369.771 364.275 369.771 366.183C369.771 368.091 370.45 369.724 371.809 371.083ZM369.771 310.675V352.306H383.648V310.675H369.771Z"
                      fill="white"
                    />
                  </svg>
                  <h1 className="text-2xl mb-8">Minidapp System is offline</h1>
                  <p className="text-center">Try to re-login into your hub and re-open this app.</p>
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
    )
  );
}

export default MinidappSystemFailed;
