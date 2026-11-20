import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { EVENT_DETAILS, getActiveProjects } from '../data/eventData';
import {
  Search,
  Eye,
  X,
  Bot,
  Brain,
  Code2,
  ShieldCheck,
  Cpu,
  Radio,
  Layers,
  Flame,
  Zap,
  ThumbsUp,
  Award,
  CheckCircle2,
  QrCode,
  User,
  School,
  MapPin,
  Sparkles,
  ZoomIn
} from 'lucide-react';

// Visual 3D Tech illustration fallback when a project has no uploaded photo/poster
const ProjectVisualBadge = ({ iconType }) => {
  switch (iconType) {
    case 'robot':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Bot className="w-8 h-8 text-sky-200 group-hover:rotate-6 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-sky-100 mt-2 font-alexandria flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-300" />
              روبوت ذكي ومتحكم فيزيائي
            </span>
          </div>
        </div>
      );
    case 'ai-vision':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-700 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Brain className="w-8 h-8 text-purple-200 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-purple-100 mt-2 font-alexandria flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" />
              ذكاء اصطناعي وإبداع رقمي
            </span>
          </div>
        </div>
      );
    case 'code-screen':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 via-teal-600 to-emerald-600 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Code2 className="w-8 h-8 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-emerald-100 mt-2 font-alexandria flex items-center gap-1">
              <Layers className="w-3 h-3 text-teal-200" />
              منصة برمجية وتطبيق تفاعلي
            </span>
          </div>
        </div>
      );
    case 'security':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <ShieldCheck className="w-8 h-8 text-amber-200 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-amber-100 mt-2 font-alexandria flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-yellow-300" />
              درع الأمان السيبراني والتوعية
            </span>
          </div>
        </div>
      );
    case 'rover':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-cyan-600 via-sky-600 to-blue-700 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Radio className="w-8 h-8 text-cyan-200 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-cyan-100 mt-2 font-alexandria flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-300" />
              روبوت إنقاذ ومركبة ذكية
            </span>
          </div>
        </div>
      );
    case 'sign-lang':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-purple-700 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Sparkles className="w-8 h-8 text-fuchsia-200 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-purple-100 mt-2 font-alexandria flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-300" />
              ابتكار إنساني لخدمة المجتمع
            </span>
          </div>
        </div>
      );
    case 'iot':
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Cpu className="w-8 h-8 text-emerald-200 group-hover:rotate-6 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-emerald-100 mt-2 font-alexandria flex items-center gap-1">
              <Radio className="w-3 h-3 text-teal-300" />
              إنترنت الأشياء والحساسات الذكية
            </span>
          </div>
        </div>
      );
    default:
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-700 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Code2 className="w-8 h-8 text-sky-200 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-sky-100 mt-2 font-alexandria flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-300" />
              تطوير الألعاب والمنطق
            </span>
          </div>
        </div>
      );
  }
};

const TRACK_ARABIC_LABEL = {
  Robotics: 'الروبوتات والمتحكمات',
  'Artificial Intelligence': 'الذكاء الاصطناعي',
  Programming: 'البرمجة والألعاب',
  Cybersecurity: 'الأمن السيبراني'
};

