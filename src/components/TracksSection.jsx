import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { 
  Code2, 
  Bot, 
  Brain, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Compass, 
  GraduationCap,
  Cpu,
  Layers
} from 'lucide-react';

const iconMap = {
  Code2,
  Bot,
  Brain,
  ShieldCheck
};

const trackThemes = {
  programming: {
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50/80 dark:bg-blue-950/70',
    badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    border: 'hover:border-blue-400 dark:hover:border-blue-400'
  },
  robotics: {
    accent: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/70',
    badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    border: 'hover:border-emerald-400 dark:hover:border-emerald-400'
  },
  ai: {
    accent: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50/80 dark:bg-purple-950/70',
    badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    border: 'hover:border-purple-400 dark:hover:border-purple-400'
  },
  cybersecurity: {
    accent: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/80 dark:bg-amber-950/70',
    badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    border: 'hover:border-amber-400 dark:hover:border-amber-400'
  }
};

const stageStyles = {
  sky: {
    pill: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    border: 'border-sky-200/90 dark:border-sky-800/80 hover:border-sky-400',
    headerBg: 'from-sky-500/10 to-transparent'
  },
  indigo: {
    pill: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    border: 'border-indigo-200/90 dark:border-indigo-800/80 hover:border-indigo-400',
    headerBg: 'from-indigo-500/10 to-transparent'
  },
  amber: {
    pill: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    border: 'border-amber-300/90 dark:border-amber-800/80 hover:border-amber-400',
    headerBg: 'from-amber-500/15 to-transparent'
  }
};

