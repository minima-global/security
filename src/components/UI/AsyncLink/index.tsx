import { useEffect, useState } from "react";
import * as fileManager from "../../../__minima__/libs/fileManager";
import useIsMinimaBrowser from "../../../hooks/useIsMinimaBrowser";

interface IProps {
  // ref: RefObject<HTMLAnchorElement>;
  file: string;
  children: any;
  onClick: (e: any) => void;
  name: string;
}
const AsyncLink = ({ file, name, children, onClick }: IProps) => {
  const [href, setHref] = useState("");
  const isMinimaBrowser = useIsMinimaBrowser();

  const createDownloadLink = async (mdsfile: string): Promise<string> => {
    const path = await fileManager.getPath(mdsfile);
    return new Promise((resolve) => {
      const filePath = `/my_downloads/${mdsfile}`;

      const newFileName = mdsfile + "_minima_download_as_file_";

      (window as any).MDS.file.copytoweb(path, filePath, function () {
        const url = `my_downloads/${newFileName}`;

        resolve(url);
      });
    });
  };

  useEffect(() => {
    createDownloadLink(file).then((url) => {
      setHref(url);
    });
  }, [file]);

  if (isMinimaBrowser) {
    return <div onClick={onClick}>{children}</div>;
  }

  return (
    <a onClick={onClick} download={name} target="_blank" href={href}>
      {children}
    </a>
  );
};

export default AsyncLink;
