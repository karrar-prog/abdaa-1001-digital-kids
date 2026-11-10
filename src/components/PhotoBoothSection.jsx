import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Download,
  Sparkles,
  Upload,
  Award,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';

const FRAME_BADGES = [
  '🎓 خريج الدفعة الأولى • 1001 طفل رقمي',
  '🤖 مبتكر المستقبل في نادي أبدع',
  '❤️ فخورون بأبطال النجف الأشرف',
  '🚀 مرشح الدفعة الثانية (7 – 14 سنة)'
];

const FRAME_THEMES = [
  {
    id: 'gold',
    name: 'ذهبي ملكي',
    borderGrad: 'from-amber-400 via-yellow-500 to-orange-500',
    canvasPrimary: '#0f172a',
    canvasAccent: '#f59e0b',
    canvasSecondary: '#0284c7'
  },
  {
    id: 'cyber',
    name: 'أزرق سماوي تقني',
    borderGrad: 'from-sky-400 via-blue-600 to-indigo-600',
    canvasPrimary: '#09152b',
    canvasAccent: '#38bdf8',
    canvasSecondary: '#f59e0b'
  },
  {
    id: 'violet',
    name: 'بنفسجي إبداعي',
    borderGrad: 'from-violet-500 via-purple-600 to-pink-500',
    canvasPrimary: '#1e1b4b',
    canvasAccent: '#c084fc',
    canvasSecondary: '#38bdf8'
  }
];

const PRESET_PHOTOS = [
  { label: 'صورة مختبر 1', url: '/gallery/training-1.jpg' },
  { label: 'صورة مختبر 2', url: '/gallery/training-2.jpg' },
  { label: 'صورة مختبر 3', url: '/gallery/training-3.jpg' }
];

