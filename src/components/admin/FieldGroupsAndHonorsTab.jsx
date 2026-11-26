import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  Printer,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Save,
  Sparkles,
  UserCheck,
  FileSpreadsheet,
  HeartHandshake,
  Check,
  X,
  FileText,
  Layers
} from 'lucide-react';
import {
  openSupervisorGroupsPrintWindow,
  openChildrenFamiliesPrintWindow,
  exportChildrenFamiliesCsv,
  openHonoringSequencePrintWindow
} from '../../utils/print/fieldGroupsAndHonorsPrint';
import { buildProjectOrderedGraduates } from '../../utils/projectOrderHelper';

export function buildDefaultSupervisorGroups(allGraduates = [], groupSize = 7, existingGroups = [], volunteers = []) {
  const size = Math.max(1, Math.min(30, Number(groupSize) || 7));
  const groups = [];
  for (let i = 0; i < allGraduates.length; i += size) {
    const idx = groups.length;
    const prev = existingGroups[idx] || {};
    const autoVol = !prev.supervisorName && volunteers[idx] ? volunteers[idx] : null;
    const slice = allGraduates.slice(i, i + size);
    groups.push({
      id: prev.id || `sup-grp-${idx + 1}`,
      title: prev.title || `المجموعة الإشرافية #${idx + 1}`,
      supervisorName: prev.supervisorName || autoVol?.full_name || '',
      supervisorPhone: prev.supervisorPhone || autoVol?.phone || '',
      volunteerCode: prev.volunteerCode || autoVol?.volunteer_code || '',
      zone: prev.zone || `صف ${idx + 1}`,
      notes: prev.notes || '',
      studentIds: slice.map((g) => g.uid)
    });
  }
  return groups;
}

export function buildDefaultHonoringBatches() {
  return [
    {
      id: 'honor-1',
      title: 'تكريم فخامة رئيس جمهورية العراق',
      presenterName: 'فخامة رئيس جمهورية العراق المحترم',
      presenterRole: 'راعي الاحتفالية',
      notes: 'الوقوف بصف منظم على يمين المنصة قبل النداء بدقيقتين',
      studentIds: []
    },
    {
      id: 'honor-2',
      title: 'تكريم السيد محافظ النجف الأشرف',
      presenterName: 'المهندس يوسف مكي كناوي',
      presenterRole: 'محافظ النجف الأشرف',
      notes: '',
      studentIds: []
    },
    {
      id: 'honor-3',
      title: 'تكريم نقيب المبرمجين العراقيين',
      presenterName: 'الأستاذ أثير القيسي',
      presenterRole: 'نقيب المبرمجين العراقيين',
      notes: '',
      studentIds: []
    }
  ];
}

