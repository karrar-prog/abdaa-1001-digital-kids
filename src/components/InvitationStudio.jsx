import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  Mail,
  Download,
  FileText,
  Eye,
  Share2,
  Copy,
  Check,
  X,
  RotateCcw,
  Users,
  User,
  Sliders,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  Sparkles,
  Crown,
  QrCode,
  Building2,
  Upload,
  Trash2
} from 'lucide-react';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';
import {
  DEFAULT_INVITATION_DATA,
  INVITATION_TEMPLATES,
  INVITATION_STYLE_THEMES,
  PATRONAGE_PRESETS,
  renderInvitationToCanvas,
  renderInvitationPngOutput,
  downloadInvitationPng,
  exportInvitationPdf,
  exportBatchInvitationsPngZip,
  exportBatchInvitationsPdf
} from '../utils/invitationCardRenderer';

const HONORIFIC_PREFIXES = [
  'المهندس',
  'الأستاذ',
  'الدكتور',
  'معالي',
  'السيد',
  'الحاج',
  'الشيخ',
  'الدكتورة',
  'السيدة'
];

const MASDAR_PLACEMENTS = [
  { id: 'top_triple', label: 'الترويسة العلوية (صف 3 شعارات)', hint: 'افتراضي' },
  { id: 'bottom_wave', label: 'الشريط السفلي النيلي (وسط)' },
  { id: 'bottom_corner', label: 'الشريط السفلي (الزاوية اليسرى)' }
];

const MASDAR_VARIANTS = [
  { id: 'auto', label: 'تلقائي ذكي' },
  { id: 'full_white', label: 'الكامل (أبيض)' },
  { id: 'full_blue', label: 'الكامل (أزرق)' },
  { id: 'mark', label: 'رمز مصدر' }
];

const DEFAULT_BATCH_SAMPLE = `المهندس الحاج زهير شربة المحترم | رئيس غرفة تجارة النجف الأشرف
الأستاذ الدكتور المحترم | رئيس الجامعة
السيد المحترم | مدير المؤسسة الداعمة`;

function parseBatchGuests(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes('|') ? '|' : line.includes('—') ? '—' : line.includes(' - ') ? ' - ' : null;
      if (!sep) return { guestName: line, guestTitle: '' };
      const [namePart, ...rest] = line.split(sep);
      return {
        guestName: (namePart || '').trim(),
        guestTitle: rest.join(sep).trim()
      };
    })
    .filter((g) => g.guestName);
}

