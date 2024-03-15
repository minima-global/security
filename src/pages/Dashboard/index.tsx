import { Outlet } from "react-router-dom";
import AppIsInReadMode from "../AppInReadMode";
import MinidappSystemFailed from "../MinidappSystemFailed";
import { useContext } from "react";
import { appContext } from "../../AppContext";
import BackButton from "../../components/UI/BackButton";
import useCanUseTitleBar from "../../hooks/useCanUseTitleBar";

const Dashboard = () => {
  const { displayBackButton, backButton } = useContext(appContext);
  const openTitleBar  = useCanUseTitleBar();  

  return (
    <>
      <AppIsInReadMode />
      <MinidappSystemFailed />

      <div className="grid grid-rows-[56px_1fr] h-[100vh]">
        <header onClick={openTitleBar} className="grid grid-cols-[1fr_minmax(0,_560px)_1fr]">
          <div />
          <div className="flex justify-between items-center">
            {!!displayBackButton && !!backButton.display && (
              <div className="flex items-center px-6 py-3 gap-3">
                <BackButton
                  to={backButton.to}
                  onClickHandler={backButton.onClickHandler}
                  title={backButton.title}
                />
              </div>
            )}
            {!!displayBackButton && !backButton.display && (
              <div className="flex items-center px-6 py-3">
                <img
                  className="w-8 h-8 mr-3"
                  alt="security-icon"
                  src="./assets/security.svg"
                />
                <span className="font-bold text-lg">Security</span>
              </div>
            )}

            {!displayBackButton && (
              <div className="flex items-center px-6 py-3">
                <img
                  className="w-8 h-8 mr-3"
                  alt="security-icon"
                  src="./assets/security.svg"
                />
                <span className="font-bold text-lg">Security</span>
              </div>
            )}
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
