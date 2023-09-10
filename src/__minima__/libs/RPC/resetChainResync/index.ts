export const resetChainResync = (archivefile: string | null) => {
  console.log(`reset archivefile:"${archivefile}" action:chainsync`);
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:chainsync`,
      (resp: any) => {
        console.log(resp);
        if (!resp.status)
          reject(resp.error ? resp.error : "Archive chain re-sync failed");

        resolve(resp);
      }
    );
  });
};

export default resetChainResync;
