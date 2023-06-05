import { useContext, useState } from 'react';
import { appContext } from '../../AppContext';
import BatteryOptimisation from './BatteryOptimisation';
import DesktopConnect from './DesktopConnect';
import PeerList from './PeerList';
import FullScreen from '../UI/FullScreen';
import ShutdownNode from './ShutdownNode';

export function Settings() {
  const { setShowSettings, showSettings: display } = useContext(appContext);
  const [showShutdown, setShutdown] = useState(false);
  const [showPeerList, setShowPeerList] = useState(false);
  const [showDesktopConnect, setShowDesktopConnect] = useState(false);
  const [showBatteryOptimisation, setShowBatteryOptimisation] = useState(false);

  return (
    <FullScreen display={display}>
      <ShutdownNode display={showShutdown} dismiss={() => setShutdown(false)} />
      <PeerList display={showPeerList} dismiss={() => setShowPeerList(false)} />
      <DesktopConnect display={showDesktopConnect} dismiss={() => setShowDesktopConnect(false)} />
      <BatteryOptimisation display={showBatteryOptimisation} dismiss={() => setShowBatteryOptimisation(false)} />
      <div className="flex flex-col h-full">
        <div className="title-bar py-6 px-6 z-[80]">
          <div className="grid grid-cols-12 h-full">
            <div className="svg col-span-6 h-full flex items-center">
              <svg width="28" height="24" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M25.6554 7.46969L24.2413 13.5076L22.4307 6.21148L16.0935 3.73123L14.3802 11.0346L12.8614 2.47302L6.5242 0L0 27.8974H6.92074L8.92588 19.3286L10.4297 27.8974H17.3654L19.0713 20.5868L20.8744 27.8974H27.7952L32 9.94271L25.6554 7.46969Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="svg col-span-6 flex items-center justify-end">
              <svg width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.00295 17.275C2.42704 17.275 1.93428 17.0704 1.52468 16.6612C1.11508 16.2519 0.910278 15.76 0.910278 15.1853C0.910278 14.609 1.1149 14.1157 1.52413 13.7053C1.93335 13.2949 2.42529 13.0897 2.99995 13.0897C3.57785 13.0897 4.0706 13.2946 4.4782 13.7045C4.88582 14.1144 5.08963 14.6072 5.08963 15.1828C5.08963 15.7584 4.88582 16.251 4.4782 16.6606C4.0706 17.0702 3.57885 17.275 3.00295 17.275ZM3.00295 11.0897C2.42704 11.0897 1.93428 10.885 1.52468 10.4758C1.11508 10.0666 0.910278 9.57464 0.910278 8.99998C0.910278 8.42208 1.1149 7.92933 1.52413 7.52173C1.93335 7.11411 2.42529 6.9103 2.99995 6.9103C3.57785 6.9103 4.0706 7.11411 4.4782 7.52173C4.88582 7.92933 5.08963 8.42108 5.08963 8.99698C5.08963 9.57289 4.88582 10.0657 4.4782 10.4753C4.0706 10.8849 3.57885 11.0897 3.00295 11.0897ZM3.00295 4.9103C2.42704 4.9103 1.93428 4.70493 1.52468 4.2942C1.11508 3.88347 0.910278 3.38972 0.910278 2.81295C0.910278 2.23618 1.1149 1.74399 1.52413 1.33638C1.93335 0.928775 2.42529 0.724976 2.99995 0.724976C3.57785 0.724976 4.0706 0.928775 4.4782 1.33638C4.88582 1.74399 5.08963 2.23618 5.08963 2.81295C5.08963 3.38972 4.88582 3.88347 4.4782 4.2942C4.0706 4.70493 3.57885 4.9103 3.00295 4.9103Z"
                  fill="#F9F9FA"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="pt-6 px-6 pb-6 flex flex-col h-full">
          <h1 className="text-2xl mb-4">Settings</h1>
          <div className="flex-grow my-4 flex flex-col gap-3">
            <div
              onClick={() => setShowBatteryOptimisation(true)}
              className="relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
            >
              Battery optimisation
              <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                    fill="#F4F4F5"
                  />
                </svg>
              </div>
            </div>
            <div
              onClick={() => setShowDesktopConnect(true)}
              className="relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
            >
              Desktop connect
              <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                    fill="#F4F4F5"
                  />
                </svg>
              </div>
            </div>
            <div
              onClick={() => setShowPeerList(true)}
              className="relative core-black-contrast-2 py-4 px-5 rounded cursor-pointer"
            >
              Peer list
              <div className="absolute right-0 top-0 h-full px-5 flex items-center">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.04984 5.99995L1.37504 11.6501L0.500244 10.7501L5.24984 5.99995L0.500244 1.24975L1.40024 0.349747L7.04984 5.99995Z"
                    fill="#F4F4F5"
                  />
                </svg>
              </div>
            </div>
            <div onClick={() => setShutdown(true)} className="relative text-status-red core-black-contrast py-4 px-5 rounded cursor-pointer">
              Shutdown node
              <div className="absolute right-0 top-0 h-full px-4 flex items-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 10V0H10V10H8ZM9 18C7.76667 18 6.60417 17.7625 5.5125 17.2875C4.42083 16.8125 3.46667 16.1667 2.65 15.35C1.83333 14.5333 1.1875 13.5792 0.7125 12.4875C0.2375 11.3958 0 10.2333 0 9C0 7.66667 0.275 6.40833 0.825 5.225C1.375 4.04167 2.15 3.01667 3.15 2.15L4.55 3.55C3.75 4.21667 3.125 5.025 2.675 5.975C2.225 6.925 2 7.93333 2 9C2 10.9333 2.68333 12.5833 4.05 13.95C5.41667 15.3167 7.06667 16 9 16C10.95 16 12.6042 15.3167 13.9625 13.95C15.3208 12.5833 16 10.9333 16 9C16 7.93333 15.7792 6.925 15.3375 5.975C14.8958 5.025 14.2667 4.21667 13.45 3.55L14.85 2.15C15.85 3.01667 16.625 4.04167 17.175 5.225C17.725 6.40833 18 7.66667 18 9C18 10.2333 17.7625 11.3958 17.2875 12.4875C16.8125 13.5792 16.1708 14.5333 15.3625 15.35C14.5542 16.1667 13.6042 16.8125 12.5125 17.2875C11.4208 17.7625 10.25 18 9 18Z"
                    fill="#FF627E"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="w-full px-4 py-3.5 rounded core-black-contrast-3 font-bold text-black bg-black text-white mb-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </FullScreen>
  );
}

export default Settings;
