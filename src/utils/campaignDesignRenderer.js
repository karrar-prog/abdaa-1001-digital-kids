// محرك تصميم وتصدير قوالب الحملة الإعلانية لإنستغرام وفيسبوك (12 قالباً موزعة على 4 مراحل)
// مطابق تماماً لهوية الاحتفالية الرئيسية (الأبيض اللؤلؤي + النيلي الملكي + الذهبي) مع تنويع الفاتح والسماوي والليلي
// يدعم مقاسات: بوست (1080×1350)، ستوري (1080×1920)، مربع/بروفايل (1080×1080)، غلاف فيسبوك (1640×624)

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

export const CAMPAIGN_FORMATS = {
  post: { id: 'post', label: 'بوست (4:5)', subtitle: '1080×1350', w: 1080, h: 1350 },
  story: { id: 'story', label: 'ستوري (9:16)', subtitle: '1080×1920', w: 1080, h: 1920 },
  square: { id: 'square', label: 'مربع / بروفايل (1:1)', subtitle: '1080×1080', w: 1080, h: 1080 },
  cover: { id: 'cover', label: 'غلاف فيسبوك', subtitle: '1640×624', w: 1640, h: 624 }
};

export const CAMPAIGN_THEMES = [
  { id: 'auto', label: 'متنوع متوازن (افتراضي)', emoji: '✨' },
  { id: 'ivory', label: 'أبيض ونيلي وذهبي', emoji: '☀️' },
  { id: 'sky', label: 'سماوي فاتح مبهج', emoji: '🌤️' },
  { id: 'royal', label: 'نيلي ملكي مسائي', emoji: '🌙' }
];

