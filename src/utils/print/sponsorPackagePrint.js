import { escapeHtml, sanitizeImageSrc } from './printHelpers';

export const SPONSOR_BENEFITS_DRAFT_KEY = 'abdaa_sponsor_benefits_draft_v1';

export const DEFAULT_SPONSOR_BENEFITS = [
  {
    id: 'logo_print',
    enabled: true,
    title: 'طباعة وإبراز الشعار الرسمي (Logo) في المطبوعات واللافتات',
    text: 'إدراج وطباعة شعار الجهة الراعية بوضوح في كافة المطبوعات الرسمية للاحتفالية، البوسترات الإعلانية، بطاقات الدعوات البروتوكولية، جدار الرعاة (Sponsors Wall)، واللافتات الترحيبية داخل قصر الثقافة.'
  },
  {
    id: 'logo_platform',
    enabled: true,
    title: 'ظهور الشعار الرسمي في المنصة الإلكترونية للاحتفالية',
    text: 'تثبيت شعار الجهة الراعية واسمها وصفة رعايتها في المنصة الإلكترونية الرسمية للاحتفالية (abdaa.masdar.company) ضمن واجهة شركاء النجاح وفي شريط الرعاة بالبطاقات والمنشورات الرقمية.'
  },
  {
    id: 'logo_main_booth',
    enabled: true,
    title: 'إبراز الشعار في البوث الرئيسي ومعرض مشاريع الأطفال',
    text: 'تثبيت شعار الجهة الراعية في البوث الرئيسي لمعرض مشاريع الأطفال ومنصة التصوير التذكاري الرسمية التي تستقبل فخامة رئيس الجمهورية والوفد الرسمي والعائلات.'
  },
  {
    id: 'honor_kids',
    enabled: true,
    title: 'تكريم عدد ({kidsCount}) من الأطفال الخريجين على المسرح',
    text: 'صعود ممثل الجهة الراعية إلى منصة التتويج لتكريم عدد ({kidsCount}) من أطفال الدفعة الأولى الخريجين في مبادرة «1001 طفل رقمي» وتسليمهم الشهادات والدروع مع توثيق فوتوغرافي وفيديوي رسمي.'
  },
  {
    id: 'bring_materials',
    enabled: true,
    title: 'إمكانية جلب المستلزمات الترويجية والهدايا (رول أب وبروشورات)',
    text: 'إتاحة المجال للجهة الراعية لجلب ({rollupsCount}) ستاند دعائي (Roll-Up) ووضعها في المواقع المخصصة داخل القاعة والمعرض، بالإضافة إلى إمكانية جلب وتوزيع هدايا أو مطبوعات تعريفية للأطفال والعائلات وحضور الفريق الإعلامي والتسويقي للجهة.'
  },
  {
    id: 'official_shield',
    enabled: true,
    title: 'درع التكريم الرسمي والإشادة البروتوكولية والتغطية الإعلامية',
    text: 'منح الجهة الراعية درع الشكر والتقدير الرسمي على المسرح خلال فقرة تكريم الشركات الراعية، مع ذكر اسم الجهة والإشادة بدورها الوطني عبر عريف الحفل وفي التغطية الإعلامية والفيديو التوثيقي للاحتفالية.'
  },
  {
    id: 'vip_seats',
    enabled: true,
    title: 'تخصيص مقاعد كبار الشخصيات (VIP) بحضور الوفد الرئاسي',
    text: 'تخصيص ({vipSeats}) مقاعد رسمية في الصفوف الأمامية (VIP) لممثلي الجهة الراعية بحضور فخامة رئيس جمهورية العراق وكبار المسؤولين والشخصيات الأكاديمية والتقنية.'
  }
];

