import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface Archive {
  first: string;
  last: string;
  size: number;
}
interface IArchiveContext {
  userWantsToArchiveReset: boolean;
  archiveFileToUpload?: File;
  setArchiveFileToUpload: Dispatch<SetStateAction<File | undefined>>;
  archive?: Archive;
  setArchive: Dispatch<SetStateAction<Archive | undefined>>;
  checkArchiveIntegrity: (archivefile: string) => Promise<Archive>;
}

const ArchiveContext = createContext<IArchiveContext | undefined>(undefined);

export const ArchiveProvider = ({ children }) => {
  const [archiveFileToUpload, setArchiveFileToUpload] = useState<
    undefined | File
  >(undefined);
  const [archive, setArchive] = useState<Archive | undefined>(undefined);

  const checkArchiveIntegrity = (archivefile: string): Promise<Archive> => {
    return new Promise((resolve, reject) => {
      (window as any).MDS.cmd(
        `archive action:inspect file:"${archivefile}"`,
        function (resp) {
          if (!resp.status) reject(resp.error ? resp.error : "Rpc failed...");
          if (resp.status) {
            resolve(resp.response.archive);
          }
        }
      );
    });
  };
  return (
    <ArchiveContext.Provider
      value={{
        userWantsToArchiveReset: archiveFileToUpload !== undefined,
        archiveFileToUpload,
        setArchiveFileToUpload,
        archive,
        setArchive,
        checkArchiveIntegrity,
      }}
    >
      {" "}
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchiveContext = () => {
  const archiveContext = useContext(ArchiveContext);

  if (archiveContext === undefined) {
    throw new Error("useArchiveContext must be inside a provider");
  }

  return archiveContext;
};
