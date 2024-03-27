export const createBackup = (
  filename: string,
  password: string,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `backup file:"${filename}" password:"${
        password.length ? password : "minima"
      }"`,
      (resp) => {
        if (!resp.status) reject();


        resolve(resp.backup);        
      }
    );
  });
};

export default createBackup;
