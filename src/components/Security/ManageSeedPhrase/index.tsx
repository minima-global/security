import { Outlet, matchPath, useLocation, useNavigate } from "react-router-dom";
import Button from "../../UI/Button";
import SlideScreen from "../../UI/SlideScreen";
import { useContext } from "react";
import { appContext } from "../../../AppContext";
import Input from "../../UI/Input";

const ManageSeedPhrase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vaultLocked, setSeedResyncHost, _seedResyncHost } =
    useContext(appContext);

  const wantsToEnterSeedPhrase = matchPath(
    { path: "/dashboard/manageseedphrase/enterseedphrase" },
    location.pathname
  );
  const wantsToWipeNode = matchPath(
    { path: "/dashboard/manageseedphrase/enterseedphrase/wipethisnode" },
    location.pathname
  );
  const wantsToViewSeedPhrase = matchPath(
    { path: "/dashboard/manageseedphrase/viewseedphrase" },
    location.pathname
  );

  return (
    <>
      <SlideScreen
        display={
          !!wantsToEnterSeedPhrase ||
          !!wantsToWipeNode ||
          !!wantsToViewSeedPhrase
        }
      >
        <Outlet />
      </SlideScreen>
      <SlideScreen
        display={
          !wantsToEnterSeedPhrase && !wantsToWipeNode && !wantsToViewSeedPhrase
        }
      >
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
            <div className="mt-6 text-2xl mb-8 text-left">
              Manage seed phrase
            </div>
            <div
              onClick={() => navigate("viewseedphrase")}
              className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer mb-8"
            >
              Show seed phrase
              {!!vaultLocked && (
                <div className="form-error-message absolute flex-row gap-2 right-0 top-0 h-full px-5 flex items-center">
                  Node locked
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <mask
                      id="mask0_583_16035"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="#FF627E" />
                    </mask>
                    <g mask="url(#mask0_583_16035)">
                      <path
                        d="M6.3077 21.4999C5.81058 21.4999 5.38502 21.3229 5.03102 20.9689C4.67701 20.6149 4.5 20.1893 4.5 19.6922V10.3077C4.5 9.81053 4.67701 9.38498 5.03102 9.03098C5.38502 8.67696 5.81058 8.49995 6.3077 8.49995H7.5V6.49995C7.5 5.25125 7.93782 4.18908 8.81345 3.31345C9.6891 2.43782 10.7513 2 12 2C13.2487 2 14.3108 2.43782 15.1865 3.31345C16.0621 4.18908 16.5 5.25125 16.5 6.49995V8.49995H17.6922C18.1894 8.49995 18.6149 8.67696 18.9689 9.03098C19.3229 9.38498 19.5 9.81053 19.5 10.3077V19.6922C19.5 20.1893 19.3229 20.6149 18.9689 20.9689C18.6149 21.3229 18.1894 21.4999 17.6922 21.4999H6.3077ZM12 16.7499C12.4859 16.7499 12.899 16.5797 13.2394 16.2393C13.5798 15.899 13.75 15.4858 13.75 14.9999C13.75 14.514 13.5798 14.1009 13.2394 13.7605C12.899 13.4201 12.4859 13.25 12 13.25C11.5141 13.25 11.1009 13.4201 10.7606 13.7605C10.4202 14.1009 10.25 14.514 10.25 14.9999C10.25 15.4858 10.4202 15.899 10.7606 16.2393C11.1009 16.5797 11.5141 16.7499 12 16.7499ZM8.99997 8.49995H15V6.49995C15 5.66662 14.7083 4.95828 14.125 4.37495C13.5416 3.79162 12.8333 3.49995 12 3.49995C11.1666 3.49995 10.4583 3.79162 9.87497 4.37495C9.29164 4.95828 8.99997 5.66662 8.99997 6.49995V8.49995Z"
                        fill="#FF627E"
                      />
                    </g>
                  </svg>
                </div>
              )}
              {!vaultLocked && (
                <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                      fill="#F4F4F5"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-left">
                <div>
                  <div className="mb-3">
                    If you have lost your phone or do not have a valid backup,
                    you can import your seed phrase.
                    <br /> <br /> Your wallet and keys will be re-created and
                    all blocks downloaded from an archive node.
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
                  value={_seedResyncHost}
                  onChange={(e) => setSeedResyncHost(e.target.value)}
                  autoComplete="off"
                />

                <Button onClick={() => navigate("enterseedphrase")}>
                  Import seed phrase
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

export default ManageSeedPhrase;
