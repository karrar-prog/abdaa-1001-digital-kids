// ترتيب الخريجين ديناميكياً حسب تسلسل المشاريع الحية (البوثات #1 .. #63) ثم بقية الخريجين

export function normalizeArabicName(str) {
  return String(str || '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/عبد\s+ال/g, 'عبدال')
    .replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function findStudentOffsetInText(studentName, projectStudentsText) {
  const nName = normalizeArabicName(studentName);
  const pNorm = normalizeArabicName(projectStudentsText);
  if (!nName || !pNorm) return -1;

  const tokens = nName.split(' ').filter(Boolean);
  const candidates = [nName];
  if (tokens.length >= 3) candidates.push(tokens.slice(0, 3).join(' '));
  if (tokens.length === 2) candidates.push(tokens.slice(0, 2).join(' '));

  for (const cand of candidates) {
    if (cand.length < 4) continue;
    let idx = pNorm.indexOf(cand);
    while (idx !== -1) {
      const before = idx === 0 ? ' ' : pNorm[idx - 1];
      const before2 = idx <= 1 ? ' ' : pNorm[idx - 2];
      const after = idx + cand.length >= pNorm.length ? ' ' : pNorm[idx + cand.length];
      const validStart = before === ' ' || (before === 'و' && before2 === ' ');
      const validEnd = after === ' ';
      if (validStart && validEnd) return idx;
      idx = pNorm.indexOf(cand, idx + 1);
    }
  }
  return -1;
}

/**
 * يستخرج قائمة موحدة بجميع الخريجين مرتبةً أولاً حسب تسلسل المشاريع الحية (projectsList)
 * من المشروع رقم 1 (بوث #1) حتى آخر مشروع، يليهم بقية الخريجين بالتسلسل.
 * كل خريج يحمل الحقول الإضافية:
 *  - serial (1..N حسب الترتيب النهائي)
 *  - projectPositions: مصفوفة أرقام مشاريعه/بوثاته [1] أو [4, 62]
 *  - projectCodes: ['ABD-PRJ-01', ...]
 *  - primaryProjectPos: رقم أول مشروع له (أو null إذا لم يكن ضمن بوثات المعرض)
 *  - boothLabel: 'بوث #1' أو 'بوث #4، #62' أو ''
 */
export function buildProjectOrderedGraduates(cohortsList = [], projectsList = []) {
  const flat = [];
  let rawIdx = 0;

  (cohortsList || []).forEach((cohort, cIdx) => {
    const members = cohort.graduates || cohort.students || [];
    members.forEach((raw, sIdx) => {
      rawIdx += 1;
      const g =
        typeof raw === 'object' && raw !== null
          ? raw
          : {
              id: `DK-2026-${String(rawIdx).padStart(3, '0')}`,
              initiativeCode: `1001-IQ-${String(rawIdx).padStart(3, '0')}`,
              name: String(raw || ''),
              track: cohort.track || 'البرمجة والمهارات الرقمية',
              project: 'مشروع تخرج الدفعة الأولى'
            };
      const uid = String(g.initiativeCode || g.id || `GRAD-${cIdx + 1}-${sIdx + 1}`);
      flat.push({
        uid,
        origIdx: rawIdx,
        id: g.id || uid,
        initiativeCode: g.initiativeCode || uid,
        name: String(g.name || '').trim(),
        englishName: g.englishName || '',
        track: g.track || cohort.track || '',
        project: g.project || '',
        governorate: g.governorate || 'النجف',
        cohortName: cohort.name || `المجموعة ${cIdx + 1}`,
        projectPositions: [],
        projectCodes: [],
        primaryProjectPos: null,
        primaryProjectCode: '',
        primaryProjectTitle: '',
        boothLabel: ''
      });
    });
  });

  if (!Array.isArray(projectsList) || projectsList.length === 0) {
    return flat.map((g, i) => ({ ...g, serial: i + 1 }));
  }

  const placedMap = new Map();
  const projectOrdered = [];

  projectsList.forEach((proj, pIdx) => {
    const pos = pIdx + 1;
    const pCode = proj.code || `ABD-PRJ-${String(pos).padStart(2, '0')}`;
    const pStudents = proj.students || '';
    if (!pStudents) return;

    const hits = [];
    flat.forEach((g) => {
      const off = findStudentOffsetInText(g.name, pStudents);
      if (off !== -1) hits.push({ g, off });
    });
    hits.sort((a, b) => a.off - b.off || a.g.origIdx - b.g.origIdx);

    hits.forEach(({ g }) => {
      if (!placedMap.has(g.uid)) {
        const entry = {
          ...g,
          projectPositions: [pos],
          projectCodes: [pCode],
          primaryProjectPos: pos,
          primaryProjectCode: pCode,
          primaryProjectTitle: proj.title || g.project || '',
          project: proj.title || g.project || ''
        };
        placedMap.set(g.uid, entry);
        projectOrdered.push(entry);
      } else {
        const entry = placedMap.get(g.uid);
        if (!entry.projectPositions.includes(pos)) {
          entry.projectPositions.push(pos);
          entry.projectCodes.push(pCode);
        }
      }
    });
  });

  projectOrdered.forEach((entry) => {
    entry.boothLabel =
      entry.projectPositions.length > 0
        ? `بوث ${entry.projectPositions.map((n) => `#${n}`).join('، ')}`
        : '';
  });

  const remaining = flat.filter((g) => !placedMap.has(g.uid));
  return [...projectOrdered, ...remaining].map((g, i) => ({
    ...g,
    serial: i + 1
  }));
}
