import { useEffect, useState } from "react";
import useIsMinimaBrowser from "../../../hooks/useIsMinimaBrowser";

interface IProps {
  // ref: RefObject<HTMLAnchorElement>;
  folder: string;
  file: string;
  children: any;
  onClick: (e: any) => void;
}
const AsyncLink = ({ folder, file, children, onClick }: IProps) => {
  const [href, setHref] = useState("");
  const isMinimaBrowser = useIsMinimaBrowser();

  const createDownloadLink = (
    folder: string,
    mdsfile: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const origFilePath = `/${folder}/${mdsfile}`;
      const newFilePath = `/my_downloads/${mdsfile}_minima_download_as_file_`;

      (window as any).MDS.file.copytoweb(
        origFilePath,
        newFilePath,
        function () {
          const url = `my_downloads/${mdsfile}` + "_minima_download_as_file_";
          resolve(url);
        }
      );
    });
  };

  useEffect(() => {
    createDownloadLink(folder, file).then((url) => {
      setHref(url);
    });
  }, [file]);

  if (isMinimaBrowser) {
    return <div onClick={onClick}>{children}</div>;
  }

  return (
    <a href={href} target="_blank">
      {children}
    </a>
  );
};

export default AsyncLink;
