import { escapeHtml, sanitizeImageSrc, sanitizeHexColor } from './printHelpers';

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
  const safeOrg = escapeHtml(mentor.organization || mentor.cohortTitle || 'نادي أبدع للمهارات الذكية');
  const safeSpecialty = escapeHtml(mentor.specialty || 'البرمجة والذكاء الاصطناعي والروبوتات');
  const safeCohort = escapeHtml(mentor.cohortTitle || 'الدفعة الأولى (168 خريجاً)');
  const safeHours = escapeHtml(mentor.hours || 'الدفعة الأولى 2026');
  const safeQr = qrDataUrl ? escapeHtml(qrDataUrl) : '';
  const recipientTitle = String(mentor.role || '').includes('الشريك')
    ? 'الشريك الاستراتيجي الداعم:'
    : String(mentor.role || '').includes('مؤسس')
      ? 'الأستاذ(ة) الفاضل(ة):'
      : 'الأستاذ(ة) المدرب(ة) المتطوع(ة):';

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
          <img src="${origin}/brand/logo-1001-kids.png" alt="شعار مبادرة 1001 طفل رقمي" style="height:64px;width:auto;display:block;margin:0 auto 4px" />
          <div class="sub">HONOR ROLL OF MENTORS • 2026</div>
        </div>

        <div class="logos-col">
          <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="height:34px" />
        </div>
      </div>

      <div class="cert-body">
        <span class="kicker">وسام التميز التدريبي والإشراف العلمي • الدفعة الأولى (2026)</span>
        <h1 class="cert-title">شهادة شكر وتقدير واعتزاز</h1>
        <p class="cert-intro">
          تتقدم إدارة <strong>نادي أبدع للمهارات الذكية</strong> والجهات الراعية والمعتمدة بأسمى آيات الشكر والتقدير والامتنان إلى ${recipientTitle}
        </p>

        <div class="mentor-pill">${safeName}</div>

        <p class="details-text">
          تقديراً وعرفاناً لجهودهم العلمية والتربوية والتطوعية المخلصة بصفتهم <span class="gold-highlight">(${safeRole})</span> من <span class="highlight">«${safeOrg}»</span>، وإسهامهم المتميز في <span class="highlight">«${safeSpecialty}»</span> ضمن <span class="gold-highlight">(${safeHours})</span> لتأهيل وتخريج 168 طفلاً رقمياً (الأعمار 6 – 14 سنة) وإنجاز 40 مشروعاً تقنياً في احتفالية قصر الثقافة.
        </p>
      </div>

      <div class="cert-footer">
        <div class="sig-col">
          <strong>إدارة نادي أبدع للمهارات الذكية</strong>
          <span>فراس نزار كريم</span>
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
          <strong>إدارة شركة المصدر لتكنولوجيا المعلومات</strong>
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
  const safeAge = escapeHtml(challenger.ageTag || '6 – 14 سنة');
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
          <div>مبادرة «1001» طفل رقمي (الأعمار 6 – 14 سنة)</div>
        </div>

        <div class="center-emblem">
          <img src="${origin}/brand/logo-1001-kids.png" alt="شعار مبادرة 1001 طفل رقمي" style="height:64px;width:auto;display:block;margin:0 auto 4px" />
          <div class="sub">ROBOT CODING CHALLENGE • 2026</div>
        </div>

        <div class="logos-col">
          <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
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
          <strong>إدارة شركة المصدر لتكنولوجيا المعلومات</strong>
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
 * 7. طباعة بطاقة عضوية وانتماء رسمية لنادي أبدع (هوية الوجهين CR80 / A4)
 * Official Two-Sided Club Membership & Affiliation ID Card
 */
