import styles from "./Dialog.module.css";
import Button from "../../UI/Button";
import { useLocation, useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";
import Logs from "../../Logs";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../AppContext";
import { useAuth } from "../../../providers/authProvider";
import PERMISSIONS from "../../../permissions";
import { useArchiveContext } from "../../../providers/archiveProvider";

const ResyncDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { authNavigate } = useAuth();
  const { shuttingDown, setModal } = useContext(appContext);
  const {
    userWantsToArchiveReset,
    deleteLastUploadedArchive,
    resetArchiveContext,
    archiveFileToUpload,
  } = useArchiveContext();
  const [error, setError] = useState<false | string>(false);

  useEffect(() => {
    if (location.state && location.state.error) {
      setError(
        typeof location.state.error === "string"
          ? location.state.error
          : "Something went wrong, please try again."
      );
    }
  }, [location]);

  useEffect(() => {
    if (shuttingDown) {
      setModal({
        content: (
          <div>
            <svg
              className="mb-3 inline"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_1102_25908"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="64"
                height="64"
              >
                <rect width="64" height="64" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1102_25908)">
                <path
                  d="M28.2157 43.3436L46.1438 25.4154L43.3336 22.6052L28.2157 37.7232L20.6157 30.1232L17.8055 32.9334L28.2157 43.3436ZM32.0047 57.3333C28.5009 57.3333 25.2075 56.6684 22.1245 55.3386C19.0414 54.0088 16.3596 52.2042 14.079 49.9246C11.7984 47.645 9.99288 44.9644 8.66253 41.8827C7.33217 38.801 6.66699 35.5083 6.66699 32.0045C6.66699 28.5007 7.33188 25.2072 8.66166 22.1242C9.99144 19.0411 11.7961 16.3593 14.0757 14.0788C16.3553 11.7981 19.0359 9.99264 22.1176 8.66228C25.1992 7.33193 28.492 6.66675 31.9958 6.66675C35.4996 6.66675 38.793 7.33164 41.8761 8.66142C44.9591 9.9912 47.641 11.7959 49.9215 14.0754C52.2022 16.355 54.0076 19.0357 55.338 22.1174C56.6684 25.199 57.3335 28.4917 57.3335 31.9956C57.3335 35.4994 56.6686 38.7928 55.3389 41.8758C54.0091 44.9589 52.2044 47.6407 49.9249 49.9213C47.6453 52.2019 44.9646 54.0074 41.8829 55.3378C38.8013 56.6681 35.5085 57.3333 32.0047 57.3333Z"
                  fill="#F4F4F5"
                />
              </g>
            </svg>

            <h1 className="text-2xl mb-4 font-semibold">Re-sync complete</h1>
            <p className="font-medium mb-6 mt-6">
              Your node was successfully re-synced and will shutdown. Restart
              Minima for the re-sync to take effect.
            </p>
          </div>
        ),
        primaryActions: <div />,
        secondaryActions: (
          <Button
            onClick={() => {
              if (window.navigator.userAgent.includes("Minima Browser")) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return Android.shutdownMinima();
              }

              return window.close();
            }}
          >
            Close application
          </Button>
        ),
      });
      authNavigate("/dashboard/modal", PERMISSIONS["CAN_VIEW_MODAL"]);
    }
  }, [shuttingDown]);

  return (
    <div className="grid">
      <div className={styles["dialog"]}>
        <div className="flex flex-col align-center">
          {!error && (
            <>
              <Lottie
                className="mb-4"
                style={{ width: 40, height: 40, alignSelf: "center" }}
                animationData={Loading}
              />
              <h1 className="text-2xl mb-8">Re-syncing</h1>

              <p className="mb-8">
                Please don’t leave this screen whilst the chain is re-syncing.
                <br /> <br />
                Your node will reboot once it is complete.
              </p>

              <Logs />
            </>
          )}

          {!!error && (
            <>
              <svg
                className="mb-4 inline self-center"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_594_13339"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                >
                  <rect width="64" height="64" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_594_13339)">
                  <path
                    d="M31.9998 44.6151C32.61 44.6151 33.1216 44.4087 33.5344 43.9959C33.9472 43.5831 34.1536 43.0715 34.1536 42.4613C34.1536 41.851 33.9472 41.3395 33.5344 40.9267C33.1216 40.5139 32.61 40.3075 31.9998 40.3075C31.3895 40.3075 30.878 40.5139 30.4652 40.9267C30.0524 41.3395 29.846 41.851 29.846 42.4613C29.846 43.0715 30.0524 43.5831 30.4652 43.9959C30.878 44.4087 31.3895 44.6151 31.9998 44.6151ZM29.9998 34.8716H33.9997V18.8716H29.9998V34.8716ZM32.0042 57.333C28.5004 57.333 25.207 56.6682 22.124 55.3384C19.0409 54.0086 16.3591 52.2039 14.0785 49.9244C11.7979 47.6448 9.99239 44.9641 8.66204 41.8824C7.33168 38.8008 6.6665 35.5081 6.6665 32.0042C6.6665 28.5004 7.33139 25.207 8.66117 22.124C9.99095 19.0409 11.7956 16.3591 14.0752 14.0785C16.3548 11.7979 19.0354 9.9924 22.1171 8.66204C25.1987 7.33168 28.4915 6.6665 31.9953 6.6665C35.4991 6.6665 38.7926 7.3314 41.8756 8.66117C44.9586 9.99095 47.6405 11.7956 49.921 14.0752C52.2017 16.3548 54.0072 19.0354 55.3375 22.1171C56.6679 25.1988 57.333 28.4915 57.333 31.9953C57.333 35.4991 56.6682 38.7925 55.3384 41.8756C54.0086 44.9586 52.2039 47.6405 49.9244 49.921C47.6448 52.2017 44.9641 54.0072 41.8824 55.3375C38.8008 56.6679 35.5081 57.333 32.0042 57.333Z"
                    fill="#F4F4F5"
                  />
                </g>
              </svg>

              <h1 className="text-2xl mb-8">Re-syncing failed.</h1>

              <p className="mb-8">{error}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className={`${styles.desktop_only} ${styles.secondaryActions}`}>
            {error && (
              <Button
                onClick={() => {
                  navigate("/dashboard");
                  if (userWantsToArchiveReset) {
                    resetArchiveContext();
                    if (archiveFileToUpload) {
                      deleteLastUploadedArchive(
                        "/fileupload/" + archiveFileToUpload.name
                      );
                    }
                  }
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${styles.actions} ${styles.mobile_only} ${styles.secondaryActions}`}
      >
        {error && (
          <Button
            onClick={() => {
              navigate("/dashboard");
              if (userWantsToArchiveReset) {
                resetArchiveContext();
                if (archiveFileToUpload) {
                  deleteLastUploadedArchive(
                    "/fileupload/" + archiveFileToUpload.name
                  );
                }
              }
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResyncDialog;
