import { useState } from "react";
export function Security() {
  const [lockKeys, setShowLockKeys] = useState(false);
  const [backupNode, setShowBackupNode] = useState(false);
  const [restoreFromBackup, setShowRestoreFromBackup] = useState(false);
  const [chainResync, setShowChainResync] = useState(false);
  const [manageSeedPhrase, setShowManageSeedPhrase] = useState(false);

  return (
    <div>
      <h1 className="text-2xl mb-4 align-left text-left max-sm:ml-5 mr-5 mt-5">
        Security
      </h1>
      <div className="max-sm:ml-5 max-sm:mr-5 flex-grow my-4 flex flex-col gap-3">
        <div
          onClick={() => setShowLockKeys(true)}
          className="text-left relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
        >
          Lock private keys
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
          onClick={() => setShowBackupNode(true)}
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
          onClick={() => setShowRestoreFromBackup(true)}
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
          onClick={() => setShowChainResync(true)}
          className="text-left relative text-status-red core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
        >
          Chain re-sync
          <div className="absolute right-0 top-0 h-full px-4 flex items-center">
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
          onClick={() => setShowManageSeedPhrase(true)}
          className="text-left relative text-status-red core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
        >
          Manage seed phrase
          <div className="absolute right-0 top-0 h-full px-4 flex items-center">
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
  );
}

export default Security;
