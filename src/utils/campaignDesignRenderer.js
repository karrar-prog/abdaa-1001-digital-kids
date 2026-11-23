// محرك تصميم وتصدير قوالب الحملة الإعلانية لإنستغرام وفيسبوك (12 قالباً موزعة على 4 مراحل)
// يدعم مقاسات: بوست إنستغرام/فيسبوك (1080×1350)، ستوري/ريلز (1080×1920)، مربع (1080×1080)، غلاف فيسبوك (1640×624)
// يجمع بين خلفيات فنية فاخرة + خطوط عربية حادة + شعارات رسمية حقيقية + صور واقعية من مختبرات أبدع

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

export const CAMPAIGN_PHASES = [
  { id: 'phase1', badge: 'المرحلة 1 • للنشر اليوم', title: 'التأسيس والتشويق وبناء الهوية', color: 'sky' },
  { id: 'phase2', badge: 'المرحلة 2 • غداً', title: 'الإعلان الرسمي والبروتوكول والشخصيات الرفيعة', color: 'amber' },
  { id: 'phase3', badge: 'المرحلة 3 • قبل الحفل', title: 'أبطال المبادرة ومعرض الابتكارات والتفاعل', color: 'emerald' },
  { id: 'phase4', badge: 'المرحلة 4 • الحسم واليوم الموعود', title: 'حجز المقاعد والعدّ التنازلي ودليل الوصول', color: 'indigo' }
];

