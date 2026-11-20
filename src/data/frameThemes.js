// مكتبة ثيمات وملصقات وأشكال استوديو إطارات التخرج الطفولية — مبادرة 1001 طفل رقمي

export const THEME_CATEGORIES = [
  { id: 'all', label: 'كل الثيمات', emoji: '✨' },
  { id: 'kids', label: 'طفولي مبهج', emoji: '🌈' },
  { id: 'celebration', label: 'حفلة وتخرج', emoji: '🎈' },
  { id: 'boys', label: 'أبطال وفضاء', emoji: '🚀' },
  { id: 'girls', label: 'أميرات وفراشات', emoji: '🦋' },
  { id: 'tech', label: 'روبوت وبرمجة', emoji: '🤖' }
];

export const FRAME_THEMES = [
  {
    id: 'rainbow',
    name: 'قوس قزح والغيوم',
    shortDesc: 'ألوان باستيل مبهجة وغيوم مبتسمة',
    emoji: '🌈',
    category: 'kids',
    isDark: false,
    previewGrad: 'from-sky-300 via-amber-200 to-pink-300',
    swatchColors: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399'],
    bgStops: ['#e0f7ff', '#fffbeb', '#ffeef8'],
    outerBorder: '#38bdf8',
    innerBorder: '#fbbf24',
    photoStroke: '#f472b6',
    photoGlow: 'rgba(244, 114, 182, 0.28)',
    titleColor: '#0369a1',
    subtitleColor: '#be185d',
    nameBg: '#ffffff',
    nameBorder: '#38bdf8',
    nameColor: '#0f172a',
    badgeBg: ['#f43f5e', '#f59e0b'],
    badgeText: '#ffffff',
    footerColor: '#334155',
    defaultStickers: ['graduation', 'star', 'rainbow', 'heart']
  },
  {
    id: 'party',
    name: 'مهرجان البالونات',
    shortDesc: 'بالونات طائرة وزينة حفلة وكونفيتي',
    emoji: '🎈',
    category: 'celebration',
    isDark: false,
    previewGrad: 'from-amber-400 via-orange-400 to-rose-400',
    swatchColors: ['#f59e0b', '#fb7185', '#38bdf8', '#a855f7'],
    bgStops: ['#fffbeb', '#fef3c7', '#e0f2fe'],
    outerBorder: '#f59e0b',
    innerBorder: '#fb7185',
    photoStroke: '#f59e0b',
    photoGlow: 'rgba(245, 158, 11, 0.30)',
    titleColor: '#b45309',
    subtitleColor: '#0369a1',
    nameBg: '#ffffff',
    nameBorder: '#f59e0b',
    nameColor: '#0f172a',
    badgeBg: ['#f59e0b', '#ea580c'],
    badgeText: '#ffffff',
    footerColor: '#334155',
    defaultStickers: ['graduation', 'balloon', 'trophy', 'party']
  },
  {
    id: 'space',
    name: 'مغامرة الفضاء',
    shortDesc: 'صاروخ وكواكب ونجوم متلألئة',
    emoji: '🚀',
    category: 'boys',
    isDark: true,
    previewGrad: 'from-indigo-900 via-blue-800 to-purple-800',
    swatchColors: ['#0f172a', '#38bdf8', '#fbbf24', '#a855f7'],
    bgStops: ['#081336', '#162d6b', '#271759'],
    outerBorder: '#38bdf8',
    innerBorder: '#fbbf24',
    photoStroke: '#38bdf8',
    photoGlow: 'rgba(56, 189, 248, 0.45)',
    titleColor: '#fde047',
    subtitleColor: '#bae6fd',
    nameBg: 'rgba(15, 23, 42, 0.82)',
    nameBorder: '#fbbf24',
    nameColor: '#ffffff',
    badgeBg: ['#0284c7', '#7c3aed'],
    badgeText: '#ffffff',
    footerColor: '#cbd5e1',
    defaultStickers: ['rocket', 'graduation', 'star', 'robot']
  },
  {
    id: 'princess',
    name: 'أميرات الإبداع',
    shortDesc: 'تاج ذهبي وفراشات وورود وبريق سحري',
    emoji: '🌸',
    category: 'girls',
    isDark: false,
    previewGrad: 'from-pink-400 via-rose-300 to-purple-400',
    swatchColors: ['#ec4899', '#c084fc', '#fbbf24', '#fbcfe8'],
    bgStops: ['#fff1f7', '#fce7f3', '#f3e8ff'],
    outerBorder: '#ec4899',
    innerBorder: '#f59e0b',
    photoStroke: '#ec4899',
    photoGlow: 'rgba(236, 72, 153, 0.28)',
    titleColor: '#be185d',
    subtitleColor: '#7e22ce',
    nameBg: '#ffffff',
    nameBorder: '#f472b6',
    nameColor: '#4a044e',
    badgeBg: ['#ec4899', '#a855f7'],
    badgeText: '#ffffff',
    footerColor: '#6b21a8',
    defaultStickers: ['crown', 'butterfly', 'graduation', 'heart']
  },
  {
    id: 'robot',
    name: 'عالم الروبوتات',
    shortDesc: 'روبوت أبدع ومكعبات البرمجة والتروس',
    emoji: '🤖',
    category: 'tech',
    isDark: false,
    previewGrad: 'from-cyan-400 via-sky-500 to-indigo-500',
    swatchColors: ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'],
    bgStops: ['#ecfeff', '#e0f2fe', '#eef2ff'],
    outerBorder: '#0284c7',
    innerBorder: '#06b6d4',
    photoStroke: '#0284c7',
    photoGlow: 'rgba(2, 132, 199, 0.28)',
    titleColor: '#0369a1',
    subtitleColor: '#4338ca',
    nameBg: '#ffffff',
    nameBorder: '#06b6d4',
    nameColor: '#0f172a',
    badgeBg: ['#0284c7', '#4f46e5'],
    badgeText: '#ffffff',
    footerColor: '#1e3a8a',
    defaultStickers: ['robot', 'bulb', 'graduation', 'medal']
  },
  {
    id: 'superhero',
    name: 'أبطال السوبر كود',
    shortDesc: 'أشعة كوميك حماسية ونجوم الصاعقة',
    emoji: '⚡',
    category: 'boys',
    isDark: false,
    previewGrad: 'from-blue-600 via-sky-500 to-amber-400',
    swatchColors: ['#2563eb', '#facc15', '#ef4444', '#06b6d4'],
    bgStops: ['#eff6ff', '#dbeafe', '#fef9c3'],
    outerBorder: '#2563eb',
    innerBorder: '#ef4444',
    photoStroke: '#2563eb',
    photoGlow: 'rgba(37, 99, 235, 0.30)',
    titleColor: '#1d4ed8',
    subtitleColor: '#dc2626',
    nameBg: '#fef08a',
    nameBorder: '#1d4ed8',
    nameColor: '#1e3a8a',
    badgeBg: ['#dc2626', '#2563eb'],
    badgeText: '#ffffff',
    footerColor: '#1e293b',
    defaultStickers: ['trophy', 'rocket', 'star', 'graduation']
  },
  {
    id: 'nature',
    name: 'حديقة الشمس والزهور',
    shortDesc: 'شمس مبتسمة وتلال خضراء وزهور ونحلة',
    emoji: '🌻',
    category: 'kids',
    isDark: false,
    previewGrad: 'from-emerald-400 via-lime-300 to-amber-300',
    swatchColors: ['#10b981', '#84cc16', '#facc15', '#38bdf8'],
    bgStops: ['#e0f2fe', '#ecfdf5', '#fefce8'],
    outerBorder: '#10b981',
    innerBorder: '#facc15',
    photoStroke: '#10b981',
    photoGlow: 'rgba(16, 185, 129, 0.28)',
    titleColor: '#047857',
    subtitleColor: '#b45309',
    nameBg: '#ffffff',
    nameBorder: '#10b981',
    nameColor: '#064e3b',
    badgeBg: ['#059669', '#16a34a'],
    badgeText: '#ffffff',
    footerColor: '#065f46',
    defaultStickers: ['butterfly', 'graduation', 'star', 'palette']
  },
  {
    id: 'royal',
    name: 'التخرج الملكي الذهبي',
    shortDesc: 'إكليل غار ذهبي وأناقة ملكية احتفالية',
    emoji: '👑',
    category: 'celebration',
    isDark: true,
    previewGrad: 'from-slate-900 via-blue-950 to-amber-500',
    swatchColors: ['#081b3b', '#f59e0b', '#fde047', '#38bdf8'],
    bgStops: ['#061530', '#0c2754', '#091c3d'],
    outerBorder: '#f59e0b',
    innerBorder: '#fde047',
    photoStroke: '#fbbf24',
    photoGlow: 'rgba(251, 191, 36, 0.42)',
    titleColor: '#fde047',
    subtitleColor: '#e0f2fe',
    nameBg: 'rgba(8, 27, 59, 0.88)',
    nameBorder: '#fbbf24',
    nameColor: '#ffffff',
    badgeBg: ['#d97706', '#f59e0b'],
    badgeText: '#0f172a',
    footerColor: '#cbd5e1',
    defaultStickers: ['graduation', 'crown', 'trophy', 'medal']
  }
];

