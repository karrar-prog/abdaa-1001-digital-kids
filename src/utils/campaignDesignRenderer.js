// محرك تصميم وتصدير قوالب الحملة الإعلانية لإنستغرام وفيسبوك (12 قالباً موزعة على 4 مراحل)
// مستمد مباشرة من ألوان الهيرو الرسمي وشعاري «1001 طفل رقمي» و«نادي أبدع» (نيلي متدرج + برتقالي متدرج + سماوي أبدع + أبيض ناصع)
// محاذاة احترافية متناظرة: شعار 1001 في المنتصف تماماً، نادي أبدع يميناً، وشركة المصدر يساراً، وكافة الأيقونات وسطية

import { generateOfficialQrDataUrl } from './qrVerify';
import { buildZipBlob } from './zipBuilder';

const IMG_CACHE = new Map();

function loadImg(src) {
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
  return String(s || 'design')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 72);
}

// لوحة الألوان الرسمية المستخرجة بدقة من لوگو 1001 ولوگو نادي أبدع وبنر الاحتفالية الرئيسي
export const BRAND_PALETTE = {
  cobaltDeep: '#001C6B',   // أزرق نيلي عميق (من لوگو 1001)
  cobaltMid: '#0038A8',    // نيلي ملكي متدرج (من لوگو 1001 والبنر)
  azureBright: '#00A8FF',  // أزرق سماوي مشع (من حلقة 1001)
  abdaaNavy: '#173B5E',    // كحلي أبدع الرسمي (من إطار روبوت أبدع)
  abdaaAqua: '#6FD3EC',    // سماوي أبدع الناعم (من جسم روبوت أبدع)
  orangeDeep: '#FF5E00',   // برتقالي حيوي متدرج (من رقم 1 وشعار أبدع)
  orangeMid: '#FF8C00',    // برتقالي أبدع و1001 الأساسي
  orangeGold: '#FFB800',   // ذهبي برتقالي دافئ (من شرابة قبعة التخرج)
  pureWhite: '#FFFFFF'
};

export const CAMPAIGN_FORMATS = {
  post: { id: 'post', label: 'بوست (4:5)', subtitle: '1080×1350', w: 1080, h: 1350 },
  story: { id: 'story', label: 'ستوري (9:16)', subtitle: '1080×1920', w: 1080, h: 1920 },
  square: { id: 'square', label: 'مربع / بروفايل (1:1)', subtitle: '1080×1080', w: 1080, h: 1080 },
  cover: { id: 'cover', label: 'غلاف فيسبوك', subtitle: '1640×624', w: 1640, h: 624 }
};

export const CAMPAIGN_THEMES = [
  { id: 'brand_1001', label: 'ألوان الهيرو و1001 (نيلي وبرتقالي)', emoji: '🎨' },
  { id: 'sky', label: 'سماوي أبدع المشرق', emoji: '🌤️' },
  { id: 'ivory', label: 'أبيض ملكي وذهبي', emoji: '☀️' },
  { id: 'royal', label: 'نيلي كحلي مسائي', emoji: '🌙' }
];

export const MASDAR_CAMPAIGN_STYLES = [
  { id: 'header_balanced', label: 'التناظر الرسمي (1001 بالوسط • أبدع ومصدر بالجانبين)' },
  { id: 'footer_subtle', label: 'مصدر بالشريط السفلي' },
  { id: 'none', label: 'بدون شعار المصدر' }
];

export const CAMPAIGN_PHASES = [
  { id: 'phase1', badge: 'المرحلة 1 • للنشر اليوم', title: 'التأسيس والتشويق وبناء الهوية', color: 'sky' },
  { id: 'phase2', badge: 'المرحلة 2 • غداً', title: 'بوستر الرعاية الرئاسية والشخصيات الرسمية', color: 'amber' },
  { id: 'phase3', badge: 'المرحلة 3 • قبل الحفل', title: 'أبطال المبادرة ومعرض الابتكارات والتفاعل', color: 'emerald' },
  { id: 'phase4', badge: 'المرحلة 4 • الحسم واليوم الموعود', title: 'حجز المقاعد والعدّ التنازلي ودليل الوصول', color: 'indigo' }
];

export const VIP_SPEAKER_PRESETS = [
  {
    id: 'president',
    badge: 'برعاية كريمة من فخامة رئيس جمهورية العراق',
    name: 'فخامة رئيس جمهورية العراق',
    role: 'رعاية كريمة لحفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي»',
    quote: 'تمكين أطفال العراق في البرمجة والذكاء الاصطناعي استثمارٌ وطنيٌ لصناعة المستقبل.'
  },
  {
    id: 'presidency',
    badge: 'ممثل فخامة رئيس جمهورية العراق',
    name: 'الدكتور نزار محمد سعيد',
    role: 'ممثل رئاسة جمهورية العراق — كلمة فخامة رئيس الجمهورية',
    quote: 'دعم جيل الابتكار والبرمجة هو الاستثمار الأسمى في مستقبل العراق ونهضته العلمية.'
  },
  {
    id: 'governor',
    badge: 'ضيف الشرف الرسمي',
    name: 'المهندس يوسف مكي كناوي',
    role: 'السيد محافظ النجف الأشرف',
    quote: 'النجف الأشرف تفخر بأبنائها الصغار وهم يرفعون اسم العراق في المحافل التقنية العربية.'
  },
  {
    id: 'minister',
    badge: 'الحضور الوزاري الرفيع',
    name: 'الأستاذ محمد الدراجي',
    role: 'معالي وزير التحول الرقمي',
    quote: 'تمكين الأطفال من مهارات الذكاء الاصطناعي والبرمجة يبني أساساً صلباً للتحول الرقمي.'
  },
  {
    id: 'syndicate',
    badge: 'ضيف الشرف التقني',
    name: 'الأستاذ أثير القيسي',
    role: 'نقيب المبرمجين العراقيين',
    quote: 'هؤلاء الـ 172 طفلاً رقمياً هم نواة الجيل القادم من مهندسي ومبرمجي العراق.'
  },
  {
    id: 'chamber',
    badge: 'داعم الإبداع والريادة',
    name: 'المهندس الحاج زهير شربة',
    role: 'رئيس غرفة تجارة النجف الأشرف',
    quote: 'رعاية المواهب الشابة والابتكار التكنولوجي مسؤولية وطنية ومجتمعية نعتز بها.'
  },
  {
    id: 'founder',
    badge: 'مؤسس المبادرة والنادي',
    name: 'الأستاذ فراس نزار كريم',
    role: 'مؤسس نادي أبدع للمهارات الذكية ومبادرة «1001 طفل رقمي»',
    quote: 'حين يتعلم الطفل من طفل مثله، تتحول البرمجة إلى مغامرة يصنع بها أطفالنا المستقبل.'
  },
  {
    id: 'maryam',
    badge: 'بطلة العرب في الابتكار (2024–2026)',
    name: 'مريم فراس نزار',
    role: 'مؤسس ومدرب في نادي أبدع للمهارات الذكية',
    quote: 'بدأنا الحلم بشغف صغير، واليوم نحتفي بـ 172 بطلاً رقمياً و40 مشروعاً حياً.'
  },
  {
    id: 'karrar',
    badge: 'حوار خاص ضمن منهاج الحفل',
    name: 'الأستاذ كرار حساني',
    role: 'الشريك المنظم للمبادرة والمدير التنفيذي لشركة المصدر',
    quote: 'سعداء بشراكتنا في تمكين جيل عراقي مبدع ينتقل من استهلاك التقنية إلى صناعتها.'
  }
];

export const COUNTDOWN_PRESETS = [
  { id: '3days', number: '3', unit: 'أيام متبقية', title: 'العدّ التنازلي بدأ!', sub: 'ثلاثة أيام تفصلنا عن عرس الإبداع في قصر الثقافة' },
  { id: '2days', number: '2', unit: 'يومان فقط', title: 'اقترب الموعد الكبير!', sub: 'استعدوا لاكتشاف 40 ابتكاراً حياً بأيدي أطفالنا' },
  { id: 'tomorrow', number: 'غداً', unit: 'الجمعة 27 تشرين الثاني', title: 'غداً نحتفي بأبطالنا!', sub: 'تفتح الأبواب 2:00 ظهراً — الانطلاق 3:00 عصراً' },
  { id: 'today', number: 'اليوم', unit: '3:00 عصراً', title: 'اليوم يُصنع المستقبل!', sub: 'أهلاً بكم في قصر الثقافة – النجف الأشرف' }
];

