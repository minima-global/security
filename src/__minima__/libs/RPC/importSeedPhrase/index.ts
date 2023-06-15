export const importSeedPhrase = (
  phrase: string,
  host = "auto",
  keyuses = 1000
): Promise<boolean> => {
  console.log("Resyc");
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `archive action:resync phrase:"${phrase}" host:"${host}" keyuses:${keyuses}`,
      (response: any) => {
        console.log("ARCHIVE SEED RE-SYNC", response);
        if (!response.status)
          reject(response.error ? response.error : "Rpc failed");

        if (response.status) {
          resolve(true);
        }
      }
    );
  });
};

export default importSeedPhrase;
