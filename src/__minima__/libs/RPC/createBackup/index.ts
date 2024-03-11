export const createBackup = (
  filename: string,
  password: string,
  amount: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `backup file:"${filename}" password:"${
        password.length ? password : "minima"
      }" ${amount > 0 ? " maxhistory:"+amount : ""}`,
      (resp) => {
        if (!resp.status) reject();


        resolve(resp.backup);        
      }
    );
  });
};

export default createBackup;