export const PHOTO_SHAPES = [
  { id: 'rounded', label: 'بطاقة ناعمة', emoji: '🖼️' },
  { id: 'scallop', label: 'إطار سحابة', emoji: '☁️' },
  { id: 'circle', label: 'دائرة البطل', emoji: '⭕' },
  { id: 'arch', label: 'قوس ملكي', emoji: '🏰' },
  { id: 'heart', label: 'قلب لطيف', emoji: '💖' }
];

export const PHOTO_FILTERS = [
  { id: 'natural', label: 'طبيعي', css: 'none' },
  { id: 'bright', label: 'مشرق', css: 'brightness(1.08) contrast(1.04) saturate(1.12)' },
  { id: 'warm', label: 'دافئ', css: 'brightness(1.05) sepia(0.12) saturate(1.18)' },
  { id: 'vivid', label: 'ألوان زاهية', css: 'contrast(1.07) saturate(1.26)' }
];

export const FRAME_FORMATS = [
  {
    id: 'square',
    label: 'مربع (بوست)',
    dimensionsLabel: '1080 × 1080',
    subtitle: 'إنستغرام • فيسبوك • واتساب',
    width: 1080,
    height: 1080
  },
  {
    id: 'story',
    label: 'طولي (ستوري)',
    dimensionsLabel: '1080 × 1920',
    subtitle: 'ستوري إنستغرام • حالة واتساب',
    width: 1080,
    height: 1920
  }
];

