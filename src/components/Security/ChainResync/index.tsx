import Button from "../../UI/Button";
import { useContext, useEffect, useState } from "react";

import Input from "../../UI/Input";
import { appContext } from "../../../AppContext";
import BackButton from "../../UI/BackButton";
import ConfirmationDialog from "./Confirmation/ConfirmationDialog";
import FadeIn from "../../UI/Animations/FadeIn";
import SlideIn from "../../UI/Animations/SlideIn";

const ChainResync = () => {
  const { setBackButton, displayBackButton: displayHeaderBackButton } =
    useContext(appContext);

  const [confirmation, setConfirmation] = useState(false);

  const [host, setHost] = useState("auto");
  const [error, setError] = useState<false | string>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHost(e.target.value);

    const regexp = new RegExp(
      /([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}):?([0-9]{1,5})?/
    );

    if (e.target.value.length === 0) {
      return setError("Please enter an archive host");
    }

    if (!regexp.test(e.target.value) && e.target.value !== "auto") {
      return setError("Please enter an appropriate ip:host format");
    }

    setError(false);
  };

  useEffect(() => {
    setBackButton({ display: true, to: "/dashboard", title: "Security" });

    return () => {
      setBackButton({ display: false, to: "/dashboard", title: "Security" });
    };
  }, []);

  return (
    <>
      {!!confirmation && (
        <FadeIn delay={0}>
          <div className="self-center">
            <ConfirmationDialog
              cancel={() => setConfirmation(false)}
              host={host}
            />
          </div>
        </FadeIn>
      )}
      {!confirmation && (
        <SlideIn delay={0}>
          <div className="flex flex-col h-full bg-black px-4 pb-4">
            <div className="flex flex-col h-full">
              {!displayHeaderBackButton && (
                <BackButton to="/dashboard" title="Security" />
              )}
              <div className="mt-6 text-2xl mb-8 text-left">Chain re-sync</div>

              <div className="flex flex-col gap-5">
                <div className="text-left">
                  <div>
                    <div className="mb-3">
                      If your node has been offline for too long or your node is
                      on the wrong chain. You can re-sync all blocks from an
                      Archive node. <br /> <br /> Ensure you have recorded a
                      copy of your seed phrase before starting a chain re-sync.
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
                      onChange={handleChange}
                      autoComplete="off"
                      error={error}
                    />
                  </div>

                  <Button
                    disabled={host.length === 0 || !!error}
                    onClick={() => {
                      setConfirmation(true);
                    }}
                  >
                    Re-sync
                  </Button>
                </div>
                <div className="text-left">
                  <p className="text-sm password-label mr-4 ml-4">
                    You should only re-sync from your own archive node or one
                    from a trusted source. <br /> <br /> For a successful
                    restore, the archive node used must have been started prior
                    to the date your coins were received.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>
      )}
    </>
  );
};

export default ChainResync;
