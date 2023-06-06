import { useContext } from "react";
import Grid from "../../components/UI/Grid";
import TitleBar from "../../components/TitleBar";
import { appContext } from "../../AppContext";
import { Outlet, matchPath, useLocation, useMatch } from "react-router-dom";
import Security from "../../components/Security";
import OldDialog from "../../components/oldDialog";

const Dashboard = () => {
  const { modal } = useContext(appContext);
  const location = useLocation();
  const index = matchPath({ path: "/dashboard" }, location.pathname);

  return (
    <Grid
      header={
        <>
          <TitleBar />
        </>
      }
      footer={<></>}
      content={
        <>
          {!!modal.display && <OldDialog />}

          {!!index && !modal.display && <Security />}

          {!index && !modal.display && <Outlet />}
        </>
      }
    />
  );
};

export default Dashboard;