export const FRAME_BADGES = [
  '🎓 خريج الدفعة الأولى • 1001 طفل رقمي',
  '🌟 أنا طفل رقمي أبدعت وتخرجت!',
  '🤖 مبتكر المستقبل في نادي أبدع',
  '👑 بطل البرمجة والذكاء الاصطناعي',
  '🦋 أميرة الإبداع والتكنولوجيا',
  '🚀 نحو المستقبل بخطوات ذكية',
  '🏆 مشروع تخرج مبدع • النجف الأشرف',
  '❤️ فخورون بأبطال 1001 طفل رقمي'
];

export const FRAME_STICKERS = [
  { id: 'graduation', emoji: '🎓', label: 'قبعة تخرج', bg: '#fef3c7', border: '#f59e0b' },
  { id: 'robot', emoji: '🤖', label: 'روبوت أبدع', bg: '#e0f2fe', border: '#0284c7' },
  { id: 'rocket', emoji: '🚀', label: 'صاروخ', bg: '#ede9fe', border: '#7c3aed' },
  { id: 'crown', emoji: '👑', label: 'تاج البطل', bg: '#fef9c3', border: '#eab308' },
  { id: 'star', emoji: '⭐', label: 'نجمة تفوق', bg: '#fef3c7', border: '#f59e0b' },
  { id: 'trophy', emoji: '🏆', label: 'كأس إبداع', bg: '#ffedd5', border: '#ea580c' },
  { id: 'balloon', emoji: '🎈', label: 'بالون فرح', bg: '#ffe4e6', border: '#f43f5e' },
  { id: 'butterfly', emoji: '🦋', label: 'فراشة', bg: '#fce7f3', border: '#ec4899' },
  { id: 'rainbow', emoji: '🌈', label: 'قوس قزح', bg: '#e0f7ff', border: '#06b6d4' },
  { id: 'bulb', emoji: '💡', label: 'فكرة ذكية', bg: '#fef9c3', border: '#f59e0b' },
  { id: 'medal', emoji: '🏅', label: 'ميدالية', bg: '#dcfce7', border: '#16a34a' },
  { id: 'heart', emoji: '❤️', label: 'قلب فخر', bg: '#ffe4e6', border: '#e11d48' },
  { id: 'party', emoji: '🎉', label: 'احتفال', bg: '#f3e8ff', border: '#a855f7' },
  { id: 'palette', emoji: '🎨', label: 'فنان مبدع', bg: '#ecfdf5', border: '#10b981' }
];

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

