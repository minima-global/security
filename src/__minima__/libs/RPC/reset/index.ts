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
      (resp: any) => {
        if (!resp.status)
          return reject(
            resp.error
              ? resp.error
              : `Archive restore ${archivefile} with backup file: ${backupfile} failed, please try again`
          );

        resolve(resp);
      }
    );
  });
};

export default reset;
