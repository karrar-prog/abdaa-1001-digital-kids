import { escapeHtml, sanitizeImageSrc } from './printHelpers';

function printHtmlViaHiddenIframe(html) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('abdaa-project-print-iframe');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'abdaa-project-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    }
    setTimeout(() => {
      iframe.remove();
    }, 3000);
  }, 500);
}

export function openProjectCardPrintWindow(project = {}, qrDataUrl = '', trackLabel = '', options = {}) {
  const { directPrint = false } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const safeTitle = escapeHtml(project.title || 'مشروع ابتكاري');
  const safeSubtitle = escapeHtml(project.subtitle || '');
  const safeStudents = escapeHtml(project.students || 'أبطال مبادرة 1001 طفل رقمي');
  const safeTrack = escapeHtml(trackLabel || project.track || 'الابتكار الرقمي');
  const safeAge = escapeHtml(project.ageLabel || '6 – 14 سنة');
  const safeSchool = escapeHtml(project.school || '');
  const safeGrade = escapeHtml(project.grade || '');
  const safeGov = escapeHtml(project.governorate || 'النجف الأشرف');
  const safeDesc = escapeHtml(project.desc || '');
  const safeCode = escapeHtml(project.code || `ABD-PRJ-${String(project.id || 1).padStart(2, '0')}`);
  const safeBooth = escapeHtml(String(project.id || '1'));
  const safeScore = escapeHtml(String(project.score || 96));

  const rawImg = project.image || '';
  const resolvedImg = rawImg.startsWith('/') ? `${origin}${rawImg}` : rawImg;
  const safeImg = sanitizeImageSrc(resolvedImg, '');
  const safeQr = sanitizeImageSrc(qrDataUrl, '');

  const featuresHtml =
    Array.isArray(project.features) && project.features.length > 0
      ? `<div class="box box-sky">
          <div class="box-title">أبرز مميزات وفوائد المشروع</div>
          <ul class="feat-list">${project.features.map((f) => `<li>✓ ${escapeHtml(f)}</li>`).join('')}</ul>
        </div>`
      : '';

  const breakdownHtml =
    project.problem || project.solution || project.impact
      ? `<div class="tri-grid">
          <div class="tri-card tri-rose">
            <div class="tri-head">1. الفكرة والمشكلة</div>
            <p>${escapeHtml(project.problem || '—')}</p>
          </div>
          <div class="tri-card tri-sky">
            <div class="tri-head">2. الحل التقني المبتكر</div>
            <p>${escapeHtml(project.solution || '—')}</p>
          </div>
          <div class="tri-card tri-emerald">
            <div class="tri-head">3. الأثر والفائدة</div>
            <p>${escapeHtml(project.impact || '—')}</p>
          </div>
        </div>`
      : '';

  const techHtml =
    Array.isArray(project.techTags) && project.techTags.length > 0
      ? `<div class="tags-row">${project.techTags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`
      : '';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>بطاقة مشروع المعرض #${safeBooth} — ${safeTitle}</title>
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
    @page { size: A4 portrait; margin: 8mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0; padding: 14px; background: #e2e8f0;
      font-family: "PNU", "Tahoma", Arial, sans-serif; color: #0f172a;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 10px; background: #082046; color: #fff;
      padding: 10px 18px; border-radius: 14px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
    }
    .btn-print {
      background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #0f172a; border: none;
      padding: 9px 22px; border-radius: 10px; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .btn-close {
      background: rgba(255,255,255,0.14); color: #fff; border: 1px solid rgba(255,255,255,0.25);
      padding: 9px 16px; border-radius: 10px; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .sheet {
      width: 194mm; background: #ffffff; border: 2.5px solid #082046;
      border-radius: 14px; padding: 10px 12px; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
    }
    .sheet-inner {
      border: 1.5px solid #d97706; border-radius: 10px; padding: 12px 14px;
    }
    .patronage {
      background: linear-gradient(90deg, #082046, #0f3a7a, #082046); color: #fde68a;
      border: 1.5px solid #f59e0b; border-radius: 8px; text-align: center;
      padding: 4.5px 12px; font-size: 12px; font-weight: 700; margin-bottom: 10px;
    }
    .logos {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding-bottom: 8px; border-bottom: 1.5px solid #e2e8f0; margin-bottom: 10px;
    }
    .logos img.abdaa { height: 46px; width: auto; }
    .logos img.masdar { height: 34px; width: auto; }
    .logos img.kids { height: 42px; width: auto; display: block; margin: 0 auto 2px; }
    .head-mid { text-align: center; flex: 1; }
    .head-kicker {
      display: inline-block; font-size: 10.5px; font-weight: 700; color: #b45309;
      background: #fef3c7; border: 1px solid #f59e0b; padding: 2px 10px; border-radius: 99px;
    }
    .badges-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 8px; }
    .pill {
      font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px;
      border: 1px solid #bae6fd; background: #f0f9ff; color: #0369a1;
    }
    .pill-gold { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
    .pill-green { background: #ecfdf5; border-color: #6ee7b7; color: #047857; margin-right: auto; }
    .title { margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #082046; line-height: 1.3; }
    .subtitle { margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #0284c7; }
    .poster-wrap {
      width: 100%; max-height: 245px; border-radius: 12px; overflow: hidden;
      background: #0f172a; border: 1.5px solid #cbd5e1; margin-bottom: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .poster-wrap img { width: 100%; max-height: 245px; object-fit: contain; display: block; }
    .desc { font-size: 11.5px; line-height: 1.65; color: #334155; margin: 0 0 10px; }
    .box { border-radius: 10px; padding: 8px 11px; margin-bottom: 10px; }
    .box-sky { background: #f0f9ff; border: 1px solid #bae6fd; }
    .box-title { font-size: 11.5px; font-weight: 700; color: #0369a1; margin-bottom: 5px; }
    .feat-list { margin: 0; padding: 0; list-style: none; font-size: 10.8px; line-height: 1.55; color: #1e293b; }
    .tri-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
    .tri-card { border-radius: 10px; padding: 8px 9px; font-size: 10.2px; line-height: 1.5; }
    .tri-rose { background: #fff1f2; border: 1px solid #fecdd3; }
    .tri-sky { background: #f0f9ff; border: 1px solid #bae6fd; }
    .tri-emerald { background: #ecfdf5; border: 1px solid #a7f3d0; }
    .tri-head { font-weight: 700; margin-bottom: 4px; color: #0f172a; }
    .tri-card p { margin: 0; color: #334155; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
    .tag {
      font-size: 10px; font-weight: 700; padding: 2.5px 9px; border-radius: 7px;
      background: #f1f5f9; border: 1px solid #cbd5e1; color: #0369a1;
    }
    .student-card {
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
      background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 10px 14px;
    }
    .student-info { flex: 1; font-size: 11.5px; line-height: 1.7; }
    .student-name { font-size: 15px; font-weight: 700; color: #082046; }
    .code-mono { font-family: monospace; font-weight: 700; color: #0284c7; direction: ltr; display: inline-block; }
    .qr-box { background: #fff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 5px; text-align: center; }
    .qr-box img { width: 78px; height: 78px; display: block; }
    .qr-box span { display: block; font-family: monospace; font-size: 9.5px; font-weight: 700; color: #475569; margin-top: 2px; }
    .footer {
      margin-top: 9px; padding-top: 7px; border-top: 1px dashed #cbd5e1;
      display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #475569;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة بطاقة المشروع / حفظ PDF (A4)</button>
    <button class="btn-close" onclick="window.close()">إغلاق</button>
  </div>
  <div class="sheet">
    <div class="sheet-inner">
      <div class="patronage">★ برعاية فخامة رئيس الجمهورية • معرض ابتكارات مبادرة «1001» طفل رقمي ★</div>
      <div class="logos">
        <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" class="abdaa" />
        <div class="head-mid">
          <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" class="kids" />
          <div class="head-kicker">بطاقة مشروع وجناح العرض الرسمي • الدفعة الأولى 2026</div>
        </div>
        <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" class="masdar" />
      </div>

      <div class="badges-row">
        <span class="pill">جناح العرض #${safeBooth}</span>
        <span class="pill">${safeTrack}</span>
        <span class="pill pill-gold">${safeAge}</span>
        <span class="pill pill-green">التقييم العلمي: ${safeScore}/100</span>
      </div>

      <h1 class="title">${safeTitle}</h1>
      ${safeSubtitle ? `<div class="subtitle">${safeSubtitle}</div>` : ''}

      ${safeImg ? `<div class="poster-wrap"><img src="${safeImg}" alt="${safeTitle}" /></div>` : ''}

      <p class="desc">${safeDesc}</p>
      ${featuresHtml}
      ${breakdownHtml}
      ${techHtml}

      <div class="student-card">
        <div class="student-info">
          <div class="student-name">المبرمج الصغير: ${safeStudents}</div>
          ${safeSchool ? `<div>المدرسة / الصف: <strong>${safeSchool}${safeGrade ? ` — ${safeGrade}` : ''}</strong></div>` : ''}
          <div>المحافظة: <strong>${safeGov}</strong> • كود التوثيق: <span class="code-mono">${safeCode}</span></div>
        </div>
        ${safeQr ? `<div class="qr-box"><img src="${safeQr}" alt="QR" /><span>جناح #${safeBooth}</span></div>` : ''}
      </div>

      <div class="footer">
        <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
        <span>قصر الثقافة – النجف الأشرف • 27/11/2026</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (directPrint) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  const win = window.open('', '_blank', 'width=960,height=1100');
  if (!win) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
}
