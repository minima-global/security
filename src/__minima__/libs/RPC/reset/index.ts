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
        if (!resp.status) {
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

export default reset;
