export const resetSeedSync = (
  archivefile: string,
  phrase: string,
  keyuses: number
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:seedsync phrase:"${phrase}" keyuses:"${keyuses}"`,
      (resp: any) => {
        if (!resp.response.status) {
          return reject(
            resp.response.error
              ? resp.response.error
              : "Archive seed re-sync failed"
          );
        }

        resolve(resp);
      }
    );
  });
};

export default resetSeedSync;
