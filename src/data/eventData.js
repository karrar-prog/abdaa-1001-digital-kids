import { GRADUATION_COHORTS, ALL_168_GRADUATES } from './cohortsData';
import { OFFICIAL_CHILDREN_PROJECTS } from './projectsData';
import { EventDB } from '../lib/supabase';

export const EVENT_DETAILS = {
  cohorts: GRADUATION_COHORTS,
  allGraduates: ALL_168_GRADUATES,
  title: "حفل تخرج الدفعة الأولى",
  subtitle: "مبادرة «1001» طفل رقمي",
  forumTitle: "ملتقى النجف للابتكار الرقمي",
  organization: "نادي أبدع للمهارات الذكية – النجف الأشرف",
  slogan: "نصنع جيلاً يبرمج المستقبل ... معاً",
  targetAgeRange: "للأطفال والناشئة من عمر 6 إلى 14 سنة",
  dateText: "الجمعة، 27 تشرين الثاني 2026",
  eventDateISO: "2026-11-27T15:00:00",
  time: "الساعة 03:00 عصراً (الوصول 2:00 ظهراً)",
  venue: "قصر الثقافة – النجف الأشرف",
  capacity: "+500 مقعد",
  
  contact: {
    leadName: "فراس نزار كريم",
    phone: "07810746655",
    email: "abda3skills.info@gmail.com",
    address: "النجف الأشرف – جمهورية العراق"
  },

  stats: [
    { number: "896", label: "طفلاً تدربوا بالمبادرة", desc: "ضمن الفئة العمرية (6 – 14 سنة)" },
    { number: "700", label: "أتموا متطلبات التدريب", desc: "في كافة المحاور الأساسية" },
    { number: "168", label: "طفلاً متخرجاً نحتفي بهم", desc: "يمثلون نخبة الدفعة الأولى" },
    { number: String(OFFICIAL_CHILDREN_PROJECTS.length), label: "مشروعاً وابتكاراً حياً", desc: "يقدمها الأطفال بأنفسهم بالمعرض" },
    { number: "26", label: "مؤسساً وشريكاً ومدرباً", desc: "5 مؤسسين وشريك استراتيجي و20 مدرباً متطوعاً" }
  ],

  founders: {
    names: "فراس نزار كريم، أ.م.د. علياء عبد الحسين لفتة، محمد ومريم وزهراء فراس نزار",
    title: "مؤسسو نادي أبدع للمهارات الذكية وأبطال العرب في الابتكار",
    badge: "المركز الأول عربياً (2024 - 2026)",
    story: "انطلق نادي أبدع في 10-10-2025 من قصة شغف طفلين موهوبين، تحولت المنافسات العلمية إلى مشروع تعليمي ومجتمعي يهدف لاكتشاف مواهب الأطفال في العراق (من عمر 6 إلى 14 سنة)، وتوجت إنجازاتهم بالفوز بالمركز الأول في مسابقة الابتكار المتقدم بالبطولة العربية للروبوت والذكاء الاصطناعي لثلاث سنوات متتالية."
  },

  // قصة النادي والبطاقة البصرية (قابلة للتعديل الكامل من لوحة التحكم السحابية)
  story: {
    badge: "قصة نجاح وإلهام عراقية رائدة 🏆",
    headlineLine1: "من شغف طفلين موهوبين..",
    headlineHighlight: "إلى حراك رقمي يحتضن 1001 طفل",
    paragraph1: "تأسس نادي أبدع للمهارات الذكية في النجف الأشرف في 10 تشرين الأول 2025 انطلاقاً من تجربة الأخوين المبدعين مريم ومحمد فراس نزار، اللذين رفعا اسم العراق عالياً بالفوز بالمركز الأول في مسابقة الابتكار المتقدم بالبطولة العربية للروبوت والذكاء الاصطناعي لثلاث سنوات متتالية (2024–2026).",
    paragraph2: "تحول هذا الشغف الطفولي الملهم إلى مبادرة مجتمعية وتعليمية مجانية بالكامل، استهدفت الأطفال والناشئة من عمر 6 إلى 14 سنة، مع إيلاء عناية خاصة بالأيتام وأبناء العائلات المتعففة وتشجيع الفتيات على خوض غمار البرمجة والابتكار.",
    quote: "\"حينما يتعلم الطفل من طفل مثله، تتحول البرمجة والروبوتات من مادة صعبة إلى مغامرة شيقة يصنع فيها الأطفال مستقبلهم بأيديهم.\"",
    quoteAuthor: "رسالة نادي أبدع للمهارات الذكية – النجف الأشرف",
    ctaText: "احجز مقعدك بحفل التخرج مجاناً",
    trophyBadge: "🌟 إنجاز عربي متواصل",
    trophyTitle: "المركز الأول عربياً لـ 3 سنوات متتالية",
    trophySubtitle: "البطولة العربية للروبوت والذكاء الاصطناعي (2024 - 2026)",
    highlights: [
      {
        title: "مبادرة مجانية بالكامل (6–14 سنة)",
        desc: "تكافؤ الفرص وحق اكتساب مهارات المستقبل لجميع أطفالنا"
      },
      {
        title: "رعاية خاصة للأيتام والمتعففين",
        desc: "بالتعاون مع مدارس دار الزهراء الخيرية وقسم رعاية الطفولة"
      },
      {
        title: `${OFFICIAL_CHILDREN_PROJECTS.length} مشروعاً وابتكاراً طلابياً حياً`,
        desc: "يشرحها الأطفال بأنفسهم أمام العائلات واللجان العلمية"
      }
    ]
  },

  // إعدادات قسم الشريط المتحرك للصور في الصفحة الرئيسية (قابل للتعديل السحابي الكامل)
  marqueeSection: {
    enabled: true,
    badge: "لقطات حية ومباشرة من مختبرات أبدع",
    title: "شريط اللحظات الملهمة وصناعة الأبطال",
    hint: "حرك الفأرة لإيقاف الشريط • اضغط على أي صورة لتكبيرها"
  },

  // معرض الصور التدريبية وشريط اللحظات الملهمة (قابل للإدارة السحابية الكاملة)
  galleryItems: [
    {
      id: 1,
      title: "تجميع وبرمجة أذرع الروبوت الهيدروليكية",
      category: "robotics",
      categoryLabel: "مختبرات الروبوت",
      image: "/gallery/training_1.jpg",
      description: "الطلاب أثناء تركيب المكونات الميكانيكية وتوصيل الدوائر الإلكترونية مع وحدة التحكم المصغرة.",
      stats: "ورشة عملية مكثفة",
      color: "from-sky-500 to-blue-600"
    },
    {
      id: 2,
      title: "جلسات كتابة الشيفرات البرمجية ومحاكاة الذكاء الاصطناعي",
      category: "coding",
      categoryLabel: "البرمجة والخوارزميات",
      image: "/gallery/training_2.jpg",
      description: "تدريب الطلاب على خوارزميات بايثون ومنصة سكراتش وتطبيقها في حل المشكلات الحقيقية.",
      stats: "تطبيق خوارزميات الرؤية",
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: 3,
      title: "اختبار حساسات المسار وتجنب العقبات",
      category: "robotics",
      categoryLabel: "مختبرات الروبوت",
      image: "/gallery/training_3.jpg",
      description: "معايرة مستشعرات الأشعة تحت الحمراء والألتراسونيك على الحلبة التجريبية لنادي أبدع.",
      stats: "دقة عالية في المعايرة",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 4,
      title: "ورش العمل التفاعلية والعمل الجماعي للفرق",
      category: "teamwork",
      categoryLabel: "فرق العمل والابتكار",
      image: "/gallery/training_4.jpg",
      description: "مناقشات العصف الذهني وتقسيم المهام بين أعضاء الفرق الأربعين لإنجاز نماذج التخرج.",
      stats: "40 فريقاً مبتكراً",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 5,
      title: "استعراض النماذج الأولية أمام لجان التحكيم",
      category: "stage",
      categoryLabel: "التقييم والجاهزية",
      image: "/gallery/training_5.jpg",
      description: "عرض تجريبي للابتكارات الطلابية للتأكد من جاهزيتها للعرض في قصر الثقافة أمام الجمهور.",
      stats: "تقييم شامل وملاحظات",
      color: "from-rose-500 to-pink-600"
    },
    {
      id: 6,
      title: "البوستر والمنهاج الشامل لمبادرة 1001 طفل رقمي",
      category: "stage",
      categoryLabel: "التقييم والجاهزية",
      image: "/gallery/rollup_innovation.jpg",
      description: "الرؤية الوطنية لإعداد أجيال متقنة للذكاء الاصطناعي وهندسة البرمجيات بالنجف الأشرف.",
      stats: "رؤية مستقبلية",
      color: "from-violet-600 to-purple-700"
    },
    {
      id: 7,
      title: "بروفة المسرح والتكريم الرسمي في قصر الثقافة",
      category: "stage",
      categoryLabel: "التقييم والجاهزية",
      image: "/gallery/stage_prep.jpg",
      description: "الاستعدادات النهائية لفقرات صعود الخريجين ومنح الدروع وشهادات التقدير بحضور الشخصيات الرسمية.",
      stats: "مسرح قصر الثقافة",
      color: "from-blue-600 to-indigo-700"
    },
    {
      id: 8,
      title: "تطوير ألعاب تفاعلية بمحرك Scratch التعليمي",
      category: "coding",
      categoryLabel: "البرمجة والخوارزميات",
      image: "/gallery/training_6.jpg",
      description: "بناء ألعاب هادفة ترسخ مفاهيم التفكير المنطقي والرياضيات والأمن الرقمي للأطفال.",
      stats: "إبداع برمجي",
      color: "from-cyan-500 to-sky-600"
    }
  ],

  // هيكلة المراحل العمرية المعتمدة (6 إلى 14 سنة) - تمنح رصانة أكاديمية عالية لأولياء الأمور والجهات الرسمية
  ageStages: [
    {
      id: "stage-7-9",
      ageBadge: "6 – 9 سنوات",
      title: "مرحلة المستكشف الرقمي",
      engTitle: "Junior Digital Explorer",
      accent: "sky",
      summary: "تأسيس التفكير المنطقي والخيال الهندسي وتحويل الطفل من مستهلك للألعاب إلى صانع لها بأسلوب تفاعلي محبب.",
      skills: [
        "البرمجة الكتلية والقصص التفاعلية (Scratch 3.0)",
        "مبادئ تركيب الروبوتات الميكانيكية والدوائر البسيطة",
        "التعرف المبسط على الذكاء الاصطناعي الصوري والصوتي",
        "قواعد الأمان الرقمي وحماية الخصوصية أثناء التصفح"
      ],
      tools: ["Scratch 3.0", "Micro:bit", "LEGO Robotics", "Safe Web"]
    },
    {
      id: "stage-10-11",
      ageBadge: "10 – 11 سنة",
      title: "مرحلة البنّاء المبتكر",
      engTitle: "Smart Tech Builder",
      accent: "indigo",
      summary: "الانتقال من البرمجة المرئية إلى ربط البرمجيات بالعتاد الفيزيائي (Hardware) وبناء نماذج ذكية تعالج مشكلات يومية.",
      skills: [
        "برمجة المتحكمات الدقيقة (Arduino Uno) وربط الحساسات",
        "بناء تطبيقات الويب التفاعلية وأساسيات JavaScript",
        "تدريب نماذج تعلم الآلة المبسطة (Teachable Machine)",
        "التشفير المبسط وفحص قوة كلمات المرور"
      ],
      tools: ["Arduino C++", "Sensors & Actuators", "HTML/CSS/JS", "AI Models"]
    },
    {
      id: "stage-12-14",
      ageBadge: "12 – 14 سنة",
      title: "مرحلة القائد التقني",
      engTitle: "Future Tech Pioneer",
      accent: "amber",
      summary: "إعداد الناشئة بمستوى هندسي متقدم يؤهلهم للمشاركة في البطولات العربية والدولية وبناء مشاريع تخرج متكاملة.",
      skills: [
        "البرمجة بلغة Python والخوارزميات المتقدمة",
        "الرؤية الحاسوبية (OpenCV / YOLO) ومعالجة الإيماءات",
        "أنظمة إنترنت الأشياء السحابية (ESP32 & IoT)",
        "الأمن السيبراني التطبيقي واكتشاف الثغرات الأخلاقي"
      ],
      tools: ["Python", "OpenCV & YOLO", "ESP32-CAM", "Cybersecurity"]
    }
  ],

  tracks: [
    {
      id: "programming",
      name: "البرمجة والتطبيقات",
      tag: "Programming",
      ageTarget: "6 – 14 سنة",
      color: "from-blue-500 to-indigo-600",
      description: "تنمية التفكير المنطقي ومهارات كتابة الشيفرات البرمجية وبناء تطبيقات الويب والألعاب التعليمية الذكية.",
      icon: "Code2"
    },
    {
      id: "robotics",
      name: "تصميم وبرمجة الروبوتات",
      tag: "Robotics",
      ageTarget: "6 – 14 سنة",
      color: "from-cyan-500 to-teal-600",
      description: "تعلم المبادئ الهندسية لتصميم وبناء الروبوتات وبرمجة المتحكمات والحساسات لحل مشكلات واقعية.",
      icon: "Bot"
    },
    {
      id: "ai",
      name: "الذكاء الاصطناعي",
      tag: "Artificial Intelligence",
      ageTarget: "9 – 14 سنة",
      color: "from-violet-500 to-purple-600",
      description: "فهم أسس خوارزميات الذكاء الاصطناعي، والرؤية الحاسوبية، وتوظيف النماذج الذكية في مشاريع إنسانية وبيئية.",
      icon: "Brain"
    },
    {
      id: "cybersecurity",
      name: "الأمن السيبراني",
      tag: "Cybersecurity",
      ageTarget: "8 – 14 سنة",
      color: "from-amber-500 to-orange-600",
      description: "توسيع المعارف الرقمية وتعزيز الاستخدام الآمن والمسؤول للتقنيات والتشفير وحماية الهوية الرقمية.",
      icon: "ShieldCheck"
    }
  ],

  // معايير التقييم العلمية للمشاريع الـ 40 (من 100 درجة - مستوحاة من منظومة تحكيم مؤتمر الفارابي)
  evaluationCriteria: [
    { title: "الأصالة وإبداع الفكرة الابتكارية", score: "25 درجة", pct: "100%" },
    { title: "جودة البناء البرمجي والهندسي (حسب الفئة 6–14)", score: "25 درجة", pct: "100%" },
    { title: "الأثر المجتمعي وحل المشكلة الواقعية", score: "20 درجة", pct: "85%" },
    { title: "كفاءة عمل النموذج الأولي الحي في الجناح", score: "15 درجة", pct: "80%" },
    { title: "مهارات العرض والثقة والحوار العلمي للطفل", score: "15 درجة", pct: "80%" }
  ],

  agendaMeta: {
    forumTitle: "ملتقى النجف للابتكار الرقمي",
    programTitle: "منهاج حفلة تخرج 1001 طفل رقمي",
    dateFull: "يوم الجمعة الموافق 27/11/2026",
    venueFull: "رحاب قصر الثقافة – النجف الأشرف",
    arrivalLabel: "الوصول والترحيب: الساعة 2:00 ظهراً",
    arrivalTime: "2:00 ظهراً",
    startTime: "3:00 عصراً",
    endTime: "4:57 عصراً",
    totalDuration: "ساعتان و7 دقائق",
    totalMinutes: 127,
    organizers: "شركة مصدر لتطوير البرمجيات  •  نادي أبدع للمهارات الذكية"
  },

  agendaPhases: [
    {
      id: "opening",
      number: "01",
      label: "الفترة الأولى",
      title: "الافتتاح الرسمي",
      durationLabel: "35 دقيقة",
      durationMinutes: 35,
      timeRange: "2:50 – 3:25 عصراً",
      theme: "royal"
    },
    {
      id: "initiative",
      number: "02",
      label: "الفترة الثانية",
      title: "فقرات المبادرة",
      durationLabel: "32 دقيقة",
      durationMinutes: 32,
      timeRange: "3:25 – 3:57 عصراً",
      theme: "sky"
    },
    {
      id: "honoring",
      number: "03",
      label: "الفترة الثالثة",
      title: "التكريم",
      durationLabel: "55 دقيقة",
      durationMinutes: 55,
      timeRange: "3:57 – 4:52 عصراً",
      theme: "gold"
    },
    {
      id: "closing",
      number: "04",
      label: "الفترة الرابعة",
      title: "الختام",
      durationLabel: "5 دقائق",
      durationMinutes: 5,
      timeRange: "4:52 – 4:57 عصراً",
      theme: "emerald"
    }
  ],

  agenda: [
    // الفترة الأولى (الافتتاح الرسمي) – 35 دقيقة
    {
      id: "ag-00",
      phaseId: "opening",
      time: "2:50 – 3:00",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "استقبال فخامة رئيس الجمهورية والتقاط صورة تذكارية",
      speaker: "فخامة رئيس جمهورية العراق الدكتور نزار محمد سعيد واللجنة المنظمة",
      description: "استقبال فخامة رئيس جمهورية العراق في رحاب قصر الثقافة والتقاط الصورة التذكارية الرسمية",
      highlight: true,
      vip: true,
      iconType: "camera"
    },
    {
      id: "ag-01",
      phaseId: "opening",
      time: "3:00 – 3:05",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "تلاوة آيات من الذكر الحكيم",
      speaker: "القارئ: فادي الحسين علاء جميل اليساري",
      description: "القارئ: فادي الحسين علاء جميل اليساري",
      iconType: "book"
    },
    {
      id: "ag-02",
      phaseId: "opening",
      time: "3:05 – 3:10",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة الافتتاح",
      speaker: "عريف الحفل",
      description: "عريف الحفل",
      iconType: "mic"
    },
    {
      id: "ag-03",
      phaseId: "opening",
      time: "3:10 – 3:13",
      duration: "3 دقائق",
      durationMinutes: 3,
      title: "النشيد الوطني",
      speaker: "الحضور",
      description: "الحضور",
      iconType: "flag"
    },
    {
      id: "ag-03b",
      phaseId: "opening",
      time: "3:13 – 3:15",
      duration: "دقيقتان",
      durationMinutes: 2,
      title: "قراءة سورة الفاتحة على أرواح شهداء العراق",
      speaker: "الحضور",
      description: "قراءة سورة الفاتحة ترحماً على أرواح شهداء العراق الأبرار",
      iconType: "book"
    },
    {
      id: "ag-04",
      phaseId: "opening",
      time: "3:15 – 3:20",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة السيد محافظ النجف الأشرف",
      speaker: "المهندس يوسف مكي كناوي",
      description: "المهندس يوسف مكي كناوي",
      highlight: true,
      vip: true,
      iconType: "landmark"
    },
    {
      id: "ag-05",
      phaseId: "opening",
      time: "3:20 – 3:25",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة فخامة رئيس جمهورية العراق",
      speaker: "الدكتور نزار محمد سعيد",
      description: "الدكتور نزار محمد سعيد",
      highlight: true,
      vip: true,
      iconType: "crown"
    },

    // الفترة الثانية (فقرات المبادرة) – 32 دقيقة
    {
      id: "ag-06",
      phaseId: "initiative",
      time: "3:25 – 3:30",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة الأستاذ فراس نزار كريم",
      speaker: "نادي أبدع للمهارات الذكية",
      description: "نادي أبدع للمهارات الذكية",
      iconType: "sparkles"
    },
    {
      id: "ag-07",
      phaseId: "initiative",
      time: "3:30 – 3:35",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "فقرة مريم فراس نزار",
      speaker: "مؤسس ومدرب — نادي أبدع للمهارات الذكية",
      description: "فقرة مريم فراس نزار — نادي أبدع للمهارات الذكية",
      iconType: "star"
    },
    {
      id: "ag-08",
      phaseId: "initiative",
      time: "3:35 – 3:45",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "حوار الأستاذ كرار حساني",
      speaker: "الشريك الاستراتيجي لمبادرة 1001 طفل رقمي والمدير التنفيذي لشركة مصدر لتكنولوجيا المعلومات وتطوير البرمجيات",
      description: "الشريك الاستراتيجي لمبادرة 1001 طفل رقمي والمدير التنفيذي لشركة مصدر لتكنولوجيا المعلومات وتطوير البرمجيات",
      highlight: true,
      iconType: "message"
    },
    {
      id: "ag-09",
      phaseId: "initiative",
      time: "3:45 – 3:52",
      duration: "7 دقائق",
      durationMinutes: 7,
      title: "عرض فيديو توثيقي لرحلة الأطفال",
      speaker: "عرض مرئي",
      description: "عرض مرئي توثيقي لرحلة أطفال مبادرة 1001 طفل رقمي",
      iconType: "film"
    },
    {
      id: "ag-10",
      phaseId: "initiative",
      time: "3:52 – 3:57",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "فقرة محمد فراس نزار",
      speaker: "مؤسس ومدرب — نادي أبدع للمهارات الذكية",
      description: "فقرة محمد فراس نزار — نادي أبدع للمهارات الذكية",
      iconType: "star"
    },

    // الفترة الثالثة (التكريم) – 55 دقيقة
    {
      id: "ag-11",
      phaseId: "honoring",
      time: "3:57 – 4:27",
      duration: "30 دقيقة",
      durationMinutes: 30,
      title: "تقديم الشهادات للأطفال الخريجين",
      speaker: "تتويج خريجي الدفعة الأولى لمبادرة 1001 طفل رقمي (168 خريجاً)",
      description: "تقديم الشهادات للأطفال الخريجين — الدفعة الأولى (168 خريجاً)",
      highlight: true,
      iconType: "graduation"
    },
    {
      id: "ag-12",
      phaseId: "honoring",
      time: "4:27 – 4:37",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "تقديم الدروع للشركات الراعية",
      speaker: "من قبل الأستاذ كرار حساني",
      description: "من قبل الأستاذ كرار حساني — المدير التنفيذي لشركة مصدر",
      iconType: "award"
    },
    {
      id: "ag-13",
      phaseId: "honoring",
      time: "4:37 – 4:47",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "تقديم الدروع للمدربين",
      speaker: "من قبل الأستاذ فراس نزار كريم",
      description: "من قبل الأستاذ فراس نزار كريم — مؤسس نادي أبدع للمهارات الذكية",
      iconType: "trophy"
    },
    {
      id: "ag-14",
      phaseId: "honoring",
      time: "4:47 – 4:52",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "تقديم الدروع للمتطوعين",
      speaker: "الأستاذ فراس نزار كريم",
      description: "الأستاذ فراس نزار كريم",
      iconType: "heart"
    },

    // الفترة الرابعة (الختام) – 5 دقائق
    {
      id: "ag-15",
      phaseId: "closing",
      time: "4:52 – 4:57",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "الختام والتقاط الصورة التذكارية والتوجه لزيارة معرض الشركات",
      speaker: "عريف الحفل",
      description: "عريف الحفل — اختتام الحفل والتقاط الصورة التذكارية وزيارة معرض الشركات",
      highlight: true,
      iconType: "camera"
    }
  ],

  projectsSample: OFFICIAL_CHILDREN_PROJECTS,

  // ميثاق الأمان الرقمي والبيئة التربوية الحاضنة (يخاطب أولياء الأمور والجهات التربوية)
  safetyPillars: [
    {
      title: "بيئة تربوية آمنة 100% ومشرفون مختصون",
      desc: "تُقام جميع الورش التدريبية بإشراف مباشر من أساتذة ومدربين معتمدين وتربويين يراعون الفروق الفردية والنفسية للأطفال (6–14 سنة)."
    },
    {
      title: "استخدام أخلاقي وآمن للذكاء الاصطناعي",
      desc: "ندرب الأطفال على استخدام أدوات التقنية والذكاء الاصطناعي كوسيلة للبحث والابتكار والإنتاج العلمي مع الالتزام التام بقواعد الحماية الرقمية."
    },
    {
      title: "توثيق رسمي وشهادات معتمدة",
      desc: "يحصل كل خريج على بطاقة عضوية رقمية ذكية (Digital Kid ID) وثلاث شهادات معتمدة من نادي أبدع والجهات الراعية ونقابة المبرمجين."
    },
    {
      title: "مجانية المبادرة وتكافؤ الفرص",
      desc: "المبادرة مجانية بالكامل لجميع الأطفال، مع تخصيص مقاعد ورعاية خاصة للأيتام وأبناء العائلات المتعففة والموهوبين."
    }
  ],

  parentFaqs: [
    {
      q: "ما هي الفئة العمرية المشمولة في برامج نادي أبدع ومبادرة 1001 طفل رقمي؟",
      a: "تستهدف المبادرة الأطفال والناشئة من عمر 6 سنوات إلى 14 سنة، حيث يتم توزيعهم علمياً إلى 3 مراحل عمرية (6–9 سنوات، 10–11 سنة، 12–14 سنة) لضمان توافق المنهج البرمجي والهندسي مع قدرات الطفل الذهنية."
    },
    {
      q: "هل يشترط أن يمتلك الطفل خبرة سابقة في البرمجة أو حاسوباً محمولاً خاصاً؟",
      a: "لا يشترط أي خبرة سابقة؛ فالمسارات تبدأ من التأسيس المنطقي المبسط وتتدرج حتى بناء المشاريع المتقدمة، كما يوفر النادي بالتعاون مع الجهات الداعمة المستلزمات والحقائب التدريبية والروبوتات خلال الورش."
    },
    {
      q: "كيف يتم استلام بطاقة الخريج البلاستيكية والشهادات الثلاث في الحفل؟",
      a: "تُسلّم حافظة الشهادات الثلاث مع بطاقة الخريج المزودة برمز التحقق الرسمي ودرع التخرج مباشرة على مسرح قصر الثقافة أثناء فقرة تكريم الخريجين الـ 168 (مقسمين إلى 10 مجموعات منظمة)، كما يمكن طباعة النسخة الرقمية فوراً من الموقع."
    },
    {
      q: "كيف يمكنني تسجيل طفلي في الدفعة الثانية القادمة من المبادرة؟",
      a: "سيتم فتح باب التسجيل للدفعة الثانية عقب احتفالية تخرج الدفعة الأولى مباشرة، ويمكن لأولياء الأمور حجز مقعد حضور في الحفل الآن للاطلاع الحي على مشاريع الأطفال والتسجيل الميداني."
    }
  ],

  // الشركاء الرئيسيون للمبادرة (نادي أبدع + شركة المصدر فقط)
  strategicPartners: [
    {
      name: "نادي أبدع للمهارات الذكية",
      role: "الشريك المنظم للمبادرة",
      desc: "الحاضنة التعليمية والتدريبية لمبادرة «1001» طفل رقمي لتأهيل الأطفال والناشئة (6 – 14 سنة) في البرمجة والروبوتات والذكاء الاصطناعي في النجف الأشرف.",
      logo: "/brand/abdaa-logo.png",
      badge: "الشريك المنظم"
    },
    {
      name: "شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات",
      role: "الشريك والمنظم للمبادرة",
      desc: "الشريك الاستراتيجي لنادي أبدع والداعم لمبادرة «1001» طفل رقمي.",
      logo: "/brand/masdar-logo-full-clean.png",
      badge: "الشريك والمنظم"
    }
  ],

  // الرعاة والداعمون للاحتفالية (المرتبة الأولى: مجموعة الياسر، شركة الغدير، ومجمع الأميرات ثم باقي الرعاة)
  partners: [
    { 
      name: "مجموعة شركات ياسر حلاوة", 
      role: "راعٍ رئيسي وداعم",
      logo: "/sponsors/yasser_group.png",
      featured: true,
      highlight: true
    },
    { 
      name: "شركة الغدير", 
      role: "راعٍ رئيسي وداعم",
      logo: "/sponsors/alghadeer.jpg",
      featured: true,
      highlight: true
    },
    { 
      name: "مجمع الأميرات السكني", 
      role: "راعٍ رئيسي وداعم",
      logo: "/sponsors/alameerat.png",
      featured: true,
      highlight: true
    },
    { 
      name: "وزارة التربية العراقية", 
      role: "راعٍ تعليمي وحكومي",
      logo: "/sponsors/ministry_of_education.jpg",
      highlight: true
    },
    { 
      name: "نقابة المبرمجين العراقيين", 
      role: "راعٍ مهني ومعتمد",
      logo: "/sponsors/programmers_syndicate.jpg",
      highlight: true
    },
    { 
      name: "جامعة الفرات الأوسط التقنية", 
      role: "راعٍ أكاديمي داعم",
      logo: "/sponsors/atu_university.jpg",
      highlight: true
    },
    { 
      name: "شركة الحسام", 
      role: "راعٍ داعم للاحتفالية",
      logo: "/sponsors/alhussam.jpg",
      highlight: false
    },
    { 
      name: "أكاديمية الروبوت", 
      role: "راعٍ علمي وتقني",
      logo: "/sponsors/robotics_academy.jpg",
      highlight: false
    },
    { 
      name: "مدارس سما العراق", 
      role: "راعٍ تعليمي داعم",
      logo: "/sponsors/sama_schools.jpg",
      highlight: false
    },
    { 
      name: "مدارس دار الزهراء الخيرية", 
      role: "راعٍ خيري وإنساني",
      logo: "/sponsors/dar_alzahraa.jpg",
      highlight: false
    },
    { 
      name: "منظمة العراق لرعاية الموهوبين", 
      role: "راعٍ مجتمعي للموهوبين",
      logo: "/sponsors/talented_care.jpg",
      highlight: false
    },
    { 
      name: "قسم رعاية وتنمية الطفولة", 
      role: "راعٍ تنمية الطفولة",
      logo: "/sponsors/childhood_care.jpg",
      highlight: false
    },
    { 
      name: "المركز الوطني للذكاء الاصطناعي", 
      role: "راعٍ تقني داعم",
      logo: "/sponsors/national_ai_center.jpg",
      highlight: false
    },
    { 
      name: "مختبر الأمل للتحليلات المرضية", 
      role: "راعٍ داعم للاحتفالية",
      logo: "/sponsors/alamal_lab.jpg",
      highlight: false
    },
    { 
      name: "كورال بزنس لاونج", 
      role: "راعٍ ضيافة وأعمال",
      logo: "/sponsors/coral_lounge.jpg",
      highlight: false
    },
    { 
      name: "مطاعم حضرموت اليمن", 
      role: "راعٍ ضيافة داعم",
      logo: "/sponsors/hadramout_restaurant.jpg",
      highlight: false
    }
  ]
};

