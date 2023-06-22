import { useNavigate } from "react-router-dom";
import Grid from "../UI/Grid";
import styles from "./Splash.module.css";

const Splash = () => {
  const navigate = useNavigate();
  return (
    <Grid
      fullHeight={true}
      header={<></>}
      content={
        <div className={styles["grid"]}>
          <div className="text-center">
            <img
              className="self-center inline mb-4"
              alt="app-icon"
              src="./assets/icon.svg"
            />
            <h6 className="text-2xl font-bold mb-6">Welcome to Security</h6>
            <p>
              Designed to help you keep your data <br /> and funds safe. <br />{" "}
              <br /> You can easily secure your node by locking your private
              keys and creating a backup regularly.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="core-grey-5 self-end mb-12 font-bold"
          >
            Continue
          </button>
        </div>
      }
    />
  );
};

export default Splash;
