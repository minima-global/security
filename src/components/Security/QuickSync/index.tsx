import Navigation from "./Navigation";
import BackButton from "../../UI/BackButton";
import { Outlet, useLocation } from "react-router-dom";

const QuickSync = () => {
  const location = useLocation();

  // Check if the current path is one of the children routes
  const isChildRoute = [
    "/dashboard/quicksync/host",
    "/dashboard/quicksync/fromseedphrase",
    "/dashboard/quicksync/frombackup",
  ].includes(location.pathname);

  return (
    <div className="mx-4">
      <div className="grid grid-cols-[auto_1fr] mb-4">
        <BackButton title="Back" to={-1} />
      </div>
      <h1 className="text-2xl mb-5">QuickSync & Restore</h1>

      {!isChildRoute && (
        <>
          <p className="mb-5">Choose an option:</p>
          <Navigation />
        </>
      )}
      
      <Outlet />
    </div>
  );
};

export default QuickSync;
