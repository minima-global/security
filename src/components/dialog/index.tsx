import { useContext, useEffect, useState } from "react";
import styles from "./Dialog.module.css";
import { appContext } from "../../AppContext";
import { useLocation } from "react-router-dom";

const Dialog = () => {
  const { modal } = useContext(appContext);
  const location = useLocation();
  const [error, setError] = useState<string | false>(false);

  useEffect(() => {
    if (location.state && location.state.hasOwnPropery("error")) {
      setError(location.state.error);
    }
  }, [location]);

  return (
    <>
      <div className={styles["dialog"]}>
        {modal.content}

        {modal.primaryActions && (
          <div className="flex flex-col gap-3">
            {!!error && (
              <div className="text-sm form-error-message text-left">
                {error}
              </div>
            )}
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
        <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
          {modal.secondaryActions}
        </div>
      )}
    </>
  );
};

export default Dialog;
