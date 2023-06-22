import { useContext } from "react";
import Grid from "../../components/UI/Grid";
import TitleBar from "../../components/TitleBar";
import { appContext } from "../../AppContext";
import { Outlet, matchPath, useLocation } from "react-router-dom";
import Security from "../../components/Security";
import Dialog from "../../components/Dialog";
import AppIsInReadMode from "../AppInReadMode";

const Dashboard = () => {
  const { modal } = useContext(appContext);
  const location = useLocation();
  const index = matchPath({ path: "/dashboard" }, location.pathname);

  return (
    <Grid
      header={
        <>
          <TitleBar />
          <AppIsInReadMode />
        </>
      }
      content={
        <>
          {!!modal.display && <Dialog />}

          {!!index && !modal.display && <Security />}

          {!index && !modal.display && <Outlet />}
        </>
      }
    />
  );
};

export default Dashboard;
