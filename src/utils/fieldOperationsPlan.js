// محرك الخطة التشغيلية الميدانية وتوزيع مجموعات الأطفال (كل 5 أطفال مع مدرب أو متطوع) + بروتوكول تأمين البوثات
// مصمم للعمل المباشر يوم احتفالية تخرج مبادرة «1001 طفل رقمي» في قصر الثقافة – النجف الأشرف

export const FIELD_OPS_STORAGE_KEY = 'abdaa_field_ops_supervisors_v1';

const GENERIC_PROJECT_PREFIX = 'مشروع تخرج الدفعة الأولى';

function normalizeArabicText(value) {
  return String(value || '')
    .trim()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export const OPERATIONAL_TIMELINE_MATRIX = [
  {
    id: 'op-1',
    time: '2:00 – 2:45 ظهراً',
    stage: 'الاستقبال وتجهيز البوثات مسبقاً',
    vipFlow: 'تحضير منصة الاستقبال البروتوكولية وجدار الصورة التذكارية',
    boothKidsFlow: 'تركيب وتشغيل اللابتوبات والروبوتات على كل بوث بالكامل قبل الصورة',
    hallKidsFlow: 'استقبال العوائل وتسجيل حضور الأطفال وتسليم كل 5 أطفال لمتابعهم',
    securityFlow: 'فحص الكهرباء والتوصيلات وترقيم البوثات وتسجيل عهدة الأجهزة'
  },
  {
    id: 'op-2',
    time: '2:45 – 3:00 ظهراً',
    stage: 'الاصطفاف أمام منصة الصورة',
    vipFlow: 'تهيئة الممر الرئاسي وإشارة قرب وصول الموكب الرسمي',
    boothKidsFlow: 'ترك الأجهزة شغّالة تحت حراسة المعرض والاصطفاف مع متابعيهم للصورة',
    hallKidsFlow: 'الاصطفاف المنظّم في الصفوف المخصصة للتصوير الجماعي',
    securityFlow: 'انتشار 3–4 متطوعين داخل صالة المعرض لحراسة البوثات الفارغة'
  },
  {
    id: 'op-3',
    time: '3:00 – 3:06 عصراً',
    stage: 'وصول فخامة الرئيس والصورة الأولى',
    vipFlow: 'وصول فخامة رئيس الجمهورية والتقاط الصورة التذكارية الجماعية فوراً',
    boothKidsFlow: 'المشاركة في الصورة التذكارية والتهيؤ للانطلاق السريع للمعرض',
    hallKidsFlow: 'المشاركة في الصورة التذكارية والتهيؤ للتوجه للقاعة الكبرى',
    securityFlow: 'تأمين تام لصالة المعرض والتأكد من جاهزية كل بوث قبل عودة الأطفال'
  },
  {
    id: 'op-4',
    time: '3:06 – 3:10 عصراً',
    stage: 'التفريع الفوري (مساران متوازيان)',
    vipFlow: 'استراحة ترحيبية قصيرة وانتقال الوفد نحو مدخل معرض المشاريع',
    boothKidsFlow: 'كل متابع يرافق مجموعته (5 أطفال) مباشرة إلى بوثاتهم المرقّمة',
    hallKidsFlow: 'كل متابع يرافق مجموعته (5 أطفال) عبر الممر المخصص إلى مقاعد القاعة',
    securityFlow: 'تنظيم مدخل المعرض ومنع دخول غير المصرح لهم قبل جولة الوفد'
  },
  {
    id: 'op-5',
    time: '3:10 – 3:20 عصراً',
    stage: 'جولة الوفد على معرض المشاريع',
    vipFlow: 'جولة فخامة الرئيس والوفد على أجنحة المشاريع والتقاط الصور مع المبدعين',
    boothKidsFlow: 'الأطفال واقفون أمام مشاريعهم للشرح والتصوير بإشراف متابعيهم',
    hallKidsFlow: 'جلوس منتظم ومستقر داخل قاعة الاحتفالات بانتظار بدء المراسم',
    securityFlow: 'تنظيم انسيابية الممرات حول الوفد الرئاسي وحماية التوصيلات'
  },
  {
    id: 'op-6',
    time: '3:20 – 3:30 عصراً',
    stage: 'زيارة المتحف ⇄ سحب البوثات للقاعة',
    vipFlow: 'انتقال الوفد الرئاسي لجولة المتحف (النافذة الذهبية لنقل الأطفال)',
    boothKidsFlow: 'إشارة الانسحاب الفوري: كل متابع يسحب الـ 5 أطفال إلى صفوف «أبطال المعرض» بالقاعة',
    hallKidsFlow: 'استقرار كامل داخل القاعة وترحيب بزملائهم أصحاب البوثات بهدوء',
    securityFlow: 'تأمين وغلق صالة المعرض مؤقتاً وبقاء فريق الحراسة داخلها طوال الحفل'
  },
  {
    id: 'op-7',
    time: '3:30 – 5:30 عصراً',
    stage: 'فقرات القاعة والتكريم الرئاسي (175 خريجاً)',
    vipFlow: 'الافتتاح والكلمات ← فقرة مريم ومحمد والفيديو ← تكريم فخامة الرئيس لـ 12 طالباً ← استكمال التكريم',
    boothKidsFlow: 'متابعة الأطفال في صفوف أبطال المعرض وتنظيم صعودهم للتكريم',
    hallKidsFlow: 'متابعة كل 5 أطفال أثناء الحفل وتنظيم صعودهم للمسرح بالترتيب',
    securityFlow: 'حراسة مستمرة للأجهزة والروبوتات في البوثات (نوبتان بالتناوب)'
  },
  {
    id: 'op-8',
    time: '5:30 – 5:35+ عصراً',
    stage: 'الختام وفتح المعرض للعائلات',
    vipFlow: 'ختام الحفل والتقاط الصور التذكارية الرسمية مع الضيوف',
    boothKidsFlow: 'عودة أصحاب البوثات لاستقبال العائلات وتسليمهم أجهزتهم بأمان',
    hallKidsFlow: 'توجيه العائلات والأطفال للتجول في معرض المشاريع والصور التذكارية',
    securityFlow: 'فتح أبواب المعرض للعائلات والإشراف على تسليم الأجهزة دون فقدان'
  }
];

export const BOOTH_SECURITY_PROTOCOL = [
  {
    id: 'sec-1',
    title: 'التجهيز والتشغيل المسبق قبل الصورة (2:00 – 2:45 ظهراً)',
    detail:
      'يتم تشغيل جميع اللابتوبات والروبوتات والتأكد من الشحن والكهرباء قبل اصطفاف الأطفال للصورة الأولى حتى لا يضيع وقت بين الصورة وجولة فخامة الرئيس.'
  },
  {
    id: 'sec-2',
    title: 'حراسة المعرض أثناء الصورة الجماعية (2:45 – 3:10)',
    detail:
      'يبقى 3 إلى 4 متطوعين (فريق حراسة المعرض) داخل صالة البوثات أثناء خروج الأطفال للصورة الجماعية الأولى لضمان سلامة الأجهزة.'
  },
  {
    id: 'sec-3',
    title: 'إشارة السحب الذهبية عند دخول الوفد للمتحف (3:20 عصراً)',
    detail:
      'بمجرد دخول الوفد المرافق إلى المتحف، يعطي المنسق الميداني إشارة الانسحاب لمتابعي البوثات (كل متابع يجمع أطفاله الـ 5 فوراً) ويتوجهون إلى «صفوف أبطال المعرض» المحجوزة قرب أقرب باب جانبي للقاعة.'
  },
  {
    id: 'sec-4',
    title: 'تأمين وغلق صالة البوثات أثناء فقرات القاعة (3:25 – 5:30)',
    detail:
      'يُمنع دخول أي شخص غير مخوّل لصالة البوثات طوال فقرات القاعة، مع بقاء حارسين مناوبين على الباب وداخل الصالة لحماية اللابتوبات والنماذج.'
  },
  {
    id: 'sec-5',
    title: 'إعادة الفتح للعائلات وتسليم الأجهزة (5:30 عصراً)',
    detail:
      'بعد إعلان الختام تُفتح أبواب المعرض للعائلات والضيوف، ولا يُغادر فريق الحراسة إلا بعد تسليم جميع الأجهزة والروبوتات للأطفال وأولياء أمورهم.'
  }
];

export function loadFieldPlanAssignments() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(FIELD_OPS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveFieldPlanAssignments(assignmentsMap) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FIELD_OPS_STORAGE_KEY, JSON.stringify(assignmentsMap || {}));
  } catch {
    // ignore storage errors
  }
}

