import { useContext, useState } from "react";
import styles from "./DeleteBackup.module.css";

import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../../providers/authProvider";
import Button from "../../../../UI/Button";

import * as fileManager from "../../../../../__minima__/libs/fileManager";
import { appContext } from "../../../../../AppContext";

const DeleteBackup = () => {
  const location = useLocation();
  const [error, setError] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);
  const { getBackups } = useContext(appContext);
  const { authNavigate } = useAuth();

  const handleClick = async () => {
    setLoading(true);
    await fileManager
      .deleteFile("/backups/" + location.state.backup.name)
      .then(() => {
        getBackups();
        authNavigate("/dashboard/backup/backups", []);
      })
      .catch((error) => {
        setTimeout(() => setLoading(false), 1500);
        setError(error);
      });
  };

  return (
    <>
      <div className={styles["dialog"]}>
        <div>
          <svg
            className="inline mb-2"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="65"
            viewBox="0 0 64 65"
            fill="none"
          >
            <g id="delete">
              <mask
                id="mask0_1422_18346"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="64"
                height="65"
              >
                <rect
                  id="Bounding box"
                  y="0.5"
                  width="64"
                  height="64"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_1422_18346)">
                <path
                  id="delete_2"
                  d="M20.3083 53.8333C19.081 53.8333 18.0562 53.4222 17.234 52.6C16.4118 51.7778 16.0007 50.753 16.0007 49.5257V16.5H13.334V13.8333H24.0007V11.782H40.0006V13.8333H50.6673V16.5H48.0006V49.5257C48.0006 50.753 47.5895 51.7778 46.7673 52.6C45.9451 53.4222 44.9203 53.8333 43.693 53.8333H20.3083ZM26.1545 45.8333H28.8212V21.8333H26.1545V45.8333ZM35.1801 45.8333H37.8468V21.8333H35.1801V45.8333Z"
                  fill="#F9F9FA"
                />
              </g>
            </g>
          </svg>
          <h1 className="text-2xl mb-1">Delete this backup?</h1>
          <p className="text-xl mb-9 text-core-grey-80 ">
            {location.state.backup.name}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {!!error && (
            <div className="text-sm form-error-message text-left">{error}</div>
          )}
          <div className={`${styles.primaryActions}`}>
            <Button disabled={loading} onClick={handleClick}>
              {!loading ? "Delete backup" : "Deleting..."}
            </Button>
          </div>

          {/* this button is rendered in the dialog but only for desktop */}
          <div className={`${styles.desktop_only} ${styles.secondaryActions}`}>
            {!loading && (
              <Button
                variant="tertiary"
                onClick={() => authNavigate("/dashboard/backup/backups", [])}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* buttons area rendered only for mobile-view */}
      <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
        {!loading && (
          <Button
            variant="tertiary"
            onClick={() => authNavigate("/dashboard/backup/backups", [])}
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
};

export default DeleteBackup;
