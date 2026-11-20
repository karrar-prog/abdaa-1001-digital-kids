import { escapeHtml, sanitizeImageSrc, sanitizeHexColor } from './printHelpers';

export function openGraduateBadgePrintWindow(grad, qrDataUrl, photoDataUrl = '') {
  const win = window.open('', '_blank', 'width=1020,height=820');
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
  const safeGrade = escapeHtml(grad.grade || 'امتياز مع مرتبة الشرف');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';
  const safeUserPhoto = sanitizeImageSrc(photoDataUrl || grad.photoDataUrl || '', '');
  const badgeAvatarHtml = safeUserPhoto
    ? `<img src="${safeUserPhoto}" alt="${safeName}" class="student-photo" />`
    : `<img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع للمهارات الذكية" class="brand-logo" onerror="this.style.display='none'" />`;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>بطاقة خريج مبادرة 1001 طفل رقمي — ${safeName}</title>
  <style>
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype");
      font-weight: 400;
    }
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Medium.ttf") format("truetype");
      font-weight: 500;
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
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 24px 16px;
      background: #f1f5f9;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .print-toolbar {
      display: flex;
      gap: 12px;
      align-items: center;
      background: #ffffff;
      padding: 10px 20px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
      border: 1px solid #e2e8f0;
    }
    .print-btn {
      background: linear-gradient(135deg, #0284c7, #1d4ed8);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 10px 24px;
      font-family: "PNU", sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .close-btn {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 18px;
      font-family: "PNU", sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .badges-sheet {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 28px;
      direction: rtl;
    }
    .abdaa-id-card {
      width: 360px;
      min-height: 550px;
      border-radius: 26px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      overflow: hidden;
      padding: 16px 20px 18px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
    }
    .abdaa-id-card--light {
      background: #ffffff;
      border: 3px solid #f59e0b;
      color: #0f172a;
    }
    .abdaa-id-card--dark {
      background: linear-gradient(165deg, #09152b 0%, #0f172a 100%);
      border: 3px solid #38bdf8;
      color: #ffffff;
    }
    .slot-hole {
      width: 66px;
      height: 14px;
      border-radius: 99px;
      margin-bottom: 6px;
    }
    .slot-hole--light {
      border: 1.5px dashed #94a3b8;
      background: #f8fafc;
    }
    .slot-hole--dark {
      border: 1.5px dashed #475569;
      background: #020617;
    }
    .top-brand {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    }
    .top-brand img {
      height: 40px;
      width: auto;
      object-fit: contain;
    }
    .brand-title-center {
      text-align: center;
    }
    .brand-num {
      font-size: 26px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 1px;
    }
    .brand-sub {
      font-size: 11px;
      font-weight: 800;
      color: #0284c7;
    }
    .abdaa-id-card--dark .brand-sub {
      color: #38bdf8;
    }
    .ribbon {
      width: 100%;
      background: linear-gradient(90deg, #0f172a, #0369a1, #0f172a);
      color: #ffffff;
      padding: 7px 12px;
      border-radius: 14px;
      border: 1.5px solid #f59e0b;
      margin: 8px 0;
    }
    .ribbon-title {
      font-size: 15px;
      font-weight: 800;
    }
    .ribbon-sub {
      font-size: 10px;
      color: #fde68a;
      font-weight: 700;
    }
    .mascot-ring {
      width: 102px;
      height: 102px;
      border-radius: 50%;
      border: 3px solid #f59e0b;
      background: radial-gradient(circle, #f0f9ff 0%, #fef3c7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px auto;
      overflow: hidden;
    }
    .mascot-ring img.brand-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    .mascot-ring img.student-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .student-box {
      width: 100%;
      border-radius: 16px;
      padding: 10px 12px;
      margin: 6px 0;
      text-align: right;
    }
    .abdaa-id-card--light .student-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .abdaa-id-card--dark .student-box {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
    }
    .student-name {
      font-size: 17px;
      font-weight: 800;
      color: #0284c7;
      margin-bottom: 4px;
    }
    .abdaa-id-card--dark .student-name {
      color: #38bdf8;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      padding: 3px 0;
      border-bottom: 1px dashed rgba(148, 163, 184, 0.25);
    }
    .meta-row:last-child {
      border-bottom: none;
    }
    .meta-label {
      opacity: 0.75;
      font-weight: 700;
    }
    .meta-val {
      font-weight: 800;
    }
    .qr-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 6px;
    }
    .qr-box {
      background: #ffffff;
      padding: 4px;
      border-radius: 10px;
      border: 1.5px solid #cbd5e1;
      flex-shrink: 0;
    }
    .qr-box img {
      width: 68px;
      height: 68px;
      display: block;
    }
    .sponsor-box {
      flex: 1;
      text-align: right;
      font-size: 10.5px;
      line-height: 1.45;
    }
    .bottom-motto {
      width: 100%;
      background: #0f172a;
      color: #fbbf24;
      font-size: 11px;
      font-weight: 800;
      padding: 6px;
      border-radius: 10px;
      margin-top: 6px;
    }
    .abdaa-id-card--dark .bottom-motto {
      background: #0284c7;
      color: #ffffff;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .print-toolbar {
        display: none !important;
      }
      .abdaa-id-card {
        box-shadow: none;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <button class="print-btn" onclick="window.print()">🖨️ طباعة الباج الرسمي الآن (النسختين النهارية والليلية)</button>
    <button class="close-btn" onclick="window.close()">إغلاق</button>
  </div>

  <div class="badges-sheet">
    <!-- النسخة النهارية الرسمية -->
    <div class="abdaa-id-card abdaa-id-card--light">
      <div class="slot-hole slot-hole--light"></div>
      <div class="top-brand">
        <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" style="height:36px" />
        <div class="brand-title-center">
          <img src="${origin}/brand/logo-1001-kids.png" alt="مبادرة 1001 طفل رقمي" style="height:44px;width:auto;display:block;margin:0 auto 2px" />
          <div class="brand-sub">طفل رقمي • DIGITAL KIDS</div>
        </div>
        <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="height:24px" />
      </div>

      <div class="ribbon">
        <div class="ribbon-title">★ بطاقة خريج معتمد ★</div>
        <div class="ribbon-sub">احتفالية تخرج الدفعة الأولى • الفئة العمرية (${safeAge})</div>
      </div>

      <div class="mascot-ring">
        ${badgeAvatarHtml}
      </div>

      <div class="student-box">
        <div class="student-name">${safeName}</div>
        <div class="meta-row">
          <span class="meta-label">كود العضوية:</span>
          <span class="meta-val" dir="ltr" style="font-family:monospace;display:inline-block">${safeId}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">كود المبادرة:</span>
          <span class="meta-val" dir="ltr" style="font-family:monospace;color:#0284c7;display:inline-block">${safeCode}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">المسار التقني:</span>
          <span class="meta-val">${safeTrack}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">المشروع المنجز:</span>
          <span class="meta-val">${safeProject}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">التقدير:</span>
          <span class="meta-val" style="color:#d97706">${safeGrade}</span>
        </div>
      </div>

      <div class="qr-footer">
        <div class="sponsor-box">
          <div><strong>المؤسس المنظم:</strong> نادي أبدع للمهارات الذكية</div>
          <div><strong>الشريك المنظم:</strong> شركة المصدر لتكنولوجيا المعلومات</div>
        </div>
        ${safeQr ? `<div class="qr-box"><img src="${safeQr}" alt="QR" /></div>` : ''}
      </div>

      <div class="bottom-motto">◆ نصنع جيلاً يبرمج المستقبل ... معاً ◆</div>
    </div>

    <!-- النسخة الليلية الرسمية -->
    <div class="abdaa-id-card abdaa-id-card--dark">
      <div class="slot-hole slot-hole--dark"></div>
      <div class="top-brand">
        <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" style="height:36px;background:#fff;border-radius:8px;padding:2px" />
        <div class="brand-title-center">
          <img src="${origin}/brand/logo-1001-kids.png" alt="مبادرة 1001 طفل رقمي" style="height:44px;width:auto;display:block;margin:0 auto 2px" />
          <div class="brand-sub">طفل رقمي • DIGITAL KIDS</div>
        </div>
        <img src="${origin}/brand/masdar-logo-full-white.png" alt="شركة المصدر" style="height:24px" />
      </div>

      <div class="ribbon">
        <div class="ribbon-title">★ بطاقة خريج معتمد ★</div>
        <div class="ribbon-sub">احتفالية تخرج الدفعة الأولى • الفئة العمرية (${safeAge})</div>
      </div>

      <div class="mascot-ring">
        ${badgeAvatarHtml}
      </div>

      <div class="student-box">
        <div class="student-name">${safeName}</div>
        <div class="meta-row">
          <span class="meta-label">كود العضوية:</span>
          <span class="meta-val" dir="ltr" style="font-family:monospace;display:inline-block">${safeId}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">كود المبادرة:</span>
          <span class="meta-val" dir="ltr" style="font-family:monospace;color:#38bdf8;display:inline-block">${safeCode}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">المسار التقني:</span>
          <span class="meta-val">${safeTrack}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">المشروع المنجز:</span>
          <span class="meta-val">${safeProject}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">التقدير:</span>
          <span class="meta-val" style="color:#fbbf24">${safeGrade}</span>
        </div>
      </div>

      <div class="qr-footer">
        <div class="sponsor-box">
          <div><strong>المؤسس المنظم:</strong> نادي أبدع للمهارات الذكية</div>
          <div><strong>الشريك المنظم:</strong> شركة المصدر لتكنولوجيا المعلومات</div>
        </div>
        ${safeQr ? `<div class="qr-box"><img src="${safeQr}" alt="QR" /></div>` : ''}
      </div>

      <div class="bottom-motto">◆ نصنع جيلاً يبرمج المستقبل ... معاً ◆</div>
    </div>
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
