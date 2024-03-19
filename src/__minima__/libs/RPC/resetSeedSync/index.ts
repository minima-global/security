export const resetSeedSync = (
  archivefile: string,
  phrase: string,
  keyuses: number
) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `reset archivefile:"${archivefile}" action:seedsync phrase:"${phrase}" keyuses:"${keyuses}"`,
      (resp: any) => {
        if (!resp.response.status) {
          const isWrongFileType = resp.response.error && resp.response.error.includes("org.h2.jdbcSQLSyntaxErrorException");

          return reject(
            isWrongFileType
              ? "Invalid file type, please make sure this is of type raw.dat" : resp.response.error ? resp.response.error : 
              "Unexpected error"
          );
        }

        resolve(resp);
      }
    );
  });
};

export default resetSeedSync;
