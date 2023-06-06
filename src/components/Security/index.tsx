import { useContext, useState } from "react";
import BackupNode from "./BackUpNode";
import ChainResync from "./ChainResync";
import LockPrivateKeys from "./LockPrivateKeys";
import ManageSeedPhrase from "./ManageSeedPhrase";
import RestoreFromBackup from "./RestoreFromBackup";
import FullScreen from "../UI/FullScreen";
import { appContext } from "../../AppContext";
export function Security() {
  const { setShowSecurity, showSecurity: display } = useContext(appContext);

  const [lockKeys, setShowLockKeys] = useState(false);
  const [backupNode, setShowBackupNode] = useState(false);
  const [restoreFromBackup, setShowRestoreFromBackup] = useState(false);
  const [chainResync, setShowChainResync] = useState(false);
  const [manageSeedPhrase, setShowManageSeedPhrase] = useState(false);

  return (
    <FullScreen display={display}>
      <LockPrivateKeys
        display={lockKeys}
        dismiss={() => setShowLockKeys(false)}
      />
      <BackupNode
        display={backupNode}
        dismiss={() => setShowBackupNode(false)}
      />
      <ChainResync
        display={chainResync}
        dismiss={() => setShowChainResync(false)}
      />
      <RestoreFromBackup
        display={restoreFromBackup}
        dismiss={() => setShowRestoreFromBackup(false)}
      />
      <ManageSeedPhrase
        display={manageSeedPhrase}
        dismiss={() => setShowManageSeedPhrase(false)}
      />
      <div className="pt-6 px-6 pb-6 flex flex-col h-full">
        <h1 className="text-2xl mb-4 align-left text-left">Security</h1>
        <div className=" flex-grow my-4 flex flex-col gap-3">
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
    </FullScreen>
  );
}

export default Security;
