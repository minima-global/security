import { useContext, useEffect, useState } from "react";
import { appContext } from "../../AppContext";
import BackButton from "../UI/BackButton";
import Button from "../UI/Button";
import { useAuth } from "../../providers/authProvider";
import PERMISSIONS from "../../permissions";
import { matchPath, useLocation } from "react-router-dom";

const TitleBar = () => {
  const { displayBackButton, backButton, backgroundProcess } =
    useContext(appContext);
  const { authNavigate } = useAuth();
  const location = useLocation();
  const [showBackgroundProcess, setShow] = useState(false);

  const modalPath = matchPath("/dashboard/modal", location.pathname);
  const resyncPath = matchPath("/dashboard/resyncing", location.pathname);
  const showResumePath = !modalPath && !resyncPath;

  useEffect(() => {
    if (backgroundProcess) {
      setShow(true);
    }
    if (!backgroundProcess) {
      setShow(false);
    }
  }, [backgroundProcess]);

  const handleResumeClick = () => {
    authNavigate("/dashboard/resyncing", PERMISSIONS.CAN_VIEW_RESYNCING);
  };

  return (
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

      {!!showBackgroundProcess && showResumePath && (
        <Button
          onClick={handleResumeClick}
          extraClass="my-2 mx-2 !py-1 !px-2 max-w-max"
        >
          Resume logs
        </Button>
      )}
    </div>
  );
};

export default TitleBar;
