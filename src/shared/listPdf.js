// Small, dependency-free PDF 1.4 writer for the store list. Same bytes on web/native.
// Standard Type 1 fonts, deterministic page breaks, no screenshot or remote assets.
const plain = (value) => String(value ?? '').replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/·/g, ' / ').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7e]/g, ' ');
const escape = (value) => plain(value).replace(/([\\()])/g, '\\$1');
// Conservative font estimate leaves extra room; split long tokens as well as words.
function wrap(value, width, size = 10) {
  const limit = Math.floor(width / (size * .62));
  const words = plain(value).split(/\s+/).flatMap((word) => word.match(new RegExp(`.{1,${limit}}`, 'g')) || []);
  const lines = []; let current = '';
  for (const word of words) {
    if (current.length + word.length + 1 > limit) { lines.push(current); current = ''; }
    current += (current ? ' ' : '') + word;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}
export function bytesToBase64(bytes) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
    out += alphabet[n >>> 18] + alphabet[(n >>> 12) & 63] + (i + 1 < bytes.length ? alphabet[(n >>> 6) & 63] : '=') + (i + 2 < bytes.length ? alphabet[n & 63] : '=');
  }
  return out;
}
export function createListPdf(assessment, { generatedAt = new Date().toISOString(), thumbnails = {}, title = 'My List' } = {}) {
  const objects = [null];
  const add = (body) => { objects.push(body); return objects.length - 1; };
  const catalogId = add(''); const pagesId = add('');
  const fontId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const images = {};
  for (const group of assessment.groups) for (const item of group.items) {
    const t = thumbnails[item.productId];
    if (t && !images[item.productId] && /^[\da-f]+$/i.test(t.hex) && t.width > 0 && t.height > 0) {
      const stream = t.hex + '>';
      const id = add(`<< /Type /XObject /Subtype /Image /Width ${t.width} /Height ${t.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      images[item.productId] = { id, name: `Im${id}` };
    }
  }
  const pages = []; let commands = []; let y;
  const text = (value, x, top, size = 10, bold = false, color = '0.1 0.14 0.2') => commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color} rg 1 0 0 1 ${x} ${792 - top} Tm (${escape(value)}) Tj ET`);
  const line = (top) => commands.push(`0.8 0.82 0.85 RG 0.5 w 36 ${792 - top} m 576 ${792 - top} l S`);
  function newPage() {
    if (commands.length) pages.push(commands.join('\n'));
    commands = []; y = 128;
    text('ROCKWALL FIREWORKS', 36, 37, 11, true);
    text(title, 36, 65, 24, true);
    text(`Generated ${plain(generatedAt).replace('T', ' ').replace(/\.\d+Z$/, ' UTC')}`, 36, 83, 8);
    text(`${assessment.total} selected retail units / ${assessment.free} confirmed bonus units / ${assessment.pending} units needing review`, 36, 98, 9);
    commands.push('0.9 0.28 0.08 RG 2 w 36 681 m 576 681 l S');
  }
  const ensure = (height) => { if (y + height > 686) newPage(); };
  function heading(group, continued = false) {
    const label = group.kind === 'individual' ? 'INDIVIDUAL PRODUCTS' : `${group.kind === 'bogo' ? 'BOGO' : 'PROMOTION'} / ${group.promotion?.name || 'Unavailable promotion'}`;
    const lines = wrap(label + (continued ? ' (continued)' : ''), 370, 10);
    lines.forEach((s) => { text(s, 36, y, 10, true); y += 13; });
    text('PAID', 425, y, 8, true); text('FREE', 473, y, 8, true); text('TOTAL', 525, y, 8, true);
    y += 10; line(y); y += 15;
  }
  newPage();
  // Consecutive individual selections share a table heading for compact printing.
  const printGroups = [];
  for (const group of assessment.groups) {
    const previous = printGroups.at(-1);
    if (group.kind === 'individual' && !group.issues.length && previous?.kind === 'individual' && !previous.issues.length) previous.items.push(...group.items);
    else printGroups.push({ ...group, items: [...group.items] });
  }
  for (const group of printGroups) {
    const rows = group.items.map((item) => {
      const product = item.snapshot; // Preserve the exact saved variant when review is pending.
      const hasImage = Boolean(images[item.productId]) && !item.changed && !item.missing;
      const x = hasImage ? 102 : 36;
      const body = [
        ...wrap(product.name, 400 - x, 11).map((s) => [s, 11, true]),
        ...wrap(`${product.category} / ${product.brand || 'Brand not specified'}`, 400 - x, 9).map((s) => [s, 9, false]),
        ...(product.presentation ? wrap(product.presentation, 400 - x, 9).map((s) => [s, 9, false]) : []),
        ...wrap((product.storeCodes || []).map((c) => c.sku ? `SKU ${c.sku}` : c.gtin ? `GTIN ${c.gtin}` : '').filter(Boolean).join(' / ') || (product.manufacturerCode ? `Model ${product.manufacturerCode}` : 'Store code not verified'), 400 - x, 8).map((s) => [s, 8, false]),
      ];
      return { item, body, x, hasImage, height: Math.max(hasImage ? 66 : 44, body.reduce((sum, s) => sum + s[1] + 4, 0) + 12) };
    });
    const notes = [...group.issues, ...(group.promotion?.conditions || [])];
    const noteLines = notes.flatMap((s) => wrap(s, 530, 8));
    const height = rows.reduce((sum, r) => sum + r.height, 0) + noteLines.length * 11 + 58;
    // Keep short promotion groups together. Long tables start in the available
    // space with at least two rows instead of wasting most of the current page.
    const startHeight = height > 540 ? rows.slice(0, 2).reduce((sum, row) => sum + row.height, 58) : height;
    ensure(startHeight); heading(group);
    for (const row of rows) {
      if (y + row.height > 682) { newPage(); heading(group, true); }
      const top = y;
      if (row.hasImage) commands.push(`q 56 0 0 56 36 ${792 - top - 46} cm /${images[row.item.productId].name} Do Q`);
      for (const [s, size, bold] of row.body) { text(s, row.x, y, size, bold); y += size + 4; }
      text(row.item.paid == null ? '-' : row.item.paid, 437, top, 11, true);
      text(row.item.free == null ? '-' : row.item.free, 485, top, 11, true);
      text(row.item.quantity, 540, top, 11, true);
      y = top + row.height; line(y - 14);
    }
    for (const note of noteLines) { if (y > 680) { newPage(); heading(group, true); } text(note, 36, y, 8); y += 11; }
    y += 18;
  }
  if (!assessment.groups.length) text('Your list is empty. Add products from the catalog.', 36, y, 11);
  pages.push(commands.join('\n'));
  const pageIds = [];
  pages.forEach((content, i) => {
    commands = [content];
    line(708);
    text('Store shopping list only. No payment, order or stock reservation.', 36, 724, 8);
    text('Availability, prices and promotion application are confirmed in store.', 36, 737, 8);
    text('A dash means paid/free allocation is pending. Quantities refer to complete retail units.', 36, 750, 8);
    text(`${i + 1} / ${pages.length}`, 540, 768, 8);
    const stream = commands.join('\n');
    const contentId = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${boldId} 0 R >> /XObject << ${Object.values(images).map((im) => `/${im.name} ${im.id} 0 R`).join(' ')} >> >> /Contents ${contentId} 0 R >>`));
  });
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  let output = '%PDF-1.4\n'; const offsets = [0];
  objects.slice(1).forEach((body, index) => { offsets.push(output.length); output += `${index + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = output.length;
  output += `xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map((n) => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Uint8Array.from(output, (c) => c.charCodeAt(0));
}