export const CAMPAIGN_TEMPLATES = [
  // ================= المرحلة 1: التأسيس والتشويق =================
  {
    id: 'page-identity',
    order: 1,
    phase: 'phase1',
    defaultFormat: 'cover',
    name: 'غلاف وبروفايل الصفحة الرسمية',
    shortDesc: 'الهوية الرسمية بالنيلي والبرتقالي المتدرج والأبيض لافتتاح فيسبوك وإنستغرام',
    defaults: {
      eyebrow: 'برعاية فخامة رئيس جمهورية العراق',
      headline: 'احتفالية تخرج الدفعة الأولى',
      highlight: 'من مبادرة «1001 طفل رقمي»',
      subtitle: 'ملتقى النجف للابتكار الرقمي • نصنع جيلاً يبرمج المستقبل',
      footerNote: 'الجمعة 27 تشرين الثاني 2026  •  قصر الثقافة – النجف الأشرف',
      extraLines: ''
    },
    caption:
      '🌟 أهلاً بكم في الصفحة الرسمية لاحتفالية تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي.\n\nبرعاية فخامة رئيس جمهورية العراق، وتنظيم نادي أبدع للمهارات الذكية وشركة المصدر، نحتفي بتخرج 172 طفلاً رقمياً ومعرض لـ 40 ابتكاراً حياً بأيدي أطفالنا.\n\n📅 الجمعة 27 تشرين الثاني 2026 | 🕒 3:00 عصراً\n📍 قصر الثقافة – النجف الأشرف\n🌐 المنصة الرسمية: https://abdaa.masdar.company\n\n#1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف #الابتكار_الرقمي #نصنع_جيلاً_يبرمج_المستقبل'
  },
  {
    id: 'teaser-launch',
    order: 2,
    phase: 'phase1',
    defaultFormat: 'post',
    name: 'بوست التشويق الأول (قريباً...)',
    shortDesc: 'منشور تشويقي مشرق يجذب الانتباه لبدء الحملة اليوم',
    photoAsset: '/gallery/training_1.jpg',
    defaults: {
      eyebrow: 'قريباً في النجف الأشرف ✨',
      headline: 'شيءٌ استثنائي يُصنع بأيدٍ صغيرة',
      highlight: 'جيلٌ عراقي يكتب المستقبل بلغة الكود',
      subtitle: 'من عمر 6 إلى 14 سنة... أطفالٌ تحوّلوا من مستهلكين للتقنية إلى مبتكرين ومبرمجين يقفون على منصة التكريم.',
      footerNote: 'ترقّبوا الإعلان الكبير • 27 / 11 / 2026',
      extraLines: ''
    },
    caption:
      '✨ شيءٌ استثنائي يُصنع بأيدٍ صغيرة في قلب النجف الأشرف...\n\nأطفالٌ تتراوح أعمارهم بين 6 و14 عاماً، لم يكتفوا باستخدام التكنولوجيا، بل تعلّموا كيف يبرمجونها ويصنعون بها روبوتات وتطبيقات حقيقية!\n\nترقّبوا التفاصيل الكاملة قريباً جداً على هذه الصفحة 👀🔥\n📅 27 تشرين الثاني 2026\n\n#قريباً #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف #أطفال_العراق_المبدعون'
  },
  {
    id: 'story-numbers',
    order: 3,
    phase: 'phase1',
    defaultFormat: 'post',
    name: 'قصة المبادرة والأرقام الحقيقية',
    shortDesc: 'إنفوغرافيك بألوان 1001 وأبدع يروي مسيرة 896 ← 700 ← 172 خريجاً',
    defaults: {
      eyebrow: 'المركز الأول عربياً لـ 3 سنوات متتالية (2024 – 2026) 🏆',
      headline: 'من شغف طفلين موهوبين...',
      highlight: 'إلى حراك رقمي يحتضن 1001 طفل',
      subtitle: 'مبادرة مجانية بالكامل في النجف الأشرف صنعت أرقاماً نعتز بها جميعاً:',
      footerNote: 'نصنع جيلاً يبرمج المستقبل • abdaa.masdar.company',
      extraLines: '896|طفلاً التحقوا بالمبادرة\n700|أتمّوا متطلبات التدريب\n172|خريجاً في الدفعة الأولى\n40|ابتكاراً ومشروعاً حياً'
    },
    caption:
      '🏆 بدأت القصة من شغف طفلين موهوبين رفعا اسم العراق بالمركز الأول عربياً لثلاث سنوات متتالية في البطولة العربية للروبوت والذكاء الاصطناعي (2024–2026)...\n\nواليوم تحوّل الحلم إلى حراك تعليمي ومجتمعي مجاني بالكامل:\n🔹 896 طفلاً التحقوا بمبادرة «1001 طفل رقمي» (6–14 سنة)\n🔹 700 طفل أتمّوا متطلبات التدريب الأساسي\n🔹 172 طفلاً رقمياً نحتفي بتخرجهم في الدفعة الأولى\n🔹 40 مشروعاً وابتكاراً حياً يقدّمها الأطفال بأنفسهم في المعرض\n\nفخورون بكل بطل وبطلة! 💙✨\n🌐 https://abdaa.masdar.company\n\n#قصة_نجاح #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف #الروبوت_والذكاء_الاصطناعي'
  },

  // ================= المرحلة 2: بوستر الرعاية الرئاسية والشخصيات الرسمية =================
  {
    id: 'official-hero',
    order: 4,
    phase: 'phase2',
    defaultFormat: 'post',
    supportsPresidentPortrait: true,
    name: 'البوستر الرسمي — برعاية فخامة رئيس الجمهورية 👑',
    shortDesc: 'بوستر الرعاية الرئاسية بألوان الهيرو (نيلي وبرتقالي وأبيض) مع إطار صورة فخامة الرئيس',
    defaults: {
      eyebrow: 'برعاية فخامة رئيس جمهورية العراق',
      presidentTitle: 'فخامة رئيس جمهورية العراق',
      headline: 'احتفالية تخرج الدفعة الأولى',
      highlight: 'من مبادرة «1001 طفل رقمي»',
      subtitle: 'ملتقى النجف للابتكار الرقمي • تتويج 172 بطلاً رقمياً وافتتاح معرض الـ 40 ابتكاراً بأيدي الأطفال',
      footerNote: 'نصنع جيلاً يبرمج المستقبل  •  abdaa.masdar.company',
      extraLines: 'الجمعة|27 تشرين الثاني 2026\nالساعة|3:00 عصراً (الوصول 2:00)\nالمكان|قصر الثقافة – النجف الأشرف'
    },
    caption:
      '👑 برعاية فخامة رئيس جمهورية العراق 🇮🇶\n\nتحت شعار «نصنع جيلاً يبرمج المستقبل»، نُعلن رسمياً عن:\n🎓 احتفالية تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي\n\nنحتفي بتتويج 172 طفلاً رقمياً، وافتتاح المعرض العلمي الحي لـ 40 مشروعاً برمجياً وروبوتياً بأيدي أطفالنا الأبطال.\n\n📅 الجمعة، 27 تشرين الثاني 2026\n🕒 الساعة 3:00 عصراً (فتح الأبواب 2:00 ظهراً)\n📍 قصر الثقافة – النجف الأشرف\n🎟️ الحجز المجاني عبر المنصة: https://abdaa.masdar.company\n\n#برعاية_رئيس_الجمهورية #1001_طفل_رقمي #ملتقى_النجف_للابتكار_الرقمي #نادي_أبدع #النجف_الأشرف'
  },
  {
    id: 'vip-dignitaries',
    order: 5,
    phase: 'phase2',
    defaultFormat: 'post',
    name: 'كوكبة الحضور والشخصيات الرسمية',
    shortDesc: 'بطاقات وسطية متناظرة وأنيقة للشخصيات الوطنية والرسمية المشاركة في الحفل',
    defaults: {
      eyebrow: 'برعاية فخامة رئيس الجمهورية • حضور رسمي ووطني رفيع',
      headline: 'شخصيات رسمية ووطنية',
      highlight: 'تشارك أطفالنا فرحة التتويج',
      subtitle: 'تشريف نخبة من القيادات الوطنية والأكاديمية والتقنية لحفل تخرج الدفعة الأولى:',
      footerNote: 'الجمعة 27 تشرين الثاني 2026 • قصر الثقافة – النجف الأشرف',
      extraLines:
        'ممثل فخامة رئيس جمهورية العراق|الدكتور نزار محمد سعيد\nالسيد محافظ النجف الأشرف|المهندس يوسف مكي كناوي\nمعالي وزير التحول الرقمي|الأستاذ محمد الدراجي\nنقيب المبرمجين العراقيين|الأستاذ أثير القيسي\nمؤسس نادي أبدع ومبادرة 1001 طفل رقمي|الأستاذ فراس نزار كريم'
    },
    caption:
      '🇮🇶 حضور رسمي ووطني رفيع يشرّف أطفالنا في حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي»!\n\nبحضور وكلمات كوكبة من الشخصيات الوطنية والأكاديمية والتقنية:\n▪️ الدكتور نزار محمد سعيد — ممثل فخامة رئيس جمهورية العراق\n▪️ المهندس يوسف مكي كناوي — السيد محافظ النجف الأشرف\n▪️ الأستاذ محمد الدراجي — معالي وزير التحول الرقمي\n▪️ الأستاذ أثير القيسي — نقيب المبرمجين العراقيين\n▪️ الأستاذ فراس نزار كريم — مؤسس نادي أبدع ومبادرة 1001 طفل رقمي\n\nإن حضور هذه القامات الكريمة هو أكبر رسالة دعم وتشجيع لأطفال العراق المبدعين.\n📅 الجمعة 27 تشرين الثاني 2026 | 📍 قصر الثقافة – النجف الأشرف\n\n#1001_طفل_رقمي #النجف_الأشرف #نادي_أبدع #التحول_الرقمي #العراق'
  },
  {
    id: 'vip-speaker-spotlight',
    order: 6,
    phase: 'phase2',
    defaultFormat: 'post',
    supportsPortrait: true,
    name: 'بطاقة شخصية / متحدث رسمي (فردية)',
    shortDesc: 'قالب وسطي أنيق لكل ضيف شرف أو متحدث — اختر من القائمة وارفع صورته',
    defaults: {
      eyebrow: 'برعاية كريمة من فخامة رئيس جمهورية العراق',
      headline: 'فخامة رئيس جمهورية العراق',
      highlight: 'رعاية كريمة لحفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي»',
      subtitle: '«تمكين أطفال العراق في البرمجة والذكاء الاصطناعي استثمارٌ وطنيٌ لصناعة المستقبل.»',
      footerNote: 'احتفالية تخرج مبادرة «1001 طفل رقمي» • الجمعة 27 تشرين الثاني 2026',
      extraLines: ''
    },
    caption:
      '✨ نعتز بالرعاية الكريمة وحضور شخصياتنا الوطنية في حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي.\n\nتشريفكم ومشاركتكم أطفالنا فرحة التتويج يمثلان دعماً حقيقياً لمسيرة الإبداع وصناعة المستقبل.\n\n📅 الجمعة 27 تشرين الثاني 2026 | 🕒 3:00 عصراً\n📍 قصر الثقافة – النجف الأشرف\n🌐 https://abdaa.masdar.company\n\n#ضيوف_الشرف #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف'
  },

  // ================= المرحلة 3: الأبطال، المعرض، والتفاعل =================
  {
    id: 'projects-expo',
    order: 7,
    phase: 'phase3',
    defaultFormat: 'post',
    name: 'معرض الابتكارات الحية (40 مشروعاً)',
    shortDesc: 'استعراض مشرق لمعرض مشاريع الأطفال الحية مع صور حقيقية من مختبرات أبدع',
    photoAssets: ['/gallery/training_1.jpg', '/gallery/training_4.jpg', '/gallery/training_6.jpg'],
    defaults: {
      eyebrow: 'معرض علمي حي مفتوح للعائلات والضيوف',
      headline: '40 مشروعاً وابتكاراً حياً',
      highlight: 'بأيدي أطفالٍ من عمر 6 إلى 14 سنة',
      subtitle: 'ألعاب برمجية • روبوتات ذكية • تطبيقات أمان وتعليم • حلول ذكاء اصطناعي يشرحها الأطفال بأنفسهم!',
      footerNote: 'استكشف المشاريع الآن على: abdaa.masdar.company/#expo',
      extraLines: 'البرمجة والألعاب|الروبوتات الذكية|الذكاء الاصطناعي|ابتكارات مجتمعية'
    },
    caption:
      '🤖⚡ 40 مشروعاً وابتكاراً حياً... صُمّمت وبُرمِجت بأيدي أطفال تتراوح أعمارهم بين 6 و14 سنة!\n\nضمن فعاليات حفل التخرج، ندعوكم للتجول في «معرض ابتكارات الأطفال» حيث يقف أبطالنا أمام مشاريعهم الحقيقية في:\n💻 البرمجة وتطوير التطبيقات والألعاب\n🤖 الروبوتات والدوائر الذكية\n🧠 تطبيقات الذكاء الاصطناعي التربوي والمجتمعي\n\nيمكنكم تصفح جميع المشاريع الـ 40 عبر المنصة:\n🌐 https://abdaa.masdar.company/#expo\n\n#معرض_الابتكارات #40_ابتكاراً #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف'
  },
  {
    id: 'agenda-highlights',
    order: 8,
    phase: 'phase3',
    defaultFormat: 'post',
    name: 'المنهاج الرسمي وأبرز فقرات الحفل',
    shortDesc: 'شبكة 2×2 وسطية أنيقة لفترات الحفل الأربع بألوان الهوية الرسمية',
    defaults: {
      eyebrow: 'البرنامج البروتوكولي الرسمي للحفل',
      headline: 'منهاج حفل التخرج',
      highlight: '4 فترات احتفالية حافلة بالإلهام',
      subtitle: 'من تلاوة القرآن والسلام الجمهوري حتى تتويج 172 بطلاً وافتتاح معرض الابتكارات:',
      footerNote: 'تصفّح المنهاج الحيوي الكامل: abdaa.masdar.company/agenda',
      extraLines:
        '3:00 عصراً|الافتتاح البروتوكولي: القرآن الكريم، السلام الجمهوري، وسورة الفاتحة\n3:15 عصراً|الكلمات الرسمية: المؤسس، رئاسة الجمهورية، المحافظة، الوزارة، والنقابة\n3:40 عصراً|فقرات المبادرة: قصة الأبطال، حوار التمكين الرقمي، والفيديو التوثيقي\n4:05 عصراً|لحظة التتويج الكبرى: تكريم 172 خريجاً وافتتاح معرض الـ 40 مشروعاً'
    },
    caption:
      '📋 تعرّفوا على أبرز محطات المنهاج الرسمي لحفل تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي»:\n\n🕒 3:00 عصراً — الافتتاح (تلاوة عطرة، السلام الجمهوري، سورة الفاتحة)\n🕒 3:15 عصراً — الكلمات الرسمية للشخصيات والوفود\n🕒 3:40 عصراً — فقرات المبادرة والفيديو التوثيقي لرحلة الأطفال\n🕓 4:05 عصراً — تتويج الـ 172 بطلاً رقمياً وافتتاح معرض الـ 40 ابتكاراً\n\nشاهدوا المنهاج الحيوي التفاعلي بالكامل:\n🌐 https://abdaa.masdar.company/agenda\n\n#منهاج_الحفل #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف'
  },
  {
    id: 'mentors-tribute',
    order: 9,
    phase: 'phase3',
    defaultFormat: 'post',
    name: 'تحية الوفاء للمدربين المتطوعين',
    shortDesc: 'بطاقة امتنان وإجلال لـ 26 مؤسساً وشريكاً ومدرباً متطوعاً صنعوا هذا الأثر',
    photoAsset: '/gallery/training_5.jpg',
    defaults: {
      eyebrow: 'جنود العطاء والإلهام في النجف الأشرف',
      headline: 'خلف كل طفلٍ مبدع...',
      highlight: 'مدربٌ متطوع آمن بحلمه',
      subtitle: '26 مؤسساً ومدرباً متطوعاً وشريكاً منحوا وقتهم وعلمهم مجاناً لتدريب 896 طفلاً وصناعة جيل رقمي واعد.',
      footerNote: 'تعرّف على لوحة شرف المدربين: abdaa.masdar.company/#mentors',
      extraLines: '5|مؤسسون روّاد\n20|مدرباً متطوعاً\n896|طفلاً تدربوا مجاناً'
    },
    caption:
      '💛 خلف كل طفلٍ مبدع يقف اليوم على منصة التخرج... مدربٌ متطوع آمن بقدراته ومنحه من وقته وعلمه بلا مقابل!\n\nنرفع أسمى آيات الشكر والعرفان لـ 26 مؤسساً ومدرباً متطوعاً وشريكاً في نادي أبدع للمهارات الذكية، الذين جعلوا من مبادرة «1001 طفل رقمي» حقيقةً مشرقة تفتخر بها النجف الأشرف والعراق.\n\nتعرّفوا على لوحة الشرف:\n🌐 https://abdaa.masdar.company/#mentors\n\n#لوحة_الشرف #العمل_التطوعي #نادي_أبدع #1001_طفل_رقمي #النجف_الأشرف'
  },
  {
    id: 'grad-frame-cta',
    order: 10,
    phase: 'phase3',
    defaultFormat: 'post',
    name: 'حملة الأهالي: إطار التخرج التذكاري',
    shortDesc: 'بوست مشرق وتفاعلي يدعو الأهالي لصنع صورة طفلهم في /frame ونشرها',
    photoAsset: '/gallery/training_2.jpg',
    includeQrUrl: 'https://abdaa.masdar.company/frame',
    qrLabel: 'امسح الكود لصنع الإطار فوراً',
    defaults: {
      eyebrow: 'شاركوا فرحة التخرج مع الأهل والأصدقاء',
      headline: 'صمّم إطار التخرج لطفلك!',
      highlight: '8 ثيمات طفولية مبهجة • مجاناً وبثوانٍ',
      subtitle: 'ارفع صورة طفلك، اختر الثيم المفضل (فضاء، روبوتات، قوس قزح...) وحمّلها بجودة عالية لمشاركتها على صفحتك!',
      footerNote: 'abdaa.masdar.company/frame',
      extraLines: ''
    },
    caption:
      '📸🎉 لكل أم وأب يفخران ببطلهما الصغير!\n\nأطلقنا لكم «استوديو إطار التخرج التذكاري» مجاناً عبر منصتنا:\n🌈 8 ثيمات طفولية مبهجة (روبوتات، فضاء، قوس قزح، بالونات...)\n✨ 5 أشكال للإطار وملصقات تخرج مبهجة\n📱 جاهزة فوراً كمقاس بوست أو ستوري إنستغرام وفيسبوك!\n\nصمّم صورة طفلك الآن وشاركنا بها في التعليقات أو بالتاغ 👇:\n🌐 https://abdaa.masdar.company/frame\n\n#إطار_التخرج #1001_طفل_رقمي #أبطال_أبدع #النجف_الأشرف'
  },

  // ================= المرحلة 4: حجز المقاعد والعد التنازلي ويوم الحدث =================
  {
    id: 'booking-batch2',
    order: 11,
    phase: 'phase4',
    defaultFormat: 'post',
    name: 'حجز المقاعد المجاني + الدفعة الثانية',
    shortDesc: 'بوست وسطي أنيق لدعوة العائلات لحجز التذكرة المجانية والتسجيل للدفعة الثانية',
    includeQrUrl: 'https://abdaa.masdar.company',
    qrLabel: 'امسح للحجز المجاني والتسجيل',
    defaults: {
      eyebrow: 'الدعوة مفتوحة للعائلات والمهتمين بالتعليم والابتكار',
      headline: 'احجز مقعدك مجاناً الآن',
      highlight: '+500 مقعد • وتذكرة دخول فورية بـ QR',
      subtitle: 'كما يمكنكم التسجيل المبكر لأطفالكم (6 – 14 سنة) للانضمام إلى «الدفعة الثانية» المجانية من المبادرة!',
      footerNote: 'abdaa.masdar.company',
      extraLines: 'حجز مقعد مجاني|استلم تذكرتك الإلكترونية بـ QR فوراً لحضور الحفل والمعرض\nالدفعة الثانية (6–14 سنة)|سجّل طفلك مبكراً للدفعة القادمة من مبادرة 1001 طفل رقمي'
    },
    caption:
      '🎟️✨ المقاعد مجانية ومفتوحة للعائلات الكريمة والمهتمين بإبداع الطفولة!\n\n✅ احجز مقعدك لحفل التخرج ومعرض الـ 40 ابتكاراً واستلم تذكرتك الفورية برمز QR.\n✅ وسجّل طفلك (من عمر 6 إلى 14 سنة) في قائمة التسجيل المبكر للدفعة الثانية المجانية!\n\nسجّل الآن بدقيقة واحدة عبر المنصة:\n🌐 https://abdaa.masdar.company\n\n📅 الجمعة 27 تشرين الثاني 2026 | 📍 قصر الثقافة – النجف الأشرف\n\n#احجز_مقعدك #الدفعة_الثانية #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف'
  },
  {
    id: 'countdown-arrival',
    order: 12,
    phase: 'phase4',
    defaultFormat: 'post',
    name: 'العدّ التنازلي + دليل يوم الحفل',
    shortDesc: 'قالب عدّ تنازلي مرن (3 أيام / يومان / غداً / اليوم) مع إرشادات الحضور',
    supportsCountdown: true,
    defaults: {
      eyebrow: 'احتفالية تخرج الدفعة الأولى • مبادرة «1001 طفل رقمي»',
      headline: 'العدّ التنازلي بدأ!',
      highlight: 'ثلاثة أيام تفصلنا عن عرس الإبداع في قصر الثقافة',
      subtitle: 'تُفتح أبواب قصر الثقافة من الساعة 2:00 ظهراً للاستقبال وإبراز تذكرة الـ QR، وينطلق الحفل الساعة 3:00 عصراً.',
      footerNote: 'قصر الثقافة – النجف الأشرف  •  الجمعة 27 تشرين الثاني 2026',
      countdownNumber: '3',
      countdownUnit: 'أيام متبقية',
      extraLines: 'فتح الأبواب|2:00 ظهراً\nانطلاق الحفل|3:00 عصراً\nالدخول|بإبراز تذكرة QR'
    },
    caption:
      '⏳✨ العدّ التنازلي انطلق!\n\nقريباً نلتقي جميعاً لنشهد تتويج 172 طفلاً رقمياً وافتتاح معرض الـ 40 ابتكاراً في قصر الثقافة – النجف الأشرف.\n\n📌 تذكير سريع للحضور الكريم:\n🕑 فتح الأبواب والتنظيم: الساعة 2:00 ظهراً\n🕒 انطلاق فقرات الحفل: الساعة 3:00 عصراً تماماً\n📱 يرجى تجهيز تذكرة الدخول (QR) على هاتفك لتسهيل الاستقبال\n\nننتظركم بكل فخر ومحبة! 💙🏆\n🌐 https://abdaa.masdar.company\n\n#العد_التنازلي #1001_طفل_رقمي #نادي_أبدع #قصر_الثقافة #النجف_الأشرف'
  }
];