function InvitationStudioInner({ embedded = false, standalone = false, onClose }) {
  const [form, setForm] = useState(() => ({ ...DEFAULT_INVITATION_DATA }));
  const [mode, setMode] = useState('single'); // 'single' | 'batch'
  const [showAdvancedText, setShowAdvancedText] = useState(false);
  const [batchText, setBatchText] = useState(DEFAULT_BATCH_SAMPLE);
  const [copiedLink, setCopiedLink] = useState(false);

  const [busy, setBusy] = useState({ active: false, label: '', done: 0, total: 0, current: '' });
  const canvasRef = useRef(null);
  const customLogoInputRef = useRef(null);
  const presidentPhotoInputRef = useRef(null);
  const renderSeqRef = useRef(0);

  const handleUploadPresidentPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        playClickPop();
        setForm((prev) => ({
          ...prev,
          showPatronage: true,
          presidentPhotoUrl: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUploadCustomMasdarLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        playClickPop();
        setForm((prev) => ({
          ...prev,
          showMasdarLogo: true,
          masdarVariant: 'custom',
          customMasdarLogoUrl: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const batchGuests = useMemo(() => parseBatchGuests(batchText), [batchText]);

  // Live WYSIWYG Canvas Preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const seq = ++renderSeqRef.current;
    let cancelled = false;

    const previewData =
      mode === 'batch' && batchGuests.length > 0
        ? { ...form, guestName: batchGuests[0].guestName, guestTitle: batchGuests[0].guestTitle }
        : form;

    const rafId = requestAnimationFrame(async () => {
      if (cancelled || seq !== renderSeqRef.current) return;
      await renderInvitationToCanvas(canvas, previewData);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [form, mode, batchGuests]);

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const applyTemplate = (tpl) => {
    playClickPop();
    setForm((prev) => ({ ...prev, ...tpl.patch }));
  };

  const prependHonorific = (word) => {
    playClickPop();
    setForm((prev) => {
      const cur = (prev.guestName || '').trim();
      if (cur.startsWith(word)) return prev;
      return { ...prev, guestName: `${word} ${cur}`.trim() };
    });
  };

  const appendSuffix = (word) => {
    playClickPop();
    setForm((prev) => {
      const cur = (prev.guestName || '').trim().replace(/\s+(المحترم|المحترمة|الموقر)$/, '');
      return { ...prev, guestName: `${cur} ${word}`.trim() };
    });
  };

  const applyStatsPreset = (n1, n2, n3) => {
    playClickPop();
    setForm((prev) => ({
      ...prev,
      stat1Num: n1,
      stat2Num: n2,
      stat3Num: n3,
      bodyText: `بكل اعتزاز، يتشرف نادي أبدع للمهارات الذكية بدعوتكم لحضور\nحفل تخرج ${n1} طفلاً رقمياً في الدفعة الأولى، من بين ${n2} طفل\nأكملوا متطلبات المبادرة، من أصل ${n3} طفلاً التحقوا بها.`
    }));
  };

  const handleDownloadPng = async () => {
    playClickPop();
    setBusy({ active: true, label: 'جارٍ تصدير صورة الدعوة PNG...', done: 0, total: 1, current: '' });
    try {
      await downloadInvitationPng(form);
      playSuccessChime();
      try {
        confetti({ particleCount: 55, spread: 60, origin: { y: 0.65 } });
      } catch {
        // ignore
      }
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleExportPdf = async (directPrint = true) => {
    playClickPop();
    setBusy({ active: true, label: 'جارٍ تجهيز ملف PDF (A4)...', done: 0, total: 1, current: '' });
    try {
      await exportInvitationPdf(form, { directPrint });
      playSuccessChime();
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleSharePng = async () => {
    playClickPop();
    setBusy({ active: true, label: 'جارٍ تجهيز المشاركة...', done: 0, total: 1, current: '' });
    try {
      const { blob, dataUrl, filename } = await renderInvitationPngOutput(form);
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `دعوة حضور — ${form.guestName}`,
            text: `يسرنا دعوتكم لحضور حفل تخرج الدفعة الأولى من مبادرة «1001 طفل رقمي» — نادي أبدع للمهارات الذكية.`,
            files: [file]
          });
          playSuccessChime();
          return;
        }
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();
      playSuccessChime();
    } catch {
      // cancelled share
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleBatchPngZip = async () => {
    if (batchGuests.length === 0) return;
    playClickPop();
    setBusy({
      active: true,
      label: 'تصدير الدعوات كصور PNG (ZIP)',
      done: 0,
      total: batchGuests.length,
      current: batchGuests[0].guestName
    });
    try {
      await exportBatchInvitationsPngZip(batchGuests, form, (done, total, current) => {
        setBusy((p) => ({ ...p, done, total, current }));
      });
      playSuccessChime();
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleBatchPdf = async () => {
    if (batchGuests.length === 0) return;
    playClickPop();
    setBusy({
      active: true,
      label: 'تجهيز ملف PDF جماعي (صفحة A4 لكل ضيف)',
      done: 0,
      total: batchGuests.length,
      current: batchGuests[0].guestName
    });
    try {
      await exportBatchInvitationsPdf(
        batchGuests,
        form,
        (done, total, current) => setBusy((p) => ({ ...p, done, total, current })),
        { directPrint: false }
      );
      playSuccessChime();
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleCopyInviteUrl = () => {
    playClickPop();
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/invite`
        : 'https://abdaa.masdar.company/invite';
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  return (
    <div className={standalone ? 'max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 space-y-5' : 'space-y-5'}>
      {/* Top Royal Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-[#041230] via-[#0b2a66] to-[#041230] text-white p-4 sm:p-5 rounded-3xl border-2 border-amber-400/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/60 text-amber-300 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-alexandria font-black text-base sm:text-xl text-white leading-tight">
              منصة تصميم وتصدير الدعوات الرسمية (PDF وصورة PNG)
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-200/90 mt-0.5">
              تعديل مرن فوري لاسم الضيف والصفة وكافة النصوص والأرقام — تصدير فردي أو جماعي بدقة طباعة عالية
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyInviteUrl}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 border border-white/15 cursor-pointer transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copiedLink ? 'تم نسخ رابط /invite' : 'نسخ رابط الدعوات'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickPop();
              setForm({ ...DEFAULT_INVITATION_DATA });
            }}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold inline-flex items-center gap-1.5 border border-white/15 cursor-pointer transition"
            title="إعادة النص الافتراضي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>افتراضي</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/15 hover:bg-rose-500/80 text-white transition cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Workspace: Controls (7 cols) + Sticky Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LIVE PREVIEW & DIRECT EXPORT COLUMN (Left on desktop, top on mobile) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-3.5 order-1 lg:order-2">
          <div className="bg-white rounded-[28px] p-3.5 sm:p-4 border-2 border-amber-200/80 shadow-[0_20px_50px_-15px_rgba(7,27,64,0.22)] space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-alexandria font-black text-slate-800 inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {mode === 'batch'
                    ? `معاينة أول دعوة من القائمة (${batchGuests.length} ضيوف)`
                    : 'معاينة حية بدقة الطباعة A4 (1200×1690)'}
                </span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                PNG + A4 PDF
              </span>
            </div>

            <div className="flex justify-center bg-slate-950/5 rounded-2xl p-2">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[410px] h-auto rounded-2xl shadow-xl block"
              />
            </div>

            {/* Single Mode Export Buttons */}
            {mode === 'single' ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy.active}
                    onClick={handleDownloadPng}
                    className="py-3 px-3 rounded-2xl bg-gradient-to-l from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 disabled:opacity-60 text-slate-950 font-alexandria font-black text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>تصدير صورة (PNG)</span>
                  </button>

                  <button
                    type="button"
                    disabled={busy.active}
                    onClick={() => handleExportPdf(true)}
                    className="py-3 px-3 rounded-2xl bg-gradient-to-l from-[#082046] to-sky-700 hover:brightness-110 disabled:opacity-60 text-white font-alexandria font-black text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>تصدير PDF / طباعة</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy.active}
                    onClick={() => handleExportPdf(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 border border-slate-200 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>معاينة ورقة A4 PDF</span>
                  </button>

                  <button
                    type="button"
                    disabled={busy.active}
                    onClick={handleSharePng}
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مشاركة (واتساب)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Batch Mode Export Buttons */
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={busy.active || batchGuests.length === 0}
                  onClick={handleBatchPngZip}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-l from-amber-500 to-yellow-400 hover:brightness-105 disabled:opacity-50 text-slate-950 font-alexandria font-black text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Package className="w-4 h-4" />
                  <span>تصدير ({batchGuests.length}) دعوة كصور PNG (ملف ZIP)</span>
                </button>
                <button
                  type="button"
                  disabled={busy.active || batchGuests.length === 0}
                  onClick={handleBatchPdf}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-l from-[#082046] to-sky-700 hover:brightness-110 disabled:opacity-50 text-white font-alexandria font-black text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>تصدير ({batchGuests.length}) دعوة في ملف PDF واحد (A4)</span>
                </button>
              </div>
            )}

            {busy.active && (
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-sky-900">
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                    <span>{busy.label}</span>
                  </span>
                  <span>
                    {busy.done} / {busy.total}
                  </span>
                </div>
                {busy.current && (
                  <div className="text-[11px] text-slate-600 font-bold truncate">{busy.current}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FLEXIBLE DESIGN & GUEST CONTROLS COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
          {/* Mode Toggle + Quick Templates */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            {/* Single vs Batch Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setMode('single');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-alexandria font-black inline-flex items-center justify-center gap-1.5 cursor-pointer transition ${
                  mode === 'single'
                    ? 'bg-[#082046] text-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>دعوة فردية مخصصة</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setMode('batch');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-alexandria font-black inline-flex items-center justify-center gap-1.5 cursor-pointer transition ${
                  mode === 'batch'
                    ? 'bg-[#082046] text-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>تصدير جماعي (قائمة ضيوف)</span>
              </button>
            </div>

            {/* Official Design Style Theme Switcher (Strict 1001 Logo Palette: Indigo + Orange + White) */}
            <div>
              <label className="block text-[11px] font-alexandria font-extrabold text-slate-600 mb-2">
                الطراز الرسمي للبطاقة (حصراً من ألوان شعار 1001: نيلي، برتقالي، أبيض):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INVITATION_STYLE_THEMES.map((st) => {
                  const active = (form.styleTheme || 'official_indigo_1001') === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setForm((prev) => ({
                          ...prev,
                          styleTheme: st.id,
                          masdarVariant:
                            prev.masdarVariant === 'full_white' || prev.masdarVariant === 'full_blue'
                              ? 'auto'
                              : prev.masdarVariant
                        }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-right transition cursor-pointer ${
                        active
                          ? 'bg-gradient-to-l from-[#00185C] to-[#00359E] text-white border-[#FF7300] shadow-md'
                          : 'bg-white hover:bg-slate-50 text-[#00185C] border-slate-200 hover:border-[#FF7300]/70'
                      }`}
                    >
                      <div className="text-xs font-alexandria font-black flex items-center gap-1.5">
                        <span>{st.emoji}</span>
                        <span>{st.label}</span>
                      </div>
                      <div
                        className={`text-[10.5px] mt-1 leading-relaxed ${
                          active ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {st.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Template Presets */}
            <div>
              <label className="block text-[11px] font-alexandria font-extrabold text-slate-600 mb-2">
                قوالب صياغة جاهزة بضغطة زر:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INVITATION_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-xs font-extrabold text-slate-800 inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{tpl.emoji}</span>
                    <span className="truncate">{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Single Guest Inputs OR Batch Textarea */}
            {mode === 'single' ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-alexandria font-black text-slate-800 mb-1.5">
                    اسم الضيف الكريم (يظهر في الشريط الذهبي الرئيسي):
                  </label>
                  <input
                    type="text"
                    value={form.guestName}
                    onChange={(e) => updateField('guestName', e.target.value)}
                    placeholder="مثال: المهندس الحاج زهير شربة المحترم"
                    className="w-full px-4 py-3 rounded-2xl bg-amber-50/50 border-2 border-amber-300/80 text-sm sm:text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {/* Quick Honorific Helper Chips */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {HONORIFIC_PREFIXES.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => prependHonorific(w)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-[11px] font-bold text-slate-700 hover:text-sky-900 transition cursor-pointer"
                      >
                        + {w}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendSuffix('المحترم')}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[11px] font-black text-amber-900 transition cursor-pointer"
                    >
                      المحترم
                    </button>
                    <button
                      type="button"
                      onClick={() => appendSuffix('المحترمة')}
                      className="px-2.5 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 text-[11px] font-black text-pink-900 transition cursor-pointer"
                    >
                      المحترمة
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-alexandria font-black text-slate-800 mb-1.5">
                    المنصب / الصفة الرسمية (اختياري — اتركه فارغاً لإخفائه):
                  </label>
                  <input
                    type="text"
                    value={form.guestTitle}
                    onChange={(e) => updateField('guestTitle', e.target.value)}
                    placeholder="مثال: رئيس غرفة تجارة النجف الأشرف"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-alexandria font-black text-slate-800">
                    قائمة الضيوف (سطر لكل ضيف بصيغة: الاسم | المنصب):
                  </label>
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {batchGuests.length} ضيفاً جاهزاً للتصدير
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder={'المهندس الحاج زهير شربة المحترم | رئيس غرفة تجارة النجف الأشرف\nالأستاذ ... المحترم | مدير ...'}
                  className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {/* Quick Visual Option Toggles */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  updateField('showPatronage', !form.showPatronage);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  form.showPatronage
                    ? 'bg-[#082046] text-amber-300 border-amber-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-300'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>برعاية وحضور فخامة رئيس الجمهورية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  updateField('showMasdarLogo', !form.showMasdarLogo);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  form.showMasdarLogo
                    ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>إرفاق شعار شركة المصدر</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  updateField('showStats', !form.showStats);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  form.showStats
                    ? 'bg-[#00185C] text-white border-[#FF7300]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#FF7300]/70'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>إظهار بطاقات الأرقام (اختياري)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  updateField('showQr', !form.showQr);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  form.showQr
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>إضافة رمز QR للدعوة</span>
              </button>
            </div>

            {/* Dedicated Sovereign Presidential Patronage & Presence Panel */}
            {form.showPatronage && (
              <div className="p-4 rounded-2xl bg-[#F5F7FC] border-2 border-[#002884]/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-alexandria font-black text-[#00185C] inline-flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#FF7300]" />
                    <span>تخصيص ترويسة رعاية وحضور فخامة رئيس الجمهورية (أعلى الدعوة):</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      ref={presidentPhotoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleUploadPresidentPhoto}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => presidentPhotoInputRef.current?.click()}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border inline-flex items-center gap-1.5 transition cursor-pointer ${
                        form.presidentPhotoUrl
                          ? 'bg-[#FF7300] text-white border-[#FF7300]'
                          : 'bg-white hover:bg-orange-50 text-[#00185C] border-[#FF7300]/50'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{form.presidentPhotoUrl ? 'تغيير صورة فخامة الرئيس' : 'إضافة صورة فخامة الرئيس (اختياري)'}</span>
                    </button>
                    {form.presidentPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickPop();
                          updateField('presidentPhotoUrl', '');
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition"
                        title="إزالة الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Protocol Phrasing Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {PATRONAGE_PRESETS.map((pr) => {
                    const isActive =
                      form.patronageEyebrow === pr.eyebrow &&
                      form.patronageText === pr.text;
                    return (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setForm((prev) => ({
                            ...prev,
                            patronageEyebrow: pr.eyebrow,
                            patronageText: pr.text,
                            patronageSubtitle: pr.subtitle
                          }));
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                          isActive
                            ? 'bg-[#00185C] text-white border-[#FF7300] shadow-xs'
                            : 'bg-white text-[#00185C] border-slate-200 hover:border-[#FF7300]'
                        }`}
                      >
                        {pr.label}
                      </button>
                    );
                  })}
                </div>

                {/* Editable Presidential Lines */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">عبارة الرعاية والحضور:</label>
                    <input
                      type="text"
                      value={form.patronageEyebrow ?? ''}
                      onChange={(e) => updateField('patronageEyebrow', e.target.value)}
                      placeholder="برعاية وحضور"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-[#00185C] focus:outline-none focus:ring-2 focus:ring-[#FF7300]"
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">العنوان الرئاسي البارز:</label>
                    <input
                      type="text"
                      value={form.patronageText ?? ''}
                      onChange={(e) => updateField('patronageText', e.target.value)}
                      placeholder="فخامة رئيس جمهورية العراق"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#002884]/30 text-xs font-black text-[#00185C] focus:outline-none focus:ring-2 focus:ring-[#FF7300]"
                    />
                  </div>
                  <div className="sm:col-span-12">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">سطر بروتوكولي إضافي / اسم أو صفة (اختياري):</label>
                    <input
                      type="text"
                      value={form.patronageSubtitle ?? ''}
                      onChange={(e) => updateField('patronageSubtitle', e.target.value)}
                      placeholder="اتركه فارغاً ليبقى التصميم أكثر رسمية ووضوحاً"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7300]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Flexible Masdar Logo Placement, Built-in Variants & Custom Upload Panel */}
            {form.showMasdarLogo && (
              <div className="p-3.5 rounded-2xl bg-sky-50/75 border border-sky-200/90 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-alexandria font-black text-sky-950 inline-flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>تخصيص مكان ونوع شعار شركة المصدر:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={customLogoInputRef}
                      type="file"
                      accept="image/png,image/svg+xml,image/jpeg,image/webp"
                      onChange={handleUploadCustomMasdarLogo}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => customLogoInputRef.current?.click()}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border inline-flex items-center gap-1.5 transition cursor-pointer ${
                        form.masdarVariant === 'custom' && form.customMasdarLogoUrl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white hover:bg-sky-100 text-sky-800 border-sky-300'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{form.customMasdarLogoUrl ? 'تغيير الشعار المرفوع' : 'رفع شعار مخصص'}</span>
                    </button>
                    {form.customMasdarLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setForm((prev) => ({
                            ...prev,
                            masdarVariant: 'auto',
                            customMasdarLogoUrl: ''
                          }));
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition"
                        title="العودة لشعار شركة المصدر الرسمي"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Placement Selector */}
                <div>
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5">مكان الشعار في البطاقة:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {MASDAR_PLACEMENTS.map((p) => {
                      const active = (form.masdarPlacement || 'top_triple') === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            playClickPop();
                            updateField('masdarPlacement', p.id);
                          }}
                          className={`px-2.5 py-2 rounded-xl text-[11px] font-extrabold border text-center transition cursor-pointer ${
                            active
                              ? 'bg-[#082046] text-amber-300 border-amber-400 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Variant Selector + Optional Partner Caption */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-7">
                    <div className="text-[11px] font-bold text-slate-600 mb-1.5">نوع شعار المصدر الجاهز:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {MASDAR_VARIANTS.map((v) => {
                        const active = (form.masdarVariant || 'auto') === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              playClickPop();
                              updateField('masdarVariant', v.id);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                              active
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      عبارة الشراكة (اتركها فارغة للشعار فقط):
                    </label>
                    <input
                      type="text"
                      value={form.masdarCaption ?? ''}
                      onChange={(e) => updateField('masdarCaption', e.target.value)}
                      placeholder="الشريك التقني والمنظم"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Full Flexible Text, Stats & Event Info Editor */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setShowAdvancedText((v) => !v);
              }}
              className="w-full px-5 py-4 flex items-center justify-between text-right hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span className="font-alexandria font-black text-xs sm:text-sm text-slate-900">
                  تخصيص مرن لكافة نصوص الدعوة والأرقام والموعد والمكان
                </span>
              </div>
              {showAdvancedText ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showAdvancedText && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
                {/* Header Motto & Crest Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">الشعار العلوي الذهبي</label>
                    <input
                      type="text"
                      value={form.motto}
                      onChange={(e) => updateField('motto', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">عنوان الشارة الكحلية</label>
                    <input
                      type="text"
                      value={form.headerBadge}
                      onChange={(e) => updateField('headerBadge', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">عنوان المناسبة (سطر 1)</label>
                    <input
                      type="text"
                      value={form.occasionLine1}
                      onChange={(e) => updateField('occasionLine1', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">عنوان المناسبة الذهبي (سطر 2)</label>
                    <input
                      type="text"
                      value={form.occasionLine2}
                      onChange={(e) => updateField('occasionLine2', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Body & Highlight Paragraphs */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">نص الدعوة الرئيسي</label>
                    <textarea
                      rows={3}
                      value={form.bodyText}
                      onChange={(e) => updateField('bodyText', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">عبارة التشريف والتقدير (بالأزرق)</label>
                    <textarea
                      rows={2}
                      value={form.highlightText}
                      onChange={(e) => updateField('highlightText', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3 Stat Cards + Quick Numbers Switch */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-slate-500">بطاقات الإحصائيات الثلاث:</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyStatsPreset('172', '700', '896')}
                        className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10.5px] font-black cursor-pointer"
                      >
                        الأرقام المحدّثة (172 / 700 / 896)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyStatsPreset('170', '700', '819')}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10.5px] font-black cursor-pointer"
                      >
                        أرقام النموذج (170 / 700 / 819)
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { nk: 'stat1Num', lk: 'stat1Label', title: 'اليمين' },
                      { nk: 'stat2Num', lk: 'stat2Label', title: 'الوسط' },
                      { nk: 'stat3Num', lk: 'stat3Label', title: 'اليسار' }
                    ].map((st) => (
                      <div key={st.nk} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <input
                          type="text"
                          value={form[st.nk]}
                          onChange={(e) => updateField(st.nk, e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-center text-sm font-black text-sky-800"
                        />
                        <textarea
                          rows={2}
                          value={form[st.lk]}
                          onChange={(e) => updateField(st.lk, e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-center text-[10.5px] font-bold text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing Ribbon & Date/Time/Venue */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">الشريط الختامي الذهبي</label>
                  <input
                    type="text"
                    value={form.closingRibbon}
                    onChange={(e) => updateField('closingRibbon', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-700 block">التاريخ</span>
                    <input
                      type="text"
                      value={form.dateLine1}
                      onChange={(e) => updateField('dateLine1', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={form.dateLine2}
                      onChange={(e) => updateField('dateLine2', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-700 block">الوقت</span>
                    <input
                      type="text"
                      value={form.timeLine1}
                      onChange={(e) => updateField('timeLine1', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={form.timeLine2}
                      onChange={(e) => updateField('timeLine2', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-700 block">المكان</span>
                    <input
                      type="text"
                      value={form.venueLine1}
                      onChange={(e) => updateField('venueLine1', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={form.venueLine2}
                      onChange={(e) => updateField('venueLine2', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvitationStudio({
  embedded = false,
  standalone = false,
  asModal = false,
  isOpen = true,
  onClose
}) {
  useEffect(() => {
    if (!asModal || !isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [asModal, isOpen, onClose]);

  if (asModal) {
    if (!isOpen || typeof document === 'undefined') return null;
    return createPortal(
      <div
        dir="rtl"
        className="fixed inset-0 z-[9990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-slate-100 rounded-[32px] max-w-6xl w-full p-4 sm:p-6 shadow-2xl border border-amber-300/50 max-h-[94vh] overflow-y-auto my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <InvitationStudioInner embedded={false} standalone={false} onClose={onClose} />
        </div>
      </div>,
      document.body
    );
  }

  return <InvitationStudioInner embedded={embedded} standalone={standalone} onClose={onClose} />;
}
