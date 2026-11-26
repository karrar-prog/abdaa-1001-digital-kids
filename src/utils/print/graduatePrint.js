import { escapeHtml, sanitizeImageSrc, sanitizeHexColor } from './printHelpers';

export function openGraduateBadgePrintWindow(grad, qrDataUrl, photoDataUrl = '') {
  const win = window.open('', '_blank', 'width=1180,height=840');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(grad.name);
  const safeId = escapeHtml(grad.id);
  const safeCode = escapeHtml(grad.initiativeCode || grad.id || '');
  const safeTrack = escapeHtml(grad.track || '');
  const safeProject = escapeHtml(grad.project || '');
  const safeAge = escapeHtml(grad.ageGroup || '6 - 14 سنة');
  const safeGrade = escapeHtml(grad.grade || 'امتياز مع مرتبة الشرف');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';
  const safeUserPhoto = sanitizeImageSrc(photoDataUrl || grad.photoDataUrl || '', '');

  const buildSingleCardHtml = (isDark) => `
    <div class="cut-frame">
      <div class="badge-card ${isDark ? 'badge-dark' : 'badge-light'}">
        <div class="top-row">
          <img src="${origin}/brand/abdaa-logo.png" class="logo-abdaa" alt="نادي أبدع" />
          <img src="${origin}/brand/logo-1001-kids.png" class="logo-1001 ${isDark ? 'logo-pill' : ''}" alt="1001 طفل رقمي" />
          <img src="${origin}/brand/${isDark ? 'masdar-logo-full-white.png' : 'masdar-logo-full-clean.png'}" class="logo-masdar" alt="شركة المصدر" />
        </div>

        <div class="ribbon">
          <div class="rib-title">★ بطاقة دخول خريج معتمد ★</div>
          <div class="rib-sub">احتفالية تخرج الدفعة الأولى • الفئة (${safeAge})</div>
        </div>

        <div class="body-split">
          <div class="info-col">
            <div class="name-row">
              ${safeUserPhoto ? `<img src="${safeUserPhoto}" alt="${safeName}" class="kid-photo" />` : ''}
              <div class="name-stack">
                <div class="student-name">${safeName}</div>
                <div class="grade-pill">${safeGrade}</div>
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
              ${safeProject ? `<div class="meta-row"><span>المشروع:</span><strong class="track-val">${safeProject}</strong></div>` : ''}
            </div>
          </div>

          <div class="qr-col">
            ${safeQr ? `<div class="qr-wrap"><img src="${safeQr}" alt="QR" /></div>` : ''}
            <div class="qr-caption">تصريح دخول رسمي</div>
            <div class="qr-code-txt" dir="ltr">${safeCode}</div>
          </div>
        </div>

        <div class="motto">نادي أبدع للمهارات الذكية × شركة المصدر • الجمعة 27/11/2026</div>
      </div>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>بطاقة خريج مبادرة 1001 طفل رقمي — مقاس حافظة A3 (115×92 مم) — ${safeName}</title>
  <style>
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype"); font-weight: 400; }
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype"); font-weight: 700; }
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 14px; background: #cbd5e1; font-family: "PNU", "Tahoma", Arial, sans-serif; }
    .print-toolbar {
      max-width: 297mm; margin: 0 auto 14px; background: #082046; color: #fff;
      padding: 12px 20px; border-radius: 12px; border-bottom: 3px solid #f59e0b;
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px;
    }
    .toolbar-sub { font-size: 11px; color: #fde68a; margin-top: 3px; }
    .toolbar-btns { display: flex; gap: 8px; }
    .print-btn {
      background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #082046; border: none;
      border-radius: 8px; padding: 9px 20px; font-family: inherit; font-size: 13px; font-weight: 800; cursor: pointer;
    }
    .close-btn {
      background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.35);
      border-radius: 8px; padding: 9px 16px; font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer;
    }
    .a4-page {
      width: 297mm; height: 210mm; margin: 0 auto; background: #ffffff;
      padding: 12mm 28mm; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 8mm; position: relative;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
    }
    .badges-sheet {
      display: grid;
      grid-template-columns: repeat(2, 114mm);
      column-gap: 10mm;
      justify-content: center;
      align-items: center;
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
      padding: 2.5mm 3mm 2.2mm;
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .badge-light {
      background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 58%, #fffbeb 100%);
      border: 0.7mm solid #f59e0b; color: #0f172a;
    }
    .badge-dark {
      background: linear-gradient(155deg, #07132c 0%, #0d2552 60%, #10326b 100%);
      border: 0.7mm solid #38bdf8; color: #ffffff;
    }
    .top-row {
      display: flex; align-items: center; justify-content: space-between; gap: 3mm;
      padding-bottom: 1.3mm; border-bottom: 0.3mm solid rgba(148, 163, 184, 0.35);
    }
    .logo-abdaa { height: 9.2mm; width: auto; background: #fff; border-radius: 1.6mm; padding: 0.5mm; object-fit: contain; }
    .logo-1001 { height: 10.2mm; width: auto; object-fit: contain; }
    .logo-masdar { height: 6.5mm; width: auto; object-fit: contain; }
    .logo-pill { background: #ffffff; border-radius: 1.8mm; padding: 0.5mm 1.6mm; }
    .ribbon {
      background: linear-gradient(90deg, #082046, #0369a1, #082046);
      border: 0.45mm solid #f59e0b; border-radius: 2mm; padding: 1.3mm 2.5mm;
      text-align: center; color: #ffffff;
    }
    .rib-title { font-size: 10.2pt; font-weight: 700; line-height: 1.15; }
    .rib-sub { font-size: 6.6pt; color: #fde68a; font-weight: 700; margin-top: 0.3mm; }
    .body-split {
      display: flex; align-items: stretch; justify-content: space-between; gap: 2.8mm;
      flex: 1; margin: 1.5mm 0;
    }
    .info-col {
      flex: 1; display: flex; flex-direction: column; justify-content: space-between;
      text-align: right; min-width: 0;
    }
    .name-row { display: flex; align-items: center; gap: 2mm; }
    .kid-photo {
      width: 13.5mm; height: 13.5mm; border-radius: 50%; object-fit: cover;
      border: 0.5mm solid #f59e0b; flex-shrink: 0; background: #fff;
    }
    .name-stack { flex: 1; min-width: 0; }
    .student-name { font-size: 13.5pt; font-weight: 700; color: #082046; line-height: 1.2; word-break: break-word; }
    .badge-dark .student-name { color: #38bdf8; }
    .grade-pill {
      display: inline-block; margin-top: 1mm; padding: 0.7mm 2mm; border-radius: 1.6mm;
      background: #fef3c7; border: 0.35mm solid #f59e0b; color: #92400e; font-size: 7.4pt; font-weight: 700;
    }
    .badge-dark .grade-pill { background: rgba(245, 158, 11, 0.2); border-color: #fbbf24; color: #fde68a; }
    .meta-box {
      border-radius: 2mm; padding: 1.2mm 2.2mm; font-size: 7.6pt;
      background: #f8fafc; border: 0.3mm solid #cbd5e1;
    }
    .badge-dark .meta-box { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }
    .meta-row {
      display: flex; justify-content: space-between; align-items: center; gap: 1.8mm;
      padding: 0.5mm 0; border-bottom: 0.25mm dashed rgba(148, 163, 184, 0.35);
    }
    .meta-row:last-child { border-bottom: none; }
    .mono-code { font-family: "Consolas", monospace; color: #0284c7; font-size: 8.2pt; }
    .badge-dark .mono-code { color: #fde047; }
    .mono-id { font-family: "Consolas", monospace; font-size: 7.8pt; }
    .track-val { font-size: 7.2pt; max-width: 48mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qr-col {
      width: 26.5mm; flex-shrink: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; border-right: 0.3mm dashed rgba(148, 163, 184, 0.4); padding-right: 2mm;
    }
    .qr-wrap { background: #ffffff; padding: 1.1mm; border-radius: 2mm; border: 0.45mm solid #0284c7; }
    .qr-wrap img { width: 20.5mm; height: 20.5mm; display: block; }
    .qr-caption { font-size: 6.6pt; font-weight: 700; color: #0284c7; margin-top: 1mm; }
    .badge-dark .qr-caption { color: #fde68a; }
    .qr-code-txt { font-family: "Consolas", monospace; font-size: 6.8pt; font-weight: 700; color: #475569; margin-top: 0.3mm; }
    .badge-dark .qr-code-txt { color: #cbd5e1; }
    .motto {
      background: #082046; color: #fbbf24; font-size: 7.2pt; font-weight: 700;
      text-align: center; padding: 1.2mm 2mm; border-radius: 1.8mm;
    }
    .badge-dark .motto { background: #0284c7; color: #ffffff; }
    .page-foot-note {
      font-size: 8pt; color: #64748b; font-weight: 700; text-align: center;
    }
    @media print {
      body { background: #ffffff; padding: 0; margin: 0; }
      .print-toolbar { display: none !important; }
      .a4-page { margin: 0; box-shadow: none; width: 297mm; height: 210mm; }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <div>
      <div><strong>طباعة باج الخريج — مقاس حافظة A3 أفقي (114×91 مم لحافظة 115×92 مم):</strong> ${safeName}</div>
      <div class="toolbar-sub">النسختان النهارية والليلية معاً • الورق A4 أفقي (Landscape) • المقياس 100% • قص على الخط المتقطع</div>
    </div>
    <div class="toolbar-btns">
      <button class="print-btn" onclick="window.print()">🖨️ طباعة الباج الآن (A4 أفقي)</button>
      <button class="close-btn" onclick="window.close()">إغلاق</button>
    </div>
  </div>

  <div class="a4-page">
    <div class="badges-sheet">
      ${buildSingleCardHtml(false)}
      ${buildSingleCardHtml(true)}
    </div>
    <div class="page-foot-note">مقاس حافظة A3 أفقي (114×91 مم — يدخل بسلاسة داخل حافظة 115×92 مم) • قص على الخط المتقطع</div>
  </div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/**
 * 2. طباعة شهادة التخرج والابتكار الرسمية (A4 عرضي) على غرار نظام الشهادات في الفارابي
 */
export function openGraduateCertificatePrintWindow(grad, qrDataUrl) {
  const win = window.open('', '_blank', 'width=1120,height=820');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(grad.name);
  const safeId = escapeHtml(grad.id);
  const safeCode = escapeHtml(grad.initiativeCode);
  const safeTrack = escapeHtml(grad.track);
  const safeProject = escapeHtml(grad.project);
  const safeAge = escapeHtml(grad.ageGroup || '6 - 14 سنة');
  const safeGrade = escapeHtml(grad.grade || 'امتياز مع مرتبة الشرف الأولى');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>شهادة تخرج رسمية — ${safeName}</title>
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
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype");
      font-weight: 800;
    }
    @page {
      size: A4 landscape;
      margin: 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 20px;
      background: #e2e8f0;
      font-family: "PNU", "Tahoma", sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .toolbar {
      display: flex;
      gap: 10px;
      background: #fff;
      padding: 10px 20px;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .btn-print {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-weight: 800;
      cursor: pointer;
    }
    .cert-sheet {
      width: 277mm;
      min-height: 190mm;
      background: #ffffff;
      border: 4px solid #0f172a;
      border-radius: 18px;
      padding: 14px;
      position: relative;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
    }
    .cert-inner {
      border: 2.5px solid #f59e0b;
      border-radius: 12px;
      padding: 22px 32px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.03), transparent 70%);
    }
    .cert-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 14px;
    }
    .gov-col {
      text-align: right;
      font-size: 13px;
      line-height: 1.6;
      color: #0f172a;
    }
    .gov-col strong {
      font-size: 15px;
      display: block;
      color: #0369a1;
    }
    .center-emblem {
      text-align: center;
    }
    .center-emblem .num {
      font-size: 36px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .center-emblem .sub {
      font-size: 12px;
      font-weight: 800;
      color: #d97706;
      letter-spacing: 1px;
    }
    .logos-col {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logos-col img {
      height: 52px;
      width: auto;
      object-fit: contain;
    }
    .cert-body {
      text-align: center;
      margin: 14px 0;
    }
    .kicker {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #f59e0b;
      padding: 4px 16px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .cert-title {
      font-size: 30px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 10px;
    }
    .cert-intro {
      font-size: 15px;
      color: #334155;
      margin: 0 auto 10px;
      max-width: 780px;
      line-height: 1.7;
    }
    .student-pill {
      display: inline-block;
      background: linear-gradient(90deg, #0f172a, #0369a1, #0f172a);
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      padding: 8px 38px;
      border-radius: 16px;
      border: 2px solid #f59e0b;
      margin: 6px 0 12px;
    }
    .details-text {
      font-size: 15.5px;
      color: #1e293b;
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.85;
    }
    .highlight {
      color: #0284c7;
      font-weight: 800;
    }
    .grade-highlight {
      color: #d97706;
      font-weight: 800;
    }
    .cert-footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1.5px dashed #cbd5e1;
      margin-top: 12px;
    }
    .sig-col {
      text-align: center;
      font-size: 12.5px;
      color: #0f172a;
      min-width: 180px;
    }
    .sig-col strong {
      display: block;
      font-size: 13.5px;
      margin-bottom: 4px;
      color: #0369a1;
    }
    .qr-verify {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      padding: 6px 12px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      text-align: right;
      font-size: 10.5px;
    }
    .qr-verify img {
      width: 64px;
      height: 64px;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .toolbar {
        display: none !important;
      }
      .cert-sheet {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🎓 طباعة شهادة التخرج الرسمية (A4)</button>
  </div>

  <div class="cert-sheet">
    <div class="cert-inner">
      <div class="cert-header">
        <div class="gov-col">
          <strong>جمهورية العراق – النجف الأشرف</strong>
          <span>نادي أبدع للمهارات الذكية</span>
          <div>مبادرة «1001» طفل رقمي (الأعمار 6 – 14 سنة)</div>
        </div>

        <div class="center-emblem">
          <img src="${origin}/brand/logo-1001-kids.png" alt="شعار مبادرة 1001 طفل رقمي" style="height:64px;width:auto;display:block;margin:0 auto 4px" />
          <div class="sub">DIGITAL KIDS GRADUATION • 2026</div>
        </div>

        <div class="logos-col">
          <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="height:34px" />
        </div>
      </div>

      <div class="cert-body">
        <span class="kicker">وثيقة تخرج رسمية معتمدة • الدفعة الأولى (2026)</span>
        <h1 class="cert-title">شهادة تخرج وابتكار رقمي</h1>
        <p class="cert-intro">
          تشهد إدارة <strong>نادي أبدع للمهارات الذكية</strong> والجهات الراعية والمعتمدة بأن المبتكر(ة) الصغير(ة) ضمن الفئة العمرية (<strong>${safeAge}</strong>):
        </p>

        <div class="student-pill">${safeName}</div>

        <p class="details-text">
          قد أتمّ بنجاح متطلبات التدريب العملي والتطبيقي في مسار <span class="highlight">«${safeTrack}»</span>، وأنجز مشروع التخرج الابتكاري الموسوم <span class="highlight">«${safeProject}»</span> بتقدير عام <span class="grade-highlight">(${safeGrade})</span>، وتم منحه لقب <strong>Digital Kid</strong> في احتفالية قصر الثقافة بالنجف الأشرف.
        </p>
      </div>

      <div class="cert-footer">
        <div class="sig-col">
          <strong>نادي أبدع للمهارات الذكية (المؤسس المنظم)</strong>
          <span>فراس نزار كريم</span>
        </div>

        <div class="qr-verify">
          ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
          <div>
            <div style="font-weight:800;color:#0f172a">موثق رقمياً بـ QR</div>
            <div style="font-family:monospace;color:#0284c7;font-weight:700">${safeId}</div>
            <div style="color:#64748b">كود المبادرة: ${safeCode}</div>
          </div>
        </div>

        <div class="sig-col">
          <strong>شركة المصدر لتكنولوجيا المعلومات (الشريك المنظم)</strong>
          <span>كرار حساني جاسم</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/**
 * 3. طباعة تذكرة حضور الحفل وحجز المقعد الرسمي في قصر الثقافة
 */
