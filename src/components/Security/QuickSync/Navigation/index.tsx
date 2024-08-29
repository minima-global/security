import HomeScreenNavigation from "../../../UI/HomeScreenNavigation";

const Navigation = () => {
  // const isActive = (_current: string) => {
  //   return _currentRestoreWindow === _current
  //     ? "bg-violet-500 rounded-lg text-white dark:text-black font-bold hover:text-white dark:hover:text-black py-2"
  //     : "text-violet-300 hover:text-violet-400 cursor-pointer my-auto opacity-50 duration-100";
  // };

  return (
    <>
      <HomeScreenNavigation
        location="host"
        // handleClick={() => setCurrentRestoreWindow("host")}
        extraClass="mb-3"
      >
        QuickSync
      </HomeScreenNavigation>
      <HomeScreenNavigation
        location="fromseedphrase"
        // handleClick={() => setCurrentRestoreWindow("fromseedphrase")}
        extraClass="mb-3"
      >
        Import Seed Phrase
      </HomeScreenNavigation>
      <HomeScreenNavigation
        location="frombackup"
        // handleClick={() => setCurrentRestoreWindow("frombackup")}
        extraClass="mb-3"
      >
        Import Backup
      </HomeScreenNavigation>
    </>
  );
};

export default Navigation;
