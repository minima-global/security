export const loadBinaryToHex = (filename: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.loadbinary(filename, (res: any) => {
      if (!res.status) reject(res.error ? res.error : "RPC FAILED");
      // return the binary data
      resolve(res.response.load.data.substring(2));
    });
  });
};

export default loadBinaryToHex;
