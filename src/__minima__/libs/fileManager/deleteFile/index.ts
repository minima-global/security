export const deleteFile = (fileName: string) => {
  return new Promise((resolve) => {
    (window as any).MDS.file.delete(fileName, (res: any) => {
      resolve(res);
    });
  });
};

export default deleteFile;
