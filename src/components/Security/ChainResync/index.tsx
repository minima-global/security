import { useNavigate } from "react-router-dom";
import SlideScreen from "../../UI/SlideScreen";
import Button from "../../UI/Button";
import { useContext, useState } from "react";
import { appContext } from "../../../AppContext";
import { useFormik } from "formik";
import Input from "../../UI/Input";

const ChainResync = () => {
  const navigate = useNavigate();
  const { setModal } = useContext(appContext);

  const [host, setHost] = useState("");
  const [error, setError] = useState<false | string>(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChainResync = () => {
    setLoading(true);
    setModal({
      display: true,
      content: RestoringDialog.content,
      primaryActions: RestoringDialog.primaryActions,
      secondaryActions: RestoringDialog.secondaryActions,
    });
    (window as any).MDS.cmd(
      `archive action:resync host:${host.length ? host : "auto"}`,
      (response: any) => {
        console.log(response);

        if (!response.status) {
          setError(response.error ? response.error : "RPC Failed");
        }

        if (response.status) {
          setSuccess(true);
        }
      }
    );
  };

  const SomethingWentWrong = () => {
    return {
      content: (
        <div>
          <img alt="download" src="./assets/download.svg" />{" "}
          <h1 className="text-2xl mb-8">Something went wrong!</h1>
          <p>Please go back and try again.</p>
        </div>
      ),
      primaryActions: null,
      secondaryActions: <Button onClick={() => setModal(false)}>Close</Button>,
    };
  };
  const RestoringDialog = {
    content: (
      <div>
        <img alt="download" src="./assets/download.svg" />{" "}
        <h1 className="text-2xl mb-8">Feedback message</h1>
        <p>
          Please don't leave this screen whilst the <br /> chain is re-syncing.
          <br /> <br /> Your node will reboot once it is complete.
        </p>
      </div>
    ),
    primaryActions: <div></div>,
    secondaryActions: <Button onClick={() => setModal(false)}>Close</Button>,
  };

  return (
    <SlideScreen display={true}>
      <div className="flex flex-col h-full bg-black">
        <div className="flex flex-col h-full">
          <div
            onClick={() => navigate("/dashboard")}
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
          <div className="mt-6 text-2xl mb-8 text-left">Chain re-sync</div>
          <div className="flex flex-col gap-5">
            <div className="text-left">
              <div>
                <div className="mb-3">
                  If your node has been offline for too long or your node is on
                  the wrong chain. You can re-sync all blocks from an Archive
                  node. <br /> <br /> Ensure you have recorded a copy of your
                  seed phrase before starting a chain re-sync.
                </div>
              </div>
            </div>
            <div className="core-black-contrast-2 p-4 rounded">
              <div className="mb-2 text-left">Archive node host</div>

              <Input
                extraClass="mb-6"
                id="host"
                name="host"
                placeholder="Auto"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                autoComplete="off"
              />

              <Button onClick={handleChainResync}>Re-sync</Button>
            </div>
            <div className="text-left">
              <p className="text-sm password-label mr-4 ml-4">
                You should only do this if you have already tried restarting
                your node and restoring a recent backup. <br /> <br /> You
                should only re-sync from your own archive node or one from a
                trusted source.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideScreen>
  );
};

export default ChainResync;
