// محرك تصدير هويات وباجات دخول الخريجين كصور PNG عالية الدقة (900×1400 px - جاهزة للطباعة الحرارية والـ Lanyard)
import { generateOfficialQrDataUrl } from './qrVerify';
import { buildZipBlob } from './zipBuilder';

const ASSET_CACHE = new Map();

function loadAssetImage(src) {
  if (!src) return Promise.resolve(null);
  if (ASSET_CACHE.has(src)) return ASSET_CACHE.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  if (!src.startsWith('data:')) {
    ASSET_CACHE.set(src, p);
  }
  return p;
}

function fitText(ctx, text, x, y, maxW, startPx, minPx, weight = '800', family = '"Alexandria", "Tajawal", sans-serif') {
  let sz = startPx;
  ctx.font = `${weight} ${sz}px ${family}`;
  while (ctx.measureText(text).width > maxW && sz > minPx) {
    sz -= 2;
    ctx.font = `${weight} ${sz}px ${family}`;
  }
  ctx.fillText(text, x, y);
}

function sanitizeFileName(str) {
  return String(str || 'graduate')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

/**
 * Renders one official graduate entry badge / lanyard ID card onto an HTML5 Canvas (900×1400 PNG)
 * @param {Object} grad
 * @param {Object} options { cohortName, variant: 'light' | 'dark' }
 * @returns {Promise<{ blob: Blob, dataUrl: string, filename: string }>}
 */
export async function renderGraduateEntryBadgePng(grad, options = {}) {
  const { cohortName = '', variant = 'light' } = options;
  const isDark = variant === 'dark';

  const W = 900;
  const H = 1400;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Wait briefly for Arabic fonts
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 200))]);
    } catch {
      // ignore
    }
  }

  const gradCode = grad.initiativeCode || grad.id || '1001-IQ-000';
  const memId = grad.id || `DK-2026-${gradCode}`;
  const gradName = grad.name || 'بطل مبادرة 1001 طفل رقمي';
  const gradTrack = grad.track || 'البرمجة والمهارات الرقمية';
  const gradProject = grad.project || 'مشروع تخرج الدفعة الأولى — مبادرة 1001 طفل رقمي';
  const gradAge = grad.ageGroup || '6 – 14 سنة';
  const gradGrade = grad.grade || 'امتياز مع مرتبة الشرف';

  const qrDataUrl = await generateOfficialQrDataUrl(
    {
      type: 'grad',
      code: gradCode,
      name: gradName,
      role: 'بطاقة دخول خريج معتمد — الدفعة الأولى',
      track: gradTrack,
      extra: cohortName || gradAge
    },
    260
  );

  const [logoAbdaa, logo1001, logoMasdar, qrImg, studentPhoto] = await Promise.all([
    loadAssetImage('/brand/abdaa-logo.png'),
    loadAssetImage('/brand/logo-1001-kids.png'),
    loadAssetImage('/brand/masdar-logo-full-clean.png'),
    loadAssetImage(qrDataUrl),
    grad.photoDataUrl ? loadAssetImage(grad.photoDataUrl) : Promise.resolve(null)
  ]);

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Card Outer Background & Rounded Shape
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(14, 14, W - 28, H - 28, 56);
  ctx.clip();

  if (isDark) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#07132c');
    bg.addColorStop(0.55, '#0c234d');
    bg.addColorStop(1, '#091731');
    ctx.fillStyle = bg;
  } else {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#ffffff');
    bg.addColorStop(0.55, '#f8fbff');
    bg.addColorStop(1, '#fffbeb');
    ctx.fillStyle = bg;
  }
  ctx.fillRect(0, 0, W, H);

  // Subtle ambient decorative circles
  ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.10)';
  ctx.beginPath();
  ctx.arc(W - 80, 140, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(251, 191, 36, 0.12)';
  ctx.beginPath();
  ctx.arc(100, H - 220, 220, 0, Math.PI * 2);
  ctx.fill();

  // Top decorative accent bar
  const topBarGrad = ctx.createLinearGradient(0, 0, W, 0);
  topBarGrad.addColorStop(0, '#0284c7');
  topBarGrad.addColorStop(0.5, '#f59e0b');
  topBarGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = topBarGrad;
  ctx.fillRect(0, 0, W, 28);
  ctx.restore();

  // Outer frame border
  ctx.strokeStyle = isDark ? '#38bdf8' : '#f59e0b';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(14, 14, W - 28, H - 28, 56);
  ctx.stroke();

  // 2. Lanyard Punch Slot Marker
  ctx.save();
  ctx.fillStyle = isDark ? '#020617' : '#f1f5f9';
  ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.roundRect(W / 2 - 74, 46, 148, 28, 14);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 3. Top Official Logos Row
  const headerY = 98;
  // Right pill: Abdaa Logo
  if (logoAbdaa?.width) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(W - 180, headerY, 124, 92, 22);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    const ih = 74;
    const iw = Math.min((logoAbdaa.width / logoAbdaa.height) * ih, 102);
    ctx.drawImage(logoAbdaa, W - 180 + (124 - iw) / 2, headerY + (92 - ih) / 2, iw, ih);
    ctx.restore();
  }

  // Left pill: Masdar Logo
  if (logoMasdar?.width) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(56, headerY, 168, 92, 22);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    const ratio = Math.min(144 / logoMasdar.width, 64 / logoMasdar.height);
    const iw = logoMasdar.width * ratio;
    const ih = logoMasdar.height * ratio;
    ctx.drawImage(logoMasdar, 56 + (168 - iw) / 2, headerY + (92 - ih) / 2, iw, ih);
    ctx.restore();
  }

  // Center: 1001 Kids Logo (with clean white pill on dark theme)
  if (logo1001?.width) {
    const lh = 96;
    const lw = (logo1001.width / logo1001.height) * lh;
    ctx.save();
    if (isDark) {
      ctx.fillStyle = 'rgba(255,255,255,0.96)';
      ctx.beginPath();
      ctx.roundRect(W / 2 - lw / 2 - 20, headerY - 4, lw + 40, lh + 8, 24);
      ctx.fill();
    }
    ctx.drawImage(logo1001, W / 2 - lw / 2, headerY, lw, lh);
    ctx.restore();
  }

  // Divider line
  ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(56, 214);
  ctx.lineTo(W - 56, 214);
  ctx.stroke();

  // 4. Official Entry Badge Ribbon
  ctx.save();
  const ribGrad = ctx.createLinearGradient(56, 234, W - 56, 234);
  ribGrad.addColorStop(0, '#0f172a');
  ribGrad.addColorStop(0.5, '#0369a1');
  ribGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = ribGrad;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(56, 232, W - 112, 104, 26);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  fitText(ctx, '★ بطاقة دخول خريج معتمد ★', W / 2, 268, W - 160, 36, 24, '900');
  ctx.fillStyle = '#fde68a';
  fitText(ctx, `احتفالية تخرج الدفعة الأولى • قصر الثقافة – النجف الأشرف (${gradAge})`, W / 2, 310, W - 150, 21, 15, '700', '"Tajawal", sans-serif');
  ctx.restore();

  // 5. Center Avatar Ring
  const ringCx = W / 2;
  const ringCy = 468;
  const ringR = 108;
  ctx.save();
  const ringBg = ctx.createRadialGradient(ringCx, ringCy, 10, ringCx, ringCy, ringR);
  ringBg.addColorStop(0, '#f0f9ff');
  ringBg.addColorStop(1, '#fef3c7');
  ctx.fillStyle = ringBg;
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR - 6, 0, Math.PI * 2);
  ctx.clip();
  if (studentPhoto?.width) {
    const scale = Math.max((ringR * 2) / studentPhoto.width, (ringR * 2) / studentPhoto.height);
    const dw = studentPhoto.width * scale;
    const dh = studentPhoto.height * scale;
    ctx.drawImage(studentPhoto, ringCx - dw / 2, ringCy - dh / 2, dw, dh);
  } else if (logoAbdaa?.width) {
    const size = 148;
    const ratio = Math.min(size / logoAbdaa.width, size / logoAbdaa.height);
    const dw = logoAbdaa.width * ratio;
    const dh = logoAbdaa.height * ratio;
    ctx.drawImage(logoAbdaa, ringCx - dw / 2, ringCy - dh / 2, dw, dh);
  }
  ctx.restore();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 6. Prominent Student Name Banner
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isDark ? '#38bdf8' : '#0369a1';
  fitText(ctx, gradName, W / 2, 634, W - 120, 48, 28, '900');

  if (cohortName) {
    ctx.fillStyle = isDark ? '#fde68a' : '#b45309';
    fitText(ctx, cohortName, W / 2, 686, W - 140, 26, 18, '800', '"Tajawal", sans-serif');
  }
  ctx.restore();

  // 7. Structured Metadata Box
  const boxX = 56;
  const boxY = 720;
  const boxW = W - 112;
  const boxH = 310;
  ctx.save();
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : '#f8fafc';
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.16)' : '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 30);
  ctx.fill();
  ctx.stroke();

  const rows = [
    { label: 'كود الدخول (المبادرة):', value: gradCode, mono: true, color: isDark ? '#38bdf8' : '#0284c7' },
    { label: 'رقم العضوية الرسمي:', value: memId, mono: true, color: isDark ? '#ffffff' : '#0f172a' },
    { label: 'المسار التقني:', value: gradTrack, color: isDark ? '#e2e8f0' : '#0f172a' },
    { label: 'مشروع التخرج:', value: gradProject, color: isDark ? '#cbd5e1' : '#334155' },
    { label: 'التقدير الرسمي:', value: gradGrade, color: isDark ? '#fbbf24' : '#d97706' }
  ];

  const rowH = boxH / rows.length;
  rows.forEach((row, idx) => {
    const ry = boxY + idx * rowH + rowH / 2;
    if (idx > 0) {
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.30)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(boxX + 24, boxY + idx * rowH);
      ctx.lineTo(boxX + boxW - 24, boxY + idx * rowH);
      ctx.stroke();
      ctx.restore();
    }

    // Right label
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '700 22px "Tajawal", sans-serif';
    ctx.fillText(row.label, boxX + boxW - 28, ry);

    // Left value (auto-fit)
    ctx.textAlign = 'left';
    ctx.fillStyle = row.color;
    const valFont = row.mono ? '"Courier New", monospace' : '"Alexandria", "Tajawal", sans-serif';
    ctx.direction = row.mono ? 'ltr' : 'rtl';
    if (row.mono) {
      fitText(ctx, row.value, boxX + 28, ry, boxW - 290, 24, 17, '900', valFont);
    } else {
      // In RTL, left-aligned text still uses x as left edge with textAlign='left'
      fitText(ctx, row.value, boxX + 28, ry, boxW - 290, 22, 15, '800', valFont);
    }
    ctx.direction = 'rtl';
  });
  ctx.restore();

  // 8. QR Verification Footer Row
  const qrRowY = 1062;
  ctx.save();
  // QR White Box on Left
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = isDark ? '#38bdf8' : '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(62, qrRowY, 192, 192, 24);
  ctx.fill();
  ctx.stroke();
  if (qrImg?.width) {
    ctx.drawImage(qrImg, 76, qrRowY + 14, 164, 164);
  }

  // Sponsor & Entry Instructions on Right
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isDark ? '#fde047' : '#0369a1';
  fitText(ctx, 'تصريح دخول رسمي لحفل التخرج', W - 62, qrRowY + 34, 560, 26, 20, '900');

  ctx.fillStyle = isDark ? '#e2e8f0' : '#334155';
  fitText(ctx, 'المؤسس المنظم: نادي أبدع للمهارات الذكية', W - 62, qrRowY + 84, 560, 22, 16, '800', '"Tajawal", sans-serif');
  fitText(ctx, 'الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات', W - 62, qrRowY + 122, 560, 22, 16, '800', '"Tajawal", sans-serif');

  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  fitText(ctx, 'امسح رمز QR للتحقق الإلكتروني الفوري من الباج', W - 62, qrRowY + 164, 560, 19, 15, '700', '"Tajawal", sans-serif');
  ctx.restore();

  // 9. Bottom Motto Bar
  ctx.save();
  ctx.fillStyle = isDark ? '#0284c7' : '#0f172a';
  ctx.beginPath();
  ctx.roundRect(56, 1284, W - 112, 68, 22);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isDark ? '#ffffff' : '#fbbf24';
  fitText(ctx, 'نصنع جيلاً يبرمج المستقبل  •  الجمعة 27/11/2026  •  النجف الأشرف', W / 2, 1319, W - 150, 24, 17, '900');
  ctx.restore();

  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const filename = `${sanitizeFileName(gradCode)} - ${sanitizeFileName(gradName)}.png`;

  return { blob, dataUrl, filename };
}

