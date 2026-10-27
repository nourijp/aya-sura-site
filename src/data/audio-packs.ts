import { statSync } from 'node:fs';

// Downloadable audio packs built by migration/tools/build_audio_packs.py.
const fmt = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;
function pack(file: string, count: number) {
  let size = '';
  try { size = fmt(statSync(`public/downloads/${file}`).size); } catch { /* file missing in dev */ }
  return { href: `/downloads/${file}`, size, count };
}

export const audioPacks = {
  qe1: pack('Aya-and-Sura-Quran-Edition-Vol1-Audio.zip', 50),
  se1: pack('Aya-and-Sura-Surah-Edition-Vol1-Audio.zip', 52)
};
