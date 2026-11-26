// محرك الطباعة الجماعية والتصدير لقائمة الخريجين (كشف A4 + باجات دخول جماعية + شهادات جماعية + Excel CSV)
import { escapeHtml } from './printHelpers';
import { generateOfficialQrDataUrl } from '../qrVerify';

/**
 * تصدير قائمة الخريجين (المحددين أو الكل) إلى ملف CSV متوافق بالكامل مع Microsoft Excel (UTF-8 BOM)
 */
export function exportGraduatesToCsv(items = [], filenamePrefix = 'abdaa-1001-graduates') {
  const headers = [
    '#',
    'الاسم الكامل للخريج',
    'كود المبادرة',
    'رقم العضوية',
    'المجموعة',
    'المسار التقني',
    'مشروع التخرج',
    'الفئة العمرية',
    'التقدير'
  ];

  const escapeCsv = (val) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [
    headers.map(escapeCsv).join(','),
    ...items.map(({ grad, cohortName }, idx) =>
      [
        idx + 1,
        grad.name || '',
        grad.initiativeCode || '',
        grad.id || '',
        cohortName || '',
        grad.track || '',
        grad.project || '',
        grad.ageGroup || '6 – 14 سنة',
        grad.grade || 'امتياز'
      ]
        .map(escapeCsv)
        .join(',')
    )
  ];

  const bom = '\uFEFF';
  const blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenamePrefix}-${items.length}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * طباعة كشف أسماء الخريجين الرسمي (A4) مع عمود الاستلام والتوقيع
 */
