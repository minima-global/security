export const createFolder = (folder: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.makedir(folder, (res: any) => {
      resolve(res);
    });
  });
};

export default createFolder;
