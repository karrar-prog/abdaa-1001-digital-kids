import { escapeHtml, sanitizeImageSrc, sanitizeHexColor } from './printHelpers';

export function openTicketPrintWindow(ticket, qrDataUrl) {
  const win = window.open('', '_blank', 'width=860,height=720');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(ticket.attendee_name || ticket.attendeeName);
  const safeCode = escapeHtml(ticket.booking_code || ticket.bookingCode);
  const safeType = escapeHtml(ticket.guest_type || ticket.guestType);
  const safeSeat = escapeHtml(ticket.seat_label || ticket.seatLabel || 'مقعد عام');
  const safeBlock = escapeHtml(ticket.block_name || ticket.blockName || 'القاعة الرئيسية');
  const safeCompanions = escapeHtml(ticket.companions_count || ticket.companionsCount || '1');
  const safeQr = sanitizeImageSrc(qrDataUrl || ticket.qrDataUrl);

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
  const safeName = escapeHtml(candidate.child_name || candidate.childName);
  const safeCode = escapeHtml(candidate.candidate_code || candidate.candidateCode);
  const safeAge = escapeHtml(candidate.child_age || candidate.childAge);
  const safeStage = escapeHtml(candidate.age_stage || candidate.ageStage);
  const safeTrack = escapeHtml(candidate.preferred_track || candidate.preferredTrack);
  const safeSchool = escapeHtml(candidate.school_name || candidate.schoolName || 'مدارس النجف الأشرف');
  const safeParent = escapeHtml(candidate.parent_name || candidate.parentName);
  const safePhone = escapeHtml(candidate.parent_phone || candidate.parentPhone);
  const safeQr = sanitizeImageSrc(qrDataUrl || candidate.qrDataUrl);

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
