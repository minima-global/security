import { Outlet } from "react-router-dom";
import AppIsInReadMode from "../AppInReadMode";
import MinidappSystemFailed from "../MinidappSystemFailed";
import { useContext } from "react";
import { appContext } from "../../AppContext";
import BackButton from "../../components/UI/BackButton";
import useCanUseTitleBar from "../../hooks/useCanUseTitleBar";
import FileUpload from "../../components/FileUpload";

const Brand = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] px-3">
      <div className="my-auto">
        <img
          className="w-[32px]"
          alt="security-icon"
          src="./assets/security.svg"
        />
      </div>
      <span className="font-bold ml-2 my-auto">Security</span>
    </div>
  );
};

const Dashboard = () => {
  const { displayBackButton, backButton } = useContext(appContext);
  const openTitleBar = useCanUseTitleBar();

  const DISPLAY_BACK_BUTTON = displayBackButton && displayBackButton.display;
  return (
    <>
      <AppIsInReadMode />
      <MinidappSystemFailed />
      <FileUpload />

      <div className="grid grid-rows-[56px_1fr] h-[100vh]">
        <header
          onClick={openTitleBar}
          className="grid grid-cols-[1fr_minmax(0,_860px)_1fr]"
        >

          <div/>

          <div className="py-3">
            {DISPLAY_BACK_BUTTON && (
              <div className="flex items-center px-6 py-3 gap-3">
                <BackButton
                  to={backButton.to}
                  onClickHandler={backButton.onClickHandler}
                  title={backButton.title}
                />
              </div>
            )}
            

            {!DISPLAY_BACK_BUTTON && <Brand />}
          </div>

          <div />
        </header>
        <main className="grid grid-cols-[1fr_minmax(0,_560px)_1fr]">
          <div />
          <div>
            <Outlet />
          </div>
          <div />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
