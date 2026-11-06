/* Shared between the home prompt console and the 3D browser scene (plain values, read every frame). */
export const heroSignal = { length: 0, phrases: 0, submitted: false };

export function countPhrases(text) {
  const t = String(text || "");
  const words = t.trim().split(/\s+/).filter(Boolean).length;
  const punct = (t.match(/[.,;!?\n]+/g) || []).length;
  return punct + Math.floor(words / 6);
}
