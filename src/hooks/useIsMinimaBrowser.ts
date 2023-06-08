import { useEffect, useState } from "react";

const useIsMinimaBrowser = () => {
  const [isMinimaBrowser, setMinimaBrowser] = useState(false);

  useEffect(() => {
    if (window.navigator.userAgent.includes("Minima Browser")) {
      setMinimaBrowser(true);
    }
  }, []);

  return isMinimaBrowser;
};

export default useIsMinimaBrowser;
