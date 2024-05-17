import { Outlet } from "react-router-dom";
import AppIsInReadMode from "../AppInReadMode";
import MinidappSystemFailed from "../MinidappSystemFailed";
import { useContext } from "react";
import { appContext } from "../../AppContext";
import BackButton from "../../components/UI/BackButton";
import useCanUseTitleBar from "../../hooks/useCanUseTitleBar";

const Brand = () => {
  return (
    <div className="grid grid-cols-[auto_1fr]">
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

  return (
    <>
      <AppIsInReadMode />
      <MinidappSystemFailed />

      <div className="grid grid-rows-[56px_1fr] h-[100vh]">
        <header
          onClick={openTitleBar}
          className="max-w-sm mx-auto my-auto w-full"
        >
          <div className="flex items-start justify-start">
            {!!displayBackButton && !!backButton.display && (
              <div className="flex items-center px-6 py-3 gap-3">
                <BackButton
                  to={backButton.to}
                  onClickHandler={backButton.onClickHandler}
                  title={backButton.title}
                />
              </div>
            )}
            {!!displayBackButton && !backButton.display && <Brand />}

            {!displayBackButton && <Brand />}
          </div>
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