// ========================================================
// منظومة إدارة المحتوى الحية (Live CMS Layer)
// تتيح تعديل بيانات الموقع بالكامل من لوحة التحكم وحفظها محلياً وسحابياً
// ========================================================
EVENT_DETAILS.allProjects = EVENT_DETAILS.projectsSample;

export const CMS_STORAGE_KEY = 'abdaa_site_cms_v5';
export const CMS_PIN_STORAGE_KEY = 'abdaa_admin_pin_v1';

// إزالة مفاتيح النسخ القديمة لضمان تحميل السجل الرسمي ومشاريع الأطفال الحقيقية المعتمدة
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('abdaa_site_cms_v1');
    localStorage.removeItem('abdaa_site_cms_v2');
    localStorage.removeItem('abdaa_site_cms_v3');
    localStorage.removeItem('abdaa_site_cms_v4');
  } catch {
    // ignore
  }
}

const DEFAULT_SNAPSHOT = JSON.parse(JSON.stringify({
  title: EVENT_DETAILS.title,
  subtitle: EVENT_DETAILS.subtitle,
  forumTitle: EVENT_DETAILS.forumTitle,
  organization: EVENT_DETAILS.organization,
  slogan: EVENT_DETAILS.slogan,
  targetAgeRange: EVENT_DETAILS.targetAgeRange,
  dateText: EVENT_DETAILS.dateText,
  eventDateISO: EVENT_DETAILS.eventDateISO,
  time: EVENT_DETAILS.time,
  venue: EVENT_DETAILS.venue,
  capacity: EVENT_DETAILS.capacity,
  contact: EVENT_DETAILS.contact,
  stats: EVENT_DETAILS.stats,
  story: EVENT_DETAILS.story,
  ageStages: EVENT_DETAILS.ageStages,
  tracks: EVENT_DETAILS.tracks,
  marqueeSection: EVENT_DETAILS.marqueeSection,
  galleryItems: EVENT_DETAILS.galleryItems,
  strategicPartners: EVENT_DETAILS.strategicPartners,
  partners: EVENT_DETAILS.partners,
  agenda: EVENT_DETAILS.agenda,
  cohorts: EVENT_DETAILS.cohorts,
  allProjects: EVENT_DETAILS.allProjects,
  safetyPillars: EVENT_DETAILS.safetyPillars,
  faq: EVENT_DETAILS.parentFaqs
}));

