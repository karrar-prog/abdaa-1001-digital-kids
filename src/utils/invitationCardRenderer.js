// محرك تصميم وتصدير بطاقات الدعوة الرسمية عالية الدقة (PNG 1200×1550 + A4 PDF فردي وجماعي)
// مطابق تماماً للهوية البصرية الملكية لنادي أبدع للمهارات الذكية × مبادرة 1001 طفل رقمي

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

function resolveMasdarLogoSource(d) {
  if (!d.showMasdarLogo) return { src: null, needsWhiteTint: false, needsLightPill: false, needsDarkPill: false };
  const placement = d.masdarPlacement || 'bottom_wave';
  const variant = d.masdarVariant || 'auto';
  const onDarkBg = placement === 'bottom_wave' || placement === 'bottom_corner';

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
  // 'auto' — smart contrast match to background
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
  motto: 'نصنع جيلاً يبرمج المستقبل',
  showPatronage: false,
  patronageText: 'برعاية فخامة رئيس الجمهورية',
  showMasdarLogo: false,
  masdarPlacement: 'bottom_wave', // 'bottom_wave' | 'top_triple' | 'bottom_corner'
  masdarVariant: 'auto', // 'auto' | 'full_blue' | 'full_white' | 'mark' | 'custom'
  masdarCaption: 'الشريك التقني والمنظم',
  customMasdarLogoUrl: '',
  showQr: false,
  headerBadge: 'دعوة حضور',
  guestName: 'المهندس الحاج زهير شربة المحترم',
  guestTitle: 'رئيس غرفة تجارة النجف الأشرف',
  occasionLine1: 'لحفل تخرج الدفعة الأولى',
  occasionLine2: 'من مبادرة «1001 طفل رقمي»',
  bodyText:
    'بكل اعتزاز، يتشرف نادي أبدع للمهارات الذكية بدعوتكم لحضور\nحفل تخرج 172 طفلاً رقمياً في الدفعة الأولى، من بين 700 طفل\nأكملوا متطلبات المبادرة، من أصل 896 طفلاً التحقوا بها.',
  highlightText:
    'إن تشريفكم هذه المناسبة ومشاركة أطفالنا فرحتهم،\nتمثل دعماً لمسيرتهم نحو الإبداع وصناعة المستقبل.',
  stat1Num: '172',
  stat1Label: 'خريجاً في الدفعة الأولى\n(طفلاً رقمياً)',
  stat2Num: '700',
  stat2Label: 'الذين أكملوا\nمتطلبات المبادرة',
  stat3Num: '896',
  stat3Label: 'طفلاً التحقوا بالمبادرة',
  closingRibbon: 'بحضوركم تكتمل فرحتنا... وتكبر أحلام أطفالنا',
  dateLine1: 'الجمعة',
  dateLine2: '27 نوفمبر 2026',
  timeLine1: 'الساعة',
  timeLine2: '3:00 مساءً',
  venueLine1: 'قصر الثقافة',
  venueLine2: 'النجف الأشرف'
};

