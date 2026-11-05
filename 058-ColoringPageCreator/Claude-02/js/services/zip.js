/** Minimal ZIP writer (store method, no compression) – enough for SVG/PNG bundles. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const u16 = (v) => [v & 255, (v >> 8) & 255];
const u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];

export class ZipWriter {
  #files = [];

  /** @param {string} name path inside the archive  @param {string|Uint8Array} data */
  add(name, data) {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    this.#files.push({ name: new TextEncoder().encode(name), data: bytes, crc: crc32(bytes) });
  }

  toBlob() {
    const now = new Date();
    const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    const parts = [];
    const central = [];
    let offset = 0;

    for (const f of this.#files) {
      const local = new Uint8Array([
        ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(time), ...u16(date),
        ...u32(f.crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(f.name.length), ...u16(0),
      ]);
      parts.push(local, f.name, f.data);
      central.push(
        new Uint8Array([
          ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(time), ...u16(date),
          ...u32(f.crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(f.name.length),
          ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset),
        ]),
        f.name,
      );
      offset += local.length + f.name.length + f.data.length;
    }

    const centralSize = central.reduce((n, p) => n + p.length, 0);
    const end = new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(this.#files.length), ...u16(this.#files.length),
      ...u32(centralSize), ...u32(offset), ...u16(0),
    ]);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }
}
