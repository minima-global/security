import { useContext } from "react";
import { appContext } from "../../AppContext";
import BackButton from "../UI/BackButton";

const TitleBar = () => {
  const { displayBackButton, backButton } = useContext(appContext);

  return (
    <>
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
        <div className="flex items-center px-6 py-3 gap-3">
          <img
            className="w-8 h-8"
            alt="security-icon"
            src="./assets/security.svg"
          />
          <span className="font-bold text-lg">Security</span>
        </div>
      )}

      {!displayBackButton && (
        <div className="flex items-center px-6 py-3 gap-3">
          <img
            className="w-8 h-8"
            alt="security-icon"
            src="./assets/security.svg"
          />
          <span className="font-bold text-lg">Security</span>
        </div>
      )}
    </>
  );
};

export default TitleBar;
