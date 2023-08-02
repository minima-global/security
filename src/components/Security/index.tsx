import { useContext, useEffect } from "react";
import { appContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";

import FadeIn from "../UI/Animations/FadeIn";

export function Security() {
  const { vaultLocked, setBackButton } = useContext(appContext);

  const navigate = useNavigate();

  useEffect(() => {
    setBackButton({ display: false, to: "/dashboard", title: "Security" });
  }, []);

  return (
    <div>
      <div className="pt-8 px-4 pb-4 flex flex-col h-full">
        <div className=" flex-grow my-4 flex flex-col gap-3">
          <div className="text-left relative core-black-contrast py-4 px-5 rounded cursor-pointer">
            Node status
            <FadeIn delay={500}>
              {vaultLocked !== null && !!vaultLocked && (
                <div className="form-success-message absolute flex-row gap-2 right-0 top-0 h-full px-5 flex items-center">
                  Locked
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
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_583_16035)">
                      <path
                        d="M6.3077 21.4999C5.81058 21.4999 5.38502 21.3229 5.03102 20.9689C4.67701 20.6149 4.5 20.1893 4.5 19.6922V10.3077C4.5 9.81053 4.67701 9.38498 5.03102 9.03098C5.38502 8.67696 5.81058 8.49995 6.3077 8.49995H7.5V6.49995C7.5 5.25125 7.93782 4.18908 8.81345 3.31345C9.6891 2.43782 10.7513 2 12 2C13.2487 2 14.3108 2.43782 15.1865 3.31345C16.0621 4.18908 16.5 5.25125 16.5 6.49995V8.49995H17.6922C18.1894 8.49995 18.6149 8.67696 18.9689 9.03098C19.3229 9.38498 19.5 9.81053 19.5 10.3077V19.6922C19.5 20.1893 19.3229 20.6149 18.9689 20.9689C18.6149 21.3229 18.1894 21.4999 17.6922 21.4999H6.3077ZM12 16.7499C12.4859 16.7499 12.899 16.5797 13.2394 16.2393C13.5798 15.899 13.75 15.4858 13.75 14.9999C13.75 14.514 13.5798 14.1009 13.2394 13.7605C12.899 13.4201 12.4859 13.25 12 13.25C11.5141 13.25 11.1009 13.4201 10.7606 13.7605C10.4202 14.1009 10.25 14.514 10.25 14.9999C10.25 15.4858 10.4202 15.899 10.7606 16.2393C11.1009 16.5797 11.5141 16.7499 12 16.7499ZM8.99997 8.49995H15V6.49995C15 5.66662 14.7083 4.95828 14.125 4.37495C13.5416 3.79162 12.8333 3.49995 12 3.49995C11.1666 3.49995 10.4583 3.79162 9.87497 4.37495C9.29164 4.95828 8.99997 5.66662 8.99997 6.49995V8.49995Z"
                        fill="#4FE3C1"
                      />
                    </g>
                  </svg>
                </div>
              )}
            </FadeIn>
            <FadeIn delay={500}>
              {vaultLocked !== null && !vaultLocked && (
                <div className="form-error-message absolute flex-row gap-2 right-0 top-0 h-full px-5 flex items-center">
                  Unlocked
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                  >
                    <path
                      d="M2.3 6.5H11V4.5C11 3.66667 10.7083 2.95833 10.125 2.375C9.54167 1.79167 8.83333 1.5 8 1.5C7.16667 1.5 6.45833 1.79167 5.875 2.375C5.29167 2.95833 5 3.66667 5 4.5H3.5C3.5 3.25 3.93733 2.18733 4.812 1.312C5.68733 0.437333 6.75 0 8 0C9.25 0 10.3127 0.437333 11.188 1.312C12.0627 2.18733 12.5 3.25 12.5 4.5V6.5H13.7C14.2 6.5 14.625 6.675 14.975 7.025C15.325 7.375 15.5 7.8 15.5 8.3V17.7C15.5 18.2 15.325 18.625 14.975 18.975C14.625 19.325 14.2 19.5 13.7 19.5H2.3C1.8 19.5 1.375 19.325 1.025 18.975C0.675 18.625 0.5 18.2 0.5 17.7V8.3C0.5 7.8 0.675 7.375 1.025 7.025C1.375 6.675 1.8 6.5 2.3 6.5ZM8 14.75C8.48333 14.75 8.896 14.5793 9.238 14.238C9.57933 13.896 9.75 13.4833 9.75 13C9.75 12.5167 9.57933 12.104 9.238 11.762C8.896 11.4207 8.48333 11.25 8 11.25C7.51667 11.25 7.104 11.4207 6.762 11.762C6.42067 12.104 6.25 12.5167 6.25 13C6.25 13.4833 6.42067 13.896 6.762 14.238C7.104 14.5793 7.51667 14.75 8 14.75Z"
                      fill="#FF627E"
                    />
                  </svg>
                </div>
              )}
            </FadeIn>
            {vaultLocked === null && (
              <div className="absolute flex-row gap-2 right-0 top-0 h-full px-5 flex items-center">
                ...
              </div>
            )}
          </div>

          <div
            onClick={() => navigate("lockprivatekeys")}
            className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
          >
            {!vaultLocked ? "Lock private keys" : "Unlock private keys"}
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
          </div>
          <div
            onClick={() => navigate("backup")}
            className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
          >
            Backup node
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
          </div>
          <div
            onClick={() => navigate("restore")}
            className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
          >
            Restore from backup
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
          </div>
          <div
            onClick={() => navigate("resync")}
            className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
          >
            Chain re-sync
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
          </div>
          <div
            onClick={() => navigate("manageseedphrase")}
            className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
          >
            Manage seed phrase
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
          </div>
          <div
            onClick={() => navigate("archivereset")}
            className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
          >
            Archive reset
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;
