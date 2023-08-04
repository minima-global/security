export const reset = (
  archivefile: string,
  backupfile: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:restore file:"${backupfile}" password:"${
        password ? password : "minima"
      }"`,
      (response: any) => {
        if (!response.status) {
          reject(response.error ? response.error : "RPC FAILED");
        }

        if (response.status) {
          resolve(true);
        }
      }
    );
  });
};

export default reset;
