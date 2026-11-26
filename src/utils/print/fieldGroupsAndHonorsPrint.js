// محرك الطباعة الرسمية (A4) لمجموعات المشرفين (كل 7 أطفال)، قائمة الأطفال وعوائلهم، وتسلسل التكريمات على المسرح
import { escapeHtml } from './printHelpers';

function openPrintPopup(html, fallbackAlert) {
  const win = window.open('', '_blank', 'width=1060,height=920');
  if (!win) {
    alert(fallbackAlert || 'يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الكشف الرسمي.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function buildBaseStyles(origin) {
  return `
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
    @page { size: A4 portrait; margin: 9mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0;
      padding: 14px;
      background: #e2e8f0;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      color: #0f172a;
    }
    .toolbar {
      max-width: 210mm;
      margin: 0 auto 14px;
      background: #082046;
      color: #fff;
      padding: 11px 18px;
      border-radius: 14px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
    }
    .toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      color: #0f172a;
      border: none;
      border-radius: 10px;
      padding: 9px 18px;
      font-family: inherit;
      font-weight: 700;
      font-size: 12.5px;
      cursor: pointer;
    }
    .btn-ghost {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 10px;
      padding: 9px 14px;
      font-family: inherit;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
    }
    .sheet {
      max-width: 210mm;
      margin: 0 auto 16px;
      background: #ffffff;
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.09);
    }
    .sheet.page-break {
      page-break-after: always;
      break-after: page;
    }
    .sheet.page-break:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .patronage {
      background: linear-gradient(90deg, #082046, #0f3a7a, #082046);
      color: #fde68a;
      border: 1.5px solid #f59e0b;
      border-radius: 8px;
      text-align: center;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-bottom: 2.5px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .doc-header img.logo-abdaa { height: 40px; width: auto; object-fit: contain; }
    .doc-header img.logo-1001 { height: 42px; width: auto; object-fit: contain; }
    .doc-header img.logo-masdar { height: 24px; width: auto; object-fit: contain; }
    .header-logos-left { display: flex; align-items: center; gap: 8px; }
    .header-center { text-align: center; flex: 1; }
    .header-center h1 { margin: 0; font-size: 16.5px; color: #082046; }
    .header-center p { margin: 3px 0 0; font-size: 10.8px; color: #475569; font-weight: 700; }
    .summary-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .summary-pill {
      flex: 1;
      min-width: 120px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-right: 4px solid #0284c7;
      border-radius: 9px;
      padding: 6px 10px;
      font-size: 11px;
    }
    .summary-pill strong { display: block; font-size: 14px; color: #082046; }
    .group-card {
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 14px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .group-head {
      background: linear-gradient(90deg, #082046, #0f3a7a);
      color: #ffffff;
      padding: 8px 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .group-head.gold-head {
      background: linear-gradient(90deg, #082046, #1d4ed8, #082046);
      border-bottom: 2.5px solid #f59e0b;
    }
    .group-title { font-size: 13.5px; font-weight: 700; color: #fde68a; }
    .group-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 11px;
      color: #e0f2fe;
      font-weight: 700;
    }
    .meta-badge {
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 99px;
      padding: 2px 10px;
      color: #fff;
    }
    .meta-badge.gold {
      background: #f59e0b;
      border-color: #fbbf24;
      color: #082046;
    }
    .note-bar {
      background: #fffbeb;
      border-bottom: 1px solid #fde68a;
      color: #92400e;
      padding: 5px 12px;
      font-size: 11px;
      font-weight: 700;
    }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    thead th {
      background: #f1f5f9;
      color: #082046;
      padding: 7px 6px;
      border: 1px solid #cbd5e1;
      font-weight: 700;
      text-align: right;
    }
    thead.dark-th th {
      background: #082046;
      color: #ffffff;
      border-color: #082046;
    }
    tbody td {
      padding: 6px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .c-center { text-align: center; }
    .c-num { width: 32px; text-align: center; font-weight: 700; color: #0284c7; }
    .c-name { font-weight: 700; color: #0f172a; font-size: 12px; }
    .c-code { width: 88px; font-family: monospace; font-weight: 700; color: #0369a1; text-align: center; font-size: 10.5px; }
    .c-check { width: 52px; text-align: center; font-size: 14px; color: #94a3b8; }
    .c-sign { width: 78px; }
    .c-phone { width: 96px; font-family: monospace; font-weight: 700; direction: ltr; text-align: center; font-size: 10.5px; }
    .footer {
      margin-top: 12px;
      padding-top: 7px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #475569;
      font-weight: 700;
    }
    .supervisor-sign-box {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .sign-item {
      border: 1px dashed #94a3b8;
      border-radius: 10px;
      padding: 8px 10px;
      text-align: center;
      font-size: 11px;
      background: #f8fafc;
    }
    .sign-item strong { display: block; color: #082046; margin-bottom: 18px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; padding: 0; max-width: none; margin: 0; border-radius: 0; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  `;
}

function buildDocHeader(origin, title, subtitle) {
  return `
    <div class="patronage">★ برعاية وحضور فخامة رئيس جمهورية العراق • مبادرة «1001» طفل رقمي ★</div>
    <div class="doc-header">
      <img src="${origin}/brand/abdaa-logo.png" class="logo-abdaa" alt="نادي أبدع" />
      <div class="header-center">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="header-logos-left">
        <img src="${origin}/brand/logo-1001-kids.png" class="logo-1001" alt="1001 طفل رقمي" />
        <img src="${origin}/brand/masdar-logo-full-clean.png" class="logo-masdar" alt="شركة المصدر" />
      </div>
    </div>
  `;
}

/**
 * 1. طباعة قائمة مجموعات المشرفين (كل 7 أطفال مع مشرف مباشر)
 * mode: 'combined' (قائمة واحدة كاملة) | 'per_page' (ورقة مستقلة لكل مشرف)
 */
export function openSupervisorGroupsPrintWindow(groups = [], graduatesById = {}, options = {}) {
  const { mode = 'combined', title = 'كشف توزيع الأطفال على المشرفين المباشرين' } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const totalKids = groups.reduce((sum, g) => sum + (g.studentIds?.length || 0), 0);

  const renderGroupCard = (g, idx, isStandalonePage = false) => {
    const members = (g.studentIds || []).map((sid) => graduatesById[sid]).filter(Boolean);
    const rowsHtml =
      members.length === 0
        ? `<tr><td colspan="6" class="c-center" style="padding:14px;color:#64748b">لم يتم تعيين أطفال لهذه المجموعة بعد</td></tr>`
        : members
            .map(
              (m, mIdx) => `
              <tr>
                <td class="c-num">${mIdx + 1}</td>
                <td class="c-name">${escapeHtml(m.name || '')}</td>
                <td class="c-code"><span dir="ltr">${escapeHtml(m.initiativeCode || m.id || '')}</span></td>
                <td>${escapeHtml(m.cohortName || '')}</td>
                <td class="c-check">☐</td>
                <td class="c-sign"></td>
              </tr>
            `
            )
            .join('');

    const cardHtml = `
      <div class="group-card">
        <div class="group-head">
          <div class="group-title">
            ${escapeHtml(g.title || `المجموعة الإشرافية #${idx + 1}`)} (${members.length} أطفال)
          </div>
          <div class="group-meta">
            <span class="meta-badge gold">المشرف المباشر: ${escapeHtml(g.supervisorName || 'غير معيّن')}</span>
            ${g.supervisorPhone ? `<span class="meta-badge" dir="ltr">${escapeHtml(g.supervisorPhone)}</span>` : ''}
            ${g.zone ? `<span class="meta-badge">الموقع: ${escapeHtml(g.zone)}</span>` : ''}
          </div>
        </div>
        ${g.notes ? `<div class="note-bar">ملاحظة تنظيمية: ${escapeHtml(g.notes)}</div>` : ''}
        <table>
          <thead>
            <tr>
              <th class="c-center" style="width:32px">#</th>
              <th>اسم الطفل الخريج</th>
              <th class="c-center" style="width:92px">الكود</th>
              <th>المجموعة التدريبية</th>
              <th class="c-center" style="width:58px">الحضور</th>
              <th class="c-center" style="width:110px">ملاحظات / استلام</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    if (!isStandalonePage) return cardHtml;

    return `
      <div class="sheet page-break">
        ${buildDocHeader(
          origin,
          `بطاقة إشراف ميداني — ${g.title || `مجموعة #${idx + 1}`}`,
          `حفل تخرج الدفعة الأولى • قصر الثقافة – النجف الأشرف • الجمعة 27/11/2026`
        )}
        <div class="summary-strip">
          <div class="summary-pill"><span>المشرف المباشر</span><strong>${escapeHtml(g.supervisorName || 'غير معيّن')}</strong></div>
          <div class="summary-pill"><span>رقم هاتف المشرف</span><strong dir="ltr">${escapeHtml(g.supervisorPhone || '—')}</strong></div>
          <div class="summary-pill"><span>عدد الأطفال المسؤول عنهم</span><strong>${members.length} أطفال</strong></div>
          <div class="summary-pill"><span>موقع الجلوس / التجمع</span><strong>${escapeHtml(g.zone || 'القاعة الرئيسية')}</strong></div>
        </div>
        ${cardHtml}
        <div class="supervisor-sign-box">
          <div class="sign-item"><strong>توقيع المشرف المباشر عند الاستلام</strong>....................</div>
          <div class="sign-item"><strong>تأكيد صعود الأطفال للمسرح</strong>....................</div>
          <div class="sign-item"><strong>تسليم الأطفال لذويهم بسلام</strong>....................</div>
        </div>
        <div class="footer">
          <span>نادي أبدع للمهارات الذكية (المؤسس المنظم) × شركة المصدر (الشريك المنظم)</span>
          <span>ورقة إشراف ${idx + 1} من ${groups.length}</span>
        </div>
      </div>
    `;
  };

  const bodyHtml =
    mode === 'per_page'
      ? groups.map((g, idx) => renderGroupCard(g, idx, true)).join('\n')
      : `
        <div class="sheet">
          ${buildDocHeader(
            origin,
            title,
            `إجمالي المجموعات: ${groups.length} مجموعة إشرافية • إجمالي الأطفال: ${totalKids} طفلاً • قصر الثقافة – النجف الأشرف`
          )}
          <div class="summary-strip">
            <div class="summary-pill"><span>عدد مجموعات الإشراف</span><strong>${groups.length} مجموعة</strong></div>
            <div class="summary-pill"><span>إجمالي الأطفال الموزّعين</span><strong>${totalKids} طفلاً</strong></div>
            <div class="summary-pill"><span>المشرفون المعيّنون</span><strong>${groups.filter((g) => String(g.supervisorName || '').trim()).length} من ${groups.length}</strong></div>
          </div>
          ${groups.map((g, idx) => renderGroupCard(g, idx, false)).join('\n')}
          <div class="footer">
            <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
            <span>الجمعة 27/11/2026</span>
          </div>
        </div>
      `;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} (${groups.length} مجموعة)</title>
  <style>${buildBaseStyles(origin)}</style>
</head>
<body>
  <div class="toolbar">
    <div><strong>${escapeHtml(title)}</strong> — ${groups.length} مجموعة (${totalKids} طفلاً)</div>
    <div class="toolbar-actions">
      <button class="btn" onclick="window.print()">🖨️ طباعة / حفظ PDF (A4)</button>
      <button class="btn-ghost" onclick="window.close()">إغلاق</button>
    </div>
  </div>
  ${bodyHtml}
</body>
</html>`;

  openPrintPopup(html, 'يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة قائمة المشرفين.');
}

/**
 * 2. طباعة قائمة الأطفال المشاركين وعوائلهم (A4)
 */
export function openChildrenFamiliesPrintWindow(rows = [], titleLabel = 'قائمة الأطفال المشاركين وعوائلهم — مبادرة 1001 طفل رقمي') {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const totalCompanions = rows.reduce((sum, r) => sum + (Number(r.companionsCount) || 0), 0);

  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr>
        <td class="c-num">${idx + 1}</td>
        <td class="c-name">${escapeHtml(r.childName || '')}</td>
        <td class="c-code"><span dir="ltr">${escapeHtml(r.code || '')}</span></td>
        <td>
          <strong>${escapeHtml(r.groupTitle || '—')}</strong>
          ${r.supervisorName ? `<div style="font-size:10px;color:#0369a1">المشرف: ${escapeHtml(r.supervisorName)}</div>` : ''}
        </td>
        <td>${escapeHtml(r.guardianName || '')}</td>
        <td class="c-phone">${escapeHtml(r.guardianPhone || '')}</td>
        <td class="c-center" style="width:48px;font-weight:700">${r.companionsCount ? escapeHtml(String(r.companionsCount)) : ''}</td>
        <td class="c-check">☐</td>
      </tr>
    `
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(titleLabel)} (${rows.length})</title>
  <style>${buildBaseStyles(origin)}</style>
</head>
<body>
  <div class="toolbar">
    <div><strong>${escapeHtml(titleLabel)}</strong> — ${rows.length} طفلاً${totalCompanions ? ` • ${totalCompanions} مرافقاً مسجلاً` : ''}</div>
    <div class="toolbar-actions">
      <button class="btn" onclick="window.print()">🖨️ طباعة كشف الأطفال والعوائل (A4)</button>
      <button class="btn-ghost" onclick="window.close()">إغلاق</button>
    </div>
  </div>
  <div class="sheet">
    ${buildDocHeader(
      origin,
      titleLabel,
      `كشف الاستقبال الموحد للأبطال المشاركين وعوائلهم ومشرفيهم • قصر الثقافة – النجف الأشرف • 27/11/2026`
    )}
    <div class="summary-strip">
      <div class="summary-pill"><span>عدد الأطفال المشاركين</span><strong>${rows.length} طفلاً</strong></div>
      <div class="summary-pill"><span>عوائل ببيانات مسجلة</span><strong>${rows.filter((r) => String(r.guardianName || '').trim() || String(r.guardianPhone || '').trim()).length} عائلة</strong></div>
      <div class="summary-pill"><span>إجمالي المرافقين المسجلين</span><strong>${totalCompanions || '—'}</strong></div>
    </div>
    <table>
      <thead class="dark-th">
        <tr>
          <th class="c-center" style="width:32px">#</th>
          <th>اسم الطفل المشارك</th>
          <th class="c-center" style="width:88px">الكود</th>
          <th>مجموعة الإشراف والمشرف</th>
          <th>اسم ولي الأمر / العائلة</th>
          <th class="c-center" style="width:96px">رقم الهاتف</th>
          <th class="c-center" style="width:50px">العائلة</th>
          <th class="c-center" style="width:52px">الحضور</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="footer">
      <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
      <span>الجمعة 27/11/2026</span>
    </div>
  </div>
</body>
</html>`;

  openPrintPopup(html, 'يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة قائمة الأطفال وعوائلهم.');
}

/**
 * تصدير قائمة الأطفال وعوائلهم ومشرفيهم إلى Excel (CSV)
 */
export function exportChildrenFamiliesCsv(rows = []) {
  const headers = [
    '#',
    'اسم الطفل',
    'الكود',
    'المجموعة الإشرافية',
    'المشرف المباشر',
    'هاتف المشرف',
    'اسم ولي الأمر / العائلة',
    'هاتف العائلة',
    'عدد المرافقين',
    'ملاحظات'
  ];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    headers.map(esc).join(','),
    ...rows.map((r, i) =>
      [
        i + 1,
        r.childName || '',
        r.code || '',
        r.groupTitle || '',
        r.supervisorName || '',
        r.supervisorPhone || '',
        r.guardianName || '',
        r.guardianPhone || '',
        r.companionsCount || '',
        r.familyNote || ''
      ]
        .map(esc)
        .join(',')
    )
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `abdaa-1001-children-and-families-${rows.length}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * 3. طباعة تسلسل التكريمات على المسرح (بشكل متسلسل كامل أو صفحة لكل تكريم أو تكريم واحد)
 * mode: 'sequential' (كل التكريمات متسلسلة متتابعة) | 'page_per_batch' (كل تكريم في صفحة A4 مستقلة)
 */
export function openHonoringSequencePrintWindow(batches = [], graduatesById = {}, options = {}) {
  const {
    mode = 'sequential',
    title = 'دليل وتسلسل التكريمات الرسمي على المسرح',
    childSupervisorMap = {}
  } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const totalHonorSlots = batches.reduce((sum, b) => sum + (b.studentIds?.length || 0), 0);

  const renderBatchBlock = (batch, idx, standalonePage = false) => {
    const kids = (batch.studentIds || []).map((sid) => ({ sid, ...graduatesById[sid] })).filter((x) => x.name);
    const rowsHtml =
      kids.length === 0
        ? `<tr><td colspan="6" class="c-center" style="padding:14px;color:#64748b">لم يتم اختيار أطفال لهذا التكريم بعد</td></tr>`
        : kids
            .map(
              (k, kIdx) => {
                const sup = childSupervisorMap[k.sid];
                return `
              <tr>
                <td class="c-num">${kIdx + 1}</td>
                <td class="c-name">${escapeHtml(k.name || '')}</td>
                <td class="c-code"><span dir="ltr">${escapeHtml(k.initiativeCode || k.id || '')}</span></td>
                <td style="font-size:10.5px;color:#0369a1;font-weight:700">${
                  sup
                    ? `${escapeHtml(sup.supervisorName || sup.groupTitle)}${
                        sup.supervisorName && sup.groupTitle ? ` (${escapeHtml(sup.groupTitle)})` : ''
                      }`
                    : '—'
                }</td>
                <td style="font-size:10.5px;color:#334155">${escapeHtml(k.project || k.track || '')}</td>
                <td class="c-check">☐</td>
              </tr>
            `;
              }
            )
            .join('');

    const blockHtml = `
      <div class="group-card">
        <div class="group-head gold-head">
          <div class="group-title">
            التكريم #${idx + 1}: ${escapeHtml(batch.title || `فقرة تكريم #${idx + 1}`)}
          </div>
          <div class="group-meta">
            ${batch.presenterName ? `<span class="meta-badge gold">المُكرِّم: ${escapeHtml(batch.presenterName)}</span>` : ''}
            ${batch.presenterRole ? `<span class="meta-badge">${escapeHtml(batch.presenterRole)}</span>` : ''}
            <span class="meta-badge">عدد الأطفال: ${kids.length}</span>
          </div>
        </div>
        ${batch.notes ? `<div class="note-bar">توجيه عريف الحفل / المراسم: ${escapeHtml(batch.notes)}</div>` : ''}
        <table>
          <thead>
            <tr>
              <th class="c-center" style="width:32px">#</th>
              <th>اسم الطفل المكرَّم (للمناداة على المسرح)</th>
              <th class="c-center" style="width:88px">الكود</th>
              <th style="width:135px">المشرف المتطوع</th>
              <th>المشروع / المسار</th>
              <th class="c-center" style="width:56px">تم التكريم</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    if (!standalonePage) return blockHtml;

    return `
      <div class="sheet page-break">
        ${buildDocHeader(
          origin,
          `التكريم #${idx + 1} — ${batch.title || 'فقرة تكريم رسمية'}`,
          `نسخة عريف الحفل ولجنة المنصة • حفل تخرج الدفعة الأولى «1001 طفل رقمي» • 27/11/2026`
        )}
        <div class="summary-strip">
          <div class="summary-pill"><span>تسلسل الفقرة</span><strong>التكريم رقم ${idx + 1} من ${batches.length}</strong></div>
          <div class="summary-pill"><span>الجهة / الشخصية المُكرِّمة</span><strong>${escapeHtml(batch.presenterName || batch.title || '—')}</strong></div>
          <div class="summary-pill"><span>عدد الأطفال المكرّمين</span><strong>${kids.length} أطفال</strong></div>
        </div>
        ${blockHtml}
        <div class="footer">
          <span>نادي أبدع للمهارات الذكية (المؤسس المنظم) × شركة المصدر (الشريك المنظم)</span>
          <span>فقرة تكريم ${idx + 1} من ${batches.length}</span>
        </div>
      </div>
    `;
  };

  const indexTableHtml =
    batches.length > 1
      ? `
        <div class="group-card" style="margin-bottom:14px">
          <div class="group-head">
            <div class="group-title">فهرس تسلسل فقرات التكريم على المسرح (${batches.length} تكريمات)</div>
            <div class="group-meta"><span class="meta-badge gold">إجمالي مرات التكريم: ${totalHonorSlots}</span></div>
          </div>
          <table>
            <thead>
              <tr>
                <th class="c-center" style="width:42px">التسلسل</th>
                <th>عنوان التكريم</th>
                <th>المُكرِّم / الصفة</th>
                <th class="c-center" style="width:82px">عدد الأطفال</th>
              </tr>
            </thead>
            <tbody>
              ${batches
                .map(
                  (b, i) => `
                  <tr>
                    <td class="c-num">${i + 1}</td>
                    <td class="c-name">${escapeHtml(b.title || '')}</td>
                    <td>${escapeHtml([b.presenterName, b.presenterRole].filter(Boolean).join(' — ') || '—')}</td>
                    <td class="c-center" style="font-weight:700">${b.studentIds?.length || 0}</td>
                  </tr>
                `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
      : '';

  const bodyHtml =
    mode === 'page_per_batch'
      ? batches.map((b, idx) => renderBatchBlock(b, idx, true)).join('\n')
      : `
        <div class="sheet">
          ${buildDocHeader(
            origin,
            title,
            `التسلسل الرسمي لفقرات التكريم وأسماء الأبطال المكرّمين • قصر الثقافة – النجف الأشرف • الجمعة 27/11/2026`
          )}
          ${indexTableHtml}
          ${batches.map((b, idx) => renderBatchBlock(b, idx, false)).join('\n')}
          <div class="footer">
            <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
            <span>نسخة عريف الحفل والمنصة • 27/11/2026</span>
          </div>
        </div>
      `;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} (${batches.length} تكريمات)</title>
  <style>${buildBaseStyles(origin)}</style>
</head>
<body>
  <div class="toolbar">
    <div><strong>${escapeHtml(title)}</strong> — ${batches.length} فقرات تكريم (${totalHonorSlots} طفلاً)</div>
    <div class="toolbar-actions">
      <button class="btn" onclick="window.print()">🖨️ طباعة تسلسل التكريمات (A4)</button>
      <button class="btn-ghost" onclick="window.close()">إغلاق</button>
    </div>
  </div>
  ${bodyHtml}
</body>
</html>`;

  openPrintPopup(html, 'يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة تسلسل التكريمات.');
}