// ---------- Theme Resolution ----------

function resolveVisualTheme(tpl, themeMode = 'brand_1001') {
  const chosen = themeMode || 'brand_1001';
  if (chosen === 'brand_1001') {
    return {
      mode: 'brand_1001',
      isLight: true,
      hasDarkWaveFooter: true,
      bgAsset: null // مرسوم بالكامل بدقة فيكتور فائقة مطابقة لبنر الهيرو (نيلي متدرج + برتقالي متدرج + سماوي أبدع + أبيض)
    };
  }
  if (chosen === 'ivory') {
    const useSilkRibbon = tpl.id === 'vip-dignitaries' || tpl.id === 'agenda-highlights';
    return {
      mode: 'ivory',
      isLight: true,
      hasDarkWaveFooter: !useSilkRibbon,
      bgAsset: useSilkRibbon ? '/campaign/bg-pearl-honor.jpg' : '/campaign/bg-ivory-gold.jpg'
    };
  }
  if (chosen === 'sky') {
    return {
      mode: 'sky',
      isLight: true,
      hasDarkWaveFooter: false,
      bgAsset: '/campaign/bg-sky-bright.jpg'
    };
  }
  const useTech = tpl.id === 'teaser-launch' || tpl.id === 'story-numbers' || tpl.id === 'projects-expo';
  return {
    mode: 'royal',
    isLight: false,
    hasDarkWaveFooter: true,
    bgAsset: useTech ? '/campaign/bg-future-kids.jpg' : '/campaign/bg-royal-gala.jpg'
  };
}

// ---------- Pro Vector Brand Background (Exact Hero Banner DNA: White + Gradient Cobalt/Azure + Gradient Orange) ----------

function drawBrand1001VectorBackdrop(ctx, W, H, isCover = false) {
  // 1. Immaculate Luminous White Canvas with subtle cool-aqua halo
  const bg = ctx.createRadialGradient(W / 2, H * 0.44, 60, W / 2, H * 0.48, Math.max(W, H) * 0.72);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(0.72, '#F9FCFF');
  bg.addColorStop(1, '#EAF5FF');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Sweeping Top-Right & Top-Left Cobalt-to-Azure Corner Curves with Orange-Gold Trim (exact echo of event_poster.jpg!)
  const cornerW = isCover ? W * 0.16 : W * 0.24;
  const cornerH = isCover ? H * 0.34 : H * 0.14;

  // Top-Right Cobalt Arc
  ctx.save();
  const trGrad = ctx.createLinearGradient(W - cornerW, 0, W, cornerH);
  trGrad.addColorStop(0, '#0038A8');
  trGrad.addColorStop(0.55, '#002070');
  trGrad.addColorStop(1, '#00A8FF');
  ctx.fillStyle = trGrad;
  ctx.beginPath();
  ctx.moveTo(W - cornerW, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, cornerH);
  ctx.quadraticCurveTo(W - cornerW * 0.35, cornerH * 0.58, W - cornerW, 0);
  ctx.closePath();
  ctx.fill();

  // Orange-gold trim along Top-Right arc
  const trTrim = ctx.createLinearGradient(W - cornerW, 0, W, cornerH);
  trTrim.addColorStop(0, '#FF5E00');
  trTrim.addColorStop(0.5, '#FF8C00');
  trTrim.addColorStop(1, '#FFB800');
  ctx.strokeStyle = trTrim;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(W - cornerW, 0);
  ctx.quadraticCurveTo(W - cornerW * 0.35, cornerH * 0.58, W, cornerH);
  ctx.stroke();

  // Top-Left Cobalt Arc (symmetrical mirror)
  const tlGrad = ctx.createLinearGradient(0, cornerH, cornerW, 0);
  tlGrad.addColorStop(0, '#00A8FF');
  tlGrad.addColorStop(0.45, '#002070');
  tlGrad.addColorStop(1, '#0038A8');
  ctx.fillStyle = tlGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(cornerW, 0);
  ctx.quadraticCurveTo(cornerW * 0.35, cornerH * 0.58, 0, cornerH);
  ctx.closePath();
  ctx.fill();

  const tlTrim = ctx.createLinearGradient(0, cornerH, cornerW, 0);
  tlTrim.addColorStop(0, '#FFB800');
  tlTrim.addColorStop(0.5, '#FF8C00');
  tlTrim.addColorStop(1, '#FF5E00');
  ctx.strokeStyle = tlTrim;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cornerW, 0);
  ctx.quadraticCurveTo(cornerW * 0.35, cornerH * 0.58, 0, cornerH);
  ctx.stroke();

  // Subtle circuit dots inside top cobalt corners (clean geometric touch, never busy)
  ctx.strokeStyle = 'rgba(111, 211, 236, 0.32)';
  ctx.fillStyle = 'rgba(255, 184, 0, 0.55)';
  ctx.lineWidth = 2;
  [
    [W - 54, 24, W - 26, 52],
    [W - 92, 18, W - 56, 40],
    [54, 24, 26, 52],
    [92, 18, 56, 40]
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x2, y2, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Soft decorative side accent arcs in Abdaa Aqua & Orange (very delicate along far edges)
  if (!isCover) {
    ctx.strokeStyle = 'rgba(0, 168, 255, 0.14)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.25);
    ctx.quadraticCurveTo(36, H * 0.50, 0, H * 0.76);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W, H * 0.25);
    ctx.quadraticCurveTo(W - 36, H * 0.50, W, H * 0.76);
    ctx.stroke();
  }

  // 3. Signature Bottom Sweeping Wave: Orange-Gold Upper Ribbon + Deep Gradient Cobalt Lower Wave (exact event_poster.jpg base!)
  const waveBaseY = isCover ? H - 82 : H - 118;

  // Vibrant Orange-Gold Ribbon Wave behind Navy Wave
  const orgWave = ctx.createLinearGradient(0, waveBaseY - 26, W, H);
  orgWave.addColorStop(0, '#FF5E00');
  orgWave.addColorStop(0.35, '#FFB800');
  orgWave.addColorStop(0.68, '#FF8C00');
  orgWave.addColorStop(1, '#FF5E00');
  ctx.fillStyle = orgWave;
  ctx.beginPath();
  ctx.moveTo(0, waveBaseY - 12);
  ctx.bezierCurveTo(W * 0.28, waveBaseY + 26, W * 0.72, waveBaseY - 38, W, waveBaseY - 4);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Electric Azure accent ribbon slice
  const azWave = ctx.createLinearGradient(0, waveBaseY, W, H);
  azWave.addColorStop(0, '#00A8FF');
  azWave.addColorStop(0.5, '#0048C4');
  azWave.addColorStop(1, '#6FD3EC');
  ctx.fillStyle = azWave;
  ctx.beginPath();
  ctx.moveTo(0, waveBaseY + 4);
  ctx.bezierCurveTo(W * 0.30, waveBaseY + 34, W * 0.70, waveBaseY - 24, W, waveBaseY + 8);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Deep Royal Cobalt Main Bottom Wave (houses crisp white/gold footer strip)
  const navWave = ctx.createLinearGradient(0, waveBaseY + 10, W, H);
  navWave.addColorStop(0, '#001552');
  navWave.addColorStop(0.45, '#002B8A');
  navWave.addColorStop(0.85, '#001C6B');
  navWave.addColorStop(1, '#00103E');
  ctx.fillStyle = navWave;
  ctx.beginPath();
  ctx.moveTo(0, waveBaseY + 14);
  ctx.bezierCurveTo(W * 0.30, waveBaseY + 42, W * 0.70, waveBaseY - 14, W, waveBaseY + 18);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ---------- Drawing Primitives ----------

