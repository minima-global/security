import { useContext } from "react";
import styles from "./Dialog.module.css";
import { appContext } from "../../AppContext";
import useGetInnerHeight from "../../hooks/useGetInnerHeight";

const Dialog = () => {
  const { modal } = useContext(appContext);
  const height = useGetInnerHeight();

  return (
    <div>
      <div className={styles["backdrop"]}></div>
      <div className={styles["grid"]} style={{ height: `${height}px` }}>
        <header></header>
        <main>
          <section>
            <div className={styles["dialog"]}>
              {modal.content}

              {modal.primaryActions && (
                <div className="flex flex-col gap-3">
                  <div className={`${styles.primaryActions}`}>
                    {modal.primaryActions}
                  </div>

                  {/* this button is rendered in the dialog but only for desktop */}
                  {modal.secondaryActions && (
                    <div
                      className={`${styles.desktop_only} ${styles.secondaryActions}`}
                    >
                      {modal.secondaryActions}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* buttons area rendered only for mobile-view */}
            {modal.secondaryActions && (
              <div
                className={`${styles.mobile_only} ${styles.secondaryActions}`}
              >
                {modal.secondaryActions}
              </div>
            )}
          </section>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default Dialog;
