import { useContext } from "react";
import styles from "./Dialog.module.css";
import { appContext } from "../../AppContext";

const Dialog = () => {
  const { modal } = useContext(appContext);
  console.log("Rendering modal with properties", modal);
  return (
    <div>
      <div className={styles["backdrop"]}></div>
      <div className={styles["grid"]}>
        <header></header>
        <main>
          <section>
            <div className={styles["dialog"]}>
              {modal.content}

              {modal.primaryActions && (
                <div className={`${styles.primaryActions}`}>
                  {modal.primaryActions}
                </div>
              )}
              {/* this button is rendered in the dialog but only for desktop */}
              {modal.secondaryActions && (
                <div
                  className={`${styles.desktop_only} ${styles.secondaryActions}`}
                >
                  {modal.secondaryActions}
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