export default function ProjectsExpo({ onOpenJudgingPortal }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState('');
  const [modalQr, setModalQr] = useState('');

  const allProjects = getActiveProjects();

  // حفظ أصوات الجمهور محلياً
  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('abdaa_voted_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // جواز السفر الرقمي للمعرض (جمع أختام الأجنحة الـ 4)
  const [collectedStamps, setCollectedStamps] = useState(() => {
    try {
      const saved = localStorage.getItem('abdaa_expo_stamps');
      return saved ? JSON.parse(saved) : ['Robotics'];
    } catch {
      return ['Robotics'];
    }
  });

  const passportTracks = [
    { id: 'Robotics', title: 'ختم الروبوتات', emoji: '🤖' },
    { id: 'Artificial Intelligence', title: 'ختم الذكاء الاصطناعي', emoji: '🧠' },
    { id: 'Programming', title: 'ختم البرمجة والألعاب', emoji: '💻' },
    { id: 'Cybersecurity', title: 'ختم الأمن السيبراني', emoji: '🛡️' }
  ];

  const addExpoStamp = (trackId) => {
    if (!trackId || trackId === 'ALL') return;
    setCollectedStamps((prev) => {
      if (prev.includes(trackId)) return prev;
      const next = [...prev, trackId];
      try {
        localStorage.setItem('abdaa_expo_stamps', JSON.stringify(next));
      } catch {
        // ignore
      }
      if (next.length === 4) {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const trackCounts = useMemo(() => {
    const counts = { Robotics: 0, 'Artificial Intelligence': 0, Programming: 0, Cybersecurity: 0 };
    allProjects.forEach((p) => {
      if (counts[p.track] !== undefined) counts[p.track] += 1;
    });
    return counts;
  }, [allProjects]);

  const categories = [
    { id: 'ALL', name: `الكل (${allProjects.length} مشروعاً)` },
    { id: 'Programming', name: `البرمجة والألعاب (${trackCounts.Programming})` },
    { id: 'Robotics', name: `الروبوتات والمتحكمات (${trackCounts.Robotics})` },
    { id: 'Artificial Intelligence', name: `الذكاء الاصطناعي (${trackCounts['Artificial Intelligence']})` },
    { id: 'Cybersecurity', name: `الأمن السيبراني (${trackCounts.Cybersecurity})` }
  ];

  const ageFilters = [
    { id: 'ALL', name: 'كل الأعمار (6 – 14 سنة)' },
    { id: '7-9', name: 'فئة 6 – 9 سنوات' },
    { id: '10-11', name: 'فئة 10 – 11 سنة' },
    { id: '12-14', name: 'فئة 12 – 14 سنة' }
  ];

  useEffect(() => {
    if (!activeModalProject) {
      setModalQr('');
      return;
    }
    const buildQr = async () => {
      try {
        const payload = JSON.stringify({
          code: activeModalProject.code || `ABD-PRJ-${String(activeModalProject.id).padStart(2, '0')}`,
          booth: `Booth #${activeModalProject.id}`,
          title: activeModalProject.title,
          team: activeModalProject.students,
          school: activeModalProject.school || '',
          ageGroup: activeModalProject.ageLabel
        });
        const url = await QRCode.toDataURL(payload, {
          width: 200,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' }
        });
        setModalQr(url);
      } catch {
        // ignore
      }
    };
    buildQr();
  }, [activeModalProject]);

  const handleToggleVote = (e, projId) => {
    e.stopPropagation();
    setVotedIds((prev) => {
      const already = prev.includes(projId);
      const next = already ? prev.filter((id) => id !== projId) : [...prev, projId];
      try {
        localStorage.setItem('abdaa_voted_projects', JSON.stringify(next));
      } catch {
        // ignore
      }
      if (!already) {
        try {
          confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allProjects.filter((p) => {
      const matchCategory = selectedCategory === 'ALL' || p.track === selectedCategory;
      const matchAge = selectedAgeFilter === 'ALL' || p.ageGroup === selectedAgeFilter;
      if (!q) return matchCategory && matchAge;
      const haystack = [
        p.title,
        p.desc,
        p.students,
        p.school,
        p.governorate,
        p.code,
        ...(p.techTags || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchCategory && matchAge && haystack.includes(q);
    });
  }, [allProjects, selectedCategory, selectedAgeFilter, searchQuery]);

  return (
    <section id="projects" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5 text-right">
          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 tracking-wider uppercase bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-800 inline-flex items-center gap-1.5 mb-2.5">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>المعرض التقني الابتكاري الحي • مشاريع أطفال مبادرة 1001 طفل رقمي</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria">
              معرض الـ {allProjects.length} ابتكاراً بأيدي أطفالنا
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
              مشاريع حقيقية وأجنحة تفاعلية يقدمها الخريجون الصغار من النجف الأشرف وكربلاء وبغداد والبصرة مباشرةً أمام العائلات ولجان التقييم العلمية والشركات الراعية.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث باسم الطفل أو المدرسة أو المشروع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 shadow-sm placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Expo Digital Passport & 4-Track Stamp Collector */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border-2 border-sky-400/30 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-2xl shrink-0">
              🛂
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-alexandria font-black text-sm sm:text-base text-white">
                  جواز مستكشف معرض أبدع الرقمي
                </h3>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {collectedStamps.length}/4 أختام
                </span>
              </div>
              <p className="text-xs text-sky-200/90 mt-0.5">
                {collectedStamps.length === 4
                  ? '🎉 مبروك! جمعت كل أختام المعرض الأربعة وحصلت على وسام «مستكشف معرض أبدع الذهبي»!'
                  : 'استكشف أقسام المعرض الأربعة بالأسفل لجمع الأختام الرقمية الأربعة والحصول على الوسام الذهبي!'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            {passportTracks.map((pt) => {
              const stamped = collectedStamps.includes(pt.id);
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(pt.id);
                    addExpoStamp(pt.id);
                  }}
                  className={`px-3 py-2 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    stamped
                      ? 'bg-emerald-500/20 border-emerald-400/60 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{pt.emoji}</span>
                    <span className="text-[11px] font-extrabold">{pt.title}</span>
                  </div>
                  {stamped ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-dashed border-white/40 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Filter Bars: Track + Age Stage */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  addExpoStamp(cat.id);
                }}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Age Group Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 ml-1 whitespace-nowrap">تصفية حسب العمر:</span>
            {ageFilters.map((af) => (
              <button
                key={af.id}
                onClick={() => setSelectedAgeFilter(af.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedAgeFilter === af.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                {af.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid with Real Children Posters & Photos */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-14 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-10">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              لم يتم العثور على مشروع مطابق للبحث الحالي. جرّب مسح التصفية أو البحث باسم آخر.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedAgeFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-black hover:bg-sky-500 transition cursor-pointer"
            >
              عرض جميع المشاريع ({allProjects.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mb-10">
            {filteredProjects.map((project, idx) => {
              const isVoted = votedIds.includes(project.id);
              const voteCount = (project.votes || 120) + (isVoted ? 1 : 0);
              const boothNumber = idx + 1;

              return (
                <div
                  key={project.id}
                  className="tech-card rounded-2xl p-4 flex flex-col justify-between cursor-pointer group text-right hover:border-sky-400 dark:hover:border-sky-400 transition-all duration-300"
                  onClick={() => {
                    addExpoStamp(project.track);
                    setActiveModalProject(project);
                  }}
                >
                  <div>
                    {/* Real Project Image / Poster OR Tech Visual Fallback */}
                    <div className="mb-3.5 relative">
                      {project.image ? (
                        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/70 dark:border-slate-700/70">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-950/65 to-transparent pointer-events-none" />
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/75 to-transparent pointer-events-none" />
                        </div>
                      ) : (
                        <ProjectVisualBadge iconType={project.iconType} track={project.track} />
                      )}

                      {/* Stand Number Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                        جناح #{project.id || boothNumber}
                      </div>

                      {/* Age Group Badge */}
                      {project.ageLabel && (
                        <div className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm max-w-[62%] truncate">
                          {project.ageLabel}
                        </div>
                      )}

                      {/* Prototype Status Pill */}
                      <div className="absolute bottom-2.5 right-2.5 bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{project.badge || 'مشروع حي'}</span>
                      </div>
                    </div>

                    {/* Track Badge & Score */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 truncate">
                        {TRACK_ARABIC_LABEL[project.track] || project.track}
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
                        <Award className="w-3.5 h-3.5" />
                        <span>{project.score || 95}/100</span>
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-sky-400 transition-colors mb-2 font-alexandria line-clamp-2 leading-snug">
                      {project.title}
                    </h3>

                    {/* Child Name & School Highlight */}
                    <div className="mb-2.5 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                        <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span className="truncate">{project.students}</span>
                      </div>
                      {(project.school || project.governorate) && (
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          <School className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">
                            {[project.school, project.governorate].filter(Boolean).join(' • ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 line-clamp-3 leading-relaxed">
                      {project.desc}
                    </p>

                    {/* Tech Stack Tags */}
                    {project.techTags && (
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {project.techTags.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Upvote & Details Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleVote(e, project.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        isVoted
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                      }`}
                      title="صوّت لدعم وتشجيع هذا الطفل المبتكر"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{isVoted ? 'تم الدعم' : 'ادعم الابتكار'}</span>
                      <span className="font-mono">({voteCount})</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-sky-400 group-hover:translate-x-[-4px] transition-transform">
                      <span>التفاصيل وQR</span>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Judging Leaderboard Action */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {onOpenJudgingPortal && (
            <button
              type="button"
              onClick={() => onOpenJudgingPortal(null)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>لوحة الصدارة الحية وبوابة التحكيم الإلكتروني ({allProjects.length} مشروعاً • 100 درجة)</span>
            </button>
          )}
        </div>

        {/* 100-Point Scientific Evaluation Criteria Panel */}
        <div className="rounded-3xl p-6 sm:p-9 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg text-right">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-2">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>منظومة التحكيم والتقييم العلمي المعتمد</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-alexandria">
                معايير تقييم ابتكارات الأطفال في المعرض (من 100 درجة)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                تخضع جميع المشاريع الـ {allProjects.length} لتقييم علمي وتربوي مشترك من لجنة نقابة المبرمجين العراقيين وأساتذة الجامعات وشركة المصدر مع مراعاة الفئة العمرية (6–14 سنة).
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <div className="text-center">
                <strong className="block text-2xl font-black text-sky-600 dark:text-sky-400 font-alexandria">100</strong>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">الدرجة الكلية</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <strong className="block text-2xl font-black text-amber-500 font-alexandria">5 محاور</strong>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">للتقييم العلمي</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {EVENT_DETAILS.evaluationCriteria.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {c.score}
                    </span>
                  </div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block leading-snug mb-3">
                    {c.title}
                  </strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                    style={{ width: c.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Project Detail Modal with Full Poster Viewer, Features, Engineering Breakdown & Live Booth QR */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-right relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute left-5 top-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition z-20 cursor-pointer shadow-sm"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full Project Poster / Photo Inside Modal */}
            <div className="mb-5">
              {activeModalProject.image ? (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center group">
                  <img
                    src={activeModalProject.image}
                    alt={activeModalProject.title}
                    className="w-full max-h-[420px] object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomedImageUrl(activeModalProject.image)}
                    className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 backdrop-blur-md transition cursor-pointer shadow-lg"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>تكبير الصورة</span>
                  </button>
                </div>
              ) : (
                <ProjectVisualBadge iconType={activeModalProject.iconType} track={activeModalProject.track} />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 dark:bg-sky-950 text-brand-700 dark:text-sky-300 border border-brand-200 dark:border-sky-800">
                {TRACK_ARABIC_LABEL[activeModalProject.track] || activeModalProject.track}
              </span>
              {activeModalProject.ageLabel && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {activeModalProject.ageLabel}
                </span>
              )}
              <span className="text-xs text-slate-400 font-bold">جناح العرض #{activeModalProject.id}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-auto bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                التقييم العلمي: {activeModalProject.score || 96}/100
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-alexandria mb-1.5 leading-snug">
              {activeModalProject.title}
            </h3>

            {activeModalProject.subtitle && (
              <p className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 mb-3">
                {activeModalProject.subtitle}
              </p>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-tajawal">
              {activeModalProject.desc}
            </p>

            {/* Highlights / Benefits Checklist */}
            {Array.isArray(activeModalProject.features) && activeModalProject.features.length > 0 && (
              <div className="mb-5 p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60">
                <strong className="text-xs font-extrabold text-sky-800 dark:text-sky-300 block mb-2.5">
                  أبرز مميزات وفوائد المشروع:
                </strong>
                <ul className="space-y-1.5">
                  {activeModalProject.features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Structured Engineering Breakdown (Problem / Solution / Impact) */}
            {(activeModalProject.problem || activeModalProject.solution) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/60">
                  <strong className="text-xs font-bold text-rose-700 dark:text-rose-300 block mb-1">1. الفكرة والمشكلة:</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeModalProject.problem}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/60">
                  <strong className="text-xs font-bold text-sky-700 dark:text-sky-300 block mb-1">2. الحل التقني المبتكر:</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeModalProject.solution}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60">
                  <strong className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-1">3. الأثر والفائدة:</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeModalProject.impact}</p>
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {activeModalProject.techTags && (
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-400 block mb-2">الأدوات والتقنيات المستخدمة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.techTags.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Student, School, Governorate & Booth QR Verification Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-right flex-1 w-full">
                <div className="text-xs text-slate-400 font-bold">المبرمج الصغير وبطاقة الجناح:</div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{activeModalProject.students}</span>
                </div>
                {activeModalProject.school && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>
                      {activeModalProject.school}
                      {activeModalProject.grade ? ` — ${activeModalProject.grade}` : ''}
                    </span>
                  </div>
                )}
                {activeModalProject.governorate && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>المحافظة: {activeModalProject.governorate}</span>
                  </div>
                )}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    كود توثيق المشروع:{' '}
                    <strong className="font-mono text-sky-600 dark:text-sky-400">
                      {activeModalProject.code || `ABD-PRJ-${String(activeModalProject.id).padStart(2, '0')}`}
                    </strong>
                  </span>
                </div>
              </div>

              {modalQr && (
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shrink-0 shadow-xs">
                  <img src={modalQr} alt="QR الجناح" className="w-20 h-20 object-contain mx-auto" />
                  <span className="block text-[9px] font-mono font-bold text-slate-500 mt-1 flex items-center justify-center gap-1">
                    <QrCode className="w-2.5 h-2.5" />
                    <span>جناح #{activeModalProject.id}</span>
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveModalProject(null)}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-sky-600 text-white font-bold text-sm hover:bg-slate-800 dark:hover:bg-sky-500 transition shadow-md cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox */}
      {zoomedImageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImageUrl('')}
        >
          <button
            type="button"
            onClick={() => setZoomedImageUrl('')}
            className="absolute top-5 left-5 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
            aria-label="إغلاق التكبير"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomedImageUrl}
            alt="عرض المشروع بالحجم الكامل"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </section>
  );
}
