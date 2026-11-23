// محرك تصميم وتصدير بطاقات الدعوة الرسمية الفاخرة عالية الدقة (PNG 1200×1690 بنسبة A4 الدقيقة + PDF فردي وجماعي)
// تصميم رسمي هادئ وبروتوكول رئاسي رفيع — ألوان حصرية من شعار مبادرة «1001 طفل رقمي»: النيلي الملكي + البرتقالي + الأبيض الناصع

import { generateOfficialQrDataUrl } from './qrVerify';
import { buildZipBlob } from './zipBuilder';

const IMG_CACHE = new Map();

function loadCachedImg(src) {
  if (!src) return Promise.resolve(null);
  if (IMG_CACHE.has(src)) return IMG_CACHE.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  if (!src.startsWith('data:')) IMG_CACHE.set(src, p);
  return p;
}

function createWhiteTintedCanvas(img) {
  if (!img?.width || !img?.height) return img;
  try {
    const off = document.createElement('canvas');
    off.width = img.width;
    off.height = img.height;
    const octx = off.getContext('2d');
    if (!octx) return img;
    octx.drawImage(img, 0, 0);
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = '#ffffff';
    octx.fillRect(0, 0, off.width, off.height);
    return off;
  } catch {
    return img;
  }
}

// لوحة الألوان الحصرية المستخرجة من شعار مبادرة «1001 طفل رقمي»: نيلي + برتقالي + أبيض
const PALETTE_1001 = {
  indigoDark: '#00185C',
  indigoCore: '#002884',
  indigoBright: '#003BA8',
  orangeDeep: '#F25C05',
  orangeCore: '#FF7300',
  orangeBright: '#FF911A',
  white: '#FFFFFF',
  softSurface: '#F5F7FC',
  indigoMuted: '#334B7A',
  indigoBody: '#162852'
};

export const INVITATION_STYLE_THEMES = [
  {
    id: 'official_white_1001',
    label: 'الأبيض الرسمي × النيلي والبرتقالي',
    emoji: '🏛️',
    desc: 'أبيض ناصع رسمي بترويسة رئاسية نيلية وخطوط برتقالية — الأوضح للطباعة A4'
  },
  {
    id: 'official_indigo_1001',
    label: 'النيلي الملكي × الأبيض والبرتقالي',
    emoji: '👑',
    desc: 'خلفية نيلية عميقة من شعار 1001 بخطوط بيضاء وبرتقالية فاخرة للمشاركة الرقمية'
  }
];

export const PATRONAGE_PRESETS = [
  {
    id: 'patronage_and_presence',
    label: 'برعاية وحضور فخامة الرئيس',
    eyebrow: 'برعاية وحضور',
    text: 'فخامة رئيس جمهورية العراق',
    subtitle: ''
  },
  {
    id: 'under_patronage_presence',
    label: 'تحت رعاية وبحضور فخامة الرئيس',
    eyebrow: 'تحت رعاية وبحضور',
    text: 'فخامة رئيس جمهورية العراق',
    subtitle: 'تشريفٌ كريمٌ لاحتفالية تخرج الدفعة الأولى'
  },
  {
    id: 'patronage_with_rep',
    label: 'برعاية فخامة الرئيس وبحضور ممثله',
    eyebrow: 'برعاية فخامة رئيس جمهورية العراق',
    text: 'وبحضور ممثل رئاسة الجمهورية',
    subtitle: 'الدكتور نزار محمد سعيد المحترم'
  },
  {
    id: 'patronage_only',
    label: 'برعاية فخامة رئيس الجمهورية',
    eyebrow: 'برعاية كريمة من',
    text: 'فخامة رئيس جمهورية العراق',
    subtitle: ''
  }
];

function getThemePalette(styleId) {
  if (styleId === 'official_indigo_1001') {
    return {
      isDark: true,
      outerBg: PALETTE_1001.indigoDark,
      cardBgTop: '#001E6C',
      cardBgBottom: '#001348',
      headerBgStart: '#002C94',
      headerBgEnd: '#001A62',
      footerBgStart: '#001242',
      footerBgEnd: '#001E6B',
      borderOuter: PALETTE_1001.orangeCore,
      borderInner: 'rgba(255, 255, 255, 0.16)',
      dividerColor: 'rgba(255, 255, 255, 0.18)',
      accentOrange: PALETTE_1001.orangeBright,
      accentOrangeSolid: PALETTE_1001.orangeCore,
      headingPrimary: PALETTE_1001.white,
      headingAccent: PALETTE_1001.orangeBright,
      bodyText: 'rgba(255, 255, 255, 0.90)',
      highlightText: PALETTE_1001.white,
      guestPlateBg: PALETTE_1001.white,
      guestPlateBorder: PALETTE_1001.orangeCore,
      guestNameColor: PALETTE_1001.indigoDark,
      guestTitleColor: 'rgba(255, 255, 255, 0.88)',
      badgeBg: 'rgba(255, 255, 255, 0.08)',
      badgeBorder: PALETTE_1001.orangeBright,
      badgeText: PALETTE_1001.white,
      statCardBg: 'rgba(255, 255, 255, 0.06)',
      statCardBorder: 'rgba(255, 255, 255, 0.16)',
      statNumColor: PALETTE_1001.orangeBright,
      statLabelColor: 'rgba(255, 255, 255, 0.86)',
      closingText: PALETTE_1001.orangeBright,
      infoPrimary: PALETTE_1001.white,
      infoSecondary: 'rgba(255, 255, 255, 0.78)',
      logoPrimary: PALETTE_1001.white,
      logoSecondary: 'rgba(255, 255, 255, 0.78)'
    };
  }

  // Default: 'official_white_1001' — Ultra-clean executive White + 1001 Indigo + 1001 Orange
  return {
    isDark: false,
    outerBg: PALETTE_1001.indigoDark,
    cardBgTop: PALETTE_1001.white,
    cardBgBottom: PALETTE_1001.white,
    headerBgStart: PALETTE_1001.indigoDark,
    headerBgEnd: PALETTE_1001.indigoBright,
    footerBgStart: PALETTE_1001.indigoDark,
    footerBgEnd: PALETTE_1001.indigoCore,
    borderOuter: PALETTE_1001.indigoCore,
    borderInner: 'rgba(0, 24, 92, 0.14)',
    dividerColor: 'rgba(0, 24, 92, 0.14)',
    accentOrange: PALETTE_1001.orangeCore,
    accentOrangeSolid: PALETTE_1001.orangeDeep,
    headingPrimary: PALETTE_1001.indigoDark,
    headingAccent: PALETTE_1001.orangeDeep,
    bodyText: PALETTE_1001.indigoBody,
    highlightText: PALETTE_1001.indigoCore,
    guestPlateBg: PALETTE_1001.softSurface,
    guestPlateBorder: 'rgba(0, 40, 132, 0.18)',
    guestNameColor: PALETTE_1001.indigoDark,
    guestTitleColor: PALETTE_1001.indigoMuted,
    badgeBg: PALETTE_1001.white,
    badgeBorder: PALETTE_1001.indigoCore,
    badgeText: PALETTE_1001.indigoDark,
    statCardBg: PALETTE_1001.softSurface,
    statCardBorder: 'rgba(0, 40, 132, 0.14)',
    statNumColor: PALETTE_1001.indigoDark,
    statLabelColor: PALETTE_1001.indigoMuted,
    closingText: PALETTE_1001.orangeDeep,
    infoPrimary: PALETTE_1001.indigoDark,
    infoSecondary: PALETTE_1001.indigoMuted,
    logoPrimary: PALETTE_1001.indigoDark,
    logoSecondary: PALETTE_1001.indigoMuted
  };
}