/**
 * Downloads a single graduate's entry badge directly as a high-res PNG file
 */
export async function downloadSingleGraduateBadgePng(grad, cohortName = '', variant = 'light') {
  const { dataUrl, filename } = await renderGraduateEntryBadgePng(grad, { cohortName, variant });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
  return filename;
}

/**
 * Generates high-res PNG entry badges for an array of graduates and downloads them all in a single ZIP archive
 * @param {Array<{ grad: Object, cohortName: string }>} items
 * @param {'light'|'dark'} variant
 * @param {(done: number, total: number, currentName: string) => void} [onProgress]
 */
export async function downloadBulkGraduateBadgesZip(items, variant = 'light', onProgress) {
  const entries = [];
  const usedNames = new Set();
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const { grad, cohortName } = items[i];
    if (onProgress) onProgress(i, total, grad.name || '');

    const { blob, filename } = await renderGraduateEntryBadgePng(grad, { cohortName, variant });
    if (!blob) continue;
    const bytes = new Uint8Array(await blob.arrayBuffer());

    let uniqueName = filename;
    let dup = 2;
    while (usedNames.has(uniqueName)) {
      uniqueName = filename.replace(/\.png$/i, ` (${dup++}).png`);
    }
    usedNames.add(uniqueName);
    entries.push({ name: uniqueName, data: bytes });

    // Yield briefly to keep UI responsive and progress bar smooth
    if (i % 4 === 3) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  if (onProgress) onProgress(total, total, 'جارٍ حزم ملف ZIP...');

  const zipBlob = buildZipBlob(entries);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `abdaa-1001-entry-badges-png-${variant}-${total}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return entries.length;
}
