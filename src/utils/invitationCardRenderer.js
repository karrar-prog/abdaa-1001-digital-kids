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

  const [logoAbdaa, logo1001, logoMasdar, qrImg] = await Promise.all([
    loadCachedImg('/brand/abdaa-logo.png'),
    loadCachedImg('/brand/logo-1001-kids.png'),
    d.showMasdarLogo ? loadCachedImg('/brand/masdar-logo-full-clean.png') : Promise.resolve(null),
    qrPromise
  ]);

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
  // Upper sweeping metallic gold curve
  const goldWaveGrad = ctx.createLinearGradient(cardX, H - 190, cardX + cardW, H - 32);
  goldWaveGrad.addColorStop(0, '#d97706');
  goldWaveGrad.addColorStop(0.32, '#fde047');
  goldWaveGrad.addColorStop(0.65, '#f59e0b');
  goldWaveGrad.addColorStop(1, '#b45309');

  ctx.fillStyle = goldWaveGrad;
  ctx.beginPath();
  ctx.moveTo(cardX, H - 166);
  ctx.bezierCurveTo(cardX + cardW * 0.28, H - 72, cardX + cardW * 0.66, H - 98, cardX + cardW, H - 184);
  ctx.lineTo(cardX + cardW, H);
  ctx.lineTo(cardX, H);
  ctx.closePath();
  ctx.fill();

  // Deep royal navy glossy lower wave
  const navyWaveGrad = ctx.createLinearGradient(cardX, H - 160, cardX + cardW, H - 24);
  navyWaveGrad.addColorStop(0, '#041230');
  navyWaveGrad.addColorStop(0.45, '#0b2f73');
  navyWaveGrad.addColorStop(0.8, '#071f4d');
  navyWaveGrad.addColorStop(1, '#020b1f');

  ctx.fillStyle = navyWaveGrad;
  ctx.beginPath();
  ctx.moveTo(cardX, H - 138);
  ctx.bezierCurveTo(cardX + cardW * 0.30, H - 52, cardX + cardW * 0.68, H - 78, cardX + cardW, H - 156);
  ctx.lineTo(cardX + cardW, H);
  ctx.lineTo(cardX, H);
  ctx.closePath();
  ctx.fill();

  // Subtle glowing blue highlight ribbon inside navy wave
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cardX, H - 114);
  ctx.bezierCurveTo(cardX + cardW * 0.32, H - 38, cardX + cardW * 0.68, H - 60, cardX + cardW, H - 132);
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

  // 3. Top Dual Official Logos + Vertical Gold Divider (Symmetrical Brand Lockup)
  const logoCenterY = 136 + topOffset;

  // Vertical Gold Divider at center
  const divGrad = ctx.createLinearGradient(W / 2, logoCenterY - 54, W / 2, logoCenterY + 54);
  divGrad.addColorStop(0, 'rgba(217, 146, 26, 0.25)');
  divGrad.addColorStop(0.5, '#d9921a');
  divGrad.addColorStop(1, 'rgba(217, 146, 26, 0.25)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(W / 2, logoCenterY - 52);
  ctx.lineTo(W / 2, logoCenterY + 52);
  ctx.stroke();

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

  // Optional Masdar Partner Logo Badge (subtle top-left corner inside card)
  if (d.showMasdarLogo && logoMasdar?.width) {
    const mH = 40;
    const mW = Math.min((logoMasdar.width / logoMasdar.height) * mH, 136);
    ctx.drawImage(logoMasdar, cardX + 26, logoCenterY - mH / 2, mW, mH);
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