function drawImageCover(ctx, img, x, y, w, h, focusY = 0.5) {
  if (!img?.width || !img?.height) return;
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;
  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) * focusY;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function fitText(ctx, text, x, y, maxW, startPx, minPx, weight = '900', family = '"Alexandria", "Tajawal", sans-serif') {
  let sz = startPx;
  ctx.font = `${weight} ${sz}px ${family}`;
  while (ctx.measureText(text).width > maxW && sz > minPx) {
    sz -= 2;
    ctx.font = `${weight} ${sz}px ${family}`;
  }
  ctx.fillText(text, x, y);
  return sz;
}

function wrapLines(ctx, text, maxW, maxLines = 4) {
  const paras = String(text || '').split('\n');
  const out = [];
  for (const p of paras) {
    const t = p.trim();
    if (!t) continue;
    const words = t.split(/\s+/);
    let cur = '';
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxW && cur) {
        out.push(cur);
        cur = w;
        if (out.length >= maxLines) return out;
      } else {
        cur = test;
      }
    }
    if (cur && out.length < maxLines) out.push(cur);
  }
  return out;
}

function drawAccentRule(ctx, cx, y, halfW, isBrand1001 = true, alpha = 0.85) {
  const g = ctx.createLinearGradient(cx - halfW, y, cx + halfW, y);
  if (isBrand1001) {
    g.addColorStop(0, 'rgba(0, 168, 255, 0)');
    g.addColorStop(0.25, `rgba(0, 168, 255, ${alpha})`);
    g.addColorStop(0.5, `rgba(255, 140, 0, ${alpha})`);
    g.addColorStop(0.75, `rgba(0, 168, 255, ${alpha})`);
    g.addColorStop(1, 'rgba(0, 168, 255, 0)');
  } else {
    g.addColorStop(0, 'rgba(217, 146, 26, 0)');
    g.addColorStop(0.5, `rgba(245, 158, 11, ${alpha})`);
    g.addColorStop(1, 'rgba(217, 146, 26, 0)');
  }
  ctx.strokeStyle = g;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
}

function drawOuterFrame(ctx, W, H, visualTheme) {
  const pad = Math.round(Math.min(W, H) * 0.022);
  const r = Math.round(Math.min(W, H) * 0.028);
  const g = ctx.createLinearGradient(pad, pad, W - pad, H - pad);

  if (visualTheme.mode === 'brand_1001') {
    g.addColorStop(0, '#0038A8');
    g.addColorStop(0.35, '#00A8FF');
    g.addColorStop(0.65, '#FF8C00');
    g.addColorStop(1, '#00227A');
  } else {
    g.addColorStop(0, visualTheme.isLight ? '#c4881e' : '#f59e0b');
    g.addColorStop(0.5, '#f59e0b');
    g.addColorStop(1, '#b47514');
  }

  ctx.save();
  ctx.strokeStyle = g;
  ctx.lineWidth = Math.max(3.5, Math.round(Math.min(W, H) * 0.0042));
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, r);
  ctx.stroke();
  ctx.restore();
}

// =========================================================================
// PRO GRAPHIC DESIGNER LOGO SYMMETRY:
// • 1001 طفل رقمي → في المنتصف تماماً (W / 2)
// • نادي أبدع للمهارات الذكية → على الجانب الأيمن
// • شركة المصدر → على الجانب الأيسر (متناظر تماماً مع نادي أبدع)
// =========================================================================
function drawProSymmetricalHeader(ctx, W, y, logoAbdaa, logo1001, logoMasdar, masdarStyle, isLight = true, scale = 1) {
  const cx = W / 2;
  const showSideMasdar = masdarStyle === 'header_balanced' && logoMasdar?.width;
  const sideDist = Math.min(W * 0.34, 340 * scale);
  const divDist = Math.min(W * 0.175, 178 * scale);

  // Subtle vertical gradient dividers flanking the center 1001 emblem
  const drawSideDivider = (vx) => {
    const dg = ctx.createLinearGradient(vx, y - 42 * scale, vx, y + 42 * scale);
    dg.addColorStop(0, 'rgba(0, 168, 255, 0.08)');
    dg.addColorStop(0.5, isLight ? 'rgba(255, 140, 0, 0.65)' : 'rgba(255, 184, 0, 0.72)');
    dg.addColorStop(1, 'rgba(0, 168, 255, 0.08)');
    ctx.strokeStyle = dg;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(vx, y - 40 * scale);
    ctx.lineTo(vx, y + 40 * scale);
    ctx.stroke();
  };

  // 1. CENTERPIECE (DEAD-CENTER x = W / 2): Hero «1001 طفل رقمي» Emblem
  ctx.save();
  if (logo1001?.width) {
    const lH = Math.round(70 * scale);
    const lW = (logo1001.width / logo1001.height) * lH;
    ctx.drawImage(logo1001, cx - lW / 2, y - lH * 0.74, lW, lH);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF';
  ctx.font = `900 ${Math.round(22 * scale)}px "Alexandria", "Tajawal", sans-serif`;
  ctx.fillText('طفل رقمي', cx, y + 36 * scale);

  ctx.direction = 'ltr';
  ctx.font = `800 ${Math.round(11.5 * scale)}px "Alexandria", sans-serif`;
  ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
  ctx.fillText('1001 DIGITAL KIDS', cx, y + 54 * scale);
  ctx.restore();

  // 2. RIGHT SIDE ANCHOR: «نادي أبدع للمهارات الذكية» (Stacked symmetrically: Icon centered over title!)
  const rightX = cx + sideDist;
  drawSideDivider(cx + divDist);

  ctx.save();
  if (logoAbdaa?.width) {
    const abH = Math.round(54 * scale);
    const abW = (logoAbdaa.width / logoAbdaa.height) * abH;
    ctx.drawImage(logoAbdaa, rightX - abW / 2, y - 44 * scale, abW, abH);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLight ? BRAND_PALETTE.abdaaNavy : '#FFFFFF';
  ctx.font = `900 ${Math.round(20 * scale)}px "Alexandria", "Tajawal", sans-serif`;
  ctx.fillText('نادي أبدع', rightX, y + 25 * scale);
  ctx.font = `800 ${Math.round(13.5 * scale)}px "Alexandria", "Tajawal", sans-serif`;
  ctx.fillStyle = isLight ? '#0068D6' : BRAND_PALETTE.abdaaAqua;
  ctx.fillText('للمهارات الذكية', rightX, y + 45 * scale);
  ctx.restore();

  // 3. LEFT SIDE ANCHOR (Exact mirror of Abdaa on Left!): «شركة المصدر» OR Balanced Motto Pill
  const leftX = cx - sideDist;
  drawSideDivider(cx - divDist);

  ctx.save();
  if (showSideMasdar) {
    const maxMW = Math.round(154 * scale);
    const maxMH = Math.round(48 * scale);
    const aspect = logoMasdar.width / logoMasdar.height;
    let mW = maxMH * aspect;
    let mH = maxMH;
    if (mW > maxMW) {
      mW = maxMW;
      mH = mW / aspect;
    }
    ctx.drawImage(logoMasdar, leftX - mW / 2, y - mH * 0.65, mW, mH);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? BRAND_PALETTE.abdaaNavy : '#E2E8F0';
    ctx.font = `800 ${Math.round(13 * scale)}px "Alexandria", "Tajawal", sans-serif`;
    ctx.fillText('الشريك المنظم', leftX, y + 37 * scale);
  } else {
    // Symmetric clean visual balance badge on left when Masdar is moved to footer or hidden
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltMid : '#FFFFFF';
    ctx.font = `900 ${Math.round(18 * scale)}px "Alexandria", "Tajawal", sans-serif`;
    ctx.fillText('النجف الأشرف', leftX, y - 4 * scale);
    ctx.fillStyle = isLight ? BRAND_PALETTE.orangeMid : '#FFB800';
    ctx.font = `800 ${Math.round(14 * scale)}px "Alexandria", "Tajawal", sans-serif`;
    ctx.fillText('الدفعة الأولى • 2026', leftX, y + 22 * scale);
  }
  ctx.restore();
}

function drawEyebrowPill(ctx, cx, y, text, visualTheme, maxW = 800) {
  if (!text?.trim()) return;
  ctx.save();
  ctx.font = '800 22px "Alexandria", "Tajawal", sans-serif';
  const tw = Math.min(ctx.measureText(text.trim()).width, maxW - 64);
  const pw = Math.min(maxW, tw + 78);
  const ph = 48;

  const g = ctx.createLinearGradient(cx - pw / 2, y, cx + pw / 2, y);
  if (visualTheme.mode === 'brand_1001' || visualTheme.mode === 'sky') {
    g.addColorStop(0, '#001C6B');
    g.addColorStop(0.5, '#0038A8');
    g.addColorStop(1, '#001C6B');
    ctx.fillStyle = g;
    ctx.strokeStyle = '#FF8C00';
  } else if (visualTheme.isLight) {
    g.addColorStop(0, '#061a42');
    g.addColorStop(0.5, '#0e3478');
    g.addColorStop(1, '#061a42');
    ctx.fillStyle = g;
    ctx.strokeStyle = '#d9921a';
  } else {
    ctx.fillStyle = 'rgba(0, 28, 107, 0.82)';
    ctx.strokeStyle = '#FFB800';
  }
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, y - ph / 2, pw, ph, ph / 2);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, text.trim(), cx, y + 1, pw - 44, 21, 14, '800');
  ctx.restore();
}