export const MASDAR_CAMPAIGN_STYLES = [
  { id: 'header_triple', label: 'بالترويسة مع الشعارين (متوازن)' },
  { id: 'footer_subtle', label: 'بالشريط السفلي' },
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
    defaultTheme: 'ivory',
    name: 'غلاف وبروفايل الصفحة الرسمية',
    shortDesc: 'الهوية البصرية بالأبيض والنيلي والذهبي لافتتاح صفحتي فيسبوك وإنستغرام',
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
    defaultTheme: 'royal',
    name: 'بوست التشويق الأول (قريباً...)',
    shortDesc: 'منشور تشويقي لافت يجذب الانتباه لبدء الحملة اليوم',
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
    defaultTheme: 'ivory',
    name: 'قصة المبادرة والأرقام الحقيقية',
    shortDesc: 'إنفوغرافيك مشرق يروي قصة أبطال العرب ومسيرة 896 ← 700 ← 172 خريجاً',
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
    defaultTheme: 'ivory',
    supportsPresidentPortrait: true,
    name: 'البوستر الرسمي — برعاية فخامة رئيس الجمهورية 👑',
    shortDesc: 'بوستر الرعاية الرئاسية بالأبيض والنيلي والذهبي — يدعم رفع صورة فخامة الرئيس',
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
    defaultTheme: 'ivory',
    name: 'كوكبة الحضور والشخصيات الرسمية',
    shortDesc: 'تصميم بروتوكولي بالأبيض والنيلي والذهبي يبرز الشخصيات الوطنية المشاركة',
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
    defaultTheme: 'ivory',
    supportsPortrait: true,
    name: 'بطاقة شخصية / متحدث رسمي (فردية)',
    shortDesc: 'قالب مخصص لكل ضيف شرف أو متحدث — اختر من القائمة وارفع صورته',
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
    defaultTheme: 'sky',
    name: 'معرض الابتكارات الحية (40 مشروعاً)',
    shortDesc: 'استعراض مشرق لمعرض مشاريع الأطفال الحية مع صور حقيقية من مختبرات أبدع',
    photoAssets: ['/gallery/training_1.jpg', '/gallery/training_4.jpg', '/gallery/training_6.jpg'],
    defaults: {
      eyebrow: 'معرض علمي حي مفتوح للعائلات والضيوف 🤖',
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
    defaultTheme: 'ivory',
    name: 'المنهاج الرسمي وأبرز فقرات الحفل',
    shortDesc: 'ملخص أنيق لفترات الحفل الأربع بالأبيض والنيلي والذهبي',
    defaults: {
      eyebrow: 'البرنامج البروتوكولي الرسمي للحفل 📋',
      headline: 'منهاج حفل التخرج',
      highlight: '4 فترات احتفالية حافلة بالإلهام',
      subtitle: 'من تلاوة القرآن والسلام الجمهوري حتى تتويج 172 بطلاً وافتتاح معرض الابتكارات:',
      footerNote: 'تصفّح المنهاج الحيوي الكامل: abdaa.masdar.company/agenda',
      extraLines:
        '3:00 عصراً|الافتتاح البروتوكولي: القرآن الكريم، السلام الجمهوري، وسورة الفاتحة\n3:15 عصراً|الكلمات الرسمية: المؤسس، رئاسة الجمهورية، المحافظة، الوزارة، والنقابة\n3:40 عصراً|فقرات المبادرة: قصة الأبطال، حوار التمكين الرقمي، والفيديو التوثيقي\n4:05 عصراً|لحظة التتويج الكبرى: تكريم الـ 172 خريجاً وافتتاح معرض الـ 40 مشروعاً'
    },
    caption:
      '📋 تعرّفوا على أبرز محطات المنهاج الرسمي لحفل تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي»:\n\n🕒 3:00 عصراً — الافتتاح (تلاوة عطرة، السلام الجمهوري، سورة الفاتحة)\n🕒 3:15 عصراً — الكلمات الرسمية للشخصيات والوفود\n🕒 3:40 عصراً — فقرات المبادرة والفيديو التوثيقي لرحلة الأطفال\n🕓 4:05 عصراً — تتويج الـ 172 بطلاً رقمياً وافتتاح معرض الـ 40 ابتكاراً\n\nشاهدوا المنهاج الحيوي التفاعلي بالكامل:\n🌐 https://abdaa.masdar.company/agenda\n\n#منهاج_الحفل #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف'
  },
  {
    id: 'mentors-tribute',
    order: 9,
    phase: 'phase3',
    defaultFormat: 'post',
    defaultTheme: 'ivory',
    name: 'تحية الوفاء للمدربين المتطوعين',
    shortDesc: 'بطاقة امتنان وإجلال لـ 26 مؤسساً وشريكاً ومدرباً متطوعاً صنعوا هذا الأثر',
    photoAsset: '/gallery/training_5.jpg',
    defaults: {
      eyebrow: 'جنود العطاء والإلهام في النجف الأشرف 💛',
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
    defaultTheme: 'sky',
    name: 'حملة الأهالي: إطار التخرج التذكاري',
    shortDesc: 'بوست مشرق وتفاعلي يدعو الأهالي لصنع صورة طفلهم في /frame ونشرها',
    photoAsset: '/gallery/training_2.jpg',
    includeQrUrl: 'https://abdaa.masdar.company/frame',
    qrLabel: 'امسح الكود لصنع الإطار فوراً',
    defaults: {
      eyebrow: 'شاركوا فرحة التخرج مع الأهل والأصدقاء 📸🎉',
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
    defaultTheme: 'sky',
    name: 'حجز المقاعد المجاني + الدفعة الثانية',
    shortDesc: 'بوست مشرق لدعوة العائلات لحجز تذكرة الحضور المجانية والتسجيل للدفعة الثانية',
    includeQrUrl: 'https://abdaa.masdar.company',
    qrLabel: 'امسح للحجز المجاني والتسجيل',
    defaults: {
      eyebrow: 'الدعوة مفتوحة للعائلات والمهتمين بالتعليم والابتكار 🎟️',
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
    defaultTheme: 'royal',
    name: 'العدّ التنازلي + دليل يوم الحفل',
    shortDesc: 'قالب عدّ تنازلي مرن (3 أيام / يومان / غداً / اليوم) مع إرشادات الحضور',
    supportsCountdown: true,
    defaults: {
      eyebrow: 'حفل تخرج الدفعة الأولى • مبادرة «1001 طفل رقمي»',
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

function resolveVisualTheme(tpl, themeMode = 'auto') {
  const chosen = themeMode === 'auto' || !themeMode ? tpl.defaultTheme || 'ivory' : themeMode;

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
  // 'royal' evening dark navy
  const useTech = tpl.id === 'teaser-launch' || tpl.id === 'story-numbers' || tpl.id === 'projects-expo';
  return {
    mode: 'royal',
    isLight: false,
    hasDarkWaveFooter: true,
    bgAsset: useTech ? '/campaign/bg-future-kids.jpg' : '/campaign/bg-royal-gala.jpg'
  };
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

function drawGoldRule(ctx, cx, y, halfW, alpha = 0.85) {
  const g = ctx.createLinearGradient(cx - halfW, y, cx + halfW, y);
  g.addColorStop(0, 'rgba(217, 146, 26, 0)');
  g.addColorStop(0.25, `rgba(245, 158, 11, ${alpha})`);
  g.addColorStop(0.5, `rgba(217, 146, 26, ${alpha})`);
  g.addColorStop(0.75, `rgba(245, 158, 11, ${alpha})`);
  g.addColorStop(1, 'rgba(217, 146, 26, 0)');
  ctx.strokeStyle = g;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
}

function drawRoyalBorderFrame(ctx, W, H, isLight = false) {
  const pad = Math.round(Math.min(W, H) * 0.024);
  const r = Math.round(Math.min(W, H) * 0.030);
  const g = ctx.createLinearGradient(pad, pad, W - pad, H - pad);
  g.addColorStop(0, isLight ? '#c4881e' : '#f59e0b');
  g.addColorStop(0.3, isLight ? '#f59e0b' : '#fef08a');
  g.addColorStop(0.55, '#b47514');
  g.addColorStop(0.8, isLight ? '#eab308' : '#fde68a');
  g.addColorStop(1, '#9a610c');

  ctx.save();
  ctx.strokeStyle = g;
  ctx.lineWidth = Math.max(4, Math.round(Math.min(W, H) * 0.005));
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, r);
  ctx.stroke();

  ctx.strokeStyle = isLight ? 'rgba(180, 117, 20, 0.24)' : 'rgba(254, 240, 138, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pad + 9, pad + 9, W - (pad + 9) * 2, H - (pad + 9) * 2, Math.max(10, r - 6));
  ctx.stroke();
  ctx.restore();
}

function drawTopBrandHeader(ctx, W, y, logoAbdaa, logo1001, logoMasdar, masdarStyle, isLight = false, scale = 1) {
  const cx = W / 2;
  const showTriple = masdarStyle === 'header_triple' && logoMasdar?.width;

  const drawDivider = (vx, halfH) => {
    const dg = ctx.createLinearGradient(vx, y - halfH, vx, y + halfH);
    dg.addColorStop(0, 'rgba(217, 146, 26, 0.15)');
    dg.addColorStop(0.5, '#d9921a');
    dg.addColorStop(1, 'rgba(217, 146, 26, 0.15)');
    ctx.strokeStyle = dg;
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(vx, y - halfH);
    ctx.lineTo(vx, y + halfH);
    ctx.stroke();
  };

  if (showTriple) {
    // Balanced 3-Brand Official Lockup matching event_poster.jpg: [نادي أبدع (Right)] | [1001 طفل رقمي (Center)] | [مصدر (Left)]
    const span = Math.min(W - 110, 960 * scale);
    const leftBound = cx - span / 2;
    const rightBound = cx + span / 2;
    const div1X = cx + span * 0.185; // between Abdaa & 1001
    const div2X = cx - span * 0.195; // between 1001 & Masdar
    const h = Math.round(70 * scale);

    drawDivider(div1X, h * 0.52);
    drawDivider(div2X, h * 0.52);

    // RIGHT BLOCK: Abdaa Robot + Stacked Title
    const rightBlockCenter = (div1X + rightBound) / 2;
    if (logoAbdaa?.width) {
      const abW = (logoAbdaa.width / logoAbdaa.height) * h;
      const abX = rightBlockCenter + 54 * scale;
      ctx.drawImage(logoAbdaa, abX, y - h / 2, abW, h);
      ctx.save();
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? '#082357' : '#ffffff';
      ctx.font = `900 ${Math.round(25 * scale)}px "Alexandria", "Tajawal", sans-serif`;
      ctx.fillText('نادي أبدع', abX - 10 * scale, y - 12 * scale);
      ctx.font = `800 ${Math.round(15.5 * scale)}px "Alexandria", "Tajawal", sans-serif`;
      ctx.fillStyle = isLight ? '#1e3a6e' : '#bae6fd';
      ctx.fillText('للمهارات الذكية', abX - 10 * scale, y + 15 * scale);
      ctx.restore();
    }

    // CENTER BLOCK: 1001 Logo + "طفل رقمي / 1001 DIGITAL KIDS"
    const centerBlockRight = div1X - 16 * scale;
    let leftEdge1001 = cx - 40 * scale;
    if (logo1001?.width) {
      const lH = h * 1.04;
      const lW = (logo1001.width / logo1001.height) * lH;
      const lx = centerBlockRight - lW;
      leftEdge1001 = lx;
      ctx.drawImage(logo1001, lx, y - lH / 2, lW, lH);
    }
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    ctx.font = `900 ${Math.round(23 * scale)}px "Alexandria", "Tajawal", sans-serif`;
    ctx.fillText('طفل رقمي', leftEdge1001 - 8 * scale, y - 10 * scale);
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = `900 ${Math.round(12 * scale)}px "Alexandria", sans-serif`;
    ctx.fillStyle = isLight ? '#1e3a6e' : '#fde68a';
    ctx.fillText('1001 DIGITAL KIDS', leftEdge1001 - 8 * scale, y + 14 * scale);
    ctx.restore();

    // LEFT BLOCK: Official Masdar Logo (proportional, clean, dignified)
    const leftBlockCenter = (leftBound + div2X) / 2;
    const maxMW = (div2X - leftBound) - 36 * scale;
    const maxMH = Math.round(52 * scale);
    const aspect = logoMasdar.width / logoMasdar.height;
    let mW = maxMH * aspect;
    let mH = maxMH;
    if (mW > maxMW) {
      mW = maxMW;
      mH = mW / aspect;
    }
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#b47514' : '#fde68a';
    ctx.font = `800 ${Math.round(12.5 * scale)}px "Alexandria", "Tajawal", sans-serif`;
    ctx.fillText('الشريك المنظم', leftBlockCenter, y - mH / 2 - 11 * scale);
    ctx.drawImage(logoMasdar, leftBlockCenter - mW / 2, y - mH / 2 + 8 * scale, mW, mH);
    ctx.restore();
    return;
  }

  // Classic 2-Brand Symmetrical Lockup
  const h = Math.round(76 * scale);
  drawDivider(cx, h * 0.48);

  if (logoAbdaa?.width) {
    const abW = (logoAbdaa.width / logoAbdaa.height) * h;
    ctx.drawImage(logoAbdaa, cx + 178 * scale, y - h / 2, abW, h);
  }
  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLight ? '#082357' : '#ffffff';
  ctx.font = `900 ${Math.round(28 * scale)}px "Alexandria", "Tajawal", sans-serif`;
  ctx.fillText('نادي أبدع', cx + 166 * scale, y - 13 * scale);
  ctx.font = `800 ${Math.round(17 * scale)}px "Alexandria", "Tajawal", sans-serif`;
  ctx.fillStyle = isLight ? '#1e3a6e' : '#bae6fd';
  ctx.fillText('للمهارات الذكية', cx + 166 * scale, y + 16 * scale);
  ctx.restore();

  let leftEdge = cx - 130 * scale;
  if (logo1001?.width) {
    const lH = h * 1.04;
    const lW = (logo1001.width / logo1001.height) * lH;
    const lx = cx - 22 * scale - lW;
    leftEdge = lx;
    ctx.drawImage(logo1001, lx, y - lH / 2, lW, lH);
  }
  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLight ? '#082357' : '#ffffff';
  ctx.font = `900 ${Math.round(25 * scale)}px "Alexandria", "Tajawal", sans-serif`;
  ctx.fillText('طفل رقمي', leftEdge - 10 * scale, y - 10 * scale);
  ctx.direction = 'ltr';
  ctx.textAlign = 'right';
  ctx.font = `900 ${Math.round(13 * scale)}px "Alexandria", sans-serif`;
  ctx.fillStyle = isLight ? '#1e3a6e' : '#fde68a';
  ctx.fillText('1001 DIGITAL KIDS', leftEdge - 10 * scale, y + 16 * scale);
  ctx.restore();
}

function drawEyebrowPill(ctx, cx, y, text, isLight = false, maxW = 780) {
  if (!text?.trim()) return;
  ctx.save();
  ctx.font = '800 22px "Alexandria", "Tajawal", sans-serif';
  const tw = Math.min(ctx.measureText(text.trim()).width, maxW - 64);
  const pw = Math.min(maxW, tw + 74);
  const ph = 48;

  if (isLight) {
    const g = ctx.createLinearGradient(cx - pw / 2, y, cx + pw / 2, y);
    g.addColorStop(0, '#061a42');
    g.addColorStop(0.5, '#0e3478');
    g.addColorStop(1, '#061a42');
    ctx.fillStyle = g;
    ctx.strokeStyle = '#d9921a';
  } else {
    ctx.fillStyle = 'rgba(7, 27, 64, 0.78)';
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.88)';
  }
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, y - ph / 2, pw, ph, ph / 2);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fde68a';
  fitText(ctx, text.trim(), cx, y + 1, pw - 44, 21, 14, '800');
  ctx.restore();
}

function drawVectorEventIcon(ctx, idx, icX, icY, color = '#fde047', dotCutout = '#082357') {
  ctx.save();
  ctx.translate(icX, icY);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (idx === 0) {
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
  } else if (idx === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 1);
    ctx.lineTo(6, 4);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.bezierCurveTo(-12, 5, -13, -10, 0, -14);
    ctx.bezierCurveTo(13, -10, 12, 5, 0, 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = dotCutout;
    ctx.beginPath();
    ctx.arc(0, -3, 4.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFooterStrip(ctx, W, H, footerText, visualTheme, masdarStyle, logoMasdarFooter) {
  const barH = 74;
  const barY = H - barH - Math.round(Math.min(W, H) * 0.024);
  const padX = Math.round(Math.min(W, H) * 0.048);
  const footerOnDark = !visualTheme.isLight || visualTheme.hasDarkWaveFooter;

  ctx.save();
  if (!visualTheme.hasDarkWaveFooter) {
    drawGoldRule(ctx, W / 2, barY, W * 0.41, visualTheme.isLight ? 0.65 : 0.75);
  }

  const centerY = barY + barH * 0.56;
  const showFooterMasdar = masdarStyle === 'footer_subtle' && logoMasdarFooter?.width;

  if (showFooterMasdar) {
    const mH = 34;
    const mW = Math.min((logoMasdarFooter.width / logoMasdarFooter.height) * mH, 118);
    ctx.drawImage(logoMasdarFooter, padX + 12, centerY - mH / 2, mW, mH);

    // Subtle divider next to Masdar
    ctx.strokeStyle = footerOnDark ? 'rgba(253, 224, 71, 0.55)' : 'rgba(217, 146, 26, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX + mW + 26, centerY - 14);
    ctx.lineTo(padX + mW + 26, centerY + 14);
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = footerOnDark ? '#fef08a' : '#082357';
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
    ctx.fillStyle = footerOnDark ? '#fef08a' : '#082357';
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
  const visualTheme = resolveVisualTheme(tpl, options.themeMode || 'auto');
  const isLight = visualTheme.isLight;
  const showPatronage = options.showPatronage !== false;
  const showPresidentFrame = options.showPresidentFrame !== false;
  const masdarStyle = options.masdarStyle || 'header_triple';
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
    masdarStyle === 'header_triple'
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
    loadImg(visualTheme.bgAsset),
    loadImg('/brand/abdaa-logo.png'),
    loadImg('/brand/logo-1001-kids.png'),
    headerMasdarSrc ? loadImg(headerMasdarSrc) : Promise.resolve(null),
    footerMasdarSrc ? loadImg(footerMasdarSrc) : Promise.resolve(null),
    qrPromise,
    ...photoUrls.map((u) => loadImg(u))
  ]);

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Background Artwork Layer + Crisp Protective Balance
  if (bgImg?.width) {
    drawImageCover(ctx, bgImg, 0, 0, W, H, visualTheme.hasDarkWaveFooter ? 1.0 : 0.5);
    if (!isLight) {
      const vig = ctx.createLinearGradient(0, 0, 0, H);
      vig.addColorStop(0, 'rgba(3, 14, 40, 0.52)');
      vig.addColorStop(0.45, 'rgba(4, 18, 48, 0.42)');
      vig.addColorStop(1, 'rgba(2, 11, 31, 0.78)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    } else if (visualTheme.mode === 'sky') {
      const soft = ctx.createRadialGradient(W / 2, H * 0.45, 80, W / 2, H * 0.5, H * 0.65);
      soft.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
      soft.addColorStop(1, 'rgba(255, 255, 255, 0.06)');
      ctx.fillStyle = soft;
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    const fg = ctx.createLinearGradient(0, 0, W, H);
    if (isLight) {
      fg.addColorStop(0, '#ffffff');
      fg.addColorStop(1, '#f8f5ec');
    } else {
      fg.addColorStop(0, '#03102b');
      fg.addColorStop(0.5, '#0a2b66');
      fg.addColorStop(1, '#030d24');
    }
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);
  }

  // On Ivory wide cover (1640x624), draw a sleek royal indigo bottom wave band so cover stays crisp
  if (formatKey === 'cover' && visualTheme.hasDarkWaveFooter && isLight) {
    ctx.save();
    const wGrad = ctx.createLinearGradient(0, H - 102, W, H);
    wGrad.addColorStop(0, '#041230');
    wGrad.addColorStop(0.5, '#0c2f70');
    wGrad.addColorStop(1, '#041230');
    ctx.fillStyle = wGrad;
    ctx.beginPath();
    ctx.moveTo(0, H - 90);
    ctx.bezierCurveTo(W * 0.3, H - 110, W * 0.7, H - 72, W, H - 96);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, H - 90);
    ctx.bezierCurveTo(W * 0.3, H - 110, W * 0.7, H - 72, W, H - 96);
    ctx.stroke();
    ctx.restore();
  }

  drawRoyalBorderFrame(ctx, W, H, isLight);

  // ========= SPECIAL WIDE COVER LAYOUT (Facebook Cover 1640×624) =========
  if (formatKey === 'cover') {
    const cx = W / 2;
    drawTopBrandHeader(ctx, W, 108, logoAbdaa, logo1001, logoMasdarHeader, masdarStyle, isLight, 1.05);

    if (showPatronage && d.eyebrow?.trim()) {
      drawEyebrowPill(ctx, cx, 206, `★  ${d.eyebrow.trim()}  ★`, isLight, 760);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    fitText(ctx, d.headline || '', cx, 296, W - 220, 68, 36, '900');

    const goldText = ctx.createLinearGradient(0, 345, 0, 415);
    goldText.addColorStop(0, isLight ? '#b45309' : '#fef08a');
    goldText.addColorStop(0.5, isLight ? '#ea580c' : '#f59e0b');
    goldText.addColorStop(1, isLight ? '#c47a0e' : '#d97706');
    ctx.fillStyle = goldText;
    fitText(ctx, d.highlight || '', cx, 378, W - 220, 56, 30, '900');

    ctx.fillStyle = isLight ? '#334155' : '#e0f2fe';
    fitText(ctx, d.subtitle || '', cx, 448, W - 260, 28, 18, '700', '"Tajawal", sans-serif');

    drawFooterStrip(ctx, W, H, d.footerNote, visualTheme, masdarStyle, logoMasdarFooter);
    ctx.restore();
    return;
  }

  // ========= VERTICAL / SQUARE LAYOUTS (1080×1350 Post, 1080×1920 Story, 1080×1080 Square) =========
  const isStory = formatKey === 'story';
  const isSquare = formatKey === 'square';
  const cx = W / 2;

  const headerY = isStory ? 168 : isSquare ? 102 : 118;
  const eyebrowY = isStory ? 278 : isSquare ? 190 : 218;
  const headY = isStory ? 402 : isSquare ? 280 : 322;
  const hlY = isStory ? 492 : isSquare ? 348 : 404;
  const subY = isStory ? 576 : isSquare ? 416 : 480;
  const contentTopY = isStory ? 690 : isSquare ? 484 : 582;
  const contentBottomY = H - (isStory ? 215 : 158);
  const contentH = Math.max(250, contentBottomY - contentTopY);

  // Top Official Header (2 or 3 Balanced Official Logos)
  drawTopBrandHeader(ctx, W, headerY, logoAbdaa, logo1001, logoMasdarHeader, masdarStyle, isLight, isSquare ? 0.92 : 1.0);

  // Eyebrow / Patronage Pill
  const eyebrowText =
    templateId === 'official-hero' || templateId === 'page-identity' || templateId === 'vip-dignitaries'
      ? showPatronage
        ? d.eyebrow
        : 'ملتقى النجف للابتكار الرقمي'
      : d.eyebrow;
  drawEyebrowPill(ctx, cx, eyebrowY, eyebrowText, isLight, 920);

  // Theme-aware reusable card surface helpers
  const fillThemedCard = (x, y, w, h, r = 24, accentBorder = null) => {
    ctx.save();
    if (isLight) {
      ctx.shadowColor = 'rgba(8, 35, 87, 0.09)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = accentBorder || '#d9921a';
      ctx.lineWidth = 2.6;
    } else {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, 'rgba(7, 27, 64, 0.88)');
      g.addColorStop(0.5, 'rgba(13, 47, 107, 0.92)');
      g.addColorStop(1, 'rgba(7, 27, 64, 0.88)');
      ctx.fillStyle = g;
      ctx.strokeStyle = accentBorder || '#eab308';
      ctx.lineWidth = 2.6;
    }
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();
    ctx.restore();
  };

  // Standard Headlines Helper
  const renderStandardHeadlines = (hY = headY, gY = hlY, sY = subY, maxSubLines = 2) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (!isLight) {
      ctx.shadowColor = 'rgba(2, 6, 23, 0.55)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
    }
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    fitText(ctx, d.headline || '', cx, hY, W - 130, isSquare ? 52 : 60, 32, '900');

    const gg = ctx.createLinearGradient(0, gY - 30, 0, gY + 30);
    if (isLight) {
      gg.addColorStop(0, '#c2590a');
      gg.addColorStop(0.5, '#ea580c');
      gg.addColorStop(1, '#b45309');
    } else {
      gg.addColorStop(0, '#fef08a');
      gg.addColorStop(0.5, '#f59e0b');
      gg.addColorStop(1, '#eab308');
    }
    ctx.fillStyle = gg;
    fitText(ctx, d.highlight || '', cx, gY, W - 130, isSquare ? 40 : 46, 24, '900');
    ctx.shadowColor = 'transparent';

    if (d.subtitle?.trim()) {
      ctx.font = `700 ${isSquare ? 23 : 26}px "Tajawal", "Alexandria", sans-serif`;
      ctx.fillStyle = isLight ? '#1e293b' : '#e2e8f0';
      const lines = wrapLines(ctx, d.subtitle, W - 180, maxSubLines);
      let cy = sY;
      lines.forEach((ln) => {
        fitText(ctx, ln, cx, cy, W - 160, isSquare ? 23 : 26, 17, '700', '"Tajawal", sans-serif');
        cy += isSquare ? 34 : 38;
      });
    }
    ctx.restore();
  };

  // ========= PER-TEMPLATE BESPOKE COMPOSITIONS =========

  if (templateId === 'page-identity') {
    renderStandardHeadlines(headY + 20, hlY + 30, subY + 36, 2);
    const boxW = W - 170;
    const boxH = Math.min(250, contentH * 0.6);
    const boxY = contentTopY + (contentH - boxH) / 2;
    ctx.save();
    // Royal Indigo Showcase Ribbon Card (looks royal on both white & dark!)
    const cg = ctx.createLinearGradient(cx - boxW / 2, boxY, cx + boxW / 2, boxY + boxH);
    cg.addColorStop(0, '#051638');
    cg.addColorStop(0.5, '#0e3478');
    cg.addColorStop(1, '#051638');
    ctx.fillStyle = cg;
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(cx - boxW / 2, boxY, boxW, boxH, 32);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, '172 بطلاً رقمياً  •  40 ابتكاراً حياً', cx, boxY + boxH * 0.36, boxW - 60, 36, 22, '900');
    drawGoldRule(ctx, cx, boxY + boxH * 0.56, boxW * 0.34, 0.85);
    ctx.fillStyle = '#f8fafc';
    fitText(ctx, 'ملتقى النجف للابتكار الرقمي • 27 تشرين الثاني 2026', cx, boxY + boxH * 0.76, boxW - 60, 26, 17, '800', '"Tajawal", sans-serif');
    ctx.restore();
  } else if (templateId === 'teaser-launch') {
    renderStandardHeadlines(headY, hlY, subY, 3);
    const pW = W - 160;
    const pH = Math.min(isStory ? 600 : 460, contentH - 36);
    const pX = (W - pW) / 2;
    const pY = contentTopY + (contentH - pH) / 2 + 10;

    ctx.save();
    ctx.shadowColor = 'rgba(8, 35, 87, 0.25)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 34);
    ctx.fillStyle = '#071b40';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 34);
    ctx.clip();
    if (photos[0]?.width) {
      drawImageCover(ctx, photos[0], pX, pY, pW, pH, 0.38);
      const ov = ctx.createLinearGradient(0, pY, 0, pY + pH);
      ov.addColorStop(0, 'rgba(4, 18, 48, 0.08)');
      ov.addColorStop(0.65, 'rgba(4, 18, 48, 0.14)');
      ov.addColorStop(1, 'rgba(4, 18, 48, 0.86)');
      ctx.fillStyle = ov;
      ctx.fillRect(pX, pY, pW, pH);
    }
    ctx.restore();

    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 34);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, '★  النجف الأشرف تستعد للعرس الرقمي  ★', cx, pY + pH - 42, pW - 60, 26, 17, '900');
    ctx.restore();
  } else if (templateId === 'story-numbers') {
    renderStandardHeadlines(headY, hlY, subY, 2);
    const items = parsePairedLines(d.extraLines).slice(0, 4);
    const cols = 2;
    const gap = 26;
    const cardW = (W - 150 - gap) / cols;
    const cardH = Math.min(isStory ? 250 : 206, (contentH - gap - 26) / 2);
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
        // Signature Invitation-Style Arch-Header Stat Cards (Navy Top Half + Crisp White Bottom Half!)
        ctx.shadowColor = 'rgba(8, 35, 87, 0.10)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#ffffff';
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
        ng.addColorStop(0, '#051638');
        ng.addColorStop(0.5, '#0e3478');
        ng.addColorStop(1, '#051638');
        ctx.fillStyle = ng;
        ctx.fillRect(x, y, cardW, topH);
        ctx.fillStyle = '#d9921a';
        ctx.fillRect(x, y + topH - 2, cardW, 3);
        ctx.restore();

        ctx.strokeStyle = i === 2 ? '#ea580c' : '#d9921a';
        ctx.lineWidth = i === 2 ? 3.5 : 2.8;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 26);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fde047';
        fitText(ctx, it.a, x + cardW / 2, y + cardH * 0.30, cardW - 36, isSquare ? 58 : 68, 38, '900');

        ctx.fillStyle = '#082357';
        fitText(ctx, it.b, x + cardW / 2, y + cardH * 0.78, cardW - 32, isSquare ? 22 : 24, 15, '800', '"Tajawal", sans-serif');
      } else {
        fillThemedCard(x, y, cardW, cardH, 28, i === 2 ? '#fde047' : 'rgba(234, 179, 8, 0.72)');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fde047';
        fitText(ctx, it.a, x + cardW / 2, y + cardH * 0.40, cardW - 40, isSquare ? 64 : 74, 42, '900');
        drawGoldRule(ctx, x + cardW / 2, y + cardH * 0.64, cardW * 0.32, 0.65);
        ctx.fillStyle = '#f8fafc';
        fitText(ctx, it.b, x + cardW / 2, y + cardH * 0.80, cardW - 36, isSquare ? 22 : 25, 16, '800', '"Tajawal", sans-serif');
      }
      ctx.restore();
    });
  } else if (templateId === 'official-hero') {
    // 👑 SPECIAL PRESIDENTIAL PATRONAGE OFFICIAL POSTER (Matches White + Indigo + Gold Hero Identity + Optional President Portrait!)
    const hasPortraitArea = showPresidentFrame && !isSquare;

    if (hasPortraitArea) {
      // Stately Presidential Portrait Frame centered gracefully right beneath the Patronage Ribbon
      const pR = isStory ? 148 : 114;
      const pY = eyebrowY + pR + (isStory ? 54 : 38);

      ctx.save();
      // Subtle golden halo behind presidential medallion
      const halo = ctx.createRadialGradient(cx, pY, pR * 0.65, cx, pY, pR * 1.38);
      halo.addColorStop(0, isLight ? 'rgba(217, 146, 26, 0.24)' : 'rgba(251, 191, 36, 0.38)');
      halo.addColorStop(1, 'rgba(217, 146, 26, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, pY, pR * 1.38, 0, Math.PI * 2);
      ctx.fill();

      // Flanking royal golden accent lines
      drawGoldRule(ctx, cx - pR - 140, pY, 110, 0.8);
      drawGoldRule(ctx, cx + pR + 140, pY, 110, 0.8);

      // Circular Portrait Container
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, pY, pR, 0, Math.PI * 2);
      ctx.clip();

      if (photos[0]?.width) {
        drawImageCover(ctx, photos[0], cx - pR, pY - pR, pR * 2, pR * 2, 0.22);
      } else {
        const bgP = ctx.createRadialGradient(cx, pY - 24, 8, cx, pY, pR);
        bgP.addColorStop(0, '#0f3982');
        bgP.addColorStop(1, '#041230');
        ctx.fillStyle = bgP;
        ctx.fillRect(cx - pR, pY - pR, pR * 2, pR * 2);

        // Dignified Presidential Emblem Placeholder (when photo not yet uploaded)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fde047';
        ctx.font = `900 ${Math.round(pR * 0.48)}px "Alexandria", sans-serif`;
        ctx.fillText('★', cx, pY - 16);
        ctx.fillStyle = '#fde68a';
        ctx.font = `800 ${Math.round(pR * 0.16)}px "Alexandria", "Tajawal", sans-serif`;
        ctx.fillText('رعاية رئاسية كريمة', cx, pY + pR * 0.38);
      }
      ctx.restore();

      // Double Royal Metallic-Gold Medallion Ring
      ctx.strokeStyle = '#d9921a';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx, pY, pR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = isLight ? 'rgba(8, 35, 87, 0.28)' : 'rgba(253, 224, 71, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, pY, pR + 11, 0, Math.PI * 2);
      ctx.stroke();

      // Presidential Name Ribbon directly beneath portrait if set
      let nextY = pY + pR + (isStory ? 46 : 36);
      if (d.presidentTitle?.trim()) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLight ? '#b47514' : '#fde68a';
        fitText(ctx, d.presidentTitle.trim(), cx, nextY, W - 180, isStory ? 28 : 24, 16, '900');
        nextY += isStory ? 80 : 66;
      } else {
        nextY += 20;
      }

      // Main Celebration Headlines beneath portrait
      const hl2Y = nextY + (isStory ? 76 : 64);
      const sub2Y = hl2Y + (isStory ? 66 : 56);
      renderStandardHeadlines(nextY, hl2Y, sub2Y, 2);

      // Sleek 3-Column Date | Time | Venue Cards (matching event_poster.jpg white-and-gold style!)
      const rows = parsePairedLines(d.extraLines).slice(0, 3);
      const stripW = W - 130;
      const cGap = 20;
      const cW = (stripW - cGap * 2) / 3;
      const cH = isStory ? 210 : 176;
      const cY = Math.min(contentBottomY - cH - 12, sub2Y + (isStory ? 115 : 94));
      const startX = (W - stripW) / 2;

      rows.forEach((it, idx) => {
        const x = startX + (2 - idx) * (cW + cGap);
        fillThemedCard(x, cY, cW, cH, 24);

        const icX = x + cW / 2;
        const icY = cY + 42;
        ctx.save();
        ctx.fillStyle = '#082357';
        ctx.strokeStyle = '#d9921a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(icX, icY, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        drawVectorEventIcon(ctx, idx, icX, icY, '#fde047', '#082357');

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLight ? '#b47514' : '#fde68a';
        fitText(ctx, it.a, icX, cY + 96, cW - 22, 22, 15, '900');

        ctx.fillStyle = isLight ? '#082357' : '#ffffff';
        ctx.font = '800 21px "Tajawal", "Alexandria", sans-serif';
        const valLines = wrapLines(ctx, it.b, cW - 24, 2);
        let ly = valLines.length > 1 ? cY + 128 : cY + 138;
        valLines.forEach((ln) => {
          fitText(ctx, ln, icX, ly, cW - 20, 21, 14, '800', '"Tajawal", sans-serif');
          ly += 26;
        });
        ctx.restore();
      });
      ctx.restore();
    } else {
      // Classic Full-Width Date/Time/Venue Horizontal Cards (when Portrait Frame is OFF or Square 1:1)
      renderStandardHeadlines(headY + 8, hlY + 18, subY + 26, 3);
      const rows = parsePairedLines(d.extraLines).slice(0, 3);
      const cardW = W - 160;
      const cardH = Math.min(isStory ? 132 : 104, (contentH - 68) / 3);
      const gap = 18;
      const totalH = rows.length * cardH + (rows.length - 1) * gap;
      const startY = contentTopY + (contentH - totalH) / 2 + 8;

      rows.forEach((it, idx) => {
        const y = startY + idx * (cardH + gap);
        const x = (W - cardW) / 2;
        fillThemedCard(x, y, cardW, cardH, 24);

        const icX = x + cardW - 56;
        const icY = y + cardH / 2;
        ctx.save();
        ctx.fillStyle = '#082357';
        ctx.strokeStyle = '#d9921a';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(icX, icY, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        drawVectorEventIcon(ctx, idx, icX, icY, '#fde047', '#082357');

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isLight ? '#b47514' : '#fde68a';
        fitText(ctx, it.a, icX - 46, y + cardH * 0.34, cardW - 160, 21, 15, '800');
        ctx.fillStyle = isLight ? '#082357' : '#ffffff';
        fitText(ctx, it.b, icX - 46, y + cardH * 0.69, cardW - 160, 29, 18, '900', '"Tajawal", "Alexandria", sans-serif');
        ctx.restore();
      });
    }
  } else if (templateId === 'vip-dignitaries') {
    renderStandardHeadlines(headY - 10, hlY - 6, subY + 2, 2);

    const vips = parsePairedLines(d.extraLines).slice(0, 6);
    const count = Math.max(1, vips.length);
    const gap = isSquare ? 12 : 15;
    const cardW = W - 144;
    const cardH = Math.min(isStory ? 138 : 100, (contentH - gap * (count - 1) - 16) / count);
    const totalH = count * cardH + (count - 1) * gap;
    const startY = contentTopY + (contentH - totalH) / 2 - 4;

    vips.forEach((v, idx) => {
      const y = startY + idx * (cardH + gap);
      const x = (W - cardW) / 2;

      ctx.save();
      ctx.shadowColor = 'rgba(8, 35, 87, 0.12)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 5;

      const cg = ctx.createLinearGradient(x, y, x + cardW, y);
      cg.addColorStop(0, '#071d49');
      cg.addColorStop(0.55, '#0e3274');
      cg.addColorStop(1, '#071d49');
      ctx.fillStyle = cg;
      ctx.strokeStyle = '#d9921a';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 22);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(x + cardW - 14, y + 14, 7, cardH - 28, 4);
      ctx.fill();

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde68a';
      fitText(ctx, v.a, x + cardW - 34, y + cardH * 0.34, cardW - 70, isSquare ? 19 : 21, 14, '800');
      ctx.fillStyle = '#ffffff';
      fitText(ctx, v.b || v.a, x + cardW - 34, y + cardH * 0.69, cardW - 70, isSquare ? 26 : 29, 18, '900');
      ctx.restore();
    });
  } else if (templateId === 'vip-speaker-spotlight') {
    const ringR = isStory ? 185 : isSquare ? 124 : 150;
    const ringY = eyebrowY + ringR + (isStory ? 80 : 48);

    ctx.save();
    const aura = ctx.createRadialGradient(cx, ringY, ringR * 0.7, cx, ringY, ringR * 1.38);
    aura.addColorStop(0, isLight ? 'rgba(217, 146, 26, 0.25)' : 'rgba(251, 191, 36, 0.36)');
    aura.addColorStop(1, 'rgba(251, 191, 36, 0)');
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
      pbg.addColorStop(0, '#123a82');
      pbg.addColorStop(1, '#041230');
      ctx.fillStyle = pbg;
      ctx.fillRect(cx - ringR, ringY - ringR, ringR * 2, ringR * 2);

      ctx.fillStyle = 'rgba(253, 224, 71, 0.94)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(ringR * 0.54)}px "Alexandria", sans-serif`;
      ctx.fillText('★', cx, ringY - 12);
      ctx.font = `800 ${Math.round(ringR * 0.14)}px "Alexandria", sans-serif`;
      ctx.fillStyle = '#fde68a';
      ctx.fillText('ارفع الصورة هنا', cx, ringY + ringR * 0.44);
    }
    ctx.restore();

    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = isLight ? 'rgba(8, 35, 87, 0.26)' : 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR + 13, 0, Math.PI * 2);
    ctx.stroke();

    const nameY = ringY + ringR + (isStory ? 80 : 58);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    fitText(ctx, d.headline || '', cx, nameY, W - 140, isSquare ? 44 : 52, 28, '900');

    const roleY = nameY + (isStory ? 62 : 52);
    ctx.fillStyle = isLight ? '#c2590a' : '#fde047';
    fitText(ctx, d.highlight || '', cx, roleY, W - 160, isSquare ? 24 : 28, 17, '800');

    drawGoldRule(ctx, cx, roleY + 46, 220, 0.78);

    if (d.subtitle?.trim()) {
      const qW = W - 160;
      const qY = roleY + 72;
      const qH = Math.min(isStory ? 225 : 158, contentBottomY - qY - 14);
      if (qH > 70) {
        fillThemedCard(cx - qW / 2, qY, qW, qH, 26);

        ctx.font = `700 ${isSquare ? 23 : 26}px "Tajawal", "Alexandria", sans-serif`;
        ctx.fillStyle = isLight ? '#0f172a' : '#f1f5f9';
        const qLines = wrapLines(ctx, d.subtitle, qW - 70, 3);
        const lh = isSquare ? 34 : 39;
        let ly = qY + qH / 2 - ((qLines.length - 1) * lh) / 2;
        qLines.forEach((ln) => {
          fitText(ctx, ln, cx, ly, qW - 60, isSquare ? 23 : 26, 17, '700', '"Tajawal", sans-serif');
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
    const galH = Math.min(isStory ? 600 : 405, contentH - pillRowH - 36);
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
        ctx.fillStyle = '#0c2d6b';
        ctx.fillRect(x, y, w, h);
      }
      ctx.restore();
      ctx.strokeStyle = '#d9921a';
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
        ctx.fillStyle = isLight ? '#082357' : 'rgba(7, 27, 64, 0.88)';
        ctx.strokeStyle = '#d9921a';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(px, py - 24, pw, 48, 24);
        ctx.fill();
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fde68a';
        fitText(ctx, tr, px + pw / 2, py + 1, pw - 20, 19, 13, '800');
        ctx.restore();
      });
    }
  } else if (templateId === 'agenda-highlights') {
    renderStandardHeadlines(headY - 10, hlY - 6, subY + 2, 2);

    const steps = parsePairedLines(d.extraLines).slice(0, 4);
    const cardW = W - 148;
    const gap = isSquare ? 15 : 20;
    const cardH = Math.min(isStory ? 176 : 122, (contentH - gap * (steps.length - 1) - 16) / Math.max(1, steps.length));
    const totalH = steps.length * cardH + (steps.length - 1) * gap;
    const startY = contentTopY + (contentH - totalH) / 2;
    const startX = (W - cardW) / 2;

    const spineX = startX + cardW - 62;
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(spineX, startY + 28);
    ctx.lineTo(spineX, startY + totalH - 28);
    ctx.stroke();

    steps.forEach((st, idx) => {
      const y = startY + idx * (cardH + gap);
      const boxW = cardW - 122;
      const boxX = startX;

      ctx.save();
      ctx.fillStyle = '#082357';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(spineX, y + cardH / 2, 29, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde047';
      ctx.font = '900 24px "Alexandria", sans-serif';
      ctx.fillText(String(idx + 1), spineX, y + cardH / 2 + 2);

      fillThemedCard(boxX, y, boxW, cardH, 22);

      ctx.textAlign = 'right';
      ctx.fillStyle = isLight ? '#b47514' : '#fde68a';
      fitText(ctx, st.a, boxX + boxW - 24, y + cardH * 0.30, boxW - 48, 20, 14, '900');

      ctx.font = `800 ${isSquare ? 20 : 22}px "Tajawal", "Alexandria", sans-serif`;
      ctx.fillStyle = isLight ? '#082357' : '#ffffff';
      const lines = wrapLines(ctx, st.b, boxW - 48, 2);
      let ly = lines.length > 1 ? y + cardH * 0.58 : y + cardH * 0.68;
      lines.forEach((ln) => {
        fitText(ctx, ln, boxX + boxW - 24, ly, boxW - 48, isSquare ? 20 : 22, 15, '800', '"Tajawal", sans-serif');
        ly += 28;
      });
      ctx.restore();
    });
  } else if (templateId === 'mentors-tribute') {
    renderStandardHeadlines(headY, hlY, subY, 3);

    const stats = parsePairedLines(d.extraLines).slice(0, 3);
    const statRowH = 128;
    const pW = W - 160;
    const pH = Math.min(isStory ? 460 : 306, contentH - statRowH - 42);
    const pX = (W - pW) / 2;
    const pY = contentTopY + 10;

    if (photos[0]?.width && pH > 120) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pX, pY, pW, pH, 30);
      ctx.clip();
      drawImageCover(ctx, photos[0], pX, pY, pW, pH, 0.35);
      ctx.restore();
      ctx.strokeStyle = '#d9921a';
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
      cg.addColorStop(0, '#071d49');
      cg.addColorStop(1, '#0e3274');
      ctx.fillStyle = cg;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.roundRect(sx, sY, sW, statRowH, 24);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde047';
      fitText(ctx, st.a, sx + sW / 2, sY + 46, sW - 24, 46, 28, '900');
      ctx.fillStyle = '#f8fafc';
      fitText(ctx, st.b, sx + sW / 2, sY + 95, sW - 24, 21, 14, '800', '"Tajawal", sans-serif');
      ctx.restore();
    });
  } else if (templateId === 'grad-frame-cta') {
    renderStandardHeadlines(headY, hlY, subY, 2);

    const boxW = W - 150;
    const boxX = (W - boxW) / 2;
    const boxY = contentTopY + 12;
    const boxH = Math.min(isStory ? 600 : 445, contentH - 28);

    const photoSize = isStory ? 395 : Math.min(378, boxH - 30);
    const photoX = isStory ? cx - photoSize / 2 : boxX + boxW - photoSize - 10;
    const photoY = isStory ? boxY : boxY + (boxH - photoSize) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(8, 35, 87, 0.18)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ffffff';
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

    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 26);
    ctx.stroke();

    ctx.fillStyle = '#082357';
    ctx.beginPath();
    ctx.roundRect(photoX + 24, photoY + photoSize - 56, photoSize - 48, 44, 22);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, '🎓 خريج 1001 طفل رقمي 🌟', photoX + photoSize / 2, photoY + photoSize - 33, photoSize - 64, 20, 14, '900');

    const qrCardW = isStory ? boxW - 120 : boxW - photoSize - 48;
    const qrCardH = isStory ? 186 : Math.min(330, photoSize);
    const qrCardX = isStory ? cx - qrCardW / 2 : boxX;
    const qrCardY = isStory ? photoY + photoSize + 40 : boxY + (boxH - qrCardH) / 2;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(qrCardX, qrCardY, qrCardW, qrCardH, 28);
    ctx.fill();
    ctx.stroke();

    if (qrImg?.width) {
      const qs = isStory ? 132 : Math.min(194, qrCardW - 60);
      const qx = isStory ? qrCardX + 28 : qrCardX + (qrCardW - qs) / 2;
      const qy = isStory ? qrCardY + (qrCardH - qs) / 2 : qrCardY + 24;
      ctx.drawImage(qrImg, qx, qy, qs, qs);

      ctx.fillStyle = '#082357';
      if (isStory) {
        ctx.textAlign = 'right';
        fitText(ctx, tpl.qrLabel || 'امسح الكود', qrCardX + qrCardW - 28, qrCardY + qrCardH * 0.38, qrCardW - qs - 76, 26, 17, '900');
        ctx.fillStyle = '#0284c7';
        fitText(ctx, 'abdaa.masdar.company/frame', qrCardX + qrCardW - 28, qrCardY + qrCardH * 0.68, qrCardW - qs - 76, 21, 14, '800');
      } else {
        ctx.textAlign = 'center';
        fitText(ctx, tpl.qrLabel || 'امسح الكود', qrCardX + qrCardW / 2, qy + qs + 34, qrCardW - 30, 21, 15, '900');
        ctx.fillStyle = '#0284c7';
        fitText(ctx, 'abdaa.masdar.company/frame', qrCardX + qrCardW / 2, qy + qs + 68, qrCardW - 30, 17, 12, '800');
      }
    }
    ctx.restore();
  } else if (templateId === 'booking-batch2') {
    renderStandardHeadlines(headY, hlY, subY, 2);

    const cards = parsePairedLines(d.extraLines).slice(0, 2);
    const boxW = W - 150;
    const boxX = (W - boxW) / 2;
    const qrBoxH = isStory ? 224 : 188;
    const cardsAreaH = contentH - qrBoxH - 32;
    const cGap = 18;
    const cH = Math.min(144, (cardsAreaH - cGap) / 2);
    let cursorY = contentTopY + 8;

    cards.forEach((c, idx) => {
      fillThemedCard(boxX, cursorY, boxW, cH, 26, idx === 0 ? '#d9921a' : '#0284c7');
      ctx.save();
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? (idx === 0 ? '#b45309' : '#0369a1') : idx === 0 ? '#fde047' : '#7dd3fc';
      fitText(ctx, `${idx === 0 ? '🎟️' : '🚀'}  ${c.a}`, boxX + boxW - 32, cursorY + cH * 0.34, boxW - 64, 27, 18, '900');
      ctx.fillStyle = isLight ? '#082357' : '#f8fafc';
      fitText(ctx, c.b, boxX + boxW - 32, cursorY + cH * 0.70, boxW - 64, 22, 15, '700', '"Tajawal", sans-serif');
      ctx.restore();
      cursorY += cH + cGap;
    });

    const qy = cursorY + 6;
    ctx.save();
    ctx.fillStyle = '#082357';
    ctx.strokeStyle = '#d9921a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(boxX, qy, boxW, qrBoxH, 28);
    ctx.fill();
    ctx.stroke();

    const qs = qrBoxH - 36;
    if (qrImg?.width) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(boxX + 20, qy + 14, qs + 8, qs + 8, 16);
      ctx.fill();
      ctx.drawImage(qrImg, boxX + 24, qy + 18, qs, qs);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, tpl.qrLabel || 'امسح الكود للحجز الفوري', boxX + boxW - 32, qy + qrBoxH * 0.30, boxW - qs - 76, 30, 19, '900');
    ctx.fillStyle = '#ffffff';
    fitText(ctx, 'abdaa.masdar.company', boxX + boxW - 32, qy + qrBoxH * 0.60, boxW - qs - 76, 28, 18, '900');
    ctx.fillStyle = '#bae6fd';
    fitText(ctx, 'حجز فوري ومجاني • استلم تذكرتك خلال ثوانٍ', boxX + boxW - 32, qy + qrBoxH * 0.83, boxW - qs - 76, 19, 13, '700', '"Tajawal", sans-serif');
    ctx.restore();
  } else if (templateId === 'countdown-arrival') {
    const medR = isStory ? 170 : isSquare ? 108 : 134;
    const medY = eyebrowY + medR + (isStory ? 76 : 44);

    ctx.save();
    const aura = ctx.createRadialGradient(cx, medY, medR * 0.4, cx, medY, medR * 1.55);
    aura.addColorStop(0, isLight ? 'rgba(217, 146, 26, 0.25)' : 'rgba(251, 191, 36, 0.42)');
    aura.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, medY, medR * 1.55, 0, Math.PI * 2);
    ctx.fill();

    const mg = ctx.createLinearGradient(cx - medR, medY - medR, cx + medR, medY + medR);
    mg.addColorStop(0, '#071b40');
    mg.addColorStop(0.5, '#0f367a');
    mg.addColorStop(1, '#04112b');
    ctx.fillStyle = mg;
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, medY, medR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, medY, medR - 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const numStr = String(d.countdownNumber || '3');
    ctx.fillStyle = '#fde047';
    fitText(ctx, numStr, cx, medY - 14, medR * 1.5, numStr.length <= 2 ? 102 : 64, 38, '900');
    ctx.fillStyle = '#ffffff';
    fitText(ctx, d.countdownUnit || 'أيام متبقية', cx, medY + medR * 0.44, medR * 1.55, 24, 15, '800');

    const titleY = medY + medR + (isStory ? 80 : 54);
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    fitText(ctx, d.headline || '', cx, titleY, W - 140, isSquare ? 48 : 56, 30, '900');

    const subHlY = titleY + (isStory ? 64 : 52);
    ctx.fillStyle = isLight ? '#c2590a' : '#fde68a';
    fitText(ctx, d.highlight || '', cx, subHlY, W - 160, isSquare ? 26 : 30, 18, '800');

    const items = parsePairedLines(d.extraLines).slice(0, 3);
    if (items.length) {
      const stripW = W - 140;
      const sGap = 20;
      const sW = (stripW - sGap * (items.length - 1)) / items.length;
      const sH = isStory ? 156 : 124;
      const sY = Math.min(contentBottomY - sH - 18, subHlY + (isStory ? 92 : 50));
      const startX = (W - stripW) / 2;

      items.forEach((it, idx) => {
        const sx = startX + (items.length - 1 - idx) * (sW + sGap);
        fillThemedCard(sx, sY, sW, sH, 22);
        ctx.fillStyle = isLight ? '#b47514' : '#fde68a';
        fitText(ctx, it.a, sx + sW / 2, sY + sH * 0.34, sW - 24, 21, 14, '800');
        ctx.fillStyle = isLight ? '#082357' : '#ffffff';
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