export const INVITATION_TEMPLATES = [
  {
    id: 'vip',
    label: 'شخصية رسمية / VIP',
    emoji: '👑',
    patch: {
      headerBadge: 'دعوة حضور',
      guestName: 'المهندس الحاج زهير شربة المحترم',
      guestTitle: 'رئيس غرفة تجارة النجف الأشرف',
      bodyText:
        'بكل اعتزاز، يتشرف نادي أبدع للمهارات الذكية بدعوتكم لحضور\nحفل تخرج 172 طفلاً رقمياً في الدفعة الأولى، من بين 700 طفل\nأكملوا متطلبات المبادرة، من أصل 896 طفلاً التحقوا بها.',
      highlightText:
        'إن تشريفكم هذه المناسبة ومشاركة أطفالنا فرحتهم،\nتمثل دعماً لمسيرتهم نحو الإبداع وصناعة المستقبل.',
      closingRibbon: 'بحضوركم تكتمل فرحتنا... وتكبر أحلام أطفالنا'
    }
  },
  {
    id: 'sponsor',
    label: 'شركة / جهة راعية',
    emoji: '🤝',
    patch: {
      headerBadge: 'دعوة شريك وراعٍ',
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
      headerBadge: 'دعوة عائلية كريمة',
      guestName: 'عائلة البطل الخريج الكريمة',
      guestTitle: 'أولياء أمور أبطال الدفعة الأولى',
      bodyText:
        'بكل فخر وسعادة، يتشرف نادي أبدع للمهارات الذكية بدعوتكم\nلمشاركتنا فرحة تتويج أبنائكم الأبطال ضمن خريجي الدفعة الأولى\nلمبادرة «1001 طفل رقمي» وافتتاح معرض ابتكاراتهم الحية.',
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

// ---------- Vector Ornament Helpers ----------

function drawStar5(ctx, cx, cy, outerR, innerR, color) {
  ctx.save();
  ctx.beginPath();
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / 5;
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawGoldLaurel(ctx, cx, cy, side = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(side, 1);

  const grad = ctx.createLinearGradient(0, -56, 0, 56);
  grad.addColorStop(0, '#fde047');
  grad.addColorStop(0.5, '#d97706');
  grad.addColorStop(1, '#92400e');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(14, 52);
  ctx.quadraticCurveTo(-24, 4, 8, -50);
  ctx.stroke();

  ctx.fillStyle = grad;
  const leafCount = 7;
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);
    const px = 12 - Math.sin(t * Math.PI) * 20;
    const py = 44 - t * 88;

    // Outer leaf
    ctx.save();
    ctx.translate(px - 6, py);
    ctx.rotate(-0.7 + t * 0.45);
    ctx.beginPath();
    ctx.ellipse(-8, 0, 14, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Inner leaf
    if (i > 0) {
      ctx.save();
      ctx.translate(px + 6, py + 4);
      ctx.rotate(0.55 - t * 0.35);
      ctx.beginPath();
      ctx.ellipse(8, 0, 12, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}

function tracePointedRibbon(ctx, x, y, w, h, pointDepth = 34) {
  const cy = y + h / 2;
  ctx.beginPath();
  ctx.moveTo(x + pointDepth, y);
  ctx.lineTo(x + w - pointDepth, y);
  ctx.lineTo(x + w, cy);
  ctx.lineTo(x + w - pointDepth, y + h);
  ctx.lineTo(x + pointDepth, y + h);
  ctx.lineTo(x, cy);
  ctx.closePath();
}

function drawGradCapIcon(ctx, cx, cy, color = '#fde047') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  // Diamond top
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(22, -3);
  ctx.lineTo(0, 7);
  ctx.lineTo(-22, -3);
  ctx.closePath();
  ctx.fill();
  // Cap base
  ctx.beginPath();
  ctx.moveTo(-12, 3);
  ctx.lineTo(-12, 11);
  ctx.quadraticCurveTo(0, 17, 12, 11);
  ctx.lineTo(12, 3);
  ctx.closePath();
  ctx.fill();
  // Tassel
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(19, -2);
  ctx.lineTo(19, 13);
  ctx.stroke();
  ctx.restore();
}

function drawCheckCircleIcon(ctx, cx, cy, color = '#fde047') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-7, 1);
  ctx.lineTo(-1.5, 6.5);
  ctx.lineTo(8, -5.5);
  ctx.stroke();
  ctx.restore();
}

function drawPeopleIcon(ctx, cx, cy, color = '#fde047') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  // Center person
  ctx.beginPath();
  ctx.arc(0, -7, 6.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 11, 10.5, Math.PI, 0);
  ctx.fill();
  // Side persons
  [-13, 13].forEach((ox) => {
    ctx.beginPath();
    ctx.arc(ox, -4, 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox, 11, 7.5, Math.PI, 0);
    ctx.fill();
  });
  ctx.restore();
}

function drawCalendarIcon(ctx, cx, cy, color = '#d9921a') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(-22, -18, 44, 40, 8);
  ctx.stroke();
  ctx.fillRect(-22, -18, 44, 12);
  // Top rings
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-11, -24);
  ctx.lineTo(-11, -14);
  ctx.moveTo(11, -24);
  ctx.lineTo(11, -14);
  ctx.stroke();
  // Grid dots
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      ctx.fillRect(-13 + c * 11, 0 + r * 10, 5, 5);
    }
  }
  ctx.restore();
}

function drawClockIcon(ctx, cx, cy, color = '#d9921a') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, 21, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.lineTo(0, 1);
  ctx.lineTo(9, 6);
  ctx.stroke();
  ctx.restore();
}