export function normalizeCohortsStructure(cohortsList) {
  let globalIndex = 1;
  return (cohortsList || []).map((cohort, cIdx) => {
    const rawList = Array.isArray(cohort.graduates) && cohort.graduates.length > 0
      ? cohort.graduates
      : Array.isArray(cohort.students)
      ? cohort.students
      : [];
    const ageStage = cohort.ageStage || cohort.ageRange || '6 – 14 سنة';
    const track = cohort.track || 'البرمجة والذكاء الاصطناعي والروبوتات';
    const graduates = rawList.map((item) => {
      const serial = String(globalIndex++).padStart(3, '0');
      if (typeof item === 'object' && item !== null) {
        return {
          id: item.id || `DK-2026-${serial}`,
          initiativeCode: item.initiativeCode || `1001-IQ-${serial}`,
          name: String(item.name || '').trim(),
          ageGroup: item.ageGroup || ageStage,
          track: item.track || track,
          project: item.project || 'مشروع تخرج الدفعة الأولى 2026',
          grade: item.grade || 'امتياز'
        };
      }
      return {
        id: `DK-2026-${serial}`,
        initiativeCode: `1001-IQ-${serial}`,
        name: String(item || '').trim(),
        ageGroup: ageStage,
        track,
        project: 'مشروع تخرج الدفعة الأولى 2026',
        grade: 'امتياز'
      };
    });

    return {
      ...cohort,
      groupNumber: cohort.groupNumber || cIdx + 1,
      code: cohort.code || `COHORT-${String(cIdx + 1).padStart(2, '0')}`,
      name: cohort.name || cohort.title || `المجموعة ${cIdx + 1}`,
      ageStage,
      track,
      mentor: cohort.mentor || 'الهيئة التدريبية',
      motto: cohort.motto || 'نصنع جيلاً يبرمج المستقبل',
      graduates
    };
  });
}

