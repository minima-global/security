export const vaultPasswordLock = (password: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(
      `vault action:passwordlock password:${password}`,
      (res: any) => {
        // console.log(res);
        if (!res.status && !res.pending) {
          reject(
            res.error ? res.error : res.message ? res.message : "Rpc Failed"
          );
        }

        if (res.status && !res.pending) {
          resolve(1);
        }

        if (!res.status && res.pending) {
          resolve(0);
        }
      }
    );
  });
};

export default vaultPasswordLock;