const SAMPLE_GRAD_BOY_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bgB" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="55%" stop-color="#e0f2fe"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgB)"/>
  <circle cx="95" cy="110" r="34" fill="#fde047" opacity="0.7"/>
  <circle cx="515" cy="120" r="24" fill="#f472b6" opacity="0.45"/>
  <circle cx="490" cy="440" r="40" fill="#38bdf8" opacity="0.35"/>
  <circle cx="110" cy="450" r="28" fill="#34d399" opacity="0.4"/>
  <!-- Confetti dots -->
  <circle cx="165" cy="160" r="9" fill="#f59e0b"/>
  <circle cx="445" cy="180" r="10" fill="#0ea5e9"/>
  <circle cx="145" cy="310" r="8" fill="#ec4899"/>
  <circle cx="465" cy="310" r="9" fill="#8b5cf6"/>
  <!-- Gown Shoulders -->
  <path d="M125 600 C135 455 205 415 300 415 C395 415 465 455 475 600 Z" fill="#1e3a8a"/>
  <!-- Golden Graduation Stole -->
  <path d="M235 422 L272 600 L215 600 L185 450 Z" fill="#fbbf24"/>
  <path d="M365 422 L328 600 L385 600 L415 450 Z" fill="#fbbf24"/>
  <!-- Collar Shirt -->
  <path d="M258 418 L300 475 L342 418 Z" fill="#ffffff"/>
  <path d="M292 448 L308 448 L314 510 L300 526 L286 510 Z" fill="#ef4444"/>
  <!-- Neck -->
  <rect x="272" y="365" width="56" height="64" rx="22" fill="#fbd1a2"/>
  <!-- Ears -->
  <circle cx="195" cy="295" r="26" fill="#fbd1a2"/>
  <circle cx="405" cy="295" r="26" fill="#fbd1a2"/>
  <!-- Face -->
  <circle cx="300" cy="285" r="110" fill="#ffe0bd"/>
  <!-- Hair -->
  <path d="M190 272 C192 185 245 155 305 155 C368 155 412 192 410 272 C394 234 366 218 332 214 C290 210 242 222 190 272 Z" fill="#291b14"/>
  <!-- Eyes -->
  <circle cx="258" cy="286" r="14" fill="#1e293b"/>
  <circle cx="342" cy="286" r="14" fill="#1e293b"/>
  <circle cx="253" cy="280" r="5" fill="#ffffff"/>
  <circle cx="337" cy="280" r="5" fill="#ffffff"/>
  <!-- Rosy Cheeks -->
  <ellipse cx="228" cy="316" rx="18" ry="11" fill="#fb7185" opacity="0.45"/>
  <ellipse cx="372" cy="316" rx="18" ry="11" fill="#fb7185" opacity="0.45"/>
  <!-- Big Joyful Smile -->
  <path d="M262 325 Q300 366 338 325 Z" fill="#e11d48"/>
  <path d="M272 327 Q300 340 328 327" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none"/>
  <!-- Graduation Cap -->
  <path d="M210 185 L210 218 Q300 245 390 218 L390 185 Z" fill="#1e3a8a"/>
  <polygon points="300,104 446,162 300,214 154,162" fill="#0f172a" stroke="#fbbf24" stroke-width="6"/>
  <path d="M300 162 L405 182 L412 246" stroke="#fbbf24" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="412" cy="254" r="11" fill="#fde047"/>
  <!-- Certificate Scroll in hand -->
  <g transform="translate(420,490) rotate(-18)">
    <rect x="-46" y="-18" width="92" height="36" rx="14" fill="#fffbeb" stroke="#d97706" stroke-width="4"/>
    <rect x="-8" y="-20" width="16" height="40" rx="4" fill="#ef4444"/>
  </g>
