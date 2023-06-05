import { useState } from "react";
import Security from "../../components/Security";
import Grid from "../../components/UI/Grid";
import Splash from "../../components/Splash";

const Dashboard = () => {
  const [visited, setVisited] = useState(false);

  return (
    <Grid
      header={<></>}
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
