export const resetChainResync = (archivefile: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:chainsync`,
      (response: any) => {
        if (!response.status)
          reject(response.error ? response.error : "RPC FAILED");

        resolve(response);
      }
    );
  });
};

export default resetChainResync;