export default function FieldGroupsAndHonorsTab({
  cohortsList = [],
  projectsList = [],
  volunteers = [],
  tickets = [],
  supervisorGroups = [],
  setSupervisorGroups,
  childFamiliesMap = {},
  setChildFamiliesMap,
  honoringBatches = [],
  setHonoringBatches,
  handleSaveFieldGroupsAndHonors,
  isSaving = false,
  readOnly = false
}) {
  const [subTab, setSubTab] = useState('supervisors'); // 'supervisors' | 'families' | 'honors'
  const [groupSizeInput, setGroupSizeInput] = useState(7);
  const [groupSearch, setGroupSearch] = useState('');
  const [addChildPickerGroupId, setAddChildPickerGroupId] = useState('');
  const [addChildSearch, setAddChildSearch] = useState('');

  // Families sub-tab search/filter
  const [familySearch, setFamilySearch] = useState('');
  const [familyGroupFilter, setFamilyGroupFilter] = useState('all');

  // Honors sub-tab controls
  const [newHonorTitle, setNewHonorTitle] = useState('');
  const [newHonorPresenter, setNewHonorPresenter] = useState('');
  const [newHonorRole, setNewHonorRole] = useState('');
  const [activeHonorPickerId, setActiveHonorPickerId] = useState('');
  const [honorChildSearch, setHonorChildSearch] = useState('');
  const [honorGroupFilter, setHonorGroupFilter] = useState('all');

  // Flatten all registered graduates strictly ordered by live Projects/Booths (#1 .. #63) first, then remaining graduates
  const allGraduates = useMemo(
    () => buildProjectOrderedGraduates(cohortsList, projectsList),
    [cohortsList, projectsList]
  );

  const projectChildrenCount = useMemo(
    () => allGraduates.filter((g) => g.primaryProjectPos !== null).length,
    [allGraduates]
  );

  const graduatesById = useMemo(() => {
    const map = {};
    allGraduates.forEach((g) => {
      map[g.uid] = g;
    });
    return map;
  }, [allGraduates]);

  // Ensure initial groups exist when opening for the first time
  const activeGroups = useMemo(() => {
    if (Array.isArray(supervisorGroups) && supervisorGroups.length > 0) return supervisorGroups;
    return buildDefaultSupervisorGroups(allGraduates, 7, [], volunteers);
  }, [supervisorGroups, allGraduates, volunteers]);

  const activeHonors = useMemo(() => {
    if (Array.isArray(honoringBatches) && honoringBatches.length > 0) return honoringBatches;
    return buildDefaultHonoringBatches();
  }, [honoringBatches]);

  // Map each child uid -> supervisor group info
  const childSupervisorMap = useMemo(() => {
    const map = {};
    activeGroups.forEach((g, idx) => {
      const groupTitle = g.title || `مجموعة #${idx + 1}`;
      (g.studentIds || []).forEach((uid) => {
        map[uid] = {
          groupId: g.id,
          groupTitle,
          supervisorName: g.supervisorName || '',
          supervisorPhone: g.supervisorPhone || '',
          zone: g.zone || ''
        };
      });
    });
    return map;
  }, [activeGroups]);

  // Count how many honoring lists each child appears in (for helpful badge only; repeats are 100% allowed!)
  const childHonorCountMap = useMemo(() => {
    const counts = {};
    activeHonors.forEach((b) => {
      (b.studentIds || []).forEach((uid) => {
        counts[uid] = (counts[uid] || 0) + 1;
      });
    });
    return counts;
  }, [activeHonors]);

  // Volunteers already assigned to a group
  const assignedVolNames = useMemo(() => {
    const set = new Set();
    activeGroups.forEach((g) => {
      if (g.supervisorName) set.add(g.supervisorName.trim());
    });
    return set;
  }, [activeGroups]);

  // Build Children & Families rows (auto-matching tickets by last-name/full-name hints when no manual override yet)
  const familyRows = useMemo(() => {
    const normalizedTickets = (tickets || []).map((t) => ({
      name: String(t.attendee_name || '').trim(),
      phone: String(t.phone_number || t.phone || '').trim(),
      notes: String(t.notes || '').trim(),
      guestType: String(t.guest_type || '').trim()
    }));

    return allGraduates.map((g) => {
      const sup = childSupervisorMap[g.uid] || {};
      const savedFam = childFamiliesMap?.[g.uid] || {};
      let matchedTicket = null;
      if (!savedFam.guardianName && !savedFam.guardianPhone && g.name) {
        const parts = g.name.split(/\s+/).filter((p) => p.length >= 2);
        const fatherAndGrand = parts.slice(1, 3).join(' ');
        if (fatherAndGrand.length >= 4) {
          matchedTicket = normalizedTickets.find((t) => t.name.includes(fatherAndGrand));
        }
      }
      return {
        uid: g.uid,
        serial: g.serial,
        childName: g.name,
        code: g.initiativeCode || g.id,
        boothLabel: g.boothLabel || '',
        project: g.project || '',
        cohortName: g.cohortName,
        groupId: sup.groupId || '',
        groupTitle: sup.groupTitle || 'غير موزّع',
        supervisorName: sup.supervisorName || '',
        supervisorPhone: sup.supervisorPhone || '',
        guardianName: savedFam.guardianName ?? matchedTicket?.name ?? '',
        guardianPhone: savedFam.guardianPhone ?? matchedTicket?.phone ?? '',
        companionsCount: savedFam.companionsCount ?? '',
        familyNote: savedFam.familyNote ?? ''
      };
    });
  }, [allGraduates, childSupervisorMap, childFamiliesMap, tickets]);

  // ---------- Handlers: Supervisor Groups ----------
  const handleAutoDistributeGroups = () => {
    if (readOnly) return;
    const size = Math.max(1, Math.min(30, Number(groupSizeInput) || 7));
    const next = buildDefaultSupervisorGroups(allGraduates, size, activeGroups, volunteers);
    setSupervisorGroups(next);
  };

  const handleAutoAssignVolunteers = () => {
    if (readOnly || volunteers.length === 0) return;
    const next = activeGroups.map((g, idx) => {
      const vol = volunteers[idx];
      if (!vol) return g;
      return {
        ...g,
        supervisorName: vol.full_name || g.supervisorName,
        supervisorPhone: vol.phone || g.supervisorPhone,
        volunteerCode: vol.volunteer_code || g.volunteerCode
      };
    });
    setSupervisorGroups(next);
  };

  const handleAddEmptyGroup = () => {
    if (readOnly) return;
    const nextIdx = activeGroups.length + 1;
    setSupervisorGroups([
      ...activeGroups,
      {
        id: `sup-grp-${Date.now()}`,
        title: `المجموعة الإشرافية #${nextIdx}`,
        supervisorName: '',
        supervisorPhone: '',
        volunteerCode: '',
        zone: `صف ${nextIdx}`,
        notes: '',
        studentIds: []
      }
    ]);
  };

  const updateGroupField = (gIdx, key, val) => {
    if (readOnly) return;
    const copy = activeGroups.map((g, idx) => (idx === gIdx ? { ...g, [key]: val } : g));
    setSupervisorGroups(copy);
  };

  const handleAssignVolunteerToGroup = (gIdx, volIdxStr) => {
    if (readOnly) return;
    if (volIdxStr === '') return;
    const vol = volunteers[Number(volIdxStr)];
    if (!vol) return;
    const copy = activeGroups.map((g, idx) =>
      idx === gIdx
        ? {
            ...g,
            supervisorName: vol.full_name || '',
            supervisorPhone: vol.phone || '',
            volunteerCode: vol.volunteer_code || ''
          }
        : g
    );
    setSupervisorGroups(copy);
  };

  const handleRemoveChildFromGroup = (gIdx, uid) => {
    if (readOnly) return;
    const copy = activeGroups.map((g, idx) =>
      idx === gIdx ? { ...g, studentIds: (g.studentIds || []).filter((id) => id !== uid) } : g
    );
    setSupervisorGroups(copy);
  };

  const handleAddChildToGroup = (gIdx, uid) => {
    if (readOnly || !uid) return;
    // Move child cleanly into this group (removing from any prior supervisor group to prevent 2 direct supervisors)
    const copy = activeGroups.map((g, idx) => {
      const cleaned = (g.studentIds || []).filter((id) => id !== uid);
      if (idx === gIdx) {
        return { ...g, studentIds: [...cleaned, uid] };
      }
      return { ...g, studentIds: cleaned };
    });
    setSupervisorGroups(copy);
  };

  const handleDeleteGroup = (gIdx) => {
    if (readOnly) return;
    if (!window.confirm('هل تريد حذف هذه المجموعة الإشرافية؟')) return;
    setSupervisorGroups(activeGroups.filter((_, i) => i !== gIdx));
  };

  // ---------- Handlers: Families ----------
  const updateFamilyField = (uid, key, val) => {
    if (readOnly) return;
    setChildFamiliesMap((prev) => ({
      ...prev,
      [uid]: {
        ...(prev?.[uid] || {}),
        [key]: val
      }
    }));
  };

  // ---------- Handlers: Honoring Sequence ----------
  const handleAddHonorBatch = () => {
    if (readOnly) return;
    const title = newHonorTitle.trim() || `تكريم رقم ${activeHonors.length + 1}`;
    const newItem = {
      id: `honor-${Date.now()}`,
      title,
      presenterName: newHonorPresenter.trim(),
      presenterRole: newHonorRole.trim(),
      notes: '',
      studentIds: []
    };
    const next = [...activeHonors, newItem];
    setHonoringBatches(next);
    setActiveHonorPickerId(newItem.id);
    setNewHonorTitle('');
    setNewHonorPresenter('');
    setNewHonorRole('');
  };

  const updateHonorField = (bIdx, key, val) => {
    if (readOnly) return;
    setHonoringBatches(activeHonors.map((b, i) => (i === bIdx ? { ...b, [key]: val } : b)));
  };

  const moveHonorBatch = (bIdx, dir) => {
    if (readOnly) return;
    const target = bIdx + dir;
    if (target < 0 || target >= activeHonors.length) return;
    const copy = [...activeHonors];
    [copy[bIdx], copy[target]] = [copy[target], copy[bIdx]];
    setHonoringBatches(copy);
  };

  const deleteHonorBatch = (bIdx, title) => {
    if (readOnly) return;
    if (!window.confirm(`هل تريد حذف «${title}» من تسلسل التكريمات؟`)) return;
    setHonoringBatches(activeHonors.filter((_, i) => i !== bIdx));
  };

  const toggleChildInHonorBatch = (bIdx, uid) => {
    if (readOnly) return;
    const copy = activeHonors.map((b, idx) => {
      if (idx !== bIdx) return b;
      const list = b.studentIds || [];
      const exists = list.includes(uid);
      return {
        ...b,
        studentIds: exists ? list.filter((x) => x !== uid) : [...list, uid]
      };
    });
    setHonoringBatches(copy);
  };

  const addQuickCountToHonorBatch = (bIdx, count) => {
    if (readOnly) return;
    const batch = activeHonors[bIdx];
    if (!batch) return;
    const currentSet = new Set(batch.studentIds || []);
    // Prefer children not yet honored anywhere first, then any child not in this batch
    const notHonoredYet = allGraduates.filter((g) => !currentSet.has(g.uid) && !childHonorCountMap[g.uid]);
    const restNotInThis = allGraduates.filter((g) => !currentSet.has(g.uid) && Boolean(childHonorCountMap[g.uid]));
    const picks = [...notHonoredYet, ...restNotInThis].slice(0, count).map((g) => g.uid);
    if (picks.length === 0) return;
    setHonoringBatches(
      activeHonors.map((b, idx) =>
        idx === bIdx ? { ...b, studentIds: [...(b.studentIds || []), ...picks] } : b
      )
    );
  };

  const addWholeSupervisorGroupToHonor = (bIdx, groupId) => {
    if (readOnly || !groupId) return;
    const grp = activeGroups.find((g) => g.id === groupId);
    if (!grp) return;
    setHonoringBatches(
      activeHonors.map((b, idx) => {
        if (idx !== bIdx) return b;
        const current = b.studentIds || [];
        const toAdd = (grp.studentIds || []).filter((uid) => !current.includes(uid));
        return { ...b, studentIds: [...current, ...toAdd] };
      })
    );
  };

  const moveChildInHonorBatch = (bIdx, kIdx, dir) => {
    if (readOnly) return;
    const batch = activeHonors[bIdx];
    if (!batch) return;
    const target = kIdx + dir;
    const list = [...(batch.studentIds || [])];
    if (target < 0 || target >= list.length) return;
    [list[kIdx], list[target]] = [list[target], list[kIdx]];
    setHonoringBatches(activeHonors.map((b, idx) => (idx === bIdx ? { ...b, studentIds: list } : b)));
  };

  // Filtered views
  const filteredGroups = useMemo(() => {
    const q = groupSearch.trim().toLowerCase();
    if (!q) return activeGroups.map((g, origIdx) => ({ g, origIdx }));
    return activeGroups
      .map((g, origIdx) => ({ g, origIdx }))
      .filter(({ g }) => {
        if (String(g.title || '').toLowerCase().includes(q)) return true;
        if (String(g.supervisorName || '').toLowerCase().includes(q)) return true;
        if (String(g.supervisorPhone || '').includes(q)) return true;
        return (g.studentIds || []).some((uid) =>
          String(graduatesById[uid]?.name || '').toLowerCase().includes(q)
        );
      });
  }, [activeGroups, groupSearch, graduatesById]);

  const filteredFamilyRows = useMemo(() => {
    const q = familySearch.trim().toLowerCase();
    return familyRows.filter((r) => {
      if (familyGroupFilter !== 'all' && r.groupId !== familyGroupFilter) return false;
      if (!q) return true;
      return (
        r.childName.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.supervisorName.toLowerCase().includes(q) ||
        r.guardianName.toLowerCase().includes(q) ||
        r.guardianPhone.includes(q)
      );
    });
  }, [familyRows, familySearch, familyGroupFilter]);

  const unassignedGraduates = useMemo(() => {
    return allGraduates.filter((g) => !childSupervisorMap[g.uid]);
  }, [allGraduates, childSupervisorMap]);

  const totalHonoringSlots = activeHonors.reduce((sum, b) => sum + (b.studentIds?.length || 0), 0);

  return (
    <div className="space-y-5">
      {/* Top Banner + Cloud Save */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-[#082046] via-[#0d2e68] to-[#082046] text-white p-4 sm:p-5 rounded-2xl border-2 border-amber-400/60 shadow-lg">
        <div>
          <h4 className="font-alexandria font-black text-sm sm:text-lg text-amber-300 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            <span>توزيع المشرفين المتطوعين (كل 7 أطفال) • قائمة العوائل • تسلسل التكريمات</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-sky-100/90 mt-0.5">
            قسّم الـ {allGraduates.length} طفلاً على المشرفين المتطوعين ({volunteers.length} متطوعاً مسجلاً)، ورتّب تكريمات المسرح بالتسلسل (مع إمكانية تكرار الطفل) واطبع كل قائمة بملف PDF/A4 مرتب.
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveFieldGroupsAndHonors(activeGroups, childFamiliesMap, activeHonors)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ الحفظ السحابي...' : 'حفظ التوزيعات والتكريمات سحابياً'}</span>
          </button>
        )}
      </div>

      {/* 3 Sub-Tabs Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setSubTab('supervisors')}
          className={`p-3.5 rounded-2xl border-2 text-right flex items-center justify-between gap-2 transition cursor-pointer ${
            subTab === 'supervisors'
              ? 'bg-[#082046] text-white border-amber-400 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${subTab === 'supervisors' ? 'bg-amber-400 text-slate-950' : 'bg-sky-100 text-sky-700'}`}>
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-alexandria font-black text-xs sm:text-sm">1. مجموعات المشرفين (كل 7)</div>
              <div className={`text-[10.5px] ${subTab === 'supervisors' ? 'text-sky-200' : 'text-slate-500'}`}>
                ربط المتطوعين كمشرفين مباشرين والطباعة
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${subTab === 'supervisors' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'}`}>
            {activeGroups.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('families')}
          className={`p-3.5 rounded-2xl border-2 text-right flex items-center justify-between gap-2 transition cursor-pointer ${
            subTab === 'families'
              ? 'bg-[#082046] text-white border-amber-400 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${subTab === 'families' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-700'}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-alexandria font-black text-xs sm:text-sm">2. الأطفال المشاركون وعوائلهم</div>
              <div className={`text-[10.5px] ${subTab === 'families' ? 'text-sky-200' : 'text-slate-500'}`}>
                كشف الاستقبال بالمشرف وولي الأمر والطباعة
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${subTab === 'families' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'}`}>
            {allGraduates.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('honors')}
          className={`p-3.5 rounded-2xl border-2 text-right flex items-center justify-between gap-2 transition cursor-pointer ${
            subTab === 'honors'
              ? 'bg-[#082046] text-white border-amber-400 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${subTab === 'honors' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-700'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-alexandria font-black text-xs sm:text-sm">3. تسلسل التكريمات (المسرح)</div>
              <div className={`text-[10.5px] ${subTab === 'honors' ? 'text-sky-200' : 'text-slate-500'}`}>
                فتح تكريمات مخصصة وطباعة PDF متسلسل
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${subTab === 'honors' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'}`}>
            {activeHonors.length} ({totalHonoringSlots})
          </span>
        </button>
      </div>

      {/* =================================================================
          SUB-TAB 1: SUPERVISOR GROUPS (7 KIDS PER VOLUNTEER SUPERVISOR)
         ================================================================= */}
      {subTab === 'supervisors' && (
        <div className="space-y-4">
          {/* Controls & Bulk Print Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {!readOnly && (
                  <>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <span className="text-[11px] font-extrabold text-slate-600">عدد الأطفال لكل مشرف:</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={groupSizeInput}
                        onChange={(e) => setGroupSizeInput(Number(e.target.value) || 7)}
                        className="w-14 px-2 py-1 rounded-lg bg-white border border-sky-300 text-xs font-black text-center text-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoDistributeGroups}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>تقسيم الـ {allGraduates.length} طفلاً حسب تسلسل المشاريع (كل {groupSizeInput})</span>
                    </button>
                    {volunteers.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAutoAssignVolunteers}
                        className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                        title="تعيين المتطوعين المسجلين تلقائياً على المجموعات بالتسلسل"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>ربط المتطوعين تلقائياً ({volunteers.length})</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddEmptyGroup}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>مجموعة جديدة</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openSupervisorGroupsPrintWindow(activeGroups, graduatesById, {
                      mode: 'combined',
                      title: 'القائمة الكاملة لمجموعات المشرفين المتطوعين والأطفال'
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة القائمة بالكامل (PDF واحد)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openSupervisorGroupsPrintWindow(activeGroups, graduatesById, {
                      mode: 'per_page',
                      title: 'بطاقات الإشراف الميداني — ورقة لكل مشرف'
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-[#082046] hover:bg-sky-900 text-amber-300 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                >
                  <Layers className="w-4 h-4" />
                  <span>طباعة ورقة لكل مشرف ({activeGroups.length} A4)</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-sky-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  placeholder="ابحث باسم المشرف المتطوع، رقم المجموعة، أو اسم طفل..."
                  className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  التسلسل: أطفال المشاريع أولاً ({projectChildrenCount} طفل) ثم البقية
                </span>
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  {activeGroups.length} مجموعة
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  المشرفون المعيّنون: {activeGroups.filter((g) => g.supervisorName?.trim()).length} / {activeGroups.length}
                </span>
                {unassignedGraduates.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    غير موزّعين: {unassignedGraduates.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Supervisor Group Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGroups.map(({ g, origIdx }) => {
              const members = (g.studentIds || []).map((uid) => graduatesById[uid]).filter(Boolean);
              const isPickerOpen = addChildPickerGroupId === g.id;
              return (
                <div
                  key={g.id || origIdx}
                  className="bg-white rounded-2xl border-2 border-slate-200/90 overflow-hidden shadow-xs flex flex-col"
                >
                  {/* Group Card Header */}
                  <div className="p-3.5 bg-gradient-to-l from-[#082046] to-[#0f3a7a] text-white space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      {readOnly ? (
                        <span className="font-alexandria font-black text-sm text-amber-300">{g.title}</span>
                      ) : (
                        <input
                          type="text"
                          value={g.title || ''}
                          onChange={(e) => updateGroupField(origIdx, 'title', e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs font-alexandria font-black text-amber-300 flex-1 min-w-0"
                        />
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shrink-0">
                        {members.length} أطفال
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          openSupervisorGroupsPrintWindow([g], graduatesById, {
                            mode: 'per_page',
                            title: g.title || `مجموعة #${origIdx + 1}`
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-slate-950 text-white text-[11px] font-black inline-flex items-center gap-1 cursor-pointer transition shrink-0"
                        title="طباعة ورقة هذا المشرف وأطفاله"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>طباعة</span>
                      </button>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(origIdx)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white cursor-pointer transition shrink-0"
                          title="حذف المجموعة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Direct Volunteer Supervisor Picker & Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {!readOnly && volunteers.length > 0 && (
                        <select
                          value=""
                          onChange={(e) => handleAssignVolunteerToGroup(origIdx, e.target.value)}
                          className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-sky-400/50 text-[11px] font-bold text-amber-200"
                        >
                          <option value="">-- اختر مشرفاً من المتطوعين المسجلين ({volunteers.length}) --</option>
                          {volunteers.map((v, vIdx) => (
                            <option key={v.id || vIdx} value={vIdx}>
                              {v.full_name} {v.phone ? `(${v.phone})` : ''} {assignedVolNames.has(String(v.full_name || '').trim()) ? '✓ معيّن' : ''}
                            </option>
                          ))}
                        </select>
                      )}
                      <input
                        type="text"
                        disabled={readOnly}
                        value={g.supervisorName || ''}
                        onChange={(e) => updateGroupField(origIdx, 'supervisorName', e.target.value)}
                        placeholder="اسم المشرف المتطوع المباشر..."
                        className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-black placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        disabled={readOnly}
                        value={g.supervisorPhone || ''}
                        onChange={(e) => updateGroupField(origIdx, 'supervisorPhone', e.target.value)}
                        placeholder="هاتف المشرف"
                        className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-mono font-bold placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        disabled={readOnly}
                        value={g.zone || ''}
                        onChange={(e) => updateGroupField(origIdx, 'zone', e.target.value)}
                        placeholder="موقع الجلوس / الصف"
                        className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Children List Inside Group */}
                  <div className="p-3 space-y-1.5 flex-1">
                    {members.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-400 font-bold">
                        لا يوجد أطفال في هذه المجموعة بعد — أضف طفلاً من الزر أدناه.
                      </div>
                    ) : (
                      members.map((m, mIdx) => (
                        <div
                          key={m.uid}
                          className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-6 h-6 rounded-full bg-sky-600 text-white text-[10px] font-black flex items-center justify-center shrink-0"
                              title={`التسلسل العام #${m.serial} (داخل المجموعة #${mIdx + 1})`}
                            >
                              {m.serial}
                            </span>
                            <div className="min-w-0 flex flex-wrap items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 truncate">{m.name}</span>
                              {m.boothLabel && (
                                <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                                  {m.boothLabel}
                                </span>
                              )}
                              <span dir="ltr" className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 shrink-0">
                                {m.initiativeCode}
                              </span>
                            </div>
                          </div>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveChildFromGroup(origIdx, m.uid)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                              title="إزالة الطفل من هذه المجموعة"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}

                    {/* Quick Add Child Picker */}
                    {!readOnly && (
                      <div className="pt-2">
                        {!isPickerOpen ? (
                          <button
                            type="button"
                            onClick={() => {
                              setAddChildPickerGroupId(g.id);
                              setAddChildSearch('');
                            }}
                            className="w-full py-1.5 rounded-xl border border-dashed border-sky-300 text-sky-700 hover:bg-sky-50 text-[11px] font-black inline-flex items-center justify-center gap-1 cursor-pointer transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة / نقل طفل إلى هذه المجموعة</span>
                          </button>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 space-y-2">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={addChildSearch}
                                onChange={(e) => setAddChildSearch(e.target.value)}
                                placeholder="ابحث باسم الطفل أو الكود..."
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-sky-300 text-xs font-bold"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => setAddChildPickerGroupId('')}
                                className="px-2 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                              >
                                إغلاق
                              </button>
                            </div>
                            <div className="max-h-36 overflow-y-auto space-y-1">
                              {allGraduates
                                .filter((cand) => {
                                  if ((g.studentIds || []).includes(cand.uid)) return false;
                                  const cq = addChildSearch.trim().toLowerCase();
                                  if (!cq) return true;
                                  return (
                                    cand.name.toLowerCase().includes(cq) ||
                                    cand.initiativeCode.toLowerCase().includes(cq)
                                  );
                                })
                                .slice(0, 25)
                                .map((cand) => {
                                  const curSup = childSupervisorMap[cand.uid];
                                  return (
                                    <button
                                      key={cand.uid}
                                      type="button"
                                      onClick={() => handleAddChildToGroup(origIdx, cand.uid)}
                                      className="w-full text-right px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-600 hover:text-white text-[11px] font-bold flex items-center justify-between gap-2 cursor-pointer transition"
                                    >
                                      <span className="truncate">{cand.name}</span>
                                      <span className="text-[10px] opacity-75 shrink-0">
                                        {curSup ? `حالياً: ${curSup.groupTitle}` : 'غير موزّع'}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 2: PARTICIPATING CHILDREN & FAMILIES ROSTER
         ================================================================= */}
      {subTab === 'families' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-sky-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={familySearch}
                  onChange={(e) => setFamilySearch(e.target.value)}
                  placeholder="ابحث باسم الطفل، ولي الأمر، المشرف، أو رقم الهاتف..."
                  className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
              <select
                value={familyGroupFilter}
                onChange={(e) => setFamilyGroupFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800"
              >
                <option value="all">جميع مجموعات الإشراف ({familyRows.length})</option>
                {activeGroups.map((g, idx) => (
                  <option key={g.id || idx} value={g.id}>
                    {g.title} {g.supervisorName ? `— ${g.supervisorName}` : ''} ({g.studentIds?.length || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  openChildrenFamiliesPrintWindow(
                    filteredFamilyRows,
                    familyGroupFilter === 'all'
                      ? 'الكشف الرسمي لقائمة الأطفال المشاركين وعوائلهم ومشرفيهم'
                      : `الكشف الرسمي لأطفال وعوائل ${activeGroups.find((g) => g.id === familyGroupFilter)?.title || ''}`
                  )
                }
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الكشف الرسمي ({filteredFamilyRows.length}) A4</span>
              </button>
              <button
                type="button"
                onClick={() => exportChildrenFamiliesCsv(filteredFamilyRows)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير Excel</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
              <table className="w-full text-right text-xs min-w-[880px]">
                <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 font-alexandria font-black text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5">الطفل المشارك</th>
                    <th className="p-2.5 w-28 text-center">الكود</th>
                    <th className="p-2.5 w-44">مجموعة الإشراف / المشرف</th>
                    <th className="p-2.5">اسم ولي الأمر / العائلة</th>
                    <th className="p-2.5 w-36">هاتف العائلة</th>
                    <th className="p-2.5 w-24 text-center">عدد المرافقين</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFamilyRows.map((row) => (
                    <tr key={row.uid} className="hover:bg-slate-50/80">
                      <td className="p-2 text-center font-black text-sky-700">{row.serial}</td>
                      <td className="p-2">
                        <div className="font-extrabold text-slate-900">{row.childName}</div>
                        {row.boothLabel && (
                          <div className="text-[10px] font-black text-amber-800 mt-0.5">
                            {row.boothLabel}
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <span dir="ltr" className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          {row.code}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="font-bold text-[11px] text-slate-800">{row.groupTitle}</div>
                        <div className="text-[10px] text-teal-700 font-bold">
                          {row.supervisorName || 'بدون مشرف بعد'}
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={readOnly}
                          value={row.guardianName}
                          onChange={(e) => updateFamilyField(row.uid, 'guardianName', e.target.value)}
                          placeholder="اسم ولي الأمر / العائلة..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-400 text-xs font-bold"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={readOnly}
                          value={row.guardianPhone}
                          onChange={(e) => updateFamilyField(row.uid, 'guardianPhone', e.target.value)}
                          placeholder="07xxxxxxxxx"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-400 text-xs font-mono font-bold"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          disabled={readOnly}
                          value={row.companionsCount}
                          onChange={(e) => updateFamilyField(row.uid, 'companionsCount', e.target.value)}
                          placeholder="2"
                          className="w-16 px-2 py-1.5 rounded-lg bg-slate-50 focus:bg-white border border-slate-200 text-xs font-black text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 3: CUSTOM HONORING SEQUENCE (OPENABLE, REPEATABLE, SEQUENTIAL PDF)
         ================================================================= */}
      {subTab === 'honors' && (
        <div className="space-y-4">
          {/* Sequential Print Command Bar */}
          <div className="bg-gradient-to-l from-amber-50 via-white to-sky-50 p-4 rounded-2xl border-2 border-amber-300/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h5 className="font-alexandria font-black text-sm text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>تسلسل التكريمات الرسمية على المسرح ({activeHonors.length} فقرات • {totalHonoringSlots} طفل مكرّم)</span>
              </h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                أضف التكريمات بالترتيب الذي تريده (مثلاً: تكريم رئيس الجمهورية أولاً، ثم نقيب المبرمجين، إلخ)، واختر أي عدد من الأطفال المسجلين مع إمكانية تكرار نفس الطفل بأكثر من تكريم.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  openHonoringSequencePrintWindow(activeHonors, graduatesById, {
                    mode: 'sequential',
                    title: 'دليل وتسلسل التكريمات الرسمي على المسرح',
                    childSupervisorMap
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-yellow-400 hover:brightness-105 text-slate-950 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة كل التكريمات بشكل متسلسل (PDF واحد)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  openHonoringSequencePrintWindow(activeHonors, graduatesById, {
                    mode: 'page_per_batch',
                    title: 'أوراق التكريمات الرسمية — ورقة لكل تكريم',
                    childSupervisorMap
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-[#082046] hover:bg-sky-900 text-amber-300 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
              >
                <FileText className="w-4 h-4" />
                <span>ورقة مستقلة لكل تكريم ({activeHonors.length} A4)</span>
              </button>
            </div>
          </div>

          {/* Open / Create New Honoring Batch Form */}
          {!readOnly && (
            <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs space-y-2.5">
              <div className="text-xs font-alexandria font-black text-sky-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>فتح تكريم جديد وإضافته للتسلسل (كتابة يدوية):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <input
                  type="text"
                  value={newHonorTitle}
                  onChange={(e) => setNewHonorTitle(e.target.value)}
                  placeholder="عنوان التكريم (مثال: تكريم نقيب المبرمجين / تكريم شركة الغدير...)"
                  className="sm:col-span-4 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-900"
                />
                <input
                  type="text"
                  value={newHonorPresenter}
                  onChange={(e) => setNewHonorPresenter(e.target.value)}
                  placeholder="اسم المُكرِّم / الشخصية (اختياري)"
                  className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={newHonorRole}
                  onChange={(e) => setNewHonorRole(e.target.value)}
                  placeholder="الصفة / المنصب (اختياري)"
                  className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddHonorBatch}
                  className="sm:col-span-2 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-alexandria font-black inline-flex items-center justify-center gap-1 shadow-xs cursor-pointer transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>فتح تكريم</span>
                </button>
              </div>
            </div>
          )}

          {/* Honoring Batches Sequential List */}
          <div className="space-y-4">
            {activeHonors.map((batch, bIdx) => {
              const selectedIds = batch.studentIds || [];
              const selectedSet = new Set(selectedIds);
              const isPickerOpen = activeHonorPickerId === batch.id;

              const pickerCandidates = isPickerOpen
                ? allGraduates.filter((g) => {
                    if (honorGroupFilter !== 'all' && childSupervisorMap[g.uid]?.groupId !== honorGroupFilter) {
                      return false;
                    }
                    const q = honorChildSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      g.name.toLowerCase().includes(q) ||
                      g.initiativeCode.toLowerCase().includes(q) ||
                      g.project.toLowerCase().includes(q)
                    );
                  })
                : [];

              return (
                <div
                  key={batch.id || bIdx}
                  className="bg-white rounded-2xl border-2 border-amber-300/80 overflow-hidden shadow-sm"
                >
                  {/* Batch Header */}
                  <div className="p-3.5 bg-gradient-to-l from-[#082046] via-[#133b80] to-[#082046] text-white space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-alexandria font-black text-xs shrink-0">
                          تسلسل #{bIdx + 1}
                        </span>
                        {readOnly ? (
                          <span className="font-alexandria font-black text-sm text-white">{batch.title}</span>
                        ) : (
                          <input
                            type="text"
                            value={batch.title || ''}
                            onChange={(e) => updateHonorField(bIdx, 'title', e.target.value)}
                            className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white/10 border border-white/25 text-xs sm:text-sm font-alexandria font-black text-amber-200"
                            placeholder="عنوان التكريم..."
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] font-black text-amber-300">
                          {selectedIds.length} أطفال
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            openHonoringSequencePrintWindow([batch], graduatesById, {
                              mode: 'page_per_batch',
                              title: batch.title || `التكريم #${bIdx + 1}`,
                              childSupervisorMap
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black inline-flex items-center gap-1 cursor-pointer transition"
                          title="طباعة هذا التكريم لوحده (A4)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>طباعة</span>
                        </button>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveHonorBatch(bIdx, -1)}
                              disabled={bIdx === 0}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-sky-500 disabled:opacity-35 text-white cursor-pointer"
                              title="تقديم بالتسلسل للأعلى"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveHonorBatch(bIdx, 1)}
                              disabled={bIdx === activeHonors.length - 1}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-sky-500 disabled:opacity-35 text-white cursor-pointer"
                              title="تأخير بالتسلسل للأسفل"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteHonorBatch(bIdx, batch.title)}
                              className="p-1.5 rounded-lg bg-rose-500/25 hover:bg-rose-500 text-rose-200 hover:text-white cursor-pointer"
                              title="حذف التكريم"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Presenter & Notes Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        disabled={readOnly}
                        value={batch.presenterName || ''}
                        onChange={(e) => updateHonorField(bIdx, 'presenterName', e.target.value)}
                        placeholder="اسم الشخصية / الجهة المُكرِّمة..."
                        className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        disabled={readOnly}
                        value={batch.presenterRole || ''}
                        onChange={(e) => updateHonorField(bIdx, 'presenterRole', e.target.value)}
                        placeholder="الصفة الرسمية..."
                        className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        disabled={readOnly}
                        value={batch.notes || ''}
                        onChange={(e) => updateHonorField(bIdx, 'notes', e.target.value)}
                        placeholder="ملاحظة لعريف الحفل / المراسم..."
                        className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Selected Children inside this Honoring Batch */}
                  <div className="p-4 space-y-3">
                    {!readOnly && (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveHonorPickerId(isPickerOpen ? '' : batch.id);
                              setHonorChildSearch('');
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-alexandria font-black inline-flex items-center gap-1.5 cursor-pointer transition ${
                              isPickerOpen
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300'
                            }`}
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>
                              {isPickerOpen
                                ? 'إخفاء قائمة اختيار الأطفال'
                                : `اختيار أطفال من المسجلين (${allGraduates.length})`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => addQuickCountToHonorBatch(bIdx, 8)}
                            className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black cursor-pointer transition"
                          >
                            + إضافة 8 أطفال
                          </button>
                          <button
                            type="button"
                            onClick={() => addQuickCountToHonorBatch(bIdx, 12)}
                            className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black cursor-pointer transition"
                          >
                            + إضافة 12 طفلاً
                          </button>

                          <select
                            value=""
                            onChange={(e) => addWholeSupervisorGroupToHonor(bIdx, e.target.value)}
                            className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700"
                          >
                            <option value="">+ إضافة مجموعة مشرف كاملة...</option>
                            {activeGroups.map((g, gi) => (
                              <option key={g.id || gi} value={g.id}>
                                {g.title} {g.supervisorName ? `(${g.supervisorName})` : ''} — {g.studentIds?.length || 0} أطفال
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => updateHonorField(bIdx, 'studentIds', [])}
                            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            تفريغ أطفال هذا التكريم
                          </button>
                        )}
                      </div>
                    )}

                    {/* Registered Children Multi-Select Picker (Duplicates across different honors ALLOWED!) */}
                    {!readOnly && isPickerOpen && (
                      <div className="p-3.5 rounded-2xl bg-sky-50/70 border-2 border-sky-200 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-3.5 h-3.5 text-sky-500 absolute right-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={honorChildSearch}
                              onChange={(e) => setHonorChildSearch(e.target.value)}
                              placeholder="ابحث باسم الطفل المسجل أو الكود أو المشروع (يمكن اختيار نفس الطفل بأكثر من تكريم)..."
                              className="w-full pr-8 pl-3 py-2 rounded-xl bg-white border border-sky-300 text-xs font-bold"
                            />
                          </div>
                          <select
                            value={honorGroupFilter}
                            onChange={(e) => setHonorGroupFilter(e.target.value)}
                            className="px-2.5 py-2 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-700"
                          >
                            <option value="all">كل المجموعات ({allGraduates.length})</option>
                            {activeGroups.map((g, gi) => (
                              <option key={g.id || gi} value={g.id}>
                                {g.title} {g.supervisorName ? `— ${g.supervisorName}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-60 overflow-y-auto pl-1">
                          {pickerCandidates.map((cand) => {
                            const isInThis = selectedSet.has(cand.uid);
                            const totalTimes = childHonorCountMap[cand.uid] || 0;
                            const sup = childSupervisorMap[cand.uid];
                            return (
                              <button
                                key={cand.uid}
                                type="button"
                                onClick={() => toggleChildInHonorBatch(bIdx, cand.uid)}
                                className={`p-2 rounded-xl border text-right flex items-center justify-between gap-2 transition cursor-pointer ${
                                  isInThis
                                    ? 'bg-[#082046] text-white border-amber-400 shadow-xs'
                                    : 'bg-white hover:bg-amber-50/70 text-slate-800 border-slate-200'
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="text-[11.5px] font-black truncate flex items-center gap-1">
                                    {isInThis && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                                    <span className="truncate">{cand.name}</span>
                                  </div>
                                  <div className={`text-[9.5px] truncate ${isInThis ? 'text-sky-200' : 'text-slate-500'}`}>
                                    {cand.initiativeCode} {sup?.supervisorName ? `• المشرف: ${sup.supervisorName}` : ''}
                                  </div>
                                </div>
                                {totalTimes > 0 && (
                                  <span
                                    className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                                      isInThis ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                                    }`}
                                    title="عدد مرات اختيار هذا الطفل في التكريمات (التكرار مسموح بالكامل)"
                                  >
                                    ×{totalTimes}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Ordered Children Chips/Rows for This Honoring Batch */}
                    {selectedIds.length === 0 ? (
                      <div className="text-center py-5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs font-bold text-slate-500">
                        لم يتم اختيار أطفال لـ «{batch.title}» بعد — اضغط «اختيار أطفال من المسجلين» أعلاه.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {selectedIds.map((uid, kIdx) => {
                          const kid = graduatesById[uid];
                          if (!kid) return null;
                          const sup = childSupervisorMap[uid];
                          return (
                            <div
                              key={`${uid}-${kIdx}`}
                              className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/90 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-full bg-[#082046] text-amber-300 text-[11px] font-black flex items-center justify-center shrink-0">
                                  {kIdx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-black text-slate-900 truncate">{kid.name}</div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {kid.initiativeCode}
                                    {sup?.supervisorName ? ` • المشرف: ${sup.supervisorName}` : ''}
                                  </div>
                                </div>
                              </div>

                              {!readOnly && (
                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => moveChildInHonorBatch(bIdx, kIdx, -1)}
                                    disabled={kIdx === 0}
                                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-600 cursor-pointer"
                                    title="تقديم"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveChildInHonorBatch(bIdx, kIdx, 1)}
                                    disabled={kIdx === selectedIds.length - 1}
                                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-600 cursor-pointer"
                                    title="تأخير"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleChildInHonorBatch(bIdx, uid)}
                                    className="p-1 rounded hover:bg-rose-100 text-rose-500 cursor-pointer"
                                    title="إزالة من هذا التكريم"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
