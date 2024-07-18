import pako from "pako";

export default function PakoInflate(string) {
  // Convert string to a Uint8Array
  const compressedData = Uint8Array.from(atob(string), (c) => c.charCodeAt(0));

  // Decompress the url
  const decompressed = pako.inflate(compressedData);

  // Convert the decompressed data Uint8Array back to a string
  const inflatedString = new TextDecoder().decode(decompressed);

  return inflatedString;
}
