export const listFiles = (path: string) => {
  return new Promise((resolve) => {
    (window as any).MDS.file.list(path, (res: any) => {
      console.log(res);
      resolve(res);
    });
  });
};

export default listFiles;
