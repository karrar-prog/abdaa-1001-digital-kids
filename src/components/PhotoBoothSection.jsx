import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Download,
  Upload,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shuffle,
  Search,
  Sticker,
  Square,
  Smartphone,
  Sliders,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';
import {
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
  const [subtitle, setSubtitle] = useState('الدفعة الأولى • قصر الثقافة – النجف الأشرف');
  const [selectedBadge, setSelectedBadge] = useState(FRAME_BADGES[0]);
  const [selectedTheme, setSelectedTheme] = useState(FRAME_THEMES[0]);
  const [format, setFormat] = useState('square'); // 'square' | 'story'
  const [photoShape, setPhotoShape] = useState('rounded');
  const [photoFilter, setPhotoFilter] = useState('natural');
  const [selectedStickers, setSelectedStickers] = useState(FRAME_THEMES[0].defaultStickers);
  const [photoSrc, setPhotoSrc] = useState(PRESET_PHOTOS[0].url);
  const [activeSideTab, setActiveSideTab] = useState('info'); // 'info' | 'stickers' | 'adjust'

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
    setSelectedTheme(randTheme);
    setPhotoShape(randShape.id);
    setSelectedBadge(randBadge);
    setSelectedStickers(randTheme.defaultStickers);
    try {
      confetti({ particleCount: 36, spread: 56, origin: { y: 0.55 } });
    } catch {
      // ignore
    }
  };

  const handlePickGraduate = (grad) => {
    playClickPop();
    setHeroName(grad.name);
    setSubtitle(`${grad.track} • 2026`);
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
      link.download = `abdaa-1001-${selectedTheme.id}-${format}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 72,
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
            title: `إطار تخرج ${heroName} — 1001 طفل رقمي`,
            text: `🎓 صمّم إطار تخرج طفلك: https://abdaa.masdar.company/frame`,
            files: [file]
          });
          playSuccessChime();
          return;
        }
      }
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
    setTimeout(() => setCopiedLink(false), 2400);
  };

  return (
    <section
      id="photo-booth"
      className={`${
        standalone ? 'py-5 sm:py-7' : 'py-12 border-t border-slate-200/70'
      } relative overflow-hidden`}
    >
      {/* Hidden File & Camera Inputs */}
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

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 relative z-10 space-y-4">
        {/* Compact Single-Line Studio Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <h1 className="text-xl sm:text-2xl font-alexandria font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🎨</span>
            <span>
              إطار التخرج التذكاري{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-amber-500 to-sky-600">
                لطفلك
              </span>
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 hover:brightness-105 text-white text-xs font-black shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>عشوائي 🎲</span>
            </button>
            <button
              type="button"
              onClick={handleCopyStudioLink}
              className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-600" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================
            QUICK TOP CUSTOMIZATION DOCK (Directly Above the Frame!)
            Upload + Camera + Format + Photo Shape + 8 Playful Themes Strip
           ================================================================ */}
        <div className="bg-white/92 backdrop-blur-xl rounded-3xl p-3 sm:p-4 border-2 border-white shadow-[0_14px_38px_-14px_rgba(14,165,233,0.18)] space-y-3">
          {/* Row 1: Photo Upload + Format + Photo Shape */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Upload & Camera */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>كاميرا</span>
              </button>
            </div>

            {/* Format Segmented Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {FRAME_FORMATS.map((fmt) => {
                const active = format === fmt.id;
                const Icon = fmt.id === 'square' ? Square : Smartphone;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setFormat(fmt.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black inline-flex items-center gap-1.5 cursor-pointer transition ${
                      active
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{fmt.id === 'square' ? 'مربع 1:1' : 'ستوري 9:16'}</span>
                  </button>
                );
              })}
            </div>

            {/* Compact Photo Shapes Strip */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
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
                    title={shape.label}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-black inline-flex items-center gap-1 cursor-pointer transition ${
                      active
                        ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-300'
                        : 'text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <span>{shape.emoji}</span>
                    <span className="hidden sm:inline text-[10.5px]">{shape.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: All 8 Playful Themes Visual Ribbon Right Above the Frame */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5">
            {FRAME_THEMES.map((theme) => {
              const active = selectedTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme)}
                  className={`group rounded-2xl p-1.5 border-2 transition cursor-pointer text-center ${
                    active
                      ? 'border-amber-400 bg-amber-50/70 shadow-sm ring-2 ring-amber-300/60 scale-[1.02]'
                      : 'border-slate-200/80 bg-white hover:border-sky-300'
                  }`}
                >
                  <div
                    className={`h-7 rounded-xl bg-gradient-to-r ${theme.previewGrad} flex items-center justify-center shadow-inner`}
                  >
                    <span className="text-base drop-shadow-xs">{theme.emoji}</span>
                  </div>
                  <div className="mt-1 text-[10px] sm:text-[10.5px] font-alexandria font-black text-slate-800 truncate px-0.5">
                    {theme.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================
            MAIN STUDIO WORKSPACE: Live Frame + Compact 3-Tab Panel
           ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LIVE FRAME PREVIEW & SAVE ACTIONS (7 cols) */}
          <div className="lg:col-span-7 bg-white/88 backdrop-blur-xl rounded-[30px] p-3.5 sm:p-5 border-2 border-white shadow-[0_20px_50px_-15px_rgba(14,165,233,0.2)] space-y-3.5">
            <div className="flex justify-center">
              <div
                className={`relative rounded-[24px] overflow-hidden shadow-xl ring-4 ring-slate-100 select-none ${
                  format === 'story' ? 'w-full max-w-[310px] sm:max-w-[340px]' : 'w-full max-w-[470px]'
                }`}
              >
                <canvas
                  ref={previewCanvasRef}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerUp}
                  onPointerCancel={handleCanvasPointerUp}
                  title="اسحب الصورة لتحريك موقعها"
                  className={`w-full h-auto block touch-none ${
                    isDraggingPhoto ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                />
              </div>
            </div>

            {/* Slim 1-Line Quick Zoom & Reset */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-1.5 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setPhotoZoom((z) => Math.max(0.85, Number((z - 0.1).toFixed(2))))}
                className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
                aria-label="تصغير"
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
                aria-label="تكبير وتصغير"
              />
              <button
                type="button"
                onClick={() => setPhotoZoom((z) => Math.min(2.2, Number((z + 0.1).toFixed(2))))}
                className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
                aria-label="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-black text-sky-700 w-9 text-center dir-ltr">
                {Math.round(photoZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleResetPhotoPos}
                className="px-2 py-1 rounded-lg hover:bg-white text-amber-700 text-[10.5px] font-black inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>توسيط</span>
              </button>
            </div>

            {/* Save PNG & Instant Share */}
            <div className="grid grid-cols-12 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadFramedImage}
                disabled={isDownloading}
                className="col-span-8 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:brightness-105 text-white font-alexandria font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'جارٍ التجهيز...' : 'حفظ الإطار (PNG) 📸'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareFramedImage}
                disabled={isSharing}
                className="col-span-4 py-3.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-alexandria font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98 disabled:opacity-60"
              >
                <Share2 className="w-4 h-4" />
                <span>{isSharing ? '...' : 'مشاركة'}</span>
              </button>
            </div>
          </div>

          {/* COMPACT 3-TAB CUSTOMIZATION PANEL (5 cols) */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-[30px] p-4 sm:p-5 border-2 border-white shadow-[0_14px_38px_-14px_rgba(14,165,233,0.16)] space-y-4">
            {/* 3 Clean Mini Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setActiveSideTab('info');
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-alexandria font-black inline-flex items-center justify-center gap-1 cursor-pointer transition ${
                  activeSideTab === 'info'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>الاسم والوسام</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setActiveSideTab('stickers');
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-alexandria font-black inline-flex items-center justify-center gap-1 cursor-pointer transition ${
                  activeSideTab === 'stickers'
                    ? 'bg-white text-pink-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sticker className="w-3.5 h-3.5" />
                <span>ملصقات ({selectedStickers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setActiveSideTab('adjust');
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-alexandria font-black inline-flex items-center justify-center gap-1 cursor-pointer transition ${
                  activeSideTab === 'adjust'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>إضاءة وضبط</span>
              </button>
            </div>

            {/* TAB 1: Name, 168-Graduate Search & Badges */}
            {activeSideTab === 'info' && (
              <div className="space-y-3.5">
                {/* Quick Search 168 Graduates */}
                <div className="relative">
                  <Search className="w-4 h-4 text-sky-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={gradSearch}
                    onFocus={() => setShowGradDropdown(true)}
                    onBlur={() => setTimeout(() => setShowGradDropdown(false), 180)}
                    onChange={(e) => {
                      setGradSearch(e.target.value);
                      setShowGradDropdown(true);
                    }}
                    placeholder={`ابحث باسم الخريج (${ALL_GRADUATES.length} بطلاً)...`}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  {showGradDropdown && matchingGraduates.length > 0 && (
                    <div className="absolute z-30 mt-1 w-full bg-white rounded-2xl border border-sky-200 shadow-xl overflow-hidden divide-y divide-slate-100">
                      {matchingGraduates.map((grad) => (
                        <button
                          key={grad.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handlePickGraduate(grad);
                          }}
                          className="w-full px-3 py-2 text-right hover:bg-sky-50 transition flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span className="text-xs font-alexandria font-black text-slate-900 truncate">
                            {grad.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                            {grad.initiativeCode}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name & Subtitle */}
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="اسم الطفل..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="سطر فرعي (اختياري)..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Badge Input & Presets */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={selectedBadge}
                    onChange={(e) => setSelectedBadge(e.target.value)}
                    placeholder="عبارة الوسام..."
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50/60 border border-amber-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <div className="grid grid-cols-1 gap-1.5 max-h-[210px] overflow-y-auto pl-0.5">
                    {FRAME_BADGES.map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setSelectedBadge(badge);
                        }}
                        className={`px-3 py-2 rounded-xl text-right text-[11px] font-extrabold border transition cursor-pointer flex items-center justify-between gap-1.5 ${
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
            )}

            {/* TAB 2: Stickers & Kid Sample Avatars */}
            {activeSideTab === 'stickers' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-alexandria font-black text-slate-800">
                      ملصقات الزوايا ({selectedStickers.length}/4)
                    </span>
                    {selectedStickers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setSelectedStickers([]);
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>مسح</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {FRAME_STICKERS.map((st) => {
                      const active = selectedStickers.includes(st.id);
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleToggleSticker(st.id)}
                          className={`py-2 px-1 rounded-xl border-2 transition cursor-pointer flex flex-col items-center gap-0.5 ${
                            active
                              ? 'bg-amber-50 border-amber-400 shadow-xs scale-105'
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

                {/* Kid Sample Avatars */}
                <div>
                  <div className="text-xs font-alexandria font-black text-slate-800 mb-2">
                    نماذج تجريبية سريعة
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
                          className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition bg-white ${
                            active
                              ? 'border-amber-400 ring-2 ring-amber-300'
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
                          <div className="py-1 text-[9.5px] font-extrabold text-slate-700 text-center truncate">
                            {preset.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Filters & Fine Photo Position Controls */}
            {activeSideTab === 'adjust' && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-alexandria font-black text-slate-800 mb-2">
                    فلتر إضاءة الصورة
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PHOTO_FILTERS.map((flt) => (
                      <button
                        key={flt.id}
                        type="button"
                        onClick={() => {
                          playClickPop();
                          setPhotoFilter(flt.id);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                          photoFilter === flt.id
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-alexandria font-black text-slate-800 mb-2">
                    تحريك دقيق للصورة
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => nudgeOffset(0, -24)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 cursor-pointer"
                      aria-label="تحريك للأعلى"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeOffset(0, 24)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 cursor-pointer"
                      aria-label="تحريك للأسفل"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeOffset(24, 0)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 cursor-pointer"
                      aria-label="تحريك لليمين"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeOffset(-24, 0)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 cursor-pointer"
                      aria-label="تحريك لليسار"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPhotoPos}
                      className="px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>توسيط</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
