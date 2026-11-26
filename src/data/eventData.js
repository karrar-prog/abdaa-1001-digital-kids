import { GRADUATION_COHORTS, ALL_168_GRADUATES } from './cohortsData';
import { OFFICIAL_CHILDREN_PROJECTS } from './projectsData';
import { EventDB } from '../lib/supabase';

export const EVENT_DETAILS = {
  cohorts: GRADUATION_COHORTS,
  allGraduates: ALL_168_GRADUATES,
  title: "حفل تخرج الدفعة الأولى",
  subtitle: "مبادرة «1001» طفل رقمي",
  patronage: "برعاية فخامة رئيس الجمهورية",
  forumTitle: "ملتقى النجف للابتكار الرقمي",
  organization: "نادي أبدع للمهارات الذكية – النجف الأشرف",
  slogan: "نصنع جيلاً يبرمج المستقبل ... معاً",
  targetAgeRange: "للأطفال والناشئة من عمر 6 إلى 14 سنة",
  dateText: "الجمعة، 27 تشرين الثاني 2026",
  eventDateISO: "2026-11-27T15:00:00",
  time: "الساعة 03:00 عصراً (الوصول 2:00 ظهراً)",
  venue: "قصر الثقافة – النجف الأشرف",
  capacity: "+500 مقعد",
  rsvpClosed: true,
  rsvpClosedMessage: "اكتمل العدد المخصص لحجز مقاعد الزوار وتم إغلاق الاستمارة الإلكترونية بنجاح.",
  
  contact: {
    leadName: "فراس نزار كريم",
    phone: "07810746655",
    email: "abda3skills.info@gmail.com",
    address: "النجف الأشرف – جمهورية العراق"
  },

  stats: [
    { number: "896", label: "طفلاً تدربوا بالمبادرة", desc: "ضمن الفئة العمرية (6 – 14 سنة)" },
    { number: "700", label: "أتموا متطلبات التدريب", desc: "في كافة المحاور الأساسية" },
    { number: "172", label: "طفلاً متخرجاً نحتفي بهم", desc: "يمثلون نخبة الدفعة الأولى" },
    { number: String(OFFICIAL_CHILDREN_PROJECTS.length), label: "مشروعاً وابتكاراً حياً", desc: "يقدمها الأطفال بأنفسهم بالمعرض" },
    { number: "26", label: "مؤسساً وشريكاً ومدرباً", desc: "5 مؤسسين وشريك منظم و20 مدرباً متطوعاً" }
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
      title: "تجميع وبرمجة روبوتات الأطفال والدارات الذكية",
      category: "robotics",
      categoryLabel: "مختبرات الروبوت",
      image: "/campaign/kids-coding-lab.jpg",
      description: "أبطال مبادرة 1001 طفل رقمي أثناء تركيب الروبوتات وبرمجة الحساسات والمحركات داخل مختبرات نادي أبدع.",
      stats: "ورشة عملية مكثفة",
      color: "from-sky-500 to-blue-600"
    },
    {
      id: 2,
      title: "إشراف المدربين المتطوعين وتوجيه الفرق الطلابية",
      category: "teamwork",
      categoryLabel: "فرق العمل والابتكار",
      image: "/campaign/kids-mentors-workshop.jpg",
      description: "جلسات الإرشاد التقني المباشر بين المدربين المتطوعين والأطفال لتحويل الأفكار إلى نماذج حقيقية.",
      stats: "26 قائداً ومدرباً",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 3,
      title: "فرحة التخرج والتتويج في الدفعة الأولى",
      category: "stage",
      categoryLabel: "التقييم والجاهزية",
      image: "/campaign/kid-graduate-happy.jpg",
      description: "لحظات الفخر والتتويج لأبطال الدفعة الأولى الـ 172 بعد إتمام رحلة البرمجة والروبوت والذكاء الاصطناعي.",
      stats: "172 خريجاً بطلاً",
      color: "from-blue-600 to-indigo-700"
    },
    {
      id: 4,
      title: "تطبيق «المنقذ الرقمي» للأمان والسلامة المنزلية",
      category: "coding",
      categoryLabel: "البرمجة والخوارزميات",
      image: "/projects/prj-01.jpg",
      description: "تطبيق ويب عربي تفاعلي برمجه أحد أطفال الدفعة الأولى لتعليم الأطفال التصرف الآمن في المواقف الطارئة.",
      stats: "HTML / CSS / JS",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 5,
      title: "مشاريع الألعاب التفاعلية في بيئة سكراتش (Scratch)",
      category: "coding",
      categoryLabel: "البرمجة والخوارزميات",
      image: "/projects/prj-04.jpg",
      description: "ألعاب تعليمية وتفاعلية هادفة صممها الأطفال بأنفسهم لترسيخ التفكير المنطقي والرياضي.",
      stats: "إبداع برمجي حي",
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: 6,
      title: "مشروع الأردوينو — إشارة المرور الذكية",
      category: "robotics",
      categoryLabel: "مختبرات الروبوت",
      image: "/projects/prj-06.jpg",
      description: "نموذج هندسي ذكي بلوحة Arduino Uno لتنظيم حركة المرور وتقليل الازدحام في المدن الذكية.",
      stats: "Arduino + حساسات",
      color: "from-cyan-500 to-sky-600"
    },
    {
      id: 7,
      title: "روبوت «نبض الإنقاذ» الذكي للمساعدة في الطوارئ",
      category: "robotics",
      categoryLabel: "مختبرات الروبوت",
      image: "/projects/prj-13.jpg",
      description: "روبوت إنقاذ مزوّد بكاميرا وحساسات مسافة لمساندة فرق الإنقاذ في المواقع الصعبة.",
      stats: "ذكاء اصطناعي وروبوت",
      color: "from-rose-500 to-pink-600"
    },
    {
      id: 8,
      title: "معرض الـ 40 ابتكاراً حياً في قصر الثقافة",
      category: "stage",
      categoryLabel: "التقييم والجاهزية",
      image: "/projects/prj-02.jpg",
      description: "استعراض المشاريع الأربعين الحقيقية أمام العائلات ولجان التحكيم العلمية يوم الاحتفالية.",
      stats: "40 ابتكاراً طلابياً",
      color: "from-violet-600 to-purple-700"
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
    patronage: "برعاية فخامة رئيس الجمهورية",
    forumTitle: "ملتقى النجف للابتكار الرقمي",
    programTitle: "منهاج حفلة تخرج 1001 طفل رقمي",
    dateFull: "يوم الجمعة الموافق 27/11/2026",
    venueFull: "رحاب قصر الثقافة – النجف الأشرف",
    arrivalLabel: "استقبال العوائل وتجهيز البوثات واصطفاف الأطفال: 2:00 – 3:00 ظهراً",
    arrivalTime: "2:00 ظهراً",
    presidentArrivalTime: "3:00 عصراً",
    startTime: "3:00 عصراً",
    hallStartTime: "3:30 عصراً",
    endTime: "5:35 عصراً",
    totalDuration: "ساعتان و35 دقيقة",
    totalMinutes: 155,
    organizers: "المؤسس المنظم: نادي أبدع للمهارات الذكية  •  الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات",
    founderName: "الأستاذ فراس نزار كريم",
    founderRole: "مؤسس نادي أبدع ومبادرة 1001 طفل رقمي",
    partnerName: "الأستاذ كرار حساني",
    partnerRole: "الشريك المنظم والمدير التنفيذي لشركة المصدر"
  },

  agendaPhases: [
    {
      id: "reception",
      number: "01",
      label: "الفترة الأولى",
      title: "الاستقبال الرئاسي، الصورة، المعرض والمتحف",
      durationLabel: "30 دقيقة",
      durationMinutes: 30,
      timeRange: "3:00 – 3:30 عصراً",
      theme: "orange"
    },
    {
      id: "opening",
      number: "02",
      label: "الفترة الثانية",
      title: "الافتتاح الرسمي والكلمات البروتوكولية",
      durationLabel: "40 دقيقة",
      durationMinutes: 40,
      timeRange: "3:30 – 4:10 عصراً",
      theme: "royal"
    },
    {
      id: "initiative",
      number: "03",
      label: "الفترة الثالثة",
      title: "فقرات المبادرة والتكريم الرئاسي",
      durationLabel: "25 دقيقة",
      durationMinutes: 25,
      timeRange: "4:10 – 4:35 عصراً",
      theme: "sky"
    },
    {
      id: "honoring",
      number: "04",
      label: "الفترة الرابعة",
      title: "التكريم والتتويج",
      durationLabel: "55 دقيقة",
      durationMinutes: 55,
      timeRange: "4:35 – 5:30 عصراً",
      theme: "gold"
    },
    {
      id: "closing",
      number: "05",
      label: "الفترة الخامسة",
      title: "الختام وجولة العائلات",
      durationLabel: "5 دقائق",
      durationMinutes: 5,
      timeRange: "5:30 – 5:35 عصراً",
      theme: "emerald"
    }
  ],

  agenda: [
    // الفترة الأولى (الاستقبال الرئاسي، الصورة الجماعية، المعرض والمتحف) – 30 دقيقة (3:00 – 3:30)
    {
      id: "ag-1795521039288",
      phaseId: "reception",
      time: "3:00 – 3:03",
      duration: "3 دقائق",
      durationMinutes: 3,
      title: "استقبال فخامة رئيس الجمهورية من قبل الاخوين المؤسسين محمد ومريم والتعريف بنفسيهما لفخامة الرئيس وتقديم باقة الورد",
      speaker: "فخامة رئيس الجمهورية المحترم",
      description: "التعريف بنفسيهما لفخامة الرئيس محمد ومريم وتقديم باقة الورد",
      highlight: true,
      vip: true,
      iconType: "star"
    },
    {
      id: "ag-00",
      phaseId: "reception",
      time: "3:03 – 3:06",
      duration: "3 دقائق",
      durationMinutes: 3,
      title: "دعوة فخامة رئيس الجمهورية والتقاط صورة التخرج التذكارية الجماعية",
      speaker: "فخامة رئيس جمهورية العراق والوفد المرافق مع الأطفال واللجنة المنظمة",
      description: "يكون جدار ومنصة التصوير جاهزَين فور وصول فخامة الرئيس لالتقاط الصورة التذكارية الجماعية الأولى (مع تجهيز وتشغيل أجهزة البوثات مسبقاً قبل 2:45 ظهراً).",
      highlight: true,
      vip: true,
      iconType: "camera"
    },
    {
      id: "ag-00b",
      phaseId: "reception",
      time: "3:06 – 3:10",
      duration: "4 دقائق",
      durationMinutes: 4,
      title: "التفريع المنظّم للأطفال (مسار البوثات ومسار القاعة)",
      speaker: "فرق المدربين والمتطوعين (كل 5 أطفال مع مدرب أو متطوع مسؤول)",
      description: "أصحاب البوثات يتوجهون فوراً إلى بوثاتهم المجهّزة مسبقاً، وبقية الأطفال يتوجهون مع متابعيهم مباشرة إلى مقاعدهم المخصصة في قاعة الاحتفالات.",
      highlight: true,
      iconType: "users"
    },
    {
      id: "ag-00c",
      phaseId: "reception",
      time: "3:10 – 3:20",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "جولة فخامة رئيس الجمهورية والوفد المرافق في معرض مشاريع الأطفال",
      speaker: "فخامة رئيس الجمهورية والوفد الرسمي وأبطال معرض الابتكارات",
      description: "جولة ميدانية على أجنحة المشاريع البرمجية والروبوتية للأطفال والتقاط الصور التذكارية معهم أمام بوثاتهم.",
      highlight: true,
      vip: true,
      iconType: "sparkles"
    },
    {
      id: "ag-00d",
      phaseId: "reception",
      time: "3:20 – 3:30",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "زيارة الوفد الرئاسي للمتحف — وبالتوازي: نقل أصحاب البوثات للقاعة وتأمين المعرض",
      speaker: "الوفد المرافق (المتحف) • فرق المتطوعين (سحب البوثات للقاعة + حراسة الأجهزة)",
      description: "أثناء جولة الوفد في المتحف، يسحب كل مدرب/متطوع مجموعته (5 أطفال) من البوثات إلى صفوف أبطال المعرض المحجوزة داخل القاعة مع إبقاء فريق تأمين وحراسة البوثات.",
      highlight: true,
      iconType: "shield"
    },

    // الفترة الثانية (الافتتاح الرسمي والكلمات البروتوكولية داخل القاعة) – 40 دقيقة (3:30 – 4:10)
    {
      id: "ag-03",
      phaseId: "opening",
      time: "3:30 – 3:31",
      duration: "دقيقة واحدة",
      durationMinutes: 1,
      title: "السلام الجمهوري",
      speaker: "الحضور",
      description: "الوقوف لعزف السلام الجمهوري العراقي",
      iconType: "flag"
    },
    {
      id: "ag-01",
      phaseId: "opening",
      time: "3:31 – 3:34",
      duration: "3 دقائق",
      durationMinutes: 3,
      title: "تلاوة آيات من الذكر الحكيم",
      speaker: "القارئ: فادي الحسين علاء جميل اليساري",
      description: "القارئ: فادي الحسين علاء جميل اليساري — بدء المراسم الرسمية داخل قاعة الاحتفالات",
      iconType: "book"
    },
    {
      id: "ag-03b",
      phaseId: "opening",
      time: "3:34 – 3:36",
      duration: "دقيقتان",
      durationMinutes: 2,
      title: "قراءة سورة الفاتحة على أرواح شهداء العراق",
      speaker: "الحضور",
      description: "قراءة سورة الفاتحة ترحماً على أرواح شهداء العراق الأبرار",
      iconType: "book"
    },
    {
      id: "ag-02",
      phaseId: "opening",
      time: "3:36 – 3:41",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة الافتتاح",
      speaker: "عريف الحفل",
      description: "عريف الحفل",
      iconType: "mic"
    },
    {
      id: "ag-06",
      phaseId: "opening",
      time: "3:41 – 3:46",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة المؤسس — الأستاذ فراس نزار كريم",
      speaker: "مؤسس نادي أبدع ومبادرة 1001 طفل رقمي (المؤسس المنظم)",
      description: "الأستاذ فراس نزار كريم — مؤسس نادي أبدع ومبادرة 1001 طفل رقمي",
      highlight: true,
      iconType: "sparkles"
    },
    {
      id: "ag-05",
      phaseId: "opening",
      time: "3:46 – 3:51",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة فخامة رئيس جمهورية العراق",
      speaker: "الدكتور نزار محمد سعيد",
      description: "الدكتور نزار محمد سعيد",
      highlight: true,
      vip: true,
      iconType: "crown"
    },
    {
      id: "ag-04",
      phaseId: "opening",
      time: "3:51 – 3:56",
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
      id: "ag-04b",
      phaseId: "opening",
      time: "3:56 – 4:00",
      duration: "4 دقائق",
      durationMinutes: 4,
      title: "كلمة السيد رئيس مجلس محافظة النجف الأشرف",
      speaker: "الدكتور حسين وحيد عبود العيساوي",
      description: "السيد رئيس مجلس محافظة النجف الأشرف — الدكتور حسين وحيد عبود العيساوي",
      highlight: true,
      vip: true,
      iconType: "landmark"
    },
    {
      id: "ag-04c",
      phaseId: "opening",
      time: "4:00 – 4:05",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة نقيب المبرمجين العراقيين",
      speaker: "الأستاذ أثير القيسي",
      description: "نقيب المبرمجين العراقيين — الأستاذ أثير القيسي",
      highlight: true,
      vip: true,
      iconType: "award"
    },
    {
      id: "ag-08",
      phaseId: "opening",
      time: "4:05 – 4:10",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "كلمة ممثل شركاء النجاح",
      speaker: "الأستاذ كرار حساني — المدير التنفيذي لشركة المصدر لتكنولوجيا المعلومات",
      description: "الشريك المنظم لمبادرة 1001 طفل رقمي والمدير التنفيذي لشركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات",
      highlight: true,
      vip: true,
      iconType: "award"
    },

    // الفترة الثالثة (فقرات المبادرة والتكريم الرئاسي) – 25 دقيقة (4:10 – 4:35)
    {
      id: "ag-07",
      phaseId: "initiative",
      time: "4:10 – 4:25",
      duration: "15 دقيقة",
      durationMinutes: 15,
      title: "فقرة أبطال المبادرة (مريم ومحمد فراس نزار) وعرض الفيديو التوثيقي لرحلة الأطفال",
      speaker: "مريم فراس نزار ومحمد فراس نزار (مؤسسا ومدربان في نادي أبدع) • عرض مرئي توثيقي",
      description: "فقرة مدمجة في موقع فقرة مريم تجمع تقديم مريم ومحمد فراس نزار وعرض الفيديو التوثيقي لرحلة أطفال مبادرة 1001 طفل رقمي",
      highlight: true,
      iconType: "film"
    },
    {
      id: "ag-07b",
      phaseId: "initiative",
      time: "4:25 – 4:35",
      duration: "10 دقائق",
      durationMinutes: 10,
      title: "اهداء درع تذكاري لفخامة رئيس جمهورية العراق والتكريم من قبل فخامته لـ (12) طلبة متميزين من أبطال المبادرة",
      speaker: "فخامة رئيس جمهورية العراق الدكتور نزار محمد سعيد",
      description: "اهداء درع تذكاري لفخامة رئيس الجمهورية وتكريم رئاسي رمزي على المسرح لاثني عشر طالباً متميزاً من خريجي الدفعة الأولى لمبادرة 1001 طفل رقمي",
      highlight: true,
      vip: true,
      iconType: "crown"
    },

    // الفترة الرابعة (التكريم والتتويج) – 55 دقيقة (4:35 – 5:30)
    {
      id: "ag-11",
      phaseId: "honoring",
      time: "4:35 – 5:05",
      duration: "30 دقيقة",
      durationMinutes: 30,
      title: "استكمال تقديم الشهادات والدروع للأطفال الخريجين",
      speaker: "تتويج خريجي الدفعة الأولى لمبادرة 1001 طفل رقمي (175 خريجاً)",
      description: "استكمال تقديم الشهادات والدروع للأطفال الخريجين — الدفعة الأولى (175 خريجاً)",
      highlight: true,
      iconType: "graduation"
    },
    {
      id: "ag-12",
      phaseId: "honoring",
      time: "5:05 – 5:15",
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
      time: "5:15 – 5:25",
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
      time: "5:25 – 5:30",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "شكر والتقاط صور جماعية للمتطوعين",
      speaker: "الأستاذ فراس نزار كريم",
      description: "الأستاذ فراس نزار كريم",
      iconType: "heart"
    },

    // الفترة الخامسة (الختام وجولة العائلات) – 5 دقائق (5:30 – 5:35)
    {
      id: "ag-15",
      phaseId: "closing",
      time: "5:30 – 5:35",
      duration: "5 دقائق",
      durationMinutes: 5,
      title: "الختام والتقاط الصور التذكارية وفتح معرض المشاريع للعائلات والضيوف",
      speaker: "عريف الحفل وفريق تنظيم المعرض",
      description: "اختتام الحفل الرسمي وإعادة فتح أبواب معرض مشاريع الأطفال لتجول العائلات والضيوف واستلام الأطفال أجهزتهم بأمان.",
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
      a: "تُسلّم حافظة الشهادات الثلاث مع بطاقة الخريج المزودة برمز التحقق الرسمي ودرع التخرج مباشرة على مسرح قصر الثقافة أثناء فقرة تكريم الخريجين الـ 172 (مقسمين إلى 10 مجموعات منظمة)، كما يمكن طباعة النسخة الرقمية فوراً من الموقع."
    },
    {
      q: "كيف يمكنني تسجيل طفلي في الدفعة الثانية القادمة من المبادرة؟",
      a: "سيتم فتح باب التسجيل للدفعة الثانية عقب احتفالية تخرج الدفعة الأولى مباشرة، ويمكن لأولياء الأمور حجز مقعد حضور في الحفل الآن للاطلاع الحي على مشاريع الأطفال والتسجيل الميداني."
    }
  ],

  // المؤسس المنظم والشريك المنظم للمبادرة (نادي أبدع + شركة المصدر)
  strategicPartners: [
    {
      name: "نادي أبدع للمهارات الذكية",
      role: "المؤسس المنظم للمبادرة",
      desc: "الحاضنة التعليمية والتدريبية لمبادرة «1001» طفل رقمي لتأهيل الأطفال والناشئة (6 – 14 سنة) في البرمجة والروبوتات والذكاء الاصطناعي في النجف الأشرف.",
      logo: "/brand/abdaa-logo.png",
      badge: "المؤسس المنظم"
    },
    {
      name: "شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات",
      role: "الشريك المنظم للمبادرة",
      desc: "الشريك المنظم لمبادرة «1001» طفل رقمي والداعم التقني والبرمجي للاحتفالية.",
      logo: "/brand/masdar-logo-full-clean.png",
      badge: "الشريك المنظم"
    }
  ],

  // الرعاة والداعمون للاحتفالية (الرعاة الأساسيون الثلاثة: مجمع الأميرات، شركة الغدير، مجموعة الياسر؛ وتليهم مباشرةً مدارس سما العراق وباقي الرعاة)
  partners: [
    { 
      name: "مجمع الأميرات السكني", 
      role: "راعٍ رئيسي وداعم",
      logo: "/sponsors/alameerat.png",
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
      name: "مجموعة شركات ياسر حلاوة", 
      role: "راعٍ رئيسي وداعم",
      logo: "/sponsors/yasser_group.png",
      featured: true,
      highlight: true
    },
    { 
      name: "مدارس سما العراق", 
      role: "راعٍ تعليمي داعم",
      logo: "/sponsors/sama_schools.jpg",
      highlight: true
    },
    { 
      name: "وزارة الاقتصاد الرقمي والحوكمة", 
      role: "راعٍ حكومي ورقمي",
      logo: "/sponsors/modeg_ministry.jpg",
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
      name: "شريف — شاورما وفروج", 
      role: "راعٍ ضيافة وداعم",
      logo: "/sponsors/sharif_shawarma.jpg",
      highlight: false
    },
    { 
      name: "الزبيدي كروب لأزياء التخرج", 
      role: "راعٍ داعم لأزياء التخرج",
      logo: "/sponsors/alzubaidi_group.jpg",
      highlight: false
    }
  ]
};