export function rebuildAllGraduatesFromCohorts(cohortsList) {
  const normalized = normalizeCohortsStructure(cohortsList);
  return normalized.flatMap((cohort) =>
    (cohort.graduates || []).map((g, idx) => ({
      ...g,
      seatOrder: idx + 1,
      cohortNumber: cohort.groupNumber,
      cohortName: cohort.name,
      mentor: cohort.mentor,
      year: g.year || '2026'
    }))
  );
}

export function getActiveCohorts() {
  return normalizeCohortsStructure(EVENT_DETAILS.cohorts || GRADUATION_COHORTS);
}

export function getActiveGraduates() {
  return rebuildAllGraduatesFromCohorts(EVENT_DETAILS.cohorts || GRADUATION_COHORTS);
}

export function getActiveProjects() {
  const list = EVENT_DETAILS.allProjects;
  if (Array.isArray(list) && list.length > 0) return list;
  return EVENT_DETAILS.projectsSample || [];
}

export function applySiteCMSOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object') return;
  const scalarKeys = [
    'title',
    'subtitle',
    'forumTitle',
    'organization',
    'slogan',
    'targetAgeRange',
    'dateText',
    'eventDateISO',
    'time',
    'venue',
    'capacity'
  ];
  scalarKeys.forEach((k) => {
    if (overrides[k] !== undefined) EVENT_DETAILS[k] = overrides[k];
  });

  if (overrides.contact) {
    EVENT_DETAILS.contact = { ...EVENT_DETAILS.contact, ...overrides.contact };
  }
  if (overrides.story && typeof overrides.story === 'object') {
    EVENT_DETAILS.story = {
      ...EVENT_DETAILS.story,
      ...overrides.story,
      highlights: Array.isArray(overrides.story.highlights) && overrides.story.highlights.length > 0
        ? overrides.story.highlights
        : EVENT_DETAILS.story.highlights
    };
  }
  if (Array.isArray(overrides.ageStages) && overrides.ageStages.length > 0) {
    EVENT_DETAILS.ageStages = overrides.ageStages;
  }
  if (Array.isArray(overrides.tracks) && overrides.tracks.length > 0) {
    EVENT_DETAILS.tracks = overrides.tracks;
  }
  if (overrides.marqueeSection && typeof overrides.marqueeSection === 'object') {
    EVENT_DETAILS.marqueeSection = {
      ...EVENT_DETAILS.marqueeSection,
      ...overrides.marqueeSection
    };
  }
  if (Array.isArray(overrides.galleryItems) && overrides.galleryItems.length > 0) {
    EVENT_DETAILS.galleryItems = overrides.galleryItems;
  }
  if (Array.isArray(overrides.stats) && overrides.stats.length > 0) {
    EVENT_DETAILS.stats = overrides.stats;
  }
  if (Array.isArray(overrides.strategicPartners) && overrides.strategicPartners.length > 0) {
    EVENT_DETAILS.strategicPartners = overrides.strategicPartners;
  }
  if (Array.isArray(overrides.partners) && overrides.partners.length > 0) {
    EVENT_DETAILS.partners = overrides.partners;
  }
  if (Array.isArray(overrides.agenda) && overrides.agenda.length > 0) {
    EVENT_DETAILS.agenda = overrides.agenda;
  }
  if (Array.isArray(overrides.cohorts) && overrides.cohorts.length > 0) {
    const hasAnyGraduates = overrides.cohorts.some(
      (c) => (Array.isArray(c.graduates) && c.graduates.length > 0) || (Array.isArray(c.students) && c.students.length > 0)
    );
    if (hasAnyGraduates) {
      const normalized = normalizeCohortsStructure(overrides.cohorts);
      EVENT_DETAILS.cohorts = normalized;
      EVENT_DETAILS.allGraduates = rebuildAllGraduatesFromCohorts(normalized);
    }
  }
  if (Array.isArray(overrides.allProjects) && overrides.allProjects.length > 0) {
    EVENT_DETAILS.allProjects = overrides.allProjects;
    EVENT_DETAILS.projectsSample = overrides.allProjects;
  }
  if (Array.isArray(overrides.safetyPillars) && overrides.safetyPillars.length > 0) {
    EVENT_DETAILS.safetyPillars = overrides.safetyPillars;
  }
  if (Array.isArray(overrides.parentFaqs) && overrides.parentFaqs.length > 0) {
    EVENT_DETAILS.parentFaqs = overrides.parentFaqs;
  } else if (Array.isArray(overrides.faq) && overrides.faq.length > 0) {
    EVENT_DETAILS.parentFaqs = overrides.faq;
  }
}