function drawVectorIcon(ctx, type, cx, cy, color = '#FFB800', cutout = '#00227A') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'calendar') {
    ctx.beginPath();
    ctx.roundRect(-14, -11, 28, 24, 5);
    ctx.stroke();
    ctx.fillRect(-14, -11, 28, 8);
    ctx.beginPath();
    ctx.moveTo(-7, -15);
    ctx.lineTo(-7, -9);
    ctx.moveTo(7, -15);
    ctx.lineTo(7, -9);
    ctx.stroke();
    ctx.fillRect(-8, 1, 4, 4);
    ctx.fillRect(-2, 1, 4, 4);
    ctx.fillRect(4, 1, 4, 4);
  } else if (type === 'clock') {
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 1);
    ctx.lineTo(6, 4);
    ctx.stroke();
  } else if (type === 'pin') {
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.bezierCurveTo(-12, 5, -13, -10, 0, -14);
    ctx.bezierCurveTo(13, -10, 12, 5, 0, 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.arc(0, -3, 4.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'ticket') {
    ctx.beginPath();
    ctx.roundRect(-16, -10, 32, 20, 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(-4, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'rocket') {
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.quadraticCurveTo(10, -4, 8, 9);
    ctx.lineTo(-8, 9);
    ctx.quadraticCurveTo(-10, -4, 0, -15);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4, 13);
    ctx.lineTo(0, 17);
    ctx.lineTo(4, 13);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFooterStrip(ctx, W, H, footerText, visualTheme, masdarStyle, logoMasdarFooter) {
  const barH = 72;
  const barY = H - barH - Math.round(Math.min(W, H) * 0.018);
  const padX = Math.round(Math.min(W, H) * 0.048);
  const footerOnDark = !visualTheme.isLight || visualTheme.hasDarkWaveFooter;

  ctx.save();
  if (!visualTheme.hasDarkWaveFooter) {
    drawAccentRule(ctx, W / 2, barY, W * 0.40, visualTheme.mode === 'brand_1001', 0.65);
  }

  const centerY = barY + barH * 0.54;
  const showFooterMasdar = masdarStyle === 'footer_subtle' && logoMasdarFooter?.width;

  if (showFooterMasdar) {
    const mH = 34;
    const mW = Math.min((logoMasdarFooter.width / logoMasdarFooter.height) * mH, 118);
    ctx.drawImage(logoMasdarFooter, padX + 12, centerY - mH / 2, mW, mH);

    ctx.strokeStyle = footerOnDark ? 'rgba(255, 184, 0, 0.6)' : 'rgba(0, 56, 168, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX + mW + 26, centerY - 14);
    ctx.lineTo(padX + mW + 26, centerY + 14);
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = footerOnDark ? '#FFFFFF' : BRAND_PALETTE.cobaltDeep;
    fitText(
      ctx,
      footerText || '',
      W - padX - 12,
      centerY,
      W - padX * 2 - mW - 58,
      21,
      13,
      '800',
      '"Tajawal", "Alexandria", sans-serif'
    );
  } else {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = footerOnDark ? '#FFFFFF' : BRAND_PALETTE.cobaltDeep;
    fitText(
      ctx,
      footerText || '',
      W / 2,
      centerY,
      W - padX * 2 - 20,
      23,
      14,
      '800',
      '"Tajawal", "Alexandria", sans-serif'
    );
  }
  ctx.restore();
}

function parsePairedLines(raw) {
  return String(raw || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const idx = l.indexOf('|');
      if (idx === -1) return { a: l, b: '' };
      return { a: l.slice(0, idx).trim(), b: l.slice(idx + 1).trim() };
    });
}

// ---------- Main Campaign Canvas Renderer ----------

export async function renderCampaignDesignToCanvas(canvas, templateId, customData = {}, options = {}) {
  const tpl = CAMPAIGN_TEMPLATES.find((t) => t.id === templateId) || CAMPAIGN_TEMPLATES[0];
  const formatKey = options.format || tpl.defaultFormat || 'post';
  const fmt = CAMPAIGN_FORMATS[formatKey] || CAMPAIGN_FORMATS.post;
  const W = fmt.w;
  const H = fmt.h;

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

  const d = { ...tpl.defaults, ...customData };
  const visualTheme = resolveVisualTheme(tpl, options.themeMode || 'brand_1001');
  const isLight = visualTheme.isLight;
  const isBrand1001 = visualTheme.mode === 'brand_1001' || visualTheme.mode === 'sky';
  const showPatronage = options.showPatronage !== false;
  const showPresidentFrame = options.showPresidentFrame !== false;
  const masdarStyle = options.masdarStyle || 'header_balanced';
  const customPhotoUrl = options.customPhotoUrl || '';

  const photoUrls = [];
  if (customPhotoUrl) {
    photoUrls.push(customPhotoUrl);
  } else if (Array.isArray(tpl.photoAssets)) {
    photoUrls.push(...tpl.photoAssets);
  } else if (tpl.photoAsset) {
    photoUrls.push(tpl.photoAsset);
  }

  const qrPromise = tpl.includeQrUrl
    ? generateOfficialQrDataUrl({ type: 'info', code: 'ABDAA-2026', name: tpl.includeQrUrl }, 220).then((u) => loadImg(u))
    : Promise.resolve(null);

  const headerMasdarSrc =
    masdarStyle === 'header_balanced'
      ? isLight
        ? '/brand/masdar-logo-full-clean.png'
        : '/brand/masdar-logo-full-white.png'
      : null;
  const footerMasdarSrc =
    masdarStyle === 'footer_subtle'
      ? !isLight || visualTheme.hasDarkWaveFooter
        ? '/brand/masdar-logo-full-white.png'
        : '/brand/masdar-logo-full-clean.png'
      : null;

  const [bgImg, logoAbdaa, logo1001, logoMasdarHeader, logoMasdarFooter, qrImg, ...photos] = await Promise.all([
    visualTheme.bgAsset ? loadImg(visualTheme.bgAsset) : Promise.resolve(null),
    loadImg('/brand/abdaa-logo.png'),
    loadImg('/brand/logo-1001-kids.png'),
    headerMasdarSrc ? loadImg(headerMasdarSrc) : Promise.resolve(null),
    footerMasdarSrc ? loadImg(footerMasdarSrc) : Promise.resolve(null),
    qrPromise,
    ...photoUrls.map((u) => loadImg(u))
  ]);

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Background Layer
  if (visualTheme.mode === 'brand_1001') {
    drawBrand1001VectorBackdrop(ctx, W, H, formatKey === 'cover');
  } else if (bgImg?.width) {
    drawImageCover(ctx, bgImg, 0, 0, W, H, visualTheme.hasDarkWaveFooter ? 1.0 : 0.5);
    if (!isLight) {
      const vig = ctx.createLinearGradient(0, 0, 0, H);
      vig.addColorStop(0, 'rgba(0, 22, 74, 0.50)');
      vig.addColorStop(0.5, 'rgba(0, 28, 107, 0.42)');
      vig.addColorStop(1, 'rgba(0, 16, 56, 0.80)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    } else if (visualTheme.mode === 'sky') {
      const soft = ctx.createRadialGradient(W / 2, H * 0.45, 80, W / 2, H * 0.5, H * 0.65);
      soft.addColorStop(0, 'rgba(255, 255, 255, 0.52)');
      soft.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = soft;
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    ctx.fillStyle = isLight ? '#FFFFFF' : '#001C6B';
    ctx.fillRect(0, 0, W, H);
  }

  drawOuterFrame(ctx, W, H, visualTheme);

  // Primary & Accent Brand Gradients
  const getPrimaryAccent = () => (isBrand1001 ? BRAND_PALETTE.orangeMid : '#d9921a');
  const getHeadingColor = () => (isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF');
  const getHighlightGrad = (yCenter) => {
    const gg = ctx.createLinearGradient(0, yCenter - 26, 0, yCenter + 26);
    if (isLight) {
      gg.addColorStop(0, '#FF5E00');
      gg.addColorStop(0.55, '#FF8C00');
      gg.addColorStop(1, '#E06D00');
    } else {
      gg.addColorStop(0, '#FFE066');
      gg.addColorStop(0.5, '#FFB800');
      gg.addColorStop(1, '#FF8C00');
    }
    return gg;
  };

  // ========= SPECIAL WIDE COVER LAYOUT (Facebook Cover 1640×624) =========
  if (formatKey === 'cover') {
    const cx = W / 2;
    drawProSymmetricalHeader(ctx, W, 102, logoAbdaa, logo1001, logoMasdarHeader, masdarStyle, isLight, 0.96);

    if (showPatronage && d.eyebrow?.trim()) {
      drawEyebrowPill(ctx, cx, 206, `★  ${d.eyebrow.trim()}  ★`, visualTheme, 760);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = getHeadingColor();
    fitText(ctx, d.headline || '', cx, 296, W - 220, 66, 36, '900');

    ctx.fillStyle = getHighlightGrad(376);
    fitText(ctx, d.highlight || '', cx, 376, W - 220, 54, 30, '900');

    ctx.fillStyle = isLight ? BRAND_PALETTE.abdaaNavy : '#E0F2FE';
    fitText(ctx, d.subtitle || '', cx, 446, W - 260, 27, 18, '700', '"Tajawal", sans-serif');

    drawFooterStrip(ctx, W, H, d.footerNote, visualTheme, masdarStyle, logoMasdarFooter);
    ctx.restore();
    return;
  }

  // ========= VERTICAL / SQUARE LAYOUTS (1080×1350 Post, 1080×1920 Story, 1080×1080 Square) =========
  const isStory = formatKey === 'story';
  const isSquare = formatKey === 'square';
  const cx = W / 2;

  const headerY = isStory ? 168 : isSquare ? 100 : 118;
  const eyebrowY = isStory ? 290 : isSquare ? 196 : 228;
  const headY = isStory ? 410 : isSquare ? 286 : 332;
  const hlY = isStory ? 498 : isSquare ? 354 : 412;
  const subY = isStory ? 580 : isSquare ? 420 : 486;
  const contentTopY = isStory ? 692 : isSquare ? 486 : 584;
  const contentBottomY = H - (isStory ? 215 : 158);
  const contentH = Math.max(250, contentBottomY - contentTopY);

  // Top Pro Symmetrical Brand Header (1001 Dead-Center, Abdaa Right, Masdar Left!)
  drawProSymmetricalHeader(
    ctx,
    W,
    headerY,
    logoAbdaa,
    logo1001,
    logoMasdarHeader,
    masdarStyle,
    isLight,
    isSquare ? 0.88 : 0.98
  );

  // Eyebrow / Patronage Pill
  const eyebrowText =
    templateId === 'official-hero' || templateId === 'page-identity' || templateId === 'vip-dignitaries'
      ? showPatronage
        ? d.eyebrow
        : 'ملتقى النجف للابتكار الرقمي'
      : d.eyebrow;
  drawEyebrowPill(ctx, cx, eyebrowY, eyebrowText, visualTheme, 900);

  // Clean Agency-Style Card Helper
  const fillThemedCard = (x, y, w, h, r = 24, borderColor = null) => {
    ctx.save();
    if (isLight) {
      ctx.shadowColor = 'rgba(0, 34, 122, 0.08)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = borderColor || (isBrand1001 ? '#CBDDF7' : '#d9921a');
      ctx.lineWidth = 2.4;
    } else {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, 'rgba(0, 28, 107, 0.88)');
      g.addColorStop(0.5, 'rgba(0, 56, 168, 0.88)');
      g.addColorStop(1, 'rgba(0, 28, 107, 0.88)');
      ctx.fillStyle = g;
      ctx.strokeStyle = borderColor || '#FF8C00';
      ctx.lineWidth = 2.4;
    }
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Crisp subtle top accent gradient strip inside white cards for pro agency polish
    if (isLight && isBrand1001) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.clip();
      const topBar = ctx.createLinearGradient(x, y, x + w, y);
      topBar.addColorStop(0, '#0038A8');
      topBar.addColorStop(0.5, '#00A8FF');
      topBar.addColorStop(1, '#FF8C00');
      ctx.fillStyle = topBar;
      ctx.fillRect(x, y, w, 5);
      ctx.restore();
    }
    ctx.restore();
  };

  // Standard Centered Headlines Helper
  const renderStandardHeadlines = (hY = headY, gY = hlY, sY = subY, maxSubLines = 2) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (!isLight) {
      ctx.shadowColor = 'rgba(0, 12, 48, 0.55)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 5;
    }
    ctx.fillStyle = getHeadingColor();
    fitText(ctx, d.headline || '', cx, hY, W - 130, isSquare ? 50 : 58, 32, '900');

    ctx.fillStyle = getHighlightGrad(gY);
    fitText(ctx, d.highlight || '', cx, gY, W - 130, isSquare ? 38 : 45, 24, '900');
    ctx.shadowColor = 'transparent';

    if (d.subtitle?.trim()) {
      ctx.font = `700 ${isSquare ? 22 : 25}px "Tajawal", "Alexandria", sans-serif`;
      ctx.fillStyle = isLight ? '#1E3A5F' : '#E2E8F0';
      const lines = wrapLines(ctx, d.subtitle, W - 180, maxSubLines);
      let cy = sY;
      lines.forEach((ln) => {
        fitText(ctx, ln, cx, cy, W - 160, isSquare ? 22 : 25, 17, '700', '"Tajawal", sans-serif');
        cy += isSquare ? 33 : 37;
      });
    }
    ctx.restore();
  };

  // Helper: Centered 3-Column Date / Time / Venue Cards with Centered Top Icon Medallions
  const renderCenteredDateTimeVenueCards = (rows, topY, cardH) => {
    const stripW = W - 130;
    const cGap = 20;
    const cW = (stripW - cGap * 2) / 3;
    const startX = (W - stripW) / 2;
    const iconTypes = ['calendar', 'clock', 'pin'];

    rows.forEach((it, idx) => {
      const x = startX + (2 - idx) * (cW + cGap);
      fillThemedCard(x, topY, cW, cardH, 24);

      const icX = x + cW / 2;
      const icY = topY + 46;
      ctx.save();
      const mg = ctx.createLinearGradient(icX - 26, icY - 26, icX + 26, icY + 26);
      mg.addColorStop(0, '#00227A');
      mg.addColorStop(1, '#0055CC');
      ctx.fillStyle = mg;
      ctx.strokeStyle = getPrimaryAccent();
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(icX, icY, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      drawVectorIcon(ctx, iconTypes[idx] || 'calendar', icX, icY, '#FFB800', '#00227A');

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
      fitText(ctx, it.a, icX, topY + 98, cW - 22, 22, 15, '900');

      ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF';
      ctx.font = '800 21px "Tajawal", "Alexandria", sans-serif';
      const valLines = wrapLines(ctx, it.b, cW - 24, 2);
      let ly = valLines.length > 1 ? topY + 130 : topY + 140;
      valLines.forEach((ln) => {
        fitText(ctx, ln, icX, ly, cW - 20, 21, 14, '800', '"Tajawal", sans-serif');
        ly += 26;
      });
      ctx.restore();
    });
  };

  // ========= PER-TEMPLATE BESPOKE COMPOSITIONS (ALL CENTERED & PRO) =========

  if (templateId === 'page-identity') {
    renderStandardHeadlines(headY + 18, hlY + 28, subY + 34, 2);
    const boxW = W - 170;
    const boxH = Math.min(250, contentH * 0.58);
    const boxY = contentTopY + (contentH - boxH) / 2;
    ctx.save();
    const cg = ctx.createLinearGradient(cx - boxW / 2, boxY, cx + boxW / 2, boxY + boxH);
    cg.addColorStop(0, '#001C6B');
    cg.addColorStop(0.5, '#0038A8');
    cg.addColorStop(1, '#001C6B');
    ctx.fillStyle = cg;
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(cx - boxW / 2, boxY, boxW, boxH, 30);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFB800';
    fitText(ctx, '172 بطلاً رقمياً  •  40 ابتكاراً حياً', cx, boxY + boxH * 0.36, boxW - 60, 36, 22, '900');
    drawAccentRule(ctx, cx, boxY + boxH * 0.56, boxW * 0.34, true, 0.9);
    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, 'ملتقى النجف للابتكار الرقمي • 27 تشرين الثاني 2026', cx, boxY + boxH * 0.76, boxW - 60, 26, 17, '800', '"Tajawal", sans-serif');
    ctx.restore();
  } else if (templateId === 'teaser-launch') {
    renderStandardHeadlines(headY, hlY, subY, 3);
    const pW = W - 160;
    const pH = Math.min(isStory ? 590 : 455, contentH - 34);
    const pX = (W - pW) / 2;
    const pY = contentTopY + (contentH - pH) / 2 + 10;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 34, 122, 0.22)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 32);
    ctx.fillStyle = '#001C6B';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 32);
    ctx.clip();
    if (photos[0]?.width) {
      drawImageCover(ctx, photos[0], pX, pY, pW, pH, 0.38);
      const ov = ctx.createLinearGradient(0, pY, 0, pY + pH);
      ov.addColorStop(0, 'rgba(0, 28, 107, 0.06)');
      ov.addColorStop(0.65, 'rgba(0, 28, 107, 0.14)');
      ov.addColorStop(1, 'rgba(0, 28, 107, 0.88)');
      ctx.fillStyle = ov;
      ctx.fillRect(pX, pY, pW, pH);
    }
    ctx.restore();

    const frameG = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
    frameG.addColorStop(0, '#0038A8');
    frameG.addColorStop(0.5, '#00A8FF');
    frameG.addColorStop(1, '#FF8C00');
    ctx.strokeStyle = frameG;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 32);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFB800';
    fitText(ctx, '★  النجف الأشرف تستعد للعرس الرقمي  ★', cx, pY + pH - 42, pW - 60, 26, 17, '900');
    ctx.restore();
  } else if (templateId === 'story-numbers') {
    renderStandardHeadlines(headY, hlY, subY, 2);
    const items = parsePairedLines(d.extraLines).slice(0, 4);
    const cols = 2;
    const gap = 26;
    const cardW = (W - 150 - gap) / cols;
    const cardH = Math.min(isStory ? 250 : 204, (contentH - gap - 26) / 2);
    const startX = (W - (cardW * cols + gap)) / 2;
    const totalH = cardH * 2 + gap;
    const startY = contentTopY + (contentH - totalH) / 2;

    items.forEach((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + (1 - col) * (cardW + gap);
      const y = startY + row * (cardH + gap);

      ctx.save();
      if (isLight) {
        ctx.shadowColor = 'rgba(0, 34, 122, 0.10)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 26);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 26);
        ctx.clip();
        const topH = cardH * 0.56;
        const ng = ctx.createLinearGradient(x, y, x + cardW, y + topH);
        if (i === 2) {
          // Highlight the 172 graduates card with signature 1001 orange-gold gradient!
          ng.addColorStop(0, '#FF5E00');
          ng.addColorStop(1, '#FF9E00');
        } else {
          ng.addColorStop(0, '#001C6B');
          ng.addColorStop(1, '#0048C4');
        }
        ctx.fillStyle = ng;
        ctx.fillRect(x, y, cardW, topH);
        ctx.restore();

        ctx.strokeStyle = i === 2 ? '#FF8C00' : '#BFD7F5';
        ctx.lineWidth = i === 2 ? 3.2 : 2.2;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 26);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        fitText(ctx, it.a, x + cardW / 2, y + cardH * 0.29, cardW - 36, isSquare ? 58 : 68, 38, '900');

        ctx.fillStyle = BRAND_PALETTE.cobaltDeep;
        fitText(ctx, it.b, x + cardW / 2, y + cardH * 0.78, cardW - 32, isSquare ? 22 : 24, 15, '800', '"Tajawal", sans-serif');
      } else {
        fillThemedCard(x, y, cardW, cardH, 26, i === 2 ? '#FFB800' : '#00A8FF');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFB800';
        fitText(ctx, it.a, x + cardW / 2, y + cardH * 0.40, cardW - 40, isSquare ? 64 : 74, 42, '900');
        drawAccentRule(ctx, x + cardW / 2, y + cardH * 0.64, cardW * 0.32, true, 0.7);
        ctx.fillStyle = '#FFFFFF';
        fitText(ctx, it.b, x + cardW / 2, y + cardH * 0.80, cardW - 36, isSquare ? 22 : 25, 16, '800', '"Tajawal", sans-serif');
      }
      ctx.restore();
    });
  } else if (templateId === 'official-hero') {
    // 👑 PRESIDENTIAL PATRONAGE OFFICIAL POSTER (Centered Presidential Frame + Exact 1001/Abdaa Palette + Centered 3-Col Icons!)
    const hasPortraitArea = showPresidentFrame && !isSquare;
    const rows = parsePairedLines(d.extraLines).slice(0, 3);

    if (hasPortraitArea) {
      const pR = isStory ? 142 : 108;
      const pY = eyebrowY + pR + (isStory ? 50 : 34);

      ctx.save();
      const halo = ctx.createRadialGradient(cx, pY, pR * 0.65, cx, pY, pR * 1.42);
      halo.addColorStop(0, isLight ? 'rgba(0, 168, 255, 0.20)' : 'rgba(255, 184, 0, 0.35)');
      halo.addColorStop(1, 'rgba(0, 168, 255, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, pY, pR * 1.42, 0, Math.PI * 2);
      ctx.fill();

      drawAccentRule(ctx, cx - pR - 135, pY, 105, isBrand1001, 0.85);
      drawAccentRule(ctx, cx + pR + 135, pY, 105, isBrand1001, 0.85);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, pY, pR, 0, Math.PI * 2);
      ctx.clip();

      if (photos[0]?.width) {
        drawImageCover(ctx, photos[0], cx - pR, pY - pR, pR * 2, pR * 2, 0.22);
      } else {
        const bgP = ctx.createRadialGradient(cx, pY - 22, 8, cx, pY, pR);
        bgP.addColorStop(0, '#0048C4');
        bgP.addColorStop(1, '#001C6B');
        ctx.fillStyle = bgP;
        ctx.fillRect(cx - pR, pY - pR, pR * 2, pR * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFB800';
        ctx.font = `900 ${Math.round(pR * 0.46)}px "Alexandria", sans-serif`;
        ctx.fillText('★', cx, pY - 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `800 ${Math.round(pR * 0.16)}px "Alexandria", "Tajawal", sans-serif`;
        ctx.fillText('رعاية رئاسية كريمة', cx, pY + pR * 0.38);
      }
      ctx.restore();

      // Double Brand Ring (Cobalt-Orange Gradient!)
      const ringGrad = ctx.createLinearGradient(cx - pR, pY - pR, cx + pR, pY + pR);
      ringGrad.addColorStop(0, '#FF5E00');
      ringGrad.addColorStop(0.5, '#FFB800');
      ringGrad.addColorStop(1, '#0038A8');
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx, pY, pR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = isLight ? 'rgba(0, 56, 168, 0.22)' : 'rgba(255, 184, 0, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, pY, pR + 11, 0, Math.PI * 2);
      ctx.stroke();

      let nextY = pY + pR + (isStory ? 44 : 34);
      if (d.presidentTitle?.trim()) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
        fitText(ctx, d.presidentTitle.trim(), cx, nextY, W - 180, isStory ? 27 : 23, 16, '900');
        nextY += isStory ? 76 : 62;
      } else {
        nextY += 18;
      }

      const hl2Y = nextY + (isStory ? 74 : 62);
      const sub2Y = hl2Y + (isStory ? 64 : 54);
      renderStandardHeadlines(nextY, hl2Y, sub2Y, 2);

      const cH = isStory ? 214 : 186;
      const cY = Math.min(contentBottomY - cH - 18, sub2Y + (isStory ? 124 : 112));
      renderCenteredDateTimeVenueCards(rows, cY, cH);
      ctx.restore();
    } else {
      // Portrait OFF or Square 1:1 — STILL uses sleek CENTERED 3-Column Icon Cards (zero right-crammed rows!)
      renderStandardHeadlines(headY + 14, hlY + 24, subY + 34, 3);
      const cH = isStory ? 240 : isSquare ? 184 : 210;
      const cY = contentTopY + (contentH - cH) / 2 + 12;
      renderCenteredDateTimeVenueCards(rows, cY, cH);
    }
  } else if (templateId === 'vip-dignitaries') {
    // CENTERED EXECUTIVE VIP GRID (Featured Top Card + 2×2 Centered Cards — zero right-aligned AI bars!)
    renderStandardHeadlines(headY - 8, hlY - 4, subY + 4, 2);

    const vips = parsePairedLines(d.extraLines).slice(0, 5);
    if (vips.length > 0) {
      const boxW = W - 140;
      const startX = (W - boxW) / 2;
      const gap = isSquare ? 16 : 20;
      const hasOddLead = vips.length % 2 === 1;
      const lead = hasOddLead ? vips[0] : null;
      const rest = hasOddLead ? vips.slice(1) : vips;
      const restRows = Math.ceil(rest.length / 2);
      const totalRows = (lead ? 1 : 0) + restRows;
      const cardH = Math.min(isStory ? 195 : 146, (contentH - gap * (totalRows - 1) - 16) / Math.max(1, totalRows));
      const totalH = totalRows * cardH + (totalRows - 1) * gap;
      let curY = contentTopY + (contentH - totalH) / 2;

      const drawCenteredVipCard = (v, x, y, w, h, featured = false) => {
        ctx.save();
        if (featured) {
          const fg = ctx.createLinearGradient(x, y, x + w, y + h);
          fg.addColorStop(0, '#001C6B');
          fg.addColorStop(0.5, '#0038A8');
          fg.addColorStop(1, '#001C6B');
          ctx.fillStyle = fg;
          ctx.strokeStyle = '#FF8C00';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 24);
          ctx.fill();
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#FFB800';
          fitText(ctx, `★  ${v.a}  ★`, x + w / 2, y + h * 0.34, w - 50, isSquare ? 20 : 22, 14, '800');
          ctx.fillStyle = '#FFFFFF';
          fitText(ctx, v.b || v.a, x + w / 2, y + h * 0.69, w - 50, isSquare ? 28 : 34, 20, '900');
        } else {
          fillThemedCard(x, y, w, h, 22);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
          fitText(ctx, v.a, x + w / 2, y + h * 0.34, w - 34, isSquare ? 18 : 20, 13, '800');
          ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF';
          fitText(ctx, v.b || v.a, x + w / 2, y + h * 0.69, w - 34, isSquare ? 24 : 27, 17, '900');
        }
        ctx.restore();
      };

      if (lead) {
        drawCenteredVipCard(lead, startX, curY, boxW, cardH, true);
        curY += cardH + gap;
      }

      const halfW = (boxW - gap) / 2;
      rest.forEach((v, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const rx = startX + (1 - col) * (halfW + gap);
        const ry = curY + row * (cardH + gap);
        drawCenteredVipCard(v, rx, ry, halfW, cardH, false);
      });
    }
  } else if (templateId === 'vip-speaker-spotlight') {
    const ringR = isStory ? 180 : isSquare ? 120 : 146;
    const ringY = eyebrowY + ringR + (isStory ? 76 : 46);

    ctx.save();
    const aura = ctx.createRadialGradient(cx, ringY, ringR * 0.7, cx, ringY, ringR * 1.38);
    aura.addColorStop(0, isLight ? 'rgba(0, 168, 255, 0.22)' : 'rgba(255, 184, 0, 0.36)');
    aura.addColorStop(1, 'rgba(0, 168, 255, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR * 1.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
    ctx.clip();

    if (photos[0]?.width) {
      drawImageCover(ctx, photos[0], cx - ringR, ringY - ringR, ringR * 2, ringR * 2, 0.22);
    } else {
      const pbg = ctx.createRadialGradient(cx, ringY - 30, 10, cx, ringY, ringR);
      pbg.addColorStop(0, '#0048C4');
      pbg.addColorStop(1, '#001C6B');
      ctx.fillStyle = pbg;
      ctx.fillRect(cx - ringR, ringY - ringR, ringR * 2, ringR * 2);

      ctx.fillStyle = '#FFB800';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(ringR * 0.52)}px "Alexandria", sans-serif`;
      ctx.fillText('★', cx, ringY - 12);
      ctx.font = `800 ${Math.round(ringR * 0.14)}px "Alexandria", sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('ارفع الصورة هنا', cx, ringY + ringR * 0.44);
    }
    ctx.restore();

    const ringG = ctx.createLinearGradient(cx - ringR, ringY - ringR, cx + ringR, ringY + ringR);
    ringG.addColorStop(0, '#FF5E00');
    ringG.addColorStop(0.5, '#FFB800');
    ringG.addColorStop(1, '#0038A8');
    ctx.strokeStyle = ringG;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
    ctx.stroke();

    const nameY = ringY + ringR + (isStory ? 76 : 56);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = getHeadingColor();
    fitText(ctx, d.headline || '', cx, nameY, W - 140, isSquare ? 44 : 52, 28, '900');

    const roleY = nameY + (isStory ? 60 : 50);
    ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
    fitText(ctx, d.highlight || '', cx, roleY, W - 160, isSquare ? 24 : 27, 17, '800');

    drawAccentRule(ctx, cx, roleY + 46, 220, isBrand1001, 0.85);

    if (d.subtitle?.trim()) {
      const qW = W - 160;
      const qY = roleY + 72;
      const qH = Math.min(isStory ? 220 : 154, contentBottomY - qY - 14);
      if (qH > 70) {
        fillThemedCard(cx - qW / 2, qY, qW, qH, 26);

        ctx.font = `700 ${isSquare ? 22 : 25}px "Tajawal", "Alexandria", sans-serif`;
        ctx.fillStyle = isLight ? BRAND_PALETTE.abdaaNavy : '#F1F5F9';
        const qLines = wrapLines(ctx, d.subtitle, qW - 70, 3);
        const lh = isSquare ? 33 : 38;
        let ly = qY + qH / 2 - ((qLines.length - 1) * lh) / 2;
        qLines.forEach((ln) => {
          fitText(ctx, ln, cx, ly, qW - 60, isSquare ? 22 : 25, 17, '700', '"Tajawal", sans-serif');
          ly += lh;
        });
      }
    }
    ctx.restore();
  } else if (templateId === 'projects-expo') {
    renderStandardHeadlines(headY, hlY, subY, 2);

    const trackList = String(d.extraLines || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
    const pillRowH = trackList.length ? 68 : 0;
    const galW = W - 140;
    const galH = Math.min(isStory ? 590 : 395, contentH - pillRowH - 36);
    const galX = (W - galW) / 2;
    const galY = contentTopY + 6;
    const gGap = 18;

    const drawFramedPhoto = (img, x, y, w, h) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.clip();
      if (img?.width) {
        drawImageCover(ctx, img, x, y, w, h, 0.4);
      } else {
        ctx.fillStyle = '#00227A';
        ctx.fillRect(x, y, w, h);
      }
      ctx.restore();
      ctx.strokeStyle = isBrand1001 ? '#00A8FF' : '#d9921a';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.stroke();
    };

    if (photos.length >= 3) {
      const bigW = galW * 0.56;
      const smallW = galW - bigW - gGap;
      const smallH = (galH - gGap) / 2;
      drawFramedPhoto(photos[0], galX + smallW + gGap, galY, bigW, galH);
      drawFramedPhoto(photos[1], galX, galY, smallW, smallH);
      drawFramedPhoto(photos[2], galX, galY + smallH + gGap, smallW, smallH);
    } else if (photos[0]) {
      drawFramedPhoto(photos[0], galX, galY, galW, galH);
    }

    if (trackList.length) {
      const py = galY + galH + 42;
      const pGap = 14;
      const pw = (galW - pGap * (trackList.length - 1)) / trackList.length;
      trackList.forEach((tr, idx) => {
        const px = galX + (trackList.length - 1 - idx) * (pw + pGap);
        ctx.save();
        ctx.fillStyle = idx % 2 === 0 ? '#00227A' : '#FF7A00';
        ctx.beginPath();
        ctx.roundRect(px, py - 24, pw, 48, 24);
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        fitText(ctx, tr, px + pw / 2, py + 1, pw - 20, 19, 13, '800');
        ctx.restore();
      });
    }
  } else if (templateId === 'agenda-highlights') {
    // CENTERED 2×2 EDITORIAL PHASE GRID (Zero right-aligned vertical spine!)
    renderStandardHeadlines(headY - 8, hlY - 4, subY + 4, 2);

    const steps = parsePairedLines(d.extraLines).slice(0, 4);
    const cols = 2;
    const gap = 24;
    const cardW = (W - 140 - gap) / cols;
    const cardH = Math.min(isStory ? 280 : 215, (contentH - gap - 36) / 2);
    const startX = (W - (cardW * cols + gap)) / 2;
    const totalH = cardH * 2 + gap;
    const startY = contentTopY + (contentH - totalH) / 2 + 12;

    steps.forEach((st, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + (1 - col) * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const midX = x + cardW / 2;

      fillThemedCard(x, y, cardW, cardH, 24);

      ctx.save();
      // Centered Number Medallion perched right on Top-Center of Card!
      const badgeG = ctx.createLinearGradient(midX - 24, y - 24, midX + 24, y + 24);
      if (idx === 3) {
        badgeG.addColorStop(0, '#FF5E00');
        badgeG.addColorStop(1, '#FFB800');
      } else {
        badgeG.addColorStop(0, '#001C6B');
        badgeG.addColorStop(1, '#0055CC');
      }
      ctx.fillStyle = badgeG;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(midX, y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 22px "Alexandria", sans-serif';
      ctx.fillText(String(idx + 1), midX, y + 1);

      // Centered Time Pill
      ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
      fitText(ctx, st.a, midX, y + 48, cardW - 30, 21, 15, '900');

      // Centered Agenda Description (up to 3 crisp lines)
      ctx.font = `800 ${isSquare ? 19 : 21}px "Tajawal", "Alexandria", sans-serif`;
      ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF';
      const lines = wrapLines(ctx, st.b, cardW - 38, 3);
      const lh = 28;
      let ly = y + cardH * 0.64 - ((lines.length - 1) * lh) / 2;
      lines.forEach((ln) => {
        fitText(ctx, ln, midX, ly, cardW - 34, isSquare ? 19 : 21, 14, '800', '"Tajawal", sans-serif');
        ly += lh;
      });
      ctx.restore();
    });
  } else if (templateId === 'mentors-tribute') {
    renderStandardHeadlines(headY, hlY, subY, 3);

    const stats = parsePairedLines(d.extraLines).slice(0, 3);
    const statRowH = 128;
    const pW = W - 160;
    const pH = Math.min(isStory ? 450 : 300, contentH - statRowH - 42);
    const pX = (W - pW) / 2;
    const pY = contentTopY + 10;

    if (photos[0]?.width && pH > 120) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pX, pY, pW, pH, 30);
      ctx.clip();
      drawImageCover(ctx, photos[0], pX, pY, pW, pH, 0.35);
      ctx.restore();
      ctx.strokeStyle = '#FF8C00';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(pX, pY, pW, pH, 30);
      ctx.stroke();
    }

    const sGap = 22;
    const sW = (pW - sGap * (stats.length - 1)) / Math.max(1, stats.length);
    const sY = pY + (pH > 120 ? pH + 24 : 30);
    stats.forEach((st, idx) => {
      const sx = pX + (stats.length - 1 - idx) * (sW + sGap);
      ctx.save();
      const cg = ctx.createLinearGradient(sx, sY, sx, sY + statRowH);
      if (idx === 1) {
        cg.addColorStop(0, '#FF5E00');
        cg.addColorStop(1, '#FF9E00');
      } else {
        cg.addColorStop(0, '#001C6B');
        cg.addColorStop(1, '#0048C4');
      }
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.roundRect(sx, sY, sW, statRowH, 24);
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      fitText(ctx, st.a, sx + sW / 2, sY + 46, sW - 24, 46, 28, '900');
      ctx.fillStyle = idx === 1 ? '#FFF7ED' : '#BAE6FD';
      fitText(ctx, st.b, sx + sW / 2, sY + 95, sW - 24, 21, 14, '800', '"Tajawal", sans-serif');
      ctx.restore();
    });
  } else if (templateId === 'grad-frame-cta') {
    renderStandardHeadlines(headY, hlY, subY, 2);

    const boxW = W - 150;
    const boxX = (W - boxW) / 2;
    const boxY = contentTopY + 12;
    const boxH = Math.min(isStory ? 590 : 440, contentH - 28);

    const photoSize = isStory ? 390 : Math.min(372, boxH - 30);
    const photoX = isStory ? cx - photoSize / 2 : boxX + boxW - photoSize - 10;
    const photoY = isStory ? boxY : boxY + (boxH - photoSize) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 34, 122, 0.16)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(photoX - 14, photoY - 14, photoSize + 28, photoSize + 28, 36);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 26);
    ctx.clip();
    if (photos[0]?.width) {
      drawImageCover(ctx, photos[0], photoX, photoY, photoSize, photoSize, 0.3);
    }
    ctx.restore();

    const fGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoSize, photoY + photoSize);
    fGrad.addColorStop(0, '#0038A8');
    fGrad.addColorStop(0.5, '#00A8FF');
    fGrad.addColorStop(1, '#FF8C00');
    ctx.strokeStyle = fGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 26);
    ctx.stroke();

    ctx.fillStyle = '#00227A';
    ctx.beginPath();
    ctx.roundRect(photoX + 24, photoY + photoSize - 56, photoSize - 48, 44, 22);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFB800';
    fitText(ctx, 'خريج مبادرة 1001 طفل رقمي ★', photoX + photoSize / 2, photoY + photoSize - 33, photoSize - 64, 20, 14, '900');

    const qrCardW = isStory ? boxW - 120 : boxW - photoSize - 48;
    const qrCardH = isStory ? 182 : Math.min(330, photoSize);
    const qrCardX = isStory ? cx - qrCardW / 2 : boxX;
    const qrCardY = isStory ? photoY + photoSize + 38 : boxY + (boxH - qrCardH) / 2;

    fillThemedCard(qrCardX, qrCardY, qrCardW, qrCardH, 28, '#00A8FF');

    if (qrImg?.width) {
      const qs = isStory ? 130 : Math.min(192, qrCardW - 60);
      const qx = isStory ? qrCardX + 28 : qrCardX + (qrCardW - qs) / 2;
      const qy = isStory ? qrCardY + (qrCardH - qs) / 2 : qrCardY + 26;
      ctx.drawImage(qrImg, qx, qy, qs, qs);

      ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF';
      if (isStory) {
        ctx.textAlign = 'center';
        const tx = qrCardX + qs + 28 + (qrCardW - qs - 56) / 2;
        fitText(ctx, tpl.qrLabel || 'امسح الكود', tx, qrCardY + qrCardH * 0.38, qrCardW - qs - 66, 25, 16, '900');
        ctx.fillStyle = BRAND_PALETTE.orangeDeep;
        fitText(ctx, 'abdaa.masdar.company/frame', tx, qrCardY + qrCardH * 0.68, qrCardW - qs - 66, 20, 13, '800');
      } else {
        ctx.textAlign = 'center';
        fitText(ctx, tpl.qrLabel || 'امسح الكود', qrCardX + qrCardW / 2, qy + qs + 34, qrCardW - 26, 20, 14, '900');
        ctx.fillStyle = BRAND_PALETTE.orangeDeep;
        fitText(ctx, 'abdaa.masdar.company/frame', qrCardX + qrCardW / 2, qy + qs + 68, qrCardW - 26, 17, 12, '800');
      }
    }
    ctx.restore();
  } else if (templateId === 'booking-batch2') {
    // CENTERED 2-COLUMN FEATURE CARDS (Centered Vector Ticket & Rocket Icons!) + Centered QR Banner
    renderStandardHeadlines(headY, hlY, subY, 2);

    const cards = parsePairedLines(d.extraLines).slice(0, 2);
    const boxW = W - 140;
    const boxX = (W - boxW) / 2;
    const qrBoxH = isStory ? 220 : 184;
    const cGap = 22;
    const cW = (boxW - cGap) / 2;
    const cH = Math.min(isStory ? 260 : 212, contentH - qrBoxH - 36);
    const cY = contentTopY + 12;

    cards.forEach((c, idx) => {
      const x = boxX + (1 - idx) * (cW + cGap);
      const midX = x + cW / 2;
      fillThemedCard(x, cY, cW, cH, 26);

      ctx.save();
      const icY = cY + 46;
      const mg = ctx.createLinearGradient(midX - 26, icY - 26, midX + 26, icY + 26);
      if (idx === 0) {
        mg.addColorStop(0, '#001C6B');
        mg.addColorStop(1, '#0048C4');
      } else {
        mg.addColorStop(0, '#FF5E00');
        mg.addColorStop(1, '#FF9E00');
      }
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(midX, icY, 28, 0, Math.PI * 2);
      ctx.fill();
      drawVectorIcon(ctx, idx === 0 ? 'ticket' : 'rocket', midX, icY, '#FFFFFF', '#00227A');

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? (idx === 0 ? BRAND_PALETTE.cobaltDeep : BRAND_PALETTE.orangeDeep) : '#FFB800';
      fitText(ctx, c.a, midX, cY + 98, cW - 28, 24, 16, '900');

      ctx.font = '700 20px "Tajawal", "Alexandria", sans-serif';
      ctx.fillStyle = isLight ? '#334155' : '#E2E8F0';
      const lines = wrapLines(ctx, c.b, cW - 34, 3);
      let ly = cY + 134;
      lines.forEach((ln) => {
        fitText(ctx, ln, midX, ly, cW - 30, 20, 14, '700', '"Tajawal", sans-serif');
        ly += 27;
      });
      ctx.restore();
    });

    const qy = cY + cH + 22;
    ctx.save();
    const qbG = ctx.createLinearGradient(boxX, qy, boxX + boxW, qy + qrBoxH);
    qbG.addColorStop(0, '#001C6B');
    qbG.addColorStop(0.55, '#0038A8');
    qbG.addColorStop(1, '#001C6B');
    ctx.fillStyle = qbG;
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(boxX, qy, boxW, qrBoxH, 28);
    ctx.fill();
    ctx.stroke();

    const qs = qrBoxH - 36;
    if (qrImg?.width) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(boxX + 20, qy + 14, qs + 8, qs + 8, 16);
      ctx.fill();
      ctx.drawImage(qrImg, boxX + 24, qy + 18, qs, qs);
    }
    const textCenterX = boxX + qs + 36 + (boxW - qs - 56) / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFB800';
    fitText(ctx, tpl.qrLabel || 'امسح الكود للحجز الفوري', textCenterX, qy + qrBoxH * 0.29, boxW - qs - 76, 29, 18, '900');
    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, 'abdaa.masdar.company', textCenterX, qy + qrBoxH * 0.59, boxW - qs - 76, 28, 18, '900');
    ctx.fillStyle = '#BAE6FD';
    fitText(ctx, 'حجز فوري ومجاني • استلم تذكرتك خلال ثوانٍ', textCenterX, qy + qrBoxH * 0.82, boxW - qs - 76, 19, 13, '700', '"Tajawal", sans-serif');
    ctx.restore();
  } else if (templateId === 'countdown-arrival') {
    const medR = isStory ? 168 : isSquare ? 106 : 132;
    const medY = eyebrowY + medR + (isStory ? 74 : 44);

    ctx.save();
    const aura = ctx.createRadialGradient(cx, medY, medR * 0.4, cx, medY, medR * 1.55);
    aura.addColorStop(0, isLight ? 'rgba(0, 168, 255, 0.24)' : 'rgba(255, 184, 0, 0.40)');
    aura.addColorStop(1, 'rgba(0, 168, 255, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, medY, medR * 1.55, 0, Math.PI * 2);
    ctx.fill();

    const mg = ctx.createLinearGradient(cx - medR, medY - medR, cx + medR, medY + medR);
    mg.addColorStop(0, '#001C6B');
    mg.addColorStop(0.55, '#0048C4');
    mg.addColorStop(1, '#001C6B');
    ctx.fillStyle = mg;

    const ringG = ctx.createLinearGradient(cx - medR, medY - medR, cx + medR, medY + medR);
    ringG.addColorStop(0, '#FF5E00');
    ringG.addColorStop(0.5, '#FFB800');
    ringG.addColorStop(1, '#00A8FF');
    ctx.strokeStyle = ringG;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, medY, medR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const numStr = String(d.countdownNumber || '3');
    ctx.fillStyle = '#FFB800';
    fitText(ctx, numStr, cx, medY - 14, medR * 1.5, numStr.length <= 2 ? 102 : 64, 38, '900');
    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, d.countdownUnit || 'أيام متبقية', cx, medY + medR * 0.44, medR * 1.55, 24, 15, '800');

    const titleY = medY + medR + (isStory ? 78 : 54);
    ctx.fillStyle = getHeadingColor();
    fitText(ctx, d.headline || '', cx, titleY, W - 140, isSquare ? 48 : 54, 30, '900');

    const subHlY = titleY + (isStory ? 62 : 50);
    ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
    fitText(ctx, d.highlight || '', cx, subHlY, W - 160, isSquare ? 25 : 29, 18, '800');

    const items = parsePairedLines(d.extraLines).slice(0, 3);
    if (items.length) {
      const stripW = W - 140;
      const sGap = 20;
      const sW = (stripW - sGap * (items.length - 1)) / items.length;
      const sH = isStory ? 156 : 124;
      const sY = Math.min(contentBottomY - sH - 16, subHlY + (isStory ? 90 : 48));
      const startX = (W - stripW) / 2;

      items.forEach((it, idx) => {
        const sx = startX + (items.length - 1 - idx) * (sW + sGap);
        fillThemedCard(sx, sY, sW, sH, 22);
        ctx.fillStyle = isLight ? BRAND_PALETTE.orangeDeep : '#FFB800';
        fitText(ctx, it.a, sx + sW / 2, sY + sH * 0.36, sW - 24, 21, 14, '800');
        ctx.fillStyle = isLight ? BRAND_PALETTE.cobaltDeep : '#FFFFFF';
        fitText(ctx, it.b, sx + sW / 2, sY + sH * 0.70, sW - 24, 24, 15, '900', '"Tajawal", sans-serif');
      });
    }
    ctx.restore();
  }

  // Bottom Footer Strip
  drawFooterStrip(ctx, W, H, d.footerNote, visualTheme, masdarStyle, logoMasdarFooter);
  ctx.restore();
}

