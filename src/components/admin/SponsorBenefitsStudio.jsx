import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Upload
} from 'lucide-react';
import {
  DEFAULT_SPONSOR_BENEFITS,
  SPONSOR_TIER_PRESETS,
  SPONSOR_BENEFITS_DRAFT_KEY,
  openSponsorBenefitsPrintWindow,
  buildSponsorBenefitsWhatsAppText,
  resolveSponsorBenefitText
} from '../../utils/print/sponsorPackagePrint';

function buildInitialDraft() {
  const defaultDraft = {
    docMode: 'package', // 'package' | 'agreement'
    presetId: 'gold',
    sponsorName: '',
    tierLabel: 'الراعي الرسمي وشريك النجاح',
    representativeName: '',
    contributionNote: '',
    sponsorLogo: '',
    kidsCount: 10,
    vipSeats: 3,
    rollupsCount: 2,
    introText:
      'تثميناً لدوركم الرائد في دعم الطفولة والابتكار الرقمي وإنجاح حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» (172 خريجاً و40 مشروعاً علمياً حياً)، تلتزم اللجنة المنظمة بتوفير كافة المزايا والاستحقاقات البروتوكولية والإعلامية المدرجة أدناه لصالح جهتكم الموقرة:',
    extraNotes:
      'يرجى تزويد اللجنة المنظمة بالشعار الرسمي للجهة بدقة عالية (PNG/PDF) قبل موعد الاحتفالية لتثبيته في المطبوعات والمنصة والبوث الرئيسي، وتنسيق تسليم ستاندات الرول أب والهدايا قبل الساعة 1:30 ظهراً يوم الحفل.',
    benefits: DEFAULT_SPONSOR_BENEFITS.map((b) => ({ ...b }))
  };

  if (typeof window === 'undefined') return defaultDraft;
  try {
    const raw = localStorage.getItem(SPONSOR_BENEFITS_DRAFT_KEY);
    if (!raw) return defaultDraft;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultDraft;
    return {
      ...defaultDraft,
      ...parsed,
      benefits:
        Array.isArray(parsed.benefits) && parsed.benefits.length > 0
          ? parsed.benefits
          : defaultDraft.benefits
    };
  } catch {
    return defaultDraft;
  }
}

