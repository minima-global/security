import { useNavigate } from "react-router-dom";
import styles from "./Dialog.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import * as utils from "../../utils";
import * as fM from "../../__minima__/libs/fileManager";
import * as rpc from "../../__minima__/libs/RPC";
import { useContext, useState } from "react";
import { appContext } from "../../AppContext";

const validationSchema = yup.object().shape({
  host: yup.string().required("Please enter an archive host node"),
  file: yup.mixed().required("Please select a backup file (.bak)"),
  password: yup.string().required("Please enter a password"),
});

const RestoreDialog = () => {
  const navigate = useNavigate();
  const [hidePassword, togglePasswordVisibility] = useState(true);

  const { setModal } = useContext(appContext);

  const SomethingWentWrong = (error: string) => {
    return {
      content: (
        <div>
          <img className="mb-3" alt="download" src="./assets/error.svg" />{" "}
          <h1 className="text-2xl mb-8 font-semibold">Something went wrong!</h1>
          <p className="font-medium">
            {error.length ? error : "Please go back and try again."}
          </p>
        </div>
      ),
      primaryActions: <div></div>,
      secondaryActions: <Button onClick={() => setModal(false)}>Close</Button>,
    };
  };
  const SuccessDialog = {
    content: (
      <div>
        <img className="mb-3" alt="informative" src="./assets/success.svg" />{" "}
        <h1 className="text-2xl mb-4 font-semibold">Restore complete</h1>
        <p className="font-medium">
          Your node was successfully restored and will shutdown. Restart Minima
          for the restore to take effect.
        </p>
      </div>
    ),
    primaryActions: <div></div>,
    secondaryActions: null,
  };

  const formik = useFormik({
    initialValues: {
      host: "auto",
      password: "",
      file: undefined,
    },
    onSubmit: async (formData) => {
      try {
        if (!formData.file) {
          formik.setFieldError(
            "file",
            "Please select a valid (.bak) backup file."
          );
        }

        const arrayBuffer = await utils.blobToArrayBuffer(formData.file);
        const hex = utils.bufferToHex(arrayBuffer);
        await fM.saveFileAsBinary(
          "/backups/" + (formData.file as any).name,
          hex
        );
        const fullPath = await fM.getPath(
          "/backups/" + (formData.file as any).name
        );

        await rpc.restoreFromBackup(formData.host, fullPath, formData.password);

        setModal({
          display: true,
          content: SuccessDialog.content,
          primaryActions: SuccessDialog.primaryActions,
          secondaryActions: null,
        });
      } catch (error: any) {
        const dialog = SomethingWentWrong(error);
        setModal({
          display: true,
          content: dialog.content,
          primaryActions: dialog.primaryActions,
          secondaryActions: dialog.secondaryActions,
        });
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <div>
      <div className={styles["backdrop"]}></div>
      <div className={styles["grid"]}>
        <header></header>
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div>
                <h1 className="text-2xl mb-4">Restore from backup</h1>
                <p className="mb-12">
                  Once restored, the node will attempt to <br /> sync to the
                  latest block, please be patient.
                </p>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-4"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="text-left">Archive node host</div>
                  <div>
                    <Input
                      id="host"
                      name="host"
                      placeholder="Auto"
                      type="text"
                      value={formik.values.host}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      error={formik.errors.host ? formik.errors.host : false}
                    />
                  </div>
                  <Input
                    error={formik.errors.file ? formik.errors.file : false}
                    extraClass="core-grey-20"
                    accept=".bak"
                    onChange={(e) => {
                      formik.setFieldValue("file", e.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="Select file"
                    type="file"
                    id="file"
                    name="file"
                    endIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                      >
                        <mask
                          id="mask0_645_17003"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="25"
                          height="24"
                        >
                          <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_645_17003)">
                          <path
                            d="M9.89997 16.1539L12.5 13.5539L15.1 16.1539L16.1538 15.1001L13.5538 12.5001L16.1538 9.90005L15.1 8.84623L12.5 11.4462L9.89997 8.84623L8.84615 9.90005L11.4461 12.5001L8.84615 15.1001L9.89997 16.1539ZM7.8077 20.5C7.30257 20.5 6.875 20.325 6.525 19.975C6.175 19.625 6 19.1975 6 18.6923V6.00005H5V4.50008H9.49997V3.61548H15.5V4.50008H20V6.00005H19V18.6923C19 19.1975 18.825 19.625 18.475 19.975C18.125 20.325 17.6974 20.5 17.1922 20.5H7.8077ZM17.5 6.00005H7.49997V18.6923C7.49997 18.7693 7.53203 18.8398 7.59613 18.9039C7.66024 18.968 7.73077 19.0001 7.8077 19.0001H17.1922C17.2692 19.0001 17.3397 18.968 17.4038 18.9039C17.4679 18.8398 17.5 18.7693 17.5 18.6923V6.00005Z"
                            fill="#91919D"
                          />
                        </g>
                      </svg>
                    }
                  />
                  <Input
                    error={
                      formik.errors.password ? formik.errors.password : false
                    }
                    autoComplete="new-password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter password"
                    handleEndIconClick={() =>
                      togglePasswordVisibility((prevState) => !prevState)
                    }
                    type={hidePassword ? "password" : "text"}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    endIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <mask
                          id="mask0_762_271"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="20"
                          height="20"
                        >
                          <rect width="20" height="20" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_762_271)">
                          <path
                            d="M13.271 11.146L11.979 9.85399C12.0343 9.32599 11.8747 8.87133 11.5 8.48999C11.1253 8.10799 10.674 7.94466 10.146 7.99999L8.854 6.70799C9.03467 6.63866 9.22233 6.58666 9.417 6.55199C9.611 6.51733 9.80533 6.49999 10 6.49999C10.972 6.49999 11.7983 6.84033 12.479 7.52099C13.1597 8.20166 13.5 9.02799 13.5 9.99999C13.5 10.1947 13.4827 10.389 13.448 10.583C13.4133 10.7777 13.3543 10.9653 13.271 11.146ZM16.042 13.917L14.958 12.833C15.458 12.4443 15.913 12.0173 16.323 11.552C16.733 11.0867 17.0767 10.5693 17.354 9.99999C16.6733 8.59733 15.67 7.49666 14.344 6.69799C13.0173 5.89933 11.5693 5.49999 10 5.49999C9.63867 5.49999 9.28467 5.52066 8.938 5.56199C8.59067 5.60399 8.25033 5.67366 7.917 5.77099L6.708 4.56199C7.236 4.35399 7.77433 4.20833 8.323 4.12499C8.87167 4.04166 9.43067 3.99999 10 3.99999C11.986 3.99999 13.802 4.53833 15.448 5.61499C17.094 6.69099 18.278 8.15266 19 9.99999C18.6947 10.792 18.2883 11.5107 17.781 12.156C17.2743 12.802 16.6947 13.389 16.042 13.917ZM16 18.125L13.292 15.417C12.764 15.611 12.2257 15.7567 11.677 15.854C11.1283 15.9513 10.5693 16 10 16C8.014 16 6.198 15.4617 4.552 14.385C2.906 13.309 1.722 11.8473 1 9.99999C1.30533 9.20799 1.708 8.48566 2.208 7.83299C2.708 7.18033 3.29133 6.58999 3.958 6.06199L1.875 3.97899L2.938 2.91699L17.062 17.062L16 18.125ZM5.021 7.14599C4.535 7.53466 4.08367 7.96166 3.667 8.42699C3.25033 8.89233 2.91 9.41666 2.646 9.99999C3.32667 11.4027 4.33 12.5033 5.656 13.302C6.98267 14.1007 8.43067 14.5 10 14.5C10.3613 14.5 10.7153 14.4757 11.062 14.427C11.4093 14.3783 11.7567 14.3123 12.104 14.229L11.167 13.292C10.9723 13.3613 10.7777 13.4133 10.583 13.448C10.389 13.4827 10.1947 13.5 10 13.5C9.028 13.5 8.20167 13.1597 7.521 12.479C6.84033 11.7983 6.5 10.972 6.5 9.99999C6.5 9.80533 6.52433 9.61099 6.573 9.41699C6.62167 9.22233 6.66667 9.02766 6.708 8.83299L5.021 7.14599Z"
                            fill="#A7A7B0"
                          />
                        </g>
                      </svg>
                    }
                  />
                </form>
              </div>

              <div className="flex flex-col gap-3">
                <div className={`${styles.primaryActions}`}>
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    type="submit"
                    onClick={() => formik.submitForm()}
                  >
                    Restore
                  </Button>
                </div>
                <div
                  className={`${styles.desktop_only} ${styles.secondaryActions}`}
                >
                  <Button
                    disabled={formik.isSubmitting}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${styles.mobile_only} ${styles.secondaryActions}`}>
              <Button
                disabled={formik.isSubmitting}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </section>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default RestoreDialog;
