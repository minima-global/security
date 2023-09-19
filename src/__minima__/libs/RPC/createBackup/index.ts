export const createBackup = (
  filename: string,
  password: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `backup file:"${filename}" password:"${
        password.length ? password : "minima"
      }"`,
      (resp: any) => {
        if (resp.status) {
          resolve(resp.backup);
        }

        if (!resp.status && !resp.pending) {
          reject(
            resp.error
              ? resp.error
              : "Creating a backup failed, please try again"
          );
        }
      }
    );
  });
};

export default createBackup;
