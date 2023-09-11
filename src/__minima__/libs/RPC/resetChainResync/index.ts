export const resetChainResync = (archivefile: string | null) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:chainsync`,
      (resp: any) => {
        if (!resp.status)
          reject(resp.error ? resp.error : "Archive chain re-sync failed");

        resolve(resp);
      }
    );
  });
};

export default resetChainResync;
