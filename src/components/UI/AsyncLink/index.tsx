import useIsMinimaBrowser from "../../../hooks/useIsMinimaBrowser";

interface IProps {
  folder: string;
  file: string;
  children: any;
  onClick: (e: any) => void;
}
const AsyncLink = ({ folder, file, children, onClick }: IProps) => {
  const isMinimaBrowser = useIsMinimaBrowser();

  const createDownloadLink = (folder: string, mdsfile: string) => {
    const origFilePath = `/${folder}/${mdsfile}`;
    const newFilePath = `/my_downloads/${mdsfile}_minima_download_as_file_`;

    (window as any).MDS.file.copytoweb(origFilePath, newFilePath, function () {
      const url = `my_downloads/${mdsfile}` + "_minima_download_as_file_";
      // create an a
      const temporaryLink = document.createElement("a");
      temporaryLink.style.display = "none";
      temporaryLink.target = "_blank";
      temporaryLink.href = url;
      temporaryLink.click();
      (window as any).MDS.file.deletefromweb(url, function () {
        temporaryLink.remove();
      });
    });
  };

  if (isMinimaBrowser) {
    return <div onClick={onClick}>{children}</div>;
  }

  return <div onClick={() => createDownloadLink(folder, file)}>{children}</div>;
};

export default AsyncLink;
