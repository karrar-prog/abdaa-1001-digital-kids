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
  const safeLiveUrl = escapeHtml(
    project.liveUrl ? String(project.liveUrl).replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
  );

  const rawImg = project.image || '';
  const resolvedImg = rawImg.startsWith('/') ? `${origin}${rawImg}` : rawImg;
  const safeImg = sanitizeImageSrc(resolvedImg, '');
  const safeQr = sanitizeImageSrc(qrDataUrl, '');

  const trimmedFeatures = Array.isArray(project.features) ? project.features.slice(0, 4) : [];
  const featuresHtml =
    trimmedFeatures.length > 0
      ? `<div class="box box-sky">
          <div class="box-title">أبرز المميزات</div>
          <ul class="feat-list">${trimmedFeatures.map((f) => `<li>✓ ${escapeHtml(f)}</li>`).join('')}</ul>
        </div>`
      : '';

  const breakdownHtml =
    project.problem || project.solution || project.impact
      ? `<div class="tri-grid">
          <div class="tri-card tri-rose">
            <div class="tri-head">المشكلة</div>
            <p>${escapeHtml(project.problem || '—')}</p>
          </div>
          <div class="tri-card tri-sky">
            <div class="tri-head">الحل</div>
            <p>${escapeHtml(project.solution || '—')}</p>
          </div>
          <div class="tri-card tri-emerald">
            <div class="tri-head">الأثر</div>
            <p>${escapeHtml(project.impact || '—')}</p>
          </div>
        </div>`
      : '';

  const rawAge = String(project.ageLabel || '');
  const rawGrade = String(project.grade || '');
  const showGrade = Boolean(safeGrade) && !rawAge.includes(rawGrade);
  const schoolMetaParts = [
    safeSchool ? `${safeSchool}${showGrade ? ` — ${safeGrade}` : ''}` : showGrade ? safeGrade : '',
    safeGov
  ].filter(Boolean);

  return `<div class="sheet">
    <div class="sheet-inner">
      <div class="sheet-content">
        <div class="patronage">★ برعاية فخامة رئيس الجمهورية • مبادرة «1001» طفل رقمي ★</div>

        <!-- 1. Unified Top Header: Brand Logos + Project Title (Right) & Scannable QR (Left) -->
        <div class="hero-header">
          <div class="header-main">
            <div class="logos-compact">
              <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" class="abdaa" />
              <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" class="kids" />
              <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" class="masdar" />
            </div>
            <div class="badges-row">
              <span class="pill pill-booth">جناح #${safeBooth}</span>
              <span class="pill">${safeTrack}</span>
              <span class="pill pill-gold">${safeAge}</span>
            </div>
            <h1 class="title">${safeTitle}</h1>
            ${safeSubtitle ? `<div class="subtitle">${safeSubtitle}</div>` : ''}
          </div>
          ${
            safeQr
              ? `<div class="header-qr-box">
                  <img src="${safeQr}" alt="QR تقييم المشروع" />
                  <div class="qr-stars-label">قيّمني ★★★★★</div>
                </div>`
              : ''
          }
        </div>

        <!-- 2. Split Row: Description on RIGHT, Project Photo on LEFT (RTL) -->
        <div class="main-split${safeImg ? '' : ' no-photo'}">
          <div class="desc-panel">
            <div class="panel-label">فكرة المشروع</div>
            <p class="desc">${safeDesc}</p>
          </div>
          ${safeImg ? `<div class="photo-panel"><img src="${safeImg}" alt="${safeTitle}" /></div>` : ''}
        </div>

        <!-- 3. Large-Typography Details Filling Down to the Bottom -->
        <div class="text-zone">
          ${featuresHtml}
          ${breakdownHtml}
        </div>
      </div>

      <div class="sheet-bottom">
        <div class="student-card">
          <div class="student-info">
            <div class="student-name">${safeStudents}</div>
            <div class="student-meta">${schoolMetaParts.join(' • ')}${safeLiveUrl ? ` • <span class="code-mono">${safeLiveUrl}</span>` : ''}</div>
          </div>
          <div class="booth-stamp">
            <div class="booth-num">#${safeBooth}</div>
            <div class="booth-lbl">${safeCode}</div>
          </div>
        </div>

        <div class="footer">
          <span>نادي أبدع للمهارات الذكية × شركة المصدر لتكنولوجيا المعلومات</span>
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
      padding: 4px 12px;
      font-size: 11.8px;
      font-weight: 700;
      margin-bottom: 8px;
      flex-shrink: 0;
    }

    /* 1. Unified Top Header: Logos + Title (Right) & Large QR (Left) */
    .hero-header {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 12px;
      background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
      border: 1.5px solid #bae6fd;
      border-right: 5px solid #082046;
      border-radius: 12px;
      padding: 9px 12px;
      margin-bottom: 10px;
      flex-shrink: 0;
    }
    .header-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 5px;
    }
    .logos-compact {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 14px;
      padding-bottom: 5px;
      border-bottom: 1px solid #dbeafe;
    }
    .logos-compact img.abdaa { height: 34px; width: auto; }
    .logos-compact img.kids { height: 34px; width: auto; }
    .logos-compact img.masdar { height: 24px; width: auto; }

    .badges-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
    .pill {
      font-size: 11.8px;
      font-weight: 700;
      padding: 2.5px 11px;
      border-radius: 99px;
      border: 1px solid #bae6fd;
      background: #ffffff;
      color: #0369a1;
    }
    .pill-booth { background: #082046; border-color: #082046; color: #fde68a; }
    .pill-gold { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
    .title { margin: 0; font-size: 27px; font-weight: 700; color: #082046; line-height: 1.22; }
    .subtitle { margin: 0; font-size: 14.5px; font-weight: 700; color: #0284c7; line-height: 1.3; }

    .header-qr-box {
      width: 156px;
      flex-shrink: 0;
      background: #ffffff;
      border: 2.5px solid #f59e0b;
      border-radius: 12px;
      padding: 6px 6px 5px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.16);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .header-qr-box img {
      width: 130px;
      height: 130px;
      object-fit: contain;
      display: block;
      margin: auto;
    }
    .qr-stars-label {
      width: 100%;
      background: #082046;
      color: #fde68a;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      padding: 3.5px 6px;
      margin-top: 4px;
      line-height: 1.2;
      flex-shrink: 0;
    }

    /* 2. Split Row: Description on RIGHT, Project Photo on LEFT (RTL) */
    .main-split {
      display: flex;
      align-items: stretch;
      gap: 11px;
      margin-bottom: 10px;
      flex-shrink: 0;
    }
    .desc-panel {
      flex: 1.32;
      min-width: 0;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-right: 5px solid #0284c7;
      border-radius: 12px;
      padding: 13px 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .panel-label {
      font-size: 15.5px;
      font-weight: 700;
      color: #0369a1;
      margin-bottom: 6px;
    }
    .desc {
      font-size: 18px;
      line-height: 1.62;
      color: #0f172a;
      margin: 0;
    }
    .photo-panel {
      width: 43%;
      min-height: 210px;
      align-self: stretch;
      flex-shrink: 0;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .photo-panel img {
      width: 100%;
      height: 100%;
      max-height: 295px;
      object-fit: contain;
      border-radius: 8px;
      display: block;
    }
    .main-split.no-photo .desc-panel {
      flex: 1;
    }

    /* 3. Large-Typography Details Zone Filling Down to Bottom */
    .text-zone {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 11px;
    }
    .box {
      border-radius: 12px;
      padding: 13px 17px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .box-sky {
      flex: 1;
      background: #f0f9ff;
      border: 1.4px solid #bae6fd;
    }
    .box-title {
      font-size: 19px;
      font-weight: 700;
      color: #0369a1;
      margin-bottom: 8px;
    }
    .feat-list {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 17.2px;
      line-height: 1.58;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tri-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      align-items: stretch;
    }
    .tri-card {
      border-radius: 12px;
      padding: 13px 15px;
      font-size: 16.4px;
      line-height: 1.56;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .tri-rose { background: #fff1f2; border: 1.4px solid #fecdd3; }
    .tri-sky { background: #f0f9ff; border: 1.4px solid #bae6fd; }
    .tri-emerald { background: #ecfdf5; border: 1.4px solid #a7f3d0; }
    .tri-head { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: #082046; }
    .tri-card p { margin: 0; color: #0f172a; }
    .student-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 11px;
      padding: 10px 15px;
    }
    .student-info { flex: 1; }
    .student-name { font-size: 20.5px; font-weight: 700; color: #082046; margin-bottom: 3px; }
    .student-meta { font-size: 14.2px; font-weight: 700; color: #334155; line-height: 1.45; }
    .code-mono { font-family: monospace; font-weight: 700; color: #0284c7; direction: ltr; display: inline-block; }
    .booth-stamp {
      background: linear-gradient(135deg, #082046, #0f3a7a);
      color: #fde68a;
      border: 1.5px solid #f59e0b;
      border-radius: 10px;
      padding: 7px 14px;
      text-align: center;
      flex-shrink: 0;
    }
    .booth-num { font-size: 22px; font-weight: 700; line-height: 1; font-family: monospace; }
    .booth-lbl { font-size: 9.5px; font-weight: 700; color: #ffffff; margin-top: 3px; font-family: monospace; direction: ltr; }
    .footer {
      margin-top: 6px;
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
          var mainSplit = inner.querySelector('.main-split');
          var photoPanel = inner.querySelector('.photo-panel');
          if (!content || !bottom || !textZone) return;

          // Reset prior measurements
          textZone.style.zoom = '1';
          if (mainSplit) mainSplit.style.zoom = '1';
          var flexItems = textZone.querySelectorAll('.box-sky, .tri-grid');
          flexItems.forEach(function (el) { el.style.flex = '0 0 auto'; });

          var maxAllowed = inner.clientHeight - bottom.offsetHeight - 30;
          var measureNaturalTextH = function () {
            var total = 0;
            var kids = textZone.children;
            for (var i = 0; i < kids.length; i++) {
              total += kids[i].offsetHeight;
              if (i > 0) total += 11;
            }
            return total;
          };

          var fixedAbove = textZone.offsetTop - content.offsetTop;
          var availForText = Math.max(180, maxAllowed - fixedAbove);
          var naturalH = measureNaturalTextH();

          // Step 1: If very long project overflows, gently scale the split row uniformly (keeping photo & desc flush)
          if (naturalH > availForText && mainSplit && mainSplit.offsetHeight > 220) {
            mainSplit.style.zoom = '0.91';
            fixedAbove = textZone.offsetTop - content.offsetTop;
            availForText = Math.max(180, maxAllowed - fixedAbove);
          }

          // Step 2: Fit long text cleanly or boost short text boldly to fill A4 to the bottom
          if (naturalH > availForText) {
            var shrinkRatio = Math.max(0.76, (availForText - 4) / naturalH);
            textZone.style.zoom = shrinkRatio.toFixed(3);
          } else if (naturalH > 0 && naturalH < availForText * 0.90) {
            var bestZoom = 1.0;
            for (var z = 1.32; z >= 1.02; z -= 0.02) {
              textZone.style.zoom = z.toFixed(2);
              if (measureNaturalTextH() * z <= availForText - 4) {
                bestZoom = z;
                break;
              }
            }
            textZone.style.zoom = bestZoom.toFixed(2);
          }

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
