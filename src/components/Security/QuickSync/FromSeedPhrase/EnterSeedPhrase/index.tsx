import { getIn, useFormikContext } from "formik";
import { useState } from "react";
import Autocomplete from "../../../../UI/Autocomplete";
import bip39 from "../../../../../utils/bip39";

// const SEEDS_PER_STEP = 6;
interface IProps {
    formNext: () => void;
    formPrev: () => void;
}
const EnterSeedPhrase = ({formNext}: IProps) => {
  const {
    values,
    setFieldValue,
    validateForm,
    setFieldError,
    setFieldTouched,
    touched,
    errors,
    handleBlur,
  }: any = useFormikContext();
  const [step, _] = useState(3);

  const seeds = Object.keys(values.seedPhrase);
  // const totalSteps = Math.ceil(seeds.length / SEEDS_PER_STEP);

  // const startIndex = step * SEEDS_PER_STEP;
  // const endIndex = startIndex + SEEDS_PER_STEP;

  // const handleNext = () => {
  //   if (step < totalSteps - 1) {
  //     setStep(step + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (step > 0) {
  //     setStep(step - 1);
  //   }
  // };

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLInputElement>,
    setFieldValue: any,
    validateForm: any,
    setFieldError: any,
    setFieldTouched: any
  ) => {

    // Access clipboard data
    const clipboardData = event.clipboardData;

    // Get the pasted text
    const pastedText = clipboardData.getData("text");

    const isPastedTextASeedPhrase = pastedText.split(" ").length === 24;
    if (isPastedTextASeedPhrase) {
      event.preventDefault();

      pastedText
        .split(" ")
        .forEach((_seed, index) =>
          setFieldValue(`seedPhrase.${index + 1}`, "")
        );

      pastedText
        .split(" ")
        .forEach((_seed, index) =>
          setFieldValue(`seedPhrase.${index + 1}`, _seed.toUpperCase())
        );

      const errors = await validateForm();
      if (errors.seedPhrase) {
        Object.keys(errors.seedPhrase).map((key) => {
          if (errors.seedPhrase[key]) {
            setFieldError(`seedPhrase.${key}`, errors.seedPhrase[key]);
            setFieldTouched(`seedPhrase.${key}`, errors.seedPhrase[key]);
          }
        });
      }

      return pastedText;
    }

    return false;
  };


  const TOUCHED_ALL_SEEDPHRASES = touched.seedPhrase && touched.seedPhrase.length === 25;
  return (
    <>
      {step === 3 && !!errors.seedPhrase && TOUCHED_ALL_SEEDPHRASES && (
        <p className="text-black text-sm bg-yellow-300 rounded p-2 mb-3">
          There is something wrong with your seed phrase, double check that you have
          entered it correctly.
        </p>
      )}

      <ul className="grid grid-cols-2 gap-2 mb-4">
        {values.seedPhrase &&
          seeds.map((seed) => (
            <li key={`seedInputField_${seed}`} className="relative">
              <Autocomplete
                onPaste={(e) =>
                  handlePaste(
                    e,
                    setFieldValue,
                    validateForm,
                    setFieldError,
                    setFieldTouched
                  )
                }
                extraClass="!bg-[#1B1B1B] focus:!bg-white focus:!text-black focus:border !focus:border-[#464C4F] focus:font-bold"
                disabled={false}
                placeholder=""
                type="text"
                value={values.seedPhrase[seed]}
                id={`seedPhrase.${seed}`}
                name={`seedPhrase.${seed}`}
                suggestions={bip39}
                onChange={(value: string) =>
                  setFieldValue(`seedPhrase.${seed}`, value)
                }
                onBlur={handleBlur}
                error={
                  getIn(touched, `seedPhrase.${seed}`) &&
                  getIn(errors, `seedPhrase.${seed}`)
                    ? getIn(errors, `seedPhrase.${seed}`)
                    : false
                }
                startIcon={
                  <h4
                    className={`absolute top-[15px] left-[15px] ${
                      getIn(touched, `seedPhrase.${seed}`) &&
                      getIn(errors, `seedPhrase.${seed}`)
                        ? "fa-error"
                        : "fa"
                    } color-core-grey text-base z-20`}
                  >
                    {seed}
                  </h4>
                }
              />
            </li>
          ))}
      </ul>
      
        <div className="mt-3">
          {/* <button
           type="button"
            onClick={() => formPrev()}
            className="font-bold text-white bg-[#1B1B1B]"
          >
            Previous
          </button> */}
          <button
            disabled={(step === 3 && !!errors.seedPhrase) || (step === 3 && !TOUCHED_ALL_SEEDPHRASES)}
            type="button"
            onClick={() => formNext()}
            className="font-bold bg-white text-black disabled:bg-opacity-10 w-full"
          >
            Next
          </button>
        </div>
    </>
  );
};

export default EnterSeedPhrase;