export const SPONSOR_TIER_PRESETS = [
  {
    id: 'diamond',
    label: 'الراعي الماسي / الرئيسي',
    roleTitle: 'الراعي الرئيسي الاستراتيجي للاحتفالية',
    kidsCount: 20,
    vipSeats: 4,
    rollupsCount: 2,
    enabledIds: [
      'logo_print',
      'logo_platform',
      'logo_main_booth',
      'honor_kids',
      'bring_materials',
      'official_shield',
      'vip_seats'
    ]
  },
  {
    id: 'gold',
    label: 'الراعي الذهبي',
    roleTitle: 'الراعي الذهبي للاحتفالية',
    kidsCount: 10,
    vipSeats: 3,
    rollupsCount: 2,
    enabledIds: [
      'logo_print',
      'logo_platform',
      'logo_main_booth',
      'honor_kids',
      'bring_materials',
      'official_shield',
      'vip_seats'
    ]
  },
  {
    id: 'silver',
    label: 'الراعي الفضي / الداعم',
    roleTitle: 'راعٍ داعم وشريك نجاح',
    kidsCount: 5,
    vipSeats: 2,
    rollupsCount: 1,
    enabledIds: [
      'logo_print',
      'logo_platform',
      'logo_main_booth',
      'honor_kids',
      'bring_materials',
      'official_shield',
      'vip_seats'
    ]
  },
  {
    id: 'supporter',
    label: 'راعٍ مساهم (لوجستي / ضيافة)',
    roleTitle: 'راعٍ مساهم وداعم للاحتفالية',
    kidsCount: 0,
    vipSeats: 2,
    rollupsCount: 1,
    enabledIds: [
      'logo_print',
      'logo_platform',
      'logo_main_booth',
      'bring_materials',
      'official_shield',
      'vip_seats'
    ]
  }
];

export function resolveSponsorBenefitText(template, counts = {}) {
  const kids = Math.max(0, Number(counts.kidsCount ?? 10) || 0);
  const vip = Math.max(0, Number(counts.vipSeats ?? 3) || 0);
  const rollups = Math.max(0, Number(counts.rollupsCount ?? 2) || 0);

  return String(template || '')
    .replace(/\{kidsCount\}/g, String(kids))
    .replace(/\{vipSeats\}/g, String(vip))
    .replace(/\{rollupsCount\}/g, String(rollups));
}

export function buildSponsorBenefitsWhatsAppText(config = {}) {
  const sponsorName = String(config.sponsorName || '').trim() || 'الجهة الراعية الكريمة';
  const tierLabel = String(config.tierLabel || '').trim() || 'راعٍ رسمي وشريك نجاح';
  const repName = String(config.representativeName || '').trim();
  const contribution = String(config.contributionNote || '').trim();
  const extraNotes = String(config.extraNotes || '').trim();
  const counts = {
    kidsCount: config.kidsCount,
    vipSeats: config.vipSeats,
    rollupsCount: config.rollupsCount
  };
  const activeBenefits = (config.benefits || DEFAULT_SPONSOR_BENEFITS).filter((b) => b.enabled !== false);

  const lines = [
    '👑 *برعاية وحضور فخامة رئيس جمهورية العراق*',
    '🎓 *حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي»*',
    '📍 قصر الثقافة – النجف الأشرف | 📅 الجمعة 27 تشرين الثاني 2026 | 🕒 الساعة 3:00 عصراً',
    '',
    `🤝 *وثيقة مزايا واستحقاقات الرعاية الرسمية*`,
    `🏢 *الجهة الراعية:* ${sponsorName}`,
    `🏅 *صفة الرعاية:* ${tierLabel}`
  ];

  if (repName) lines.push(`👤 *عناية:* ${repName}`);
  if (contribution) lines.push(`💼 *طبيعة / قيمة المساهمة:* ${contribution}`);

  lines.push('', '✅ *المزايا والاستحقاقات المخصّصة للجهة الراعية:*');
  activeBenefits.forEach((b, idx) => {
    const title = resolveSponsorBenefitText(b.title, counts);
    const text = resolveSponsorBenefitText(b.text, counts);
    lines.push(`${idx + 1}. *${title}:* ${text}`);
  });

  if (extraNotes) {
    lines.push('', `📌 *ملاحظات تنظيمية:* ${extraNotes}`);
  }

  lines.push(
    '',
    '🏛️ *الجهات المنظمة:* نادي أبدع للمهارات الذكية (المؤسس المنظم) × شركة المصدر لتكنولوجيا المعلومات (الشريك المنظم)',
    '📞 للتواصل والتنسيق: 07810746655',
    '🌐 https://abdaa.masdar.company'
  );

  return lines.join('\n');
}