export default function SponsorBenefitsStudio({
  sponsorsList = [],
  prefillSponsor = null,
  onClearPrefill,
  handleImageFileUpload,
  defaultOpen = false
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState(buildInitialDraft);
  const [newBenefitTitle, setNewBenefitTitle] = useState('');
  const [newBenefitText, setNewBenefitText] = useState('');
  const [copiedWa, setCopiedWa] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SPONSOR_BENEFITS_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore storage quota
    }
  }, [draft]);

  useEffect(() => {
    if (!prefillSponsor) return;
    setIsOpen(true);
    setDraft((prev) => ({
      ...prev,
      sponsorName: prefillSponsor.name || prev.sponsorName,
      tierLabel: prefillSponsor.role || prev.tierLabel,
      sponsorLogo: prefillSponsor.logo || '',
      representativeName: prefillSponsor.representativeName || prev.representativeName
    }));
    if (onClearPrefill) onClearPrefill();
  }, [prefillSponsor, onClearPrefill]);

  const applyPreset = (preset) => {
    setDraft((prev) => ({
      ...prev,
      presetId: preset.id,
      tierLabel: preset.roleTitle,
      kidsCount: preset.kidsCount,
      vipSeats: preset.vipSeats,
      rollupsCount: preset.rollupsCount,
      benefits: prev.benefits.map((b) => {
        const isDefault = DEFAULT_SPONSOR_BENEFITS.some((db) => db.id === b.id);
        return isDefault ? { ...b, enabled: preset.enabledIds.includes(b.id) } : b;
      })
    }));
  };

  const handleSelectExistingSponsor = (idxStr) => {
    if (idxStr === '') return;
    const sp = sponsorsList[Number(idxStr)];
    if (!sp) return;
    setDraft((prev) => ({
      ...prev,
      sponsorName: sp.name || '',
      tierLabel: sp.role || prev.tierLabel,
      sponsorLogo: sp.logo || ''
    }));
  };

  const handleAddBenefit = () => {
    if (!newBenefitTitle.trim() && !newBenefitText.trim()) return;
    setDraft((prev) => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        {
          id: `custom-${Date.now()}`,
          enabled: true,
          title: newBenefitTitle.trim() || 'ميزة رعاية إضافية',
          text: newBenefitText.trim()
        }
      ]
    }));
    setNewBenefitTitle('');
    setNewBenefitText('');
  };

  const handleResetDefaults = () => {
    try {
      localStorage.removeItem(SPONSOR_BENEFITS_DRAFT_KEY);
    } catch {
      // ignore
    }
    setDraft(buildInitialDraft());
  };

  const handleCopyWhatsApp = async () => {
    const text = buildSponsorBenefitsWhatsAppText(draft);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2500);
    } catch {
      // ignore
    }
  };

  const enabledCount = draft.benefits.filter((b) => b.enabled !== false).length;

  return (
    <div
      id="sponsor-benefits-studio"
      className="rounded-2xl border-2 border-amber-300/80 dark:border-amber-600/50 bg-gradient-to-l from-[#082046]/[0.04] via-amber-50/60 to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 overflow-hidden shadow-sm"
    >
      {/* Header Banner */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-[#061738] via-[#0c2d66] to-[#061738] text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-alexandria font-black text-xs sm:text-sm text-amber-200">
              وثيقة واتفاقية مزايا واستحقاقات الرعاة للطباعة الرسمية (A4)
            </h5>
            <p className="text-[11px] text-sky-200/90">
              خصّص اسم الراعي وعدد الأطفال المكرّمين والشعارات والمواد الترويجية واطبع الوثيقة فوراً أو انسخها للواتساب.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openSponsorBenefitsPrintWindow(draft, { directPrint: false })}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>معاينة وطباعة (A4)</span>
          </button>
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedWa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWa ? 'تم النسخ ✓' : 'نسخ للواتساب'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <span>{isOpen ? 'إخفاء المحرر' : 'تخصيص النصوص والبنود'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Row 1: Quick Presets & Document Mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 ml-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>باقات جاهزة:</span>
              </span>
              {SPONSOR_TIER_PRESETS.map((pr) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => applyPreset(pr)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer ${
                    draft.presetId === pr.id
                      ? 'bg-[#082046] text-amber-300 border-amber-400 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setDraft((p) => ({ ...p, docMode: 'package' }))}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                  draft.docMode === 'package'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                وثيقة مزايا واستحقاقات
              </button>
              <button
                type="button"
                onClick={() => setDraft((p) => ({ ...p, docMode: 'agreement' }))}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                  draft.docMode === 'agreement'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                اتفاقية رعاية (مع توقيع وختم الراعي)
              </button>
            </div>
          </div>

          {/* Row 2: Sponsor Identity & Dynamic Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                تعبئة سريعة من قائمة الرعاة ({sponsorsList.length})
              </label>
              <select
                value=""
                onChange={(e) => handleSelectExistingSponsor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="">-- اختر راعياً حالياً أو اكتب يدوياً --</option>
                {sponsorsList.map((sp, idx) => (
                  <option key={idx} value={idx}>
                    {sp.name} ({sp.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                اسم الشركة / الجهة الراعية
              </label>
              <input
                type="text"
                value={draft.sponsorName}
                onChange={(e) => setDraft((p) => ({ ...p, sponsorName: e.target.value }))}
                placeholder="مثال: مجمع الأميرات السكني"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                صفة / فئة الرعاية
              </label>
              <input
                type="text"
                value={draft.tierLabel}
                onChange={(e) => setDraft((p) => ({ ...p, tierLabel: e.target.value }))}
                placeholder="مثال: الراعي الرسمي الرئيسي"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                عناية / ممثل الجهة (اختياري)
              </label>
              <input
                type="text"
                value={draft.representativeName}
                onChange={(e) => setDraft((p) => ({ ...p, representativeName: e.target.value }))}
                placeholder="مثال: الأستاذ ... المحترم"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-extrabold text-amber-800 dark:text-amber-300 mb-1">
                عدد الأطفال المكرّمين
              </label>
              <input
                type="number"
                min={0}
                max={172}
                value={draft.kidsCount}
                onChange={(e) => setDraft((p) => ({ ...p, kidsCount: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-black text-center text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-sky-800 dark:text-sky-300 mb-1">
                عدد مقاعد VIP
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={draft.vipSeats}
                onChange={(e) => setDraft((p) => ({ ...p, vipSeats: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 text-xs font-black text-center text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-indigo-800 dark:text-indigo-300 mb-1">
                عدد ستاندات رول أب
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={draft.rollupsCount}
                onChange={(e) => setDraft((p) => ({ ...p, rollupsCount: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-black text-center text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                المساهمة / الباقة (اختياري)
              </label>
              <input
                type="text"
                value={draft.contributionNote}
                onChange={(e) => setDraft((p) => ({ ...p, contributionNote: e.target.value }))}
                placeholder="اتركه فارغاً لإخفائه"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {handleImageFileUpload && (
                <label className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-slate-700 text-[11px] font-black text-sky-700 dark:text-sky-300 cursor-pointer flex items-center justify-center gap-1 hover:bg-sky-50 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{draft.sponsorLogo ? 'تغيير الشعار ✓' : 'شعار الراعي'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageFileUpload(e.target.files?.[0], (dataUrl) =>
                        setDraft((p) => ({ ...p, sponsorLogo: dataUrl }))
                      )
                    }
                  />
                </label>
              )}
              {draft.sponsorLogo && (
                <button
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, sponsorLogo: '' }))}
                  className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                  title="إزالة شعار الراعي"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Row 3: Editable Benefits Checklist */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h6 className="text-xs font-black text-slate-900 dark:text-white font-alexandria">
                بنود المزايا والاستحقاقات القابلة للتعديل ({enabledCount} من {draft.benefits.length} مفعّل للطباعة):
              </h6>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة النصوص الافتراضية</span>
              </button>
            </div>

            <div className="space-y-2">
              {draft.benefits.map((b, idx) => {
                const resolvedPreviewTitle = resolveSponsorBenefitText(b.title, draft);
                return (
                  <div
                    key={b.id || idx}
                    className={`p-3 rounded-xl border transition ${
                      b.enabled !== false
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-65'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={b.enabled !== false}
                        onChange={(e) => {
                          const next = [...draft.benefits];
                          next[idx] = { ...next[idx], enabled: e.target.checked };
                          setDraft((p) => ({ ...p, benefits: next }));
                        }}
                        className="mt-1.5 w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={b.title}
                          onChange={(e) => {
                            const next = [...draft.benefits];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setDraft((p) => ({ ...p, benefits: next }));
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          placeholder="عنوان الميزة"
                        />
                        <textarea
                          rows={2}
                          value={b.text}
                          onChange={(e) => {
                            const next = [...draft.benefits];
                            next[idx] = { ...next[idx], text: e.target.value };
                            setDraft((p) => ({ ...p, benefits: next }));
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
                          placeholder="وصف الميزة"
                        />
                        {(b.title.includes('{') || b.text.includes('{')) && (
                          <div className="text-[10px] font-bold text-sky-700 dark:text-sky-400">
                            معاينة بعد تطبيق الأرقام: «{resolvedPreviewTitle}»
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            benefits: p.benefits.filter((_, i) => i !== idx)
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer shrink-0"
                        title="حذف البند"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Benefit */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={newBenefitTitle}
                onChange={(e) => setNewBenefitTitle(e.target.value)}
                placeholder="عنوان ميزة إضافية (مثال: مساحة بوث عرض خاص)"
                className="sm:col-span-4 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newBenefitText}
                onChange={(e) => setNewBenefitText(e.target.value)}
                placeholder="تفاصيل الميزة الإضافية..."
                className="sm:col-span-6 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="sm:col-span-2 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند</span>
              </button>
            </div>
          </div>

          {/* Row 4: Intro & Organizational Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                الديباجة الافتتاحية للوثيقة
              </label>
              <textarea
                rows={2}
                value={draft.introText}
                onChange={(e) => setDraft((p) => ({ ...p, introText: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                ملاحظات تنظيمية (اتركها فارغة لإخفائها من الطباعة)
              </label>
              <textarea
                rows={2}
                value={draft.extraNotes}
                onChange={(e) => setDraft((p) => ({ ...p, extraNotes: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>

          {/* Bottom Print Action Bar */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedWa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedWa ? 'تم نسخ نص الواتساب ✓' : 'نسخ نص المزايا للواتساب'}</span>
            </button>
            <button
              type="button"
              onClick={() => openSponsorBenefitsPrintWindow(draft, { directPrint: true })}
              className="px-4 py-2.5 rounded-xl bg-[#082046] hover:bg-sky-900 text-amber-300 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية (A4)</span>
            </button>
            <button
              type="button"
              onClick={() => openSponsorBenefitsPrintWindow(draft, { directPrint: false })}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>معاينة وطباعة الوثيقة الرسمية (A4 PDF)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
