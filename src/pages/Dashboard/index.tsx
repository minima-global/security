import { useContext, useState } from "react";
import Security from "../../components/Security";
import Grid from "../../components/UI/Grid";
import Splash from "../../components/Splash";
import TitleBar from "../../components/TitleBar";
import { appContext } from "../../AppContext";
import OldDialog from "../../components/oldDialog";

const Dashboard = () => {
  const [visited, setVisited] = useState(true);

  const { modal } = useContext(appContext);

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

          {!modal.display && (
            <>
              {!visited && <Splash />}

              {!!visited && <Security />}
            </>
          )}
        </>
      }
    />
  );
};

export default Dashboard;
