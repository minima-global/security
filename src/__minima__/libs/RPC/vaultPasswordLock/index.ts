export const vaultPasswordLock = (password: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `vault action:passwordlock password:${password}`,
      (res: any) => {
        if (!res.status)
          reject(
            res.error ? res.error : res.message ? res.message : "Rpc Failed"
          );

        if (res.status) {
          resolve(res.response);
        }
      }
    );
  });
};

export default vaultPasswordLock;