function printHtmlViaHiddenIframe(html) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('abdaa-sponsor-package-print-iframe');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'abdaa-sponsor-package-print-iframe';
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

export function openSponsorBenefitsPrintWindow(config = {}, options = {}) {
  const { directPrint = false } = options;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const isAgreement = config.docMode === 'agreement';
  const docTitle = isAgreement
    ? 'اتفاقية ومزايا الرعاية الرسمية'
    : 'وثيقة مزايا واستحقاقات الرعاية الرسمية';

  const sponsorNameRaw = String(config.sponsorName || '').trim();
  const sponsorName = escapeHtml(sponsorNameRaw || 'الجهة / الشركة الراعية الكريمة');
  const tierLabel = escapeHtml(String(config.tierLabel || '').trim() || 'راعٍ رسمي وشريك نجاح');
  const repName = escapeHtml(String(config.representativeName || '').trim());
  const contributionNote = escapeHtml(String(config.contributionNote || '').trim());
  const introText = escapeHtml(
    String(config.introText || '').trim() ||
      'تثميناً لدوركم الرائد في دعم الطفولة والابتكار الرقمي وإنجاح حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» (172 خريجاً و40 مشروعاً علمياً حياً)، تلتزم اللجنة المنظمة بتوفير كافة المزايا والاستحقاقات البروتوكولية والإعلامية المدرجة أدناه لصالح جهتكم الموقرة:'
  );
  const extraNotes = escapeHtml(String(config.extraNotes || '').trim());
  const sponsorLogo = sanitizeImageSrc(config.sponsorLogo, '');
  const issueDateText = escapeHtml(
    String(config.issueDate || '').trim() ||
      new Date().toLocaleDateString('ar-IQ', { year: 'numeric', month: '2-digit', day: '2-digit' })
  );
  const refCode = escapeHtml(
    String(config.refCode || '').trim() || `ABD-SPN-2026-${String(Math.floor(100 + Math.random() * 899))}`
  );

  const kidsCount = Math.max(0, Number(config.kidsCount ?? 10) || 0);
  const vipSeats = Math.max(0, Number(config.vipSeats ?? 3) || 0);
  const rollupsCount = Math.max(0, Number(config.rollupsCount ?? 2) || 0);
  const counts = { kidsCount, vipSeats, rollupsCount };

  const activeBenefits = (Array.isArray(config.benefits) && config.benefits.length > 0
    ? config.benefits
    : DEFAULT_SPONSOR_BENEFITS
  ).filter((b) => b && b.enabled !== false && (String(b.title || '').trim() || String(b.text || '').trim()));

  const isCompact = activeBenefits.length >= 7 || Boolean(extraNotes);

  const benefitsRowsHtml = activeBenefits
    .map((b, idx) => {
      const safeTitle = escapeHtml(resolveSponsorBenefitText(b.title, counts));
      const safeText = escapeHtml(resolveSponsorBenefitText(b.text, counts));
      return `
        <tr>
          <td class="col-num"><span class="num-pill">${idx + 1}</span></td>
          <td class="col-content">
            ${safeTitle ? `<div class="b-title">${safeTitle}</div>` : ''}
            ${safeText ? `<div class="b-desc">${safeText}</div>` : ''}
          </td>
          <td class="col-status"><span class="check-badge">✓ مشمول</span></td>
        </tr>
      `;
    })
    .join('');

  const kpiCards = [];
  const honorEnabled = activeBenefits.some((b) => b.id === 'honor_kids');
  const vipEnabled = activeBenefits.some((b) => b.id === 'vip_seats');
  const materialsEnabled = activeBenefits.some((b) => b.id === 'bring_materials');

  if (honorEnabled && kidsCount > 0) {
    kpiCards.push({
      val: `${kidsCount} أطفال`,
      lbl: 'تكريم خريجين على المسرح باسم الراعي'
    });
  }
  if (vipEnabled && vipSeats > 0) {
    kpiCards.push({
      val: `${vipSeats} مقاعد VIP`,
      lbl: 'مقاعد أمامية محجوزة بحضور الوفد الرئاسي'
    });
  }
  if (materialsEnabled && rollupsCount > 0) {
    kpiCards.push({
      val: `${rollupsCount} رول أب + بوث`,
      lbl: 'إبراز الشعار بالمنصة والبوث وجلب المواد'
    });
  } else {
    kpiCards.push({
      val: 'المنصة + البوث + المطبوعات',
      lbl: 'حضور شامل للشعار في كافة القنوات'
    });
  }

  const kpiHtml = kpiCards
    .slice(0, 3)
    .map(
      (k) => `
      <div class="kpi-box">
        <strong>${escapeHtml(k.val)}</strong>
        <span>${escapeHtml(k.lbl)}</span>
      </div>
    `
    )
    .join('');

  const signaturesHtml = isAgreement
    ? `
      <div class="sig-grid three">
        <div class="sig-card">
          <div class="sig-role">المؤسس المنظم</div>
          <div class="sig-name">الأستاذ فراس نزار كريم</div>
          <div class="sig-org">نادي أبدع للمهارات الذكية</div>
          <div class="sig-line">التوقيع والختم</div>
        </div>
        <div class="sig-card">
          <div class="sig-role">الشريك المنظم</div>
          <div class="sig-name">الأستاذ كرار حساني</div>
          <div class="sig-org">شركة المصدر لتكنولوجيا المعلومات</div>
          <div class="sig-line">التوقيع والختم</div>
        </div>
        <div class="sig-card sponsor-sign">
          <div class="sig-role">الطرف الثاني — الجهة الراعية</div>
          <div class="sig-name">${sponsorNameRaw ? sponsorName : 'ممثل الجهة الراعية'}</div>
          <div class="sig-org">${repName || tierLabel}</div>
          <div class="sig-line">التوقيع والختم الرسمي</div>
        </div>
      </div>
    `
    : `
      <div class="sig-grid two">
        <div class="sig-card">
          <div class="sig-role">المؤسس المنظم لمبادرة «1001 طفل رقمي»</div>
          <div class="sig-name">الأستاذ فراس نزار كريم</div>
          <div class="sig-org">نادي أبدع للمهارات الذكية — النجف الأشرف</div>
        </div>
        <div class="sig-card">
          <div class="sig-role">الشريك المنظم والمدير التنفيذي</div>
          <div class="sig-name">الأستاذ كرار حساني</div>
          <div class="sig-org">شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات</div>
        </div>
      </div>
    `;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(docTitle)} — ${sponsorName}</title>
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
      min-height: 282mm;
      background: #ffffff;
      border: 2.5px solid #082046;
      border-radius: 12px;
      padding: 7px 9px 9px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
      display: flex;
      flex-direction: column;
    }
    .sheet-inner {
      flex: 1;
      border: 1.5px solid #d97706;
      border-radius: 8px;
      padding: ${isCompact ? '8px 11px' : '11px 14px'};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: ${isCompact ? '7px' : '9px'};
    }
    .patronage-banner {
      background: linear-gradient(90deg, #061738, #0f3a7a, #061738);
      color: #fde68a;
      border: 1.5px solid #f59e0b;
      border-radius: 8px;
      text-align: center;
      padding: 4.5px 12px;
      font-size: 11.5px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .patronage-banner img {
      height: 18px;
      width: auto;
      object-fit: contain;
    }
    .logos-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-bottom: 6px;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .logo-box {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-box img {
      max-height: 42px;
      max-width: 132px;
      object-fit: contain;
    }
    .title-block {
      text-align: center;
      flex: 1;
    }
    .doc-kicker {
      display: inline-block;
      font-size: 9.8px;
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
    .doc-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      padding: 4px 10px;
      font-size: 9.5px;
      color: #334155;
      font-weight: 700;
    }
    .doc-meta-row strong {
      color: #082046;
    }
    .sponsor-identity-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 55%, #fffbeb 100%);
      border: 1.5px solid #0284c7;
      border-right: 5px solid #082046;
      border-radius: 9px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .sponsor-id-text {
      flex: 1;
      min-width: 0;
    }
    .sponsor-id-eyebrow {
      font-size: 9.5px;
      font-weight: 700;
      color: #0369a1;
      margin-bottom: 2px;
    }
    .sponsor-id-name {
      font-size: 15px;
      font-weight: 700;
      color: #082046;
      line-height: 1.25;
    }
    .sponsor-id-badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }
    .tier-chip {
      display: inline-block;
      background: #082046;
      color: #fde68a;
      border: 1px solid #f59e0b;
      border-radius: 99px;
      padding: 1.5px 10px;
      font-size: 9.5px;
      font-weight: 700;
    }
    .meta-chip {
      display: inline-block;
      background: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 99px;
      padding: 1.5px 9px;
      font-size: 9.2px;
      font-weight: 700;
    }
    .sponsor-logo-frame {
      width: 82px;
      height: 58px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .sponsor-logo-frame img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .intro-para {
      margin: 0;
      font-size: ${isCompact ? '10px' : '10.6px'};
      line-height: 1.55;
      color: #1e293b;
      text-align: justify;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
    }
    .kpi-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-top: 2.5px solid #f59e0b;
      border-radius: 7px;
      padding: 5px 8px;
      text-align: center;
    }
    .kpi-box strong {
      display: block;
      font-size: 11.5px;
      font-weight: 700;
      color: #082046;
      line-height: 1.25;
    }
    .kpi-box span {
      display: block;
      font-size: 8.6px;
      color: #475569;
      margin-top: 1px;
    }
    .section-heading {
      background: #082046;
      color: #ffffff;
      padding: 4.5px 10px;
      border-radius: 6px 6px 0 0;
      font-size: 10.5px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-heading span.count {
      color: #fde68a;
      font-size: 9.5px;
    }
    table.benefits-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
    }
    table.benefits-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    table.benefits-table tbody td {
      padding: ${isCompact ? '4.5px 7px' : '6px 8px'};
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .col-num {
      width: 28px;
      text-align: center;
      padding-top: 6px !important;
    }
    .num-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 19px;
      height: 19px;
      border-radius: 99px;
      background: #082046;
      color: #fde68a;
      font-size: 9.5px;
      font-weight: 700;
    }
    .col-content {
      text-align: right;
    }
    .b-title {
      font-size: ${isCompact ? '10.3px' : '11px'};
      font-weight: 700;
      color: #082046;
      line-height: 1.3;
      margin-bottom: 1.5px;
    }
    .b-desc {
      font-size: ${isCompact ? '9.2px' : '9.7px'};
      color: #334155;
      line-height: 1.45;
    }
    .col-status {
      width: 58px;
      text-align: center;
      vertical-align: middle !important;
    }
    .check-badge {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #6ee7b7;
      border-radius: 99px;
      padding: 1.5px 6px;
      font-size: 8.6px;
      font-weight: 700;
      white-space: nowrap;
    }
    .notes-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-right: 4px solid #f59e0b;
      border-radius: 7px;
      padding: 5.5px 10px;
      font-size: 9.4px;
      color: #78350f;
      line-height: 1.45;
    }
    .notes-box strong {
      color: #92400e;
    }
    .sig-grid {
      display: grid;
      gap: 10px;
      margin-top: 2px;
    }
    .sig-grid.two {
      grid-template-columns: 1fr 1fr;
    }
    .sig-grid.three {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .sig-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px 8px;
      text-align: center;
    }
    .sig-card.sponsor-sign {
      background: #f0f9ff;
      border-color: #7dd3fc;
    }
    .sig-role {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
    }
    .sig-name {
      font-size: 11px;
      font-weight: 700;
      color: #082046;
      margin-top: 2px;
    }
    .sig-org {
      font-size: 8.6px;
      color: #334155;
      margin-top: 1px;
    }
    .sig-line {
      margin-top: 14px;
      padding-top: 3px;
      border-top: 1px dashed #94a3b8;
      font-size: 8.2px;
      color: #64748b;
    }
    .doc-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 8.8px;
      color: #475569;
      font-weight: 700;
    }
    .doc-footer span.mono {
      font-family: monospace;
      color: #082046;
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
        min-height: 282mm;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة / حفظ الوثيقة PDF (A4)</button>
    <button class="btn-close" onclick="window.close()">إغلاق</button>
  </div>

  <div class="sheet">
    <div class="sheet-inner">
      <div>
        <div class="patronage-banner">
          <img src="${origin}/brand/iraq-republic-eagle.png" alt="شعار جمهورية العراق" />
          <span>برعاية وحضور فخامة رئيس جمهورية العراق</span>
          <img src="${origin}/brand/iraq-republic-eagle.png" alt="شعار جمهورية العراق" />
        </div>

        <div class="logos-header" style="margin-top:7px">
          <div class="logo-box">
            <img src="${origin}/brand/abdaa-logo.png" alt="نادي أبدع" />
          </div>
          <div class="title-block">
            <div class="doc-kicker">حفل تخرج الدفعة الأولى • مبادرة «1001 طفل رقمي»</div>
            <h1 class="main-title">${escapeHtml(docTitle)}</h1>
          </div>
          <div class="logo-box" style="gap:6px">
            <img src="${origin}/brand/logo-1001-kids.png" alt="1001 طفل رقمي" style="max-height:38px" />
            <img src="${origin}/brand/masdar-logo-full-clean.png" alt="شركة المصدر" style="max-height:32px" />
          </div>
        </div>

        <div class="doc-meta-row" style="margin-top:6px">
          <span>📅 <strong>الموعد:</strong> الجمعة 27 تشرين الثاني 2026 • الساعة 3:00 عصراً</span>
          <span>📍 <strong>المكان:</strong> قصر الثقافة – النجف الأشرف</span>
          <span>المرجع: <strong style="font-family:monospace">${refCode}</strong> • ${issueDateText}</span>
        </div>

        <div class="sponsor-identity-card" style="margin-top:7px">
          <div class="sponsor-id-text">
            <div class="sponsor-id-eyebrow">مُقدّمة إلى الجهة الراعية وشريك النجاح الموقّر:</div>
            <div class="sponsor-id-name">${sponsorName}</div>
            <div class="sponsor-id-badges">
              <span class="tier-chip">${tierLabel}</span>
              ${repName ? `<span class="meta-chip">عناية: ${repName}</span>` : ''}
              ${contributionNote ? `<span class="meta-chip">المساهمة: ${contributionNote}</span>` : ''}
            </div>
          </div>
          ${
            sponsorLogo
              ? `<div class="sponsor-logo-frame"><img src="${sponsorLogo}" alt="${sponsorName}" /></div>`
              : ''
          }
        </div>

        <p class="intro-para" style="margin-top:7px">${introText}</p>

        <div class="kpi-grid" style="margin-top:7px">
          ${kpiHtml}
        </div>

        <div style="margin-top:8px">
          <div class="section-heading">
            <span>بنود المزايا والاستحقاقات البروتوكولية والإعلامية للراعي</span>
            <span class="count">عدد البنود المعتمدة: ${activeBenefits.length}</span>
          </div>
          <table class="benefits-table">
            <tbody>
              ${benefitsRowsHtml}
            </tbody>
          </table>
        </div>

        ${
          extraNotes
            ? `<div class="notes-box" style="margin-top:7px"><strong>ملاحظات وتفاصيل إضافية:</strong> ${extraNotes}</div>`
            : ''
        }
      </div>

      <div>
        ${signaturesHtml}
        <div class="doc-footer" style="margin-top:7px">
          <span>المؤسس المنظم: نادي أبدع للمهارات الذكية • الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات</span>
          <span class="mono">07810746655 • abdaa.masdar.company</span>
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

  const win = window.open('', '_blank', 'width=960,height=920');
  if (!win) {
    printHtmlViaHiddenIframe(html);
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
