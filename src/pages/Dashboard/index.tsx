import Grid from "../../components/UI/Grid";
import TitleBar from "../../components/TitleBar";
import { Outlet } from "react-router-dom";
import AppIsInReadMode from "../AppInReadMode";
import SlideScreen from "../../components/UI/SlideScreen";

const Dashboard = () => {
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
          <SlideScreen display={true}>
            <Outlet />
          </SlideScreen>
        </>
      }
    />
  );
};

export default Dashboard;
