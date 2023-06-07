import { useNavigate } from "react-router-dom";
import Grid from "../UI/Grid";

const Splash = () => {
  const navigate = useNavigate();
  return (
    <Grid
      fullHeight={true}
      header={<></>}
      content={
        <div className="grid h-full">
          <div className="justify-self-center self-center text-center gap-y-6 flex flex-col">
            <img
              className="self-center inline"
              alt="app-icon"
              src="./assets/icon.svg"
            />
            <h6 className="text-2xl">Welcome to Security</h6>
            <p>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="core-grey-5 self-end mb-12"
          >
            Continue
          </button>
        </div>
      }
      footer={<></>}
    />
  );
};

export default Splash;
