import { useState } from "react";
import Security from "../../components/Security";
import Grid from "../../components/UI/Grid";
import Splash from "../../components/Splash";
import TitleBar from "../../components/TitleBar";

const Dashboard = () => {
  const [visited, setVisited] = useState(true);

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
          {!visited && <Splash />}

          {!!visited && <Security />}
        </>
      }
    />
  );
};

export default Dashboard;
