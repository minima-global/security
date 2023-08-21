export const resetSeedSync = (
  archivefile: string,
  phrase: string,
  keyuses: string
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:seedsync phrase:"${phrase}" keyuses:"${keyuses}"`,
      (response: any) => {
        if (!response.status)
          reject(response.error ? response.error : "RPC FAILED");

        resolve(response);
      }
    );
  });
};

export default resetSeedSync;
