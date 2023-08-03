export const resetSeedSync = (archivefile: string, phrase: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:seedsync phrase:"${phrase}"`,
      (response: any) => {
        if (!response.status)
          reject(response.error ? response.error : "RPC FAILED");

        resolve(response);
      }
    );
  });
};

export default resetSeedSync;
