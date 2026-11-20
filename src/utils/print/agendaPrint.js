import { escapeHtml } from './printHelpers';

export function openOfficialAgendaPrintWindow(agendaItems = [], phases = [], meta = {}) {
  const win = window.open('', '_blank', 'width=960,height=1100');
  if (!win) {
    window.print();
    return;
  }

  const origin = window.location.origin;
  const forumTitle = escapeHtml(meta.forumTitle || 'ملتقى النجف للابتكار الرقمي');
  const programTitle = escapeHtml(meta.programTitle || 'منهاج حفلة تخرج 1001 طفل رقمي');
  const dateFull = escapeHtml(meta.dateFull || 'يوم الجمعة الموافق 27/11/2026');
  const venueFull = escapeHtml(meta.venueFull || 'رحاب قصر الثقافة – النجف الأشرف');
  const startTime = escapeHtml(meta.startTime || '3:00 عصراً');
  const arrivalLabel = escapeHtml(meta.arrivalLabel || 'الوصول والترحيب: الساعة 2:00 ظهراً');
  const endTime = escapeHtml(meta.endTime || '4:55 عصراً');
  const totalDuration = escapeHtml(meta.totalDuration || 'ساعة و55 دقيقة');
  const organizers = escapeHtml(meta.organizers || 'شركة مصدر لتطوير البرمجيات • نادي أبدع للمهارات الذكية');

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

  const rowsHtml = groupedSections
    .map(({ phase, items }) => {
      const phaseTitleText = phase.durationLabel
        ? `${escapeHtml(phase.label)} (${escapeHtml(phase.title)}) – ${escapeHtml(phase.durationLabel)}`
        : `${escapeHtml(phase.label)} (${escapeHtml(phase.title)})`;

      const itemsHtml = items
        .map((item) => {
          const safeTitle = escapeHtml(item.title || '');
          const safeSpeaker = escapeHtml(item.speaker || item.description || '');
          const safeDuration = escapeHtml(item.duration || '—');
          const safeTime = escapeHtml(item.time || '');
          const isHighlight = Boolean(item.highlight || item.vip);
          return `
            <tr class="${isHighlight ? 'row-highlight' : ''}">
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
          <td colspan="3">${phaseTitleText}</td>
        </tr>
        ${itemsHtml}
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${programTitle} — ${forumTitle}</title>
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
      margin: 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 16px;
      background: #e2e8f0;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .toolbar {
      display: flex;
      gap: 10px;
      background: #ffffff;
      padding: 10px 18px;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    }
    .btn-print {
      background: linear-gradient(135deg, #082046, #0284c7);
      color: #ffffff;
      border: none;
      padding: 9px 22px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-close {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      padding: 9px 16px;
      border-radius: 10px;
      font-family: "PNU", sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .sheet {
      width: 194mm;
      background: #ffffff;
      border: 2.5px solid #082046;
      border-radius: 14px;
      padding: 12px 16px 14px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
      position: relative;
    }
    .sheet-inner {
      border: 1.5px solid #d97706;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .logos-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .logo-box {
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-box img {
      max-height: 52px;
      max-width: 155px;
      object-fit: contain;
    }
    .title-block {
      text-align: center;
      flex: 1;
    }
    .forum-kicker {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 2px 12px;
      border-radius: 99px;
      margin-bottom: 4px;
    }
    .main-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #082046;
      line-height: 1.3;
    }
    .meta-lines {
      text-align: center;
      margin: 8px 0 10px;
      font-size: 11px;
      line-height: 1.65;
      color: #334155;
    }
    .meta-lines strong {
      color: #082046;
    }
    .arrival-bar {
      background: linear-gradient(90deg, #082046, #0e4180, #082046);
      color: #fef3c7;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid #f59e0b;
    }
    table.agenda-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    table.agenda-table thead th {
      background: #0f172a;
      color: #ffffff;
      padding: 7px 10px;
      font-weight: 700;
      border: 1px solid #0f172a;
    }
    table.agenda-table thead th:first-child {
      text-align: right;
    }
    table.agenda-table thead th:not(:first-child) {
      text-align: center;
      width: 78px;
    }
    table.agenda-table thead th:last-child {
      width: 96px;
    }
    tr.phase-row td {
      background: #e0f2fe;
      color: #082046;
      font-weight: 700;
      font-size: 11.5px;
      padding: 5.5px 10px;
      border: 1px solid #bae6fd;
      text-align: right;
    }
    table.agenda-table tbody td {
      padding: 5px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    tr.row-highlight td {
      background: #fffbeb;
    }
    .item-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 11px;
      line-height: 1.35;
    }
    .item-sub {
      font-size: 9.8px;
      color: #475569;
      margin-top: 1px;
      line-height: 1.35;
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
      margin-top: 10px;
      padding: 7px 12px;
      background: #f8fafc;
      border: 1.5px dashed #94a3b8;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
      color: #082046;
    }
    .closing-footer .gold {
      color: #b45309;
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
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة المنهاج الرسمي (A4)</button>
    <button class="btn-close" onclick="window.close()">إغلاق</button>
  </div>

  <div class="sheet">
    <div class="sheet-inner">
      <div class="logos-header">
        <div class="logo-box">
          <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع للمهارات الذكية" />
        </div>
        <div class="title-block">
          <img src="${origin}/brand/logo-1001-kids.png" alt="شعار مبادرة 1001 طفل رقمي" style="height:46px;width:auto;display:block;margin:0 auto 4px" />
          <div class="forum-kicker">${forumTitle}</div>
          <h1 class="main-title">${programTitle}</h1>
        </div>
        <div class="logo-box">
          <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة مصدر لتكنولوجيا المعلومات وتطوير البرمجيات" style="max-height:40px" />
        </div>
      </div>

      <div class="meta-lines">
        <div>المقام <strong>${dateFull}</strong> في <strong>${venueFull}</strong> • تبدأ فعاليات الحفل الساعة <strong>${startTime}</strong></div>
        <div>الجهات المنظمة: <strong>${organizers}</strong></div>
      </div>

      <div class="arrival-bar">${arrivalLabel}</div>

      <table class="agenda-table">
        <thead>
          <tr>
            <th>الفقرة</th>
            <th>المدة</th>
            <th>الوقت</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="closing-footer">
        <span>وقت انتهاء الحفل: <span class="gold">${endTime}</span></span>
        <span>المدة الإجمالية للحفل: <span class="gold">${totalDuration}</span></span>
        <span>— اختتام الحفل —</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