export function hydrateSiteCMSFromCloud(cloudMainPayload) {
  if (!cloudMainPayload || typeof cloudMainPayload !== 'object' || Object.keys(cloudMainPayload).length === 0) {
    return false;
  }
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(cloudMainPayload));
    }
    applySiteCMSOverrides(cloudMainPayload);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('abdaa-cms-updated', { detail: cloudMainPayload }));
    }
    return true;
  } catch (e) {
    console.warn('Cloud CMS hydrate warning:', e);
    return false;
  }
}

export function loadSiteCMSFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    applySiteCMSOverrides(parsed);
    return parsed;
  } catch (e) {
    console.warn('CMS load warning:', e);
    return null;
  }
}

export function saveSiteCMSOverrides(partialOverrides) {
  if (typeof window === 'undefined') return;
  try {
    const existingRaw = localStorage.getItem(CMS_STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    const merged = {
      ...existing,
      ...partialOverrides,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
    applySiteCMSOverrides(merged);
    window.dispatchEvent(new CustomEvent('abdaa-cms-updated', { detail: merged }));
    return merged;
  } catch (e) {
    console.error('CMS save error:', e);
    return null;
  }
}

export function resetSiteCMSOverrides() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CMS_STORAGE_KEY);
  const fresh = JSON.parse(JSON.stringify(DEFAULT_SNAPSHOT));
  applySiteCMSOverrides(fresh);
  window.dispatchEvent(new CustomEvent('abdaa-cms-updated', { detail: fresh }));
  return fresh;
}

