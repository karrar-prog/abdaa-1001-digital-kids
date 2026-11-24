import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  X,
  RotateCcw,
  Package,
  Loader2,
  Crown,
  Upload,
  Trash2,
  Share2,
  Megaphone,
  Layers,
  MessageSquareText,
  Image as ImageIcon,
  Building2,
  Users,
  Palette
} from 'lucide-react';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';
import {
  CAMPAIGN_FORMATS,
  CAMPAIGN_THEMES,
  MASDAR_CAMPAIGN_STYLES,
  CAMPAIGN_PHASES,
  CAMPAIGN_TEMPLATES,
  VIP_SPEAKER_PRESETS,
  COUNTDOWN_PRESETS,
  renderCampaignDesignToCanvas,
  renderCampaignPngBlob,
  downloadCampaignPng,
  exportCampaignZip
} from '../utils/campaignDesignRenderer';

function CampaignStudioInner({ standalone = false, onClose }) {
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('official-hero');
  const [format, setFormat] = useState('post');
  const [themeMode, setThemeMode] = useState('brand_1001'); // 'brand_1001' | 'sky' | 'ivory' | 'royal'
  const [masdarStyle, setMasdarStyle] = useState('header_balanced'); // 'header_balanced' | 'footer_subtle' | 'none'
  const [showMasdarCaption, setShowMasdarCaption] = useState(true);
  const [masdarCaption, setMasdarCaption] = useState('الشريك المنظم');
  const [showPatronage, setShowPatronage] = useState(true);
  const [showPresidentFrame, setShowPresidentFrame] = useState(true);
  const [overrides, setOverrides] = useState({});
  const [customPhotos, setCustomPhotos] = useState({});
  const [customPhotoSlots, setCustomPhotoSlots] = useState({});
  const [customCaptions, setCustomCaptions] = useState({});
  const [includeStoriesInZip, setIncludeStoriesInZip] = useState(false);

  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [busy, setBusy] = useState({ active: false, label: '', done: 0, total: 0, current: '' });

  const canvasRef = useRef(null);
  const photoInputRef = useRef(null);
  const multiPhotoInputRef = useRef(null);
  const slotPhotoInputRef = useRef(null);
  const activeSlotIdxRef = useRef(0);
  const renderSeqRef = useRef(0);

  const activeTemplate = useMemo(
    () => CAMPAIGN_TEMPLATES.find((t) => t.id === selectedId) || CAMPAIGN_TEMPLATES[0],
    [selectedId]
  );

  const visibleTemplates = useMemo(
    () =>
      phaseFilter === 'all'
        ? CAMPAIGN_TEMPLATES
        : CAMPAIGN_TEMPLATES.filter((t) => t.phase === phaseFilter),
    [phaseFilter]
  );

  const activeData = useMemo(
    () => ({ ...activeTemplate.defaults, ...(overrides[activeTemplate.id] || {}) }),
    [activeTemplate, overrides]
  );

  const activeCaption = customCaptions[activeTemplate.id] ?? activeTemplate.caption;
  const activeCustomPhoto = customPhotos[activeTemplate.id] || '';
  const activeCustomPhotoSlots = customPhotoSlots[activeTemplate.id] || null;

  const handleSelectTemplate = (tpl) => {
    playClickPop();
    setSelectedId(tpl.id);
    setFormat(tpl.defaultFormat || 'post');
  };

  const updateField = (key, val) => {
    setOverrides((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...(prev[activeTemplate.id] || {}),
        [key]: val
      }
    }));
  };

  const resetCurrentTemplate = () => {
    playClickPop();
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[activeTemplate.id];
      return next;
    });
    setCustomPhotos((prev) => {
      const next = { ...prev };
      delete next[activeTemplate.id];
      return next;
    });
    setCustomPhotoSlots((prev) => {
      const next = { ...prev };
      delete next[activeTemplate.id];
      return next;
    });
    setCustomCaptions((prev) => {
      const next = { ...prev };
      delete next[activeTemplate.id];
      return next;
    });
  };

  const applyVipPreset = (vip) => {
    playClickPop();
    setOverrides((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...(prev[activeTemplate.id] || {}),
        eyebrow: vip.badge,
        headline: vip.name,
        highlight: vip.role,
        subtitle: `«${vip.quote}»`
      }
    }));
    setCustomCaptions((prev) => ({
      ...prev,
      [activeTemplate.id]:
        `✨ نعتز بحضور وتشريف ${vip.name} (${vip.role}) في حفل تخرج الدفعة الأولى لمبادرة «1001 طفل رقمي» — ملتقى النجف للابتكار الرقمي.\n\n«${vip.quote}»\n\n📅 الجمعة 27 تشرين الثاني 2026 | 🕒 3:00 عصراً\n📍 قصر الثقافة – النجف الأشرف\n🌐 https://abdaa.masdar.company\n\n#ضيوف_الشرف #1001_طفل_رقمي #نادي_أبدع #النجف_الأشرف`
    }));
  };

  const applyCountdownPreset = (cp) => {
    playClickPop();
    setOverrides((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...(prev[activeTemplate.id] || {}),
        countdownNumber: cp.number,
        countdownUnit: cp.unit,
        headline: cp.title,
        highlight: cp.sub
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        playClickPop();
        setCustomPhotos((prev) => ({ ...prev, [activeTemplate.id]: reader.result }));
        if (activeTemplate.supportsPresidentPortrait) {
          setShowPresidentFrame(true);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleMultiPhotoUpload = (e) => {
    const maxSlots = activeTemplate.photoSlots || 3;
    const files = Array.from(e.target.files || []).slice(0, maxSlots);
    if (!files.length) return;
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          })
      )
    ).then((urls) => {
      const clean = urls.filter(Boolean);
      if (!clean.length) return;
      playClickPop();
      setCustomPhotoSlots((prev) => {
        const nextArr = Array.from({ length: maxSlots }, (_, idx) => clean[idx] || '__CLEARED__');
        return { ...prev, [activeTemplate.id]: nextArr };
      });
    });
    e.target.value = '';
  };

  const handleSlotPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slotIdx = activeSlotIdxRef.current || 0;
    const maxSlots = activeTemplate.photoSlots || 3;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        playClickPop();
        setCustomPhotoSlots((prev) => {
          const base = Array.isArray(prev[activeTemplate.id])
            ? [...prev[activeTemplate.id]]
            : Array.from({ length: maxSlots }, () => '');
          while (base.length < maxSlots) base.push('');
          base[slotIdx] = reader.result;
          return { ...prev, [activeTemplate.id]: base };
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearPhotoSlot = (slotIdx) => {
    playClickPop();
    const maxSlots = activeTemplate.photoSlots || 3;
    setCustomPhotoSlots((prev) => {
      const base = Array.isArray(prev[activeTemplate.id])
        ? [...prev[activeTemplate.id]]
        : Array.from({ length: maxSlots }, () => '');
      while (base.length < maxSlots) base.push('');
      base[slotIdx] = '__CLEARED__';
      return { ...prev, [activeTemplate.id]: base };
    });
  };

  const restorePhotoSlot = (slotIdx) => {
    playClickPop();
    const maxSlots = activeTemplate.photoSlots || 3;
    setCustomPhotoSlots((prev) => {
      const base = Array.isArray(prev[activeTemplate.id])
        ? [...prev[activeTemplate.id]]
        : Array.from({ length: maxSlots }, () => '');
      while (base.length < maxSlots) base.push('');
      base[slotIdx] = '';
      return { ...prev, [activeTemplate.id]: base };
    });
  };

  const effectiveMasdarCaption = showMasdarCaption ? masdarCaption : '';

  // Live Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const seq = ++renderSeqRef.current;
    let cancelled = false;

    const raf = requestAnimationFrame(async () => {
      if (cancelled || seq !== renderSeqRef.current) return;
      await renderCampaignDesignToCanvas(canvas, activeTemplate.id, activeData, {
        format,
        themeMode,
        masdarStyle,
        masdarCaption: effectiveMasdarCaption,
        showPatronage,
        showPresidentFrame,
        customPhotoUrl: activeCustomPhoto,
        customPhotosList: activeCustomPhotoSlots
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [
    activeTemplate.id,
    activeData,
    format,
    themeMode,
    masdarStyle,
    effectiveMasdarCaption,
    showPatronage,
    showPresidentFrame,
    activeCustomPhoto,
    activeCustomPhotoSlots
  ]);

  const handleDownloadCurrent = async (overrideFormat = null) => {
    playClickPop();
    const targetFmt = overrideFormat || format;
    setBusy({ active: true, label: 'جارٍ تجهيز الصورة بجودة النشر...', done: 0, total: 1, current: activeTemplate.name });
    try {
      await downloadCampaignPng(activeTemplate.id, activeData, {
        format: targetFmt,
        themeMode,
        masdarStyle,
        masdarCaption: effectiveMasdarCaption,
        showPatronage,
        showPresidentFrame,
        customPhotoUrl: activeCustomPhoto,
        customPhotosList: activeCustomPhotoSlots
      });
      playSuccessChime();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleShareCurrent = async () => {
    playClickPop();
    try {
      const { blob, filename } = await renderCampaignPngBlob(activeTemplate.id, activeData, {
        format,
        themeMode,
        masdarStyle,
        masdarCaption: effectiveMasdarCaption,
        showPatronage,
        showPresidentFrame,
        customPhotoUrl: activeCustomPhoto,
        customPhotosList: activeCustomPhotoSlots
      });
      if (navigator.share && blob) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: activeTemplate.name, text: activeCaption });
          return;
        }
      }
      await handleDownloadCurrent();
    } catch {
      // user cancelled share
    }
  };

  const handleExportZip = async (list, labelText) => {
    playClickPop();
    setBusy({ active: true, label: labelText, done: 0, total: list.length, current: '' });
    try {
      await exportCampaignZip(
        list,
        overrides,
        {
          themeMode,
          masdarStyle,
          masdarCaption: effectiveMasdarCaption,
          showPatronage,
          showPresidentFrame,
          customPhotosById: customPhotos,
          customPhotoSlotsById: customPhotoSlots,
          includeStories: includeStoriesInZip
        },
        (done, total, current) => setBusy((p) => ({ ...p, done, total, current }))
      );
      playSuccessChime();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.65 } });
    } finally {
      setBusy({ active: false, label: '', done: 0, total: 0, current: '' });
    }
  };

  const handleCopyCaption = () => {
    playClickPop();
    navigator.clipboard?.writeText(activeCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2200);
  };

  const handleCopyUrl = () => {
    playClickPop();
    const url =
      typeof window !== 'undefined' ? `${window.location.origin}/campaign` : 'https://abdaa.masdar.company/campaign';
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const isMultiPhotoTemplate = Boolean(activeTemplate.photoSlots && activeTemplate.photoSlots > 1);
  const canUploadPhoto = Boolean(
    activeTemplate.supportsPresidentPortrait ||
      activeTemplate.supportsPortrait ||
      activeTemplate.photoAsset ||
      activeTemplate.photoAssets
  );
  const totalTemplatesCount = CAMPAIGN_TEMPLATES.length;

  return (
    <div className={standalone ? 'max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 space-y-5' : 'space-y-5'}>
      {/* Top Executive Campaign Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-[#041230] via-[#0b2a66] to-[#041230] text-white p-4 sm:p-5 rounded-3xl border-2 border-amber-400/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/60 text-amber-300 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-alexandria font-black text-base sm:text-xl text-white leading-tight">
              استوديو تصاميم الحملة الإعلانية — إنستغرام وفيسبوك ({totalTemplatesCount} قالباً)
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-200/90 mt-0.5">
              بهوية 1001 وأبدع (النيلي والبرتقالي والأبيض) • صور التحضيرات والكواليس • بطاقات المتحدثين والخريجين والرعاة • تحميل PNG وZIP
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 border border-white/15 cursor-pointer transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copiedLink ? 'تم نسخ /campaign' : 'نسخ الرابط'}</span>
          </button>

          <button
            type="button"
            disabled={busy.active}
            onClick={() => handleExportZip(CAMPAIGN_TEMPLATES, `جارٍ تجهيز حزمة الـ ${totalTemplatesCount} تصميماً...`)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-yellow-400 hover:brightness-105 disabled:opacity-60 text-slate-950 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Package className="w-4 h-4" />
            <span>تحميل الـ {totalTemplatesCount} تصميماً (ZIP)</span>
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

      {/* Phase Filter Bar + Templates Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setPhaseFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-alexandria font-black transition cursor-pointer ${
                phaseFilter === 'all'
                  ? 'bg-[#082046] text-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الكل ({totalTemplatesCount} قالباً)
            </button>
            {CAMPAIGN_PHASES.map((ph) => {
              const active = phaseFilter === ph.id;
              return (
                <button
                  key={ph.id}
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setPhaseFilter(ph.id);
                    const firstInPhase = CAMPAIGN_TEMPLATES.find((t) => t.phase === ph.id);
                    if (firstInPhase) handleSelectTemplate(firstInPhase);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                  }`}
                >
                  {ph.badge}
                </button>
              );
            })}
          </div>

          <label className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeStoriesInZip}
              onChange={(e) => setIncludeStoriesInZip(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>تضمين نسخ الستوري (9:16) داخل ملف الـ ZIP</span>
          </label>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pl-1">
          {visibleTemplates.map((tpl) => {
            const selected = tpl.id === activeTemplate.id;
            const phaseObj = CAMPAIGN_PHASES.find((p) => p.id === tpl.phase);
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tpl)}
                className={`text-right p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selected
                    ? 'bg-gradient-to-l from-[#071b40] to-[#0f3575] text-white border-amber-400 shadow-md -translate-y-0.5'
                    : 'bg-slate-50/80 hover:bg-amber-50/60 text-slate-800 border-slate-200/80 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      selected ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    #{String(tpl.order).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[10px] font-bold truncate ${
                      selected ? 'text-amber-200' : 'text-slate-500'
                    }`}
                  >
                    {phaseObj?.badge.split('•')[0]}
                  </span>
                </div>
                <div className={`font-alexandria font-black text-xs leading-snug ${selected ? 'text-white' : 'text-slate-900'}`}>
                  {tpl.name}
                </div>
                <div className={`text-[10px] leading-relaxed line-clamp-2 ${selected ? 'text-sky-100/90' : 'text-slate-500'}`}>
                  {tpl.shortDesc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Workspace: Sticky Live Preview (5 cols) + Customizer & Caption (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LIVE PREVIEW & DOWNLOAD PANEL */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-3.5 order-1 lg:order-2">
          <div className="bg-white rounded-[28px] p-3.5 sm:p-4 border-2 border-amber-200/80 shadow-[0_20px_50px_-15px_rgba(7,27,64,0.22)] space-y-3.5">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-alexandria font-black text-slate-800 inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  تصميم #{String(activeTemplate.order).padStart(2, '0')} • {CAMPAIGN_FORMATS[format]?.subtitle}
                </span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                دقة نشر فائقة PNG
              </span>
            </div>

            {/* Format Switcher Pills */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
              {Object.values(CAMPAIGN_FORMATS).map((f) => {
                const isAct = format === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setFormat(f.id);
                    }}
                    className={`py-1.5 px-1.5 rounded-xl text-[11px] font-black transition cursor-pointer text-center ${
                      isAct ? 'bg-[#082046] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Canvas Frame */}
            <div className="flex justify-center bg-slate-950/5 rounded-2xl p-2 overflow-hidden">
              <canvas
                ref={canvasRef}
                className={`h-auto rounded-2xl shadow-xl block ${
                  format === 'story' ? 'w-auto max-h-[540px] max-w-full' : 'w-full max-w-[420px]'
                }`}
              />
            </div>

            {/* Primary Download & Share Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy.active}
                  onClick={() => handleDownloadCurrent()}
                  className="py-3 px-3 rounded-2xl bg-gradient-to-l from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 disabled:opacity-60 text-slate-950 font-alexandria font-black text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الصورة (PNG)</span>
                </button>

                <button
                  type="button"
                  disabled={busy.active}
                  onClick={() => handleDownloadCurrent(format === 'story' ? 'post' : 'story')}
                  className="py-3 px-3 rounded-2xl bg-gradient-to-l from-[#082046] to-sky-700 hover:brightness-110 disabled:opacity-60 text-white font-alexandria font-black text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>{format === 'story' ? 'تحميل نسخة بوست' : 'تحميل نسخة ستوري'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy.active}
                  onClick={handleShareCurrent}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مشاركة مباشرة</span>
                </button>

                <button
                  type="button"
                  disabled={busy.active}
                  onClick={() =>
                    handleExportZip(
                      visibleTemplates,
                      phaseFilter === 'all' ? 'جارٍ تصدير كل الحملة...' : 'جارٍ تصدير تصاميم هذه المرحلة...'
                    )
                  }
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 border border-slate-200 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Package className="w-3.5 h-3.5 text-sky-600" />
                  <span>
                    تحميل {phaseFilter === 'all' ? `الكل (${totalTemplatesCount})` : `المرحلة (${visibleTemplates.length})`} ZIP
                  </span>
                </button>
              </div>
            </div>

            {busy.active && (
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-sky-900">
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                    <span>{busy.label}</span>
                  </span>
                  <span>
                    {busy.done} / {busy.total}
                  </span>
                </div>
                {busy.current && <div className="text-[11px] text-slate-600 font-bold truncate">{busy.current}</div>}
              </div>
            )}
          </div>
        </div>

        {/* CUSTOMIZER + THEME/MASDAR CONTROLS + PRESIDENT PORTRAIT + VIP PRESETS + READY CAPTION */}
        <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
          {/* Global Color Palette (White/Indigo/Gold vs Sky vs Dark) & Balanced Masdar Controls */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-3.5">
            <div className="space-y-2">
              <div className="text-xs font-alexandria font-black text-slate-900 inline-flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>درجة ألوان الخلفية (فاتح بالأبيض والنيلي والذهبي / سماوي / ليلي):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CAMPAIGN_THEMES.map((tm) => {
                  const active = themeMode === tm.id;
                  return (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setThemeMode(tm.id);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-extrabold border inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        active
                          ? 'bg-[#082046] text-amber-300 border-amber-400 shadow-xs'
                          : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{tm.emoji}</span>
                      <span>{tm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-black text-slate-700 inline-flex items-center gap-1 ml-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>شعار شركة المصدر:</span>
                </span>
                {MASDAR_CAMPAIGN_STYLES.map((ms) => {
                  const active = masdarStyle === ms.id;
                  return (
                    <button
                      key={ms.id}
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setMasdarStyle(ms.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                        active
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {ms.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setShowPatronage((v) => !v);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  showPatronage
                    ? 'bg-[#082046] text-amber-300 border-amber-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>برعاية فخامة رئيس الجمهورية</span>
              </button>
            </div>

            {/* Flexible Control to Show/Hide or Edit Masdar's Accompanying Partner Label */}
            {masdarStyle === 'header_balanced' && (
              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setShowMasdarCaption((v) => !v);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                    showMasdarCaption
                      ? 'bg-sky-50 text-sky-900 border-sky-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {showMasdarCaption ? 'اللقب أسفل مصدر: ظاهر ✓ (اضغط لإزالته)' : 'اللقب أسفل مصدر: مخفي (اضغط لإضافته)'}
                </button>
                {showMasdarCaption && (
                  <input
                    type="text"
                    value={masdarCaption}
                    onChange={(e) => setMasdarCaption(e.target.value)}
                    placeholder="مثال: الشريك المنظم (أو اتركه فارغاً)"
                    className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black text-sky-700">
                  قالب #{String(activeTemplate.order).padStart(2, '0')} •{' '}
                  {CAMPAIGN_PHASES.find((p) => p.id === activeTemplate.phase)?.badge}
                </span>
                <h3 className="font-alexandria font-black text-base sm:text-lg text-slate-900">
                  {activeTemplate.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={resetCurrentTemplate}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة افتراضي القالب</span>
              </button>
            </div>

            {/* 👑 SPECIAL PRESIDENTIAL PORTRAIT UPLOAD PANEL FOR TEMPLATE #04 */}
            {activeTemplate.supportsPresidentPortrait && (
              <div className="p-4 rounded-2xl bg-gradient-to-l from-amber-50 via-white to-sky-50 border-2 border-amber-300/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#082046] text-amber-300 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-alexandria font-black text-slate-900">
                        صورة فخامة رئيس جمهورية العراق في البوستر الرسمي
                      </div>
                      <div className="text-[11px] text-slate-600">
                        ارفع صورة فخامة الرئيس لتُعرض داخل الإطار الملكي الذهبي مباشرة في أعلى البوستر
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-l from-[#082046] to-sky-700 hover:brightness-110 text-amber-200 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{activeCustomPhoto ? 'تغيير صورة فخامة الرئيس' : 'رفع صورة فخامة الرئيس'}</span>
                    </button>

                    {activeCustomPhoto && (
                      <button
                        type="button"
                        onClick={() =>
                          setCustomPhotos((prev) => {
                            const next = { ...prev };
                            delete next[activeTemplate.id];
                            return next;
                          })
                        }
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                        title="إزالة الصورة المرفوعة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setShowPresidentFrame((v) => !v);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-extrabold border cursor-pointer transition ${
                        showPresidentFrame
                          ? 'bg-amber-100 text-amber-950 border-amber-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {showPresidentFrame ? 'إطار الصورة: ظاهر' : 'إطار الصورة: مخفي'}
                    </button>
                  </div>
                </div>

                {showPresidentFrame && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      النص/اللقب أسفل صورة فخامة الرئيس (اختياري):
                    </label>
                    <input
                      type="text"
                      value={activeData.presidentTitle || ''}
                      onChange={(e) => updateField('presidentTitle', e.target.value)}
                      placeholder="مثال: فخامة رئيس جمهورية العراق"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                )}
              </div>
            )}

            {/* VIP Speaker 1-Click Presets (Template #6 only) */}
            {activeTemplate.supportsPortrait && !activeTemplate.isGraduateSpotlight && (
              <div className="p-3.5 rounded-2xl bg-amber-50/75 border border-amber-200 space-y-2.5">
                <div className="text-xs font-alexandria font-black text-amber-950 inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>اختر شخصية رسمية / متحدثاً بضغطة زر (لتصدير بطاقة لكل ضيف):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {VIP_SPEAKER_PRESETS.map((vip) => (
                    <button
                      key={vip.id}
                      type="button"
                      onClick={() => applyVipPreset(vip)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                        activeData.headline === vip.name
                          ? 'bg-[#082046] text-amber-300 border-amber-400'
                          : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {vip.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Countdown 1-Click Presets (Template #12) */}
            {activeTemplate.supportsCountdown && (
              <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2">
                <div className="text-xs font-alexandria font-black text-sky-950">تبديل سريع لرقم العدّ التنازلي:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COUNTDOWN_PRESETS.map((cp) => (
                    <button
                      key={cp.id}
                      type="button"
                      onClick={() => applyCountdownPreset(cp)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        activeData.countdownNumber === cp.number
                          ? 'bg-[#082046] text-amber-300 border-amber-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400'
                      }`}
                    >
                      {cp.number} — {cp.unit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Photo Uploader Panel (Preparations Collage #13 & Expo Collage #07) */}
            {isMultiPhotoTemplate && (
              <div className="p-4 rounded-2xl bg-gradient-to-l from-sky-50 via-white to-amber-50 border-2 border-sky-200/90 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#082046] text-amber-300 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-alexandria font-black text-slate-900">
                        صور الكولاج ({activeTemplate.photoSlots} خانات — يتكيّف تلقائياً مع 1 أو 2 أو 3 صور)
                      </div>
                      <div className="text-[11px] text-slate-600">
                        ارفع صور التحضيرات دفعة واحدة أو بدّل وأخفِ كل خانة بشكل مستقل
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      ref={multiPhotoInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultiPhotoUpload}
                      className="hidden"
                    />
                    <input
                      ref={slotPhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSlotPhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => multiPhotoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-l from-[#082046] to-sky-700 hover:brightness-110 text-amber-200 text-xs font-alexandria font-black inline-flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صور دفعة واحدة (1–{activeTemplate.photoSlots})</span>
                    </button>
                    {activeCustomPhotoSlots && (
                      <button
                        type="button"
                        onClick={() =>
                          setCustomPhotoSlots((prev) => {
                            const next = { ...prev };
                            delete next[activeTemplate.id];
                            return next;
                          })
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold cursor-pointer transition"
                      >
                        استرجاع الافتراضي
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {Array.from({ length: activeTemplate.photoSlots || 3 }, (_, idx) => {
                    const slotVal = activeCustomPhotoSlots?.[idx] || '';
                    const isCleared = slotVal === '__CLEARED__';
                    const previewSrc = isCleared ? '' : slotVal || activeTemplate.photoAssets?.[idx] || '';
                    const slotLabel = activeTemplate.photoSlotLabels?.[idx] || `صورة #${idx + 1}`;
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-2 flex flex-col gap-2 transition ${
                          isCleared ? 'bg-slate-100/80 border-dashed border-slate-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="relative h-24 rounded-xl overflow-hidden bg-slate-200/70 flex items-center justify-center">
                          {previewSrc ? (
                            <img src={previewSrc} alt={slotLabel} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[11px] font-bold text-slate-500">خانة مخفية</span>
                          )}
                          <span className="absolute top-1.5 right-1.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#082046]/85 text-amber-300">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="text-[11px] font-extrabold text-slate-800 truncate">{slotLabel}</div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              activeSlotIdxRef.current = idx;
                              slotPhotoInputRef.current?.click();
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-black inline-flex items-center justify-center gap-1 cursor-pointer transition"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{previewSrc ? 'تبديل' : 'إضافة'}</span>
                          </button>
                          {isCleared ? (
                            <button
                              type="button"
                              onClick={() => restorePhotoSlot(idx)}
                              className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-extrabold cursor-pointer transition"
                              title="استرجاع الصورة الافتراضية"
                            >
                              استرجاع
                            </button>
                          ) : (
                            idx > 0 && (
                              <button
                                type="button"
                                onClick={() => clearPhotoSlot(idx)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition"
                                title="إخفاء هذه الخانة لتقليل عدد صور الكولاج"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standard Custom Photo Upload (for VIP Spotlight #6, Graduate #15 & Single-Photo Templates) */}
            {canUploadPhoto && !activeTemplate.supportsPresidentPortrait && !isMultiPhotoTemplate && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>
                    {activeTemplate.isGraduateSpotlight
                      ? 'صورة الطفل الخريج (تظهر بحجم كبير داخل إطار دائري ببوردر رفيع جداً):'
                      : activeTemplate.supportsPortrait
                        ? 'صورة المتحدث / الضيف (تظهر بحجم كبير داخل إطار دائري ببوردر رفيع جداً):'
                        : 'تبديل الصورة الظاهرة في التصميم (ارفع صورة من جهازك):'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{activeCustomPhoto ? 'تغيير الصورة' : 'رفع صورة من جهازك'}</span>
                  </button>
                  {activeCustomPhoto && (
                    <button
                      type="button"
                      onClick={() =>
                        setCustomPhotos((prev) => {
                          const next = { ...prev };
                          delete next[activeTemplate.id];
                          return next;
                        })
                      }
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                      title="إزالة الصورة المرفوعة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Core Text Editing Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">الشارة العلوية / الرعاية:</label>
                <input
                  type="text"
                  value={activeData.eyebrow || ''}
                  onChange={(e) => updateField('eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">العنوان الرئيسي:</label>
                <input
                  type="text"
                  value={activeData.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/40 border border-amber-300/80 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">السطر الذهبي المميز:</label>
                <input
                  type="text"
                  value={activeData.highlight || ''}
                  onChange={(e) => updateField('highlight', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">النص التعريفي / الاقتباس:</label>
                <textarea
                  rows={2}
                  value={activeData.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {Boolean(activeTemplate.defaults.extraLines) && (
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    البطاقات / البنود داخل التصميم (بصيغة: العنوان | التفاصيل في كل سطر):
                  </label>
                  <textarea
                    rows={4}
                    value={activeData.extraLines || ''}
                    onChange={(e) => updateField('extraLines', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">الشريط السفلي (الموعد أو الرابط):</label>
                <input
                  type="text"
                  value={activeData.footerNote || ''}
                  onChange={(e) => updateField('footerNote', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Ready-to-Post Arabic Instagram & Facebook Caption Box */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-alexandria font-black text-xs sm:text-sm text-slate-900">
                    نص المنشور (الكابشن + الهاشتاغات) الجاهز لإنستغرام وفيسبوك
                  </h4>
                  <p className="text-[11px] text-slate-500">انسخه مباشرة مع الصورة عند النشر على صفحتك</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCaption}
                className={`px-3.5 py-2 rounded-xl text-xs font-alexandria font-black inline-flex items-center gap-1.5 transition cursor-pointer ${
                  copiedCaption
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCaption ? 'تم النسخ!' : 'نسخ نص المنشور'}</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={activeCaption}
              onChange={(e) => setCustomCaptions((prev) => ({ ...prev, [activeTemplate.id]: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignStudio({ embedded = false, standalone = false, asModal = false, isOpen = true, onClose }) {
  useEffect(() => {
    if (!asModal || !isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [asModal, isOpen, onClose]);

  if (asModal) {
    if (!isOpen || typeof document === 'undefined') return null;
    return createPortal(
      <div
        className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-start justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <div className="w-full max-w-7xl bg-slate-50 rounded-[32px] p-4 sm:p-6 shadow-2xl border border-amber-300/40 my-auto">
          <CampaignStudioInner onClose={onClose} />
        </div>
      </div>,
      document.body
    );
  }

  return <CampaignStudioInner embedded={embedded} standalone={standalone} onClose={onClose} />;
}