export const VIP_SPEAKER_PRESETS = [
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
    shortDesc: 'الهوية البصرية الرسمية الموحدة لافتتاح صفحتي فيسبوك وإنستغرام',
    bgAsset: '/campaign/bg-royal-gala.jpg',
    tone: 'dark',
    defaults: {
      eyebrow: 'برعاية فخامة رئيس الجمهورية',
      headline: 'حفل تخرج الدفعة الأولى',
      highlight: 'مبادرة «1001 طفل رقمي»',
      subtitle: 'ملتقى النجف للابتكار الرقمي • نصنع جيلاً يبرمج المستقبل',
      footerNote: 'الجمعة 27 تشرين الثاني 2026  •  قصر الثقافة – النجف الأشرف',
      extraLines: ''
    },
    caption:
      '🌟 أهلاً بكم في الصفحة الرسمية لحفل تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي.\n\nبرعاية فخامة رئيس الجمهورية، وتنظيم نادي أبدع للمهارات الذكية في النجف الأشرف، نحتفي بتخرج 172 طفلاً رقمياً ومعرض لـ 40 ابتكاراً حياً بأيدي أطفالنا.\n\n📅 الجمعة 27 تشرين الثاني 2026 | 🕒 3:00 عصراً\n📍 قصر الثقافة – النجف الأشرف\n🌐 المنصة الرسمية: https://abdaa.masdar.company\n\n#1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف #الابتكار_الرقمي #نصنع_جيلاً_يبرمج_المستقبل'
  },
  {
    id: 'teaser-launch',
    order: 2,
    phase: 'phase1',
    defaultFormat: 'post',
    name: 'بوست التشويق الأول (قريباً...)',
    shortDesc: 'منشور تشويقي سينمائي يجذب الانتباه لبدء الحملة اليوم',
    bgAsset: '/campaign/bg-future-kids.jpg',
    photoAsset: '/gallery/training_1.jpg',
    tone: 'dark',
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
    shortDesc: 'إنفوغرافيك يروي قصة أبطال العرب ومسيرة 896 ← 700 ← 172 خريجاً',
    bgAsset: '/campaign/bg-future-kids.jpg',
    tone: 'dark',
    defaults: {
      eyebrow: 'المركز الأول عربياً لـ 3 سنوات متتالية (2024 – 2026) 🏆',
      headline: 'من شغف طفلين موهوبين...',
      highlight: 'إلى حراك رقمي يحتضن 1001 طفل',
      subtitle: 'مبادرة مجانية بالكامل في النجف الأشرف صنعت أرقاماً نعتز بها جميعاً:',
      footerNote: 'نادي أبدع للمهارات الذكية • النجف الأشرف',
      extraLines: '896|طفلاً التحقوا بالمبادرة\n700|أتمّوا متطلبات التدريب\n172|خريجاً في الدفعة الأولى\n40|ابتكاراً ومشروعاً حياً'
    },
    caption:
      '🏆 بدأت القصة من شغف طفلين موهوبين رفعا اسم العراق بالمركز الأول عربياً لثلاث سنوات متتالية في البطولة العربية للروبوت والذكاء الاصطناعي (2024–2026)...\n\nواليوم تحوّل الحلم إلى حراك تعليمي ومجتمعي مجاني بالكامل:\n🔹 896 طفلاً التحقوا بمبادرة «1001 طفل رقمي» (6–14 سنة)\n🔹 700 طفل أتمّوا متطلبات التدريب الأساسي\n🔹 172 طفلاً رقمياً نحتفي بتخرجهم في الدفعة الأولى\n🔹 40 مشروعاً وابتكاراً حياً يقدّمها الأطفال بأنفسهم في المعرض\n\nفخورون بكل بطل وبطلة! 💙✨\n🌐 https://abdaa.masdar.company\n\n#قصة_نجاح #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف #الروبوت_والذكاء_الاصطناعي'
  },

  // ================= المرحلة 2: الإعلان الرسمي والشخصيات الرفيعة =================
  {
    id: 'official-hero',
    order: 4,
    phase: 'phase2',
    defaultFormat: 'post',
    name: 'البوستر الرسمي الرئيسي للحفل',
    shortDesc: 'الإعلان البروتوكولي الكبير برعاية فخامة رئيس الجمهورية والموعد والمكان',
    bgAsset: '/campaign/bg-royal-gala.jpg',
    tone: 'dark',
    defaults: {
      eyebrow: 'برعاية فخامة رئيس الجمهورية',
      headline: 'حفل تخرج الدفعة الأولى',
      highlight: 'من مبادرة «1001 طفل رقمي»',
      subtitle: 'ملتقى النجف للابتكار الرقمي • تتويج 172 بطلاً رقمياً وافتتاح معرض الـ 40 ابتكاراً بأيدي الأطفال',
      footerNote: 'الحجز المجاني والمنصة الرسمية:  abdaa.masdar.company',
      extraLines: 'الجمعة|27 تشرين الثاني 2026\nالساعة|3:00 عصراً (الوصول 2:00)\nالمكان|قصر الثقافة – النجف الأشرف'
    },
    caption:
      '👑 برعاية فخامة رئيس الجمهورية 🇮🇶\n\nيتشرف نادي أبدع للمهارات الذكية بالإعلان الرسمي عن:\n🎓 حفل تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي\n\nنحتفي بتتويج 172 طفلاً رقمياً، وافتتاح المعرض العلمي الحي لـ 40 مشروعاً برمجياً وروبوتياً بأيدي أطفالنا الأبطال.\n\n📅 الجمعة، 27 تشرين الثاني 2026\n🕒 الساعة 3:00 عصراً (فتح الأبواب 2:00 ظهراً)\n📍 قصر الثقافة – النجف الأشرف\n🎟️ الحجز المجاني عبر المنصة: https://abdaa.masdar.company\n\n#برعاية_رئيس_الجمهورية #1001_طفل_رقمي #ملتقى_النجف_للابتكار_الرقمي #نادي_أبدع #النجف_الأشرف'
  },
  {
    id: 'vip-dignitaries',
    order: 5,
    phase: 'phase2',
    defaultFormat: 'post',
    name: 'كوكبة الحضور والشخصيات الرسمية',
    shortDesc: 'تصميم بروتوكولي فاخر يبرز الشخصيات الوطنية والرسمية المشاركة في الحفل',
    bgAsset: '/campaign/bg-pearl-honor.jpg',
    tone: 'light',
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
    name: 'بطاقة شخصية / متحدث رسمي (فردية)',
    shortDesc: 'قالب مخصص لكل ضيف شرف أو متحدث — اختر من القائمة أو ارفع صورته',
    bgAsset: '/campaign/bg-royal-gala.jpg',
    tone: 'dark',
    supportsPortrait: true,
    defaults: {
      eyebrow: 'ممثل فخامة رئيس جمهورية العراق',
      headline: 'الدكتور نزار محمد سعيد',
      highlight: 'ممثل رئاسة جمهورية العراق — كلمة فخامة رئيس الجمهورية',
      subtitle: '«دعم جيل الابتكار والبرمجة هو الاستثمار الأسمى في مستقبل العراق ونهضته العلمية.»',
      footerNote: 'حفل تخرج مبادرة «1001 طفل رقمي» • الجمعة 27 تشرين الثاني 2026',
      extraLines: ''
    },
    caption:
      '✨ نعتز بحضور وتشريف شخصياتنا الكريمة في حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي.\n\nتشريفكم ومشاركتكم أطفالنا فرحة التتويج يمثلان دعماً حقيقياً لمسيرة الإبداع وصناعة المستقبل.\n\n📅 الجمعة 27 تشرين الثاني 2026 | 🕒 3:00 عصراً\n📍 قصر الثقافة – النجف الأشرف\n🌐 https://abdaa.masdar.company\n\n#ضيوف_الشرف #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف'
  },

  // ================= المرحلة 3: الأبطال، المعرض، والتفاعل =================
  {
    id: 'projects-expo',
    order: 7,
    phase: 'phase3',
    defaultFormat: 'post',
    name: 'معرض الابتكارات الحية (40 مشروعاً)',
    shortDesc: 'استعراض معرض مشاريع الأطفال الحية مع صور حقيقية من مختبرات أبدع',
    bgAsset: '/campaign/bg-future-kids.jpg',
    photoAssets: ['/gallery/training_1.jpg', '/gallery/training_4.jpg', '/gallery/training_6.jpg'],
    tone: 'dark',
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
    name: 'المنهاج الرسمي وأبرز فقرات الحفل',
    shortDesc: 'ملخص أنيق لفترات الحفل الأربع من الافتتاح حتى تتويج الأبطال والمعرض',
    bgAsset: '/campaign/bg-pearl-honor.jpg',
    tone: 'light',
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
    name: 'تحية الوفاء للمدربين المتطوعين',
    shortDesc: 'بطاقة امتنان وإجلال لـ 26 مؤسساً وشريكاً ومدرباً متطوعاً صنعوا هذا الأثر',
    bgAsset: '/campaign/bg-royal-gala.jpg',
    photoAsset: '/gallery/training_5.jpg',
    tone: 'dark',
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
    name: 'حملة الأهالي: إطار التخرج التذكاري',
    shortDesc: 'بوست تفاعلي يدعو الأهالي لصنع صورة طفلهم في /frame ونشرها لرفع التفاعل',
    bgAsset: '/campaign/bg-celebration-joy.jpg',
    photoAsset: '/gallery/training_2.jpg',
    tone: 'dark',
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
    name: 'حجز المقاعد المجاني + الدفعة الثانية',
    shortDesc: 'دعوة مفتوحة لحجز تذكرة الحضور المجانية والتسجيل المبكر للدفعة الثانية',
    bgAsset: '/campaign/bg-celebration-joy.jpg',
    tone: 'dark',
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
    name: 'العدّ التنازلي + دليل يوم الحفل',
    shortDesc: 'قالب عدّ تنازلي مرن (3 أيام / يومان / غداً / اليوم) مع إرشادات الحضور',
    bgAsset: '/campaign/bg-royal-gala.jpg',
    tone: 'dark',
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
  g.addColorStop(0, 'rgba(251, 191, 36, 0)');
  g.addColorStop(0.25, `rgba(253, 224, 71, ${alpha})`);
  g.addColorStop(0.5, `rgba(245, 158, 11, ${alpha})`);
  g.addColorStop(0.75, `rgba(253, 224, 71, ${alpha})`);
  g.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.strokeStyle = g;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
}