function findMatchingProject(student, projects) {
  const normStudentName = normalizeArabicText(student?.name);
  const normStudentProj = normalizeArabicText(student?.project);
  const hasSpecificProject =
    Boolean(normStudentProj) && !String(student?.project || '').trim().startsWith(GENERIC_PROJECT_PREFIX);

  // 1. Direct match by student name inside OFFICIAL_CHILDREN_PROJECTS
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const normAuthors = normalizeArabicText(p?.students);
    if (normStudentName && normAuthors && normAuthors.includes(normStudentName)) {
      return { project: p, boothIndex: i + 1 };
    }
  }

  // 2. Match by project title if student has a specific project listed in cohortsData
  if (hasSpecificProject) {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const normTitle = normalizeArabicText(p?.title);
      if (
        normTitle &&
        (normStudentProj.includes(normTitle) || normTitle.includes(normStudentProj.slice(0, Math.min(18, normStudentProj.length))))
      ) {
        return { project: p, boothIndex: i + 1 };
      }
    }
    // Student has a dedicated named project even if not yet indexed in projects list
    return {
      project: {
        code: 'BOOTH',
        title: student.project,
        track: student.track || 'ابتكار طلابي'
      },
      boothIndex: 999
    };
  }

  return null;
}

function chunkArray(arr, size) {
  const safeSize = Math.max(2, Number(size) || 5);
  const out = [];
  for (let i = 0; i < arr.length; i += safeSize) {
    out.push(arr.slice(i, i + safeSize));
  }
  return out;
}

