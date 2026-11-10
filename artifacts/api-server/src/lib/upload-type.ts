// Identify supported image containers from bytes, never from a client filename.
export function imageExtension(data: Buffer): string | null {
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (data.length >= 3 && data[0] === 255 && data[1] === 216 && data[2] === 255) return "jpg";
  if (data.length >= 6 && ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6))) return "gif";
  if (data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (data.length >= 16 && data.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(data.toString("ascii", 8, 12))) return "avif";
  return null;
}
