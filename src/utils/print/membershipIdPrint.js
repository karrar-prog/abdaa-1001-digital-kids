import { escapeHtml, sanitizeImageSrc, sanitizeHexColor, sanitizeBloodType } from './printHelpers';

export function openMembershipIdCardPrintWindow(member = {}) {
  const win = window.open('', '_blank', 'width=1050,height=860');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة هوية العضوية والانتماء.');
    return;
  }

  const origin = window.location.origin;
  const safeName = escapeHtml(member.fullName || 'عضو نادي أبدع للمهارات الذكية');
  const safeId = escapeHtml(member.membershipId || 'ABD-ID-2026-0001');
  const safeRole = escapeHtml(member.roleTitle || 'عضو مبتكر — مبادرة 1001 طفل رقمي');
  const safeTrack = escapeHtml(member.track || 'البرمجة والذكاء الاصطناعي والروبوتات');
  const safeAgeStage = escapeHtml(member.ageStage || 'الأعمار 6 – 14 سنة');
  const validBlood = sanitizeBloodType(member.bloodType);
  const safePhone = escapeHtml(member.phone || '07810746655');
  const safeCity = escapeHtml(member.cityOrSchool || 'النجف الأشرف');
  const safeIssue = escapeHtml(member.issueDate || '2026/11/01');
  const safeExpiry = escapeHtml(member.expiryDate || '2027/11/01');
  const safePhoto = sanitizeImageSrc(member.photoDataUrl, `${origin}/brand/abdaa-logo.png`);
  const safeQr = sanitizeImageSrc(member.qrDataUrl, '');
  const badgeColor = sanitizeHexColor(member.badgeColor, '#0284c7');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>هوية عضوية وانتماء رسمية - ${safeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Cairo', sans-serif;
      background: #0f172a;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .toolbar {
      width: 100%;
      max-width: 210mm;
      margin: 14px auto 10px;
      padding: 12px 18px;
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      color: #fff;
    }
    .toolbar-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .btn {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border: none;
      padding: 9px 18px;
      border-radius: 11px;
      font-family: 'Cairo', sans-serif;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
    }
    .btn-secondary {
      background: rgba(255,255,255,0.1);
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 9px 14px;
      border-radius: 11px;
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
    }
    .btn-secondary.active {
      background: #0284c7;
      color: #fff;
      border-color: #38bdf8;
    }
    .a4-sheet {
      width: 190mm;
      background: #ffffff;
      border-radius: 18px;
      padding: 12mm 10mm;
      margin-bottom: 24px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.45);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .sheet-header {
      width: 100%;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 10px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #475569;
      font-weight: 800;
    }
    .cards-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      width: 100%;
    }
    .card-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .side-label {
      font-size: 11px;
      font-weight: 900;
      color: #475569;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 2px 12px;
      border-radius: 99px;
    }

    /* المقاس القياسي المكبر بوضوح فائق للطباعة والقص أو الكبس الحراري (106mm × 67mm بنسبة CR80) */
    .id-card {
      width: 106mm;
      height: 67mm;
      border-radius: 4.5mm;
      position: relative;
      overflow: hidden;
      background: #ffffff;
      border: 1.5px solid #94a3b8;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    /* عند تفعيل المقاس القياسي لطابعات PVC CR80 (85.6mm × 54mm) */
    body.cr80-mode .id-card {
      width: 85.6mm;
      height: 54mm;
      border-radius: 3.2mm;
    }
    body.cr80-mode .id-card-inner-scale {
      transform: scale(0.8075);
      transform-origin: top right;
      width: 106mm;
      height: 67mm;
    }
    .id-card-inner-scale {
      width: 106mm;
      height: 67mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    /* الوجه الأمامي */
    .front-bg {
      background:
        radial-gradient(circle at 12% 18%, rgba(56, 189, 248, 0.14), transparent 45%),
        radial-gradient(circle at 88% 85%, rgba(245, 158, 11, 0.14), transparent 45%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }
    .card-top-bar {
      background: linear-gradient(135deg, #071936 0%, #0c2d63 55%, #0284c7 100%);
      color: #ffffff;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #f59e0b;
      height: 16.5mm;
    }
    .brand-right {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .brand-logo-box {
      width: 11.5mm;
      height: 11.5mm;
      border-radius: 2.5mm;
      background: #ffffff;
      padding: 1.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      flex-shrink: 0;
    }
    .brand-logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .brand-titles {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }
    .brand-titles .ar {
      font-family: 'Alexandria', sans-serif;
      font-size: 10.5px;
      font-weight: 900;
      color: #ffffff;
    }
    .brand-titles .sub {
      font-size: 7.5px;
      font-weight: 800;
      color: #fde68a;
      margin-top: 1px;
    }
    .brand-titles .en {
      font-size: 6.5px;
      font-weight: 800;
      color: #bae6fd;
      letter-spacing: 0.6px;
    }
    .masdar-box {
      background: #ffffff;
      padding: 2px 6px;
      border-radius: 2mm;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 9.5mm;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .masdar-box img {
      height: 7.5mm;
      width: auto;
      object-fit: contain;
    }

    .front-body {
      flex: 1;
      padding: 6px 10px 4px;
      display: grid;
      grid-template-columns: 25mm 1fr;
      gap: 8px;
      align-items: center;
    }
    .photo-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    .member-photo-frame {
      width: 24mm;
      height: 28mm;
      border-radius: 3mm;
      border: 2px solid ${badgeColor};
      background: #f1f5f9;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(2, 132, 199, 0.15);
    }
    .member-photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .member-id-pill {
      width: 100%;
      text-align: center;
      background: #0f172a;
      color: #fbbf24;
      font-family: monospace;
      font-size: 7.5px;
      font-weight: 900;
      padding: 2px 3px;
      border-radius: 1.5mm;
      letter-spacing: 0.4px;
    }

    .info-column {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 1px 0;
    }
    .role-ribbon {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      background: ${badgeColor};
      color: #ffffff;
      font-size: 8px;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 1.8mm;
      margin-bottom: 3px;
    }
    .member-name {
      font-family: 'Alexandria', sans-serif;
      font-size: 12.5px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 4px;
      border-right: 3px solid #f59e0b;
      padding-right: 6px;
    }
    .fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 6px;
    }
    .field-item {
      background: rgba(241, 245, 249, 0.85);
      border: 1px solid #e2e8f0;
      border-radius: 1.5mm;
      padding: 2px 5px;
    }
    .field-item.full {
      grid-column: 1 / -1;
    }
    .field-item .lbl {
      font-size: 6.5px;
      font-weight: 800;
      color: #64748b;
      display: block;
      line-height: 1.1;
    }
    .field-item .val {
      font-size: 8px;
      font-weight: 900;
      color: #0f172a;
      display: block;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-bottom-strip {
      height: 6.5mm;
      background: linear-gradient(90deg, #071936, #0f172a);
      color: #ffffff;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 7px;
      font-weight: 800;
      border-top: 1.5px solid #f59e0b;
    }
    .card-bottom-strip .gold {
      color: #fbbf24;
      font-family: monospace;
      letter-spacing: 0.6px;
    }

    /* الوجه الخلفي */
    .back-bg {
      background:
        radial-gradient(circle at 85% 20%, rgba(2, 132, 199, 0.1), transparent 45%),
        linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    }
    .mag-strip {
      width: 100%;
      height: 8.5mm;
      background: linear-gradient(90deg, #020617, #1e293b, #020617);
      margin-top: 3.5mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      color: #94a3b8;
      font-family: monospace;
      font-size: 7px;
      letter-spacing: 1px;
    }
    .back-body {
      flex: 1;
      padding: 5px 10px 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .back-top-row {
      display: grid;
      grid-template-columns: 1fr 22mm;
      gap: 8px;
      align-items: center;
    }
    .terms-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-right: 3px solid #0284c7;
      border-radius: 2mm;
      padding: 4px 7px;
    }
    .terms-box h5 {
      margin: 0 0 2px;
      font-size: 7.5px;
      font-weight: 900;
      color: #071936;
    }
    .terms-box p {
      margin: 0;
      font-size: 6.8px;
      font-weight: 700;
      color: #334155;
      line-height: 1.35;
    }
    .qr-box {
      width: 21mm;
      height: 21mm;
      border-radius: 2mm;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      padding: 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 17mm;
      height: 17mm;
      object-fit: contain;
    }
    .meta-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 1.5mm;
      padding: 2.5px 8px;
      font-size: 7px;
      font-weight: 800;
      color: #1e3a8a;
    }
    .back-signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding-top: 2px;
      border-top: 1px dashed #cbd5e1;
    }
    .sig-card {
      text-align: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 1.5mm;
      padding: 2.5px 4px;
    }
    .sig-card strong {
      display: block;
      font-size: 6.8px;
      font-weight: 900;
      color: #475569;
    }
    .sig-card span {
      display: block;
      font-family: 'Alexandria', sans-serif;
      font-size: 8px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 1px;
    }

    @media print {
      body { background: #ffffff; }
      .toolbar { display: none !important; }
      .a4-sheet {
        box-shadow: none;
        padding: 4mm;
        margin: 0;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <strong style="font-size:14px;display:block">🪪 خدمة إصدار وطباعة هوية العضوية والانتماء الرسمية</strong>
      <span style="font-size:11px;color:#94a3b8">يمكنك الطباعة على ورق A4 (الوجهين معاً للقص والكبس الحراري) أو بمقاس بطاقة PVC CR80 القياسية</span>
    </div>
    <div class="toolbar-actions">
      <button id="btnStd" class="btn-secondary active" onclick="document.body.classList.remove('cr80-mode');document.getElementById('btnStd').classList.add('active');document.getElementById('btnCr80').classList.remove('active');">
        مقاس واضح للقص والكبس (106×67 ملم)
      </button>
      <button id="btnCr80" class="btn-secondary" onclick="document.body.classList.add('cr80-mode');document.getElementById('btnCr80').classList.add('active');document.getElementById('btnStd').classList.remove('active');">
        مقاس بطاقة بلاستيكية قياسي CR80 (85.6×54 ملم)
      </button>
      <button class="btn" onclick="window.print()">🖨️ طباعة الهوية الرسمية الآن</button>
    </div>
  </div>

  <div class="a4-sheet">
    <div class="sheet-header">
      <span>المؤسس المنظم: نادي أبدع للمهارات الذكية × الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
      <span>وثيقة هوية عضوية وانتماء رسمية (الوجه الأمامي + الوجه الخلفي)</span>
      <span style="font-family:monospace">${safeId}</span>
    </div>

    <div class="cards-wrapper">
      <!-- ==================== الوجه الأمامي للهوية ==================== -->
      <div class="card-block">
        <span class="side-label">الوجه الأمامي للهوية (FRONT SIDE)</span>
        <div class="id-card front-bg">
          <div class="id-card-inner-scale">
            <div class="card-top-bar">
              <div class="brand-right">
                <div class="brand-logo-box">
                  <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
                </div>
                <div class="brand-titles">
                  <span class="ar">نادي أبدع للمهارات الذكية</span>
                  <span class="sub">هوية عضوية وانتماء رسمية • مبادرة «1001» طفل رقمي</span>
                  <span class="en">ABDAA SMART SKILLS CLUB • OFFICIAL MEMBERSHIP ID</span>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:5px;flex-shrink:0">
                <img src="${origin}/brand/logo-1001-kids.png" alt="مبادرة 1001 طفل رقمي" style="height:32px;width:auto;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))" />
                <div class="masdar-box">
                  <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" />
                </div>
              </div>
            </div>

            <div class="front-body">
              <div class="photo-column">
                <div class="member-photo-frame">
                  <img src="${safePhoto}" alt="${safeName}" />
                </div>
                <div class="member-id-pill">${safeId}</div>
              </div>

              <div class="info-column">
                <div>
                  <div class="role-ribbon">
                    <span>${safeRole}</span>
                    <span style="color:#fde68a">★ معتمد</span>
                  </div>
                  <div class="member-name">${safeName}</div>
                </div>

                <div class="fields-grid">
                  <div class="field-item full">
                    <span class="lbl">المسار العلمي / التخصص المعتمد</span>
                    <span class="val">${safeTrack}</span>
                  </div>
                  <div class="field-item">
                    <span class="lbl">الفئة / المرحلة</span>
                    <span class="val">${safeAgeStage}</span>
                  </div>
                  <div class="field-item">
                    <span class="lbl">المدرسة / المحافظة</span>
                    <span class="val">${safeCity}</span>
                  </div>
                  <div class="field-item">
                    <span class="lbl">تاريخ الإصدار</span>
                    <span class="val" style="font-family:monospace">${safeIssue}</span>
                  </div>
                  <div class="field-item">
                    <span class="lbl">صلاحية الهوية</span>
                    <span class="val" style="font-family:monospace;color:#0284c7">${safeExpiry}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-bottom-strip">
              <span>النجف الأشرف — الحاضنة العلمية للبرمجة والذكاء الاصطناعي والروبوتات</span>
              <span class="gold">ID: ${safeId}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== الوجه الخلفي للهوية ==================== -->
      <div class="card-block">
        <span class="side-label">الوجه الخلفي للهوية (BACK SIDE)</span>
        <div class="id-card back-bg">
          <div class="id-card-inner-scale">
            <div class="mag-strip">
              <span>ABDAA SMART SKILLS CLUB • AL-NAJAF AL-ASHRAF</span>
              <span style="display:inline-flex;align-items:center;gap:4px">
                <img src="${origin}/brand/logo-1001-kids.png" alt="1001" style="height:16px;width:auto" />
                <span>1001 DIGITAL KIDS</span>
              </span>
            </div>

            <div class="back-body">
              <div class="back-top-row">
                <div class="terms-box">
                  <h5>تعليمات واعتماد هوية الانتماء الرسمية:</h5>
                  <p>
                    1. تُعد هذه البطاقة وثيقة رسمية تثبت انتماء حاملها إلى <strong>نادي أبدع للمهارات الذكية</strong> ومبادرة «1001» طفل رقمي.<br/>
                    2. تخول حاملها دخول المختبرات العلمية، الورش التدريبية، والمعارض التكنولوجية المعتمدة.<br/>
                    3. عند العثور عليها يرجى تسليمها لإدارة النادي أو الاتصال على الرقم الرسمي المثبت أدناه.
                  </p>
                </div>
                <div class="qr-box">
                  ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
                </div>
              </div>

              <div class="meta-strip">
                <span>هاتف العضو / ولي الأمر: <strong style="font-family:monospace">${safePhone}</strong></span>
                ${validBlood ? `<span>فصيلة الدم: <strong style="color:#dc2626;direction:ltr;display:inline-block">${escapeHtml(validBlood)}</strong></span>` : ''}
                <span>هاتف الإدارة: <strong style="font-family:monospace">07810746655</strong></span>
              </div>

              <div class="back-signatures">
                <div class="sig-card">
                  <strong>نادي أبدع للمهارات الذكية (المؤسس المنظم)</strong>
                  <span>فراس نزار كريم</span>
                </div>
                <div class="sig-card">
                  <strong>شركة المصدر لتكنولوجيا المعلومات (الشريك المنظم)</strong>
                  <span>كرار حساني جاسم</span>
                </div>
              </div>
            </div>

            <div class="card-bottom-strip">
              <span>VERIFIED DIGITAL MEMBERSHIP CARD • WWW.ABDAA-1001.COM</span>
              <span class="gold">MASDAR IT & ABDAA CLUB</span>
            </div>
          </div>
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
 * 8. الطباعة الجماعية لهويات العضوية والانتماء (كروب كامل أو المدربين دفعة واحدة — الوجهان متقابلان للقص والطي والكبس الحراري)
 */
export function openBatchMembershipIdCardsPrintWindow(membersList = [], groupTitle = 'هويات العضوية والانتماء') {
  if (!Array.isArray(membersList) || membersList.length === 0) return;

  const win = window.open('', '_blank', 'width=1120,height=880');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الهويات الجماعية.');
    return;
  }

  const origin = window.location.origin;
  const safeGroupTitle = escapeHtml(groupTitle);

  const cardsHtml = membersList
    .map((member, index) => {
      const safeName = escapeHtml(member.fullName || 'عضو نادي أبدع للمهارات الذكية');
      const safeId = escapeHtml(member.membershipId || `ABD-ID-2026-${String(index + 1).padStart(4, '0')}`);
      const safeRole = escapeHtml(member.roleTitle || 'عضو خريج معتمد — مبادرة 1001 طفل رقمي');
      const safeTrack = escapeHtml(member.track || 'البرمجة والذكاء الاصطناعي والروبوتات');
      const safeAgeStage = escapeHtml(member.ageStage || 'الأعمار 6 – 14 سنة');
      const safeCity = escapeHtml(member.cityOrSchool || 'النجف الأشرف');
      const safeIssue = escapeHtml(member.issueDate || '2026/11/01');
      const safeExpiry = escapeHtml(member.expiryDate || '2027/11/01');
      const safePhone = escapeHtml(member.phone || '07810746655');
      const validBlood = sanitizeBloodType(member.bloodType);
      const safePhoto = sanitizeImageSrc(member.photoDataUrl, `${origin}/brand/abdaa-logo.png`);
      const safeQr = sanitizeImageSrc(member.qrDataUrl, '');
      const badgeColor = sanitizeHexColor(member.badgeColor, '#0284c7');

      return `
      <div class="duplex-row">
        <!-- الوجه الأمامي (يمين) -->
        <div class="mini-card front-bg">
          <div class="top-bar">
            <div class="b-right">
              <div class="b-logo"><img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" /></div>
              <div class="b-txt">
                <strong>نادي أبدع للمهارات الذكية</strong>
                <span>هوية عضوية وانتماء رسمية • مبادرة «1001» طفل رقمي</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
              <img src="${origin}/brand/logo-1001-kids.png" alt="1001" style="height:26px;width:auto;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.35))" />
              <div class="m-logo"><img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" /></div>
            </div>
          </div>

          <div class="f-body">
            <div class="p-col">
              <div class="p-frame" style="border-color:${badgeColor}">
                <img src="${safePhoto}" alt="${safeName}" />
              </div>
              <div class="id-pill">${safeId}</div>
            </div>

            <div class="i-col">
              <div>
                <div class="r-ribbon" style="background:${badgeColor}">
                  <span>${safeRole}</span>
                  <span style="color:#fde68a">★ معتمد</span>
                </div>
                <div class="m-name">${safeName}</div>
              </div>

              <div class="f-grid">
                <div class="f-item full">
                  <span class="l">المسار العلمي / التخصص</span>
                  <span class="v">${safeTrack}</span>
                </div>
                <div class="f-item">
                  <span class="l">الفئة / المرحلة</span>
                  <span class="v">${safeAgeStage}</span>
                </div>
                <div class="f-item">
                  <span class="l">المجموعة / المحافظة</span>
                  <span class="v">${safeCity}</span>
                </div>
                <div class="f-item">
                  <span class="l">الإصدار</span>
                  <span class="v" style="font-family:monospace">${safeIssue}</span>
                </div>
                <div class="f-item">
                  <span class="l">النفاذ</span>
                  <span class="v" style="font-family:monospace;color:#0284c7">${safeExpiry}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="b-strip">
            <span>النجف الأشرف — الحاضنة العلمية للبرمجة والروبوتات</span>
            <span class="gold">${safeId}</span>
          </div>
        </div>

        <!-- خط الطي الوسطي للكبس الحراري -->
        <div class="fold-line" title="خط الطي لتطابق الوجهين"></div>

        <!-- الوجه الخلفي (يسار) -->
        <div class="mini-card back-bg">
          <div class="mag">
            <span>ABDAA SMART SKILLS CLUB • AL-NAJAF</span>
            <span style="display:inline-flex;align-items:center;gap:4px">
              <img src="${origin}/brand/logo-1001-kids.png" alt="1001" style="height:14px;width:auto" />
              <span>1001 DIGITAL KIDS</span>
            </span>
          </div>

          <div class="bk-body">
            <div class="bk-top">
              <div class="t-box">
                <h6>اعتماد هوية الانتماء الرسمية:</h6>
                <p>
                  1. وثيقة رسمية تثبت انتماء حاملها إلى <strong>نادي أبدع للمهارات الذكية</strong> ومبادرة «1001» طفل رقمي.<br/>
                  2. تخول حاملها حضور المختبرات والورش العلمية والمعارض التكنولوجية.<br/>
                  3. امسح رمز الـ QR للتحقق الإلكتروني الفوري من صحة الوثيقة.
                </p>
              </div>
              <div class="q-box">
                ${safeQr ? `<img src="${safeQr}" alt="QR" />` : ''}
              </div>
            </div>

            <div class="m-strip">
              <span>الهاتف: <strong style="font-family:monospace">${safePhone}</strong></span>
              ${validBlood ? `<span>فصيلة الدم: <strong style="color:#dc2626;direction:ltr;display:inline-block">${escapeHtml(validBlood)}</strong></span>` : ''}
              <span>الإدارة: <strong style="font-family:monospace">07810746655</strong></span>
            </div>

            <div class="sigs">
              <div class="s-card">
                <strong>نادي أبدع للمهارات الذكية (المؤسس المنظم)</strong>
                <span>فراس نزار كريم</span>
              </div>
              <div class="s-card">
                <strong>شركة المصدر لتكنولوجيا المعلومات (الشريك المنظم)</strong>
                <span>كرار حساني جاسم</span>
              </div>
            </div>
          </div>

          <div class="b-strip">
            <span>VERIFIED DIGITAL MEMBERSHIP ID</span>
            <span class="gold">MASDAR IT & ABDAA CLUB</span>
          </div>
        </div>
      </div>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>طباعة جماعية (${membersList.length} هوية) — ${safeGroupTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page { size: A4 portrait; margin: 8mm; }
    body {
      margin: 0;
      padding: 0;
      background: #0f172a;
      font-family: 'Cairo', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .toolbar {
      width: 194mm;
      margin: 12px auto;
      padding: 12px 18px;
      background: #1e293b;
      color: #fff;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .btn-print {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-family: 'Cairo', sans-serif;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
    }
    .sheet-container {
      width: 194mm;
      background: #ffffff;
      padding: 6mm 4mm;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .duplex-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 6mm;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .fold-line {
      width: 0;
      height: 58mm;
      border-left: 1.5px dashed #94a3b8;
      margin: 0 1.5mm;
    }
    .mini-card {
      width: 90mm;
      height: 57mm;
      border-radius: 3.5mm;
      border: 1px solid #94a3b8;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
    }
    .front-bg {
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }
    .back-bg {
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    }
    .top-bar {
      height: 13.5mm;
      background: linear-gradient(135deg, #071936 0%, #0c2d63 55%, #0284c7 100%);
      color: #fff;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #f59e0b;
    }
    .b-right { display: flex; align-items: center; gap: 5px; }
    .b-logo {
      width: 9.5mm; height: 9.5mm; border-radius: 2mm; background: #fff; padding: 1px;
      display: flex; align-items: center; justify-content: center;
    }
    .b-logo img { width: 100%; height: 100%; object-fit: contain; }
    .b-txt strong { display: block; font-family: 'Alexandria', sans-serif; font-size: 9px; font-weight: 900; line-height: 1.15; }
    .b-txt span { display: block; font-size: 6.5px; color: #fde68a; font-weight: 800; }
    .m-logo {
      background: #fff; border-radius: 1.8mm; padding: 1.5px 5px; height: 8mm;
      display: flex; align-items: center; justify-content: center;
    }
    .m-logo img { height: 6mm; width: auto; object-fit: contain; }
    .f-body {
      flex: 1; padding: 4px 8px 3px; display: grid; grid-template-columns: 20.5mm 1fr; gap: 6px; align-items: center;
    }
    .p-col { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .p-frame {
      width: 20mm; height: 23.5mm; border-radius: 2.2mm; border: 1.8px solid #0284c7;
      overflow: hidden; background: #f1f5f9;
    }
    .p-frame img { width: 100%; height: 100%; object-fit: cover; }
    .id-pill {
      width: 100%; text-align: center; background: #0f172a; color: #fbbf24;
      font-family: monospace; font-size: 6.3px; font-weight: 900; padding: 1.5px 2px; border-radius: 1.2mm;
    }
    .i-col { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
    .r-ribbon {
      display: flex; align-items: center; justify-content: space-between;
      color: #fff; font-size: 6.8px; font-weight: 900; padding: 1.5px 6px; border-radius: 1.4mm; margin-bottom: 2px;
    }
    .m-name {
      font-family: 'Alexandria', sans-serif; font-size: 10.5px; font-weight: 900; color: #0f172a;
      border-right: 2.5px solid #f59e0b; padding-right: 5px; margin-bottom: 2px; line-height: 1.15;
    }
    .f-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 4px; }
    .f-item { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 1.2mm; padding: 1.5px 4px; }
    .f-item.full { grid-column: 1 / -1; }
    .f-item .l { font-size: 5.6px; color: #64748b; font-weight: 800; display: block; line-height: 1.05; }
    .f-item .v { font-size: 6.8px; color: #0f172a; font-weight: 900; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .b-strip {
      height: 5.2mm; background: #071936; color: #fff; padding: 0 7px;
      display: flex; align-items: center; justify-content: space-between; font-size: 6px; font-weight: 800;
      border-top: 1.2px solid #f59e0b;
    }
    .b-strip .gold { color: #fbbf24; font-family: monospace; }
    .mag {
      height: 6.5mm; background: #0f172a; color: #94a3b8; margin-top: 2.5mm; padding: 0 8px;
      display: flex; align-items: center; justify-content: space-between; font-family: monospace; font-size: 6px;
    }
    .bk-body { flex: 1; padding: 4px 8px 3px; display: flex; flex-direction: column; justify-content: space-between; }
    .bk-top { display: grid; grid-template-columns: 1fr 18mm; gap: 5px; align-items: center; }
    .t-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-right: 2.5px solid #0284c7; border-radius: 1.5mm; padding: 3px 5px; }
    .t-box h6 { margin: 0 0 1px; font-size: 6.5px; font-weight: 900; color: #071936; }
    .t-box p { margin: 0; font-size: 5.8px; font-weight: 700; color: #334155; line-height: 1.3; }
    .q-box { width: 17.5mm; height: 17.5mm; border: 1px solid #cbd5e1; border-radius: 1.5mm; background: #fff; display: flex; align-items: center; justify-content: center; padding: 1.5px; }
    .q-box img { width: 100%; height: 100%; object-fit: contain; }
    .m-strip {
      background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 1.2mm; padding: 1.5px 6px;
      display: flex; align-items: center; justify-content: space-between; font-size: 6px; font-weight: 800; color: #1e3a8a;
    }
    .sigs { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; border-top: 1px dashed #cbd5e1; padding-top: 2px; }
    .s-card { text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1.2mm; padding: 1.5px 3px; }
    .s-card strong { display: block; font-size: 5.8px; color: #475569; font-weight: 900; }
    .s-card span { display: block; font-family: 'Alexandria', sans-serif; font-size: 6.8px; color: #0f172a; font-weight: 900; }
    @media print {
      body { background: #ffffff; }
      .toolbar { display: none !important; }
      .sheet-container { width: 100%; padding: 0; margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <strong style="font-size:14px;display:block">🖨️ الطباعة الجماعية لهويات العضوية والانتماء — ${safeGroupTitle} (${membersList.length} هوية مزدوجة)</strong>
      <span style="font-size:11px;color:#cbd5e1">كل صف يحتوي على الوجه الأمامي والوجه الخلفي متقابلين: قص الشريط واطوه من الوسط للكبس الحراري المباشر</span>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ طباعة جميع الهويات الآن (${membersList.length})</button>
  </div>

  <div class="sheet-container">
    ${cardsHtml}
  </div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

