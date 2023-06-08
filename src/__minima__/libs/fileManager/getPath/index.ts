export const getPath = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.getpath("/", (response: any) => {
      if (response.status) {
        resolve(response.response.getpath.path);
      }
      // READMODE
      // if (!response.status && response.pending) {
      //   reject('')
      // }

      if (!response.status && !response.pending) {
        reject(response.error ? response.error : "RPC FAILED");
      }
    });
  });
};

export default getPath;
