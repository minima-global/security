export const createBackup = (
  filename: string,
  password: string
): Promise<object> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `backup file:${filename} ${
        password.length ? "password: " + password : ""
      }`,
      (response: any) => {
        if (response.status) {
          resolve({
            block: response.backup.block,
            uncompressed: response.backup.uncompressed,
            file: response.backup.file,
          });
        }

        if (!response.status && !response.pending) {
          reject(response.error ? response.error : "RPC FAILED");
        }
      }
    );
  });
};

export default createBackup;
