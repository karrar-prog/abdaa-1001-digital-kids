// محرك الطباعة الرسمية للمتطوعين واللجان التنظيمية (كشف رسمي A4 + باجات دخول جماعية A4 + شهادات شكر وتقدير A4)
import { escapeHtml } from './printHelpers';
import { generateOfficialQrDataUrl } from '../qrVerify';

function normalizeVestSize(raw) {
  const s = String(raw || '').trim().toUpperCase();
  if (['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(s)) return s;
  return s || '—';
}

function shortenCommitteeLabel(raw) {
  const txt = String(raw || '').trim();
  if (!txt) return 'اللجنة التنظيمية';
  return txt.replace(/\s*\(172 خريجاً\)/g, '');
}

/**
 * 1. طباعة كشف أسماء المتطوعين الرسمي (A4) بنفس التصميم الرسمي لكشف الأطفال مع عمود الحضور وملخص اللجان وقياسات السترات
 */
export function openVolunteersRosterPrintWindow(
  volunteers = [],
  titleLabel = 'الكشف الرسمي لفريق المتطوعين واللجان التنظيمية'
) {
  const win = window.open('', '_blank', 'width=1060,height=920');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الكشف الرسمي للمتطوعين.');
    return;
  }

  const origin = window.location.origin;
  const list = Array.isArray(volunteers) ? volunteers : [];

  const vestCounts = {};
  const committeeCounts = {};
  list.forEach((v) => {
    const sz = normalizeVestSize(v.tshirt_size);
    if (sz !== '—') vestCounts[sz] = (vestCounts[sz] || 0) + 1;
    const comm = shortenCommitteeLabel(v.committee || v.field_of_interest);
    committeeCounts[comm] = (committeeCounts[comm] || 0) + 1;
  });

  const vestOrder = ['S', 'M', 'L', 'XL', 'XXL'];
  const vestSummaryText = vestOrder
    .filter((sz) => vestCounts[sz])
    .map((sz) => `${sz}: ${vestCounts[sz]}`)
    .join(' • ');

  const committeeSummaryText = Object.entries(committeeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([comm, count]) => `${comm} (${count})`)
    .join(' — ');

  const rowsHtml = list
    .map((v, idx) => {
      const code = v.volunteer_code || `ABD-VOL-${String(idx + 1).padStart(3, '0')}`;
      const comm = shortenCommitteeLabel(v.committee || v.field_of_interest);
      const size = normalizeVestSize(v.tshirt_size);
      const phone = String(v.phone || '—').trim();
      const roleMeta = [v.academic_status, v.age ? `${v.age} سنة` : ''].filter(Boolean).join(' • ');
      return `
        <tr>
          <td class="of-num">${idx + 1}</td>
          <td class="of-name">
            <div>${escapeHtml(v.full_name || '')}</div>
            ${roleMeta ? `<div class="of-sub">${escapeHtml(roleMeta)}</div>` : ''}
          </td>
          <td class="of-code"><span dir="ltr">${escapeHtml(code)}</span></td>
          <td class="of-comm">${escapeHtml(comm)}</td>
          <td class="of-phone"><span dir="ltr">${escapeHtml(phone)}</span></td>
          <td class="of-size">${escapeHtml(size)}</td>
          <td class="of-check">☐</td>
        </tr>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(titleLabel)} (${list.length})</title>
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
      margin: 10mm 9mm 13mm 9mm;
      @bottom-right {
        content: "مبادرة «1001 طفل رقمي» • الكشف الرسمي للمتطوعين واللجان التنظيمية";
        font-family: "PNU", "Tahoma", Arial, sans-serif;
        font-size: 8pt;
        font-weight: 700;
        color: #475569;
      }
      @bottom-center {
        content: "صفحة " counter(page) " من " counter(pages);
        font-family: "PNU", "Tahoma", Arial, sans-serif;
        font-size: 8.5pt;
        font-weight: 700;
        color: #0b1f3a;
      }
      @bottom-left {
        content: "قصر الثقافة – النجف الأشرف • 27/11/2026";
        font-family: "PNU", "Tahoma", Arial, sans-serif;
        font-size: 8pt;
        font-weight: 700;
        color: #475569;
      }
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 16px;
      background: #dfe5ec;
      font-family: "PNU", "Tahoma", Arial, sans-serif;
      color: #0f172a;
      line-height: 1.4;
    }
    .toolbar {
      max-width: 210mm;
      margin: 0 auto 14px;
      background: #0b1f3a;
      color: #ffffff;
      padding: 11px 18px;
      border-bottom: 3px solid #b48a2c;
      border-radius: 6px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: 0 6px 20px rgba(11, 31, 58, 0.22);
    }
    .toolbar-title { font-size: 13px; font-weight: 700; }
    .toolbar-sub { font-size: 11px; color: #cbd5e1; margin-top: 2px; }
    .toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-formal-print {
      background: #c89b3c;
      color: #0b1f3a;
      border: 1px solid #e2be68;
      border-radius: 4px;
      padding: 8px 18px;
      font-family: inherit;
      font-weight: 700;
      font-size: 12.5px;
      cursor: pointer;
    }
    .btn-formal-print:hover { background: #d7ab4b; }
    .btn-formal-close {
      background: transparent;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 4px;
      padding: 8px 14px;
      font-family: inherit;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
    }
    .official-sheet {
      max-width: 210mm;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-top: 4px solid #0b1f3a;
      padding: 14px 18px 18px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
    }
    .doc-title-block {
      text-align: center;
      margin: 2px 0 12px;
      padding-bottom: 9px;
      border-bottom: 2px solid #0b1f3a;
      position: relative;
    }
    .doc-title-block::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -5px;
      height: 1.5px;
      background: #b48a2c;
    }
    .doc-title-block h1 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0b1f3a;
    }
    .doc-title-block p {
      margin: 3px 0 0;
      font-size: 10.5px;
      font-weight: 500;
      color: #475569;
    }
    .protocol-bar {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      margin-bottom: 12px;
      border: 1px solid #cbd5e1;
      border-right: 4px solid #0b1f3a;
      background: #f8fafc;
    }
    .protocol-note {
      flex: 1;
      padding: 8px 12px;
      font-size: 10.4px;
      color: #1e293b;
      line-height: 1.55;
    }
    .protocol-note-heading {
      display: inline-block;
      font-size: 10.6px;
      font-weight: 700;
      color: #0b1f3a;
      margin-left: 4px;
    }
    .protocol-meta-line {
      margin-top: 4px;
      font-size: 9.6px;
      color: #334155;
    }
    .protocol-count-box {
      min-width: 144px;
      background: #0b1f3a;
      color: #ffffff;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-right: 2px solid #b48a2c;
    }
    .protocol-count-label { font-size: 9.5px; color: #e2e8f0; font-weight: 500; }
    .protocol-count-val { font-size: 16px; font-weight: 700; color: #f3d27a; margin-top: 1px; }
    .protocol-count-sub { font-size: 9px; color: #cbd5e1; margin-top: 1px; }
    table.official-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.8px;
      border: 1.5px solid #0b1f3a;
    }
    table.official-table thead th {
      background: #0b1f3a;
      color: #ffffff;
      padding: 7px 6px;
      border: 1px solid #1e3a5f;
      border-bottom: 2.5px solid #b48a2c;
      font-weight: 700;
      font-size: 10.5px;
      text-align: right;
    }
    table.official-table thead th.c-center { text-align: center; }
    table.official-table tbody td {
      padding: 5.5px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
      color: #0f172a;
    }
    table.official-table tbody tr:nth-child(even) { background: #f8fafc; }
    .of-num { width: 32px; text-align: center; font-weight: 700; color: #0b1f3a; font-size: 10.5px; }
    .of-name { font-weight: 700; color: #0f172a; font-size: 11px; }
    .of-sub { font-size: 9.2px; font-weight: 500; color: #64748b; margin-top: 1px; }
    .of-code {
      width: 90px;
      text-align: center;
      font-family: "Consolas", "Courier New", monospace;
      font-weight: 700;
      font-size: 10px;
      color: #1e293b;
    }
    .of-comm { font-size: 10px; font-weight: 700; color: #0b1f3a; }
    .of-phone {
      width: 102px;
      text-align: center;
      font-family: "Consolas", "Courier New", monospace;
      font-weight: 700;
      font-size: 9.8px;
      color: #334155;
    }
    .of-size {
      width: 44px;
      text-align: center;
      font-family: "Consolas", "Courier New", monospace;
      font-weight: 700;
      font-size: 10.2px;
      color: #0b1f3a;
      background: #f8fafc;
    }
    .of-check { width: 42px; text-align: center; font-size: 13px; color: #64748b; }
    .approval-section {
      margin-top: 16px;
      border: 1px solid #cbd5e1;
      border-top: 2px solid #0b1f3a;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .approval-title {
      background: #f1f5f9;
      color: #0b1f3a;
      font-size: 10.5px;
      font-weight: 700;
      padding: 5px 10px;
      border-bottom: 1px solid #cbd5e1;
      text-align: center;
    }
    .approval-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
    .approval-cell {
      padding: 10px 10px 12px;
      text-align: center;
      border-left: 1px solid #cbd5e1;
    }
    .approval-cell:last-child { border-left: none; }
    .approval-role { font-size: 9.5px; font-weight: 700; color: #475569; }
    .approval-name { font-size: 11px; font-weight: 700; color: #0b1f3a; margin-top: 2px; }
    .approval-org { font-size: 9.2px; color: #64748b; margin-top: 1px; }
    .approval-sign-line {
      margin-top: 22px;
      padding-top: 4px;
      border-top: 1px dotted #94a3b8;
      font-size: 9px;
      color: #64748b;
    }
    .official-footer {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1.5px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .official-footer-text { font-size: 9.2px; color: #475569; font-weight: 700; }
    .official-footer-logos { display: flex; align-items: center; gap: 10px; }
    .official-footer-logos img { height: 22px; width: auto; object-fit: contain; }
    .official-footer-logos img.logo-masdar-sm { height: 16px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .toolbar { display: none !important; }
      .official-sheet { max-width: none; margin: 0; border: none; border-top: none; box-shadow: none; padding: 0; }
      table.official-table thead { display: table-header-group; }
      table.official-table tr { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <div class="toolbar-title">${escapeHtml(titleLabel)} — (${list.length} متطوعاً)</div>
      <div class="toolbar-sub">كشف رسمي للطباعة بحجم A4 • اللجان التنظيمية وقياسات السترات وتوقيع الحضور</div>
    </div>
    <div class="toolbar-actions">
      <button class="btn-formal-print" onclick="window.print()">طباعة الكشف الرسمي / حفظ PDF (A4)</button>
      <button class="btn-formal-close" onclick="window.close()">إغلاق</button>
    </div>
  </div>

  <div class="official-sheet">
    <div class="doc-title-block">
      <h1>${escapeHtml(titleLabel)}</h1>
      <p>برعاية فخامة رئيس الجمهورية • ملتقى النجف للابتكار الرقمي • احتفالية تخرج مبادرة «1001 طفل رقمي» • قصر الثقافة – النجف الأشرف</p>
    </div>

    <div class="protocol-bar">
      <div class="protocol-note">
        <span class="protocol-note-heading">ملاحظة تنظيمية:</span>
        يُعتمد هذا الكشف لمتابعة حضور وتوزيع <strong>فريق المتطوعين واللجان التنظيمية</strong> المشاركين في تنظيم احتفالية تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» يوم الجمعة الموافق 27 تشرين الثاني 2026.
        ${vestSummaryText ? `<div class="protocol-meta-line"><strong>قياسات السترات:</strong> <span dir="ltr" style="font-family:Consolas,monospace">${escapeHtml(vestSummaryText)}</span></div>` : ''}
        ${committeeSummaryText ? `<div class="protocol-meta-line"><strong>توزيع اللجان:</strong> ${escapeHtml(committeeSummaryText)}</div>` : ''}
      </div>
      <div class="protocol-count-box">
        <div class="protocol-count-label">إجمالي فريق المتطوعين</div>
        <div class="protocol-count-val">${list.length}</div>
        <div class="protocol-count-sub">متطوعاً معتمداً</div>
      </div>
    </div>

    <table class="official-table">
      <thead>
        <tr>
          <th class="c-center">#</th>
          <th>الاسم الكامل للمتطوع</th>
          <th class="c-center">كود المتطوع</th>
          <th>اللجنة التنظيمية</th>
          <th class="c-center">رقم الهاتف</th>
          <th class="c-center">القياس</th>
          <th class="c-center">الحضور</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="approval-section">
      <div class="approval-title">اللجنة المنظمة للاحتفالية</div>
      <div class="approval-grid">
        <div class="approval-cell">
          <div class="approval-role">المؤسس المنظم لمبادرة «1001 طفل رقمي»</div>
          <div class="approval-name">الأستاذ فراس نزار كريم</div>
          <div class="approval-org">نادي أبدع للمهارات الذكية – النجف الأشرف</div>
          <div class="approval-sign-line">التوقيع والختم</div>
        </div>
        <div class="approval-cell">
          <div class="approval-role">الشريك المنظم والراعي التقني</div>
          <div class="approval-name">الأستاذ كرار حساني</div>
          <div class="approval-org">شركة المصدر لتكنولوجيا المعلومات</div>
          <div class="approval-sign-line">التوقيع والختم</div>
        </div>
        <div class="approval-cell">
          <div class="approval-role">إدارة اللجان التنظيمية والتطوع</div>
          <div class="approval-name">مسؤول فريق المتطوعين</div>
          <div class="approval-org">قصر الثقافة – النجف الأشرف</div>
          <div class="approval-sign-line">التوقيع والمطابقة</div>
        </div>
      </div>
    </div>

    <div class="official-footer">
      <div class="official-footer-text">
        اللجنة المنظمة لاحتفالية تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» • الجمعة 27/11/2026
      </div>
      <div class="official-footer-logos">
        <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
        <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" />
        <img src="${origin}/brand/masdar-logo-full-clean.png" class="logo-masdar-sm" alt="شركة المصدر" />
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
 * 2. طباعة باجات اعتماد ودخول المتطوعين دفعة واحدة (4 باجات رسمية في كل ورقة A4 مع QR لكل متطوع)
 */
export async function openBatchVolunteerBadgesPrintWindow(volunteers = [], variant = 'light', onProgress) {
  const win = window.open('', '_blank', 'width=1080,height=920');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة باجات المتطوعين الجماعية.');
    return;
  }

  win.document.open();
  win.document.write(
    '<html dir="rtl" lang="ar"><body style="font-family:Tahoma,sans-serif;text-align:center;padding:60px;background:#f8fafc"><h2>جارٍ توليد رموز QR وتجهيز باجات المتطوعين للطباعة...</h2></body></html>'
  );
  win.document.close();

  const origin = window.location.origin;
  const isDark = variant === 'dark';
  const list = Array.isArray(volunteers) ? volunteers : [];

  const prepared = [];
  for (let i = 0; i < list.length; i += 16) {
    const slice = list.slice(i, i + 16);
    const batchResults = await Promise.all(
      slice.map(async (v, localIdx) => {
        const code = v.volunteer_code || `ABD-VOL-${String(i + localIdx + 1).padStart(3, '0')}`;
        const comm = shortenCommitteeLabel(v.committee || v.field_of_interest);
        const qr = await generateOfficialQrDataUrl(
          {
            type: 'id',
            code,
            name: v.full_name || '',
            role: 'متطوع تنظيمي معتمد — احتفالية 1001 طفل رقمي',
            track: comm,
            extra: `${v.academic_status || 'متطوع'} • قياس ${normalizeVestSize(v.tshirt_size)}`
          },
          180
        );
        return { v, code, comm, qr };
      })
    );
    prepared.push(...batchResults);
    if (onProgress) onProgress(Math.min(list.length, i + slice.length), list.length);
  }

  const pages = [];
  for (let i = 0; i < prepared.length; i += 4) {
    pages.push(prepared.slice(i, i + 4));
  }

  const pagesHtml = pages
    .map((pageItems, pIdx) => {
      const cardsHtml = pageItems
        .map(({ v, code, comm, qr }) => {
          const safeName = escapeHtml(v.full_name || '');
          const safeCode = escapeHtml(code);
          const safeComm = escapeHtml(comm);
          const safeRole = escapeHtml(v.academic_status || 'عضو لجنة تنظيمية');
          const safeSize = escapeHtml(normalizeVestSize(v.tshirt_size));
          return `
            <div class="badge-card ${isDark ? 'badge-dark' : 'badge-light'}">
              <div class="slot"></div>
              <div class="top-row">
                <img src="${origin}/brand/abdaa-logo.png" class="logo-sm" alt="أبدع" />
                <img src="${origin}/brand/logo-1001-kids.png" class="logo-mid ${isDark ? 'logo-pill' : ''}" alt="1001" />
                <img src="${origin}/brand/masdar-logo-full-clean.png" class="logo-masdar ${isDark ? 'logo-pill' : ''}" alt="المصدر" />
              </div>
              <div class="ribbon">
                <div class="rib-title">★ بطاقة اعتماد متطوع تنظيمي ★</div>
                <div class="rib-sub">احتفالية تخرج مبادرة «1001» طفل رقمي • قصر الثقافة</div>
              </div>
              <div class="vol-name">${safeName}</div>
              <div class="comm-tag">${safeComm}</div>
              <div class="meta-box">
                <div class="meta-row"><span>كود المتطوع:</span><strong dir="ltr">${safeCode}</strong></div>
                <div class="meta-row"><span>الصفة:</span><strong>${safeRole}</strong></div>
                <div class="meta-row"><span>قياس السترة:</span><strong dir="ltr">${safeSize}</strong></div>
              </div>
              <div class="qr-row">
                <div class="qr-wrap"><img src="${qr}" alt="QR" /></div>
                <div class="qr-info">
                  <div class="qr-head">تصريح عمل تنظيمي رسمي</div>
                  <div>نادي أبدع للمهارات الذكية</div>
                  <div>شركة المصدر لتكنولوجيا المعلومات</div>
                </div>
              </div>
              <div class="motto">فريق صناع الأثر واللجان التنظيمية • 27/11/2026</div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="a4-page">
          <div class="page-head">
            <span>دفعة باجات اعتماد متطوعي احتفالية 1001 طفل رقمي</span>
            <span>صفحة ${pIdx + 1} من ${pages.length}</span>
          </div>
          <div class="grid-4">${cardsHtml}</div>
        </div>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>طباعة باجات المتطوعين (${list.length} باج)</title>
  <style>
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype"); font-weight: 400; }
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype"); font-weight: 700; }
    @page { size: A4 portrait; margin: 7mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 14px; background: #e2e8f0; font-family: "PNU", "Tahoma", Arial, sans-serif; }
    .toolbar {
      max-width: 210mm; margin: 0 auto 14px; background: #082046; color: #fff;
      padding: 12px 18px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;
    }
    .btn { background: #f59e0b; color: #0f172a; border: none; border-radius: 10px; padding: 9px 20px; font-weight: 800; cursor: pointer; font-family: inherit; }
    .a4-page {
      width: 196mm; min-height: 280mm; margin: 0 auto 16px; background: #fff;
      padding: 6mm; border-radius: 12px; page-break-after: always;
    }
    .a4-page:last-child { page-break-after: auto; }
    .page-head {
      display: flex; justify-content: space-between; font-size: 10px; color: #64748b;
      border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 6mm; font-weight: 700;
    }
    .grid-4 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6mm; }
    .badge-card {
      height: 126mm; border-radius: 14px; padding: 10px 12px; display: flex;
      flex-direction: column; justify-content: space-between; text-align: center;
      position: relative; overflow: hidden;
    }
    .badge-light { background: linear-gradient(180deg, #fff 0%, #f0fdfa 60%, #fffbeb 100%); border: 2.5px solid #0d9488; color: #0f172a; }
    .badge-dark { background: linear-gradient(165deg, #061738 0%, #0d3b4c 100%); border: 2.5px solid #2dd4bf; color: #fff; }
    .slot { width: 46px; height: 9px; border-radius: 99px; border: 1.5px dashed #94a3b8; margin: 0 auto 2px; }
    .top-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding-bottom: 5px; border-bottom: 1px solid rgba(148,163,184,0.28); }
    .logo-sm { height: 28px; width: auto; background: #fff; border-radius: 6px; padding: 2px; }
    .logo-mid { height: 32px; width: auto; }
    .logo-masdar { height: 20px; width: auto; }
    .logo-pill { background: #fff; border-radius: 8px; padding: 2px 6px; }
    .ribbon { background: linear-gradient(90deg, #082046, #0d9488, #082046); border: 1.5px solid #f59e0b; border-radius: 10px; padding: 5px 8px; color: #fff; }
    .rib-title { font-size: 12px; font-weight: 800; }
    .rib-sub { font-size: 8.8px; color: #fde68a; }
    .vol-name { font-size: 16px; font-weight: 800; color: #0f766e; margin-top: 2px; }
    .badge-dark .vol-name { color: #5eead4; }
    .comm-tag { font-size: 10px; font-weight: 700; color: #b45309; padding: 0 4px; }
    .badge-dark .comm-tag { color: #fde68a; }
    .meta-box { border-radius: 10px; padding: 6px 8px; text-align: right; font-size: 10px; background: #f8fafc; border: 1px solid #e2e8f0; }
    .badge-dark .meta-box { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.16); }
    .meta-row { display: flex; justify-content: space-between; gap: 6px; padding: 2.5px 0; border-bottom: 1px dashed rgba(148,163,184,0.25); }
    .meta-row:last-child { border-bottom: none; }
    .qr-row { display: flex; align-items: center; gap: 8px; }
    .qr-wrap { background: #fff; padding: 3px; border-radius: 8px; border: 1.5px solid #cbd5e1; flex-shrink: 0; }
    .qr-wrap img { width: 54px; height: 54px; display: block; }
    .qr-info { flex: 1; text-align: right; font-size: 9.5px; line-height: 1.45; }
    .qr-head { font-weight: 800; color: #0d9488; font-size: 10.5px; }
    .badge-dark .qr-head { color: #fde047; }
    .motto { background: #082046; color: #fbbf24; font-size: 9.5px; font-weight: 800; padding: 5px; border-radius: 8px; }
    .badge-dark .motto { background: #0d9488; color: #fff; }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .a4-page { margin: 0; border-radius: 0; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>طباعة باجات اعتماد المتطوعين:</strong> ${list.length} باج (${pages.length} صفحة A4)</div>
    <button class="btn" onclick="window.print()">🖨️ طباعة جميع الباجات الآن</button>
  </div>
  ${pagesHtml}
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/**
 * 3. طباعة شهادات الشكر والتقدير الرسمية للمتطوعين دفعة واحدة (A4 عرضي لكل متطوع مع QR التحقق)
 */
export async function openBatchVolunteerCertificatesPrintWindow(volunteers = [], onProgress) {
  const win = window.open('', '_blank', 'width=1180,height=860');
  if (!win) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة شهادات الشكر والتقدير للمتطوعين.');
    return;
  }

  win.document.open();
  win.document.write(
    '<html dir="rtl" lang="ar"><body style="font-family:Tahoma,sans-serif;text-align:center;padding:60px;background:#f8fafc"><h2>جارٍ تجهيز شهادات الشكر والتقدير الجماعية للمتطوعين...</h2></body></html>'
  );
  win.document.close();

  const origin = window.location.origin;
  const list = Array.isArray(volunteers) ? volunteers : [];

  const prepared = [];
  for (let i = 0; i < list.length; i += 16) {
    const slice = list.slice(i, i + 16);
    const batchResults = await Promise.all(
      slice.map(async (v, localIdx) => {
        const code = v.volunteer_code || `ABD-VOL-${String(i + localIdx + 1).padStart(3, '0')}`;
        const comm = shortenCommitteeLabel(v.committee || v.field_of_interest);
        const qr = await generateOfficialQrDataUrl(
          {
            type: 'id',
            code,
            name: v.full_name || '',
            role: 'شهادة شكر وتقدير — فريق المتطوعين واللجان التنظيمية',
            track: comm,
            extra: 'احتفالية تخرج مبادرة 1001 طفل رقمي'
          },
          180
        );
        return { v, code, comm, qr };
      })
    );
    prepared.push(...batchResults);
    if (onProgress) onProgress(Math.min(list.length, i + slice.length), list.length);
  }

  const certsHtml = prepared
    .map(({ v, code, comm, qr }) => {
      const safeName = escapeHtml(v.full_name || '');
      const safeCode = escapeHtml(code);
      const safeComm = escapeHtml(comm);
      return `
        <div class="cert-page">
          <div class="cert-border">
            <div class="cert-inner">
              <div class="cert-top">
                <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" class="c-logo" />
                <div class="c-center-brand">
                  <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" class="c-logo-1001" />
                  <div class="c-forum">برعاية فخامة رئيس الجمهورية • ملتقى النجف للابتكار الرقمي • احتفالية تخرج الدفعة الأولى</div>
                </div>
                <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" class="c-logo-masdar" />
              </div>

              <div class="c-title">شهادة شكر وتقدير رسمية</div>
              <div class="c-intro">يتقدم نادي أبدع للمهارات الذكية وشركة المصدر لتكنولوجيا المعلومات بخالص الشكر والتقدير إلى المتطوع(ة):</div>
              <div class="c-name">${safeName}</div>
              <div class="c-body">
                تقديراً وعرفاناً للجهود التطوعية والتنظيمية المخلصة والمشاركة الفاعلة ضمن
                <strong class="c-comm">«${safeComm}»</strong>
                في إنجاح احتفالية تخرج الدفعة الأولى من <strong>مبادرة «1001» طفل رقمي</strong>
                في قصر الثقافة – النجف الأشرف بتاريخ 27 تشرين الثاني 2026، سائلين الله لكم دوام التوفيق والعطاء.
              </div>

              <div class="c-footer">
                <div class="sig-block">
                  <div class="sig-title">الأستاذ فراس نزار كريم</div>
                  <div class="sig-role">مؤسس نادي أبدع للمهارات الذكية</div>
                </div>
                <div class="qr-center">
                  <img src="${qr}" alt="QR" />
                  <div dir="ltr">${safeCode}</div>
                </div>
                <div class="sig-block">
                  <div class="sig-title">الأستاذ كرار حساني</div>
                  <div class="sig-role">المدير التنفيذي — شركة المصدر</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>شهادات شكر وتقدير المتطوعين (${list.length} شهادة)</title>
  <style>
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Regular.ttf") format("truetype"); font-weight: 400; }
    @font-face { font-family: "PNU"; src: url("${origin}/fonts/pnu/PNU-Bold.ttf") format("truetype"); font-weight: 700; }
    @page { size: A4 landscape; margin: 8mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 14px; background: #e2e8f0; font-family: "PNU", "Tahoma", Arial, sans-serif; }
    .toolbar {
      max-width: 281mm; margin: 0 auto 14px; background: #082046; color: #fff;
      padding: 12px 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;
    }
    .btn { background: #f59e0b; color: #0f172a; border: none; border-radius: 10px; padding: 9px 22px; font-weight: 800; cursor: pointer; font-family: inherit; }
    .cert-page {
      width: 281mm; height: 194mm; margin: 0 auto 18px; background: #fff;
      padding: 8mm; border-radius: 10px; page-break-after: always;
    }
    .cert-page:last-child { page-break-after: auto; }
    .cert-border {
      width: 100%; height: 100%; border: 4px solid #082046; border-radius: 16px; padding: 6px;
      background: linear-gradient(135deg, #fff 0%, #f0fdfa 55%, #fffbeb 100%);
    }
    .cert-inner {
      width: 100%; height: 100%; border: 2px solid #f59e0b; border-radius: 12px;
      padding: 14px 26px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;
    }
    .cert-top { display: flex; align-items: center; justify-content: space-between; }
    .c-logo { height: 58px; width: auto; }
    .c-logo-1001 { height: 64px; width: auto; display: block; margin: 0 auto; }
    .c-logo-masdar { height: 34px; width: auto; }
    .c-forum { font-size: 12px; font-weight: 700; color: #0f766e; margin-top: 2px; }
    .c-title { font-size: 32px; font-weight: 800; color: #082046; margin-top: 4px; }
    .c-intro { font-size: 14px; color: #475569; font-weight: 700; }
    .c-name {
      font-size: 36px; font-weight: 800; color: #0d9488;
      border-bottom: 2.5px solid #f59e0b; display: inline-block; margin: 4px auto; padding: 0 28px 4px;
    }
    .c-body { font-size: 15px; line-height: 1.85; color: #1e293b; max-width: 88%; margin: 0 auto; }
    .c-comm { color: #b45309; }
    .c-footer { display: flex; align-items: flex-end; justify-content: space-between; padding: 0 18px; }
    .sig-block { width: 220px; border-top: 1.5px solid #94a3b8; padding-top: 6px; }
    .sig-title { font-size: 13px; font-weight: 800; color: #0f172a; }
    .sig-role { font-size: 11px; color: #64748b; }
    .qr-center { text-align: center; }
    .qr-center img { width: 72px; height: 72px; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 3px; background: #fff; }
    .qr-center div { font-family: monospace; font-size: 10.5px; font-weight: 700; color: #0f766e; margin-top: 2px; }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .cert-page { margin: 0; border-radius: 0; padding: 0; width: 100%; height: 193mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>طباعة شهادات الشكر والتقدير للمتطوعين:</strong> ${list.length} شهادة رسمية (A4 أفقي)</div>
    <button class="btn" onclick="window.print()">🖨️ طباعة جميع الشهادات الآن</button>
  </div>
  ${certsHtml}
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
