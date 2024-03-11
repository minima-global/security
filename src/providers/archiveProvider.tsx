import { createContext, useContext, useState } from "react";
import * as fM from "../__minima__/libs/fileManager";

interface IArchiveContext {
  context?: "restore" | "seedresync" | "chainresync";
  resetArchiveContext: () => void;
  userWantsToArchiveReset: boolean;
  archiveFileToUpload?: File;
  archivePathToResetWith: string;
  handleArchivePathContext: (
    path: string,
    context?: "restore" | "seedresync" | "chainresync"
  ) => void;
  handleUploadContext: (
    file: File,
    context?: "restore" | "seedresync" | "chainresync"
  ) => void;
}

const ArchiveContext = createContext<IArchiveContext | undefined>(undefined);

export const ArchiveProvider = ({ children }) => {
  // uploading context
  const [archiveFileToUpload, setArchiveFileToUpload] = useState<
    undefined | File
  >(undefined);

  // path to use in the reset command
  const [archivePathToResetWith, setArchivePathToResetWith] = useState("");
  // context to know what type of reset command we're running
  const [context, setContext] = useState<
    "restore" | "seedresync" | "chainresync" | undefined
  >(undefined);

  /**
   * Reset the context back to default vals
   */
  const resetArchiveContext = () => {
    setContext(undefined);
    setArchivePathToResetWith("");
    setArchiveFileToUpload(undefined);
  };

  /**
   * This will set the full path ready for a reset command
   * @param path relative path to mds folder
   */
  const handleArchivePathContext = async (
    path: string,
    context?: "restore" | "seedresync" | "chainresync"
  ) => {
    const fullPath = await fM.getPath(path);

    setContext(context);
    setArchivePathToResetWith(fullPath);
  };

  const handleUploadContext = (file: File) => {
    setArchiveFileToUpload(file);
  };

  return (
    <ArchiveContext.Provider
      value={{
        userWantsToArchiveReset: !!archivePathToResetWith.length,
        context,
        archiveFileToUpload,
        resetArchiveContext,
        archivePathToResetWith,
        handleArchivePathContext,
        handleUploadContext,
      }}
    >
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