export default function TracksSection({ onOpenRSVP, onOpenBatch2 }) {
  const [selectedAge, setSelectedAge] = useState('10-11');
  const [selectedPassion, setSelectedPassion] = useState('robotics');

  // توصيات ذكية حسب العمر والشغف المختار
  const recommendations = {
    '7-9': {
      stageTitle: 'المستكشف الرقمي (7 – 9 سنوات)',
      hours: '36 ساعة تدريبية عملية (مقسمة لورش تفاعلية ممتعة)',
      tracks: {
        programming: {
          courseName: 'صناعة الألعاب والقصص الخوارزمية (Scratch 3.0)',
          outcome: 'يبني الطفل لعبته التفاعلية الخاصة ويتعلم الحلقات التكرارية والشروط المنطقية دون تعقيد.',
          tools: ['Scratch 3.0', 'Blockly Logic', 'Sprite Design'],
          sampleProject: 'لعبة مغامرات الخوارزميات والرياضيات الذكية (جناح #8)'
        },
        robotics: {
          courseName: 'مختبر الروبوتات الميكانيكية والمتحكمات الصغرى',
          outcome: 'يركب الطفل مجسمات روبوتية متحركة ويبرمجها للاستجابة للضوء والصوت واللمس.',
          tools: ['Micro:bit', 'LEGO Education', 'LED & Buzzers'],
          sampleProject: 'روبوت تتبع المسار التفاعلي للمستكشفين الصغار'
        },
        ai: {
          courseName: 'الذكاء الاصطناعي المبسط للناشئة',
          outcome: 'يدرب الطفل الحاسوب على التعرف على الصور والأصوات وإيماءات الوجه بأسلوب بصري شائق.',
          tools: ['Teachable Machine', 'AI Extensions', 'Smart Camera'],
          sampleProject: 'مصنف الأشكال والألوان بالذكاء الاصطناعي'
        },
        cybersecurity: {
          courseName: 'درع الأمان الرقمي وأبطال الإنترنت الآمن',
          outcome: 'يتعلم الطفل حماية حساباته، إنشاء كلمات مرور حصينة، وكشف الخدع الإلكترونية.',
          tools: ['Password Tester', 'Safe Browsing', 'Crypto Puzzles'],
          sampleProject: 'حارس كلمة المرور والأمان الرقمي للأطفال (جناح #4)'
        }
      }
    },
    '10-11': {
      stageTitle: 'البنّاء المبتكر (10 – 11 سنة)',
      hours: '48 ساعة تدريبية هندسية وتطبيقية',
      tracks: {
        programming: {
          courseName: 'تطوير تطبيقات الويب التفاعلية والمنطق البرمجي',
          outcome: 'ينتقل الطفل لكتابة الشيفرات وبناء مواقع وتطبيقات تعليمية تخدم أقرانه في المدرسة.',
          tools: ['HTML5 & CSS3', 'JavaScript Basics', 'Interactive UI'],
          sampleProject: 'تطبيق منصة تعليمية تفاعلية للأقران (جناح #3)'
        },
        robotics: {
          courseName: 'هندسة الأردوينو (Arduino) والحساسات الذكية',
          outcome: 'يوصل الدوائر الإلكترونية ويبرمج مستشعرات المسافة والرطوبة والحركة لبناء أجهزة حقيقية.',
          tools: ['Arduino Uno', 'Ultrasonic & Soil Sensors', 'C++ Basics'],
          sampleProject: 'روبوت ذكي لإرشاد زوار الأماكن التراثية (جناح #1)'
        },
        ai: {
          courseName: 'تطبيقات الرؤية الحاسوبية والمساعدات الذكية',
          outcome: 'يربط نماذج الذكاء الاصطناعي بالكاميرا والميكروفون لابتكار حلول ذكية تخدم البيئة والمجتمع.',
          tools: ['AI Vision Blocks', 'Voice Recognition', 'Smart Automation'],
          sampleProject: 'منبه ذكي لتنبيه السائقين وكبار السن'
        },
        cybersecurity: {
          courseName: 'أساسيات التشفير وحماية الشبكات المدرسية',
          outcome: 'يفهم خوارزميات التشفير الكلاسيكية والحديثة وكيفية تأمين البيانات الشخصية.',
          tools: ['Cipher Algorithms', 'Phishing Detector', 'Network Safety'],
          sampleProject: 'منظومة التشفير المدرسي وحماية البيانات'
        }
      }
    },
    '12-14': {
      stageTitle: 'القائد التقني (12 – 14 سنة)',
      hours: '60 ساعة تدريبية احترافية وإعداد للمسابقات العربية',
      tracks: {
        programming: {
          courseName: 'البرمجة المتقدمة بلغة Python وتطوير المنصات',
          outcome: 'يتقن كتابة الكود بلغة بايثون وريأكت لبناء منصات سحابية وحلول برمجية متكاملة.',
          tools: ['Python 3', 'React.js', 'Git & Algorithms'],
          sampleProject: 'منصة إدارة المختبرات الذكية والتحديات البرمجية'
        },
        robotics: {
          courseName: 'الروبوتات المتقدمة وإنترنت الأشياء (ESP32 & IoT)',
          outcome: 'يصمم مركبات ذاتية القيادة وأنظمة تحكم لاسلكية مرتبطة بالسحابة والبث الحي.',
          tools: ['ESP32-CAM', 'WiFi & Cloud IoT', 'Autonomous Control'],
          sampleProject: 'سيارة الإنقاذ الذاتية القيادة بالبث المباشر (جناح #5)'
        },
        ai: {
          courseName: 'الرؤية الحاسوبية العميقة (OpenCV & YOLO)',
          outcome: 'يطور أنظمة ذكاء اصطناعي متقدمة لفرز المواد وترجمة لغة الإشارة الفورية للصم والبكم.',
          tools: ['Python', 'OpenCV & YOLO v8', 'MediaPipe AI'],
          sampleProject: 'مساعد الترجمة للغة الإشارة بالذكاء الاصطناعي (جناح #6)'
        },
        cybersecurity: {
          courseName: 'الأمن السيبراني التطبيقي والاختبار الأخلاقي',
          outcome: 'يتعلم تحليل الثغرات البرمجية، التشفير المتقدم، وحماية الأنظمة والتطبيقات.',
          tools: ['Python Security', 'Cryptography', 'Ethical Defense'],
          sampleProject: 'درع الحماية السيبرانية وفحص أمان التطبيقات'
        }
      }
    }
  };

  const activeRec = recommendations[selectedAge]?.tracks[selectedPassion] || recommendations['10-11'].tracks.robotics;
  const activeStageInfo = recommendations[selectedAge];

  return (
    <section id="tracks" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-300 tracking-wider bg-sky-50 dark:bg-sky-950/60 px-4 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 mb-3">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>المنهج الأكاديمي المعتمد للأعمار (7 إلى 14 سنة)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white font-alexandria leading-tight">
            منهجية علمية متدرجة تبني قادة الغد الرقمي
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            صُمم برنامج مبادرة «1001» طفل رقمي ليراعي التطور الذهني والعمري للطفل من عمر 7 سنوات وحتى 14 سنة، عبر 3 مراحل عمرية رصينة و4 مسارات تكنولوجية تطبيقية.
          </p>
        </div>

        {/* 1. Age Progression Bento Cards (7-9, 10-11, 12-14) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {EVENT_DETAILS.ageStages.map((stage, idx) => {
            const st = stageStyles[stage.accent] || stageStyles.sky;
            return (
              <div
                key={stage.id}
                className={`rounded-3xl p-6 sm:p-7 bg-slate-50/70 dark:bg-slate-950/70 border-2 ${st.border} transition-all duration-300 flex flex-col justify-between relative overflow-hidden group text-right shadow-xs hover:shadow-xl`}
              >
                <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${st.headerBg} pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full border ${st.pill}`}>
                      الفئة العمرية: {stage.ageBadge}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                      STAGE 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-alexandria mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-3">
                    {stage.engTitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {stage.summary}
                  </p>

                  <div className="space-y-2 mb-5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      المهارات المكتسبة في هذه المرحلة:
                    </span>
                    {stage.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools Footer */}
                <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-2">
                    الأدوات والتقنيات المعتمدة:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.tools.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. The 4 Core Technical Tracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {EVENT_DETAILS.tracks.map((track) => {
            const Icon = iconMap[track.icon] || Code2;
            const theme = trackThemes[track.id] || trackThemes.programming;

            return (
              <div
                key={track.id}
                className={`tech-card rounded-2xl p-6 flex flex-col justify-between text-right border border-slate-200 dark:border-slate-800 ${theme.border} group relative transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center ${theme.accent} group-hover:scale-108 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${theme.badge}`}>
                      {track.ageTarget || track.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-alexandria mb-2.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {track.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>تطبيق عملي ومشاريع حية</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Interactive Child Path Recommender Lab (مختبر تحديد مسار الطفل التفاعلي 7-14 سنة) */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white border border-sky-500/30 shadow-2xl relative overflow-hidden text-right">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-3">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>مستشار المسار الذكي لأولياء الأمور والأطفال</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-alexandria text-white leading-snug">
                  اكتشف المسار الأنسب لطفلك (7 – 14 سنة)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  اختر الفئة العمرية لطفلك والمجال الذي يثير فضوله، ليعرض لك النظام الخطة التدريبية المعتمدة والمشاريع المماثلة التي أنجزها أقرانه في نادي أبدع.
                </p>
              </div>

              {/* Step 1: Age Selection */}
              <div>
                <label className="block text-xs font-bold text-sky-300 mb-2.5">
                  1. اختر عمر الطفل:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: '7-9', label: '7 – 9 سنوات', sub: 'المستكشف الرقمي' },
                    { id: '10-11', label: '10 – 11 سنة', sub: 'البنّاء المبتكر' },
                    { id: '12-14', label: '12 – 14 سنة', sub: 'القائد التقني' }
                  ].map((ag) => (
                    <button
                      key={ag.id}
                      type="button"
                      onClick={() => setSelectedAge(ag.id)}
                      className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                        selectedAge === ag.id
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-300 text-white shadow-lg shadow-sky-500/25'
                          : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
                      }`}
                    >
                      <strong className="block text-xs sm:text-sm font-black font-alexandria">{ag.label}</strong>
                      <span className="text-[10px] opacity-85 block mt-0.5">{ag.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Passion Selection */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-2.5">
                  2. ما هو الشغف الأقرب لطفلك؟
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'robotics', label: 'الروبوتات والأجهزة', icon: Bot },
                    { id: 'ai', label: 'الذكاء الاصطناعي', icon: Brain },
                    { id: 'programming', label: 'الألعاب والتطبيقات', icon: Code2 },
                    { id: 'cybersecurity', label: 'الأمان السيبراني', icon: ShieldCheck }
                  ].map((item) => {
                    const PIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedPassion(item.id)}
                        className={`p-3 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                          selectedPassion === item.id
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-lg shadow-amber-500/20'
                            : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200 font-semibold'
                        }`}
                      >
                        <PIcon className="w-5 h-5" />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommendation Output Column */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/15">
                  <div>
                    <span className="text-[11px] font-bold text-sky-300 block">التوصية الأكاديمية المخصصة:</span>
                    <h4 className="text-lg sm:text-xl font-black font-alexandria text-white mt-0.5">
                      {activeRec.courseName}
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold">
                    {activeStageInfo.stageTitle}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeRec.outcome}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      <span>التقنيات التي سيتقنها الطفل:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeRec.tools.map((t, i) => (
                        <span key={i} className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-200 border border-sky-400/30">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      <span>نموذج مشروع مماثل بالمعرض:</span>
                    </span>
                    <strong className="text-xs text-amber-300 block leading-snug">
                      {activeRec.sampleProject}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-300">
                    ⏱️ الحجم التدريبي: <strong>{activeStageInfo.hours}</strong>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {onOpenBatch2 && (
                      <button
                        type="button"
                        onClick={() => onOpenBatch2(selectedAge === '7-9' ? 8 : selectedAge === '10-11' ? 11 : 13)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer"
                      >
                        سجّل طفلك بالدفعة الثانية بهذا المسار ←
                      </button>
                    )}
                    {onOpenRSVP && (
                      <button
                        type="button"
                        onClick={onOpenRSVP}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition cursor-pointer"
                      >
                        احجز مقعد حضور بالحفل
                      </button>
                    )}
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
