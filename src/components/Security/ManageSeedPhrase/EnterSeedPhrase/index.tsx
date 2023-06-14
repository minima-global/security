import { useEffect, useState } from "react";
import SlideScreen from "../../../UI/SlideScreen";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
// import * as yup from "yup";
import Input from "../../../UI/Input";
// import { appContext } from "../../../../AppContext";

// const validationSchema = yup.object().shape({
//   seedPhrase: yup.mixed().test("check-if-valid", function (val) {
//     // const { path, parent, createError } = this;

//     if (val === undefined) {
//       return;
//     }
//   }),
// });

const EnterSeedPhrase = () => {
  const navigate = useNavigate();
  // const { _phrase } = useContext(appContext);

  const [step, setStep] = useState<number>(0);
  const [seedWord, setSeedWord] = useState([1, 2, 3, 4, 5, 6]);
  const offset = 6;

  const formik = useFormik({
    initialValues: { seedPhrase: [] },
    onSubmit: (formData) => {
      console.log(formData);
    },
    validationSchema: null,
  });

  useEffect(() => {
    setSeedWord((prevState) =>
      prevState.map((ind: number) => (step === 0 ? ind : ind + offset))
    );
  }, [step]);

  return (
    <SlideScreen display={true}>
      <div className="flex flex-col h-full bg-black">
        <div className="flex flex-col h-full">
          <div
            onClick={() => navigate("/dashboard/manageseedphrase")}
            className="cursor-pointer mb-4 flex items-center"
          >
            <svg
              className="mt-0.5 mr-4"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.90017 13.1693L0.730957 7.00009L6.90017 0.830872L7.79631 1.72701L2.52324 7.00009L7.79631 12.2732L6.90017 13.1693Z"
                fill="#F9F9FA"
              />
            </svg>
            Security
          </div>
          <div className="mt-6 text-2xl mb-8 text-left">Enter seed phrase</div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h1 className="mt-6 text-base mb-6 text-left">
                Enter words {1 + step} to {6 + step}
              </h1>
              <img alt="tooltip" />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <ul>
                {seedWord.map((int) => (
                  <li>
                    <Input
                      startIcon={<div>{int}</div>}
                      placeholder="Enter phrase"
                      id={`seed#${int}`}
                      name={`seed#${int}`}
                      value={formik.values.seedPhrase[int]}
                      type="text"
                    />
                  </li>
                ))}
              </ul>
              <button onClick={() => setStep((prevState) => prevState + 6)}>
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </SlideScreen>
  );
};

export default EnterSeedPhrase;
