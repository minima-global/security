import { useContext } from "react";
import { appContext } from "../../AppContext";
import AnimatedDialog from "../UI/AnimatedDialog";
import RefreshIcon from "../Icons/RefreshIcon";
import DoneIcon from "../Icons/DoneIcon";

const FileUpload = () => {
  const { _promptFileUpload } = useContext(appContext);

  // promptFileUpload({status: true, progress: "100", error: ""});

  return (
    <>
      <AnimatedDialog
        isOpen={typeof _promptFileUpload === "object"}
        onClose={() => null}
        position="items-start mt-20"
        extraClass="max-w-sm mx-auto"
        dialogStyles="h-max rounded-lg !shadow-teal-800 !shadow-sm overflow-hidden bg-black"
      >
        <div className="grid grid-cols-[1fr_auto] px-3">
          {_promptFileUpload && _promptFileUpload.status === null && (
            <>
              <p>File upload in progress... {_promptFileUpload.progress}/100</p>
              <span>
                <RefreshIcon fill="currentColor" extraClass="animate-spin" />
              </span>
            </>
          )}
          {_promptFileUpload && _promptFileUpload.status === true && (
            <>
              <p>File upload completed!</p>
              <span className="text-teal-300">
                <DoneIcon fill="currentColor" />
              </span>
            </>
          )}
          {_promptFileUpload && _promptFileUpload.status === false && (
            <>
              <div>
                <p>File upload failed...</p>
                <p className="text-sm">{_promptFileUpload.error}</p>
              </div>
              <span></span>
            </>
          )}
        </div>
      </AnimatedDialog>
    </>
  );
};

export default FileUpload;
