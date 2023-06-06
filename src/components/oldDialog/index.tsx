import { useContext } from "react";
import styles from "./Dialog.module.css";
import { appContext } from "../../AppContext";

interface IProps {
  buttonTitle: string;
  dismiss: boolean;
  primaryButtonAction: () => any;
  cancelAction?: () => void;
  primaryButtonDisable?: boolean;
}
const OldDialog = () => {
  const { modal } = useContext(appContext);

  return (
    <div>
      <div className={styles["backdrop"]} />
      <div className={styles["grid"]}>
        <header />
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div>
                {!!modal.title && modal.title}
                {!!modal.subtitle && modal.subtitle}
              </div>
              <div className={styles["button__wrapper"]}>
                <button
                  disabled={modal.primaryButtonDisable}
                  className={styles["primary"]}
                  type="button"
                  onClick={() => modal.primaryButtonAction()}
                >
                  {!!modal.buttonTitle && modal.buttonTitle}
                </button>
                {modal.dismiss && (
                  <button
                    className={styles["secondary"]}
                    type="button"
                    onClick={modal.cancelAction}
                  >
                    Go back
                  </button>
                )}
              </div>
            </div>
          </section>
        </main>
        <footer />
      </div>
    </div>
  );
};

export default OldDialog;
