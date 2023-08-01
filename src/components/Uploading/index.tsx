import { useEffect, useState } from "react";
import loadingSpinner from "../../assets/spinner.json";
import Lottie from "@amelix/react-lottie";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "../UI/Grid";
import CommonDialogLayout from "../UI/CommonDialogLayout";
import Button from "../UI/Button";

const Uploading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  // const [setUploading] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (location && location.state && location.state.file) {
      console.log(location.state.file);
      setFile(location.state.file);
      handleFileUpload(location.state.file);
    }
  }, [location]);

  const handleFileUpload = (file: File) => {
    try {
      (window as any).MDS.file.upload(file, function (resp: any) {
        console.log(resp);
        if (resp.allchunks >= 10) {
          setProgress(resp.chunk / resp.allchunks);
        }

        if (resp.allchunks === resp.chunk) {
          setFile(undefined);
          // setUploading(false);
        }
      });
    } catch (error) {
      console.error(error);
      // setUploading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingSpinner,
  };

  return (
    <Grid
      header={null}
      content={
        <CommonDialogLayout
          status={undefined}
          primaryActions={<></>}
          secondaryActions={
            <>
              <Button
                onClick={() => {
                  navigate("/dashboard/archivereset");
                }}
              >
                Cancel
              </Button>
            </>
          }
          content={
            <>
              <div className="grid h-full">
                <div>
                  <div className="flex w-full justify-between px-2 py-2">
                    <h1 className="text-2xl">Uploading file...</h1>

                    <div className="col-span-1 flex justify-end">
                      <div>
                        <Lottie
                          options={defaultOptions}
                          height={32}
                          width={32}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full p-4 text-white mt-4 text-left core-black-contrast-2 rounded mb-4">
                    {file ? file.name : "N/A"}
                  </div>

                  {!!progress && (
                    <div className="core-black-contrast-2 rounded p-4 mt-6 mb-8 relative">
                      <div className="text-left blend z-10 left-[6px] top-[6px] font-black">
                        {(Number(progress) * 100).toFixed(0)}%
                      </div>
                      <div
                        className="bg-white absolute w-full h-[56px] transition-all origin-left"
                        style={{
                          transform: `scaleX(${progress})`,
                          left: "-1px",
                          top: "-2px",
                          width: "calc(100% + 1px)",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          }
        />
      }
    ></Grid>
  );
};

export default Uploading;
