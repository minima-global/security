import { useContext } from "react";
import { appContext } from "../../../../AppContext";

const Navigation = () => {
  const { _currentRestoreWindow, setCurrentRestoreWindow } = useContext(appContext);

  const isActive = (_current: string) => {
    return _currentRestoreWindow === _current
      ? "bg-violet-500 rounded-lg text-white dark:text-black font-bold hover:text-white dark:hover:text-black py-2"
      : "text-violet-300 hover:text-violet-400 cursor-pointer my-auto opacity-50 duration-100";
  };

  return (
    <div className="mx-4 sm:mx-0 my-3">
      <nav className="bg-gray-800 rounded-lg grid grid-cols-3 max-w-sm mx-auto text-center text-xs">
        <a
          onClick={() => setCurrentRestoreWindow("host")}
          className={`${isActive("host")}`}
        >
          Host
        </a>
        <a
          onClick={() => setCurrentRestoreWindow("fromseedphrase")}
          className={`${isActive("fromseedphrase")}`}
        >
          Seed Phrase
        </a>
        <a
          onClick={() => setCurrentRestoreWindow("frombackup")}
          className={`${isActive("frombackup")}`}
        >
          Backup
        </a>
      </nav>
    </div>
  );
};

export default Navigation;
