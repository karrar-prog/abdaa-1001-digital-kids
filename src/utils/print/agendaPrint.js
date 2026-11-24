import { escapeHtml } from './printHelpers';

function printHtmlViaHiddenIframe(html) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('abdaa-agenda-print-iframe');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'abdaa-agenda-print-iframe';
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

export function openOfficialAgendaPrintWindow(agendaItems = [], phases = [], meta = {}, options = {}) {
  const { directPrint = false } = options;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const patronage = escapeHtml(meta.patronage || 'برعاية فخامة رئيس الجمهورية');
  const forumTitle = escapeHtml(meta.forumTitle || 'ملتقى النجف للابتكار الرقمي');
  const programTitle = escapeHtml(meta.programTitle || 'منهاج حفلة تخرج 1001 طفل رقمي');
  const dateFull = escapeHtml(meta.dateFull || 'يوم الجمعة الموافق 27/11/2026');
  const venueFull = escapeHtml(meta.venueFull || 'رحاب قصر الثقافة – النجف الأشرف');
  const startTime = escapeHtml(meta.startTime || '3:00 عصراً');
  const arrivalLabel = escapeHtml(meta.arrivalLabel || 'استقبال العوائل وتجهيز البوثات واصطفاف الأطفال: 2:00 – 3:00 ظهراً');
  const endTime = escapeHtml(meta.endTime || '5:45 عصراً');
  const totalDuration = escapeHtml(meta.totalDuration || 'ساعتان و45 دقيقة');
  const organizers = escapeHtml(
    meta.organizers || 'المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات'
  );
  const founderName = escapeHtml(meta.founderName || 'الأستاذ فراس نزار كريم');
  const founderRole = escapeHtml(meta.founderRole || 'مؤسس نادي أبدع ومبادرة 1001 طفل رقمي');
  const partnerName = escapeHtml(meta.partnerName || 'الأستاذ كرار حساني');
  const partnerRole = escapeHtml(meta.partnerRole || 'الشريك المنظم والمدير التنفيذي لشركة المصدر');

  // Group items by phase (preserving custom/unassigned items safely)
  const knownPhaseIds = new Set(phases.map((p) => p.id));
  const groupedSections = phases
    .map((phase) => ({
      phase,
      items: agendaItems.filter((item) => item.phaseId === phase.id)
    }))
    .filter((g) => g.items.length > 0);

  const extraItems = agendaItems.filter((item) => !item.phaseId || !knownPhaseIds.has(item.phaseId));
  if (extraItems.length > 0) {
    groupedSections.push({
      phase: {
        label: 'فقرات إضافية',
        title: 'ضمن منهاج الحفل',
        durationLabel: ''
      },
      items: extraItems
    });
  }

  let seq = 1;
  const rowsHtml = groupedSections
    .map(({ phase, items }) => {
      const phaseTitleText = phase.durationLabel
        ? `${escapeHtml(phase.label)} (${escapeHtml(phase.title)}) – ${escapeHtml(phase.durationLabel)}`
        : `${escapeHtml(phase.label)} (${escapeHtml(phase.title)})`;

      const itemsHtml = items
        .map((item) => {
          const idx = seq++;
          const safeTitle = escapeHtml(item.title || '');
          const safeSpeaker = escapeHtml(item.speaker || item.description || '');
          const safeDuration = escapeHtml(item.duration || '—');
          const safeTime = escapeHtml(item.time || '');
          const isHighlight = Boolean(item.highlight || item.vip);
          return `
            <tr class="${isHighlight ? 'row-highlight' : ''}">
              <td class="col-seq">${idx}</td>
              <td class="col-item">
                <div class="item-title">${safeTitle}</div>
                ${safeSpeaker && safeSpeaker !== safeTitle ? `<div class="item-sub">${safeSpeaker}</div>` : ''}
              </td>
              <td class="col-duration">${safeDuration}</td>
              <td class="col-time"><span dir="ltr" style="display:inline-block">${safeTime}</span></td>
            </tr>
          `;
        })
        .join('');

      return `
        <tr class="phase-row">
          <td colspan="4">${phaseTitleText}</td>
        </tr>
        ${itemsHtml}
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${programTitle} — ${patronage}</title>
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
    @page {
      size: A4 portrait;
      margin: 6mm;
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
      background: #082046;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
    }
    .btn-print {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
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
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 9px 16px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .sheet {
      width: 198mm;
      background: #ffffff;
      border: 2.5px solid #082046;
      border-radius: 12px;
      padding: 8px 10px 10px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
      position: relative;
    }
    .sheet-inner {
      border: 1.5px solid #d97706;
      border-radius: 8px;
      padding: 9px 11px;
    }
    .patronage-banner {
      background: linear-gradient(90deg, #082046, #0f3a7a, #082046);
      color: #fde68a;
      border: 1.5px solid #f59e0b;
      border-radius: 8px;
      text-align: center;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      margin-bottom: 8px;
    }
    .logos-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-bottom: 7px;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .logo-box {
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-box img {
      max-height: 44px;
      max-width: 140px;
      object-fit: contain;
    }
    .title-block {
      text-align: center;
      flex: 1;
    }
    .forum-kicker {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 1.5px 10px;
      border-radius: 99px;
      margin-bottom: 3px;
    }
    .main-title {
      margin: 0;
      font-size: 16.5px;
      font-weight: 700;
      color: #082046;
      line-height: 1.25;
    }
    .meta-lines {
      text-align: center;
      margin: 6px 0 7px;
      font-size: 10.2px;
      line-height: 1.5;
      color: #334155;
    }
    .meta-lines strong {
      color: #082046;
    }
    .arrival-bar {
      background: linear-gradient(90deg, #082046, #0e4180, #082046);
      color: #fef3c7;
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      padding: 4.5px 10px;
      border-radius: 7px;
      margin-bottom: 6px;
      border: 1px solid #f59e0b;
    }
    table.agenda-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    table.agenda-table thead th {
      background: #0f172a;
      color: #ffffff;
      padding: 5px 8px;
      font-weight: 700;
      border: 1px solid #0f172a;
    }
    table.agenda-table thead th.col-seq-h {
      width: 28px;
      text-align: center;
    }
    table.agenda-table thead th.col-item-h {
      text-align: right;
    }
    table.agenda-table thead th.col-dur-h {
      text-align: center;
      width: 68px;
    }
    table.agenda-table thead th.col-time-h {
      text-align: center;
      width: 86px;
    }
    tr.phase-row td {
      background: #e0f2fe;
      color: #082046;
      font-weight: 700;
      font-size: 10px;
      padding: 3px 8px;
      border: 1px solid #bae6fd;
      text-align: right;
    }
    table.agenda-table tbody td {
      padding: 2.2px 7px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    tr.row-highlight td {
      background: #fffbeb;
    }
    .col-seq {
      text-align: center;
      font-weight: 700;
      color: #0369a1;
      font-size: 9.4px;
    }
    .item-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 9.8px;
      line-height: 1.2;
    }
    .item-sub {
      font-size: 8.4px;
      color: #475569;
      margin-top: 0.5px;
      line-height: 1.2;
    }
    .col-duration {
      text-align: center;
      font-weight: 700;
      color: #0369a1;
      white-space: nowrap;
    }
    .col-time {
      text-align: center;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
    }
    .closing-footer {
      margin-top: 6px;
      padding: 5px 10px;
      background: #f8fafc;
      border: 1.5px dashed #94a3b8;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      color: #082046;
    }
    .closing-footer .gold {
      color: #b45309;
    }
    .leadership-strip {
      margin-top: 6px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .leader-card {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #cbd5e1;
      border-top: 2.5px solid #082046;
      border-radius: 7px;
      padding: 5px 10px;
      text-align: center;
    }
    .leader-name {
      font-size: 10.6px;
      font-weight: 700;
      color: #082046;
      line-height: 1.3;
    }
    .leader-role {
      font-size: 9.2px;
      font-weight: 700;
      color: #b45309;
      margin-top: 1.5px;
      line-height: 1.3;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .toolbar {
        display: none !important;
      }
      .sheet {
        box-shadow: none;
        width: 100%;
      }
      tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة المنهاج الرسمي / حفظ PDF (A4)</button>
    <button class="btn-close" onclick="window.close()">إغلاق</button>
  </div>

  <div class="sheet">
    <div class="sheet-inner">
      <div class="patronage-banner">★ ${patronage} ★</div>

      <div class="logos-header">
        <div class="logo-box">
          <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع للمهارات الذكية" />
        </div>
        <div class="title-block">
          <img src="${origin}/brand/logo-1001-kids.png" alt="شعار مبادرة 1001 طفل رقمي" style="height:40px;width:auto;display:block;margin:0 auto 3px" />
          <div class="forum-kicker">${forumTitle}</div>
          <h1 class="main-title">${programTitle}</h1>
        </div>
        <div class="logo-box">
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر لتكنولوجيا المعلومات" style="max-height:34px" />
        </div>
      </div>

      <div class="meta-lines">
        <div>المقام <strong>${dateFull}</strong> في <strong>${venueFull}</strong> • تبدأ فعاليات الحفل الساعة <strong>${startTime}</strong></div>
        <div><strong>${organizers}</strong></div>
      </div>

      <div class="arrival-bar">${arrivalLabel}</div>

      <table class="agenda-table">
        <thead>
          <tr>
            <th class="col-seq-h">#</th>
            <th class="col-item-h">الفقرة</th>
            <th class="col-dur-h">المدة</th>
            <th class="col-time-h">الوقت</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="closing-footer">
        <span>وقت انتهاء الحفل: <span class="gold">${endTime}</span></span>
        <span>المدة الإجمالية: <span class="gold">${totalDuration} (${agendaItems.length} فقرة)</span></span>
        <span>— اختتام الحفل —</span>
      </div>

      <div class="leadership-strip">
        <div class="leader-card">
          <div class="leader-name">${founderName}</div>
          <div class="leader-role">${founderRole}</div>
        </div>
        <div class="leader-card">
          <div class="leader-name">${partnerName}</div>
          <div class="leader-role">${partnerRole}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (directPrint) {
    printHtmlViaHiddenIframe(html);
    return;
  }

  const win = window.open('', '_blank', 'width=980,height=1100');
  if (!win) {
    // Popup blocked on mobile/Safari -> seamlessly print formatted A4 via isolated hidden iframe!
    printHtmlViaHiddenIframe(html);
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
}
