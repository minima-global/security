import { useContext } from "react";
import { appContext } from "../../../../AppContext";

const FromBackup = () => {
    const { _currentRestoreWindow } = useContext(appContext);

    if (_currentRestoreWindow !== "frombackup")  {
        return null;
    }

    return <div>FromBackup</div>
}

export default FromBackup;