function drawMapPinIcon(ctx, cx, cy, color = '#d9921a') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.bezierCurveTo(-18, 8, -20, -16, 0, -22);
  ctx.bezierCurveTo(20, -16, 18, 8, 0, 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -4, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function fitText(ctx, text, x, y, maxW, startPx, minPx, weight = '900', family = '"Alexandria", "Tajawal", sans-serif') {
  let sz = startPx;
  ctx.font = `${weight} ${sz}px ${family}`;
  while (ctx.measureText(text).width > maxW && sz > minPx) {
    sz -= 2;
    ctx.font = `${weight} ${sz}px ${family}`;
  }
  ctx.fillText(text, x, y);
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

// ---------- Main High-Res Invitation Canvas Renderer (1200 × 1550 px) ----------

export async function renderInvitationToCanvas(canvas, rawData = {}) {
  const d = { ...DEFAULT_INVITATION_DATA, ...rawData };
  const W = 1200;
  const H = 1550;

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
          code: `VIP-INV-2026`,
          name: d.guestName || 'ضيف شرف',
          role: d.guestTitle || 'دعوة حضور رسمية',
          track: 'حفل تخرج مبادرة 1001 طفل رقمي',
          extra: d.venueLine1 || 'قصر الثقافة'
        },
        180
      ).then((url) => loadCachedImg(url))
    : Promise.resolve(null);

  const masdarSpec = resolveMasdarLogoSource(d);
  const masdarPlacement = d.masdarPlacement || 'bottom_wave';
  const showMasdarInTop = Boolean(d.showMasdarLogo && masdarPlacement === 'top_triple');
  const showMasdarInBottomWave = Boolean(d.showMasdarLogo && masdarPlacement === 'bottom_wave');
  const showMasdarInBottomCorner = Boolean(d.showMasdarLogo && masdarPlacement === 'bottom_corner');

  const [logoAbdaa, logo1001, rawLogoMasdar, qrImg] = await Promise.all([
    loadCachedImg('/brand/abdaa-logo.png'),
    loadCachedImg('/brand/logo-1001-kids.png'),
    masdarSpec.src ? loadCachedImg(masdarSpec.src) : Promise.resolve(null),
    qrPromise
  ]);
  const logoMasdar = rawLogoMasdar && masdarSpec.needsWhiteTint ? createWhiteTintedCanvas(rawLogoMasdar) : rawLogoMasdar;

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Deep Royal Navy Outer Background
  const outerBg = ctx.createLinearGradient(0, 0, W, H);
  outerBg.addColorStop(0, '#03102b');
  outerBg.addColorStop(0.5, '#072255');
  outerBg.addColorStop(1, '#030d24');
  ctx.fillStyle = outerBg;
  ctx.fillRect(0, 0, W, H);

  // Subtle gold radial glow behind card frame
  const glow = ctx.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 820);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // 2. Inner Luminous White Rounded Card
  const cardX = 32;
  const cardY = 32;
  const cardW = W - 64;
  const cardH = H - 64;
  const cardR = 40;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.clip();

  const cardGrad = ctx.createRadialGradient(W / 2, 540, 80, W / 2, 760, 920);
  cardGrad.addColorStop(0, '#ffffff');
  cardGrad.addColorStop(0.75, '#fcfdff');
  cardGrad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = cardGrad;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // 11. Signature Sweeping Gold & Deep Navy Bottom Waves (drawn inside card clip!)
  const waveLift = showMasdarInBottomWave ? 30 : 0;

  // Upper sweeping metallic gold curve
  const goldWaveGrad = ctx.createLinearGradient(cardX, H - 190 - waveLift, cardX + cardW, H - 32);
  goldWaveGrad.addColorStop(0, '#d97706');
  goldWaveGrad.addColorStop(0.32, '#fde047');
  goldWaveGrad.addColorStop(0.65, '#f59e0b');
  goldWaveGrad.addColorStop(1, '#b45309');

  ctx.fillStyle = goldWaveGrad;
  ctx.beginPath();
  ctx.moveTo(cardX, H - 166 - waveLift * 0.45);
  ctx.bezierCurveTo(
    cardX + cardW * 0.28,
    H - 72 - waveLift * 1.15,
    cardX + cardW * 0.66,
    H - 98 - waveLift * 1.1,
    cardX + cardW,
    H - 184 - waveLift * 0.45
  );
  ctx.lineTo(cardX + cardW, H);
  ctx.lineTo(cardX, H);
  ctx.closePath();
  ctx.fill();

  // Deep royal navy glossy lower wave
  const navyWaveGrad = ctx.createLinearGradient(cardX, H - 160 - waveLift, cardX + cardW, H - 24);
  navyWaveGrad.addColorStop(0, '#041230');
  navyWaveGrad.addColorStop(0.45, '#0b2f73');
  navyWaveGrad.addColorStop(0.8, '#071f4d');
  navyWaveGrad.addColorStop(1, '#020b1f');

  ctx.fillStyle = navyWaveGrad;
  ctx.beginPath();
  ctx.moveTo(cardX, H - 138 - waveLift * 0.45);
  ctx.bezierCurveTo(
    cardX + cardW * 0.30,
    H - 52 - waveLift * 1.2,
    cardX + cardW * 0.68,
    H - 78 - waveLift * 1.15,
    cardX + cardW,
    H - 156 - waveLift * 0.45
  );
  ctx.lineTo(cardX + cardW, H);
  ctx.lineTo(cardX, H);
  ctx.closePath();
  ctx.fill();

  // Subtle glowing blue highlight ribbon inside navy wave
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.24)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cardX, H - 114 - waveLift * 0.35);
  ctx.bezierCurveTo(
    cardX + cardW * 0.32,
    H - 38 - waveLift * 1.0,
    cardX + cardW * 0.68,
    H - 60 - waveLift * 0.95,
    cardX + cardW,
    H - 132 - waveLift * 0.35
  );
  ctx.stroke();

  ctx.restore(); // end card inner clip

  // Metallic Gold Outer Border around white card
  const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  borderGrad.addColorStop(0, '#f59e0b');
  borderGrad.addColorStop(0.25, '#fde68a');
  borderGrad.addColorStop(0.5, '#c4881e');
  borderGrad.addColorStop(0.75, '#fef08a');
  borderGrad.addColorStop(1, '#b45309');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.stroke();

  // Optional Royal Patronage Mini-Banner at Top
  let topOffset = 0;
  if (d.showPatronage && d.patronageText?.trim()) {
    topOffset = 46;
    ctx.save();
    const pGrad = ctx.createLinearGradient(340, 56, 860, 56);
    pGrad.addColorStop(0, '#071b40');
    pGrad.addColorStop(0.5, '#0f3575');
    pGrad.addColorStop(1, '#071b40');
    ctx.fillStyle = pGrad;
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(W / 2 - 230, 56, 460, 42, 21);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde68a';
    fitText(ctx, `★ ${d.patronageText.trim()} ★`, W / 2, 78, 420, 21, 15, '800');
    ctx.restore();
  }

  // 3. Top Official Logos Header (Dual Lockup OR Balanced 3-Partner Lockup when Masdar is in Header)
  const logoCenterY = 136 + topOffset;

  const drawVerticalGoldDivider = (vx, halfH = 52) => {
    const g = ctx.createLinearGradient(vx, logoCenterY - halfH, vx, logoCenterY + halfH);
    g.addColorStop(0, 'rgba(217, 146, 26, 0.2)');
    g.addColorStop(0.5, '#d9921a');
    g.addColorStop(1, 'rgba(217, 146, 26, 0.2)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(vx, logoCenterY - halfH);
    ctx.lineTo(vx, logoCenterY + halfH);
    ctx.stroke();
  };

  if (showMasdarInTop && logoMasdar?.width) {
    // Balanced 3-Logo Executive Header: [Abdaa (Right)] | [1001 Digital Kids (Center)] | [Masdar (Left)]
    drawVerticalGoldDivider(782, 50);
    drawVerticalGoldDivider(418, 50);

    // RIGHT COLUMN (794..1130): Abdaa Robot + Stacked Title
    if (logoAbdaa?.width) {
      const abH = 88;
      const abW = (logoAbdaa.width / logoAbdaa.height) * abH;
      ctx.drawImage(logoAbdaa, 1024, logoCenterY - abH / 2, abW, abH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#09224d';
    ctx.font = '900 32px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('نادي أبدع', 1010, logoCenterY - 16);
    ctx.font = '800 20px "Alexandria", "Tajawal", sans-serif';
    ctx.fillStyle = '#1e3a6e';
    ctx.fillText('للمهارات الذكية', 1010, logoCenterY + 18);
    ctx.restore();

    // CENTER COLUMN (434..766): 1001 Logo + "طفل رقمي / 1001 DIGITAL KIDS"
    let leftEdge1001 = 626;
    if (logo1001?.width) {
      const lH = 88;
      const lW = (logo1001.width / logo1001.height) * lH;
      const lx = 758 - lW;
      leftEdge1001 = lx;
      ctx.drawImage(logo1001, lx, logoCenterY - lH / 2, lW, lH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#09224d';
    ctx.font = '900 28px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('طفل رقمي', leftEdge1001 - 10, logoCenterY - 12);
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = '900 14.5px "Alexandria", sans-serif';
    ctx.fillStyle = '#1e3a6e';
    ctx.fillText('1001 DIGITAL KIDS', leftEdge1001 - 10, logoCenterY + 18);
    ctx.restore();

    // LEFT COLUMN (72..398, center = 235): Masdar Official Partner Lockup
    const mCenterX = 236;
    const hasCaption = Boolean((d.masdarCaption || '').trim());
    const maxW = 248;
    const maxH = hasCaption ? 56 : 70;
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
      ctx.fillStyle = '#b47514';
      fitText(ctx, d.masdarCaption.trim(), mCenterX, logoCenterY - 36, 290, 16, 12, '800');
    }
    if (masdarSpec.needsDarkPill) {
      ctx.fillStyle = '#071b40';
      ctx.strokeStyle = '#d9921a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(mCenterX - drawW / 2 - 16, logoY - drawH / 2 - 8, drawW + 32, drawH + 16, 16);
      ctx.fill();
      ctx.stroke();
    }
    ctx.drawImage(logoMasdar, mCenterX - drawW / 2, logoY - drawH / 2, drawW, drawH);
    ctx.restore();
  } else {
    // Classic 2-Logo Symmetrical Lockup
    drawVerticalGoldDivider(W / 2, 52);

    // Right Side: Stacked Navy Title ("نادي أبدع / للمهارات الذكية") + Abdaa Robot Icon
    if (logoAbdaa?.width) {
      const abH = 100;
      const abW = (logoAbdaa.width / logoAbdaa.height) * abH;
      ctx.drawImage(logoAbdaa, W / 2 + 232, logoCenterY - abH / 2, abW, abH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#09224d';
    ctx.font = '900 35px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('نادي أبدع', W / 2 + 218, logoCenterY - 17);
    ctx.font = '800 22px "Alexandria", "Tajawal", sans-serif';
    ctx.fillStyle = '#1e3a6e';
    ctx.fillText('للمهارات الذكية', W / 2 + 218, logoCenterY + 20);
    ctx.restore();

    // Left Side: Official 1001 Logo + Stacked "طفل رقمي / 1001 DIGITAL KIDS" matching reference lockup
    let leftEdgeOf1001 = W / 2 - 175;
    if (logo1001?.width) {
      const lH = 102;
      const lW = (logo1001.width / logo1001.height) * lH;
      const lx = W / 2 - 28 - lW;
      leftEdgeOf1001 = lx;
      ctx.drawImage(logo1001, lx, logoCenterY - lH / 2, lW, lH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#09224d';
    ctx.font = '900 33px "Alexandria", "Tajawal", sans-serif';
    ctx.fillText('طفل رقمي', leftEdgeOf1001 - 12, logoCenterY - 12);
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = '900 17px "Alexandria", sans-serif';
    ctx.fillStyle = '#1e3a6e';
    ctx.fillText('1001 DIGITAL KIDS', leftEdgeOf1001 - 12, logoCenterY + 22);
    ctx.restore();
  }

  // Golden Motto Line ("نصنع جيلاً يبرمج المستقبل")
  const mottoY = 232 + topOffset * 0.85;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c4881e';
  fitText(ctx, d.motto || 'نصنع جيلاً يبرمج المستقبل', W / 2, mottoY, 900, 31, 20, '900');
  ctx.restore();

  // 4. Regal «دعوة حضور» Crest + Golden Laurels + Horizontal Gold Accent Lines
  const crestY = 318 + topOffset * 0.78;
  const crestW = 420;
  const crestH = 104;

  // Tapering horizontal gold accent lines left & right
  const leftLineGrad = ctx.createLinearGradient(110, crestY, 335, crestY);
  leftLineGrad.addColorStop(0, 'rgba(217, 146, 26, 0)');
  leftLineGrad.addColorStop(1, '#d9921a');
  ctx.strokeStyle = leftLineGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(110, crestY);
  ctx.lineTo(335, crestY);
  ctx.stroke();

  const rightLineGrad = ctx.createLinearGradient(865, crestY, 1090, crestY);
  rightLineGrad.addColorStop(0, '#d9921a');
  rightLineGrad.addColorStop(1, 'rgba(217, 146, 26, 0)');
  ctx.strokeStyle = rightLineGrad;
  ctx.beginPath();
  ctx.moveTo(865, crestY);
  ctx.lineTo(1090, crestY);
  ctx.stroke();

  // Symmetrical Golden Laurel Branches
  drawGoldLaurel(ctx, W / 2 - crestW / 2 - 26, crestY, 1);
  drawGoldLaurel(ctx, W / 2 + crestW / 2 + 26, crestY, -1);

  // Dark Navy Pointed Hexagonal Crest Banner
  ctx.save();
  ctx.shadowColor = 'rgba(7, 27, 64, 0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 7;

  const crestBg = ctx.createLinearGradient(W / 2 - crestW / 2, crestY - crestH / 2, W / 2 + crestW / 2, crestY + crestH / 2);
  crestBg.addColorStop(0, '#041230');
  crestBg.addColorStop(0.5, '#0d2f6b');
  crestBg.addColorStop(1, '#041230');
  ctx.fillStyle = crestBg;
  tracePointedRibbon(ctx, W / 2 - crestW / 2, crestY - crestH / 2, crestW, crestH, 36);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Inner fine gold trim
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
  ctx.lineWidth = 1.5;
  tracePointedRibbon(ctx, W / 2 - crestW / 2 + 8, crestY - crestH / 2 + 6, crestW - 16, crestH - 12, 30);
  ctx.stroke();

  // Crest Title Text in Metallic Gold
  const goldTextGrad = ctx.createLinearGradient(0, crestY - 38, 0, crestY + 14);
  goldTextGrad.addColorStop(0, '#fef08a');
  goldTextGrad.addColorStop(0.55, '#f59e0b');
  goldTextGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = goldTextGrad;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, d.headerBadge || 'دعوة حضور', W / 2, crestY - 12, crestW - 90, 48, 30, '900');

  // Three Golden Stars underneath inside crest
  drawStar5(ctx, W / 2, crestY + 31, 12, 5.2, '#fde047');
  drawStar5(ctx, W / 2 - 34, crestY + 29, 9.5, 4.2, '#f59e0b');
  drawStar5(ctx, W / 2 + 34, crestY + 29, 9.5, 4.2, '#f59e0b');
  ctx.restore();

  // 5. Recipient Name Pointed Cream-Gold Ribbon
  const nameRibY = 398 + topOffset * 0.65;
  const nameRibH = 88;
  const nameRibW = 1016;
  const nameRibX = (W - nameRibW) / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(217, 146, 26, 0.16)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;

  const ribCream = ctx.createLinearGradient(nameRibX, nameRibY, nameRibX + nameRibW, nameRibY);
  ribCream.addColorStop(0, '#fef3c7');
  ribCream.addColorStop(0.2, '#fffdf5');
  ribCream.addColorStop(0.5, '#ffffff');
  ribCream.addColorStop(0.8, '#fffdf5');
  ribCream.addColorStop(1, '#fef3c7');
  ctx.fillStyle = ribCream;
  tracePointedRibbon(ctx, nameRibX, nameRibY, nameRibW, nameRibH, 38);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#d9921a';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  ctx.fillStyle = '#082357';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, (d.guestName || 'ضيفنا الكريم المحترم').trim(), W / 2, nameRibY + nameRibH / 2 + 2, nameRibW - 110, 46, 26, '900');
  ctx.restore();

  // Guest Title / Position directly beneath Name Ribbon
  const hasGuestTitle = Boolean((d.guestTitle || '').trim());
  const titleY = nameRibY + nameRibH + 34;
  if (hasGuestTitle) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f172a';
    fitText(ctx, d.guestTitle.trim(), W / 2, titleY, 960, 33, 21, '800');
    ctx.restore();
  }

  // 6. Event Occasion Headline
  const occY1 = (hasGuestTitle ? titleY + 72 : nameRibY + nameRibH + 58);
  const occY2 = occY1 + 58;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0f172a';
  fitText(ctx, d.occasionLine1 || 'لحفل تخرج الدفعة الأولى', W / 2, occY1, 960, 37, 24, '900');

  const occGold = ctx.createLinearGradient(0, occY2 - 26, 0, occY2 + 26);
  occGold.addColorStop(0, '#b47514');
  occGold.addColorStop(0.5, '#d9921a');
  occGold.addColorStop(1, '#9a610c');
  ctx.fillStyle = occGold;
  fitText(ctx, d.occasionLine2 || 'من مبادرة «1001 طفل رقمي»', W / 2, occY2, 980, 50, 30, '900');
  ctx.restore();

  // 7. Body Invitation Text + Warm Highlight Text
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 29px "Tajawal", "Alexandria", sans-serif';
  ctx.fillStyle = '#1e293b';

  const bodyLines = wrapArabicParagraph(ctx, d.bodyText, 960);
  let textCursorY = occY2 + 64;
  bodyLines.slice(0, 4).forEach((line) => {
    fitText(ctx, line, W / 2, textCursorY, 980, 29, 21, '700', '"Tajawal", sans-serif');
    textCursorY += 43;
  });

  textCursorY += 12;
  ctx.fillStyle = '#1e3a8a';
  ctx.font = '800 27px "Tajawal", "Alexandria", sans-serif';
  const hlLines = wrapArabicParagraph(ctx, d.highlightText, 940);
  hlLines.slice(0, 3).forEach((line) => {
    fitText(ctx, line, W / 2, textCursorY, 960, 27, 20, '800', '"Tajawal", sans-serif');
    textCursorY += 40;
  });
  ctx.restore();

  // 8. Three Regal Arch-Topped Stat Cards
  const statsY = Math.max(962, Math.min(992, textCursorY + 22));
  const statW = 274;
  const statH = 162;
  const statGap = 34;
  const totalStatsW = statW * 3 + statGap * 2;
  const startStatX = (W - totalStatsW) / 2;

  // Ordered RTL: Right = Stat 1 (172), Middle = Stat 2 (700), Left = Stat 3 (896)
  const statDefs = [
    { x: startStatX + (statW + statGap) * 2, num: d.stat1Num, label: d.stat1Label, icon: 'cap' },
    { x: startStatX + (statW + statGap) * 1, num: d.stat2Num, label: d.stat2Label, icon: 'check' },
    { x: startStatX, num: d.stat3Num, label: d.stat3Label, icon: 'people' }
  ];

  statDefs.forEach((st) => {
    const cx = st.x + statW / 2;
    const navyH = 74;

    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.10)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    // White Card Body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(st.x, statsY, statW, statH, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Clip Top Navy Header Section
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(st.x, statsY, statW, statH, 24);
    ctx.clip();
    const sNavy = ctx.createLinearGradient(st.x, statsY, st.x + statW, statsY + navyH);
    sNavy.addColorStop(0, '#051536');
    sNavy.addColorStop(0.5, '#0e306e');
    sNavy.addColorStop(1, '#051536');
    ctx.fillStyle = sNavy;
    ctx.fillRect(st.x, statsY, statW, navyH);
    ctx.fillStyle = '#d9921a';
    ctx.fillRect(st.x, statsY + navyH - 2, statW, 3);
    ctx.restore();

    // Outer Gold Border around Stat Card
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(st.x, statsY, statW, statH, 24);
    ctx.stroke();

    // Top Center Circular Icon Medallion Notch
    ctx.fillStyle = '#071b40';
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, statsY - 2, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (st.icon === 'cap') drawGradCapIcon(ctx, cx, statsY - 2, '#fde047');
    else if (st.icon === 'check') drawCheckCircleIcon(ctx, cx, statsY - 2, '#fde047');
    else drawPeopleIcon(ctx, cx, statsY - 2, '#fde047');

    // Big Golden Number inside Navy Half
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, String(st.num || ''), cx, statsY + 46, statW - 28, 40, 24, '900');

    // Crisp 1-or-2 line Caption inside White Bottom Half
    ctx.fillStyle = '#0f172a';
    const capLines = String(st.label || '').split('\n').filter(Boolean);
    if (capLines.length >= 2) {
      fitText(ctx, capLines[0], cx, statsY + navyH + 28, statW - 22, 21, 14, '800', '"Tajawal", sans-serif');
      fitText(ctx, capLines[1], cx, statsY + navyH + 56, statW - 22, 20, 14, '800', '"Tajawal", sans-serif');
    } else {
      fitText(ctx, capLines[0] || '', cx, statsY + navyH + 42, statW - 22, 22, 15, '800', '"Tajawal", sans-serif');
    }
    ctx.restore();
  });

  // 9. Closing Welcome Hexagonal Ribbon
  const closeY = statsY + statH + 34;
  const closeH = 74;
  const closeW = 1004;
  const closeX = (W - closeW) / 2;

  ctx.save();
  const cGrad = ctx.createLinearGradient(closeX, closeY, closeX + closeW, closeY);
  cGrad.addColorStop(0, '#fef3c7');
  cGrad.addColorStop(0.22, '#fffdf5');
  cGrad.addColorStop(0.5, '#ffffff');
  cGrad.addColorStop(0.78, '#fffdf5');
  cGrad.addColorStop(1, '#fef3c7');
  ctx.fillStyle = cGrad;
  tracePointedRibbon(ctx, closeX, closeY, closeW, closeH, 34);
  ctx.fill();
  ctx.strokeStyle = '#d9921a';
  ctx.lineWidth = 2.6;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0f172a';
  fitText(ctx, d.closingRibbon || 'بحضوركم تكتمل فرحتنا... وتكبر أحلام أطفالنا', W / 2, closeY + closeH / 2 + 2, closeW - 96, 33, 21, '900');
  ctx.restore();

  // 10. Event Info 3-Column Strip (Date | Time | Venue)
  const infoY = closeY + closeH + 46;

  // Two sleek vertical golden separators
  ctx.strokeStyle = '#d9921a';
  ctx.lineWidth = 3;
  [444, 756].forEach((vx) => {
    ctx.beginPath();
    ctx.moveTo(vx, infoY - 12);
    ctx.lineTo(vx, infoY + 90);
    ctx.stroke();
  });

  // Right Column: Date
  drawCalendarIcon(ctx, 916, infoY + 6, '#d9921a');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0f172a';
  fitText(ctx, d.dateLine1 || 'الجمعة', 916, infoY + 56, 260, 28, 19, '900');
  fitText(ctx, d.dateLine2 || '27 نوفمبر 2026', 916, infoY + 90, 280, 26, 18, '800', '"Tajawal", sans-serif');

  // Center Column: Time
  drawClockIcon(ctx, 600, infoY + 6, '#d9921a');
  fitText(ctx, d.timeLine1 || 'الساعة', 600, infoY + 56, 240, 28, 19, '900');
  fitText(ctx, d.timeLine2 || '3:00 مساءً', 600, infoY + 90, 260, 26, 18, '800', '"Tajawal", sans-serif');

  // Left Column: Venue
  drawMapPinIcon(ctx, 284, infoY + 6, '#d9921a');
  fitText(ctx, d.venueLine1 || 'قصر الثقافة', 284, infoY + 56, 260, 28, 19, '900');
  fitText(ctx, d.venueLine2 || 'النجف الأشرف', 284, infoY + 90, 280, 26, 18, '800', '"Tajawal", sans-serif');

  // Optional Masdar Official Partner Lockup inside the Deep Royal Navy Bottom Wave
  if (showMasdarInBottomWave && logoMasdar?.width) {
    ctx.save();
    const waveCenterY = H - 72; // comfortably centered inside the lifted navy wave (y: 1442..1518)
    const maxLogoH = 44;
    const maxLogoW = 165;
    const aspect = logoMasdar.width / logoMasdar.height;
    let drawW = maxLogoH * aspect;
    let drawH = maxLogoH;
    if (drawW > maxLogoW) {
      drawW = maxLogoW;
      drawH = drawW / aspect;
    }

    const caption = (d.masdarCaption || '').trim();
    if (caption) {
      ctx.font = '800 18px "Alexandria", "Tajawal", sans-serif';
      const capW = Math.min(ctx.measureText(caption).width, 280);
      const gap = 22;
      const pillPadX = masdarSpec.needsLightPill ? 16 : 0;
      const logoBoxW = drawW + pillPadX * 2;
      const totalW = capW + gap + 2 + gap + logoBoxW;
      const rightX = W / 2 + totalW / 2;
      const leftX = W / 2 - totalW / 2;

      // Subtle tapering golden ornament lines flanking the lockup
      const leftOrn = ctx.createLinearGradient(leftX - 110, waveCenterY, leftX - 18, waveCenterY);
      leftOrn.addColorStop(0, 'rgba(253, 224, 71, 0)');
      leftOrn.addColorStop(1, 'rgba(253, 224, 71, 0.7)');
      ctx.strokeStyle = leftOrn;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX - 110, waveCenterY);
      ctx.lineTo(leftX - 18, waveCenterY);
      ctx.stroke();

      const rightOrn = ctx.createLinearGradient(rightX + 18, waveCenterY, rightX + 110, waveCenterY);
      rightOrn.addColorStop(0, 'rgba(253, 224, 71, 0.7)');
      rightOrn.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.strokeStyle = rightOrn;
      ctx.beginPath();
      ctx.moveTo(rightX + 18, waveCenterY);
      ctx.lineTo(rightX + 110, waveCenterY);
      ctx.stroke();

      // Caption on the right (RTL natural reading order)
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde68a';
      fitText(ctx, caption, rightX, waveCenterY + 1, 280, 18, 13, '800');

      // Gold vertical separator between caption & Masdar logo
      const sepX = rightX - capW - gap;
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sepX, waveCenterY - 18);
      ctx.lineTo(sepX, waveCenterY + 18);
      ctx.stroke();

      // Logo on the left of the separator
      const logoCenterX = leftX + logoBoxW / 2;
      if (masdarSpec.needsLightPill) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(leftX, waveCenterY - drawH / 2 - 6, logoBoxW, drawH + 12, 14);
        ctx.fill();
        ctx.stroke();
      }
      ctx.drawImage(logoMasdar, logoCenterX - drawW / 2, waveCenterY - drawH / 2, drawW, drawH);
    } else {
      // Pure centered Masdar logo in the royal navy bottom wave with gold accent lines
      const pillPadX = masdarSpec.needsLightPill ? 18 : 0;
      const boxHalfW = drawW / 2 + pillPadX;

      const leftOrn = ctx.createLinearGradient(W / 2 - boxHalfW - 140, waveCenterY, W / 2 - boxHalfW - 22, waveCenterY);
      leftOrn.addColorStop(0, 'rgba(253, 224, 71, 0)');
      leftOrn.addColorStop(1, 'rgba(253, 224, 71, 0.7)');
      ctx.strokeStyle = leftOrn;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - boxHalfW - 140, waveCenterY);
      ctx.lineTo(W / 2 - boxHalfW - 22, waveCenterY);
      ctx.stroke();

      const rightOrn = ctx.createLinearGradient(W / 2 + boxHalfW + 22, waveCenterY, W / 2 + boxHalfW + 140, waveCenterY);
      rightOrn.addColorStop(0, 'rgba(253, 224, 71, 0.7)');
      rightOrn.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.strokeStyle = rightOrn;
      ctx.beginPath();
      ctx.moveTo(W / 2 + boxHalfW + 22, waveCenterY);
      ctx.lineTo(W / 2 + boxHalfW + 140, waveCenterY);
      ctx.stroke();

      if (masdarSpec.needsLightPill) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(W / 2 - boxHalfW, waveCenterY - drawH / 2 - 6, boxHalfW * 2, drawH + 12, 14);
        ctx.fill();
        ctx.stroke();
      }
      ctx.drawImage(logoMasdar, W / 2 - drawW / 2, waveCenterY - drawH / 2, drawW, drawH);
    }
    ctx.restore();
  }

  // Optional Masdar Official Partner Lockup in Bottom-Left Navy Wave Crest
  if (showMasdarInBottomCorner && logoMasdar?.width) {
    ctx.save();
    const hasCaption = Boolean((d.masdarCaption || '').trim());
    const maxLogoH = hasCaption ? 38 : 46;
    const maxLogoW = 148;
    const aspect = logoMasdar.width / logoMasdar.height;
    let drawW = maxLogoH * aspect;
    let drawH = maxLogoH;
    if (drawW > maxLogoW) {
      drawW = maxLogoW;
      drawH = drawW / aspect;
    }

    const cx = cardX + 114;
    const cy = hasCaption ? H - 58 : H - 68;

    if (hasCaption) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde68a';
      fitText(ctx, d.masdarCaption.trim(), cx, H - 91, 185, 13, 10, '800');
    }
    if (masdarSpec.needsLightPill) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - drawW / 2 - 12, cy - drawH / 2 - 5, drawW + 24, drawH + 10, 12);
      ctx.fill();
      ctx.stroke();
    }
    ctx.drawImage(logoMasdar, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
  }

  // Optional QR Verification Stamp in Bottom-Right (if enabled)
  if (d.showQr && qrImg?.width) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(W - 186, H - 178, 114, 114, 16);
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(qrImg, W - 178, H - 170, 98, 98);
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
  const filename = `دعوة حضور - ${sanitizeFilename(data.guestName || 'ضيف شرف')}.png`;
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
        <img src="${src}" alt="دعوة حضور ${idx + 1}" />
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
      margin: 0; padding: 16px; background: #0f172a; font-family: "Tahoma", Arial, sans-serif;
      display: flex; flex-direction: column; align-items: center; gap: 16px;
    }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center;
      background: #1e293b; color: #fff; padding: 10px 20px; border-radius: 14px;
      border: 1px solid rgba(251,191,36,0.4);
    }
    .btn {
      background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #0f172a; border: none;
      border-radius: 10px; padding: 9px 22px; font-weight: 800; font-size: 13px; cursor: pointer;
    }
    .btn-sec {
      background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.25);
      border-radius: 10px; padding: 9px 16px; font-weight: 700; font-size: 13px; cursor: pointer;
    }
    .pdf-page {
      width: 210mm; height: 297mm; background: #03102b;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; box-shadow: 0 22px 60px rgba(0,0,0,0.45);
      page-break-after: always;
    }
    .pdf-page:last-child { page-break-after: auto; }
    .pdf-page img {
      width: 100%; height: 100%; object-fit: contain; display: block;
    }
    @media print {
      body { background: #03102b; padding: 0; gap: 0; }
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
  const title = `دعوة حضور — ${data.guestName || 'مبادرة 1001 طفل رقمي'}`;
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
