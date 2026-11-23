import React, { useState, useMemo } from 'react';
import {
  Printer,
  Save,
  Trash2,
  Search,
  Download,
  Image as ImageIcon,
  FileSpreadsheet,
  Award,
  CreditCard,
  CheckSquare,
  Square,
  Sun,
  Moon,
  Plus,
  Settings2,
  Eye,
  X,
  Users,
  FileText,
  Loader2,
  Package
} from 'lucide-react';
import {
  renderGraduateEntryBadgePng,
  downloadSingleGraduateBadgePng,
  downloadBulkGraduateBadgesZip
} from '../../utils/graduateBadgePng';
import {
  exportGraduatesToCsv,
  openGraduatesRosterPrintWindow,
  openBatchEntryBadgesPrintWindow,
  openBatchCertificatesPrintWindow
} from '../../utils/print/graduateBatchPrint';
import { openGraduateBadgePrintWindow } from '../../utils/print/graduatePrint';
import { generateOfficialQrDataUrl } from '../../utils/qrVerify';

export default function CmsGraduatesTab({
  cohortsList,
  setCohortsList,
  selectedCohortIdx,
  setSelectedCohortIdx,
  currentCohort,
  newStudentName,
  setNewStudentName,
  handleAddGraduateToCohort,
  handleSaveCohorts,
  handlePrefillIdCardAndOpen,
  isSaving,
  readOnly = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cohortFilter, setCohortFilter] = useState('all'); // 'all' | index string
  const [trackFilter, setTrackFilter] = useState('all');
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const [badgeVariant, setBadgeVariant] = useState('light'); // 'light' | 'dark'
  const [showManagePanel, setShowManagePanel] = useState(false);

  // Busy / Progress State for PNG ZIP & Batch Print
  const [busyState, setBusyState] = useState({
    active: false,
    label: '',
    done: 0,
    total: 0,
    currentName: ''
  });
  const [rowBusyKey, setRowBusyKey] = useState('');

  // Live PNG Badge Preview Modal
  const [previewBadge, setPreviewBadge] = useState(null); // { dataUrl, filename, grad, cohortName }

  // Flatten ALL graduates across all cohorts with coordinates for inline editing/deleting
  const allRows = useMemo(() => {
    const rows = [];
    let globalSerial = 1;
    (cohortsList || []).forEach((cohort, cIdx) => {
      const list = cohort.graduates || cohort.students || [];
      list.forEach((raw, sIdx) => {
        const grad =
          typeof raw === 'object' && raw !== null
            ? raw
            : {
                id: `DK-2026-${String(globalSerial).padStart(3, '0')}`,
                initiativeCode: `1001-IQ-${String(globalSerial).padStart(3, '0')}`,
                name: String(raw || ''),
                track: cohort.track || 'البرمجة والمهارات الرقمية',
                ageGroup: cohort.ageStage || cohort.ageRange || '6 – 14 سنة',
                project: 'مشروع تخرج الدفعة الأولى — مبادرة 1001 طفل رقمي',
                grade: 'امتياز'
              };
        const rowKey = `${cIdx}:${sIdx}:${grad.id || grad.initiativeCode || globalSerial}`;
        rows.push({
          rowKey,
          serial: globalSerial++,
          cIdx,
          sIdx,
          cohortName: cohort.name || `المجموعة ${cIdx + 1}`,
          cohortCode: cohort.code || `COHORT-${String(cIdx + 1).padStart(2, '0')}`,
          grad
        });
      });
    });
    return rows;
  }, [cohortsList]);

  const uniqueTracks = useMemo(() => {
    const set = new Set();
    allRows.forEach((r) => {
      if (r.grad.track) set.add(r.grad.track);
    });
    return Array.from(set);
  }, [allRows]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allRows.filter((row) => {
      if (cohortFilter !== 'all' && String(row.cIdx) !== String(cohortFilter)) return false;
      if (trackFilter !== 'all' && row.grad.track !== trackFilter) return false;
      if (!q) return true;
      return (
        String(row.grad.name || '').toLowerCase().includes(q) ||
        String(row.grad.initiativeCode || '').toLowerCase().includes(q) ||
        String(row.grad.id || '').toLowerCase().includes(q) ||
        String(row.cohortName || '').toLowerCase().includes(q) ||
        String(row.grad.track || '').toLowerCase().includes(q) ||
        String(row.grad.project || '').toLowerCase().includes(q)
      );
    });
  }, [allRows, cohortFilter, trackFilter, searchQuery]);

  // Target rows for bulk actions: selected rows if any, otherwise all currently filtered rows!
  const selectedRowsList = useMemo(
    () => allRows.filter((r) => selectedKeys.has(r.rowKey)),
    [allRows, selectedKeys]
  );

  const actionTargetRows = selectedRowsList.length > 0 ? selectedRowsList : filteredRows;
  const targetLabel =
    selectedRowsList.length > 0
      ? `المحددين (${selectedRowsList.length})`
      : filteredRows.length === allRows.length
      ? `الكل (${allRows.length})`
      : `المعروضين (${filteredRows.length})`;

  const allFilteredSelected =
    filteredRows.length > 0 && filteredRows.every((r) => selectedKeys.has(r.rowKey));

  const toggleSelectRow = (rowKey) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const toggleSelectFiltered = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredRows.forEach((r) => next.delete(r.rowKey));
      } else {
        filteredRows.forEach((r) => next.add(r.rowKey));
      }
      return next;
    });
  };

  const selectAllGraduates = () => {
    setSelectedKeys(new Set(allRows.map((r) => r.rowKey)));
  };

  const clearSelection = () => {
    setSelectedKeys(new Set());
  };

  // Inline Edit Name
  const handleInlineEditName = (cIdx, sIdx, newName) => {
    if (readOnly) return;
    const copy = JSON.parse(JSON.stringify(cohortsList));
    const listRef = copy[cIdx].graduates || copy[cIdx].students || [];
    if (typeof listRef[sIdx] === 'object' && listRef[sIdx] !== null) {
      listRef[sIdx].name = newName;
    } else {
      listRef[sIdx] = { name: newName };
    }
    copy[cIdx].graduates = listRef;
    setCohortsList(copy);
  };

  // Inline Delete Graduate
  const handleDeleteGraduate = (cIdx, sIdx, name) => {
    if (readOnly) return;
    if (!window.confirm(`هل تريد حذف الخريج «${name}» من القائمة؟`)) return;
    const copy = JSON.parse(JSON.stringify(cohortsList));
    const listRef = copy[cIdx].graduates || copy[cIdx].students || [];
    copy[cIdx].graduates = listRef.filter((_, i) => i !== sIdx);
    setCohortsList(copy);
  };

  // Single Row: Download Entry Badge PNG
  const handleSinglePngDownload = async (row) => {
    setRowBusyKey(row.rowKey);
    try {
      await downloadSingleGraduateBadgePng(row.grad, row.cohortName, badgeVariant);
    } finally {
      setRowBusyKey('');
    }
  };

  // Single Row: Preview Entry Badge PNG
  const handleSinglePngPreview = async (row) => {
    setRowBusyKey(row.rowKey);
    try {
      const res = await renderGraduateEntryBadgePng(row.grad, {
        cohortName: row.cohortName,
        variant: badgeVariant
      });
      setPreviewBadge({ ...res, grad: row.grad, cohortName: row.cohortName });
    } finally {
      setRowBusyKey('');
    }
  };

  // Single Row: Direct Print Official Entry Badge (Light & Dark)
  const handleSingleBadgePrint = async (row) => {
    setRowBusyKey(row.rowKey);
    try {
      const code = row.grad.initiativeCode || row.grad.id || '1001-IQ-000';
      const qr = await generateOfficialQrDataUrl(
        {
          type: 'grad',
          code,
          name: row.grad.name || '',
          role: 'بطاقة دخول خريج معتمد — الدفعة الأولى',
          track: row.grad.track || '',
          extra: row.cohortName || ''
        },
        220
      );
      openGraduateBadgePrintWindow(row.grad, qr, row.grad.photoDataUrl || '');
    } finally {
      setRowBusyKey('');
    }
  };

  // Single Row: Direct Print Certificate
  const handleSingleCertPrint = async (row) => {
    setRowBusyKey(row.rowKey);
    try {
      await openBatchCertificatesPrintWindow([{ grad: row.grad, cohortName: row.cohortName }]);
    } finally {
      setRowBusyKey('');
    }
  };

  // BULK: Export Entry Badges as PNGs in a single ZIP (or direct PNG if only 1!)
  const handleBulkExportPngBadges = async () => {
    if (actionTargetRows.length === 0) return;
    if (actionTargetRows.length === 1) {
      await handleSinglePngDownload(actionTargetRows[0]);
      return;
    }
    setBusyState({
      active: true,
      label: `تصدير باجات الدخول PNG (${badgeVariant === 'light' ? 'النسخة النهارية' : 'النسخة الليلية'})`,
      done: 0,
      total: actionTargetRows.length,
      currentName: actionTargetRows[0]?.grad?.name || ''
    });
    try {
      await downloadBulkGraduateBadgesZip(
        actionTargetRows.map((r) => ({ grad: r.grad, cohortName: r.cohortName })),
        badgeVariant,
        (done, total, currentName) => {
          setBusyState((prev) => ({ ...prev, done, total, currentName }));
        }
      );
    } finally {
      setBusyState({ active: false, label: '', done: 0, total: 0, currentName: '' });
    }
  };

  // BULK: Print Entry Badges A4 (4 per page)
  const handleBulkPrintBadges = async () => {
    if (actionTargetRows.length === 0) return;
    setBusyState({
      active: true,
      label: 'تجهيز طباعة باجات الدخول الجماعية (A4)',
      done: 0,
      total: actionTargetRows.length,
      currentName: ''
    });
    try {
      await openBatchEntryBadgesPrintWindow(
        actionTargetRows.map((r) => ({ grad: r.grad, cohortName: r.cohortName })),
        badgeVariant,
        (done, total) => setBusyState((prev) => ({ ...prev, done, total }))
      );
    } finally {
      setBusyState({ active: false, label: '', done: 0, total: 0, currentName: '' });
    }
  };

  // BULK: Print Certificates A4 Landscape
  const handleBulkPrintCertificates = async () => {
    if (actionTargetRows.length === 0) return;
    setBusyState({
      active: true,
      label: 'تجهيز طباعة شهادات التخرج الجماعية (A4)',
      done: 0,
      total: actionTargetRows.length,
      currentName: ''
    });
    try {
      await openBatchCertificatesPrintWindow(
        actionTargetRows.map((r) => ({ grad: r.grad, cohortName: r.cohortName })),
        (done, total) => setBusyState((prev) => ({ ...prev, done, total }))
      );
    } finally {
      setBusyState({ active: false, label: '', done: 0, total: 0, currentName: '' });
    }
  };

  // BULK: Print Official Roster Table A4
  const handlePrintRoster = () => {
    if (actionTargetRows.length === 0) return;
    const label =
      cohortFilter !== 'all' && cohortsList[Number(cohortFilter)]
        ? `كشف خريجي ${cohortsList[Number(cohortFilter)].name}`
        : selectedRowsList.length > 0
        ? `كشف الخريجين المحددين (${selectedRowsList.length})`
        : 'كشف خريجي مبادرة «1001» طفل رقمي — الدفعة الأولى';
    openGraduatesRosterPrintWindow(
      actionTargetRows.map((r) => ({ grad: r.grad, cohortName: r.cohortName })),
      label
    );
  };

  // BULK: Export Excel / CSV
  const handleExportExcelCsv = () => {
    if (actionTargetRows.length === 0) return;
    exportGraduatesToCsv(
      actionTargetRows.map((r) => ({ grad: r.grad, cohortName: r.cohortName })),
      'abdaa-1001-graduates-list'
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Cloud Save */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-sky-50 via-white to-amber-50/70 dark:bg-slate-800/70 p-4 rounded-2xl border border-sky-200/80 dark:border-slate-700">
        <div>
          <h4 className="font-alexandria font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>قائمة الخريجين الشاملة ({allRows.length} خريجاً) — بحث وتصدير PNG وطباعة جماعية</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            ابحث في جميع الخريجين، حدّد فرداً أو مجموعة أو الكل ({allRows.length})، وصدّر هويات وباجات الدخول كصور PNG عالية الدقة أو اطبعها مباشرة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {readOnly ? (
            <span className="px-3.5 py-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
              وضع المشاهدة والطباعة فقط — التعديل والحذف مغلقان
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowManagePanel((v) => !v)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition cursor-pointer ${
                  showManagePanel
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400'
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span>{showManagePanel ? 'إخفاء إدارة المجموعات' : 'إضافة خريج / تعديل المجموعات'}</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveCohorts}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'جارٍ الحفظ السحابي...' : 'حفظ التعديلات سحابياً'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Collapsible Cohort Add/Edit Panel */}
      {!readOnly && showManagePanel && currentCohort && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {cohortsList.map((c, idx) => (
              <button
                key={c.code || idx}
                type="button"
                onClick={() => setSelectedCohortIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  selectedCohortIdx === idx
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.name} ({(c.graduates || c.students || []).length})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">اسم المجموعة</label>
              <input
                type="text"
                value={currentCohort.name || ''}
                onChange={(e) => {
                  const copy = [...cohortsList];
                  copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], name: e.target.value };
                  setCohortsList(copy);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">المسار العلمي</label>
              <input
                type="text"
                value={currentCohort.track || ''}
                onChange={(e) => {
                  const copy = [...cohortsList];
                  copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], track: e.target.value };
                  setCohortsList(copy);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">المدرب المشرف</label>
              <input
                type="text"
                value={currentCohort.mentor || ''}
                onChange={(e) => {
                  const copy = [...cohortsList];
                  copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], mentor: e.target.value };
                  setCohortsList(copy);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">الفئة العمرية</label>
              <input
                type="text"
                value={currentCohort.ageStage || currentCohort.ageRange || ''}
                onChange={(e) => {
                  const copy = [...cohortsList];
                  copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], ageStage: e.target.value };
                  setCohortsList(copy);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder={`إضافة اسم خريج جديد إلى ${currentCohort.name}...`}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddGraduateToCohort}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خريج</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-sky-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الخريج، كود الدخول (1001-IQ)، المجموعة، أو المشروع..."
            className="w-full pr-10 pl-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="md:col-span-3">
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">جميع المجموعات ({allRows.length} خريجاً)</option>
            {cohortsList.map((c, idx) => (
              <option key={c.code || idx} value={String(idx)}>
                {c.name} ({(c.graduates || c.students || []).length})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">كل المسارات</option>
            {uniqueTracks.map((tr) => (
              <option key={tr} value={tr}>
                {tr}
              </option>
            ))}
          </select>
        </div>

        {/* Badge Theme Toggle (Light / Dark) for PNG Export & Print */}
        <div className="md:col-span-2 flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setBadgeVariant('light')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-black inline-flex items-center justify-center gap-1 cursor-pointer transition ${
              badgeVariant === 'light'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="باج الدخول بالنسخة النهارية الرسمية"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>نهاري</span>
          </button>
          <button
            type="button"
            onClick={() => setBadgeVariant('dark')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-black inline-flex items-center justify-center gap-1 cursor-pointer transition ${
              badgeVariant === 'dark'
                ? 'bg-slate-900 text-sky-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="باج الدخول بالنسخة الملكية الليلية"
          >
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span>ملكي</span>
          </button>
        </div>
      </div>

      {/* Bulk Selection & Export / Print Action Command Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-l from-slate-900 via-[#0c2754] to-slate-900 text-white border border-sky-500/30 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black">
              الهدف الحالي: {targetLabel}
            </span>
            <span className="text-sky-200 font-bold">
              المعروض في القائمة: {filteredRows.length} من {allRows.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={selectAllGraduates}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition cursor-pointer"
            >
              تحديد الكل ({allRows.length})
            </button>
            <button
              type="button"
              onClick={toggleSelectFiltered}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-sky-200 transition cursor-pointer"
            >
              {allFilteredSelected ? 'إلغاء تحديد المعروض' : `تحديد المعروض (${filteredRows.length})`}
            </button>
            {selectedKeys.size > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/25 hover:bg-rose-500/40 text-[11px] font-bold text-rose-200 transition cursor-pointer"
              >
                مسح التحديد ({selectedKeys.size})
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busyState.active || actionTargetRows.length === 0}
            onClick={handleBulkExportPngBadges}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:brightness-105 disabled:opacity-50 text-slate-950 font-alexandria font-black text-xs inline-flex items-center gap-2 shadow-md cursor-pointer transition"
          >
            {actionTargetRows.length > 1 ? (
              <Package className="w-4 h-4" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            <span>
              تصدير باجات الدخول PNG {actionTargetRows.length > 1 ? '(ZIP) ' : ''}لـ {targetLabel}
            </span>
          </button>

          <button
            type="button"
            disabled={busyState.active || actionTargetRows.length === 0}
            onClick={handleBulkPrintBadges}
            className="px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <CreditCard className="w-4 h-4" />
            <span>طباعة باجات الدخول A4 ({actionTargetRows.length})</span>
          </button>

          <button
            type="button"
            disabled={busyState.active || actionTargetRows.length === 0}
            onClick={handleBulkPrintCertificates}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <Award className="w-4 h-4" />
            <span>طباعة شهادات التخرج ({actionTargetRows.length})</span>
          </button>

          <button
            type="button"
            disabled={busyState.active || actionTargetRows.length === 0}
            onClick={handlePrintRoster}
            className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-50 text-white font-black text-xs inline-flex items-center gap-1.5 border border-white/20 cursor-pointer transition"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>طباعة كشف الأسماء (A4)</span>
          </button>

          <button
            type="button"
            disabled={busyState.active || actionTargetRows.length === 0}
            onClick={handleExportExcelCsv}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير Excel (CSV)</span>
          </button>
        </div>

        {/* Live Progress Indicator during Bulk PNG ZIP / Print */}
        {busyState.active && (
          <div className="p-3 rounded-xl bg-white/10 border border-amber-400/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-2 text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {busyState.label}: {busyState.done} / {busyState.total}
                </span>
              </span>
              <span className="text-sky-200 truncate max-w-[260px]">{busyState.currentName}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-sky-400 transition-all duration-150"
                style={{
                  width: `${busyState.total > 0 ? Math.round((busyState.done / busyState.total) * 100) : 0}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Unified Searchable Graduates List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
          <table className="w-full text-right border-collapse min-w-[820px]">
            <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 text-[11px] font-alexandria font-black text-slate-700">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectFiltered}
                    className="inline-flex items-center justify-center text-sky-700 hover:text-sky-900 cursor-pointer"
                    title="تحديد / إلغاء تحديد جميع النتائج"
                  >
                    {allFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2 w-12 text-center">#</th>
                <th className="py-3 px-3">{readOnly ? 'اسم الخريج' : 'اسم الخريج (قابل للتعديل السريع)'}</th>
                <th className="py-3 px-3 w-36">كود الدخول</th>
                <th className="py-3 px-3">المجموعة والمسار</th>
                <th className="py-3 px-3 text-center w-[335px]">التصدير PNG والطباعة المباشرة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                    لا توجد نتائج مطابقة للبحث «{searchQuery}» — جرّب مسح الفلتر أو البحث بكلمة أخرى.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const isSelected = selectedKeys.has(row.rowKey);
                  const isRowBusy = rowBusyKey === row.rowKey;
                  const code = row.grad.initiativeCode || row.grad.id || '';
                  return (
                    <tr
                      key={row.rowKey}
                      className={`transition-colors ${
                        isSelected ? 'bg-sky-50/90' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectRow(row.rowKey)}
                          className="inline-flex items-center justify-center cursor-pointer"
                          aria-label={`تحديد ${row.grad.name}`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-sky-500" />
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 px-2 text-center font-black text-sky-700">
                        {row.serial}
                      </td>

                      <td className="py-2 px-3">
                        {readOnly ? (
                          <div className="px-2.5 py-1 text-xs font-extrabold text-slate-900">
                            {row.grad.name || ''}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={row.grad.name || ''}
                            onChange={(e) => handleInlineEditName(row.cIdx, row.sIdx, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-extrabold text-slate-900"
                          />
                        )}
                        {row.grad.project && (
                          <div className="text-[10px] text-slate-400 px-2.5 truncate max-w-[300px]">
                            {row.grad.project}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          dir="ltr"
                          className="inline-block font-mono text-[11px] font-black px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200/80"
                        >
                          {code}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-extrabold text-[11px] text-slate-800">
                          {row.cohortName}
                        </div>
                        <div className="text-[10.5px] text-slate-500 truncate max-w-[200px]">
                          {row.grad.track}
                        </div>
                      </td>

                      <td className="py-2 px-3">
                        <div className="flex items-center justify-center gap-1 flex-nowrap whitespace-nowrap">
                          <button
                            type="button"
                            disabled={isRowBusy}
                            onClick={() => handleSinglePngDownload(row)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] inline-flex items-center gap-1 shadow-xs transition cursor-pointer disabled:opacity-50"
                            title="تحميل باج/هوية الدخول كصورة PNG عالية الدقة (900×1400)"
                          >
                            {isRowBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                            <span>PNG</span>
                          </button>

                          <button
                            type="button"
                            disabled={isRowBusy}
                            onClick={() => handleSinglePngPreview(row)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 transition cursor-pointer"
                            title="معاينة باج الدخول PNG قبل التحميل"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isRowBusy}
                            onClick={() => handleSingleBadgePrint(row)}
                            className="px-2 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-600 text-sky-800 hover:text-white font-black text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                            title="طباعة باج الدخول مباشرة"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>باج</span>
                          </button>

                          <button
                            type="button"
                            disabled={isRowBusy}
                            onClick={() => handleSingleCertPrint(row)}
                            className="px-2 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-600 text-indigo-800 hover:text-white font-black text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                            title="طباعة شهادة التخرج مباشرة"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>شهادة</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const memId = row.grad.initiativeCode
                                ? `ABD-ID-${row.grad.initiativeCode}`
                                : `ABD-ID-2026-${String(row.serial).padStart(4, '0')}`;
                              handlePrefillIdCardAndOpen({
                                fullName: row.grad.name,
                                membershipId: memId,
                                roleTitle: 'عضو خريج معتمد — مبادرة 1001 طفل رقمي',
                                track: row.grad.track || 'البرمجة والذكاء الاصطناعي والروبوتات',
                                ageStage: row.grad.ageGroup || 'الأعمار 6 – 14 سنة',
                                cityOrSchool: `${row.cohortName} — النجف الأشرف`,
                                badgeColor: '#0284c7'
                              });
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition cursor-pointer"
                            title={readOnly ? 'طباعة هوية PVC في تبويب الهويات' : 'إصدار هوية PVC في تبويب الهويات'}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => handleDeleteGraduate(row.cIdx, row.sIdx, row.grad.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition cursor-pointer"
                              title="حذف الخريج"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live PNG Entry Badge Preview Modal */}
      {previewBadge && (
        <div
          className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewBadge(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h5 className="font-alexandria font-black text-sm text-slate-900">
                  معاينة باج الدخول (PNG عالي الدقة 900×1400)
                </h5>
                <p className="text-[11px] text-slate-500 font-bold">{previewBadge.grad?.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewBadge(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-center bg-slate-100 rounded-2xl p-3">
              <img
                src={previewBadge.dataUrl}
                alt={previewBadge.filename}
                className="max-h-[460px] w-auto rounded-2xl shadow-lg"
              />
            </div>

            <div className="flex items-center gap-2">
              <a
                href={previewBadge.dataUrl}
                download={previewBadge.filename}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-alexandria font-black text-xs text-center inline-flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصورة الآن (PNG)</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewBadge(null)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