export function openGraduatesRosterPrintWindow(items = [], titleLabel = 'كشف خريجي مبادرة «1001» طفل رقمي') {
  const win = window.open('', '_blank', 'width=1040,height=900');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الكشف الرسمي.');
    return;
  }

  const origin = window.location.origin;
  const rowsHtml = items
    .map(({ grad, cohortName }, idx) => {
      return `
        <tr>
          <td class="col-num">${idx + 1}</td>
          <td class="col-name">${escapeHtml(grad.name || '')}</td>
          <td class="col-code"><span dir="ltr">${escapeHtml(grad.initiativeCode || grad.id || '')}</span></td>
          <td class="col-group">${escapeHtml(cohortName || '')}</td>
          <td class="col-track">${escapeHtml(grad.track || '')}</td>
          <td class="col-sign"></td>
        </tr>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(titleLabel)} (${items.length})</title>
  <style>
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype");
      font-weight: 400;
    }
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype");
      font-weight: 700;
    }
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0;
      padding: 16px;
      background: #f1f5f9;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      color: #0f172a;
    }
    .toolbar {
      max-width: 210mm;
      margin: 0 auto 14px;
      background: #0f172a;
      color: #fff;
      padding: 12px 18px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .btn {
      background: #f59e0b;
      color: #0f172a;
      border: none;
      border-radius: 10px;
      padding: 9px 20px;
      font-family: inherit;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
    }
    .sheet {
      max-width: 210mm;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 16px 18px;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #0284c7;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header img { height: 42px; width: auto; object-fit: contain; }
    .header-center { text-align: center; }
    .header-center h1 { margin: 0; font-size: 17px; color: #0c2754; }
    .header-center p { margin: 3px 0 0; font-size: 11px; color: #475569; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    thead th {
      background: #0c2754;
      color: #ffffff;
      padding: 8px 6px;
      border: 1px solid #0c2754;
      font-weight: 700;
      text-align: right;
    }
    tbody td {
      padding: 6px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .col-num { width: 34px; text-align: center; font-weight: 800; color: #0284c7; }
    .col-name { font-weight: 800; color: #0f172a; }
    .col-code { width: 95px; font-family: monospace; font-weight: 700; color: #0369a1; text-align: center; }
    .col-group { width: 120px; font-size: 10.5px; color: #334155; }
    .col-track { font-size: 10.5px; color: #475569; }
    .col-sign { width: 82px; }
    .footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: #64748b;
      font-weight: 700;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; padding: 0; max-width: none; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>${escapeHtml(titleLabel)}</strong> — إجمالي السجلات: ${items.length} خريجاً</div>
    <button class="btn" onclick="window.print()">🖨️ طباعة الكشف الرسمي (A4)</button>
  </div>
  <div class="sheet">
    <div class="header">
      <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
      <div class="header-center">
        <h1>${escapeHtml(titleLabel)}</h1>
        <p>ملتقى النجف للابتكار الرقمي • الدفعة الأولى (${items.length} خريجاً) • قصر الثقافة – النجف الأشرف</p>
      </div>
      <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" />
    </div>
    <table>
      <thead>
        <tr>
          <th style="text-align:center">#</th>
          <th>الاسم الكامل للخريج</th>
          <th style="text-align:center">كود الدخول</th>
          <th>المجموعة</th>
          <th>المسار التقني</th>
          <th style="text-align:center">التسليم / التوقيع</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    <div class="footer">
      <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
      <span>الجمعة 27/11/2026</span>
    </div>
  </div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/**
 * طباعة باجات/هويات دخول الخريجين دفعة واحدة بمقاس حافظة A3 أفقي (114×91 مم لحافظة 115×92 مم)
 * 4 باجات رسمية في كل ورقة A4 أفقية (2×2) مع خطوط قص دقيقة للمقص الورقي ورمز QR لكل خريج
 */
export async function openBatchEntryBadgesPrintWindow(items = [], variant = 'light', onProgress) {
  const win = window.open('', '_blank', 'width=1180,height=860');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة باجات الدخول الجماعية.');
    return;
  }

  win.document.open();
  win.document.write(
    '<html dir="rtl" lang="ar"><body style="font-family:Tahoma,sans-serif;text-align:center;padding:60px;background:#f8fafc"><h2>جارٍ توليد رموز QR وتجهيز باجات دخول الأطفال بمقاس حافظة A3 (115×92 مم)...</h2></body></html>'
  );
  win.document.close();

  const origin = window.location.origin;
  const isDark = variant === 'dark';

  // Generate QR codes in parallel batches of 16
  const prepared = [];
  for (let i = 0; i < items.length; i += 16) {
    const slice = items.slice(i, i + 16);
    const batchResults = await Promise.all(
      slice.map(async ({ grad, cohortName }) => {
        const code = grad.initiativeCode || grad.id || '1001-IQ-000';
        const qr = await generateOfficialQrDataUrl(
          {
            type: 'grad',
            code,
            name: grad.name || '',
            role: 'بطاقة دخول خريج معتمد — الدفعة الأولى',
            track: grad.track || '',
            extra: cohortName || ''
          },
          200
        );
        return { grad, cohortName, qr };
      })
    );
    prepared.push(...batchResults);
    if (onProgress) onProgress(Math.min(items.length, i + slice.length), items.length);
  }

  // Group into pages of 4 badges (2x2 A4 landscape — each 114x91mm for 115x92mm A3 holder)
  const pages = [];
  for (let i = 0; i < prepared.length; i += 4) {
    pages.push(prepared.slice(i, i + 4));
  }

  const pagesHtml = pages
    .map((pageItems, pIdx) => {
      const cardsHtml = pageItems
        .map(({ grad, cohortName, qr }) => {
          const safeName = escapeHtml(grad.name || '');
          const safeCode = escapeHtml(grad.initiativeCode || grad.id || '');
          const safeId = escapeHtml(grad.id || '');
          const safeTrack = escapeHtml(grad.track || '');
          const safeCohort = escapeHtml(cohortName || '');
          const safeAge = escapeHtml(grad.ageGroup || '6 – 14 سنة');
          const rawPhoto = String(grad.photoDataUrl || '').trim();
          const hasPhoto = rawPhoto.startsWith('data:image/') || rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://') || rawPhoto.startsWith('/');
          return `
            <div class="cut-frame">
              <div class="badge-card ${isDark ? 'badge-dark' : 'badge-light'}">
                <div class="top-row">
                  <img src="${origin}/brand/abdaa-logo.png" class="logo-abdaa" alt="أبدع" />
                  <img src="${origin}/brand/logo-1001-kids.png" class="logo-1001 ${isDark ? 'logo-pill' : ''}" alt="1001" />
                  <img src="${origin}/brand/masdar-logo-full-clean.png" class="logo-masdar ${isDark ? 'logo-pill' : ''}" alt="المصدر" />
                </div>

                <div class="ribbon">
                  <div class="rib-title">★ بطاقة دخول خريج معتمد ★</div>
                  <div class="rib-sub">الدفعة الأولى • مبادرة «1001» طفل رقمي • الفئة (${safeAge})</div>
                </div>

                <div class="body-split">
                  <div class="info-col">
                    <div class="name-row">
                      ${hasPhoto ? `<img src="${escapeHtml(rawPhoto)}" alt="${safeName}" class="kid-photo" />` : ''}
                      <div class="name-stack">
                        <div class="student-name">${safeName}</div>
                        ${safeCohort ? `<div class="cohort-pill">${safeCohort}</div>` : ''}
                      </div>
                    </div>

                    <div class="meta-box">
                      <div class="meta-row">
                        <span>كود الدخول:</span>
                        <strong class="mono-code" dir="ltr">${safeCode}</strong>
                      </div>
                      <div class="meta-row">
                        <span>رقم العضوية:</span>
                        <strong class="mono-id" dir="ltr">${safeId}</strong>
                      </div>
                      <div class="meta-row">
                        <span>المسار:</span>
                        <strong class="track-val">${safeTrack}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="qr-col">
                    <div class="qr-wrap">
                      <img src="${qr}" alt="QR" />
                    </div>
                    <div class="qr-caption">تصريح دخول رسمي</div>
                    <div class="qr-code-txt" dir="ltr">${safeCode}</div>
                  </div>
                </div>

                <div class="motto">نادي أبدع للمهارات الذكية × شركة المصدر • الجمعة 27/11/2026</div>
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="a4-page">
          <div class="grid-4">${cardsHtml}</div>
          <div class="page-foot-note">باجات خريجي مبادرة 1001 طفل رقمي — مقاس حافظة A3 أفقي (114×91 مم لحافظة 115×92 مم) — صفحة ${pIdx + 1} من ${pages.length}</div>
        </div>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>باجات خريجي 1001 طفل رقمي — مقاس حافظة A3 أفقي 115×92 مم (${items.length} باج)</title>
  <style>
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype"); font-weight: 400; }
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype"); font-weight: 700; }
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 14px; background: #cbd5e1; font-family: "PNU", "Tahoma", Arial, sans-serif; }
    .toolbar {
      max-width: 297mm; margin: 0 auto 14px; background: #082046; color: #fff;
      padding: 12px 20px; border-radius: 12px; border-bottom: 3px solid #f59e0b;
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px;
    }
    .toolbar-sub { font-size: 11px; color: #fde68a; margin-top: 3px; }
    .btn {
      background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #082046; border: none;
      border-radius: 8px; padding: 9px 22px; font-weight: 800; font-size: 13px; cursor: pointer; font-family: inherit;
    }
    .a4-page {
      width: 297mm; height: 210mm; margin: 0 auto 16px; background: #ffffff;
      padding: 10mm 28mm 8mm; display: flex; flex-direction: column;
      align-items: center; justify-content: center; position: relative;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
      page-break-after: always; break-after: page; overflow: hidden;
    }
    .a4-page:last-child { page-break-after: auto; break-after: auto; }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(2, 114mm);
      grid-template-rows: repeat(2, 91mm);
      column-gap: 8mm;
      row-gap: 6mm;
      justify-content: center;
      align-content: center;
    }
    .cut-frame {
      width: 114mm; height: 91mm;
      border: 0.35mm dashed #94a3b8;
      padding: 1.8mm;
      background: #ffffff;
      display: flex;
    }
    .badge-card {
      width: 100%; height: 100%;
      border-radius: 3mm;
      padding: 2.6mm 3.2mm 2.4mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .badge-light {
      background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 58%, #fffbeb 100%);
      border: 0.7mm solid #f59e0b;
      color: #0f172a;
    }
    .badge-dark {
      background: linear-gradient(155deg, #07132c 0%, #0d2552 60%, #10326b 100%);
      border: 0.7mm solid #38bdf8;
      color: #ffffff;
    }
    .top-row {
      display: flex; align-items: center; justify-content: space-between; gap: 3mm;
      padding-bottom: 1.4mm;
      border-bottom: 0.3mm solid rgba(148, 163, 184, 0.35);
    }
    .logo-abdaa { height: 9.5mm; width: auto; background: #fff; border-radius: 1.6mm; padding: 0.5mm; object-fit: contain; }
    .logo-1001 { height: 10.5mm; width: auto; object-fit: contain; }
    .logo-masdar { height: 6.8mm; width: auto; object-fit: contain; }
    .logo-pill { background: #ffffff; border-radius: 1.8mm; padding: 0.6mm 1.8mm; }
    .ribbon {
      background: linear-gradient(90deg, #082046, #0369a1, #082046);
      border: 0.45mm solid #f59e0b;
      border-radius: 2mm;
      padding: 1.4mm 2.5mm;
      text-align: center;
      color: #ffffff;
    }
    .rib-title { font-size: 10.5pt; font-weight: 700; line-height: 1.15; }
    .rib-sub { font-size: 6.8pt; color: #fde68a; font-weight: 700; margin-top: 0.4mm; }
    .body-split {
      display: flex; align-items: stretch; justify-content: space-between; gap: 3mm;
      flex: 1; margin: 1.8mm 0;
    }
    .info-col {
      flex: 1;
      display: flex; flex-direction: column; justify-content: space-between;
      text-align: right; min-width: 0;
    }
    .name-row {
      display: flex; align-items: center; gap: 2.2mm;
    }
    .kid-photo {
      width: 14mm; height: 14mm; border-radius: 50%; object-fit: cover;
      border: 0.5mm solid #f59e0b; flex-shrink: 0; background: #fff;
    }
    .name-stack { flex: 1; min-width: 0; }
    .student-name {
      font-size: 14pt; font-weight: 700; color: #082046; line-height: 1.2;
      word-break: break-word;
    }
    .badge-dark .student-name { color: #38bdf8; }
    .cohort-pill {
      display: inline-block;
      margin-top: 1.2mm;
      padding: 0.9mm 2.2mm;
      border-radius: 1.8mm;
      background: #fef3c7;
      border: 0.35mm solid #f59e0b;
      color: #92400e;
      font-size: 7.8pt;
      font-weight: 700;
      line-height: 1.2;
    }
    .badge-dark .cohort-pill {
      background: rgba(245, 158, 11, 0.2);
      border-color: #fbbf24;
      color: #fde68a;
    }
    .meta-box {
      border-radius: 2mm;
      padding: 1.4mm 2.4mm;
      font-size: 8pt;
      background: #f8fafc;
      border: 0.3mm solid #cbd5e1;
    }
    .badge-dark .meta-box {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .meta-row {
      display: flex; justify-content: space-between; align-items: center; gap: 2mm;
      padding: 0.65mm 0;
      border-bottom: 0.25mm dashed rgba(148, 163, 184, 0.35);
    }
    .meta-row:last-child { border-bottom: none; }
    .mono-code { font-family: "Consolas", monospace; color: #0284c7; font-size: 8.6pt; }
    .badge-dark .mono-code { color: #fde047; }
    .mono-id { font-family: "Consolas", monospace; font-size: 8.2pt; }
    .track-val { font-size: 7.5pt; max-width: 48mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qr-col {
      width: 27mm; flex-shrink: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center;
      border-right: 0.3mm dashed rgba(148, 163, 184, 0.4);
      padding-right: 2.2mm;
    }
    .qr-wrap {
      background: #ffffff; padding: 1.2mm; border-radius: 2mm;
      border: 0.45mm solid #0284c7;
    }
    .qr-wrap img { width: 21mm; height: 21mm; display: block; }
    .qr-caption { font-size: 6.8pt; font-weight: 700; color: #0284c7; margin-top: 1.2mm; line-height: 1.2; }
    .badge-dark .qr-caption { color: #fde68a; }
    .qr-code-txt { font-family: "Consolas", monospace; font-size: 7pt; font-weight: 700; color: #475569; margin-top: 0.4mm; }
    .badge-dark .qr-code-txt { color: #cbd5e1; }
    .motto {
      background: #082046; color: #fbbf24;
      font-size: 7.4pt; font-weight: 700; text-align: center;
      padding: 1.3mm 2mm; border-radius: 1.8mm;
    }
    .badge-dark .motto { background: #0284c7; color: #ffffff; }
    .page-foot-note {
      position: absolute; bottom: 2.6mm; left: 0; right: 0;
      text-align: center; font-size: 7.5pt; color: #94a3b8; font-weight: 700;
    }
    @media print {
      body { background: #ffffff; padding: 0; margin: 0; }
      .toolbar { display: none !important; }
      .a4-page { margin: 0; box-shadow: none; width: 297mm; height: 210mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <div><strong>طباعة باجات دخول الخريجين — مقاس حافظة A3 أفقي (114×91 مم لحافظة 115×92 مم):</strong> ${items.length} باج (${pages.length} صفحة A4 أفقية)</div>
      <div class="toolbar-sub">إعدادات الطباعة الموصى بها: الورق A4 • الاتجاه أفقي (Landscape) • المقياس 100% (Actual Size / بدون تصغير) • قص على الخط المتقطع</div>
    </div>
    <button class="btn" onclick="window.print()">🖨️ طباعة جميع الباجات الآن (A4 أفقي)</button>
  </div>
  ${pagesHtml}
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/**
 * طباعة شهادات التخرج الرسمية دفعة واحدة (شهادة A4 أفقية لكل خريج مع QR التحقق)
 */
export async function openBatchCertificatesPrintWindow(items = [], onProgress) {
  const win = window.open('', '_blank', 'width=1180,height=860');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الشهادات الجماعية.');
    return;
  }

  win.document.open();
  win.document.write(
    '<html dir="rtl" lang="ar"><body style="font-family:Tahoma,sans-serif;text-align:center;padding:60px;background:#f8fafc"><h2>جارٍ تجهيز شهادات التخرج الجماعية ورموز QR...</h2></body></html>'
  );
  win.document.close();

  const origin = window.location.origin;
  const prepared = [];
  for (let i = 0; i < items.length; i += 16) {
    const slice = items.slice(i, i + 16);
    const batchResults = await Promise.all(
      slice.map(async ({ grad, cohortName }) => {
        const code = grad.initiativeCode || grad.id || '1001-IQ-000';
        const qr = await generateOfficialQrDataUrl(
          {
            type: 'grad',
            code,
            name: grad.name || '',
            role: 'شهادة تخرج رسمية معتمدة — الدفعة الأولى',
            track: grad.track || '',
            extra: cohortName || ''
          },
          180
        );
        return { grad, cohortName, qr };
      })
    );
    prepared.push(...batchResults);
    if (onProgress) onProgress(Math.min(items.length, i + slice.length), items.length);
  }

  const certsHtml = prepared
    .map(({ grad, cohortName, qr }) => {
      const safeName = escapeHtml(grad.name || '');
      const safeCode = escapeHtml(grad.initiativeCode || grad.id || '');
      const safeTrack = escapeHtml(grad.track || 'البرمجة والذكاء الاصطناعي والروبوتات');
      const safeProject = escapeHtml(grad.project || 'مشروع تخرج الدفعة الأولى — مبادرة 1001 طفل رقمي');
      const safeGrade = escapeHtml(grad.grade || 'امتياز مع مرتبة الشرف');
      return `
        <div class="cert-page">
          <div class="cert-border">
            <div class="cert-inner">
              <div class="cert-top">
                <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" class="c-logo" />
                <div class="c-center-brand">
                  <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" class="c-logo-1001" />
                  <div class="c-forum">برعاية فخامة رئيس الجمهورية • ملتقى النجف للابتكار الرقمي • احتفالية تخرج الدفعة الأولى</div>
                </div>
                <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" class="c-logo-masdar" />
              </div>

              <div class="c-title">شهادة تخرج وتفوّق رسمية</div>
              <div class="c-intro">يشهد نادي أبدع للمهارات الذكية وشركة المصدر لتكنولوجيا المعلومات بأن البطل / البطلة:</div>
              <div class="c-name">${safeName}</div>
              <div class="c-body">
                قد أتمّ بنجاح متطلبات الدفعة الأولى ضمن <strong>مبادرة «1001» طفل رقمي</strong>
                في مسار <strong>${safeTrack}</strong> ${cohortName ? `(${escapeHtml(cohortName)})` : ''}
                وحاز تقدير <strong class="c-grade">${safeGrade}</strong> عن إنجاز مشروع:
                <div class="c-project">«${safeProject}»</div>
              </div>

              <div class="c-footer">
                <div class="sig-block">
                  <div class="sig-title">الأستاذ فراس نزار كريم</div>
                  <div class="sig-role">مؤسس نادي أبدع للمهارات الذكية</div>
                </div>
                <div class="qr-center">
                  <img src="${qr}" alt="QR" />
                  <div dir="ltr">${safeCode}</div>
                </div>
                <div class="sig-block">
                  <div class="sig-title">الأستاذ كرار حساني</div>
                  <div class="sig-role">المدير التنفيذي — شركة المصدر</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>شهادات تخرج مبادرة 1001 طفل رقمي (${items.length} شهادة)</title>
  <style>
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype"); font-weight: 400; }
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype"); font-weight: 700; }
    @page { size: A4 landscape; margin: 8mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 14px; background: #e2e8f0; font-family: "PNU", "Tahoma", Arial, sans-serif; }
    .toolbar {
      max-width: 281mm; margin: 0 auto 14px; background: #0f172a; color: #fff;
      padding: 12px 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;
    }
    .btn { background: #f59e0b; color: #0f172a; border: none; border-radius: 10px; padding: 9px 22px; font-weight: 800; cursor: pointer; font-family: inherit; }
    .cert-page {
      width: 281mm; height: 194mm; margin: 0 auto 18px; background: #fff;
      padding: 8mm; border-radius: 10px; page-break-after: always;
    }
    .cert-page:last-child { page-break-after: auto; }
    .cert-border {
      width: 100%; height: 100%; border: 4px solid #0c2754; border-radius: 16px; padding: 6px;
      background: linear-gradient(135deg, #fff 0%, #f8fbff 55%, #fffbeb 100%);
    }
    .cert-inner {
      width: 100%; height: 100%; border: 2px solid #f59e0b; border-radius: 12px;
      padding: 14px 26px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;
    }
    .cert-top { display: flex; align-items: center; justify-content: space-between; }
    .c-logo { height: 58px; width: auto; }
    .c-logo-1001 { height: 64px; width: auto; display: block; margin: 0 auto; }
    .c-logo-masdar { height: 34px; width: auto; }
    .c-forum { font-size: 12px; font-weight: 700; color: #0369a1; margin-top: 2px; }
    .c-title { font-size: 32px; font-weight: 800; color: #0c2754; margin-top: 4px; }
    .c-intro { font-size: 14px; color: #475569; font-weight: 700; }
    .c-name {
      font-size: 36px; font-weight: 800; color: #0284c7;
      border-bottom: 2.5px solid #f59e0b; display: inline-block; margin: 4px auto; padding: 0 28px 4px;
    }
    .c-body { font-size: 15px; line-height: 1.7; color: #1e293b; max-width: 88%; margin: 0 auto; }
    .c-grade { color: #b45309; }
    .c-project { font-size: 14px; font-weight: 800; color: #0c2754; margin-top: 4px; }
    .c-footer { display: flex; align-items: flex-end; justify-content: space-between; padding: 0 18px; }
    .sig-block { width: 220px; border-top: 1.5px solid #94a3b8; padding-top: 6px; }
    .sig-title { font-size: 13px; font-weight: 800; color: #0f172a; }
    .sig-role { font-size: 11px; color: #64748b; }
    .qr-center { text-align: center; }
    .qr-center img { width: 72px; height: 72px; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 3px; background: #fff; }
    .qr-center div { font-family: monospace; font-size: 10.5px; font-weight: 700; color: #0369a1; margin-top: 2px; }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .cert-page { margin: 0; border-radius: 0; padding: 0; width: 100%; height: 193mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>طباعة شهادات التخرج الجماعية:</strong> ${items.length} شهادة رسمية (A4 أفقي)</div>
    <button class="btn" onclick="window.print()">🖨️ طباعة جميع الشهادات الآن</button>
  </div>
  ${certsHtml}
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