function resolveMasdarLogoSource(d, isDarkCard = false) {
  if (!d.showMasdarLogo) return { src: null, needsWhiteTint: false, needsLightPill: false, needsDarkPill: false };
  const placement = d.masdarPlacement || 'bottom_wave';
  const variant = d.masdarVariant || 'auto';
  const onDarkBg = placement === 'bottom_wave' || placement === 'bottom_corner' || isDarkCard;

  if (variant === 'custom' && d.customMasdarLogoUrl) {
    return {
      src: d.customMasdarLogoUrl,
      needsWhiteTint: false,
      needsLightPill: onDarkBg,
      needsDarkPill: false
    };
  }
  if (variant === 'full_white') {
    return {
      src: '/brand/masdar-logo-full-white.png',
      needsWhiteTint: false,
      needsLightPill: false,
      needsDarkPill: !onDarkBg
    };
  }
  if (variant === 'full_blue') {
    return {
      src: '/brand/masdar-logo-full-clean.png',
      needsWhiteTint: false,
      needsLightPill: onDarkBg,
      needsDarkPill: false
    };
  }
  if (variant === 'mark') {
    return {
      src: '/brand/masdar-logo-mark.png',
      needsWhiteTint: onDarkBg,
      needsLightPill: false,
      needsDarkPill: false
    };
  }
  return {
    src: onDarkBg ? '/brand/masdar-logo-full-white.png' : '/brand/masdar-logo-full-clean.png',
    needsWhiteTint: false,
    needsLightPill: false,
    needsDarkPill: false
  };
}

function sanitizeFilename(s) {
  return String(s || 'guest')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 75);
}

export const DEFAULT_INVITATION_DATA = {
  styleTheme: 'official_white_1001', // 'official_white_1001' | 'official_indigo_1001'
  motto: 'نصنع جيلاً يبرمج المستقبل',
  showPatronage: true,
  patronageEyebrow: 'برعاية وحضور',
  patronageText: 'فخامة رئيس جمهورية العراق',
  patronageSubtitle: '',
  presidentPhotoUrl: '',
  showStats: false, // مخفية افتراضياً ليكون التصميم رسمياً وهادئاً وقليل التفاصيل
  showMasdarLogo: true,
  masdarPlacement: 'bottom_wave', // 'bottom_wave' | 'top_triple' | 'bottom_corner'
  masdarVariant: 'auto', // 'auto' | 'full_blue' | 'full_white' | 'mark' | 'custom'
  masdarCaption: 'الشريك التقني والمنظم',
  customMasdarLogoUrl: '',
  showQr: false,
  headerBadge: 'دعوة حضور رسمية',
  guestName: 'المهندس الحاج زهير شربة المحترم',
  guestTitle: 'رئيس غرفة تجارة النجف الأشرف',
  occasionLine1: 'لحفل تخرج الدفعة الأولى',
  occasionLine2: 'من مبادرة «1001 طفل رقمي»',
  bodyText:
    'بكل فخرٍ واعتزاز، يتشرف نادي أبدع للمهارات الذكية بدعوتكم لحضور\nحفل تخرج 172 طفلاً رقمياً في الدفعة الأولى، من بين 700 طفل\nأتمّوا متطلبات المبادرة، من أصل 896 طفلاً التحقوا بها.',
  highlightText:
    'إن تشريفكم هذه المناسبة الوطنية ومشاركة أطفالنا فرحة التتويج،\nيمثّل دعماً كريماً لمسيرتهم نحو الإبداع وصناعة المستقبل.',
  stat1Num: '172',
  stat1Label: 'خريجاً في الدفعة الأولى',
  stat2Num: '700',
  stat2Label: 'أتمّوا متطلبات المبادرة',
  stat3Num: '896',
  stat3Label: 'طفلاً التحقوا بالمبادرة',
  closingRibbon: 'بحضوركم تكتمل فرحتنا... وتكبر أحلام أطفالنا',
  dateLine1: 'الجمعة',
  dateLine2: '27 تشرين الثاني 2026',
  timeLine1: 'الساعة',
  timeLine2: '3:00 عصراً',
  venueLine1: 'قصر الثقافة',
  venueLine2: 'النجف الأشرف'
};