// ========================================================
// منظومة إدارة المحتوى الحية (Live CMS Layer)
// تتيح تعديل بيانات الموقع بالكامل من لوحة التحكم وحفظها محلياً وسحابياً
// ========================================================
EVENT_DETAILS.allProjects = EVENT_DETAILS.projectsSample;

export const CMS_STORAGE_KEY = 'abdaa_site_cms_v28';
export const CMS_PIN_STORAGE_KEY = 'abdaa_admin_pin_v1';

// إزالة مفاتيح النسخ القديمة لضمان تحميل السجل الرسمي ومشاريع الأطفال الحقيقية المعتمدة
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('abdaa_site_cms_v1');
    localStorage.removeItem('abdaa_site_cms_v2');
    localStorage.removeItem('abdaa_site_cms_v3');
    localStorage.removeItem('abdaa_site_cms_v4');
    localStorage.removeItem('abdaa_site_cms_v5');
    localStorage.removeItem('abdaa_site_cms_v6');
    localStorage.removeItem('abdaa_site_cms_v7');
    localStorage.removeItem('abdaa_site_cms_v8');
    localStorage.removeItem('abdaa_site_cms_v9');
    localStorage.removeItem('abdaa_site_cms_v10');
    localStorage.removeItem('abdaa_site_cms_v11');
    localStorage.removeItem('abdaa_site_cms_v12');
    localStorage.removeItem('abdaa_site_cms_v13');
    localStorage.removeItem('abdaa_site_cms_v14');
    localStorage.removeItem('abdaa_site_cms_v15');
    localStorage.removeItem('abdaa_site_cms_v16');
    localStorage.removeItem('abdaa_site_cms_v17');
    localStorage.removeItem('abdaa_site_cms_v18');
    localStorage.removeItem('abdaa_site_cms_v19');
    localStorage.removeItem('abdaa_site_cms_v20');
    localStorage.removeItem('abdaa_site_cms_v21');
    localStorage.removeItem('abdaa_site_cms_v22');
    localStorage.removeItem('abdaa_site_cms_v23');
    localStorage.removeItem('abdaa_site_cms_v24');
    localStorage.removeItem('abdaa_site_cms_v25');
    localStorage.removeItem('abdaa_site_cms_v26');
    localStorage.removeItem('abdaa_site_cms_v27');
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
  rsvpClosed: EVENT_DETAILS.rsvpClosed,
  rsvpClosedMessage: EVENT_DETAILS.rsvpClosedMessage,
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
    'capacity',
    'rsvpClosed',
    'rsvpClosedMessage'
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
    const mergedPartners = overrides.partners.map((p) => ({ ...p }));
    const partnersUpdatedAtMs = Date.parse(overrides.partnersUpdatedAt || '');
    const defaultMerges = [
      { logo: '/sponsors/sharif_shawarma.jpg', keyword: 'شريف', releaseIso: '2026-11-25T17:50:00.000Z' },
      { logo: '/sponsors/alzubaidi_group.jpg', keyword: 'الزبيدي', releaseIso: '2026-11-25T21:20:00.000Z' }
    ];
    defaultMerges.forEach(({ logo, keyword, releaseIso }) => {
      const releaseMs = Date.parse(releaseIso);
      const isPreRelease = !Number.isFinite(partnersUpdatedAtMs) || partnersUpdatedAtMs < releaseMs;
      const alreadyPresent = mergedPartners.some(
        (p) => p?.logo === logo || String(p?.name || '').includes(keyword)
      );
      if (isPreRelease && !alreadyPresent) {
        const def = DEFAULT_SNAPSHOT.partners.find((p) => p.logo === logo);
        if (def) mergedPartners.push({ ...def });
      }
    });
    EVENT_DETAILS.partners = mergedPartners;
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
  if (Array.isArray(overrides.fieldSupervisorGroups)) {
    EVENT_DETAILS.fieldSupervisorGroups = overrides.fieldSupervisorGroups;
  }
  if (overrides.childFamiliesMap && typeof overrides.childFamiliesMap === 'object') {
    EVENT_DETAILS.childFamiliesMap = overrides.childFamiliesMap;
  }
  if (Array.isArray(overrides.honoringBatches)) {
    EVENT_DETAILS.honoringBatches = overrides.honoringBatches;
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
    const nowIso = new Date().toISOString();
    const merged = {
      ...existing,
      ...partialOverrides,
      partners:
        Array.isArray(partialOverrides?.partners) && partialOverrides.partners.length > 0
          ? partialOverrides.partners
          : Array.isArray(EVENT_DETAILS.partners) && EVENT_DETAILS.partners.length > 0
          ? EVENT_DETAILS.partners
          : existing.partners,
      ...(Array.isArray(partialOverrides?.partners) ? { partnersUpdatedAt: nowIso } : {}),
      updatedAt: nowIso
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
      'field_groups',
      'invitations',
      'campaign',
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
    allowedTabs: ['overview', 'field_groups', 'invitations', 'id_cards', 'volunteers', 'tickets', 'batch2']
  },
  {
    id: 'media_cms',
    label: 'لجنة الإعلام وإدارة المحتوى',
    allowedTabs: [
      'overview',
      'field_groups',
      'invitations',
      'campaign',
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
  },
  {
    id: 'viewer_print',
    label: 'مشاهدة وطباعة فقط (قراءة فقط)',
    readOnly: true,
    allowedTabs: [
      'overview',
      'field_groups',
      'cms_graduates',
      'id_cards',
      'invitations',
      'campaign',
      'cms_projects_mentors',
      'tickets',
      'volunteers',
      'batch2',
      'evaluations',
      'community'
    ]
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
    id: 'usr-manar',
    username: 'manar',
    aliases: ['منار', 'الست منار', 'أستاذة منار', 'manar'],
    passwordHash: '550f8fee3be3cf2e9b5a28b20c9613baae3a0b40764d95fa3615517b9b15ea53',
    fullName: 'منار — إدارة نادي أبدع ومبادرة 1001 طفل رقمي',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-zahraa',
    username: 'zahraa',
    aliases: ['زهراء', 'الست زهراء', 'أستاذة زهراء', 'zahraa'],
    passwordHash: '7adeeae630b83f99c03df6bed445249211a87184544c153de4c9360e572b3ea1',
    fullName: 'زهراء — صلاحية المشاهدة والطباعة فقط',
    role: 'viewer_print',
    roleLabel: 'مشاهدة وطباعة فقط (قراءة فقط)'
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

