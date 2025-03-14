import { useContext, useEffect } from "react";
import { appContext } from "../../AppContext";
import HomeScreenNavigation from "../UI/HomeScreenNavigation";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import RefreshIcon from "../Icons/RefreshIcon";

export function Security() {
  const { vaultLocked, setBackButton } = useContext(appContext);

  useEffect(() => {
    setBackButton({ display: false, to: "/dashboard", title: "Security" });
  }, [setBackButton]);

  const VAULT_LOCKED = vaultLocked !== null && vaultLocked;
  const VAULT_UNLOCKED = vaultLocked !== null && !vaultLocked;
  const VAULT_STATUS_UNDEFINED = vaultLocked === null;

  return (
    <>
      <div className="max-w-md mx-auto w-full">
        <div className="my-3 flex flex-col gap-2 mx-3 md:mx-0">
          <HomeScreenNavigation
            extraClass="bg-black border border-[#1B1B1B] cursor-default"
            icon={
              <>
                {!!VAULT_LOCKED && (
                  <div className="grid grid-cols-[1fr_auto] items-center text-teal-300">
                    <span className="text-sm tracking-tighter font-bold pr-1 my-auto">
                      LOCKED
                    </span>
                    <Locked />
                  </div>
                )}
                {!!VAULT_UNLOCKED && (
                  <div className="grid grid-cols-[1fr_auto] items-center text-red-300">
                    <span className="text-sm tracking-tighter font-bold pr-1 my-auto">
                      UNLOCKED
                    </span>
                    <Unlocked />
                  </div>
                )}
                {!!VAULT_STATUS_UNDEFINED && (
                  <div className="my-auto">
                    <RefreshIcon
                      extraClass="animate-spin w-[20px]"
                      fill="currentColor"
                    />
                  </div>
                )}
              </>
            }
          >
            <span>Node status</span>
          </HomeScreenNavigation>

          <HomeScreenNavigation location="lockprivatekeys">
            {!vaultLocked ? "Lock private keys" : "Unlock private keys"}
          </HomeScreenNavigation>
          <HomeScreenNavigation location="backup">
            Backup node
          </HomeScreenNavigation>
          <HomeScreenNavigation location="quicksync">
            Restore node
          </HomeScreenNavigation>
          <HomeScreenNavigation location="manageseedphrase">
            Manage seed phrase
          </HomeScreenNavigation>
          {/* <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <hr className="border-gray-500 w-full" />
            <div className="mx-3">
              <span className="text-xs text-violet-400">Legacy</span>
            </div>
            <hr className="border-gray-500 w-full" />
          </div> */}
          {/* <HomeScreenNavigation location="restore">
            Restore from backup
          </HomeScreenNavigation>
          <HomeScreenNavigation location="archivereset">
            Archive reset
          </HomeScreenNavigation> */}
        </div>
      </div>
    </>
  );
}

export default Security;
