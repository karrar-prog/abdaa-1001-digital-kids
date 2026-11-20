import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shuffle,
  Search,
  Sticker,
  Palette,
  Square,
  Smartphone,
  Sliders,
  X,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';
import {
  THEME_CATEGORIES,
  FRAME_THEMES,
  PHOTO_SHAPES,
  PHOTO_FILTERS,
  FRAME_FORMATS,
  FRAME_BADGES,
  FRAME_STICKERS,
  PRESET_PHOTOS
} from '../data/frameThemes';
import { GRADUATION_COHORTS } from '../data/cohortsData';
import { renderGraduationFrameToCanvas } from '../utils/frameCanvasRenderer';

const ALL_GRADUATES = GRADUATION_COHORTS.flatMap((cohort) =>
  (cohort.graduates || []).map((g) => ({
    ...g,
    cohortName: cohort.name
  }))
);

export default function PhotoBoothSection({ standalone = false }) {
  const [heroName, setHeroName] = useState('بطل مبادرة 1001 طفل رقمي');
  const [subtitle, setSubtitle] = useState('خريج الدفعة الأولى • قصر الثقافة – النجف الأشرف');
  const [selectedBadge, setSelectedBadge] = useState(FRAME_BADGES[0]);
  const [selectedTheme, setSelectedTheme] = useState(FRAME_THEMES[0]);
  const [themeCategory, setThemeCategory] = useState('all');
  const [format, setFormat] = useState('square'); // 'square' | 'story'
  const [photoShape, setPhotoShape] = useState('rounded');
  const [photoFilter, setPhotoFilter] = useState('natural');
  const [selectedStickers, setSelectedStickers] = useState(FRAME_THEMES[0].defaultStickers);
  const [photoSrc, setPhotoSrc] = useState(PRESET_PHOTOS[0].url);

  // Photo framing adjustments
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);

  // Graduate autocomplete search
  const [gradSearch, setGradSearch] = useState('');
  const [showGradDropdown, setShowGradDropdown] = useState(false);

  // UI state
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dragStateRef = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const renderSeqRef = useRef(0);

  const visibleThemes = useMemo(() => {
    if (themeCategory === 'all') return FRAME_THEMES;
    return FRAME_THEMES.filter((t) => t.category === themeCategory);
  }, [themeCategory]);

  const matchingGraduates = useMemo(() => {
    const q = gradSearch.trim().toLowerCase();
    if (!q) return [];
    return ALL_GRADUATES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.initiativeCode || '').toLowerCase().includes(q)
    ).slice(0, 6);
  }, [gradSearch]);

  // Live WYSIWYG Canvas Preview Render
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const seq = ++renderSeqRef.current;
    let cancelled = false;

    const rafId = requestAnimationFrame(async () => {
      if (cancelled || seq !== renderSeqRef.current) return;
      await renderGraduationFrameToCanvas(canvas, {
        theme: selectedTheme,
        format,
        photoSrc,
        heroName,
        subtitle,
        badge: selectedBadge,
        photoShape,
        photoFilter,
        photoZoom,
        photoOffsetX,
        photoOffsetY,
        stickers: selectedStickers
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [
    selectedTheme,
    format,
    photoSrc,
    heroName,
    subtitle,
    selectedBadge,
    photoShape,
    photoFilter,
    photoZoom,
    photoOffsetX,
    photoOffsetY,
    selectedStickers
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playClickPop();
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPhotoSrc(String(ev.target.result));
        setPhotoZoom(1);
        setPhotoOffsetX(0);
        setPhotoOffsetY(0);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectTheme = (theme) => {
    playClickPop();
    setSelectedTheme(theme);
    setSelectedStickers(theme.defaultStickers || []);
  };

  const handleToggleSticker = (stickerId) => {
    playClickPop();
    setSelectedStickers((prev) => {
      if (prev.includes(stickerId)) {
        return prev.filter((id) => id !== stickerId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), stickerId];
      }
      return [...prev, stickerId];
    });
  };

  const handleSurpriseMe = () => {
    playSuccessChime();
    const randTheme = FRAME_THEMES[Math.floor(Math.random() * FRAME_THEMES.length)];
    const randShape = PHOTO_SHAPES[Math.floor(Math.random() * PHOTO_SHAPES.length)];
    const randBadge = FRAME_BADGES[Math.floor(Math.random() * FRAME_BADGES.length)];
    setThemeCategory('all');
    setSelectedTheme(randTheme);
    setPhotoShape(randShape.id);
    setSelectedBadge(randBadge);
    setSelectedStickers(randTheme.defaultStickers);
    try {
      confetti({ particleCount: 38, spread: 58, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const handlePickGraduate = (grad) => {
    playClickPop();
    setHeroName(grad.name);
    setSubtitle(`${grad.track} • الدفعة الأولى 2026`);
    setGradSearch('');
    setShowGradDropdown(false);
  };

  const handleResetPhotoPos = () => {
    playClickPop();
    setPhotoZoom(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    setPhotoFilter('natural');
  };

  const nudgeOffset = (dx, dy) => {
    playClickPop();
    setPhotoOffsetX((prev) => Math.max(-320, Math.min(320, prev + dx)));
    setPhotoOffsetY((prev) => Math.max(-320, Math.min(320, prev + dy)));
  };

  // Interactive Pointer Drag directly on the Preview Canvas
  const handleCanvasPointerDown = (e) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture?.(e.pointerId);
    setIsDraggingPhoto(true);
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: photoOffsetX,
      origY: photoOffsetY
    };
  };

  const handleCanvasPointerMove = (e) => {
    if (!dragStateRef.current.active) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = rect.width > 0 ? 1080 / rect.width : 2;
    const dx = (e.clientX - dragStateRef.current.startX) * scaleFactor;
    const dy = (e.clientY - dragStateRef.current.startY) * scaleFactor;
    setPhotoOffsetX(Math.max(-340, Math.min(340, Math.round(dragStateRef.current.origX + dx))));
    setPhotoOffsetY(Math.max(-340, Math.min(340, Math.round(dragStateRef.current.origY + dy))));
  };

  const handleCanvasPointerUp = (e) => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setIsDraggingPhoto(false);
    previewCanvasRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const renderExportBlob = useCallback(async () => {
    const offscreen = document.createElement('canvas');
    await renderGraduationFrameToCanvas(offscreen, {
      theme: selectedTheme,
      format,
      photoSrc,
      heroName,
      subtitle,
      badge: selectedBadge,
      photoShape,
      photoFilter,
      photoZoom,
      photoOffsetX,
      photoOffsetY,
      stickers: selectedStickers
    });
    return {
      dataUrl: offscreen.toDataURL('image/png'),
      blob: await new Promise((resolve) => offscreen.toBlob(resolve, 'image/png'))
    };
  }, [
    selectedTheme,
    format,
    photoSrc,
    heroName,
    subtitle,
    selectedBadge,
    photoShape,
    photoFilter,
    photoZoom,
    photoOffsetX,
    photoOffsetY,
    selectedStickers
  ]);

  const handleDownloadFramedImage = async () => {
    playClickPop();
    setIsDownloading(true);
    try {
      const { dataUrl } = await renderExportBlob();
      const link = document.createElement('a');
      const safeSlug = selectedTheme.id;
      link.download = `abdaa-1001-${safeSlug}-${format}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      playSuccessChime();
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#a855f7']
        });
      } catch {
        // ignore
      }
    } catch {
      // ignore
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareFramedImage = async () => {
    playClickPop();
    setIsSharing(true);
    try {
      const { blob, dataUrl } = await renderExportBlob();
      const fileName = `abdaa-1001-frame-${selectedTheme.id}.png`;
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `إطار تخرج ${heroName} — مبادرة 1001 طفل رقمي`,
            text: `🎓 فخورون بتخرج بطلنا ضمن مبادرة 1001 طفل رقمي في نادي أبدع للمهارات الذكية! صمّم إطار طفلك من هنا: https://abdaa.masdar.company/frame`,
            files: [file]
          });
          playSuccessChime();
          return;
        }
      }
      // Fallback: download image directly + copy studio URL
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      playSuccessChime();
    } catch {
      // user cancelled share sheet
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyStudioLink = () => {
    playClickPop();
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/frame`
        : 'https://abdaa.masdar.company/frame';
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2600);
  };

  const activeFormatObj = FRAME_FORMATS.find((f) => f.id === format) || FRAME_FORMATS[0];

  return (
    <section
      id="photo-booth"
      className={`${
        standalone ? 'py-10 sm:py-14' : 'py-16 sm:py-20 border-t border-slate-200/70'
      } relative overflow-hidden transition-colors duration-300`}
    >
      {/* Playful Floating Ambient Blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-pink-300/25 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-96 h-96 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/3 w-80 h-80 rounded-full bg-amber-300/25 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Joyful Studio Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-50 via-amber-50 to-sky-50 border-2 border-amber-300/80 text-sky-900 text-xs font-black mb-3.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>استوديو أبطال 1001 التذكاري • 8 ثيمات طفولية + ملصقات + بوست وستوري 🎨📸</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-alexandria font-black text-slate-900 tracking-tight leading-tight">
            صمّم{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-amber-500 to-sky-600">
              إطار التخرج التذكاري
            </span>{' '}
            لطفلك
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            التقط سيلفي لطفلك أو ارفع صورته، اختر ثيماً طفولياً مبهجاً وشكل الإطار وملصقات الأبطال،
            واحفظ بطاقة تخرج احترافية جاهزة فوراً للنشر على واتساب وإنستغرام!
          </p>

          {/* Top Quick Utility Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 hover:brightness-105 text-white text-xs sm:text-sm font-black shadow-md shadow-pink-500/25 inline-flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Shuffle className="w-4 h-4" />
              <span>فاجئني بتصميم طفولي عشوائي 🎲</span>
            </button>

            <button
              type="button"
              onClick={handleCopyStudioLink}
              className="px-4 py-2.5 rounded-2xl bg-white/95 hover:bg-sky-50 border-2 border-sky-200 text-sky-800 text-xs sm:text-sm font-extrabold shadow-xs inline-flex items-center gap-2 cursor-pointer transition"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ رابط الاستوديو (/frame)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sky-600" />
                  <span>نسخ رابط الاستوديو للمشاركة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Two-Column Interactive Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT / STICKY LIVE WYSIWYG CANVAS PREVIEW (Shows first on desktop, top-friendly on mobile) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4 order-1 lg:order-2">
            {/* Format Switcher Bar */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-2.5 border-2 border-white shadow-lg flex items-center gap-2">
              {FRAME_FORMATS.map((fmt) => {
                const isSelected = format === fmt.id;
                const Icon = fmt.id === 'square' ? Square : Smartphone;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setFormat(fmt.id);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs font-alexandria font-black leading-tight">{fmt.label}</div>
                      <div className={`text-[10px] font-bold ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {fmt.dimensionsLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Canvas Frame Container */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[34px] p-3.5 sm:p-5 border-2 border-white shadow-[0_24px_60px_-15px_rgba(14,165,233,0.22)]">
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600">
                  <span className="text-base">{selectedTheme.emoji}</span>
                  <span>ثيم: {selectedTheme.name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sky-700">{activeFormatObj.subtitle}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                  <Move className="w-3 h-3" />
                  اسحب لتحريك الصورة
                </span>
              </div>

              <div className="flex justify-center">
                <div
                  className={`relative rounded-[26px] overflow-hidden shadow-xl ring-4 ring-slate-100 select-none ${
                    format === 'story' ? 'w-full max-w-[330px] sm:max-w-[360px]' : 'w-full max-w-[480px]'
                  }`}
                >
                  <canvas
                    ref={previewCanvasRef}
                    onPointerDown={handleCanvasPointerDown}
                    onPointerMove={handleCanvasPointerMove}
                    onPointerUp={handleCanvasPointerUp}
                    onPointerCancel={handleCanvasPointerUp}
                    className={`w-full h-auto block touch-none ${
                      isDraggingPhoto ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                  />
                </div>
              </div>

              {/* Photo Zoom, Nudge & Color Filter Mini-Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setPhotoZoom((z) => Math.max(0.85, Number((z - 0.1).toFixed(2))))}
                      className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
                      aria-label="تصغير الصورة"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="0.85"
                      max="2.2"
                      step="0.05"
                      value={photoZoom}
                      onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-sky-600 cursor-pointer"
                      aria-label="تكبير وتصغير الصورة"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoZoom((z) => Math.min(2.2, Number((z + 0.1).toFixed(2))))}
                      className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
                      aria-label="تكبير الصورة"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-black text-sky-700 w-10 text-center dir-ltr">
                      {Math.round(photoZoom * 100)}%
                    </span>
                  </div>

                  {/* Quick Direction Nudge Pad */}
                  <div className="flex items-center gap-1 bg-slate-50 rounded-2xl p-1 border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => nudgeOffset(0, -24)}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-600 cursor-pointer"
                      title="تحريك للأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeOffset(0, 24)}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-600 cursor-pointer"
                      title="تحريك للأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeOffset(24, 0)}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-600 cursor-pointer"
                      title="تحريك لليمين"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeOffset(-24, 0)}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-600 cursor-pointer"
                      title="تحريك لليسار"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPhotoPos}
                      className="px-2 py-1.5 rounded-xl hover:bg-white text-amber-700 text-[10px] font-black inline-flex items-center gap-1 cursor-pointer"
                      title="إعادة ضبط الصورة"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>توسيط</span>
                    </button>
                  </div>
                </div>

                {/* Photo Glow Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-500 ml-1">
                    <Sliders className="w-3.5 h-3.5 text-sky-500" />
                    إضاءة الصورة:
                  </span>
                  {PHOTO_FILTERS.map((flt) => (
                    <button
                      key={flt.id}
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setPhotoFilter(flt.id);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition cursor-pointer ${
                        photoFilter === flt.id
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Download & Share CTAs */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadFramedImage}
                  disabled={isDownloading}
                  className="sm:col-span-8 py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:brightness-105 text-white font-alexandria font-black text-sm sm:text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 disabled:opacity-60"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {isDownloading
                      ? 'جارٍ تجهيز الإطار عالي الدقة...'
                      : `حفظ الإطار عالي الدقة (${activeFormatObj.dimensionsLabel}) 📸`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShareFramedImage}
                  disabled={isSharing}
                  className="sm:col-span-4 py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-alexandria font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 disabled:opacity-60"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isSharing ? 'جارٍ المشاركة...' : 'مشاركة فورية'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT / PLAYFUL CUSTOMIZATION STUDIO CONTROLS */}
          <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
            {/* STEP 1: Upload / Camera Selfie */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border-2 border-white shadow-[0_14px_38px_-14px_rgba(14,165,233,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-alexandria font-black text-sm flex items-center justify-center shadow-sm">
                    1
                  </span>
                  <div>
                    <h2 className="text-base font-alexandria font-black text-slate-900">
                      أضف صورة البطل 📸
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      التقط صورة فورية بالكاميرا أو ارفعها من الاستوديو
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer transition active:scale-98"
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع صورة من الهاتف</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer transition active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  <span>التقاط سيلفي بالكاميرا</span>
                </button>
              </div>

              {/* Preset Kid Sample Avatars Strip */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 mb-2">
                  أو جرّب التصميم فوراً على نماذج أبطال أبدع:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_PHOTOS.map((preset) => {
                    const active = photoSrc === preset.url;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setPhotoSrc(preset.url);
                          setPhotoZoom(1);
                          setPhotoOffsetX(0);
                          setPhotoOffsetY(0);
                        }}
                        className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition bg-white ${
                          active
                            ? 'border-amber-400 ring-2 ring-amber-300 scale-[1.02]'
                            : 'border-slate-200 hover:border-sky-400'
                        }`}
                      >
                        <div className="aspect-square w-full overflow-hidden">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="py-1 px-1 text-[10px] font-extrabold text-slate-700 text-center truncate bg-white/95 border-t border-slate-100">
                          {preset.label}
                        </div>
                        {active && (
                          <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 2: 8 Playful Kid-Friendly Themes */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border-2 border-white shadow-[0_14px_38px_-14px_rgba(244,114,182,0.18)] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 text-white font-alexandria font-black text-sm flex items-center justify-center shadow-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-base font-alexandria font-black text-slate-900 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-pink-500" />
                      <span>اختر الثيم الطفولي المفضل (8 تصاميم)</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      كل ثيم مرسوم برسوماته الخاصة وألوانه الاحتفالية المبهجة
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {THEME_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setThemeCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap border transition cursor-pointer inline-flex items-center gap-1 ${
                      themeCategory === cat.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Themes Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {visibleThemes.map((theme) => {
                  const isActive = selectedTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme)}
                      className={`group text-right rounded-2xl p-3 border-2 transition-all cursor-pointer relative overflow-hidden ${
                        isActive
                          ? 'border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-300/60 scale-[1.01]'
                          : 'border-slate-200/90 bg-white hover:border-sky-300 hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Mini color banner */}
                      <div
                        className={`h-8 rounded-xl bg-gradient-to-r ${theme.previewGrad} mb-2.5 px-2.5 flex items-center justify-between shadow-inner`}
                      >
                        <span className="text-lg drop-shadow-sm">{theme.emoji}</span>
                        <div className="flex items-center gap-1">
                          {theme.swatchColors.map((hex, i) => (
                            <span
                              key={i}
                              style={{ backgroundColor: hex }}
                              className="w-3 h-3 rounded-full border border-white/90 shadow-xs"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="font-alexandria font-black text-xs sm:text-sm text-slate-900 leading-snug">
                            {theme.name}
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                            {theme.shortDesc}
                          </div>
                        </div>
                        {isActive && (
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Photo Shape + Playful Stickers */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border-2 border-white shadow-[0_14px_38px_-14px_rgba(16,185,129,0.16)] space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-alexandria font-black text-sm flex items-center justify-center shadow-sm">
                  3
                </span>
                <div>
                  <h2 className="text-base font-alexandria font-black text-slate-900 flex items-center gap-1.5">
                    <Sticker className="w-4 h-4 text-emerald-500" />
                    <span>شكل إطار الصورة والملصقات الطفولية</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    زيّن زوايا الإطار بملصقات الأبطال (حتى 4 ملصقات)
                  </p>
                </div>
              </div>

              {/* Photo Shape Picker */}
              <div>
                <label className="block text-xs font-alexandria font-extrabold text-slate-700 mb-2">
                  شكل قصّ الصورة داخل الإطار:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PHOTO_SHAPES.map((shape) => {
                    const active = photoShape === shape.id;
                    return (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setPhotoShape(shape.id);
                        }}
                        className={`py-2.5 px-2 rounded-2xl border-2 text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          active
                            ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <span className="text-lg leading-none">{shape.emoji}</span>
                        <span className="text-[10.5px] font-extrabold leading-tight">{shape.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stickers Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-alexandria font-extrabold text-slate-700">
                    ملصقات الزوايا التزيينية ({selectedStickers.length} / 4):
                  </label>
                  {selectedStickers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setSelectedStickers([]);
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>مسح الملصقات</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {FRAME_STICKERS.map((st) => {
                    const active = selectedStickers.includes(st.id);
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleToggleSticker(st.id)}
                        title={st.label}
                        className={`py-2 px-1 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center gap-0.5 ${
                          active
                            ? 'bg-amber-50 border-amber-400 shadow-sm scale-105'
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <span className="text-xl leading-none">{st.emoji}</span>
                        <span className="text-[9.5px] font-bold text-slate-600 truncate w-full text-center">
                          {st.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 4: Graduate Name, Quick 168-Graduates Lookup & Badge */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border-2 border-white shadow-[0_14px_38px_-14px_rgba(245,158,11,0.18)] space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-alexandria font-black text-sm flex items-center justify-center shadow-sm">
                  4
                </span>
                <div>
                  <h2 className="text-base font-alexandria font-black text-slate-900">
                    اسم البطل الخريج ووسام التخرج 🎓
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    اكتب الاسم مباشرة أو اختره من قائمة خريجي الدفعة الأولى (168 بطلاً)
                  </p>
                </div>
              </div>

              {/* Quick Lookup in 168 Graduates */}
              <div className="relative">
                <div className="relative">
                  <Search className="w-4 h-4 text-sky-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={gradSearch}
                    onFocus={() => setShowGradDropdown(true)}
                    onBlur={() => setTimeout(() => setShowGradDropdown(false), 180)}
                    onChange={(e) => {
                      setGradSearch(e.target.value);
                      setShowGradDropdown(true);
                    }}
                    placeholder="ابحث سريعاً عن اسم طفلك من قائمة الـ 168 خريجاً..."
                    className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                {showGradDropdown && matchingGraduates.length > 0 && (
                  <div className="absolute z-30 mt-1.5 w-full bg-white rounded-2xl border border-sky-200 shadow-xl overflow-hidden divide-y divide-slate-100">
                    {matchingGraduates.map((grad) => (
                      <button
                        key={grad.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handlePickGraduate(grad);
                        }}
                        className="w-full px-3.5 py-2.5 text-right hover:bg-sky-50 transition flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-alexandria font-black text-slate-900">
                            {grad.name}
                          </div>
                          <div className="text-[10.5px] text-sky-700 font-bold">{grad.track}</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                          {grad.initiativeCode}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hero Name + Subtitle Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-alexandria font-extrabold text-slate-700 mb-1.5">
                    اسم الطفل / البطل على الإطار:
                  </label>
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="مثال: علي حسين كاظم"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-alexandria font-extrabold text-slate-700 mb-1.5">
                    السطر التعريفي / المسار (اختياري):
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="مثال: خريج مسار الروبوتات والبرمجة"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Badge Presets + Custom Input */}
              <div>
                <label className="block text-[11px] font-alexandria font-extrabold text-slate-700 mb-2">
                  شريط الوسام التذكاري أسفل الصورة (اختر أو اكتب عبارتك):
                </label>
                <input
                  type="text"
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 mb-2.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {FRAME_BADGES.map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setSelectedBadge(badge);
                      }}
                      className={`p-2 rounded-xl text-right text-[11px] font-extrabold border transition cursor-pointer flex items-center justify-between gap-1 ${
                        selectedBadge === badge
                          ? 'bg-sky-600 text-white border-sky-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400'
                      }`}
                    >
                      <span className="truncate">{badge}</span>
                      {selectedBadge === badge && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
