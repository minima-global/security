import { useContext, useEffect, useState } from "react";
import SlideScreen from "../../../UI/SlideScreen";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { useFormik, getIn } from "formik";
import * as yup from "yup";
import Input from "../../../UI/Input";
import bip39 from "../../../../utils/bip39";
import Button from "../../../UI/Button";
import { useAuth } from "../../../../providers/authProvider";
import PERMISSIONS from "../../../../permissions";
import BackButton from "../../../UI/BackButton";
import { appContext } from "../../../../AppContext";

const validationSchema = yup.object().shape({
  seedPhrase: yup.object({
    "1": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "2": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "3": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "4": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "5": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "6": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "7": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "8": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "9": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "10": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "11": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "12": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "13": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "14": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "15": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "16": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "17": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "18": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "19": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "20": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "21": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "22": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "23": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
    "24": yup
      .string()
      .uppercase()
      .oneOf(bip39, "Invalid word.")
      .required("Please enter phrase."),
  }),
});

const EnterSeedPhrase = () => {
  const { setBackButton, displayBackButton: displayHeaderBackButton } =
    useContext(appContext);
  const { authNavigate } = useAuth();
  const location = useLocation();
  const wipeThisNode = matchPath(
    "/dashboard/manageseedphrase/enterseedphrase/wipethisnode",
    location.pathname
  );

  const offset = 6;
  const [step, setStep] = useState<number>(0);
  const [seedWord, setSeedWord] = useState([1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    const endOfSeedPhrase = seedWord[5] === 24;

    if (endOfSeedPhrase) return;

    setSeedWord((prevState) =>
      prevState.map((ind: number) => (step === 0 ? ind : ind + offset))
    );
  }, [step]);

  useEffect(() => {
    setBackButton({
      display: true,
      to: "/dashboard/manageseedphrase",
      title: "Security",
    });
  }, [location]);

  const formik = useFormik({
    initialValues: {
      seedPhrase: {
        1: "".toUpperCase(),
        2: "".toUpperCase(),
        3: "".toUpperCase(),
        4: "".toUpperCase(),
        5: "".toUpperCase(),
        6: "".toUpperCase(),
        7: "".toUpperCase(),
        8: "".toUpperCase(),
        9: "".toUpperCase(),
        10: "".toUpperCase(),
        11: "".toUpperCase(),
        12: "".toUpperCase(),
        13: "".toUpperCase(),
        14: "".toUpperCase(),
        15: "".toUpperCase(),
        16: "".toUpperCase(),
        17: "".toUpperCase(),
        18: "".toUpperCase(),
        19: "".toUpperCase(),
        20: "".toUpperCase(),
        21: "".toUpperCase(),
        22: "".toUpperCase(),
        23: "".toUpperCase(),
        24: "".toUpperCase(),
      },
      keyuses: 1000,
    },
    onSubmit: async (formData) => {
      try {
        const phraseAsString = Object.values(formData.seedPhrase)
          .toString()
          .replaceAll(",", " ");

        authNavigate(
          "/dashboard/manageseedphrase/enterseedphrase/wipethisnode",
          [
            PERMISSIONS.CAN_VIEW_WIPETHISNODE,
            PERMISSIONS.CAN_VIEW_ENTERSEEDPHRASE,
          ],
          { state: { seedPhrase: phraseAsString } }
        );
      } catch (error) {
        formik.setStatus(error);

        setTimeout(() => formik.setStatus(undefined), 2500);
      }
    },
    validationSchema: validationSchema,
  });

  const currentFormError =
    seedWord
      .map((i) => getIn(formik.errors, `seedPhrase.${i}`))
      .filter((i) => i).length > 0;
  const endOfSeedPhrase = step === 18;

  return (
    <>
      <SlideScreen display={!!wipeThisNode}>
        <Outlet />
      </SlideScreen>
      <SlideScreen display={!wipeThisNode}>
        <div className="h-full bg-black px-4 pb-4">
          {!displayHeaderBackButton && (
            <BackButton to="/dashboard/manageseedphrase" title="Security" />
          )}
          <div className="mt-6 text-2xl mb-8 text-left">Enter seed phrase</div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h1 className="mt-6 text-base mb-6 text-left">
                Enter words {1 + step} to {6 + step}
              </h1>
              <img alt="tooltip" src="./assets/info.svg" />
            </div>

            <div>
              <form onSubmit={formik.handleSubmit}>
                <ul className="flex flex-col gap-2">
                  {seedWord.map((word) => (
                    <li key={word}>
                      <Input
                        extraClass="core-black-contrast-2"
                        type="text"
                        startIcon={<div>{word}</div>}
                        placeholder="Enter phrase"
                        id={`seedPhrase.${word}`}
                        name={`seedPhrase.${word}`}
                        value={formik.values.seedPhrase[word]}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        error={
                          getIn(formik.touched, `seedPhrase.${word}`) &&
                          formik.errors &&
                          formik.errors.seedPhrase
                            ? formik.errors.seedPhrase[word]
                            : false
                        }
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-6 desktop-only">
                  {!endOfSeedPhrase && (
                    <Button
                      disabled={currentFormError}
                      onClick={() =>
                        setStep((prevState) =>
                          prevState !== 18 ? prevState + 6 : prevState
                        )
                      }
                    >
                      Next
                    </Button>
                  )}

                  {!!endOfSeedPhrase && (
                    <Button disabled={currentFormError} type="submit">
                      Finish
                    </Button>
                  )}
                </div>

                {formik.status && (
                  <div className="text-sm form-error-message text-left">
                    {formik.status}
                  </div>
                )}
              </form>
            </div>
            <div className="mobile-only">
              {!endOfSeedPhrase && (
                <Button
                  disabled={currentFormError}
                  onClick={() =>
                    setStep((prevState) =>
                      prevState !== 18 ? prevState + 6 : prevState
                    )
                  }
                >
                  Next
                </Button>
              )}
              {!!endOfSeedPhrase && (
                <Button
                  disabled={currentFormError}
                  onClick={() => formik.submitForm()}
                >
                  Finish
                </Button>
              )}
            </div>
          </div>
        </div>
      </SlideScreen>
    </>
  );
};

export default EnterSeedPhrase;
