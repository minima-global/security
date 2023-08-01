import { useEffect, useState } from "react";
import loadingSpinner from "../../assets/spinner.json";
import Lottie from "@amelix/react-lottie";
import { useLocation } from "react-router-dom";
import Grid from "../UI/Grid";
import CommonDialogLayout from "../UI/CommonDialogLayout";

const Uploading = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  // const [setUploading] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

  // useEffect(() => {
  //   if (location && location.state && location.state.file) {
  //     console.log(location.state.file);
  //     setFile(location.state.file);
  //     handleFileUpload(location.state.file);
  //   }
  // }, [location]);

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
      header={<></>}
      content={
        <CommonDialogLayout
          status={undefined}
          primaryActions={<></>}
          secondaryActions={<></>}
          content={
            <>
              <div className="grid h-full mx-4">
                <div className="core-black-contrast rounded-lg py-8 px-6 flex flex-col justify-center align-middle self-center">
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

                  <div className="flex w-full p-4 text-white mt-4 mb-4">
                    {file ? file.name : "N/A"}
                  </div>

                  {progress && (
                    <div className="border-2 border-black h-[36px] mt-6 relative">
                      <div className="absolute blend z-10 left-[6px] top-[6px] font-black text-sm">
                        {(Number(progress) * 100).toFixed(0)}%
                      </div>
                      <div
                        className="bg-black absolute w-full h-[36px] transition-all origin-left"
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
