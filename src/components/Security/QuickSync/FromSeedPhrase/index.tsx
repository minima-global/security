import { useContext } from "react";
import { appContext } from "../../../../AppContext";

const FromSeedPhrase = () => {
    const { _currentRestoreWindow } = useContext(appContext);

    if (_currentRestoreWindow !== "fromseedphrase")  {
        return null;
    }


    return <div>FromSeedPhrase</div>
}

export default FromSeedPhrase;