const AUTH_SALT = 'abdaa-1001-masdar-sec-v4::';
export const CMS_USERS_STORAGE_KEY = 'abdaa_admin_users_hashed_v4';

// تنظيف أي مفاتيح قديمة كانت تحفظ كلمات مرور نصية في المتصفح
if (typeof window !== 'undefined') {
  try {
    ['abdaa_admin_users_v1', 'abdaa_admin_users_v2', 'abdaa_admin_users_v3', 'abdaa_admin_pin_v1'].forEach((k) =>
      localStorage.removeItem(k)
    );
  } catch {
    // ignore
  }
}

export async function hashPasswordSHA256(plainPassword) {
  const input = AUTH_SALT + String(plainPassword || '').trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getAdminPin() {
  return '';
}

export function setAdminPin() {
  // لم يعد يتم تخزين أي رمز PIN نصي في المتصفح
}

export const ADMIN_ROLES = [
  {
    id: 'super_admin',
    label: 'مدير عام كامل الصلاحيات (Super Admin)',
    allowedTabs: [
      'overview',
      'id_cards',
      'volunteers',
      'tickets',
      'batch2',
      'cms_general',
      'cms_story_tracks',
      'cms_partners',
      'cms_agenda',
      'cms_graduates',
      'cms_projects_mentors',
      'cms_gallery',
      'cms_faq_safety',
      'evaluations',
      'community',
      'users'
    ]
  },
  {
    id: 'reception',
    label: 'لجنة الاستقبال والتذاكر والهويات',
    allowedTabs: ['overview', 'id_cards', 'volunteers', 'tickets', 'batch2']
  },
  {
    id: 'media_cms',
    label: 'لجنة الإعلام وإدارة المحتوى',
    allowedTabs: [
      'overview',
      'id_cards',
      'volunteers',
      'cms_general',
      'cms_story_tracks',
      'cms_partners',
      'cms_agenda',
      'cms_graduates',
      'cms_gallery',
      'cms_faq_safety',
      'community'
    ]
  },
  {
    id: 'judging',
    label: 'لجنة التحكيم والمشاريع',
    allowedTabs: ['overview', 'cms_projects_mentors', 'evaluations']
  }
];

// تُحفظ فقط البصمة المشفرة (Salted SHA-256 Hash) ولا توجد أي كلمة مرور نصية في الكود المصدري
export const DEFAULT_ADMIN_USERS = [
  {
    id: 'usr-karrar',
    username: 'karrar',
    aliases: ['كرار', 'masdar', 'karrar'],
    passwordHash: '487447f94814426cd5622b86ec59d889afcf3a1a9ff72a6885815b1d5e9e97b6',
    fullName: 'كرار حساني جاسم — إدارة شركة المصدر',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-firas',
    username: 'firas',
    aliases: ['فراس', 'الاستاذ فراس', 'الأستاذ فراس', 'أ. فراس', 'admin', 'firas'],
    passwordHash: '062a98275e2c1fdaae05458c735287dd7de876e78ad93e459cf2ac55d98bc301',
    fullName: 'الأستاذ فراس نزار كريم — إدارة نادي أبدع',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-aliaa',
    username: 'aliaa',
    aliases: ['علياء', 'الدكتورة علياء', 'الدكتوره علياء', 'دكتورة علياء', 'د. علياء', 'aliaa'],
    passwordHash: '853a0fd06eb0acf0ee151c52c1f52a6c0713b9d5129c14db26794a9a29ddd790',
    fullName: 'الدكتورة علياء عبد الحسين لفتة — إدارة نادي أبدع',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-reception',
    username: 'reception',
    aliases: ['استقبال'],
    passwordHash: 'b62b8ddbe401e2fa5f0b27d36a90dc6e87c5638c8161bd46644a9d96bee3743f',
    fullName: 'فريق الاستقبال وتدقيق التذاكر',
    role: 'reception',
    roleLabel: 'لجنة الاستقبال والتذاكر والهويات'
  },
  {
    id: 'usr-media',
    username: 'media',
    aliases: ['اعلام', 'إعلام'],
    passwordHash: '8d52e68b9f8137a8036a7eca16ab4119d982028fef4c43c98854ca5f2094eeab',
    fullName: 'اللجنة الإعلامية وتحديث المحتوى',
    role: 'media_cms',
    roleLabel: 'لجنة الإعلام وإدارة المحتوى'
  },
  {
    id: 'usr-judge',
    username: 'judge',
    aliases: ['تحكيم'],
    passwordHash: '4ac295f439e73f8a4e0645054ea4727c8ccdb71e468abe3425f6f4f5f3ee82a2',
    fullName: 'اللجنة العلمية والتحكيم',
    role: 'judging',
    roleLabel: 'لجنة التحكيم والمشاريع'
  }
];

export function getAdminUsers() {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_USERS;
  try {
    const raw = localStorage.getItem(CMS_USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // التأكد من عدم حفظ أي حقل password نصي إطلاقاً
        return parsed.map(({ password: _unused, ...rest }) => rest);
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_ADMIN_USERS;
}

export function saveAdminUsers(usersList) {
  if (typeof window === 'undefined' || !Array.isArray(usersList)) return;
  const sanitized = usersList.map(({ password: _unused, ...rest }) => rest);
  localStorage.setItem(CMS_USERS_STORAGE_KEY, JSON.stringify(sanitized));
}

export async function authenticateAdminUser(usernameInput, passwordInput) {
  const uClean = String(usernameInput || '').trim().toLowerCase();
  const pClean = String(passwordInput || '').trim();
  if (!uClean || !pClean) return null;

  // 1. التحقق السحابي الأساسي عبر قاعدة بيانات Supabase (يدعم الحسابات المضافة وكلمات المرور المحدثة عبر جميع الأجهزة)
  const cloudAuth = await EventDB.authenticateUserCloud(uClean, pClean);
  if (cloudAuth.available) {
    return cloudAuth.ok ? cloudAuth.user : null;
  }

  // 2. بديل احتياطي عبر خادم Vercel (/api/admin-auth) في حال تعذر الوصول لـ Supabase
  try {
    const resp = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: uClean, password: pClean })
    });
    if (resp.status === 429) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || 'تم تجاوز عدد المحاولات المسموح بها. انتظر دقيقة.');
    }
    if (resp.ok) {
      const data = await resp.json();
      if (data?.ok && data?.user) return data.user;
    }
  } catch (err) {
    if (err?.message?.includes('تجاوز عدد المحاولات')) {
      throw err;
    }
  }

  // 3. التحقق المشفر محلياً بـ Salted SHA-256 كخيار أخير دون اتصال
  const users = getAdminUsers();
  const candidateHash = await hashPasswordSHA256(pClean);

  const matched = users.find((u) => {
    const uname = String(u.username || '').trim().toLowerCase();
    const aliases = Array.isArray(u.aliases) ? u.aliases.map((a) => String(a).trim().toLowerCase()) : [];
    const nameMatch =
      uname === uClean ||
      aliases.includes(uClean) ||
      (uname === 'karrar' && (uClean === 'كرار' || uClean === 'masdar')) ||
      (uname === 'firas' && (uClean === 'فراس' || uClean === 'admin'));
    const passMatch = Boolean(u.passwordHash) && u.passwordHash === candidateHash;
    return nameMatch && passMatch;
  });

  return matched || null;
}

// تحميل أي تعديلات محفوظة فور تشغيل الموقع
loadSiteCMSFromStorage();

