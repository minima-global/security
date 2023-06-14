export function vault() {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(`vault`, function (response: any) {
      if (response.response) {
        return resolve(response.response);
      }

      return reject();
    });
  });
}
export default vault;
