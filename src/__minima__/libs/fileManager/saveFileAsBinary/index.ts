export const saveFileAsBinary = (hexString: any) => {
  return new Promise((resolve) => {
    (window as any).MDS.file.savebinary("/backups", hexString, (res: any) => {
      console.log(res);
      resolve(res);
    });
  });
};

export default saveFileAsBinary;