function drawRoyalBorderFrame(ctx, W, H, isLight = false) {
  const pad = Math.round(Math.min(W, H) * 0.026);
  const r = Math.round(Math.min(W, H) * 0.032);
  const g = ctx.createLinearGradient(pad, pad, W - pad, H - pad);
  g.addColorStop(0, isLight ? '#d9921a' : '#f59e0b');
  g.addColorStop(0.3, '#fef08a');
  g.addColorStop(0.55, '#c4881e');
  g.addColorStop(0.8, '#fde68a');
  g.addColorStop(1, '#b45309');

  ctx.save();
  ctx.strokeStyle = g;
  ctx.lineWidth = Math.max(4, Math.round(Math.min(W, H) * 0.0055));
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, r);
  ctx.stroke();

  ctx.strokeStyle = isLight ? 'rgba(180, 117, 20, 0.25)' : 'rgba(254, 240, 138, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pad + 10, pad + 10, W - (pad + 10) * 2, H - (pad + 10) * 2, Math.max(10, r - 6));
  ctx.stroke();
  ctx.restore();
}

function drawTopBrandHeader(ctx, W, y, logoAbdaa, logo1001, isLight = false, scale = 1) {
  const cx = W / 2;
  const h = Math.round(76 * scale);

  // Gold center vertical divider
  const dg = ctx.createLinearGradient(cx, y - h * 0.52, cx, y + h * 0.52);
  dg.addColorStop(0, 'rgba(217, 146, 26, 0.15)');
  dg.addColorStop(0.5, '#eab308');
  dg.addColorStop(1, 'rgba(217, 146, 26, 0.15)');
  ctx.strokeStyle = dg;
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, y - h * 0.48);
  ctx.lineTo(cx, y + h * 0.48);
  ctx.stroke();

  // Right side: Abdaa title + icon
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

  // Left side: 1001 logo + "طفل رقمي / 1001 DIGITAL KIDS"
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
  const tw = Math.min(ctx.measureText(text.trim()).width, maxW - 60);
  const pw = Math.min(maxW, tw + 68);
  const ph = 46;

  if (isLight) {
    const g = ctx.createLinearGradient(cx - pw / 2, y, cx + pw / 2, y);
    g.addColorStop(0, '#051638');
    g.addColorStop(0.5, '#0d3170');
    g.addColorStop(1, '#051638');
    ctx.fillStyle = g;
    ctx.strokeStyle = '#d9921a';
  } else {
    ctx.fillStyle = 'rgba(7, 27, 64, 0.72)';
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
  }
  ctx.lineWidth = 2.2;
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

