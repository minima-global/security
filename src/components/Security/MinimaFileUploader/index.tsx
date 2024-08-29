/**
 * This component was made to support MDS File chooser/uploader
 * MDS always will have either a MiniDapp's local files or
 * requires an external upload of files
 * so I made this multi-purpose to always handle this feature
 * dependencies will be required, e.g tailwindcss for styling,
 * Formik for form management
 * some externals too
 */

/**
 * e.g for renderData method could be..
 * const renderBackups = ({setFieldValue, setPromptInternal}) => {
   
    return (
      <>
        {backups.map((backup, index) => (
          <li onClick={() => {
            setFieldValue("file", backup.name);
            setPromptInternal(false);
          }} key={index}>backup</li>
        ))}
      </>
    );
  };
 */

import { useFormikContext } from "formik";
import { ReactNode, useContext, useRef, useState } from "react";
import AnimatedDialog from "../../UI/AnimatedDialog";
import { appContext } from "../../../AppContext";

interface IProps {
  renderData: ({ actions }: any) => ReactNode;
  internalListStyle: string;
  internalDataName: string;
  internalSearch?: ReactNode;
  externalAcceptFileType?: string;
}
const MinimaFileUploader = ({
  renderData,
  internalDataName,
  internalListStyle,
  internalSearch,
  externalAcceptFileType,
}: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { _promptFileUpload, promptFileUpload } = useContext(appContext);
  const { setFieldValue }: any = useFormikContext();

  const [promptInternal, setPromptInternal] = useState(false);

  return (
    <>
      <div>
        <button
          onClick={() => setPromptInternal(true)}
          type="button"
          className="bg-white focus:outline focus:outline-violet-300 text-black hover:bg-opacity-80 w-full mb-2 font-bold"
        >
          Select an internal backup
        </button>
        <div>
          <button
            onClick={() => inputRef.current?.click()}
            type="button"
            className="bg-white focus:outline focus:outline-violet-300 text-black hover:bg-opacity-80 w-full font-bold"
          >
            Select an external backup
          </button>

          <input
            ref={inputRef}
            id="upload"
            name="upload"
            type="file"
            className="hidden"
            accept={externalAcceptFileType}
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              try {
                promptFileUpload({ status: null, progress: "", error: "" });

                if (e.target.files && e.target.files.length) {
                await new Promise((resolve, reject) => {
                    (window as any).MDS.file.upload(
                      // @ts-ignore
                      e.target.files[0],
                      async function (resp) {
                        if (!resp.status)
                          reject(resp.error ? resp.error : "Upload failed...");

                        if (resp.allchunks >= 10) {
                          promptFileUpload({
                            status: null,
                            progress: resp.chunk / resp.allchunks,
                            error: "",
                          });
                        }

                        if (resp.allchunks === resp.chunk) {
                          promptFileUpload({
                            status: true,
                            progress: "100",
                            error: "",
                          });

                          // Move uploaded file to internal, then set full path to prepare for reset command
                          (window as any).MDS.file.move(
                            "/fileupload/" + resp.filename,
                            `/${internalDataName.toLowerCase()}/` +
                              resp.filename,
                            (moveres) => {
                              if (!moveres.status)
                                reject(
                                  moveres.error
                                    ? moveres.error
                                    : "Moving file failed..."
                                );

                              setFieldValue(
                                "file",
                                `/${internalDataName.toLowerCase()}/` +
                                  resp.filename
                              );

                              resolve(true);
                            }
                          );
                        }
                      }
                    );
                  }).catch((error) => {                  
                    throw error;
                  });
                } else {
                  promptFileUpload(false);
                }
              } catch (error) {
                if (error instanceof Error) {
                  return promptFileUpload({
                    status: false,
                    progress: "",
                    error: error.message,
                  });
                }

                promptFileUpload({
                  status: false,
                  progress: "",
                  error: "Something went wrong, please try again.",
                });
              } finally {
                setTimeout(() => {
                  promptFileUpload(false);
                }, _promptFileUpload && _promptFileUpload.status === false ? 5000 : 2000);
              }
            }}
          />
        </div>
      </div>

      <AnimatedDialog
        isOpen={promptInternal}
        onClose={() => setPromptInternal(false)}
        position="items-start mt-20"
        extraClass="max-w-sm mx-auto"
        dialogStyles="h-[400px] rounded-lg !shadow-teal-800 !shadow-sm bg-black overflow-y-scroll"
      >
        <div>
          <div className="flex justify-between items-center pr-4">
            <div className="grid grid-cols-[auto_1fr] ml-2">
              <h3 className="my-auto font-bold ml-2">
                Select from {internalDataName}{" "}
                <span className="text-xs">(Internal)</span>
              </h3>
            </div>
          </div>

          <div>
            {internalSearch && internalSearch}
            <ul className={internalListStyle}>
              {renderData({ setFieldValue, setPromptInternal })}
            </ul>
          </div>
        </div>
      </AnimatedDialog>
    </>
  );
};

export default MinimaFileUploader;