export const INVITATION_TEMPLATES = [
  {
    id: 'vip',
    label: 'شخصية رسمية / VIP',
    emoji: '👑',
    patch: {
      showPatronage: true,
      patronageEyebrow: 'برعاية وحضور',
      patronageText: 'فخامة رئيس جمهورية العراق',
      headerBadge: 'دعوة حضور رسمية',
      guestName: 'المهندس الحاج زهير شربة المحترم',
      guestTitle: 'رئيس غرفة تجارة النجف الأشرف',
      bodyText:
        'بكل فخرٍ واعتزاز، يتشرف نادي أبدع للمهارات الذكية بدعوتكم لحضور\nحفل تخرج 172 طفلاً رقمياً في الدفعة الأولى، من بين 700 طفل\nأتمّوا متطلبات المبادرة، من أصل 896 طفلاً التحقوا بها.',
      highlightText:
        'إن تشريفكم هذه المناسبة الوطنية ومشاركة أطفالنا فرحة التتويج،\nيمثّل دعماً كريماً لمسيرتهم نحو الإبداع وصناعة المستقبل.',
      closingRibbon: 'بحضوركم تكتمل فرحتنا... وتكبر أحلام أطفالنا'
    }
  },
  {
    id: 'state_protocol',
    label: 'مسؤول حكومي / بروتوكول',
    emoji: '🏛️',
    patch: {
      showPatronage: true,
      patronageEyebrow: 'تحت رعاية وبحضور',
      patronageText: 'فخامة رئيس جمهورية العراق',
      headerBadge: 'دعوة تشريف رسمية',
      guestName: 'السيد محافظ النجف الأشرف المحترم',
      guestTitle: 'ديوان محافظة النجف الأشرف',
      bodyText:
        'تقديراً لدوركم الوطني الريادي في رعاية الكفاءات والطاقات الواعدة،\nيتشرف نادي أبدع للمهارات الذكية بدعوة سيادتكم لحضور حفل تخرج\n172 طفلاً رقمياً في الدفعة الأولى وافتتاح معرض ابتكاراتهم العلمية.',
      highlightText:
        'إن حضوركم الموقّر وتشريفكم لأبنائكم المبتكرين يعكس الاهتمام\nالرسمي السامي ببناء جيلٍ عراقيٍ يقود التحول الرقمي.',
      closingRibbon: 'بتشريفكم تزدان الاحتفالية... ويسمو طموح أطفالنا'
    }
  },
  {
    id: 'sponsor',
    label: 'شركة / جهة راعية',
    emoji: '🤝',
    patch: {
      showPatronage: true,
      headerBadge: 'دعوة شريك وراعٍ رسمي',
      guestName: 'السيد مدير الشركة الراعية المحترم',
      guestTitle: 'شريك دعم الإبداع والطفولة الرقمية',
      bodyText:
        'تقديراً لدوركم الرائد في دعم المبادرات التعليمية والمجتمعية،\nيتشرف نادي أبدع للمهارات الذكية بدعوتكم لحضور حفل تخرج\n172 طفلاً رقمياً في الدفعة الأولى ومعرض مشاريعهم الابتكارية.',
      highlightText:
        'حضوركم الكريم وتكريمكم في الاحتفالية يمثل شراكة حقيقية\nفي بناء جيل عراقي مبدع يصنع التكنولوجيا.',
      closingRibbon: 'بشراكتكم نرتقي... وتكبر أحلام أطفالنا'
    }
  },
  {
    id: 'parent',
    label: 'ولي أمر / عائلة خريج',
    emoji: '🎓',
    patch: {
      showPatronage: true,
      headerBadge: 'دعوة عائلية كريمة',
      guestName: 'عائلة البطل الخريج الكريمة',
      guestTitle: 'أولياء أمور أبطال الدفعة الأولى',
      bodyText:
        'بكل فخرٍ وسعادة، يتشرف نادي أبدع للمهارات الذكية بدعوتكم\nلمشاركتنا فرحة تتويج أبنائكم الأبطال ضمن خريجي الدفعة الأولى\nلمبادرة «1001 طفل رقمي» وافتتاح معرض ابتكاراتهم الحية.',
      highlightText:
        'بفضل دعمكم وتشجيعكم المتواصل، وصل أطفالنا اليوم\nإلى منصة التكريم والإبداع الرقمي.',
      closingRibbon: 'بحضوركم تكتمل فرحتنا... ونحتفي بأبطالنا معاً'
    }
  },
  {
    id: 'media',
    label: 'إعلامي / صحفي',
    emoji: '📺',
    patch: {
      showPatronage: true,
      headerBadge: 'دعوة تغطية إعلامية',
      guestName: 'الأستاذ الإعلامي المحترم',
      guestTitle: 'ممثل المؤسسة الإعلامية والصحفية',
      bodyText:
        'يسر نادي أبدع للمهارات الذكية دعوتكم للتغطية الإعلامية\nلاحتفالية تخرج 172 طفلاً رقمياً (6 – 14 سنة) وافتتاح\nالمعرض العلمي الحي لأكثر من 40 مشروعاً برمجياً وروبوتياً.',
      highlightText:
        'إبرازكم لهذه القصص الملهمة ينقل للعالم صورة مشرقة\nعن إبداع الطفولة العراقية في النجف الأشرف.',
      closingRibbon: 'بعدستكم وكلمتكم تصل قصص أبطالنا إلى العالم'
    }
  }
];

// ---------- Minimalist Crisp Line Icons (1001 Orange) ----------

function drawCalendarIcon(ctx, cx, cy, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.roundRect(-18, -14, 36, 32, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-18, -4);
  ctx.lineTo(18, -4);
  ctx.moveTo(-9, -20);
  ctx.lineTo(-9, -10);
  ctx.moveTo(9, -20);
  ctx.lineTo(9, -10);
  ctx.stroke();
  ctx.restore();
}

function drawClockIcon(ctx, cx, cy, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(0, 1);
  ctx.lineTo(7, 5);
  ctx.stroke();
  ctx.restore();
}

function drawMapPinIcon(ctx, cx, cy, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 19);
  ctx.bezierCurveTo(-15, 6, -16, -13, 0, -18);
  ctx.bezierCurveTo(16, -13, 15, 6, 0, 19);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -3, 5.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function fitText(ctx, text, x, y, maxW, startPx, minPx, weight = '900', family = '"Alexandria", "Tajawal", sans-serif') {
  let sz = startPx;
  ctx.font = `${weight} ${sz}px ${family}`;
  while (ctx.measureText(text).width > maxW && sz > minPx) {
    sz -= 1.5;
    ctx.font = `${weight} ${sz}px ${family}`;
  }
  ctx.fillText(text, x, y);
  return sz;
}

function wrapArabicParagraph(ctx, rawText, maxW) {
  const paragraphs = String(rawText || '').split('\n');
  const lines = [];
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let current = '';
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxW && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawCircularPortraitCover(ctx, img, cx, cy, r) {
  if (!img?.width || !img?.height) return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const size = r * 2;
  const imgAspect = img.width / img.height;
  let drawW = size;
  let drawH = size;
  let dx = cx - r;
  let dy = cy - r;
  if (imgAspect > 1) {
    drawW = size * imgAspect;
    dx = cx - drawW / 2;
  } else {
    drawH = size / imgAspect;
    dy = cy - r - (drawH - size) * 0.22;
  }
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();
}

function drawMinimalAccentRule(ctx, cx, y, totalHalfW, orangeHalfW, lineColor, orangeColor) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - totalHalfW, y);
  ctx.lineTo(cx + totalHalfW, y);
  ctx.stroke();

  ctx.strokeStyle = orangeColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - orangeHalfW, y);
  ctx.lineTo(cx + orangeHalfW, y);
  ctx.stroke();
  ctx.restore();
}

