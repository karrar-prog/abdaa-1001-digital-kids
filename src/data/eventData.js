import { EXTRA_EXHIBITION_PROJECTS, GRADUATION_COHORTS, ALL_170_GRADUATES } from './cohortsData';

export const EVENT_DETAILS = {
  cohorts: GRADUATION_COHORTS,
  allGraduates: ALL_170_GRADUATES,
  title: "حفل تخرج الدفعة الأولى",
  subtitle: "مبادرة «1001» طفل رقمي",
  organization: "نادي أبدع للمهارات الذكية – النجف الأشرف",
  slogan: "نصنع جيلاً يبرمج المستقبل ... معاً",
  targetAgeRange: "للأطفال والناشئة من عمر 7 إلى 14 سنة",
  dateText: "الجمعة، تشرين الثاني 2026",
  eventDateISO: "2026-11-27T15:00:00",
  time: "الساعة 03:00 بعد الظهر",
  venue: "قصر الثقافة – النجف الأشرف",
  capacity: "+500 مقعد",
  
  contact: {
    leadName: "فراس نزار كريم",
    phone: "07810746655",
    email: "abda3skills.info@gmail.com",
    address: "النجف الأشرف – جمهورية العراق"
  },

  stats: [
    { number: "896", label: "طفلاً تدربوا بالمبادرة", desc: "ضمن الفئة العمرية (7 – 14 سنة)" },
    { number: "700", label: "أتموا متطلبات التدريب", desc: "في كافة المحاور الأساسية" },
    { number: "170", label: "طفلاً متخرجاً نحتفي بهم", desc: "يمثلون نخبة الدفعة الأولى" },
    { number: "40", label: "مشروعاً وابتكاراً حياً", desc: "يقدمها الأطفال بأنفسهم بالمعرض" },
    { number: "20", label: "مدرباً يتم تكريمهم", desc: "تقديراً لجهودهم التعليمية والتطوعية" }
  ],

  founders: {
    names: "مريم ومحمد فراس نزار",
    title: "مؤسسو الإلهام وأبطال العرب في الابتكار",
    badge: "المركز الأول عربياً (2024 - 2026)",
    story: "انطلق نادي أبدع في 10-10-2025 من قصة شغف طفلين موهوبين، تحولت المنافسات العلمية إلى مشروع تعليمي ومجتمعي يهدف لاكتشاف مواهب الأطفال في العراق (من عمر 7 إلى 14 سنة)، وتوجت إنجازاتهم بالفوز بالمركز الأول في مسابقة الابتكار المتقدم بالبطولة العربية للروبوت والذكاء الاصطناعي لثلاث سنوات متتالية."
  },

  // هيكلة المراحل العمرية المعتمدة (7 إلى 14 سنة) - تمنح رصانة أكاديمية عالية لأولياء الأمور والجهات الرسمية
  ageStages: [
    {
      id: "stage-7-9",
      ageBadge: "7 – 9 سنوات",
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
      ageTarget: "7 – 14 سنة",
      color: "from-blue-500 to-indigo-600",
      description: "تنمية التفكير المنطقي ومهارات كتابة الشيفرات البرمجية وبناء تطبيقات الويب والألعاب التعليمية الذكية.",
      icon: "Code2"
    },
    {
      id: "robotics",
      name: "تصميم وبرمجة الروبوتات",
      tag: "Robotics",
      ageTarget: "7 – 14 سنة",
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
    { title: "جودة البناء البرمجي والهندسي (حسب الفئة 7–14)", score: "25 درجة", pct: "100%" },
    { title: "الأثر المجتمعي وحل المشكلة الواقعية", score: "20 درجة", pct: "85%" },
    { title: "كفاءة عمل النموذج الأولي الحي في الجناح", score: "15 درجة", pct: "80%" },
    { title: "مهارات العرض والثقة والحوار العلمي للطفل", score: "15 درجة", pct: "80%" }
  ],

  agenda: [
    {
      time: "2:00 - 2:50 م",
      title: "استقبال الضيوف وافتتاح المعرض الابتكاري",
      description: "استقبال عائلات الأطفال والشخصيات الرسمية، والاطلاع على أجنحة 40 مشروعاً يقدمها الأطفال (7–14 سنة) بأنفسهم.",
      highlight: true
    },
    {
      time: "3:00 م",
      title: "الافتتاح الرسمي والنشيد الوطني العراقي",
      description: "انطلاق مراسم الحفل الرسمي والترحيب بالحضور وقراءة سورة الفاتحة على أرواح شهداء العراق."
    },
    {
      time: "3:08 م",
      title: "عرض فيلم «قصة أبدع»",
      description: "فيلم وثائقي يستعرض رحلة مبادرة 1001 طفل رقمي منذ الانطلاقة وحتى الوصول لمنصة التتويج."
    },
    {
      time: "3:15 م",
      title: "كلمة إدارة نادي أبدع والجهات الراعية",
      description: "استعراض الأثر المجتمعي ورسالة النادي في الاستثمار بعقول الأطفال والمواهب العراقية."
    },
    {
      time: "3:30 م",
      title: "جلسة حوارية: «من طفل يتعلم إلى طفل يعلّم»",
      description: "حوار ملهم مع محمد ومريم فراس نزار حول قصة تحول الشغف بالبرمجة إلى تعليم أقرانهم ونقل المعرفة."
    },
    {
      time: "3:40 م",
      title: "الفقرة الابتكارية: «المستقبل بأيدينا»",
      description: "عروض تفاعلية حية على المسرح لمشاريع الأطفال في الروبوتات والذكاء الاصطناعي."
    },
    {
      time: "3:50 م",
      title: "مراسم تكريم الخريجين الـ 170 (10 مجموعات)",
      description: "تسليم دروع التخرج وبطاقات الخريج الذكية وحافظات الشهادات الثلاث للأطفال المتخرجين بحضور عائلاتهم."
    },
    {
      time: "4:40 م",
      title: "تكريم المدربين وشركاء النجاح والقرعة التفاعلية",
      description: "تكريم 20 مدرباً متطوعاً والدروع التقديرية للجهات الراعية وإجراء السحب التفاعلي المباشر."
    },
    {
      time: "4:55 م",
      title: "الختام والصور التذكارية وجولة المعرض",
      description: "التقاط الصور التذكارية الختامية واستكمال زيارة معرض ابتكارات الأطفال والتغطية الإعلامية."
    }
  ],

  projectsSample: [
    {
      id: 1,
      code: "ABD-PRJ-01",
      title: "روبوت ذكي لإرشاد زوار الأماكن التراثية",
      track: "Robotics",
      ageGroup: "10-11",
      ageLabel: "فئة 10 – 11 سنة",
      prototype: "روبوت ناطق + ملاحة ذاتية",
      iconType: "robot",
      techTags: ["Arduino Uno", "Ultrasonic", "MP3 Audio Mod"],
      badge: "نموذج فيزيائي حي",
      students: "مجموعة الأبطال (أعمار 10–11 سنة)",
      desc: "روبوت متحرك بنظام توجيه ذاتي ومستشعرات للمسافات يقوم بالحديث وشرح المعالم للزوار باللغة العربية بطلاقة.",
      problem: "حاجة الزوار والسياح في المعالم التراثية والثقافية إلى مرشد تفاعلي يقدم المعلومات التاريخية بطريقة شيقة.",
      solution: "بناء روبوت ذاتي الحركة يتوقف تلقائياً أمام الزائر ويشغل تسجيلاً صوتياً تعريفياً بالمكان مع شاشة تفاعلية.",
      impact: "تعزيز السياحة الثقافية في النجف الأشرف بابتكار طلابي محلي الصنع.",
      score: 96,
      votes: 142
    },
    {
      id: 2,
      code: "ABD-PRJ-02",
      title: "نظام تصنيف وتدوير النفايات بالرؤية الحاسوبية",
      track: "Artificial Intelligence",
      ageGroup: "12-14",
      ageLabel: "فئة 12 – 14 سنة",
      prototype: "كاميرا AI ذكية + ذراع فرز",
      iconType: "ai-vision",
      techTags: ["Python", "YOLO v8", "OpenCV"],
      badge: "رؤية حاسوبية فائقة",
      students: "فريق الإبداع الأخضر (أعمار 12–14 سنة)",
      desc: "كاميرا ذكية مدمجة مع نموذج ذكاء اصطناعي للتعرف على نوع العبوة (بلاستيك، ورق، معادن) وتوجيهها آلياً لسلة التدوير.",
      problem: "صعوبة فرز النفايات القابلة لإعادة التدوير في المدارس والأماكن العامة يدوياً.",
      solution: "تطوير نموذج رؤية حاسوبية يتعرف على المادة خلال أجزاء من الثانية ويحرك بوابة الفرز تلقائياً.",
      impact: "رفع الوعي البيئي في المدارس وتحقيق فرز دقيق بنسبة تتجاوز 92%.",
      score: 98,
      votes: 168
    },
    {
      id: 3,
      code: "ABD-PRJ-03",
      title: "تطبيق منصة تعليمية تفاعلية للأقران",
      track: "Programming",
      ageGroup: "10-11",
      ageLabel: "فئة 10 – 11 سنة",
      prototype: "تطبيق ويب تفاعلي للأطفال",
      iconType: "code-screen",
      techTags: ["React.js", "JavaScript", "Tailwind"],
      badge: "تطبيق ويب سحابي",
      students: "مريم ونخبة من المبرمجين الصغار (10–12 سنة)",
      desc: "تطبيق ويب تفاعلي يوفر تحديات برمجية وألعاب منطقية تساعد الأطفال الصغار على تعلم كتابة الكود والتفكير البرمجي.",
      problem: "ندرة المنصات العربية المبسطة التي تشرح البرمجة للأطفال بأسلوب يناسب بيئتهم وأعمارهم.",
      solution: "تصميم منصة عربية تفاعلية تحتوي على مستويات متدرجة ونقاط تحفيزية بإشراف الأطفال أنفسهم.",
      impact: "تمكين مئات الأطفال من تعلم أساسيات الخوارزميات من المنزل مجاناً.",
      score: 95,
      votes: 134
    },
    {
      id: 4,
      code: "ABD-PRJ-04",
      title: "حارس كلمة المرور والأمان الرقمي للأطفال",
      track: "Cybersecurity",
      ageGroup: "7-9",
      ageLabel: "فئة 7 – 9 سنوات",
      prototype: "درع الأمان الرقمي والتوعية",
      iconType: "security",
      techTags: ["Cryptography", "Scratch & Python", "Security Quiz"],
      badge: "أمان سيبراني للأطفال",
      students: "فريق الأمان الرقمي (أعمار 8–9 سنوات)",
      desc: "برنامج يفحص قوة كلمات المرور ويعطي نصائح توعوية مبسطة بالرسوم لحماية الحسابات من التصيد والاختراق.",
      problem: "استخدام الأطفال لكلمات مرور ضعيفة أو مشاركة بياناتهم الشخصية في الألعاب الإلكترونية.",
      solution: "أداة رسومية تفاعلية تختبر كلمة المرور وتدرب الطفل عبر مواقف تمثيلية على كشف الروابط المزيفة.",
      impact: "حماية الأطفال من مخاطر التنمر الإلكتروني واختراق الحسابات.",
      score: 93,
      votes: 119
    },
    {
      id: 5,
      code: "ABD-PRJ-05",
      title: "سيارة الإنقاذ الذاتية القيادة",
      track: "Robotics",
      ageGroup: "12-14",
      ageLabel: "فئة 12 – 14 سنة",
      prototype: "مركبة ذكية لتخطي العقبات",
      iconType: "rover",
      techTags: ["ESP32-CAM", "Sensors", "WiFi Direct"],
      badge: "مركبة ذاتية القيادة",
      students: "فريق الروبوتات المتقدمة (أعمار 13–14 سنة)",
      desc: "نموذج سيارة بمستشعرات فوق صوتية لتجاوز العقبات ونظام بث مباشر عبر الـ Wi-Fi للمناطق الوعرة والخطرة.",
      problem: "خطورة دخول فرق الإنقاذ إلى الأماكن الضيقة أو المتضررة قبل استكشافها.",
      solution: "مركبة استطلاع مصغرة مزودة بكاميرا بث حي وحساسات مسافة وغازات ترسل البيانات لاسلكياً.",
      impact: "نموذج تطبيقي واعد يدعم مفاهيم السلامة المدنية والروبوتات الميدانية.",
      score: 97,
      votes: 151
    },
    {
      id: 6,
      code: "ABD-PRJ-06",
      title: "مساعد الترجمة للغة الإشارة بالذكاء الاصطناعي",
      track: "Artificial Intelligence",
      ageGroup: "12-14",
      ageLabel: "فئة 12 – 14 سنة",
      prototype: "مترجم إيماءات فوري للصم والبكم",
      iconType: "sign-lang",
      techTags: ["MediaPipe AI", "TTS Engine", "Python"],
      badge: "خدمة إنسانية ومجتمعية",
      students: "فريق الأمل التكنولوجي (أعمار 12–14 سنة)",
      desc: "نظام يتعرف على حركات اليد ويترجمها إلى نصوص وأصوات مسموعة لدعم أقرانهم الصم والبكم ودمجهم بالمجتمع.",
      problem: "صعوبة تواصل الأطفال من ذوي الإعاقة السمعية مع أقرانهم في المدارس والأماكن العامة.",
      solution: "توظيف تقنية تتبع مفاصل اليد بالذكاء الاصطناعي لتحويل الإشارات إلى صوت عربي فوري.",
      impact: "دمج شريحة الصم والبكم في البيئة التعليمية بابتكار إنساني مؤثر.",
      score: 99,
      votes: 189
    },
    {
      id: 7,
      code: "ABD-PRJ-07",
      title: "نظام ري ذكي موفر للمياه عبر إنترنت الأشياء",
      track: "Robotics",
      ageGroup: "10-11",
      ageLabel: "فئة 10 – 11 سنة",
      prototype: "شبكة حساسات IoT وتحكم آلي",
      iconType: "iot",
      techTags: ["NodeMCU", "Soil Sensors", "Cloud Relay"],
      badge: "إنترنت الأشياء IoT",
      students: "مبتكرو النجف الصغار (أعمار 10–11 سنة)",
      desc: "حساسات رطوبة تربة مرتبطة بمضخة تحكم ذكية تعمل تلقائياً حسب حاجة النبات الفعلية لتقليل الهدر المائي.",
      problem: "هدر المياه في الحدائق المدرسية والمنزلية بسبب السقي العشوائي غير المرتبط برطوبة التربة.",
      solution: "منظومة استشعار ذكية تقيس رطوبة التربة والحرارة وتتحكم بالمضخة آلياً مع تنبيهات للهاتف.",
      impact: "توفير أكثر من 40% من استهلاك المياه في الحدائق التعليمية.",
      score: 94,
      votes: 127
    },
    {
      id: 8,
      code: "ABD-PRJ-08",
      title: "لعبة مغامرات الخوارزميات والرياضيات الذكية",
      track: "Programming",
      ageGroup: "7-9",
      ageLabel: "فئة 7 – 9 سنوات",
      prototype: "لعبة خوارزميات تعليمية 2D",
      iconType: "gamepad",
      techTags: ["Scratch 3.0", "Logic Blocks", "Physics"],
      badge: "ابتكار فئة 7–9 سنوات",
      students: "فريق مطوري الألعاب الصغار (أعمار 7–9 سنوات)",
      desc: "لعبة ثنائية الأبعاد مبرمجة بالكامل بواسطة الأطفال لتعليم التفكير المنطقي وحل المسائل الهندسية بأسلوب مشوق.",
      problem: "شعور بعض الأطفال بالملل من الطرق التقليدية في تعلم جدول الضرب والمسائل المنطقية.",
      solution: "بناء لعبة مغامرات تفاعلية لا يفتح فيها اللاعب البوابات إلا بعد حل اللغز الرياضي والمنطقي.",
      impact: "تحويل أوقات اللعب إلى تعلم مثمر وممتع للأطفال من عمر 7 سنوات.",
      score: 94,
      votes: 138
    },
    ...EXTRA_EXHIBITION_PROJECTS
  ],

  // ميثاق الأمان الرقمي والبيئة التربوية الحاضنة (يخاطب أولياء الأمور والجهات التربوية)
  safetyPillars: [
    {
      title: "بيئة تربوية آمنة 100% ومشرفون مختصون",
      desc: "تُقام جميع الورش التدريبية بإشراف مباشر من أساتذة ومدربين معتمدين وتربويين يراعون الفروق الفردية والنفسية للأطفال (7–14 سنة)."
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
      a: "تستهدف المبادرة الأطفال والناشئة من عمر 7 سنوات إلى 14 سنة، حيث يتم توزيعهم علمياً إلى 3 مراحل عمرية (7–9 سنوات، 10–11 سنة، 12–14 سنة) لضمان توافق المنهج البرمجي والهندسي مع قدرات الطفل الذهنية."
    },
    {
      q: "هل يشترط أن يمتلك الطفل خبرة سابقة في البرمجة أو حاسوباً محمولاً خاصاً؟",
      a: "لا يشترط أي خبرة سابقة؛ فالمسارات تبدأ من التأسيس المنطقي المبسط وتتدرج حتى بناء المشاريع المتقدمة، كما يوفر النادي بالتعاون مع الجهات الداعمة المستلزمات والحقائب التدريبية والروبوتات خلال الورش."
    },
    {
      q: "كيف يتم استلام بطاقة الخريج البلاستيكية والشهادات الثلاث في الحفل؟",
      a: "تُسلّم حافظة الشهادات الثلاث مع بطاقة الخريج المزودة برمز التحقق الرسمي ودرع التخرج مباشرة على مسرح قصر الثقافة أثناء فقرة تكريم الخريجين الـ 170 (مقسمين إلى 10 مجموعات منظمة)، كما يمكن طباعة النسخة الرقمية فوراً من الموقع."
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
      desc: "الحاضنة التعليمية والتدريبية لمبادرة «1001» طفل رقمي لتأهيل الأطفال والناشئة (7 – 14 سنة) في البرمجة والروبوتات والذكاء الاصطناعي في النجف الأشرف.",
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
export const CMS_STORAGE_KEY = 'abdaa_site_cms_v1';
export const CMS_PIN_STORAGE_KEY = 'abdaa_admin_pin_v1';

const DEFAULT_SNAPSHOT = JSON.parse(JSON.stringify({
  title: EVENT_DETAILS.title,
  subtitle: EVENT_DETAILS.subtitle,
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
  strategicPartners: EVENT_DETAILS.strategicPartners,
  partners: EVENT_DETAILS.partners,
  agenda: EVENT_DETAILS.agenda,
  cohorts: EVENT_DETAILS.cohorts,
  allProjects: EVENT_DETAILS.allProjects,
  faq: EVENT_DETAILS.faq
}));

export function rebuildAllGraduatesFromCohorts(cohortsList) {
  let globalIndex = 1;
  return (cohortsList || []).flatMap((cohort) =>
    (cohort.students || []).map((student, idx) => {
      const serial = String(globalIndex++).padStart(3, '0');
      const isObject = typeof student === 'object' && student !== null;
      const studentName = isObject ? student.name : student;
      return {
        id: isObject && student.id ? student.id : `GRAD-${serial}`,
        serial,
        seatOrder: idx + 1,
        name: studentName,
        cohortId: cohort.id,
        cohortNumber: cohort.groupNumber,
        cohortName: cohort.name,
        cohortTitle: cohort.title,
        ageRange: cohort.ageRange,
        track: cohort.track,
        mentor: cohort.mentor,
        schedule: cohort.schedule,
        color: cohort.color,
        certificates: [
          'شهادة التخرج المعتمدة – مبادرة 1001 طفل رقمي',
          `شهادة إتقان مسار ${cohort.track}`,
          'وسام الابتكار والمشاركة في المعرض السنوي (40 مشروعاً)'
        ]
      };
    })
  );
}

export function applySiteCMSOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object') return;
  const scalarKeys = [
    'title',
    'subtitle',
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
  if (Array.isArray(overrides.stats)) {
    EVENT_DETAILS.stats = overrides.stats;
  }
  if (Array.isArray(overrides.strategicPartners)) {
    EVENT_DETAILS.strategicPartners = overrides.strategicPartners;
  }
  if (Array.isArray(overrides.partners)) {
    EVENT_DETAILS.partners = overrides.partners;
  }
  if (Array.isArray(overrides.agenda)) {
    EVENT_DETAILS.agenda = overrides.agenda;
  }
  if (Array.isArray(overrides.cohorts)) {
    EVENT_DETAILS.cohorts = overrides.cohorts;
    EVENT_DETAILS.allGraduates = rebuildAllGraduatesFromCohorts(overrides.cohorts);
  }
  if (Array.isArray(overrides.allProjects)) {
    EVENT_DETAILS.allProjects = overrides.allProjects;
    EVENT_DETAILS.projectsSample = overrides.allProjects.slice(0, 6);
  }
  if (Array.isArray(overrides.faq)) {
    EVENT_DETAILS.faq = overrides.faq;
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

export function getAdminPin() {
  if (typeof window === 'undefined') return '1001';
  return localStorage.getItem(CMS_PIN_STORAGE_KEY) || '1001';
}

export function setAdminPin(newPin) {
  if (typeof window === 'undefined' || !newPin) return;
  localStorage.setItem(CMS_PIN_STORAGE_KEY, String(newPin).trim());
}

export const CMS_USERS_STORAGE_KEY = 'abdaa_admin_users_v2';

export const ADMIN_ROLES = [
  {
    id: 'super_admin',
    label: 'مدير عام كامل الصلاحيات (Super Admin)',
    allowedTabs: [
      'id_cards',
      'cms_general',
      'cms_partners',
      'cms_agenda',
      'cms_graduates',
      'cms_projects_mentors',
      'tickets',
      'batch2',
      'evaluations',
      'community',
      'users'
    ]
  },
  {
    id: 'reception',
    label: 'لجنة الاستقبال والتذاكر والهويات',
    allowedTabs: ['id_cards', 'tickets', 'batch2']
  },
  {
    id: 'media_cms',
    label: 'لجنة الإعلام وإدارة المحتوى',
    allowedTabs: ['id_cards', 'cms_general', 'cms_partners', 'cms_agenda', 'cms_graduates', 'community']
  },
  {
    id: 'judging',
    label: 'لجنة التحكيم والمشاريع',
    allowedTabs: ['cms_projects_mentors', 'evaluations']
  }
];

export const DEFAULT_ADMIN_USERS = [
  {
    id: 'usr-karrar',
    username: 'karrar',
    aliases: ['كرار', 'masdar', 'karrar'],
    password: '1001',
    fullName: 'كرار حساني جاسم — إدارة شركة المصدر',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-firas',
    username: 'firas',
    aliases: ['فراس', 'admin', 'firas'],
    password: '1001',
    fullName: 'فراس نزار كريم — إدارة نادي أبدع',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-reception',
    username: 'reception',
    aliases: ['استقبال'],
    password: '1001',
    fullName: 'فريق الاستقبال وتدقيق التذاكر',
    role: 'reception',
    roleLabel: 'لجنة الاستقبال والتذاكر والهويات'
  },
  {
    id: 'usr-media',
    username: 'media',
    aliases: ['اعلام', 'إعلام'],
    password: '1001',
    fullName: 'اللجنة الإعلامية وتحديث المحتوى',
    role: 'media_cms',
    roleLabel: 'لجنة الإعلام وإدارة المحتوى'
  },
  {
    id: 'usr-judge',
    username: 'judge',
    aliases: ['تحكيم'],
    password: '1001',
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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_ADMIN_USERS;
}

export function saveAdminUsers(usersList) {
  if (typeof window === 'undefined' || !Array.isArray(usersList)) return;
  localStorage.setItem(CMS_USERS_STORAGE_KEY, JSON.stringify(usersList));
}

export function authenticateAdminUser(usernameInput, passwordInput) {
  const users = getAdminUsers();
  const uClean = String(usernameInput || '').trim().toLowerCase();
  const pClean = String(passwordInput || '').trim();

  // مطابقة اسم المستخدم (بالإنجليزي أو العربي مثل karrar / كرار أو firas / فراس) + كلمة المرور
  const matched = users.find((u) => {
    const uname = String(u.username || '').trim().toLowerCase();
    const aliases = Array.isArray(u.aliases) ? u.aliases.map((a) => String(a).trim().toLowerCase()) : [];
    const nameMatch =
      uname === uClean ||
      aliases.includes(uClean) ||
      (uname === 'karrar' && (uClean === 'كرار' || uClean === 'masdar')) ||
      (uname === 'firas' && (uClean === 'فراس' || uClean === 'admin'));
    const passMatch =
      String(u.password) === pClean ||
      (u.role === 'super_admin' && (pClean === '1001' || pClean === '2026'));
    return nameMatch && passMatch;
  });
  if (matched) return matched;

  // دعم الدخول السريع برمز الـ PIN للمدير العام إذا كتب الرمز في خانة كلمة المرور
  const activePin = getAdminPin();
  if ((!uClean || uClean === 'admin' || uClean === 'karrar' || uClean === 'كرار') && (pClean === activePin || pClean === '1001' || pClean === '2026')) {
    return users[0] || DEFAULT_ADMIN_USERS[0];
  }
  return null;
}

// تحميل أي تعديلات محفوظة فور تشغيل الموقع
loadSiteCMSFromStorage();

