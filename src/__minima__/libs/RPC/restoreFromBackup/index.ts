export const restoreFromBackup = (
  filepath: string,
  password: string,
  host?: string,
  keyuses?: string
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `backup file:"${filepath}" password:"${password}"`,
      (response: any) => {
        console.log(response);
        resolve(response);
      }
    );
  });
};

export default restoreFromBackup;