function drawFooterStrip(ctx, W, H, footerText, isLight, showMasdarSubtle, logoMasdar) {
  const barH = 74;
  const barY = H - barH - Math.round(Math.min(W, H) * 0.026);
  const padX = Math.round(Math.min(W, H) * 0.048);

  ctx.save();
  drawGoldRule(ctx, W / 2, barY, W * 0.41, isLight ? 0.65 : 0.75);

  const centerY = barY + barH * 0.52;

  if (showMasdarSubtle && logoMasdar?.width) {
    // Subtle left-aligned partner credit so event remains the hero
    const mH = 26;
    const mW = Math.min((logoMasdar.width / logoMasdar.height) * mH, 90);
    ctx.globalAlpha = 0.88;
    ctx.drawImage(logoMasdar, padX + 12, centerY - mH / 2, mW, mH);
    ctx.globalAlpha = 1;

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#0f2956' : '#e2e8f0';
    fitText(ctx, footerText || '', W - padX - 12, centerY, W - padX * 2 - mW - 44, 21, 13, '800', '"Tajawal", "Alexandria", sans-serif');
  } else {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#0f2956' : '#f1f5f9';
    fitText(ctx, footerText || '', W / 2, centerY, W - padX * 2 - 20, 22, 14, '800', '"Tajawal", "Alexandria", sans-serif');
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
  const isLight = tpl.tone === 'light';
  const showPatronage = options.showPatronage !== false;
  const showMasdarSubtle = Boolean(options.showMasdarSubtle);
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

  const [bgImg, logoAbdaa, logo1001, logoMasdar, qrImg, ...photos] = await Promise.all([
    loadImg(tpl.bgAsset),
    loadImg('/brand/abdaa-logo.png'),
    loadImg('/brand/logo-1001-kids.png'),
    showMasdarSubtle ? loadImg(isLight ? '/brand/masdar-logo-full-clean.png' : '/brand/masdar-logo-full-white.png') : Promise.resolve(null),
    qrPromise,
    ...photoUrls.map((u) => loadImg(u))
  ]);

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Background Artwork Layer + Readability Vignette
  if (bgImg?.width) {
    drawImageCover(ctx, bgImg, 0, 0, W, H, 0.5);
    // Soft protective readability overlay so text always pops crisply
    const vig = ctx.createLinearGradient(0, 0, 0, H);
    if (isLight) {
      vig.addColorStop(0, 'rgba(255, 255, 255, 0.30)');
      vig.addColorStop(0.5, 'rgba(255, 255, 255, 0.58)');
      vig.addColorStop(1, 'rgba(255, 255, 255, 0.35)');
    } else {
      vig.addColorStop(0, 'rgba(3, 14, 40, 0.56)');
      vig.addColorStop(0.45, 'rgba(4, 18, 48, 0.44)');
      vig.addColorStop(1, 'rgba(2, 11, 31, 0.78)');
    }
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
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

  drawRoyalBorderFrame(ctx, W, H, isLight);

  // ========= SPECIAL WIDE COVER LAYOUT (Facebook Cover 1640×624) =========
  if (formatKey === 'cover') {
    const cx = W / 2;
    drawTopBrandHeader(ctx, W, 112, logoAbdaa, logo1001, isLight, 1.02);

    if (showPatronage && d.eyebrow?.trim()) {
      drawEyebrowPill(ctx, cx, 212, `★  ${d.eyebrow.trim()}  ★`, isLight, 760);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    fitText(ctx, d.headline || '', cx, 304, W - 220, 68, 36, '900');

    const goldText = ctx.createLinearGradient(0, 355, 0, 425);
    goldText.addColorStop(0, '#fef08a');
    goldText.addColorStop(0.5, '#f59e0b');
    goldText.addColorStop(1, '#d97706');
    ctx.fillStyle = isLight ? '#b47514' : goldText;
    fitText(ctx, d.highlight || '', cx, 386, W - 220, 56, 30, '900');

    ctx.fillStyle = isLight ? '#334155' : '#e0f2fe';
    fitText(ctx, d.subtitle || '', cx, 456, W - 260, 28, 18, '700', '"Tajawal", sans-serif');

    drawFooterStrip(ctx, W, H, d.footerNote, isLight, showMasdarSubtle, logoMasdar);
    ctx.restore();
    return;
  }

  // ========= VERTICAL / SQUARE LAYOUTS (1080×1350 Post, 1080×1920 Story, 1080×1080 Square) =========
  const isStory = formatKey === 'story';
  const isSquare = formatKey === 'square';
  const cx = W / 2;

  // Vertical layout rhythm proportional to canvas height
  const headerY = isStory ? 175 : isSquare ? 105 : 122;
  const eyebrowY = isStory ? 290 : isSquare ? 196 : 226;
  const headY = isStory ? 415 : isSquare ? 286 : 332;
  const hlY = isStory ? 506 : isSquare ? 356 : 416;
  const subY = isStory ? 592 : isSquare ? 426 : 494;
  const contentTopY = isStory ? 715 : isSquare ? 495 : 596;
  const contentBottomY = H - (isStory ? 195 : 138);
  const contentH = Math.max(260, contentBottomY - contentTopY);

  // Top Official Dual Logos
  drawTopBrandHeader(ctx, W, headerY, logoAbdaa, logo1001, isLight, isSquare ? 0.92 : 1.04);

  // Eyebrow / Patronage Pill
  const eyebrowText =
    templateId === 'official-hero' || templateId === 'page-identity' || templateId === 'vip-dignitaries'
      ? showPatronage
        ? d.eyebrow
        : 'ملتقى النجف للابتكار الرقمي'
      : d.eyebrow;
  drawEyebrowPill(ctx, cx, eyebrowY, eyebrowText, isLight, 920);

  // Main Headline + Gold Sub-Headline (except VIP Spotlight & Countdown which customize top area)
  const renderStandardHeadlines = (hY = headY, gY = hlY, sY = subY, maxSubLines = 2) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Crisp drop shadow on dark backgrounds
    if (!isLight) {
      ctx.shadowColor = 'rgba(2, 6, 23, 0.55)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
    }
    ctx.fillStyle = isLight ? '#082357' : '#ffffff';
    fitText(ctx, d.headline || '', cx, hY, W - 130, isSquare ? 52 : 60, 32, '900');

    const gg = ctx.createLinearGradient(0, gY - 30, 0, gY + 30);
    gg.addColorStop(0, isLight ? '#a16207' : '#fef08a');
    gg.addColorStop(0.5, isLight ? '#d9921a' : '#f59e0b');
    gg.addColorStop(1, isLight ? '#92400e' : '#eab308');
    ctx.fillStyle = gg;
    fitText(ctx, d.highlight || '', cx, gY, W - 130, isSquare ? 40 : 46, 24, '900');
    ctx.shadowColor = 'transparent';

    if (d.subtitle?.trim()) {
      ctx.font = `700 ${isSquare ? 23 : 26}px "Tajawal", "Alexandria", sans-serif`;
      ctx.fillStyle = isLight ? '#334155' : '#e2e8f0';
      const lines = wrapLines(ctx, d.subtitle, W - 180, maxSubLines);
      let cy = sY;
      lines.forEach((ln) => {
        fitText(ctx, ln, cx, cy, W - 160, isSquare ? 23 : 26, 17, '700', '"Tajawal", sans-serif');
        cy += isSquare ? 34 : 38;
      });
    }
    ctx.restore();
  };

  // ========= PER-TEMPLATE BESPOKE HERO ARTWORK COMPOSITION =========

  if (templateId === 'page-identity') {
    // Profile Avatar (1:1) or Intro Post (4:5 / 9:16)
    renderStandardHeadlines(headY + 25, hlY + 35, subY + 42, 2);
    // Regal centerpiece emblem card
    const boxW = W - 180;
    const boxH = Math.min(260, contentH * 0.62);
    const boxY = contentTopY + (contentH - boxH) / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(5, 22, 56, 0.72)';
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - boxW / 2, boxY, boxW, boxH, 32);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, '172 بطلاً رقمياً  •  40 ابتكاراً حياً', cx, boxY + boxH * 0.36, boxW - 60, 36, 22, '900');
    drawGoldRule(ctx, cx, boxY + boxH * 0.56, boxW * 0.34, 0.8);
    ctx.fillStyle = '#e0f2fe';
    fitText(ctx, 'ملتقى النجف للابتكار الرقمي • 27 تشرين الثاني 2026', cx, boxY + boxH * 0.75, boxW - 60, 26, 17, '800', '"Tajawal", sans-serif');
    ctx.restore();
  } else if (templateId === 'teaser-launch') {
    renderStandardHeadlines(headY, hlY, subY, 3);
    // Cinematic Golden-Framed Real Kids Coding Photo
    const pW = W - 160;
    const pH = Math.min(isStory ? 620 : 480, contentH - 40);
    const pX = (W - pW) / 2;
    const pY = contentTopY + (contentH - pH) / 2 + 12;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;
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
      ov.addColorStop(0.65, 'rgba(4, 18, 48, 0.15)');
      ov.addColorStop(1, 'rgba(4, 18, 48, 0.86)');
      ctx.fillStyle = ov;
      ctx.fillRect(pX, pY, pW, pH);
    }
    ctx.restore();

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 34);
    ctx.stroke();

    // Floating cinematic badge at bottom of photo
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, '★  النجف الأشرف تستعد للعرس الرقمي  ★', cx, pY + pH - 42, pW - 60, 26, 17, '900');
    ctx.restore();
  } else if (templateId === 'story-numbers') {
    renderStandardHeadlines(headY, hlY, subY, 2);
    const items = parsePairedLines(d.extraLines).slice(0, 4);
    const cols = 2;
    const gap = 28;
    const cardW = (W - 150 - gap) / cols;
    const cardH = Math.min(isStory ? 260 : 210, (contentH - gap - 30) / 2);
    const startX = (W - (cardW * cols + gap)) / 2;
    const totalH = cardH * 2 + gap;
    const startY = contentTopY + (contentH - totalH) / 2;

    items.forEach((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      // RTL order: item 0 right, item 1 left
      const x = startX + (1 - col) * (cardW + gap);
      const y = startY + row * (cardH + gap);

      ctx.save();
      const cg = ctx.createLinearGradient(x, y, x, y + cardH);
      cg.addColorStop(0, 'rgba(11, 44, 107, 0.88)');
      cg.addColorStop(1, 'rgba(4, 18, 48, 0.94)');
      ctx.fillStyle = cg;
      ctx.strokeStyle = i === 2 ? '#fde047' : 'rgba(234, 179, 8, 0.72)';
      ctx.lineWidth = i === 2 ? 4 : 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 28);
      ctx.fill();
      ctx.stroke();

      // Glowing golden number
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde047';
      fitText(ctx, it.a, x + cardW / 2, y + cardH * 0.40, cardW - 40, isSquare ? 64 : 74, 42, '900');

      drawGoldRule(ctx, x + cardW / 2, y + cardH * 0.64, cardW * 0.32, 0.65);

      ctx.fillStyle = '#f8fafc';
      fitText(ctx, it.b, x + cardW / 2, y + cardH * 0.80, cardW - 36, isSquare ? 22 : 25, 16, '800', '"Tajawal", sans-serif');
      ctx.restore();
    });
  } else if (templateId === 'official-hero') {
    renderStandardHeadlines(headY + 12, hlY + 22, subY + 32, 3);

    // Three royal golden-rimmed Date / Time / Venue info cards
    const rows = parsePairedLines(d.extraLines).slice(0, 3);
    const cardW = W - 160;
    const cardH = Math.min(isStory ? 132 : 108, (contentH - 80) / 3);
    const gap = 20;
    const totalH = rows.length * cardH + (rows.length - 1) * gap;
    const startY = contentTopY + (contentH - totalH) / 2 + 12;

    rows.forEach((it, idx) => {
      const y = startY + idx * (cardH + gap);
      const x = (W - cardW) / 2;

      ctx.save();
      const bg = ctx.createLinearGradient(x, y, x + cardW, y);
      bg.addColorStop(0, 'rgba(7, 27, 64, 0.88)');
      bg.addColorStop(0.5, 'rgba(13, 47, 107, 0.92)');
      bg.addColorStop(1, 'rgba(7, 27, 64, 0.88)');
      ctx.fillStyle = bg;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 24);
      ctx.fill();
      ctx.stroke();

      // Crisp Vector Metallic-Gold Icon Medallion on Right
      const icX = x + cardW - 56;
      const icY = y + cardH / 2;
      ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(icX, icY, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(icX, icY);
      ctx.strokeStyle = '#fde047';
      ctx.fillStyle = '#fde047';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (idx === 0) {
        // Calendar vector icon
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
        // Clock vector icon
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 1);
        ctx.lineTo(6, 4);
        ctx.stroke();
      } else {
        // Map Pin vector icon
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.bezierCurveTo(-12, 5, -13, -10, 0, -14);
        ctx.bezierCurveTo(13, -10, 12, 5, 0, 15);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#071b40';
        ctx.beginPath();
        ctx.arc(0, -3, 4.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Right-aligned label & value
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fde68a';
      fitText(ctx, it.a, icX - 46, y + cardH * 0.34, cardW - 160, 21, 15, '800');
      ctx.fillStyle = '#ffffff';
      fitText(ctx, it.b, icX - 46, y + cardH * 0.69, cardW - 160, 30, 19, '900', '"Tajawal", "Alexandria", sans-serif');
      ctx.restore();
    });
  } else if (templateId === 'vip-dignitaries') {
    renderStandardHeadlines(headY - 8, hlY - 4, subY + 4, 2);

    const vips = parsePairedLines(d.extraLines).slice(0, 6);
    const count = Math.max(1, vips.length);
    const gap = isSquare ? 12 : 16;
    const cardW = W - 144;
    const cardH = Math.min(isStory ? 142 : 104, (contentH - gap * (count - 1) - 16) / count);
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

      // Gold accent bar on right edge
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(x + cardW - 14, y + 14, 7, cardH - 28, 4);
      ctx.fill();

      // VIP Title (Gold) + Name (Crisp White)
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde68a';
      fitText(ctx, v.a, x + cardW - 34, y + cardH * 0.34, cardW - 70, isSquare ? 19 : 21, 14, '800');
      ctx.fillStyle = '#ffffff';
      fitText(ctx, v.b || v.a, x + cardW - 34, y + cardH * 0.69, cardW - 70, isSquare ? 26 : 30, 18, '900');
      ctx.restore();
    });
  } else if (templateId === 'vip-speaker-spotlight') {
    // Circular Gold-Rimmed Portrait Frame + Prestigious Name Plate + Quote Box
    const ringR = isStory ? 190 : isSquare ? 128 : 155;
    const ringY = eyebrowY + ringR + (isStory ? 85 : 54);

    ctx.save();
    // Outer luminous gold aura
    const aura = ctx.createRadialGradient(cx, ringY, ringR * 0.7, cx, ringY, ringR * 1.38);
    aura.addColorStop(0, 'rgba(251, 191, 36, 0.36)');
    aura.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR * 1.38, 0, Math.PI * 2);
    ctx.fill();

    // Inner portrait circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
    ctx.clip();

    if (photos[0]?.width) {
      drawImageCover(ctx, photos[0], cx - ringR, ringY - ringR, ringR * 2, ringR * 2, 0.25);
    } else {
      const pbg = ctx.createRadialGradient(cx, ringY - 30, 10, cx, ringY, ringR);
      pbg.addColorStop(0, '#123a82');
      pbg.addColorStop(1, '#041230');
      ctx.fillStyle = pbg;
      ctx.fillRect(cx - ringR, ringY - ringR, ringR * 2, ringR * 2);

      // Dignified royal star/crest emblem placeholder when no photo uploaded yet
      ctx.fillStyle = 'rgba(253, 224, 71, 0.92)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(ringR * 0.56)}px "Alexandria", sans-serif`;
      ctx.fillText('★', cx, ringY - 12);
      ctx.font = `800 ${Math.round(ringR * 0.14)}px "Alexandria", sans-serif`;
      ctx.fillStyle = '#fde68a';
      ctx.fillText('ضيف شرف رسمي', cx, ringY + ringR * 0.44);
    }
    ctx.restore();

    // Double Metallic Gold Ring
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR + 14, 0, Math.PI * 2);
    ctx.stroke();

    // Guest Name & Role beneath Portrait
    const nameY = ringY + ringR + (isStory ? 84 : 62);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    fitText(ctx, d.headline || '', cx, nameY, W - 140, isSquare ? 44 : 52, 28, '900');

    const roleY = nameY + (isStory ? 62 : 52);
    ctx.fillStyle = '#fde047';
    fitText(ctx, d.highlight || '', cx, roleY, W - 160, isSquare ? 24 : 28, 17, '800');

    drawGoldRule(ctx, cx, roleY + 46, 220, 0.75);

    // Elegant Quote Card
    if (d.subtitle?.trim()) {
      const qW = W - 160;
      const qY = roleY + 74;
      const qH = Math.min(isStory ? 230 : 162, contentBottomY - qY - 14);
      if (qH > 70) {
        ctx.fillStyle = 'rgba(7, 27, 64, 0.72)';
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - qW / 2, qY, qW, qH, 26);
        ctx.fill();
        ctx.stroke();

        ctx.font = `700 ${isSquare ? 23 : 27}px "Tajawal", "Alexandria", sans-serif`;
        ctx.fillStyle = '#f1f5f9';
        const qLines = wrapLines(ctx, d.subtitle, qW - 70, 3);
        const lh = isSquare ? 34 : 40;
        let ly = qY + qH / 2 - ((qLines.length - 1) * lh) / 2;
        qLines.forEach((ln) => {
          fitText(ctx, ln, cx, ly, qW - 60, isSquare ? 23 : 27, 17, '700', '"Tajawal", sans-serif');
          ly += lh;
        });
      }
    }
    ctx.restore();
  } else if (templateId === 'projects-expo') {
    renderStandardHeadlines(headY, hlY, subY, 2);

    // 3-Photo Bento Gallery of Real Labs + 4 Track Pills
    const trackList = String(d.extraLines || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
    const pillRowH = trackList.length ? 68 : 0;
    const galW = W - 140;
    const galH = Math.min(isStory ? 620 : 420, contentH - pillRowH - 36);
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
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
      ctx.lineWidth = 3;
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

    // Track Pills below photo mosaic
    if (trackList.length) {
      const py = galY + galH + 42;
      const pGap = 14;
      const pw = (galW - pGap * (trackList.length - 1)) / trackList.length;
      trackList.forEach((tr, idx) => {
        const px = galX + (trackList.length - 1 - idx) * (pw + pGap);
        ctx.save();
        ctx.fillStyle = 'rgba(7, 27, 64, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
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
    renderStandardHeadlines(headY - 8, hlY - 4, subY + 4, 2);

    const steps = parsePairedLines(d.extraLines).slice(0, 4);
    const cardW = W - 148;
    const gap = isSquare ? 16 : 22;
    const cardH = Math.min(isStory ? 182 : 126, (contentH - gap * (steps.length - 1) - 20) / Math.max(1, steps.length));
    const totalH = steps.length * cardH + (steps.length - 1) * gap;
    const startY = contentTopY + (contentH - totalH) / 2;
    const startX = (W - cardW) / 2;

    // Vertical golden timeline spine on right
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
      // Step circle badge on spine
      ctx.fillStyle = '#082357';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(spineX, y + cardH / 2, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde047';
      ctx.font = '900 24px "Alexandria", sans-serif';
      ctx.fillText(String(idx + 1), spineX, y + cardH / 2 + 2);

      // Step Card
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#d9921a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(boxX, y, boxW, cardH, 22);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillStyle = '#b47514';
      fitText(ctx, st.a, boxX + boxW - 24, y + cardH * 0.30, boxW - 48, 20, 14, '900');

      ctx.font = `800 ${isSquare ? 20 : 23}px "Tajawal", "Alexandria", sans-serif`;
      ctx.fillStyle = '#0f172a';
      const lines = wrapLines(ctx, st.b, boxW - 48, 2);
      let ly = lines.length > 1 ? y + cardH * 0.58 : y + cardH * 0.68;
      lines.forEach((ln) => {
        fitText(ctx, ln, boxX + boxW - 24, ly, boxW - 48, isSquare ? 20 : 23, 15, '800', '"Tajawal", sans-serif');
        ly += 29;
      });
      ctx.restore();
    });
  } else if (templateId === 'mentors-tribute') {
    renderStandardHeadlines(headY, hlY, subY, 3);

    const stats = parsePairedLines(d.extraLines).slice(0, 3);
    const statRowH = 132;
    const pW = W - 160;
    const pH = Math.min(isStory ? 480 : 320, contentH - statRowH - 42);
    const pX = (W - pW) / 2;
    const pY = contentTopY + 10;

    if (photos[0]?.width && pH > 120) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pX, pY, pW, pH, 30);
      ctx.clip();
      drawImageCover(ctx, photos[0], pX, pY, pW, pH, 0.35);
      ctx.restore();
      ctx.strokeStyle = '#eab308';
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
      ctx.fillStyle = 'rgba(7, 27, 64, 0.88)';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(sx, sY, sW, statRowH, 24);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde047';
      fitText(ctx, st.a, sx + sW / 2, sY + 48, sW - 24, 48, 28, '900');
      ctx.fillStyle = '#f8fafc';
      fitText(ctx, st.b, sx + sW / 2, sY + 98, sW - 24, 21, 14, '800', '"Tajawal", sans-serif');
      ctx.restore();
    });
  } else if (templateId === 'grad-frame-cta') {
    renderStandardHeadlines(headY, hlY, subY, 2);

    // Playful Royal Frame Preview Mockup + QR Card side-by-side (or stacked on Story)
    const boxW = W - 150;
    const boxX = (W - boxW) / 2;
    const boxY = contentTopY + 14;
    const boxH = Math.min(isStory ? 620 : 460, contentH - 28);

    const photoSize = isStory ? 410 : Math.min(390, boxH - 30);
    const photoX = isStory ? cx - photoSize / 2 : boxX + boxW - photoSize - 10;
    const photoY = isStory ? boxY : boxY + (boxH - photoSize) / 2;

    // Mocked Graduation Frame
    ctx.save();
    ctx.shadowColor = 'rgba(2, 6, 23, 0.35)';
    ctx.shadowBlur = 28;
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

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 26);
    ctx.stroke();

    // Cute ribbon across bottom of frame mockup
    ctx.fillStyle = '#082357';
    ctx.beginPath();
    ctx.roundRect(photoX + 24, photoY + photoSize - 56, photoSize - 48, 44, 22);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    fitText(ctx, '🎓 خريج 1001 طفل رقمي 🌟', photoX + photoSize / 2, photoY + photoSize - 33, photoSize - 64, 20, 14, '900');

    // QR Card beside (or beneath on story)
    const qrCardW = isStory ? boxW - 120 : boxW - photoSize - 48;
    const qrCardH = isStory ? 190 : Math.min(340, photoSize);
    const qrCardX = isStory ? cx - qrCardW / 2 : boxX;
    const qrCardY = isStory ? photoY + photoSize + 44 : boxY + (boxH - qrCardH) / 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(qrCardX, qrCardY, qrCardW, qrCardH, 28);
    ctx.fill();
    ctx.stroke();

    if (qrImg?.width) {
      const qs = isStory ? 136 : Math.min(200, qrCardW - 60);
      const qx = isStory ? qrCardX + 28 : qrCardX + (qrCardW - qs) / 2;
      const qy = isStory ? qrCardY + (qrCardH - qs) / 2 : qrCardY + 26;
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
    const qrBoxH = isStory ? 230 : 196;
    const cardsAreaH = contentH - qrBoxH - 32;
    const cGap = 18;
    const cH = Math.min(148, (cardsAreaH - cGap) / 2);
    let cursorY = contentTopY + 8;

    cards.forEach((c, idx) => {
      ctx.save();
      ctx.fillStyle = 'rgba(7, 27, 64, 0.84)';
      ctx.strokeStyle = idx === 0 ? '#fde047' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(boxX, cursorY, boxW, cH, 26);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = idx === 0 ? '#fde047' : '#7dd3fc';
      fitText(ctx, `${idx === 0 ? '🎟️' : '🚀'}  ${c.a}`, boxX + boxW - 32, cursorY + cH * 0.34, boxW - 64, 27, 18, '900');
      ctx.fillStyle = '#f8fafc';
      fitText(ctx, c.b, boxX + boxW - 32, cursorY + cH * 0.70, boxW - 64, 22, 15, '700', '"Tajawal", sans-serif');
      ctx.restore();
      cursorY += cH + cGap;
    });

    // Big luminous QR CTA banner
    const qy = cursorY + 6;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(boxX, qy, boxW, qrBoxH, 28);
    ctx.fill();
    ctx.stroke();

    const qs = qrBoxH - 36;
    if (qrImg?.width) {
      ctx.drawImage(qrImg, boxX + 24, qy + 18, qs, qs);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#082357';
    fitText(ctx, tpl.qrLabel || 'امسح الكود للحجز الفوري', boxX + boxW - 32, qy + qrBoxH * 0.32, boxW - qs - 76, 30, 19, '900');
    ctx.fillStyle = '#0284c7';
    fitText(ctx, 'abdaa.masdar.company', boxX + boxW - 32, qy + qrBoxH * 0.62, boxW - qs - 76, 28, 18, '900');
    ctx.fillStyle = '#64748b';
    fitText(ctx, 'حجز فوري ومجاني • استلم تذكرتك خلال ثوانٍ', boxX + boxW - 32, qy + qrBoxH * 0.83, boxW - qs - 76, 19, 13, '700', '"Tajawal", sans-serif');
    ctx.restore();
  } else if (templateId === 'countdown-arrival') {
    // Huge Glowing Metallic Gold Countdown Medallion + Title + 3 Arrival Info Cards
    const medR = isStory ? 175 : isSquare ? 112 : 138;
    const medY = eyebrowY + medR + (isStory ? 80 : 48);

    ctx.save();
    const aura = ctx.createRadialGradient(cx, medY, medR * 0.4, cx, medY, medR * 1.6);
    aura.addColorStop(0, 'rgba(251, 191, 36, 0.42)');
    aura.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, medY, medR * 1.6, 0, Math.PI * 2);
    ctx.fill();

    const mg = ctx.createLinearGradient(cx - medR, medY - medR, cx + medR, medY + medR);
    mg.addColorStop(0, '#071b40');
    mg.addColorStop(0.5, '#0f367a');
    mg.addColorStop(1, '#04112b');
    ctx.fillStyle = mg;
    ctx.strokeStyle = '#fde047';
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
    fitText(ctx, numStr, cx, medY - 14, medR * 1.5, numStr.length <= 2 ? 104 : 66, 40, '900');
    ctx.fillStyle = '#ffffff';
    fitText(ctx, d.countdownUnit || 'أيام متبقية', cx, medY + medR * 0.44, medR * 1.55, 24, 15, '800');

    const titleY = medY + medR + (isStory ? 84 : 58);
    ctx.fillStyle = '#ffffff';
    fitText(ctx, d.headline || '', cx, titleY, W - 140, isSquare ? 48 : 56, 30, '900');

    const subHlY = titleY + (isStory ? 66 : 54);
    ctx.fillStyle = '#fde68a';
    fitText(ctx, d.highlight || '', cx, subHlY, W - 160, isSquare ? 26 : 30, 18, '800');

    // 3-column arrival info strip
    const items = parsePairedLines(d.extraLines).slice(0, 3);
    if (items.length) {
      const stripW = W - 140;
      const sGap = 20;
      const sW = (stripW - sGap * (items.length - 1)) / items.length;
      const sH = isStory ? 160 : 126;
      const sY = Math.min(contentBottomY - sH - 20, subHlY + (isStory ? 95 : 54));
      const startX = (W - stripW) / 2;

      items.forEach((it, idx) => {
        const sx = startX + (items.length - 1 - idx) * (sW + sGap);
        ctx.fillStyle = 'rgba(7, 27, 64, 0.86)';
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(sx, sY, sW, sH, 22);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde68a';
        fitText(ctx, it.a, sx + sW / 2, sY + sH * 0.34, sW - 24, 21, 14, '800');
        ctx.fillStyle = '#ffffff';
        fitText(ctx, it.b, sx + sW / 2, sY + sH * 0.70, sW - 24, 24, 15, '900', '"Tajawal", sans-serif');
      });
    }
    ctx.restore();
  }

  // Bottom Footer Strip
  drawFooterStrip(ctx, W, H, d.footerNote, isLight, showMasdarSubtle, logoMasdar);
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
    for (const fMode of formatsToExport) {
      const fmt = fMode === 'default' ? tpl.defaultFormat || 'post' : fMode === 'post' && tpl.defaultFormat === 'cover' ? 'cover' : fMode;
      if (onProgress) onProgress(done, total, `${tpl.name} (${CAMPAIGN_FORMATS[fmt]?.label || fmt})`);
      const { blob, filename } = await renderCampaignPngBlob(tpl.id, customData, {
        ...globalOptions,
        format: fmt
      });
      if (blob) {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        files.push({ name: filename, data: bytes });
      }
      done += 1;
    }
  }

  // Also include a ready-to-paste Arabic captions text file inside the ZIP!
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
