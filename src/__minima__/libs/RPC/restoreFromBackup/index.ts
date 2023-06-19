export const restoreFromBackup = (
  host: string,
  filepath: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `restoresync host:"${host}" file:"${filepath}" password:"${password}"`,
      (response: any) => {
        console.log(response);
        if (!response.status)
          reject(response.error ? response.error : "RPC FAILED");

        resolve(response);
      }
    );
  });
};

export default restoreFromBackup;
