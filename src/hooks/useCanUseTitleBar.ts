const useCanUseTitleBar = () => {
  const openTitleBar = () => {
    if (window.navigator.userAgent?.includes("Minima Browser")) {
      // @ts-ignore
      Android.showTitleBar();
    }
  };

  return openTitleBar;
};

export default useCanUseTitleBar;