// ---------- Main Executive Minimalist Invitation Renderer (1200 × 1690 px — exact A4 ratio) ----------

export async function renderInvitationToCanvas(canvas, rawData = {}) {
  const d = { ...DEFAULT_INVITATION_DATA, ...rawData };
  const theme = getThemePalette(d.styleTheme || 'official_white_1001');
  const W = 1200;
  const H = 1690;

  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 250))]);
    } catch {
      // ignore
    }
  }

  const qrPromise = d.showQr
    ? generateOfficialQrDataUrl(
        {
          type: 'ticket',
          code: 'VIP-INV-2026',
          name: d.guestName || 'ضيف شرف',
          role: d.guestTitle || 'دعوة حضور رسمية',
          track: 'حفل تخرج مبادرة 1001 طفل رقمي',
          extra: d.venueLine1 || 'قصر الثقافة'
        },
        180
      ).then((url) => loadCachedImg(url))
    : Promise.resolve(null);

  const masdarSpec = resolveMasdarLogoSource(d, theme.isDark);
  const masdarPlacement = d.masdarPlacement || 'bottom_wave';
  const showMasdarInTop = Boolean(d.showMasdarLogo && masdarPlacement === 'top_triple');
  const showMasdarInFooter = Boolean(d.showMasdarLogo && (masdarPlacement === 'bottom_wave' || masdarPlacement === 'bottom_corner'));

  const [logoAbdaa, logo1001, rawLogoMasdar, presidentPhotoImg, qrImg] = await Promise.all([
    loadCachedImg('/brand/abdaa-logo.png'),
    loadCachedImg('/brand/logo-1001-kids.png'),
    masdarSpec.src ? loadCachedImg(masdarSpec.src) : Promise.resolve(null),
    d.showPatronage && d.presidentPhotoUrl ? loadCachedImg(d.presidentPhotoUrl) : Promise.resolve(null),
    qrPromise
  ]);
  const logoMasdar =
    rawLogoMasdar && masdarSpec.needsWhiteTint ? createWhiteTintedCanvas(rawLogoMasdar) : rawLogoMasdar;

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Crisp Outer Sovereign Indigo Frame
  ctx.fillStyle = theme.outerBg;
  ctx.fillRect(0, 0, W, H);

  // 2. Clean Architectural Card Canvas
  const cardX = 28;
  const cardY = 28;
  const cardW = W - 56;
  const cardH = H - 56;
  const cardR = 20;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.clip();

  const cardBg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
  cardBg.addColorStop(0, theme.cardBgTop);
  cardBg.addColorStop(1, theme.cardBgBottom);
  ctx.fillStyle = cardBg;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // =========================================================================
  // ZONE 1: SOVEREIGN PRESIDENTIAL TOP BAND (Indigo + Orange + Pure White)
  // =========================================================================
  const hasPatronage = Boolean(
    d.showPatronage && (String(d.patronageText || '').trim() || String(d.patronageEyebrow || '').trim())
  );
  const patEyebrow = String(d.patronageEyebrow || '').trim();
  const patMain = String(d.patronageText || '').trim();
  const patSub = String(d.patronageSubtitle || '').trim();
  const hasPatPhoto = Boolean(presidentPhotoImg?.width);

  let afterHeaderY = cardY + 34;

  if (hasPatronage) {
    const headerH = patSub ? 248 : 216;
    const headerGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + headerH);
    headerGrad.addColorStop(0, theme.headerBgStart);
    headerGrad.addColorStop(0.5, theme.headerBgEnd);
    headerGrad.addColorStop(1, theme.headerBgStart);
    ctx.fillStyle = headerGrad;
    ctx.fillRect(cardX, cardY, cardW, headerH);

    // Clean 6px 1001 Orange bottom accent bar
    const orangeBarGrad = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
    orangeBarGrad.addColorStop(0, PALETTE_1001.orangeDeep);
    orangeBarGrad.addColorStop(0.5, PALETTE_1001.orangeBright);
    orangeBarGrad.addColorStop(1, PALETTE_1001.orangeDeep);
    ctx.fillStyle = orangeBarGrad;
    ctx.fillRect(cardX, cardY + headerH - 6, cardW, 6);

    const textCx = hasPatPhoto ? 510 : W / 2;
    const textMaxW = hasPatPhoto ? 790 : 980;

    if (hasPatPhoto) {
      const pCx = cardX + cardW - 118;
      const pCy = cardY + (headerH - 6) / 2;
      const pR = patSub ? 72 : 66;
      drawCircularPortraitCover(ctx, presidentPhotoImg, pCx, pCy, pR);
      ctx.strokeStyle = PALETTE_1001.orangeBright;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(pCx, pCy, pR + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const ebY = patSub ? cardY + 62 : cardY + 68;
    const mainY = patSub ? cardY + 130 : cardY + 138;
    const subY = cardY + 194;

    if (patEyebrow) {
      // Crisp 1001 Orange eyebrow «برعاية وحضور»
      ctx.fillStyle = PALETTE_1001.orangeBright;
      fitText(ctx, patEyebrow, textCx, ebY, textMaxW, 30, 19, '800');
    }

    if (patMain) {
      // Unmistakable Pure White Sovereign Title «فخامة رئيس جمهورية العراق»
      ctx.fillStyle = PALETTE_1001.white;
      fitText(ctx, patMain, textCx, mainY, textMaxW, 54, 30, '900');
    }

    if (patSub) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.84)';
      fitText(ctx, patSub, textCx, subY, textMaxW - 20, 22, 15, '700', '"Tajawal", "Alexandria", sans-serif');
    }

    afterHeaderY = cardY + headerH;
  } else {
    // Minimal clean 8px Indigo + 4px Orange executive top trim when patronage is hidden
    ctx.fillStyle = PALETTE_1001.indigoCore;
    ctx.fillRect(cardX, cardY, cardW, 10);
    ctx.fillStyle = PALETTE_1001.orangeCore;
    ctx.fillRect(cardX, cardY + 10, cardW, 4);
    afterHeaderY = cardY + 34;
  }

  // =========================================================================
  // ZONE 8 (PRE-CLIP): SLEEK SOLID INDIGO FOOTER BAND (ZERO WAVES / ZERO NOISE)
  // =========================================================================
  const footerH = 104;
  const footerY = cardY + cardH - footerH;

  const fGrad = ctx.createLinearGradient(cardX, footerY, cardX + cardW, footerY + footerH);
  fGrad.addColorStop(0, theme.footerBgStart);
  fGrad.addColorStop(0.5, theme.footerBgEnd);
  fGrad.addColorStop(1, theme.footerBgStart);
  ctx.fillStyle = fGrad;
  ctx.fillRect(cardX, footerY, cardW, footerH);

  // Crisp 4px 1001 Orange top rule on footer band
  const footOrange = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
  footOrange.addColorStop(0, PALETTE_1001.orangeDeep);
  footOrange.addColorStop(0.5, PALETTE_1001.orangeBright);
  footOrange.addColorStop(1, PALETTE_1001.orangeDeep);
  ctx.fillStyle = footOrange;
  ctx.fillRect(cardX, footerY, cardW, 4);

  ctx.restore(); // end card clip

  // Outer Crisp Frame Line around Card
  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.stroke();

  // Subtle Inner Architectural Hairline (only in the clean middle body area!)
  ctx.strokeStyle = theme.borderInner;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(cardX + 20, afterHeaderY + 20, cardW - 40, footerY - afterHeaderY - 40, 12);
  ctx.stroke();

  // =========================================================================
  // ZONE 2: CLEAN SYMMETRICAL OFFICIAL LOGOS ROW
  // =========================================================================
  const showStats = Boolean(d.showStats);
  const logoCenterY = afterHeaderY + (showStats ? 78 : 92);

  const drawVerticalDivider = (vx, halfH = 38) => {
    ctx.strokeStyle = theme.dividerColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, logoCenterY - halfH);
    ctx.lineTo(vx, logoCenterY + halfH);
    ctx.stroke();
  };

  if (showMasdarInTop && logoMasdar?.width) {
    drawVerticalDivider(776, 38);
    drawVerticalDivider(424, 38);

    // RIGHT: Abdaa Club
    if (logoAbdaa?.width) {
      const abH = 78;
      const abW = (logoAbdaa.width / logoAbdaa.height) * abH;
      ctx.drawImage(logoAbdaa, 1020, logoCenterY - abH / 2, abW, abH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.logoPrimary;
    ctx.font = '900 28px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('نادي أبدع', 1006, logoCenterY - 14);
    ctx.font = '700 18px "Alexandria", "Tajawal", sans-serif';
    ctx.fillStyle = theme.logoSecondary;
    ctx.fillText('للمهارات الذكية', 1006, logoCenterY + 16);
    ctx.restore();

    // CENTER: 1001 Digital Kids
    let leftEdge1001 = 626;
    if (logo1001?.width) {
      const lH = 80;
      const lW = (logo1001.width / logo1001.height) * lH;
      const lx = 754 - lW;
      leftEdge1001 = lx;
      ctx.drawImage(logo1001, lx, logoCenterY - lH / 2, lW, lH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.logoPrimary;
    ctx.font = '900 25px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('طفل رقمي', leftEdge1001 - 10, logoCenterY - 11);
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = '900 13.5px "Alexandria", sans-serif';
    ctx.fillStyle = theme.logoSecondary;
    ctx.fillText('1001 DIGITAL KIDS', leftEdge1001 - 10, logoCenterY + 16);
    ctx.restore();

    // LEFT: Masdar Partner
    const mCenterX = 248;
    const hasCaption = Boolean((d.masdarCaption || '').trim());
    const maxW = 228;
    const maxH = hasCaption ? 48 : 60;
    const aspect = logoMasdar.width / logoMasdar.height;
    let drawW = maxH * aspect;
    let drawH = maxH;
    if (drawW > maxW) {
      drawW = maxW;
      drawH = drawW / aspect;
    }
    const logoY = hasCaption ? logoCenterY + 11 : logoCenterY;

    ctx.save();
    if (hasCaption) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme.accentOrange;
      fitText(ctx, d.masdarCaption.trim(), mCenterX, logoCenterY - 30, 270, 14.5, 11, '800');
    }
    if (masdarSpec.needsDarkPill) {
      ctx.fillStyle = PALETTE_1001.indigoDark;
      ctx.beginPath();
      ctx.roundRect(mCenterX - drawW / 2 - 14, logoY - drawH / 2 - 7, drawW + 28, drawH + 14, 10);
      ctx.fill();
    } else if (masdarSpec.needsLightPill) {
      ctx.fillStyle = PALETTE_1001.white;
      ctx.beginPath();
      ctx.roundRect(mCenterX - drawW / 2 - 14, logoY - drawH / 2 - 7, drawW + 28, drawH + 14, 10);
      ctx.fill();
    }
    ctx.drawImage(logoMasdar, mCenterX - drawW / 2, logoY - drawH / 2, drawW, drawH);
    ctx.restore();
  } else {
    // Classic Executive 2-Logo Header: [Abdaa (Right)] | [1001 Digital Kids (Left)]
    drawVerticalDivider(W / 2, 40);

    if (logoAbdaa?.width) {
      const abH = 86;
      const abW = (logoAbdaa.width / logoAbdaa.height) * abH;
      ctx.drawImage(logoAbdaa, W / 2 + 228, logoCenterY - abH / 2, abW, abH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.logoPrimary;
    ctx.font = '900 32px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('نادي أبدع', W / 2 + 214, logoCenterY - 15);
    ctx.font = '700 20px "Alexandria", "Tajawal", sans-serif';
    ctx.fillStyle = theme.logoSecondary;
    ctx.fillText('للمهارات الذكية', W / 2 + 214, logoCenterY + 19);
    ctx.restore();

    let leftEdgeOf1001 = W / 2 - 170;
    if (logo1001?.width) {
      const lH = 88;
      const lW = (logo1001.width / logo1001.height) * lH;
      const lx = W / 2 - 28 - lW;
      leftEdgeOf1001 = lx;
      ctx.drawImage(logo1001, lx, logoCenterY - lH / 2, lW, lH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.logoPrimary;
    ctx.font = '900 30px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('طفل رقمي', leftEdgeOf1001 - 12, logoCenterY - 11);
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = '900 15.5px "Alexandria", sans-serif';
    ctx.fillStyle = theme.logoSecondary;
    ctx.fillText('1001 DIGITAL KIDS', leftEdgeOf1001 - 12, logoCenterY + 19);
    ctx.restore();
  }

  // Clean horizontal divider beneath logos
  const ruleAfterLogosY = logoCenterY + 64;
  drawMinimalAccentRule(ctx, W / 2, ruleAfterLogosY, 440, 64, theme.dividerColor, theme.accentOrange);

  // =========================================================================
  // ZONE 3: MINIMALIST EXECUTIVE «دعوة حضور رسمية» TITLE
  // =========================================================================
  const badgeY = ruleAfterLogosY + (showStats ? 54 : 68);
  const badgeW = 390;
  const badgeH = 62;

  ctx.save();
  ctx.fillStyle = theme.badgeBg;
  ctx.strokeStyle = theme.badgeBorder;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(W / 2 - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 31);
  ctx.fill();
  ctx.stroke();

  // Two small clean 1001 Orange accent dots inside pill ends
  ctx.fillStyle = theme.accentOrange;
  ctx.beginPath();
  ctx.arc(W / 2 - badgeW / 2 + 26, badgeY, 5, 0, Math.PI * 2);
  ctx.arc(W / 2 + badgeW / 2 - 26, badgeY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.badgeText;
  fitText(ctx, d.headerBadge || 'دعوة حضور رسمية', W / 2, badgeY + 1, badgeW - 86, 30, 20, '900');
  ctx.restore();

  // =========================================================================
  // ZONE 4: HONORED GUEST EXECUTIVE NAMEPLATE
  // =========================================================================
  const nameBoxY = badgeY + (showStats ? 56 : 68);
  const nameBoxH = 92;
  const nameBoxW = 940;
  const nameBoxX = (W - nameBoxW) / 2;

  ctx.save();
  ctx.fillStyle = theme.guestPlateBg;
  ctx.strokeStyle = theme.guestPlateBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(nameBoxX, nameBoxY, nameBoxW, nameBoxH, 14);
  ctx.fill();
  ctx.stroke();

  // Clean vertical 1001 Orange protocol accent bar on BOTH ends for executive balance
  ctx.fillStyle = theme.accentOrangeSolid;
  ctx.beginPath();
  ctx.roundRect(nameBoxX + nameBoxW - 10, nameBoxY + 14, 6, nameBoxH - 28, 3);
  ctx.roundRect(nameBoxX + 4, nameBoxY + 14, 6, nameBoxH - 28, 3);
  ctx.fill();

  ctx.fillStyle = theme.guestNameColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(
    ctx,
    (d.guestName || 'ضيفنا الكريم المحترم').trim(),
    W / 2,
    nameBoxY + nameBoxH / 2 + 2,
    nameBoxW - 80,
    46,
    25,
    '900'
  );
  ctx.restore();

  const hasGuestTitle = Boolean((d.guestTitle || '').trim());
  const titleY = nameBoxY + nameBoxH + 38;
  if (hasGuestTitle) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.guestTitleColor;
    fitText(ctx, d.guestTitle.trim(), W / 2, titleY, 920, 30, 19, '800');
    ctx.restore();
  }

  // =========================================================================
  // ZONE 5: FORMAL OCCASION HEADLINE & INVITATION LETTER (GENEROUS BREATHING SPACE)
  // =========================================================================
  const occY1 = hasGuestTitle ? titleY + (showStats ? 66 : 82) : nameBoxY + nameBoxH + 74;
  const occY2 = occY1 + 58;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.headingPrimary;
  fitText(ctx, d.occasionLine1 || 'لحفل تخرج الدفعة الأولى', W / 2, occY1, 960, 36, 24, '900');

  ctx.fillStyle = theme.headingAccent;
  fitText(ctx, d.occasionLine2 || 'من مبادرة «1001 طفل رقمي»', W / 2, occY2, 980, 48, 28, '900');
  ctx.restore();

  // Clean formal invitation letter body
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const bodyFontSz = showStats ? 27 : 30;
  const bodyStep = showStats ? 40 : 48;
  const hlFontSz = showStats ? 25 : 27;
  const hlStep = showStats ? 37 : 44;

  ctx.font = `700 ${bodyFontSz}px "Tajawal", "Alexandria", sans-serif`;
  ctx.fillStyle = theme.bodyText;
  const bodyLines = wrapArabicParagraph(ctx, d.bodyText, 940).slice(0, 4);

  let textCursorY = occY2 + (showStats ? 64 : 78);
  bodyLines.forEach((line) => {
    fitText(ctx, line, W / 2, textCursorY, 960, bodyFontSz, 20, '700', '"Tajawal", sans-serif');
    textCursorY += bodyStep;
  });

  textCursorY += showStats ? 14 : 22;
  ctx.fillStyle = theme.highlightText;
  ctx.font = `800 ${hlFontSz}px "Tajawal", "Alexandria", sans-serif`;
  const hlLines = wrapArabicParagraph(ctx, d.highlightText, 920).slice(0, 3);
  hlLines.forEach((line) => {
    fitText(ctx, line, W / 2, textCursorY, 940, hlFontSz, 19, '800', '"Tajawal", sans-serif');
    textCursorY += hlStep;
  });
  ctx.restore();

  // =========================================================================
  // ZONE 6 (OPTIONAL): MINIMALIST 3-METRIC ROW (ONLY IF USER ENABLES showStats)
  // =========================================================================
  let afterBodyY = textCursorY;
  if (showStats) {
    const statsY = Math.max(1078, Math.min(1140, textCursorY + 24));
    const statW = 286;
    const statH = 112;
    const statGap = 28;
    const totalStatsW = statW * 3 + statGap * 2;
    const startStatX = (W - totalStatsW) / 2;

    const statDefs = [
      { x: startStatX + (statW + statGap) * 2, num: d.stat1Num, label: d.stat1Label },
      { x: startStatX + (statW + statGap) * 1, num: d.stat2Num, label: d.stat2Label },
      { x: startStatX, num: d.stat3Num, label: d.stat3Label }
    ];

    statDefs.forEach((st) => {
      const cx = st.x + statW / 2;
      ctx.save();
      ctx.fillStyle = theme.statCardBg;
      ctx.strokeStyle = theme.statCardBorder;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(st.x, statsY, statW, statH, 14);
      ctx.fill();
      ctx.stroke();

      // Subtle crisp 1001 Orange top bar
      ctx.fillStyle = theme.accentOrange;
      ctx.beginPath();
      ctx.roundRect(st.x + statW / 2 - 34, statsY, 68, 4, 2);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme.statNumColor;
      fitText(ctx, String(st.num || ''), cx, statsY + 42, statW - 24, 38, 24, '900');

      ctx.fillStyle = theme.statLabelColor;
      const singleLabel = String(st.label || '').replace(/\n+/g, ' ').trim();
      fitText(ctx, singleLabel, cx, statsY + 84, statW - 22, 18.5, 13.5, '800', '"Tajawal", sans-serif');
      ctx.restore();
    });

    afterBodyY = statsY + statH;
  }

  // =========================================================================
  // ZONE 7: CLOSING LINE & CLEAN 3-COLUMN EVENT SCHEDULE BAR (Date | Time | Venue)
  // =========================================================================
  const infoSectionTop = footerY - 196;
  const closingText = String(d.closingRibbon || '').trim();
  if (closingText) {
    const closeY = showStats
      ? Math.min(infoSectionTop - 46, afterBodyY + 44)
      : Math.min(infoSectionTop - 56, Math.max(afterBodyY + 42, infoSectionTop - 74));

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.closingText;
    fitText(ctx, closingText, W / 2, closeY, 920, 29, 20, '800');
    ctx.restore();
  }

  // Clean horizontal separator above Event Schedule Bar
  drawMinimalAccentRule(ctx, W / 2, infoSectionTop, 460, 56, theme.dividerColor, theme.accentOrange);

  const infoY = infoSectionTop + 50;

  // Clean vertical hairline dividers between Date | Time | Venue
  ctx.strokeStyle = theme.dividerColor;
  ctx.lineWidth = 1.6;
  [444, 756].forEach((vx) => {
    ctx.beginPath();
    ctx.moveTo(vx, infoY - 14);
    ctx.lineTo(vx, infoY + 96);
    ctx.stroke();
  });

  // Right Column: Date
  drawCalendarIcon(ctx, 916, infoY + 4, theme.accentOrange);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.infoPrimary;
  fitText(ctx, d.dateLine1 || 'الجمعة', 916, infoY + 50, 260, 28, 19, '900');
  ctx.fillStyle = theme.infoSecondary;
  fitText(ctx, d.dateLine2 || '27 تشرين الثاني 2026', 916, infoY + 84, 280, 24, 17, '700', '"Tajawal", sans-serif');

  // Center Column: Time
  drawClockIcon(ctx, 600, infoY + 4, theme.accentOrange);
  ctx.fillStyle = theme.infoPrimary;
  fitText(ctx, d.timeLine1 || 'الساعة', 600, infoY + 50, 240, 28, 19, '900');
  ctx.fillStyle = theme.infoSecondary;
  fitText(ctx, d.timeLine2 || '3:00 عصراً', 600, infoY + 84, 260, 24, 17, '700', '"Tajawal", sans-serif');

  // Left Column: Venue
  drawMapPinIcon(ctx, 284, infoY + 4, theme.accentOrange);
  ctx.fillStyle = theme.infoPrimary;
  fitText(ctx, d.venueLine1 || 'قصر الثقافة', 284, infoY + 50, 260, 28, 19, '900');
  ctx.fillStyle = theme.infoSecondary;
  fitText(ctx, d.venueLine2 || 'النجف الأشرف', 284, infoY + 84, 280, 24, 17, '700', '"Tajawal", sans-serif');

  // =========================================================================
  // ZONE 8 CONTENT: CLEAN FOOTER CONTENT (Masdar Partner Lockup OR Motto)
  // =========================================================================
  const footCenterY = footerY + footerH / 2 + 2;

  if (showMasdarInFooter && logoMasdar?.width) {
    ctx.save();
    const maxLogoH = 42;
    const maxLogoW = 160;
    const aspect = logoMasdar.width / logoMasdar.height;
    let drawW = maxLogoH * aspect;
    let drawH = maxLogoH;
    if (drawW > maxLogoW) {
      drawW = maxLogoW;
      drawH = drawW / aspect;
    }

    const caption = (d.masdarCaption || '').trim();
    const isCorner = masdarPlacement === 'bottom_corner';

    if (isCorner) {
      const cx = cardX + 126;
      if (masdarSpec.needsLightPill) {
        ctx.fillStyle = PALETTE_1001.white;
        ctx.beginPath();
        ctx.roundRect(cx - drawW / 2 - 12, footCenterY - drawH / 2 - 5, drawW + 24, drawH + 10, 10);
        ctx.fill();
      }
      ctx.drawImage(logoMasdar, cx - drawW / 2, footCenterY - drawH / 2, drawW, drawH);

      // Clean motto on right side of footer
      if (d.motto?.trim()) {
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
        fitText(ctx, d.motto.trim(), cardX + cardW - 56, footCenterY, 560, 22, 15, '800');
      }
    } else if (caption) {
      ctx.font = '800 18px "Alexandria", "Tajawal", sans-serif';
      const capW = Math.min(ctx.measureText(caption).width, 280);
      const gap = 22;
      const pillPadX = masdarSpec.needsLightPill ? 14 : 0;
      const logoBoxW = drawW + pillPadX * 2;
      const totalW = capW + gap + 2 + gap + logoBoxW;
      const rightX = W / 2 + totalW / 2;
      const leftX = W / 2 - totalW / 2;

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = PALETTE_1001.white;
      fitText(ctx, caption, rightX, footCenterY, 280, 18, 13, '800');

      const sepX = rightX - capW - gap;
      ctx.strokeStyle = PALETTE_1001.orangeBright;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sepX, footCenterY - 16);
      ctx.lineTo(sepX, footCenterY + 16);
      ctx.stroke();

      const logoCenterX = leftX + logoBoxW / 2;
      if (masdarSpec.needsLightPill) {
        ctx.fillStyle = PALETTE_1001.white;
        ctx.beginPath();
        ctx.roundRect(leftX, footCenterY - drawH / 2 - 6, logoBoxW, drawH + 12, 10);
        ctx.fill();
      }
      ctx.drawImage(logoMasdar, logoCenterX - drawW / 2, footCenterY - drawH / 2, drawW, drawH);
    } else {
      const pillPadX = masdarSpec.needsLightPill ? 16 : 0;
      const boxHalfW = drawW / 2 + pillPadX;
      if (masdarSpec.needsLightPill) {
        ctx.fillStyle = PALETTE_1001.white;
        ctx.beginPath();
        ctx.roundRect(W / 2 - boxHalfW, footCenterY - drawH / 2 - 6, boxHalfW * 2, drawH + 12, 10);
        ctx.fill();
      }
      ctx.drawImage(logoMasdar, W / 2 - drawW / 2, footCenterY - drawH / 2, drawW, drawH);
    }
    ctx.restore();
  } else if (d.motto?.trim()) {
    // Clean centered motto in solid Indigo footer when Masdar is not in footer
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PALETTE_1001.white;
    fitText(ctx, d.motto.trim(), W / 2, footCenterY, 820, 24, 16, '800');
    ctx.restore();
  }

  // Optional QR Verification Stamp (cleanly positioned bottom-right above footer)
  if (d.showQr && qrImg?.width) {
    ctx.save();
    ctx.fillStyle = PALETTE_1001.white;
    ctx.strokeStyle = PALETTE_1001.orangeCore;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(W - 172, footerY - 122, 106, 106, 12);
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(qrImg, W - 165, footerY - 115, 92, 92);
    ctx.restore();
  }

  ctx.restore();
}

// ---------- Export Helpers: PNG, Single A4 PDF, Batch PNG ZIP & Batch Multi-Page A4 PDF ----------

export async function renderInvitationPngOutput(data) {
  const canvas = document.createElement('canvas');
  await renderInvitationToCanvas(canvas, data);
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const filename = `دعوة حضور رسمية - ${sanitizeFilename(data.guestName || 'ضيف شرف')}.png`;
  return { dataUrl, blob, filename };
}

export async function downloadInvitationPng(data) {
  const { dataUrl, filename } = await renderInvitationPngOutput(data);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
  return filename;
}

function openOrPrintPdfHtml(html, directPrint = false) {
  const printViaIframe = () => {
    const old = document.getElementById('abdaa-invite-pdf-iframe');
    if (old) old.remove();
    const iframe = document.createElement('iframe');
    iframe.id = 'abdaa-invite-pdf-iframe';
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;';
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
      setTimeout(() => iframe.remove(), 4000);
    }, 450);
  };

  if (directPrint) {
    printViaIframe();
    return;
  }

  const win = window.open('', '_blank', 'width=940,height=1100');
  if (!win) {
    printViaIframe();
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function buildInvitationsPdfHtml(pagesDataUrls, titleText) {
  const pagesHtml = pagesDataUrls
    .map(
      (src, idx) => `
      <div class="pdf-page">
        <img src="${src}" alt="دعوة حضور رسمية ${idx + 1}" />
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${titleText}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0; padding: 16px; background: #00185C; font-family: "Tahoma", Arial, sans-serif;
      display: flex; flex-direction: column; align-items: center; gap: 16px;
    }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center;
      background: #002884; color: #fff; padding: 10px 20px; border-radius: 14px;
      border: 1px solid rgba(255,115,0,0.6);
    }
    .btn {
      background: linear-gradient(135deg, #F25C05, #FF8C00); color: #fff; border: none;
      border-radius: 10px; padding: 9px 22px; font-weight: 800; font-size: 13px; cursor: pointer;
    }
    .btn-sec {
      background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.25);
      border-radius: 10px; padding: 9px 16px; font-weight: 700; font-size: 13px; cursor: pointer;
    }
    .pdf-page {
      width: 210mm; height: 297mm; background: #00185C;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; box-shadow: 0 22px 60px rgba(0,0,0,0.45);
      page-break-after: always;
    }
    .pdf-page:last-child { page-break-after: auto; }
    .pdf-page img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    @media print {
      body { background: #00185C; padding: 0; gap: 0; }
      .toolbar { display: none !important; }
      .pdf-page { width: 210mm; height: 297mm; box-shadow: none; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <span><strong>${titleText}</strong> (${pagesDataUrls.length} ${pagesDataUrls.length > 1 ? 'دعوات' : 'دعوة'}) — اختر "حفظ كـ PDF" من نافذة الطباعة</span>
    <button class="btn" onclick="window.print()">📄 طباعة / حفظ كملف PDF (A4)</button>
    <button class="btn-sec" onclick="window.close()">إغلاق</button>
  </div>
  ${pagesHtml}
</body>
</html>`;
}

export async function exportInvitationPdf(data, { directPrint = true } = {}) {
  const { dataUrl } = await renderInvitationPngOutput(data);
  const title = `دعوة حضور رسمية — ${data.guestName || 'مبادرة 1001 طفل رقمي'}`;
  const html = buildInvitationsPdfHtml([dataUrl], title);
  openOrPrintPdfHtml(html, directPrint);
}

export async function exportBatchInvitationsPngZip(guestsList, baseData, onProgress) {
  const entries = [];
  const usedNames = new Set();
  const total = guestsList.length;

  for (let i = 0; i < total; i++) {
    const g = guestsList[i];
    if (onProgress) onProgress(i, total, g.guestName);
    const { blob, filename } = await renderInvitationPngOutput({
      ...baseData,
      guestName: g.guestName,
      guestTitle: g.guestTitle
    });
    if (!blob) continue;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let name = `${String(i + 1).padStart(2, '0')} - ${filename}`;
    let dup = 2;
    while (usedNames.has(name)) name = name.replace(/\.png$/i, ` (${dup++}).png`);
    usedNames.add(name);
    entries.push({ name, data: bytes });
    if (i % 3 === 2) await new Promise((r) => setTimeout(r, 0));
  }

  if (onProgress) onProgress(total, total, 'جارٍ ضغط ملف ZIP...');
  const zipBlob = buildZipBlob(entries);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `abdaa-1001-invitations-png-${entries.length}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return entries.length;
}

export async function exportBatchInvitationsPdf(guestsList, baseData, onProgress, { directPrint = false } = {}) {
  const urls = [];
  const total = guestsList.length;
  for (let i = 0; i < total; i++) {
    const g = guestsList[i];
    if (onProgress) onProgress(i, total, g.guestName);
    const { dataUrl } = await renderInvitationPngOutput({
      ...baseData,
      guestName: g.guestName,
      guestTitle: g.guestTitle
    });
    urls.push(dataUrl);
    if (i % 3 === 2) await new Promise((r) => setTimeout(r, 0));
  }
  if (onProgress) onProgress(total, total, 'جاهز للتصدير PDF...');
  const html = buildInvitationsPdfHtml(urls, `دعوات حضور رسمية — مبادرة 1001 طفل رقمي`);
  openOrPrintPdfHtml(html, directPrint);
  return urls.length;
}