</svg>
`);

const SAMPLE_GRAD_GIRL_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fce7f3"/>
      <stop offset="55%" stop-color="#fdf2f8"/>
      <stop offset="100%" stop-color="#ede9fe"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgG)"/>
  <circle cx="105" cy="115" r="32" fill="#f9a8d4" opacity="0.5"/>
  <circle cx="505" cy="130" r="28" fill="#c4b5fd" opacity="0.55"/>
  <circle cx="485" cy="450" r="38" fill="#fde047" opacity="0.45"/>
  <circle cx="115" cy="445" r="30" fill="#fbcfe8" opacity="0.65"/>
  <!-- Hair Back / Hijab Soft -->
  <path d="M168 300 C168 180 230 148 300 148 C370 148 432 180 432 300 C432 415 390 455 300 455 C210 455 168 415 168 300 Z" fill="#4c1d95"/>
  <!-- Gown Shoulders -->
  <path d="M125 600 C138 452 208 415 300 415 C392 415 462 452 475 600 Z" fill="#1e3a8a"/>
  <!-- Pink-Gold Stole -->
  <path d="M235 422 L272 600 L215 600 L185 450 Z" fill="#fbbf24"/>
  <path d="M365 422 L328 600 L385 600 L415 450 Z" fill="#fbbf24"/>
  <path d="M262 418 L300 472 L338 418 Z" fill="#ffffff"/>
  <!-- Cute Bow -->
  <circle cx="300" cy="458" r="10" fill="#ec4899"/>
  <ellipse cx="282" cy="458" rx="16" ry="11" fill="#f472b6"/>
  <ellipse cx="318" cy="458" rx="16" ry="11" fill="#f472b6"/>
  <!-- Neck & Face -->
  <rect x="274" y="365" width="52" height="58" rx="22" fill="#fbd1a2"/>
  <circle cx="300" cy="288" r="106" fill="#ffe0bd"/>
  <!-- Cute Bangs -->
  <path d="M196 266 C206 190 250 164 300 164 C350 164 394 190 404 266 C374 226 338 214 300 220 C262 214 226 226 196 266 Z" fill="#3b0764"/>
  <!-- Sparkling Eyes with Lashes -->
  <circle cx="258" cy="288" r="14" fill="#1e293b"/>
  <circle cx="342" cy="288" r="14" fill="#1e293b"/>
  <circle cx="253" cy="282" r="5" fill="#ffffff"/>
  <circle cx="337" cy="282" r="5" fill="#ffffff"/>
  <path d="M242 276 L234 268 M358 276 L366 268" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <!-- Rosy Cheeks -->
  <ellipse cx="228" cy="316" rx="19" ry="11" fill="#f472b6" opacity="0.5"/>
  <ellipse cx="372" cy="316" rx="19" ry="11" fill="#f472b6" opacity="0.5"/>
  <!-- Sweet Smile -->
  <path d="M266 326 Q300 364 334 326 Z" fill="#ec4899"/>
  <path d="M276 328 Q300 339 324 328" stroke="#ffffff" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Graduation Cap with Pink-Gold Flair -->
  <path d="M210 184 L210 216 Q300 244 390 216 L390 184 Z" fill="#312e81"/>
  <polygon points="300,104 446,162 300,214 154,162" fill="#1e1b4b" stroke="#fbbf24" stroke-width="6"/>
  <path d="M300 162 L405 182 L412 246" stroke="#fbbf24" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="412" cy="254" r="11" fill="#f472b6"/>
</svg>
`);

const SAMPLE_UPLOAD_PROMPT_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bgP" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="50%" stop-color="#fefce8"/>
      <stop offset="100%" stop-color="#fce7f3"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgP)"/>
  <circle cx="300" cy="255" r="118" fill="#ffffff" stroke="#38bdf8" stroke-width="8" stroke-dasharray="14 10"/>
  <rect x="242" y="218" width="116" height="84" rx="22" fill="#0ea5e9"/>
  <path d="M272 218 L284 196 L316 196 L328 218 Z" fill="#0284c7"/>
  <circle cx="300" cy="260" r="24" fill="#ffffff"/>
  <circle cx="300" cy="260" r="14" fill="#fbbf24"/>
  <circle cx="342" cy="236" r="6" fill="#fef08a"/>
  <text x="300" y="425" text-anchor="middle" font-family="Alexandria, Tajawal, sans-serif" font-size="34" font-weight="900" fill="#0369a1">ارفع صورة بطلك هنا</text>
  <text x="300" y="472" text-anchor="middle" font-family="Tajawal, sans-serif" font-size="22" font-weight="700" fill="#64748b">من الهاتف أو الكاميرا مباشرة</text>
</svg>
`);

export const PRESET_PHOTOS = [
  { label: 'بطل التخرج', url: SAMPLE_GRAD_BOY_SVG },
  { label: 'أميرة التخرج', url: SAMPLE_GRAD_GIRL_SVG },
  { label: 'روبوت أبدع', url: '/graduate/robot_mascot_alt.jpg' },
  { label: 'مكان الصورة', url: SAMPLE_UPLOAD_PROMPT_SVG }
];
