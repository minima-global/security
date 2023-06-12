import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./Dialog.module.css";
import Button from "../../../UI/Button";
import { useContext } from "react";
import { appContext } from "../../../../AppContext";
import { useEffect, createRef, useCallback } from "react";

const ResyncDialog = () => {
  const navigate = useNavigate();
  const { logs, setLogs } = useContext(appContext);
  const ref = createRef<HTMLDivElement>();
  const { finishLoading, resyncStatus, error }: any = useOutletContext();

  const scrollToBottomOfList = useCallback(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView!({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [ref]);

  useEffect(() => {
    setLogs([]);
  }, [navigate]);

  useEffect(() => {
    scrollToBottomOfList();
  }, [logs]);

  return (
    <div>
      <div className={styles["backdrop"]}></div>
      <div className={styles["grid"]}>
        <header></header>
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div>
                {resyncStatus && (
                  <h1 className="text-2xl mb-4">Re-sync in progress</h1>
                )}
                {error && (
                  <h1 className="text-2xl mb-4">Re-sync not started</h1>
                )}
                {error && <p className="mb-12">{error}</p>}
                {resyncStatus && (
                  <p className="mb-12">
                    Please don’t leave this screen whilst the chain is
                    re-syncing.
                    <br /> <br />
                    Your node will reboot once it is complete.
                  </p>
                )}
                {resyncStatus && (
                  <ul className="max-h-[25vh] pt-4 pb-4 break-all core-black-contrast p-4 text-left overflow-y-scroll">
                    {logs.length ? (
                      logs.map((l, i) => <li key={i}>{l}</li>)
                    ) : (
                      <li>Loading logs...</li>
                    )}

                    <div ref={ref} className="pt-2" />
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div></div>
                <div
                  className={`${styles.desktop_only} ${styles.secondaryActions}`}
                >
                  <Button
                    onClick={() => {
                      navigate("/dashboard/resync");
                      finishLoading();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
              <Button
                onClick={() => {
                  navigate("/dashboard/resync");
                  finishLoading();
                }}
              >
                Cancel
              </Button>
            </div>
          </section>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default ResyncDialog;
