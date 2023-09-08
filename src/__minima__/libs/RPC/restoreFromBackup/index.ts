export const restoreFromBackup = (
  host: string,
  filepath: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `restoresync ${
        host.length ? 'host:"' + host + '"' : ""
      } file:"${filepath}" password:"${password.length ? password : "minima"}"`,
      (response: any) => {
        if (!response.status)
          return reject(
            response.error
              ? response.error
              : "Restoring from backup failed, please try again"
          );

        resolve(response);
      }
    );
  });
};

export default restoreFromBackup;
