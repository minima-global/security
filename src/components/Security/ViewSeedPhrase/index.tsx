import { To, useLocation } from "react-router-dom";
import Button from "../../UI/Button";
import SlideScreen from "../../UI/SlideScreen";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../AppContext";
import styles from "./ViewSeedPhrase.module.css";
import useLongPress from "../../../hooks/useLongPress";
import BackButton from "../../UI/BackButton";

const ViewSeedPhrase = () => {
  const location = useLocation();
  const {
    phraseAsArray,
    setBackButton,
    displayBackButton: displayHeaderBackButton,
  } = useContext(appContext);
  const [hide, setHideSeedPhrase] = useState(true);
  const onLongPress = () => {
    setHideSeedPhrase(false);
  };

  useEffect(() => {
    setBackButton({ display: true, to: -1 as To, title: "Back" });
  }, [location]);

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, defaultOptions, () =>
    setHideSeedPhrase(true)
  );

  return (
    <SlideScreen display={true}>
      <div className="h-full flex flex-col justify-between px-4 pb-4">
        <div>
          {!displayHeaderBackButton && (
            <BackButton to={-1 as To} title="Back" />
          )}
          <div className="mt-6 text-2xl mb-8 text-left bg-inherit">
            Your seed phrase
          </div>
          <ul className={styles["seed-phrase-list"]}>
            {phraseAsArray.map((p, index) => (
              <li>
                <div>{index + 1}</div>
                {!hide ? p : ""}
              </li>
            ))}
          </ul>

          <Button
            {...longPressEvent}
            extraClass={`desktop-only p-16 flex gap-2 items-center justify-center mt-8 ${
              !hide ? "core-black-contrast core-grey-contrast-3" : ""
            }`}
          >
            Hold to view{" "}
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_1102_25545"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="21"
                height="20"
              >
                <rect
                  x="0.5"
                  width="20"
                  height="20"
                  fill={hide ? "#D9D9D9" : "#464C4F"}
                />
              </mask>
              <g mask="url(#mask0_1102_25545)">
                <path
                  d="M10.5 13.5C11.472 13.5 12.2983 13.1597 12.979 12.479C13.6597 11.7983 14 10.972 14 10C14 9.028 13.6597 8.20167 12.979 7.521C12.2983 6.84033 11.472 6.5 10.5 6.5C9.528 6.5 8.70167 6.84033 8.021 7.521C7.34033 8.20167 7 9.028 7 10C7 10.972 7.34033 11.7983 8.021 12.479C8.70167 13.1597 9.528 13.5 10.5 13.5ZM10.5 12C9.94467 12 9.47233 11.8057 9.083 11.417C8.69433 11.0277 8.5 10.5553 8.5 10C8.5 9.44467 8.69433 8.97233 9.083 8.583C9.47233 8.19433 9.94467 8 10.5 8C11.0553 8 11.5277 8.19433 11.917 8.583C12.3057 8.97233 12.5 9.44467 12.5 10C12.5 10.5553 12.3057 11.0277 11.917 11.417C11.5277 11.8057 11.0553 12 10.5 12ZM10.5 16C8.514 16 6.70833 15.455 5.083 14.365C3.45833 13.2743 2.264 11.8193 1.5 10C2.264 8.18067 3.45833 6.72567 5.083 5.635C6.70833 4.545 8.514 4 10.5 4C12.486 4 14.2917 4.545 15.917 5.635C17.5417 6.72567 18.736 8.18067 19.5 10C18.736 11.8193 17.5417 13.2743 15.917 14.365C14.2917 15.455 12.486 16 10.5 16ZM10.5 14.5C12.0553 14.5 13.4927 14.0973 14.812 13.292C16.132 12.486 17.146 11.3887 17.854 10C17.146 8.61133 16.132 7.514 14.812 6.708C13.4927 5.90267 12.0553 5.5 10.5 5.5C8.94467 5.5 7.50733 5.90267 6.188 6.708C4.868 7.514 3.854 8.61133 3.146 10C3.854 11.3887 4.868 12.486 6.188 13.292C7.50733 14.0973 8.94467 14.5 10.5 14.5Z"
                  fill={hide ? "#08090B" : "#464C4F"}
                />
              </g>
            </svg>
          </Button>
        </div>

        <Button
          onTouchStart={() => setHideSeedPhrase(false)}
          onTouchEnd={() => setHideSeedPhrase(true)}
          // onContextMenu={() => {
          //   setHideSeedPhrase(false);
          //   setTimeout(() => setHideSeedPhrase(true), 2500);
          // }}
          extraClass={`mobile-only p-16 flex gap-2 items-center justify-center mb-8 mt-4 ${
            !hide ? "core-black-contrast core-grey-contrast-3" : ""
          }`}
        >
          Hold to view{" "}
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_1102_25545"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="21"
              height="20"
            >
              <rect
                x="0.5"
                width="20"
                height="20"
                fill={hide ? "#D9D9D9" : "#464C4F"}
              />
            </mask>
            <g mask="url(#mask0_1102_25545)">
              <path
                d="M10.5 13.5C11.472 13.5 12.2983 13.1597 12.979 12.479C13.6597 11.7983 14 10.972 14 10C14 9.028 13.6597 8.20167 12.979 7.521C12.2983 6.84033 11.472 6.5 10.5 6.5C9.528 6.5 8.70167 6.84033 8.021 7.521C7.34033 8.20167 7 9.028 7 10C7 10.972 7.34033 11.7983 8.021 12.479C8.70167 13.1597 9.528 13.5 10.5 13.5ZM10.5 12C9.94467 12 9.47233 11.8057 9.083 11.417C8.69433 11.0277 8.5 10.5553 8.5 10C8.5 9.44467 8.69433 8.97233 9.083 8.583C9.47233 8.19433 9.94467 8 10.5 8C11.0553 8 11.5277 8.19433 11.917 8.583C12.3057 8.97233 12.5 9.44467 12.5 10C12.5 10.5553 12.3057 11.0277 11.917 11.417C11.5277 11.8057 11.0553 12 10.5 12ZM10.5 16C8.514 16 6.70833 15.455 5.083 14.365C3.45833 13.2743 2.264 11.8193 1.5 10C2.264 8.18067 3.45833 6.72567 5.083 5.635C6.70833 4.545 8.514 4 10.5 4C12.486 4 14.2917 4.545 15.917 5.635C17.5417 6.72567 18.736 8.18067 19.5 10C18.736 11.8193 17.5417 13.2743 15.917 14.365C14.2917 15.455 12.486 16 10.5 16ZM10.5 14.5C12.0553 14.5 13.4927 14.0973 14.812 13.292C16.132 12.486 17.146 11.3887 17.854 10C17.146 8.61133 16.132 7.514 14.812 6.708C13.4927 5.90267 12.0553 5.5 10.5 5.5C8.94467 5.5 7.50733 5.90267 6.188 6.708C4.868 7.514 3.854 8.61133 3.146 10C3.854 11.3887 4.868 12.486 6.188 13.292C7.50733 14.0973 8.94467 14.5 10.5 14.5Z"
                fill={hide ? "#08090B" : "#464C4F"}
              />
            </g>
          </svg>
        </Button>
      </div>
    </SlideScreen>
  );
};

export default ViewSeedPhrase;
