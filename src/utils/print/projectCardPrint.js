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
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-1';
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
    }, 3500);
  }, 700);
}

function buildProjectSheetMarkup(project = {}, qrDataUrl = '', trackLabel = '', origin = '') {
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
  const safeLiveUrl = escapeHtml(
    project.liveUrl ? String(project.liveUrl).replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
  );

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

  const mediaRightHtml = safeImg
    ? `<div class="poster-box"><img src="${safeImg}" alt="${safeTitle}" /></div>`
    : `<div class="poster-fallback">
        <div class="pf-badge">ابتكار معتمد في المعرض الحي</div>
        <div class="pf-track">${safeTrack}</div>
        <div class="pf-meta">جناح #${safeBooth} • ${safeAge} • التقييم ${safeScore}/100</div>
      </div>`;

  return `<div class="sheet">
    <div class="sheet-inner">
      <div class="sheet-content">
        <div class="patronage">★ برعاية فخامة رئيس الجمهورية • معرض ابتكارات مبادرة «1001» طفل رقمي ★</div>
        <div class="logos">
          <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" class="abdaa" />
          <div class="head-mid">
            <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" class="kids" />
            <div class="head-kicker">بطاقة مشروع وجناح العرض الرسمي • الدفعة الأولى 2026</div>
          </div>
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" class="masdar" />
        </div>

        <!-- 1. Full-Width Project Title Header at the Top -->
        <div class="title-banner">
          <div class="badges-row">
            <span class="pill pill-booth">جناح العرض #${safeBooth}</span>
            <span class="pill">${safeTrack}</span>
            <span class="pill pill-gold">${safeAge}</span>
            <span class="pill pill-green">التقييم العلمي: ${safeScore}/100</span>
          </div>
          <h1 class="title">${safeTitle}</h1>
          ${safeSubtitle ? `<div class="subtitle">${safeSubtitle}</div>` : ''}
        </div>

        <!-- 2. Side-by-Side Row: Project Photo beside Large Scannable QR Code -->
        <div class="media-row">
          ${mediaRightHtml}
          ${
            safeQr
              ? `<div class="top-qr-box">
                  <img src="${safeQr}" alt="QR تقييم المشروع" />
                  <div class="qr-stars-label">امسح هنا وقيّمني ★★★★★</div>
                </div>`
              : ''
          }
        </div>

        <!-- 3. Expanded High-Legibility Text Zone Filling Sheet Down to Bottom -->
        <div class="text-zone">
          <div class="desc-box">
            <p class="desc">${safeDesc}</p>
          </div>
          ${featuresHtml}
          ${breakdownHtml}
          ${techHtml}
        </div>
      </div>

      <div class="sheet-bottom">
        <div class="student-card">
          <div class="student-info">
            <div class="student-name">المبرمج الصغير: ${safeStudents}</div>
            ${safeSchool ? `<div>المدرسة / الصف: <strong>${safeSchool}${safeGrade ? ` — ${safeGrade}` : ''}</strong></div>` : ''}
            <div>المحافظة: <strong>${safeGov}</strong> • كود التوثيق: <span class="code-mono">${safeCode}</span></div>
            ${safeLiveUrl ? `<div>الرابط الحي للتطبيق: <span class="code-mono">${safeLiveUrl}</span></div>` : ''}
          </div>
          <div class="booth-stamp">
            <div class="booth-num">#${safeBooth}</div>
            <div class="booth-lbl">جناح معتمد</div>
          </div>
        </div>

        <div class="footer">
          <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
          <span>قصر الثقافة – النجف الأشرف • 27/11/2026</span>
        </div>
      </div>
    </div>
  </div>`;
}

