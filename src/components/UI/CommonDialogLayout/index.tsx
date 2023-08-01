import styles from "./Layout.module.css";

interface StatusMessage {
  message: string;
  error: boolean;
  warning: boolean;
}
interface IProps {
  status?: StatusMessage;
  content: any;
  primaryActions: any;
  secondaryActions: any;
}

const CommonDialogLayout = ({
  status,
  content,
  primaryActions,
  secondaryActions,
}: IProps) => {
  return (
    <>
      <div>
        {content}

        {primaryActions && (
          <div className="flex flex-col gap-3">
            {!!status && (
              <div
                className={`text-sm form-${
                  status.error
                    ? "error"
                    : status.warning
                    ? "warning"
                    : "success"
                }-message text-left`}
              >
                {status.message}
              </div>
            )}
            <div className={`${styles.primaryActions}`}>{primaryActions}</div>

            {/* this button is rendered in the dialog but only for desktop */}
            {secondaryActions && (
              <div
                className={`${styles.desktop_only} ${styles.secondaryActions}`}
              >
                {secondaryActions}
              </div>
            )}
          </div>
        )}
      </div>
      {/* buttons area rendered only for mobile-view */}
      {secondaryActions && (
        <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
          {secondaryActions}
        </div>
      )}
    </>
  );
};

export default CommonDialogLayout;
