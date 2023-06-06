import styles from "./Dialog.module.css";
import { useTransition, animated } from "@react-spring/web";
import { modalAnimation } from "../../animations";
import { useContext } from "react";
import { appContext } from "../../AppContext";

interface IProps {
  title: any;
  subtitle: any;
  buttonTitle: string;
  dismiss: boolean;
  primaryButtonAction: () => any;
  cancelAction?: () => void;
  primaryButtonDisable?: boolean;
}
const Dialog = ({
  title,
  subtitle,
  buttonTitle,
  dismiss,
  cancelAction,
  primaryButtonAction,
  primaryButtonDisable = false,
}: IProps) => {
  const { modal, setModal } = useContext(appContext);
  const transition: any = useTransition(modal?.display, modalAnimation as any);

  return (
    <div>
      {transition(
        (style, display) =>
          display && (
            <div>
              <div className={styles["backdrop"]} />
              <div className={styles["grid"]}>
                <header />
                <main>
                  <section>
                    <animated.div className={style}>
                      <div className={styles["dialog"]}>
                        <div>
                          {!!title && title}
                          {subtitle}
                        </div>
                        <div className={styles["button__wrapper"]}>
                          <button
                            disabled={primaryButtonDisable}
                            className={styles["primary"]}
                            type="button"
                            onClick={() => primaryButtonAction()}
                          >
                            {buttonTitle}
                          </button>
                          {dismiss && (
                            <button
                              className={styles["secondary"]}
                              type="button"
                              onClick={cancelAction}
                            >
                              Go back
                            </button>
                          )}
                        </div>
                      </div>
                    </animated.div>
                  </section>
                </main>
                <footer />
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Dialog;
