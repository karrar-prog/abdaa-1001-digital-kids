function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 1. طباعة بطاقة الخريج الرقمية الرسمية (نسختين: النهارية البيضاء + الليلية الكحلية مثل نظام الفارابي)
 */
export function openGraduateBadgePrintWindow(grad, qrDataUrl) {
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
  const safeAge = escapeHtml(grad.ageGroup || '7 - 14 سنة');
  const safeGrade = escapeHtml(grad.grade || 'امتياز مع مرتبة الشرف');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';

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
    .mascot-ring img {
      width: 78px;
      height: 78px;
      object-fit: contain;
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
        <img src="${origin}/logo.svg" alt="نادي أبدع" />
        <div class="brand-title-center">
          <div class="brand-num">1<span style="color:#f59e0b">0</span><span style="color:#0284c7">0</span>1</div>
          <div class="brand-sub">طفل رقمي • DIGITAL KIDS</div>
        </div>
        <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="height:26px" />
      </div>

      <div class="ribbon">
        <div class="ribbon-title">★ بطاقة خريج معتمد ★</div>
        <div class="ribbon-sub">احتفالية تخرج الدفعة الأولى • الفئة العمرية (${safeAge})</div>
      </div>

      <div class="mascot-ring">
        <img src="${origin}/graduate/robot_mascot.jpg" alt="روبوت أبدع" onerror="this.style.display='none'" />
      </div>

      <div class="student-box">
        <div class="student-name">${safeName}</div>
        <div class="meta-row">
          <span class="meta-label">كود العضوية:</span>
          <span class="meta-val" style="font-family:monospace">${safeId}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">كود المبادرة:</span>
          <span class="meta-val" style="font-family:monospace;color:#0284c7">${safeCode}</span>
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
          <div><strong>الجهة المنظمة:</strong> نادي أبدع للمهارات الذكية</div>
          <div><strong>الشريك التقني:</strong> شركة المصدر لتكنولوجيا المعلومات</div>
          <div><strong>الاعتماد:</strong> نقابة المبرمجين العراقيين</div>
        </div>
        ${safeQr ? `<div class="qr-box"><img src="${safeQr}" alt="QR" /></div>` : ''}
      </div>

      <div class="bottom-motto">◆ نصنع جيلاً يبرمج المستقبل ... معاً ◆</div>
    </div>

    <!-- النسخة الليلية الرسمية -->
    <div class="abdaa-id-card abdaa-id-card--dark">
      <div class="slot-hole slot-hole--dark"></div>
      <div class="top-brand">
        <img src="${origin}/logo.svg" alt="نادي أبدع" />
        <div class="brand-title-center">
          <div class="brand-num">1<span style="color:#fbbf24">0</span><span style="color:#38bdf8">0</span>1</div>
          <div class="brand-sub">طفل رقمي • DIGITAL KIDS</div>
        </div>
        <img src="${origin}/brand/masdar-logo-full-white.png" alt="شركة المصدر" style="height:26px" />
      </div>

      <div class="ribbon">
        <div class="ribbon-title">★ بطاقة خريج معتمد ★</div>
        <div class="ribbon-sub">احتفالية تخرج الدفعة الأولى • الفئة العمرية (${safeAge})</div>
      </div>

      <div class="mascot-ring">
        <img src="${origin}/graduate/robot_mascot.jpg" alt="روبوت أبدع" onerror="this.style.display='none'" />
      </div>

      <div class="student-box">
        <div class="student-name">${safeName}</div>
        <div class="meta-row">
          <span class="meta-label">كود العضوية:</span>
          <span class="meta-val" style="font-family:monospace">${safeId}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">كود المبادرة:</span>
          <span class="meta-val" style="font-family:monospace;color:#38bdf8">${safeCode}</span>
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
          <div><strong>الجهة المنظمة:</strong> نادي أبدع للمهارات الذكية</div>
          <div><strong>الشريك التقني:</strong> شركة المصدر لتكنولوجيا المعلومات</div>
          <div><strong>الاعتماد:</strong> نقابة المبرمجين العراقيين</div>
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
  const safeAge = escapeHtml(grad.ageGroup || '7 - 14 سنة');
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
          <div>مبادرة «1001» طفل رقمي (الأعمار 7 – 14 سنة)</div>
        </div>

        <div class="center-emblem">
          <div class="num">1<span style="color:#f59e0b">0</span><span style="color:#0284c7">0</span>1</div>
          <div class="sub">DIGITAL KIDS GRADUATION • 2026</div>
        </div>

        <div class="logos-col">
          <img src="${origin}/logo.svg" alt="نادي أبدع" />
          <img src="${origin}/sponsors/programmers_syndicate.png" alt="نقابة المبرمجين" onerror="this.style.display='none'" />
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
          <strong>إدارة نادي أبدع للمهارات الذكية</strong>
          <span>فراس نزار كريم</span>
          <div style="font-size:11px;color:#64748b;margin-top:2px">رئيس مبرمجين أقدم</div>
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
          <strong>الشريك التقني والراعي الرسمي</strong>
          <span>شركة المصدر لتكنولوجيا المعلومات</span>
          <div style="font-size:11px;color:#64748b;margin-top:2px">بالتعاون مع نقابة المبرمجين العراقيين</div>
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
export function openTicketPrintWindow(ticket, qrDataUrl) {
  const win = window.open('', '_blank', 'width=860,height=720');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(ticket.attendee_name);
  const safeCode = escapeHtml(ticket.booking_code);
  const safeType = escapeHtml(ticket.guest_type);
  const safeSeat = escapeHtml(ticket.seat_label || 'مقعد عام');
  const safeBlock = escapeHtml(ticket.block_name || 'القاعة الرئيسية');
  const safeCompanions = escapeHtml(ticket.companions_count || '1');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تذكرة حضور احتفالية 1001 طفل رقمي — ${safeName}</title>
  <style>
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype");
      font-weight: 700;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 24px;
      background: #f1f5f9;
      font-family: "PNU", Tahoma, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }
    .toolbar button {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-weight: 800;
      cursor: pointer;
    }
    .ticket-card {
      width: 420px;
      background: #ffffff;
      border: 2.5px solid #0f172a;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
    }
    .ticket-head {
      background: linear-gradient(135deg, #0f172a, #0369a1);
      color: #fff;
      padding: 20px;
      text-align: center;
      border-bottom: 3px solid #f59e0b;
    }
    .ticket-body {
      padding: 20px;
      text-align: right;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dashed #cbd5e1;
      font-size: 13px;
    }
    .qr-wrap {
      text-align: center;
      margin-top: 16px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .qr-wrap img {
      width: 150px;
      height: 150px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .ticket-card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">🖨️ طباعة تذكرة الدخول والمقعد</button>
  </div>
  <div class="ticket-card">
    <div class="ticket-head">
      <div style="font-size:12px;color:#fbbf24;font-weight:800">نادي أبدع للمهارات الذكية • النجف الأشرف</div>
      <h2 style="margin:6px 0;font-size:19px">تذكرة حضور احتفالية «1001» طفل رقمي</h2>
      <div style="font-size:12px;opacity:0.9">قصر الثقافة – الجمعة، تشرين الثاني 2026 (03:00 م)</div>
    </div>
    <div class="ticket-body">
      <div class="row"><span>اسم الحاضر:</span><strong>${safeName}</strong></div>
      <div class="row"><span>رقم التذكرة:</span><strong style="font-family:monospace;color:#0284c7">${safeCode}</strong></div>
      <div class="row"><span>البلوك والقاعة:</span><strong>${safeBlock}</strong></div>
      <div class="row"><span>رقم المقعد المخصص:</span><strong style="color:#d97706">${safeSeat}</strong></div>
      <div class="row"><span>صفة الحضور:</span><strong>${safeType} (مرافقين: ${safeCompanions})</strong></div>
      <div class="qr-wrap">
        ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
        <div style="font-size:11px;color:#475569;margin-top:6px">يرجى إبراز رمز الـ QR عند بوابة قصر الثقافة وللمشاركة في قرعة الجوائز</div>
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
 * 4. طباعة بطاقة مرشح الدفعة الثانية لمبادرة 1001 طفل رقمي (الأعمار 7 – 14 سنة)
 */
export function openCandidateCardPrintWindow(candidate, qrDataUrl) {
  const win = window.open('', '_blank', 'width=860,height=760');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(candidate.child_name);
  const safeCode = escapeHtml(candidate.candidate_code);
  const safeAge = escapeHtml(candidate.child_age);
  const safeStage = escapeHtml(candidate.age_stage);
  const safeTrack = escapeHtml(candidate.preferred_track);
  const safeSchool = escapeHtml(candidate.school_name || 'مدارس النجف الأشرف');
  const safeParent = escapeHtml(candidate.parent_name);
  const safePhone = escapeHtml(candidate.parent_phone);
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>بطاقة مرشح الدفعة الثانية — ${safeName}</title>
  <style>
    @font-face {
      font-family: "PNU";
      src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype");
      font-weight: 700;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 24px;
      background: #f1f5f9;
      font-family: "PNU", Tahoma, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }
    .toolbar button {
      background: linear-gradient(135deg, #0284c7, #1d4ed8);
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-weight: 800;
      cursor: pointer;
    }
    .cand-card {
      width: 440px;
      background: #ffffff;
      border: 3px solid #f59e0b;
      border-radius: 26px;
      overflow: hidden;
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
    }
    .cand-head {
      background: linear-gradient(135deg, #09152b, #0369a1);
      color: #fff;
      padding: 18px 20px;
      text-align: center;
      border-bottom: 3px solid #f59e0b;
    }
    .cand-body {
      padding: 20px;
      text-align: right;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 7px 0;
      border-bottom: 1px dashed #cbd5e1;
      font-size: 13px;
    }
    .qr-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-top: 16px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .qr-wrap img {
      width: 96px;
      height: 96px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: #fff;
      padding: 4px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .cand-card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">🖨️ طباعة بطاقة ترشيح الطفل للدفعة الثانية</button>
  </div>
  <div class="cand-card">
    <div class="cand-head">
      <div style="font-size:11px;color:#fde68a;font-weight:800">نادي أبدع للمهارات الذكية • مبادرة 1001 طفل رقمي</div>
      <h2 style="margin:6px 0;font-size:19px">بطاقة مرشح الدفعة الثانية (أعمار 7 – 14 سنة)</h2>
      <div style="font-size:11.5px;color:#38bdf8;font-weight:700">أولوية القبول والمقابلة العلمية • مجانية بالكامل</div>
    </div>
    <div class="cand-body">
      <div class="row"><span>اسم الطفل المرشح:</span><strong style="color:#0284c7;font-size:15px">${safeName}</strong></div>
      <div class="row"><span>رقم الترشيح الرسمي:</span><strong style="font-family:monospace;color:#d97706">${safeCode}</strong></div>
      <div class="row"><span>العمر والمرحلة الأكاديمية:</span><strong>${safeAge} سنوات (${safeStage})</strong></div>
      <div class="row"><span>المسار التقني المختار:</span><strong>${safeTrack}</strong></div>
      <div class="row"><span>المدرسة:</span><strong>${safeSchool}</strong></div>
      <div class="row"><span>ولي الأمر / الهاتف:</span><strong>${safeParent} (${safePhone})</strong></div>
      <div class="qr-wrap">
        <div style="font-size:11px;color:#334155;line-height:1.6">
          <strong style="color:#0f172a;display:block;margin-bottom:3px">تعليمات القبول الميداني:</strong>
          أبرز هذه البطاقة في جناح التسجيل خلال احتفالية التخرج في قصر الثقافة لتثبيت مقعد الطفل في الورش التدريبية للدفعة الثانية.
        </div>
        ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
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
 * 5. طباعة شهادة الشكر والتقدير الرسمية للأساتذة والمدربين المشرفين (A4 عرضي)
 */
export function openMentorCertificatePrintWindow(mentor, qrDataUrl) {
  const win = window.open('', '_blank', 'width=1120,height=820');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(mentor.name);
  const safeId = escapeHtml(mentor.id);
  const safeRole = escapeHtml(mentor.role || 'مدرب ومشرف أكاديمي');
  const safeSpecialty = escapeHtml(mentor.specialty || 'البرمجة والذكاء الاصطناعي والروبوتات');
  const safeCohort = escapeHtml(mentor.cohortTitle || 'الدفعة الأولى (170 خريجاً)');
  const safeHours = escapeHtml(mentor.hours || '120+ ساعة تدريبية وإشرافية');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>شهادة شكر وتقدير — ${safeName}</title>
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
      background: linear-gradient(135deg, #d97706, #b45309);
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
      border: 2.5px solid #d97706;
      border-radius: 12px;
      padding: 22px 32px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05), transparent 70%);
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
      color: #b45309;
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
      color: #0284c7;
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
      padding: 4px 18px;
      border-radius: 99px;
      font-size: 12.5px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .cert-title {
      font-size: 31px;
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
    .mentor-pill {
      display: inline-block;
      background: linear-gradient(90deg, #0f172a, #b45309, #0f172a);
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      padding: 8px 38px;
      border-radius: 16px;
      border: 2px solid #fbbf24;
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
    .gold-highlight {
      color: #b45309;
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
      color: #b45309;
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
    <button class="btn-print" onclick="window.print()">🏅 طباعة شهادة الشكر والتقدير الرسمية (A4)</button>
  </div>

  <div class="cert-sheet">
    <div class="cert-inner">
      <div class="cert-header">
        <div class="gov-col">
          <strong>جمهورية العراق – النجف الأشرف</strong>
          <span>نادي أبدع للمهارات الذكية</span>
          <div>اللجنة العليا لمبادرة «1001» طفل رقمي</div>
        </div>

        <div class="center-emblem">
          <div class="num">1<span style="color:#f59e0b">0</span><span style="color:#0284c7">0</span>1</div>
          <div class="sub">HONOR ROLL OF MENTORS • 2026</div>
        </div>

        <div class="logos-col">
          <img src="${origin}/logo.svg" alt="نادي أبدع" />
          <img src="${origin}/sponsors/programmers_syndicate.png" alt="نقابة المبرمجين" onerror="this.style.display='none'" />
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="height:34px" />
        </div>
      </div>

      <div class="cert-body">
        <span class="kicker">وسام التميز التدريبي والإشراف العلمي • الدفعة الأولى (2026)</span>
        <h1 class="cert-title">شهادة شكر وتقدير واعتزاز</h1>
        <p class="cert-intro">
          تتقدم إدارة <strong>نادي أبدع للمهارات الذكية</strong> والجهات الراعية والمعتمدة بأسمى آيات الشكر والتقدير والامتنان إلى الأستاذ(ة) المدرب(ة):
        </p>

        <div class="mentor-pill">${safeName}</div>

        <p class="details-text">
          تقديراً وعرفاناً لجهوده العلمية والتربوية المخلصة بصفته <span class="gold-highlight">(${safeRole})</span> في تخصص <span class="highlight">«${safeSpecialty}»</span>، وإشرافه الميداني المتميز على <span class="highlight">«${safeCohort}»</span> بواقع <span class="gold-highlight">(${safeHours})</span> لتأهيل أطفال النجف الأشرف (الأعمار 7 – 14 سنة) وإنجاز 40 مشروعاً تقنياً في احتفالية قصر الثقافة.
        </p>
      </div>

      <div class="cert-footer">
        <div class="sig-col">
          <strong>إدارة نادي أبدع للمهارات الذكية</strong>
          <span>فراس نزار كريم</span>
          <div style="font-size:11px;color:#64748b;margin-top:2px">رئيس مبرمجين أقدم</div>
        </div>

        <div class="qr-verify">
          ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
          <div>
            <div style="font-weight:800;color:#0f172a">موثق رقمياً بـ QR</div>
            <div style="font-family:monospace;color:#b45309;font-weight:700">${safeId}</div>
            <div style="color:#64748b">سجل المدربين المعتمدين 2026</div>
          </div>
        </div>

        <div class="sig-col">
          <strong>الشريك التقني والراعي الرسمي</strong>
          <span>شركة المصدر لتكنولوجيا المعلومات</span>
          <div style="font-size:11px;color:#64748b;margin-top:2px">بالتعاون مع نقابة المبرمجين العراقيين</div>
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
 * 6. طباعة شهادة مبرمج «روبوت أبدع» الفورية للأطفال الزوار (A4 عرضي)
 */
export function openPlaygroundChallengeCertificatePrintWindow(challenger, qrDataUrl) {
  const win = window.open('', '_blank', 'width=1120,height=820');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(challenger.childName || 'بطل روبوت أبدع');
  const safeCode = escapeHtml(challenger.certCode || 'ABD-CODER-2026');
  const safeLevel = escapeHtml(challenger.levelTitle || 'تحدي خوارزميات روبوت أبدع');
  const safeAge = escapeHtml(challenger.ageTag || '7 – 14 سنة');
  const safeStars = escapeHtml(challenger.starsText || '⭐⭐⭐ (3/3 نجوم كاملة)');
  const safeSteps = escapeHtml(challenger.stepsCount || '3');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>وسام وشهادة مبرمج روبوت أبدع — ${safeName}</title>
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
      background: linear-gradient(135deg, #10b981, #0284c7);
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-weight: 800;
      cursor: pointer;
    }
    .cert-sheet {
      width: 277mm;
      min-height: 190mm;
      background: #ffffff;
      border: 4px solid #0284c7;
      border-radius: 20px;
      padding: 14px;
      position: relative;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
    }
    .cert-inner {
      border: 3px dashed #f59e0b;
      border-radius: 14px;
      padding: 22px 32px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.05), transparent 70%);
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
      color: #0284c7;
    }
    .center-emblem {
      text-align: center;
    }
    .center-emblem .num {
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .center-emblem .sub {
      font-size: 11.5px;
      font-weight: 800;
      color: #10b981;
      letter-spacing: 1px;
    }
    .logos-col {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logos-col img {
      height: 50px;
      width: auto;
      object-fit: contain;
    }
    .cert-body {
      text-align: center;
      margin: 14px 0;
    }
    .kicker {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #34d399;
      padding: 4px 18px;
      border-radius: 99px;
      font-size: 12.5px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .cert-title {
      font-size: 30px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 10px;
    }
    .kid-pill {
      display: inline-block;
      background: linear-gradient(90deg, #0284c7, #2563eb, #0284c7);
      color: #ffffff;
      font-size: 25px;
      font-weight: 800;
      padding: 8px 40px;
      border-radius: 18px;
      border: 2.5px solid #fbbf24;
      margin: 8px 0 12px;
    }
    .details-text {
      font-size: 15.5px;
      color: #1e293b;
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.85;
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
      color: #0284c7;
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
      body { background: #ffffff; padding: 0; }
      .toolbar { display: none !important; }
      .cert-sheet { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🤖 طباعة وسام وشهادة مبرمج «روبوت أبدع» (A4)</button>
  </div>

  <div class="cert-sheet">
    <div class="cert-inner">
      <div class="cert-header">
        <div class="gov-col">
          <strong>نادي أبدع للمهارات الذكية – النجف الأشرف</strong>
          <span>استوديو البرمجة التفاعلي للأطفال (ABDAA BLOCKS IDE)</span>
          <div>مبادرة «1001» طفل رقمي (الأعمار 7 – 14 سنة)</div>
        </div>

        <div class="center-emblem">
          <div class="num">🤖 1<span style="color:#f59e0b">0</span><span style="color:#0284c7">0</span>1</div>
          <div class="sub">ROBOT CODING CHALLENGE • 2026</div>
        </div>

        <div class="logos-col">
          <img src="${origin}/logo.svg" alt="نادي أبدع" />
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="height:34px" />
        </div>
      </div>

      <div class="cert-body">
        <span class="kicker">وسام الذكاء الخوارزمي والبرمجة التفاعلية • ${safeStars}</span>
        <h1 class="cert-title">شهادة إنجاز تحدي «روبوت أبدع» البرمجي</h1>
        <p style="font-size:15px;color:#334155;margin:0 auto 6px">
          يمنح <strong>نادي أبدع للمهارات الذكية</strong> هذا الوسام الشرفي للمبرمج(ة) الذكي(ة):
        </p>

        <div class="kid-pill">${safeName}</div>

        <p class="details-text">
          لاجتيازه بنجاح مهمة <strong style="color:#0284c7">«${safeLevel}»</strong> ضمن الفئة العمرية (<strong>${safeAge}</strong>) بتركيب خوارزمية صحيحة من (<strong>${safeSteps} خطوات</strong>) وقيادة «روبوت أبدع» لالتقاط جواهر الطاقة ونجمة الابتكار، وهو مؤهل للانضمام إلى أبطال الدفعة الثانية لمبادرة 1001 طفل رقمي.
        </p>
      </div>

      <div class="cert-footer">
        <div class="sig-col">
          <strong>إدارة نادي أبدع للمهارات الذكية</strong>
          <span>فراس نزار كريم</span>
          <div style="font-size:11px;color:#64748b;margin-top:2px">رئيس مبرمجين أقدم</div>
        </div>

        <div class="qr-verify">
          ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
          <div>
            <div style="font-weight:800;color:#0f172a">وسام مبرمج موثق بـ QR</div>
            <div style="font-family:monospace;color:#0284c7;font-weight:700">${safeCode}</div>
            <div style="color:#64748b">استوديو روبوت أبدع 2026</div>
          </div>
        </div>

        <div class="sig-col">
          <strong>الشريك التقني والراعي الرسمي</strong>
          <span>شركة المصدر لتكنولوجيا المعلومات</span>
          <div style="font-size:11px;color:#64748b;margin-top:2px">بالتعاون مع نقابة المبرمجين العراقيين</div>
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