// ---------- PNG & Batch ZIP Export ----------

export async function renderCampaignPngBlob(templateId, customData = {}, options = {}) {
  const tpl = CAMPAIGN_TEMPLATES.find((t) => t.id === templateId) || CAMPAIGN_TEMPLATES[0];
  const formatKey = options.format || tpl.defaultFormat || 'post';
  const canvas = document.createElement('canvas');
  await renderCampaignDesignToCanvas(canvas, templateId, customData, { ...options, format: formatKey });
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const num = String(tpl.order).padStart(2, '0');
  const filename = `${num} - ${sanitizeFilename(tpl.name)} (${formatKey}).png`;
  return { dataUrl, blob, filename };
}

export async function downloadCampaignPng(templateId, customData = {}, options = {}) {
  const { dataUrl, filename } = await renderCampaignPngBlob(templateId, customData, options);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
  return filename;
}

export async function exportCampaignZip(templatesList, overridesById = {}, globalOptions = {}, onProgress) {
  const files = [];
  const formatsToExport = globalOptions.includeStories ? ['post', 'story'] : ['default'];
  const total = templatesList.length * formatsToExport.length;
  let done = 0;

  for (const tpl of templatesList) {
    const customData = overridesById[tpl.id] || {};
    const customPhotoUrl = globalOptions.customPhotosById?.[tpl.id] || '';
    for (const fMode of formatsToExport) {
      const fmt = fMode === 'default' ? tpl.defaultFormat || 'post' : fMode === 'post' && tpl.defaultFormat === 'cover' ? 'cover' : fMode;
      if (onProgress) onProgress(done, total, `${tpl.name} (${CAMPAIGN_FORMATS[fmt]?.label || fmt})`);
      const { blob, filename } = await renderCampaignPngBlob(tpl.id, customData, {
        ...globalOptions,
        format: fmt,
        customPhotoUrl
      });
      if (blob) {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        files.push({ name: filename, data: bytes });
      }
      done += 1;
    }
  }

  const captionsTxt = templatesList
    .map(
      (t) =>
        `========================================\n[${String(t.order).padStart(2, '0')}] ${t.name}\n========================================\n${t.caption}\n`
    )
    .join('\n');
  files.push({
    name: '00 - نصوص وكابشنات النشر (إنستغرام وفيسبوك).txt',
    data: new TextEncoder().encode('\uFEFF' + captionsTxt)
  });

  if (onProgress) onProgress(total, total, 'جارٍ ضغط ملفات الحملة الإعلانية...');
  const zipBlob = buildZipBlob(files);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `الحملة الإعلانية الكاملة - 1001 طفل رقمي (${templatesList.length} تصاميم).zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
