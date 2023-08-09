export const importSeedPhrase = (
  phrase: string,
  host = "auto",
  keyuses = 1000
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `archive action:resync phrase:"${phrase}" host:"${host}" keyuses:${keyuses}`,
      (response: any) => {
        if (!response.status)
          reject(response.error ? response.error : "RPC FAILED");
        resolve(response.response);
      }
    );
  });
};

export default importSeedPhrase;
