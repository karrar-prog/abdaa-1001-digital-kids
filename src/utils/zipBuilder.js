// مُنشئ ملفات ZIP قياسي (UTF-8 + CRC-32 + STORE) بدون أي مكتبات خارجية
// مثالي لحزم صور PNG عالية الدقة (مضغوطة مسبقاً) بسرعة فائقة وبأسماء ملفات عربية سليمة

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosTimeDate(date = new Date()) {
  const dosTime =
    ((date.getHours() & 0x1f) << 11) |
    ((date.getMinutes() & 0x3f) << 5) |
    ((date.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((Math.max(1980, date.getFullYear()) - 1980) & 0x7f) << 9) |
    (((date.getMonth() + 1) & 0x0f) << 5) |
    (date.getDate() & 0x1f);
  return { dosTime, dosDate };
}

/**
 * Builds a standards-compliant ZIP Blob from an array of { name: string, data: Uint8Array }
 */
export function buildZipBlob(entries) {
  const encoder = new TextEncoder();
  const { dosTime, dosDate } = getDosTimeDate();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(entry.data);
    const checksum = crc32(dataBytes);
    const size = dataBytes.length;

    // Local file header (30 bytes + filename)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true);         // Version needed to extract (2.0)
    lv.setUint16(6, 0x0800, true);     // General purpose bit flag (Bit 11: UTF-8 filename)
    lv.setUint16(8, 0, true);          // Compression method: 0 (STORE)
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, checksum, true);
    lv.setUint32(18, size, true);      // Compressed size
    lv.setUint32(22, size, true);      // Uncompressed size
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);         // Extra field length
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    // Central directory header (46 bytes + filename)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central directory signature
    cv.setUint16(4, 20, true);         // Version made by
    cv.setUint16(6, 20, true);         // Version needed
    cv.setUint16(8, 0x0800, true);     // UTF-8 filename flag
    cv.setUint16(10, 0, true);         // Compression method: STORE
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, checksum, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);         // Extra field length
    cv.setUint16(32, 0, true);         // File comment length
    cv.setUint16(34, 0, true);         // Disk number start
    cv.setUint16(36, 0, true);         // Internal file attributes
    cv.setUint32(38, 0, true);         // External file attributes
    cv.setUint32(42, offset, true);    // Relative offset of local header
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + size;
  }

  let centralSize = 0;
  for (const cp of centralParts) centralSize += cp.length;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);       // EOCD signature
  ev.setUint16(4, 0, true);                // Disk number
  ev.setUint16(6, 0, true);                // Disk where central dir starts
  ev.setUint16(8, entries.length, true);   // Entries on this disk
  ev.setUint16(10, entries.length, true);  // Total entries
  ev.setUint32(12, centralSize, true);     // Size of central directory
  ev.setUint32(16, offset, true);          // Offset of central directory
  ev.setUint16(20, 0, true);               // Comment length

  return new Blob([...localParts, ...centralParts, eocd], { type: 'application/zip' });
}
