import SlideScreen from "../../UI/SlideScreen";
import Button from "../../UI/Button";
import { useContext, useEffect, useState } from "react";

import Input from "../../UI/Input";
import { useAuth } from "../../../providers/authProvider";
import PERMISSIONS from "../../../permissions";
import { appContext } from "../../../AppContext";
import { To } from "react-router-dom";
import BackButton from "../../UI/BackButton";

const ChainResync = () => {
  const { setBackButton, displayBackButton: displayHeaderBackButton } =
    useContext(appContext);
  const { authNavigate } = useAuth();

  const [host, setHost] = useState("auto");
  const [error, setError] = useState<false | string>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBackButton({ display: true, to: -1 as To, title: "Security" });

    return () => {
      setBackButton({ display: false, to: -1 as To, title: "Security" });
    };
  }, []);

  const handleChainResync = () => {
    setError(false);
    setLoading(true);
    (window as any).MDS.cmd(
      `archive action:resync host:${host.length ? host : "auto"}`,
      (response: any) => {
        if (!response.status) {
          setLoading(false);
          return setError(
            response.error
              ? response.error
              : "Something went wrong, please try again."
          );
        }
        return authNavigate("/dashboard/resyncing", [
          PERMISSIONS.CAN_VIEW_RESYNCING,
        ]);
      }
    );
  };

  return (
    <>
      <SlideScreen display={true}>
        <div className="flex flex-col h-full bg-black px-4 pb-4">
          <div className="flex flex-col h-full">
            {!displayHeaderBackButton && (
              <BackButton to={-1 as To} title="Security" />
            )}
            <div className="mt-6 text-2xl mb-8 text-left">Chain re-sync</div>

            <div className="flex flex-col gap-5">
              <div className="text-left">
                <div>
                  <div className="mb-3">
                    If your node has been offline for too long or your node is
                    on the wrong chain. You can re-sync all blocks from an
                    Archive node. <br /> <br /> Ensure you have recorded a copy
                    of your seed phrase before starting a chain re-sync.
                  </div>
                </div>
              </div>
              <div className="core-black-contrast-2 p-4 rounded">
                <div className="mb-2 text-left">Archive node host</div>
                <div className="mb-6">
                  <Input
                    id="host"
                    name="host"
                    placeholder="Auto"
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    autoComplete="off"
                    error={error}
                  />
                </div>

                <Button
                  disabled={loading || host.length === 0}
                  onClick={handleChainResync}
                >
                  Re-sync
                </Button>
              </div>
              <div className="text-left">
                <p className="text-sm password-label mr-4 ml-4">
                  You should only re-sync from your own archive node or one from
                  a trusted source. <br /> <br /> For a successful restore, the
                  archive node used must have been started prior to the date
                  your coins were received.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlideScreen>
    </>
  );
};

export default ChainResync;
