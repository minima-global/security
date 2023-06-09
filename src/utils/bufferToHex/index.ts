export function bufferToHex(buffer: any) {
  // @ts-ignore
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default bufferToHex;
