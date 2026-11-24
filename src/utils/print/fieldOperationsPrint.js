import { escapeHtml } from './printHelpers';
import { OPERATIONAL_TIMELINE_MATRIX, BOOTH_SECURITY_PROTOCOL } from '../fieldOperationsPlan';

function printHtmlViaHiddenIframe(html) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('abdaa-field-ops-print-iframe');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'abdaa-field-ops-print-iframe';
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
  }, 450);
}

function renderGroupCardsHtml(groups, isBooth) {
  return (groups || [])
    .map((grp) => {
      const supDisplay = grp.supervisorName
        ? escapeHtml(grp.supervisorName)
        : '<span class="blank-line">.........................................</span>';
      const phoneDisplay = grp.supervisorPhone
        ? escapeHtml(grp.supervisorPhone)
        : '<span class="blank-line-sm">...........................</span>';

      const rows = (grp.members || [])
        .map((m, idx) => {
          const extraCol = isBooth
            ? `<span class="booth-tag">${escapeHtml(m.boothLabel || 'بوث')}</span> ${escapeHtml(m.projectTitle || m.project || '')}`
            : escapeHtml(m.cohortName || m.track || '');
          return `
            <tr>
              <td class="c-num">${idx + 1}</td>
              <td class="c-name">${escapeHtml(m.name)}</td>
              <td class="c-info">${extraCol}</td>
              <td class="c-chk">☐</td>
              <td class="c-chk">☐</td>
              <td class="c-chk">☐</td>
            </tr>
          `;
        })
        .join('');

      return `
        <div class="grp-card ${isBooth ? 'grp-booth' : 'grp-hall'}">
          <div class="grp-head">
            <div class="grp-title">
              <span class="grp-badge">${escapeHtml(grp.code)}</span>
              <strong>${escapeHtml(grp.title)}</strong>
              <span class="grp-count">(${grp.members.length} أطفال)</span>
            </div>
            <div class="grp-meta">${escapeHtml(grp.rangeLabel)}</div>
          </div>
          <div class="grp-sup-bar">
            <span><strong>المشرف / المتطوع المسؤول:</strong> ${supDisplay}</span>
            <span><strong>الهاتف:</strong> ${phoneDisplay}</span>
          </div>
          <div class="grp-zone-bar">
            <span><strong>موقع الجلوس في القاعة:</strong> ${escapeHtml(grp.hallZone)}</span>
            ${
              isBooth
                ? '<span class="pull-alert">⏱ إشارة السحب للقاعة: 3:20 عصراً (وقت جولة المتحف)</span>'
                : '<span class="hall-note">⏱ التوجه للقاعة: 3:06 عصراً (مباشرة بعد الصورة)</span>'
            }
          </div>
          <table class="grp-table">
            <thead>
              <tr>
                <th style="width:24px">#</th>
                <th style="text-align:right">اسم الطفل</th>
                <th style="text-align:right">${isBooth ? 'البوث / المشروع' : 'المجموعة / المسار'}</th>
                <th style="width:36px">صورة</th>
                <th style="width:36px">${isBooth ? 'بوث' : 'قاعة'}</th>
                <th style="width:36px">${isBooth ? 'قاعة' : 'تكريم'}</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    })
    .join('');
}

export function openFieldOperationsPrintWindow(planData, meta = {}, options = {}) {
  const { directPrint = false, section = 'all' } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const patronage = escapeHtml(meta.patronage || 'برعاية فخامة رئيس الجمهورية');
  const dateFull = escapeHtml(meta.dateFull || 'يوم الجمعة الموافق 27/11/2026');
  const venueFull = escapeHtml(meta.venueFull || 'قصر الثقافة – النجف الأشرف');

  const matrixRowsHtml = OPERATIONAL_TIMELINE_MATRIX.map(
    (row, idx) => `
      <tr class="${idx === 2 || idx === 5 ? 'row-key' : ''}">
        <td class="m-time"><span dir="ltr" style="display:inline-block">${escapeHtml(row.time)}</span></td>
        <td class="m-stage">${escapeHtml(row.stage)}</td>
        <td>${escapeHtml(row.vipFlow)}</td>
        <td>${escapeHtml(row.boothKidsFlow)}</td>
        <td>${escapeHtml(row.hallKidsFlow)}</td>
        <td>${escapeHtml(row.securityFlow)}</td>
      </tr>
    `
  ).join('');

  const securityItemsHtml = BOOTH_SECURITY_PROTOCOL.map(
    (item, idx) => `
      <li><strong>${idx + 1}. ${escapeHtml(item.title)}:</strong> ${escapeHtml(item.detail)}</li>
    `
  ).join('');

  const boothSectionHtml =
    section === 'all' || section === 'booths'
      ? `
        <div class="page-break"></div>
        <div class="section-banner banner-orange">
          <span>المسار (أ) — كشف مجموعات أصحاب البوثات (${planData.boothKidsCount} طفلاً في ${planData.boothGroups.length} مجموعة • كل ${planData.boothGroupSize} أطفال مع متابع)</span>
          <span>إشارة السحب للقاعة: 3:20 عصراً أثناء جولة المتحف</span>
        </div>
        <div class="cards-grid">
          ${renderGroupCardsHtml(planData.boothGroups, true)}
        </div>
      `
      : '';

  const hallSectionHtml =
    section === 'all' || section === 'hall'
      ? `
        <div class="page-break"></div>
        <div class="section-banner banner-indigo">
          <span>المسار (ب) — كشف مجموعات أطفال القاعة (${planData.hallKidsCount} طفلاً في ${planData.hallGroups.length} مجموعة • كل ${planData.hallGroupSize} أطفال مع متابع)</span>
          <span>التوجه مباشرة للقاعة بعد الصورة: 3:06 عصراً</span>
        </div>
        <div class="cards-grid">
          ${renderGroupCardsHtml(planData.hallGroups, false)}
        </div>
      `
      : '';

  const sectionLabel =
    section === 'booths'
      ? 'خطة أصحاب البوثات والحراسة فقط'
      : section === 'hall'
        ? 'خطة مجموعات أطفال القاعة فقط'
        : 'الخطة التشغيلية الكاملة (البوثات + القاعة + الحراسة)';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>الخطة التشغيلية الميدانية وتوزيع المتطوعين — مبادرة 1001 طفل رقمي</title>
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
      margin: 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 14px;
      background: #e2e8f0;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      background: #001c6b;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 14px;
    }
    .btn-print {
      background: linear-gradient(135deg, #ff7300, #ffb800);
      color: #0f172a;
      border: none;
      padding: 9px 22px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-close {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 9px 16px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .doc-container {
      width: 194mm;
      background: #ffffff;
      border: 2px solid #001c6b;
      border-radius: 12px;
      padding: 12px 14px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
    }
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #ff7300;
      margin-bottom: 10px;
    }
    .doc-header img {
      max-height: 40px;
      max-width: 120px;
      object-fit: contain;
    }
    .doc-title-wrap {
      text-align: center;
      flex: 1;
    }
    .doc-kicker {
      display: inline-block;
      background: #001c6b;
      color: #ffe066;
      padding: 2px 12px;
      border-radius: 99px;
      font-size: 9.5px;
      font-weight: 700;
      margin-bottom: 3px;
    }
    .doc-title {
      margin: 0;
      font-size: 15.5px;
      font-weight: 700;
      color: #001c6b;
    }
    .doc-sub {
      font-size: 9.5px;
      color: #475569;
      margin-top: 2px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }
    .kpi-card {
      border: 1.4px solid #cbd5e1;
      border-top: 3px solid #0038a8;
      border-radius: 8px;
      padding: 6px 8px;
      text-align: center;
      background: #f8fafc;
    }
    .kpi-card.orange {
      border-top-color: #ff7300;
      background: #fff7ed;
    }
    .kpi-num {
      font-size: 16px;
      font-weight: 700;
      color: #001c6b;
    }
    .kpi-lbl {
      font-size: 8.8px;
      font-weight: 700;
      color: #334155;
    }
    .sub-heading {
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      background: #001c6b;
      padding: 4px 10px;
      border-radius: 6px;
      margin: 8px 0 6px;
    }
    table.matrix {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5px;
      margin-bottom: 10px;
    }
    table.matrix th {
      background: #0f172a;
      color: #ffffff;
      padding: 4.5px 5px;
      border: 1px solid #0f172a;
      text-align: right;
    }
    table.matrix td {
      padding: 4px 5px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      line-height: 1.35;
    }
    table.matrix tr.row-key td {
      background: #fff7ed;
    }
    .m-time {
      font-weight: 700;
      color: #0038a8;
      white-space: nowrap;
      width: 72px;
      text-align: center;
    }
    .m-stage {
      font-weight: 700;
      color: #0f172a;
      width: 96px;
    }
    .security-box {
      border: 1.6px solid #ff7300;
      background: #fffaf5;
      border-radius: 9px;
      padding: 8px 11px;
      margin-bottom: 10px;
    }
    .security-box h3 {
      margin: 0 0 5px;
      font-size: 11px;
      color: #9a3412;
    }
    .security-box ul {
      margin: 0;
      padding: 0 15px 0 0;
      font-size: 8.8px;
      line-height: 1.48;
      color: #1e293b;
    }
    .security-box li {
      margin-bottom: 3px;
    }
    .guards-sign-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.8px;
      margin-top: 6px;
    }
    .guards-sign-table th,
    .guards-sign-table td {
      border: 1px solid #cbd5e1;
      padding: 4.5px 7px;
      text-align: right;
    }
    .guards-sign-table th {
      background: #f1f5f9;
      color: #001c6b;
    }
    .section-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 12px;
      border-radius: 8px;
      color: #ffffff;
      font-size: 10.2px;
      font-weight: 700;
      margin-bottom: 9px;
    }
    .banner-orange {
      background: linear-gradient(90deg, #9a3412, #ea580c, #001c6b);
    }
    .banner-indigo {
      background: linear-gradient(90deg, #001c6b, #0038a8, #001c6b);
    }
    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .grp-card {
      border: 1.5px solid #cbd5e1;
      border-radius: 9px;
      overflow: hidden;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .grp-booth {
      border-color: #fdba74;
    }
    .grp-hall {
      border-color: #93c5fd;
    }
    .grp-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      font-size: 10px;
      color: #ffffff;
    }
    .grp-booth .grp-head {
      background: linear-gradient(90deg, #001c6b, #ea580c);
    }
    .grp-hall .grp-head {
      background: linear-gradient(90deg, #001c6b, #0038a8);
    }
    .grp-badge {
      display: inline-block;
      background: #ffe066;
      color: #0f172a;
      padding: 1px 7px;
      border-radius: 99px;
      font-size: 9px;
      font-weight: 700;
      margin-left: 6px;
    }
    .grp-count {
      font-size: 9px;
      opacity: 0.9;
      margin-right: 4px;
    }
    .grp-meta {
      font-size: 9.2px;
      font-weight: 700;
      color: #fef3c7;
    }
    .grp-sup-bar,
    .grp-zone-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      padding: 4px 10px;
      font-size: 9px;
      border-bottom: 1px solid #e2e8f0;
    }
    .grp-sup-bar {
      background: #f8fafc;
    }
    .grp-zone-bar {
      background: #ffffff;
      color: #334155;
    }
    .pull-alert {
      color: #c2410c;
      font-weight: 700;
    }
    .hall-note {
      color: #0038a8;
      font-weight: 700;
    }
    .blank-line {
      color: #94a3b8;
    }
    .blank-line-sm {
      color: #94a3b8;
    }
    table.grp-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    table.grp-table th {
      background: #f1f5f9;
      color: #0f172a;
      padding: 3.5px 6px;
      border-bottom: 1px solid #cbd5e1;
      border-left: 1px solid #e2e8f0;
    }
    table.grp-table td {
      padding: 3.5px 6px;
      border-top: 1px solid #e2e8f0;
      border-left: 1px solid #e2e8f0;
    }
    .c-num {
      text-align: center;
      font-weight: 700;
      color: #0038a8;
    }
    .c-name {
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
    }
    .c-info {
      color: #334155;
      font-size: 8.5px;
    }
    .booth-tag {
      display: inline-block;
      background: #ffedd5;
      color: #9a3412;
      border: 1px solid #fdba74;
      padding: 0 5px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 8px;
      margin-left: 4px;
    }
    .c-chk {
      text-align: center;
      font-size: 12px;
      color: #475569;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
      height: 1px;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .toolbar {
        display: none !important;
      }
      .doc-container {
        width: 100%;
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة الخطة التشغيلية وكشوف المتطوعين (A4 / PDF)</button>
    <button class="btn-close" onclick="window.close()">إغلاق</button>
  </div>

  <div class="doc-container">
    <div class="doc-header">
      <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
      <div class="doc-title-wrap">
        <div class="doc-kicker">★ ${patronage} — ${sectionLabel} ★</div>
        <h1 class="doc-title">الخطة التشغيلية الميدانية وتوزيع المتطوعين (كل ${planData.boothGroupSize} أطفال / متابع)</h1>
        <div class="doc-sub">${dateFull} • ${venueFull} • وصول فخامة الرئيس: 3:00 عصراً ← بدء القاعة: 3:30 عصراً</div>
      </div>
      <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" />
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-num">${planData.totalKids}</div>
        <div class="kpi-lbl">إجمالي الأطفال الخريجين</div>
      </div>
      <div class="kpi-card orange">
        <div class="kpi-num">${planData.boothKidsCount} طفلاً / ${planData.boothGroups.length} مجموعة</div>
        <div class="kpi-lbl">أصحاب البوثات (كل ${planData.boothGroupSize} مع متابع)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num">${planData.hallKidsCount} طفلاً / ${planData.hallGroups.length} مجموعة</div>
        <div class="kpi-lbl">أطفال القاعة (كل ${planData.hallGroupSize} مع متابع)</div>
      </div>
      <div class="kpi-card orange">
        <div class="kpi-num">${planData.boothSecurityCount} متطوعين</div>
        <div class="kpi-lbl">فريق تأمين وحراسة البوثات</div>
      </div>
    </div>

    <div class="sub-heading">1. جدول التزامن الميداني المتوازي (الوفد الرئاسي × أصحاب البوثات × أطفال القاعة × الحراسة)</div>
    <table class="matrix">
      <thead>
        <tr>
          <th style="text-align:center">الوقت</th>
          <th>المرحلة</th>
          <th>الوفد الرئاسي</th>
          <th>أصحاب البوثات (كل 5/متابع)</th>
          <th>أطفال القاعة (كل ${planData.hallGroupSize}/متابع)</th>
          <th>فريق حراسة البوثات</th>
        </tr>
      </thead>
      <tbody>${matrixRowsHtml}</tbody>
    </table>

    <div class="security-box">
      <h3>2. بروتوكول تجهيز وحراسة البوثات وتأمين الأجهزة (مهم جداً قبل الصورة وأثناء الحفل)</h3>
      <ul>${securityItemsHtml}</ul>
      <table class="guards-sign-table">
        <thead>
          <tr>
            <th style="width:160px">المهمة الميدانية</th>
            <th>اسم المتطوع / المسؤول</th>
            <th style="width:120px">رقم الهاتف</th>
            <th style="width:90px">التوقيع</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>المنسق الميداني العام (إشارة السحب 3:20)</td><td></td><td></td><td></td></tr>
          <tr><td>حراسة وتأمين صالة البوثات — مناوب (1)</td><td></td><td></td><td></td></tr>
          <tr><td>حراسة وتأمين صالة البوثات — مناوب (2)</td><td></td><td></td><td></td></tr>
          <tr><td>حراسة وتأمين صالة البوثات — مناوب (3)</td><td></td><td></td><td></td></tr>
          <tr><td>تنظيم صفوف «أبطال المعرض» داخل القاعة</td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>

    ${boothSectionHtml}
    ${hallSectionHtml}
  </div>
</body>
</html>`;

  if (directPrint) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  const win = window.open('', '_blank', 'width=1020,height=1100');
  if (!win) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
}
