import { useContext } from "react";
import SlideIn from "../../UI/Animations/SlideIn";
import { appContext } from "../../../AppContext";
import BackButton from "../../UI/BackButton";
import { useAuth } from "../../../providers/authProvider";

const ArchiveReset = () => {
  const { displayHeaderBackButton } = useContext(appContext);
  const { authNavigate } = useAuth();

  return (
    <SlideIn isOpen={true} delay={0}>
      <div className="flex flex-col h-full bg-black px-4 pb-4">
        <div className="flex flex-col h-full">
          {!displayHeaderBackButton && (
            <BackButton to="/dashboard" title="Security" />
          )}
          <div className="mt-6 text-2xl mb-8 text-left">Reset node</div>
          <div className="text-left flex gap-2 mb-8">
            <svg
              className="flex-none w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="8" fill="#08090B" />
              <mask
                id="mask0_1607_18879"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1607_18879)">
                <path
                  d="M12 16.7307C12.2288 16.7307 12.4207 16.6533 12.5755 16.4985C12.7303 16.3437 12.8077 16.1519 12.8077 15.9231C12.8077 15.6942 12.7303 15.5024 12.5755 15.3476C12.4207 15.1928 12.2288 15.1154 12 15.1154C11.7711 15.1154 11.5793 15.1928 11.4245 15.3476C11.2697 15.5024 11.1923 15.6942 11.1923 15.9231C11.1923 16.1519 11.2697 16.3437 11.4245 16.4985C11.5793 16.6533 11.7711 16.7307 12 16.7307ZM11.25 13.0769H12.75V7.0769H11.25V13.0769ZM12.0017 21.5C10.6877 21.5 9.45268 21.2506 8.29655 20.752C7.1404 20.2533 6.13472 19.5765 5.2795 18.7217C4.42427 17.8669 3.74721 16.8616 3.24833 15.706C2.74944 14.5504 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45268 3.248 8.29655C3.74667 7.1404 4.42342 6.13472 5.27825 5.2795C6.1331 4.42427 7.13834 3.74721 8.29398 3.24833C9.44959 2.74944 10.6844 2.5 11.9983 2.5C13.3122 2.5 14.5473 2.74933 15.7034 3.248C16.8596 3.74667 17.8652 4.42342 18.7205 5.27825C19.5757 6.1331 20.2527 7.13834 20.7516 8.29398C21.2505 9.44959 21.5 10.6844 21.5 11.9983C21.5 13.3122 21.2506 14.5473 20.752 15.7034C20.2533 16.8596 19.5765 17.8652 18.7217 18.7205C17.8669 19.5757 16.8616 20.2527 15.706 20.7516C14.5504 21.2505 13.3156 21.5 12.0017 21.5Z"
                  fill="#E9E9EB"
                />
              </g>
            </svg>

            <p className="text-sm password-label">
              Make sure you have your seed phrase written down before resetting
              your node or you could lose access to your coins.
            </p>
          </div>

          <div
            onClick={() =>
              authNavigate("/dashboard/archivereset/restorebackup", [])
            }
            className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mb-4"
          >
            Restore a backup
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
            onClick={() =>
              authNavigate("/dashboard/archivereset/chainresync", [])
            }
            className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mb-4"
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
            onClick={() =>
              authNavigate("/dashboard/archivereset/importseedphrase", [])
            }
            className="text-left relative core-black-contrast-2 py-4 px-4 rounded cursor-pointer mb-4"
          >
            Import seed phrase
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
    </SlideIn>
  );
};

export default ArchiveReset;