export default function PhotoBoothSection() {
  const [heroName, setHeroName] = useState('بطل مبادرة 1001 طفل رقمي');
  const [selectedBadge, setSelectedBadge] = useState(FRAME_BADGES[0]);
  const [selectedTheme, setSelectedTheme] = useState(FRAME_THEMES[0]);
  const [photoSrc, setPhotoSrc] = useState('/gallery/training-1.jpg');
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playClickPop();
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPhotoSrc(String(ev.target.result));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadFramedImage = async () => {
    playClickPop();
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
      bgGrad.addColorStop(0, selectedTheme.canvasPrimary);
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      // 2. Outer decorative border
      ctx.strokeStyle = selectedTheme.canvasAccent;
      ctx.lineWidth = 14;
      ctx.strokeRect(28, 28, 1024, 1024);

      // 3. Top Header Banner
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('نادي أبدع للمهارات الذكية • النجف الأشرف', 540, 95);

      ctx.fillStyle = selectedTheme.canvasAccent;
      ctx.font = 'bold 38px Tahoma, sans-serif';
      ctx.fillText('احتفالية تخرج مبادرة «1001» طفل رقمي (2026)', 540, 148);

      // 4. Load & Draw Center Photo
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = photoSrc;
      });

      const boxX = 110;
      const boxY = 185;
      const boxW = 860;
      const boxH = 620;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 32);
      ctx.clip();

      if (img.width && img.height) {
        const scale = Math.max(boxW / img.width, boxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = boxX + (boxW - drawW) / 2;
        const drawY = boxY + (boxH - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(boxX, boxY, boxW, boxH);
      }
      ctx.restore();

      // Photo frame stroke
      ctx.strokeStyle = selectedTheme.canvasAccent;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 32);
      ctx.stroke();

      // 5. Badge Pill over bottom of photo
      ctx.fillStyle = selectedTheme.canvasAccent;
      ctx.beginPath();
      ctx.roundRect(220, 770, 640, 64, 32);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px Tahoma, sans-serif';
      ctx.fillText(selectedBadge, 540, 812);

      // 6. Child / Family Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px Tahoma, sans-serif';
      ctx.fillText(heroName.trim() || 'بطل مبادرة 1001 طفل رقمي', 540, 905);

      // 7. Footer Sponsor line
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px Tahoma, sans-serif';
      ctx.fillText(
        'شركاء المبادرة: نادي أبدع وشركة المصدر لتكنولوجيا المعلومات • برعاية نقابة المبرمجين والرعاة',
        540,
        975
      );

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `abdaa-1001-frame-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      playSuccessChime();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } catch {
      // ignore
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      id="photo-booth"
      className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200/70 dark:border-slate-800 relative overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-extrabold mb-3.5 shadow-xs">
            <Camera className="w-4 h-4 text-sky-500" />
            <span>استوديو التصوير التذكاري للحفل • جاهز للمشاركة على واتساب وإنستغرام 📸</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-alexandria font-black text-slate-900 dark:text-white tracking-tight">
            صمّم <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-sky-500 to-blue-600">إطار التخرج التذكاري</span> لطفلك
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            ارفع صورة طفلك من الهاتف داخل قاعة قصر الثقافة، اكتب اسمه واختر وسام التخرج لتحصل على بطاقة تذكارية مربعة عالية الدقة (1080×1080) جاهزة للنشر الفوري.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-6 frosted-glass rounded-3xl p-6 sm:p-7 space-y-5">
            {/* Step 1: Upload Photo or Choose Preset */}
            <div>
              <label className="block text-xs font-alexandria font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                1. اختر صورة الطفل من هاتفك أو جرب إحدى صور المختبر:
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer btn-playful"
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع صورة من الهاتف / الكاميرا</span>
                </button>

                {PRESET_PHOTOS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setPhotoSrc(preset.url);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      photoSrc === preset.url
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-400'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Child Name */}
            <div>
              <label className="block text-xs font-alexandria font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                2. اسم البطل الخريج أو العائلة على الإطار:
              </label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="اكتب اسم الطفل الثلاثي..."
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Step 3: Badge Selection */}
            <div>
              <label className="block text-xs font-alexandria font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                3. اختر وسام الإطار التذكاري:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FRAME_BADGES.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setSelectedBadge(badge);
                    }}
                    className={`p-2.5 rounded-2xl text-right text-xs font-extrabold border transition cursor-pointer flex items-center justify-between ${
                      selectedBadge === badge
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    <span className="truncate">{badge}</span>
                    {selectedBadge === badge && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Theme Color */}
            <div>
              <label className="block text-xs font-alexandria font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                4. اختر طابع الإطار اللوني:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {FRAME_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setSelectedTheme(theme);
                    }}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold border-2 transition cursor-pointer ${
                      selectedTheme.id === theme.id
                        ? 'border-amber-400 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Action */}
            <button
              type="button"
              onClick={handleDownloadFramedImage}
              disabled={isDownloading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-sky-600 hover:from-amber-400 hover:to-sky-500 text-white font-alexandria font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 cursor-pointer btn-playful"
            >
              <Download className="w-5 h-5" />
              <span>
                {isDownloading
                  ? 'جاري تجهيز البطاقة عالية الدقة...'
                  : 'تحميل بطاقة السيلفي التذكارية (PNG) 📸'}
              </span>
            </button>
          </div>

          {/* Live Framed Preview Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              className={`w-full max-w-md rounded-[32px] p-1.5 bg-gradient-to-br ${selectedTheme.borderGrad} shadow-2xl`}
            >
              <div className="bg-slate-950 rounded-[27px] p-5 text-center text-white flex flex-col justify-between">
                {/* Frame Header */}
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-slate-300">
                    نادي أبدع للمهارات الذكية • النجف الأشرف
                  </div>
                  <div className="text-sm sm:text-base font-alexandria font-black text-amber-400 mt-0.5">
                    احتفالية تخرج مبادرة «1001» طفل رقمي (2026)
                  </div>
                </div>

                {/* Photo Preview Box */}
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-amber-400/70 bg-slate-900 shadow-inner">
                  <img
                    src={photoSrc}
                    alt="معاينة إطار التخرج"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 inset-x-4 py-1.5 px-3 rounded-full bg-amber-400 text-slate-950 font-alexandria font-black text-xs shadow-lg truncate">
                    {selectedBadge}
                  </div>
                </div>

                {/* Hero Name & Sponsor Footer */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="font-alexandria font-black text-lg sm:text-xl text-white truncate">
                    {heroName || 'بطل مبادرة 1001 طفل رقمي'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold mt-1">
                    شركاء المبادرة: نادي أبدع وشركة المصدر • برعاية نقابة المبرمجين والرعاة
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
