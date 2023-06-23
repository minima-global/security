import { useNavigate } from "react-router-dom";

import styles from "./Splash.module.css";
import useGetInnerHeight from "../../hooks/useGetInnerHeight";

const Splash = () => {
  const navigate = useNavigate();
  const height = useGetInnerHeight();

  return (
    <div className={styles["grid-layout"]} style={{ height: `${height}px` }}>
      <header></header>

      <main>
        <section className="!h-screen px-4 pb-4">
          <div className={styles["grid"]}>
            <div className="text-center px-4 pb-4">
              <img
                className="self-center inline mb-4"
                alt="app-icon"
                src="./assets/icon.svg"
              />
              <h6 className="text-2xl font-bold mb-6">Welcome to Security</h6>
              <p>
                Designed to help you keep your data and funds safe. <br />{" "}
                <br />
                You can easily secure your node by locking your private keys and
                creating a backup regularly.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="core-black-contrast-2 core-grey-5 self-end mb-12 font-bold"
            >
              Continue
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Splash;