export function buildFieldOperationsGroups({
  cohorts = [],
  projects = [],
  mentors = [],
  volunteers = [],
  boothGroupSize = 5,
  hallGroupSize = 5,
  savedSupervisors = {}
} = {}) {
  // Flatten all graduates preserving cohort metadata
  const allStudents = [];
  (cohorts || []).forEach((cohort, cIdx) => {
    const list = Array.isArray(cohort.graduates) && cohort.graduates.length > 0
      ? cohort.graduates
      : Array.isArray(cohort.students)
        ? cohort.students
        : [];
    list.forEach((st, sIdx) => {
      allStudents.push({
        id: st.id || `DK-${cIdx + 1}-${sIdx + 1}`,
        initiativeCode: st.initiativeCode || st.id || '',
        name: st.name || '',
        governorate: st.governorate || 'النجف',
        track: st.track || cohort.track || '',
        project: st.project || '',
        cohortName: cohort.name || `المجموعة ${cIdx + 1}`
      });
    });
  });

  const boothKids = [];
  const hallKids = [];

  allStudents.forEach((st) => {
    const matched = findMatchingProject(st, projects || []);
    if (matched) {
      boothKids.push({
        ...st,
        hasBooth: true,
        boothIndex: matched.boothIndex,
        boothLabel:
          matched.boothIndex < 900 ? `بوث ${String(matched.boothIndex).padStart(2, '0')}` : 'بوث معرض',
        projectCode: matched.project?.code || '',
        projectTitle: matched.project?.title || st.project
      });
    } else {
      hallKids.push({
        ...st,
        hasBooth: false
      });
    }
  });

  // Order booth owners by physical booth number so each volunteer manages 5 adjacent booths!
  boothKids.sort((a, b) => (a.boothIndex || 999) - (b.boothIndex || 999));

  // Build suggestion pool of mentors & registered volunteers (skipping lead founders on stage)
  const volunteerPool = [
    ...(mentors || [])
      .filter((m) => String(m.category || '').includes('المدربون') || String(m.role || '').includes('متطوع'))
      .map((m) => ({ name: m.name, role: 'مدرب متطوع', phone: '' })),
    ...(volunteers || []).map((v) => ({
      name: v.fullName || v.full_name || v.name || '',
      role: 'متطوع ميداني',
      phone: v.phone || ''
    }))
  ].filter((v) => v.name);

  let poolCursor = 0;
  const pickSuggested = () => {
    if (poolCursor < volunteerPool.length) {
      return volunteerPool[poolCursor++];
    }
    return null;
  };

  const boothChunks = chunkArray(boothKids, boothGroupSize);
  const boothGroups = boothChunks.map((members, idx) => {
    const groupNum = String(idx + 1).padStart(2, '0');
    const groupId = `BOOTH-${groupNum}`;
    const validBoothNums = members.filter((m) => m.boothIndex < 900).map((m) => m.boothIndex);
    const boothRange =
      validBoothNums.length > 0
        ? `بوث ${String(Math.min(...validBoothNums)).padStart(2, '0')} – ${String(Math.max(...validBoothNums)).padStart(2, '0')}`
        : `قطاع البوثات ${idx + 1}`;
    const suggested = pickSuggested();
    const customEntry = savedSupervisors[groupId];
    const supervisorName =
      customEntry !== undefined ? customEntry : suggested ? suggested.name : '';

    return {
      groupId,
      type: 'booth',
      code: `B-${groupNum}`,
      title: `مجموعة أصحاب البوثات (${groupNum})`,
      rangeLabel: boothRange,
      hallZone: `صفوف «أبطال المعرض» — الصف ${Math.floor(idx / 3) + 1} (قرب باب المعرض)`,
      supervisorName,
      suggestedRole: suggested?.role || 'مدرب / متطوع بوثات',
      supervisorPhone: suggested?.phone || '',
      members
    };
  });

  const hallChunks = chunkArray(hallKids, hallGroupSize);
  const hallGroups = hallChunks.map((members, idx) => {
    const groupNum = String(idx + 1).padStart(2, '0');
    const groupId = `HALL-${groupNum}`;
    const zoneIndex = Math.floor(idx / 6) + 1;
    const suggested = pickSuggested();
    const customEntry = savedSupervisors[groupId];
    const supervisorName =
      customEntry !== undefined ? customEntry : suggested ? suggested.name : '';

    return {
      groupId,
      type: 'hall',
      code: `H-${groupNum}`,
      title: `مجموعة أطفال القاعة (${groupNum})`,
      rangeLabel: `أطفال القاعة — مقاعد القطاع ${zoneIndex}`,
      hallZone: `القاعة الكبرى — القطاع ${zoneIndex} • صف ${(idx % 6) + 2}`,
      supervisorName,
      suggestedRole: suggested?.role || 'متطوع مرافقة القاعة',
      supervisorPhone: suggested?.phone || '',
      members
    };
  });

  const boothSecurityCount = 4;

  return {
    totalKids: allStudents.length,
    totalProjects: (projects || []).length,
    boothKidsCount: boothKids.length,
    hallKidsCount: hallKids.length,
    boothGroupSize,
    hallGroupSize,
    boothGroups,
    hallGroups,
    boothSecurityCount,
    totalSupervisorsNeeded: boothGroups.length + hallGroups.length + boothSecurityCount
  };
}