function buildPrintDocumentHtml(pageTitle, toolbarLabel, sheetsHtml, origin) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(pageTitle)}</title>
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
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      color: #0f172a;
      background: #e2e8f0;
    }
    body {
      padding: 14px 0 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .toolbar {
      position: sticky;
      top: 10px;
      z-index: 20;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      background: #082046;
      color: #fff;
      padding: 10px 18px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);
    }
    .btn-print {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      color: #0f172a;
      border: none;
      padding: 9px 22px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-close {
      background: rgba(255,255,255,0.14);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 9px 16px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    /* Exact A4 Dimensions: 210mm x 297mm — fills paper cleanly with large readable text */
    .sheet {
      width: 210mm;
      height: 297mm;
      padding: 6mm;
      background: #ffffff;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.16);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      page-break-after: always;
      break-after: page;
    }
    .sheet:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .sheet-inner {
      flex: 1;
      height: 100%;
      border: 2.5px solid #082046;
      outline: 1.5px solid #d97706;
      outline-offset: -6px;
      border-radius: 12px;
      padding: 11px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .sheet-content {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .sheet-bottom {
      flex-shrink: 0;
      margin-top: 9px;
    }
    .patronage {
      background: linear-gradient(90deg, #082046, #0f3a7a, #082046);
      color: #fde68a;
      border: 1.5px solid #f59e0b;
      border-radius: 8px;
      text-align: center;
      padding: 4.5px 12px;
      font-size: 11.5px;
      font-weight: 700;
      margin-bottom: 7px;
      flex-shrink: 0;
    }
    .logos {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-bottom: 6px;
      border-bottom: 1.5px solid #e2e8f0;
      margin-bottom: 8px;
      flex-shrink: 0;
    }
    .logos img.abdaa { height: 42px; width: auto; }
    .logos img.masdar { height: 30px; width: auto; }
    .logos img.kids { height: 36px; width: auto; display: block; margin: 0 auto 2px; }
    .head-mid { text-align: center; flex: 1; }
    .head-kicker {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 1.5px 11px;
      border-radius: 99px;
    }
    /* Full-width prominent project title banner at the top */
    .title-banner {
      background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
      border: 1.5px solid #bae6fd;
      border-right: 5px solid #082046;
      border-radius: 12px;
      padding: 9px 14px;
      margin-bottom: 9px;
      flex-shrink: 0;
    }
    .badges-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 5px; }
    .pill {
      font-size: 11.5px;
      font-weight: 700;
      padding: 2.5px 10px;
      border-radius: 99px;
      border: 1px solid #bae6fd;
      background: #ffffff;
      color: #0369a1;
    }
    .pill-booth { background: #082046; border-color: #082046; color: #fde68a; }
    .pill-gold { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
    .pill-green { background: #ecfdf5; border-color: #6ee7b7; color: #047857; }
    .title { margin: 0; font-size: 25px; font-weight: 700; color: #082046; line-height: 1.26; }
    .subtitle { margin: 4px 0 0; font-size: 14.5px; font-weight: 700; color: #0284c7; line-height: 1.32; }

    /* Side-by-Side Row: Project Photo beside Large Scannable QR Code */
    .media-row {
      display: flex;
      align-items: stretch;
      gap: 11px;
      height: 190px;
      margin-bottom: 10px;
      flex-shrink: 0;
    }
    .poster-box {
      flex: 1;
      min-width: 0;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #0f172a;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .poster-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .poster-fallback {
      flex: 1;
      height: 100%;
      border-radius: 12px;
      background: linear-gradient(135deg, #082046 0%, #0f3a7a 100%);
      border: 2px solid #f59e0b;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 8px;
      color: #ffffff;
    }
    .pf-badge {
      background: #f59e0b;
      color: #082046;
      font-size: 12.5px;
      font-weight: 700;
      padding: 3px 14px;
      border-radius: 99px;
    }
    .pf-track { font-size: 23px; font-weight: 700; color: #fde68a; }
    .pf-meta { font-size: 13.5px; color: #e2e8f0; font-weight: 700; }

    .top-qr-box {
      width: 180px;
      height: 100%;
      flex-shrink: 0;
      background: #ffffff;
      border: 2.5px solid #f59e0b;
      border-radius: 13px;
      padding: 7px 7px 6px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.16);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .top-qr-box img {
      width: 140px;
      height: 140px;
      max-height: calc(100% - 34px);
      max-width: 100%;
      object-fit: contain;
      display: block;
      margin: auto;
    }
    .qr-stars-label {
      width: 100%;
      background: #082046;
      color: #fde68a;
      border-radius: 7px;
      font-size: 11.2px;
      font-weight: 700;
      padding: 4px 6px;
      margin-top: 5px;
      line-height: 1.25;
      flex-shrink: 0;
    }

    /* Expanded High-Legibility Text Zone that fills the rest of the A4 sheet cleanly */
    .text-zone {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
    }
    .desc-box {
      background: #f8fafc;
      border: 1.2px solid #cbd5e1;
      border-right: 4.5px solid #0284c7;
      border-radius: 10px;
      padding: 10px 14px;
    }
    .desc {
      font-size: 15.6px;
      line-height: 1.65;
      color: #0f172a;
      margin: 0;
    }
    .box {
      border-radius: 11px;
      padding: 11px 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .box-sky {
      flex: 1;
      background: #f0f9ff;
      border: 1.2px solid #bae6fd;
    }
    .box-title {
      font-size: 16px;
      font-weight: 700;
      color: #0369a1;
      margin-bottom: 6px;
    }
    .feat-list {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 14.4px;
      line-height: 1.62;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tri-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
      align-items: stretch;
    }
    .tri-card {
      border-radius: 11px;
      padding: 11px 13px;
      font-size: 13.8px;
      line-height: 1.58;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .tri-rose { background: #fff1f2; border: 1.2px solid #fecdd3; }
    .tri-sky { background: #f0f9ff; border: 1.2px solid #bae6fd; }
    .tri-emerald { background: #ecfdf5; border: 1.2px solid #a7f3d0; }
    .tri-head { font-size: 15px; font-weight: 700; margin-bottom: 5px; color: #0f172a; }
    .tri-card p { margin: 0; color: #1e293b; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0; }
    .tag {
      font-size: 12.2px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 7px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #0369a1;
    }
    .student-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 11px;
      padding: 10px 14px;
    }
    .student-info { flex: 1; font-size: 13.4px; line-height: 1.6; }
    .student-name { font-size: 17.5px; font-weight: 700; color: #082046; margin-bottom: 2px; }
    .code-mono { font-family: monospace; font-weight: 700; color: #0284c7; direction: ltr; display: inline-block; }
    .booth-stamp {
      background: linear-gradient(135deg, #082046, #0f3a7a);
      color: #fde68a;
      border: 1.5px solid #f59e0b;
      border-radius: 10px;
      padding: 8px 15px;
      text-align: center;
      flex-shrink: 0;
    }
    .booth-num { font-size: 22px; font-weight: 700; line-height: 1; font-family: monospace; }
    .booth-lbl { font-size: 9.8px; font-weight: 700; color: #ffffff; margin-top: 3px; }
    .footer {
      margin-top: 7px;
      padding-top: 5px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      font-size: 10.8px;
      font-weight: 700;
      color: #475569;
    }
    @media print {
      html, body {
        width: 210mm;
        background: #ffffff;
        padding: 0;
        margin: 0;
        gap: 0;
      }
      .toolbar { display: none !important; }
      .sheet {
        width: 210mm;
        height: 297mm;
        margin: 0;
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">${escapeHtml(toolbarLabel)}</button>
    <button class="btn-close" onclick="window.close()">إغلاق</button>
  </div>
  ${sheetsHtml}
  <script>
    (function fitAllSheetsToExactA4() {
      function runFit() {
        var sheets = document.querySelectorAll('.sheet-inner');
        sheets.forEach(function (inner) {
          var content = inner.querySelector('.sheet-content');
          var bottom = inner.querySelector('.sheet-bottom');
          var textZone = inner.querySelector('.text-zone');
          var mediaRow = inner.querySelector('.media-row');
          if (!content || !bottom || !textZone) return;

          // Reset before measuring true natural heights (unflexed)
          textZone.style.zoom = '1';
          if (mediaRow) mediaRow.style.height = '190px';
          var flexItems = textZone.querySelectorAll('.box-sky, .tri-grid');
          flexItems.forEach(function (el) { el.style.flex = '0 0 auto'; });

          var innerPad = 24;
          var maxAllowed = inner.clientHeight - bottom.offsetHeight - innerPad - 8;
          var fixedAbove = textZone.offsetTop - content.offsetTop;
          var availForText = Math.max(200, maxAllowed - fixedAbove);

          var measureNaturalTextH = function () {
            var total = 0;
            var kids = textZone.children;
            for (var i = 0; i < kids.length; i++) {
              total += kids[i].offsetHeight;
              if (i > 0) total += 10;
            }
            return total;
          };

          var naturalH = measureNaturalTextH();

          // Step 1: If long project overflows, gently trim media row first (keeps QR >= 114px scannable)
          if (naturalH > availForText && mediaRow) {
            var excess = naturalH - availForText;
            var targetMediaH = Math.max(152, 190 - excess - 4);
            mediaRow.style.height = targetMediaH + 'px';
            fixedAbove = textZone.offsetTop - content.offsetTop;
            availForText = Math.max(200, maxAllowed - fixedAbove);
          }

          // Step 2: Fit or Boost ONLY textZone so short projects become extra bold & long projects never clip
          if (naturalH > availForText) {
            var shrinkRatio = Math.max(0.76, (availForText - 4) / naturalH);
            textZone.style.zoom = shrinkRatio.toFixed(3);
          } else if (naturalH > 0 && naturalH < availForText * 0.88) {
            // Iteratively find the crispest zoom boost that fills down to the bottom without overflow
            var bestZoom = 1.0;
            for (var z = 1.24; z >= 1.02; z -= 0.02) {
              textZone.style.zoom = z.toFixed(2);
              if (measureNaturalTextH() * z <= availForText - 4) {
                bestZoom = z;
                break;
              }
            }
            textZone.style.zoom = bestZoom.toFixed(2);
          }

          // Restore flex growth so any remaining micro-gap spreads evenly down to the bottom
          flexItems.forEach(function (el) { el.style.flex = '1'; });
        });
      }
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(runFit);
      }
      window.addEventListener('load', runFit);
      setTimeout(runFit, 260);
    })();
  </script>
</body>
</html>`;
}

export function openProjectCardPrintWindow(project = {}, qrDataUrl = '', trackLabel = '', options = {}) {
  const { directPrint = false } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const safeBooth = String(project.id || '1');
  const title = `بطاقة مشروع المعرض #${safeBooth} — ${project.title || 'مشروع ابتكاري'}`;
  const sheetHtml = buildProjectSheetMarkup(project, qrDataUrl, trackLabel, origin);
  const html = buildPrintDocumentHtml(title, '🖨️ طباعة بطاقة المشروع / حفظ PDF (A4)', sheetHtml, origin);

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

export function openAllProjectCardsPrintWindow(entries = [], options = {}) {
  if (!Array.isArray(entries) || entries.length === 0) return;
  const { directPrint = false } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const sheetsHtml = entries
    .map(({ project, qrDataUrl, trackLabel }) =>
      buildProjectSheetMarkup(project, qrDataUrl, trackLabel, origin)
    )
    .join('\n');

  const html = buildPrintDocumentHtml(
    `بطاقات مشاريع المعرض (${entries.length} بطاقة A4)`,
    `🖨️ طباعة جميع بطاقات المشاريع (${entries.length} صفحة A4 / PDF)`,
    sheetsHtml,
    origin
  );

  if (directPrint) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  const win = window.open('', '_blank', 'width=980,height=1120');
  if (!win) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
}
