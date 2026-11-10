import React, { useState } from 'react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Award, Flame, Bot, Code2, Users } from 'lucide-react';

const MARQUEE_PHOTOS = [
  {
    id: 1,
    title: 'تجميع وبرمجة أذرع الروبوت الهيدروليكية',
    tag: 'مختبر الروبوت',
    icon: Bot,
    image: '/gallery/training_1.jpg',
    desc: 'الطلاب أثناء تركيب المكونات الميكانيكية وتوصيل الدوائر الإلكترونية مع وحدة التحكم.',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 2,
    title: 'جلسات كتابة الشيفرات والذكاء الاصطناعي',
    tag: 'خوارزميات AI',
    icon: Code2,
    image: '/gallery/training_2.jpg',
    desc: 'تدريب الطلاب على لغة بايثون ومحاكاة الرؤية الحاسوبية لاكتشاف الأجسام وفرزها.',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 3,
    title: 'معايرة حساسات المسار وتجاوز العوائق',
    tag: 'الحلبة التجريبية',
    icon: Bot,
    image: '/gallery/training_3.jpg',
    desc: 'معايرة مستشعرات الأشعة تحت الحمراء والألتراسونيك على مضمار السباق الذكي.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    title: 'العصف الذهني وفرق العمل للـ 40 مشروعاً',
    tag: 'روح الفريق',
    icon: Users,
    image: '/gallery/training_4.jpg',
    desc: 'مناقشات تفاعلية وتقسيم المهام بين أعضاء الفرق لإنجاز نماذج التخرج النهائية.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 5,
    title: 'استعراض النماذج الأولية أمام لجان التحكيم',
    tag: 'جاهزية العرض',
    icon: Award,
    image: '/gallery/training_5.jpg',
    desc: 'عرض تجريبي للابتكارات للتأكد من فاعليتها قبل انطلاق المعرض في قصر الثقافة.',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 6,
    title: 'تطوير البرمجيات والألعاب التعليمية التفاعلية',
    tag: 'برمجة الألعاب',
    icon: Code2,
    image: '/gallery/training_6.jpg',
    desc: 'بناء ألعاب تفاعلية تعزز التفكير المنطقي والهندسي وحل المشكلات للأطفال.',
    color: 'from-cyan-500 to-sky-600'
  },
  {
    id: 7,
    title: 'بروفة المسرح والتكريم في قصر الثقافة',
    tag: 'مسرح قصر الثقافة',
    icon: Flame,
    image: '/gallery/stage_prep.jpg',
    desc: 'الاستعدادات النهائية لفقرات تتويج الخريجين وتوزيع الدروع والشهادات الرسمية.',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 8,
    title: 'الرؤية الوطنية لمبادرة 1001 طفل رقمي',
    tag: 'الإنجاز الأكبر',
    icon: Award,
    image: '/gallery/rollup_innovation.jpg',
    desc: 'توثيق المحاور الأربعة وتكريم نخبة المبدعين في النجف الأشرف.',
    color: 'from-violet-600 to-purple-700'
  }
];

export default function PhotoMarquee() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Duplicate for seamless infinite loop
  const duplicatedPhotos = [...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS];

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/5 dark:bg-sky-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <Camera className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>لقطات حية ومباشرة من مختبرات أبدع</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-alexandria">
              شريط اللحظات الملهمة وصناعة الأبطال
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            حرك الفأرة لإيقاف الشريط • اضغط على أي صورة لتكبيرها
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Ribbon */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-4 sm:gap-6">
          {duplicatedPhotos.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setSelectedPhoto(item)}
                className="group relative flex-shrink-0 w-64 sm:w-72 md:w-80 h-64 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5"
              >
                {/* Photo image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.92] group-hover:brightness-100"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white text-[11px] font-bold shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{item.tag}</span>
                </div>

                {/* View Icon Hover */}
                <div className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-right">
                  <h3 className="text-sm sm:text-base font-bold text-white font-alexandria leading-snug group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed opacity-90">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Glowing Accent Bar */}
                <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${item.color} opacity-80 group-hover:h-1.5 transition-all`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {selectedPhoto.tag}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">توثيق نادي أبدع</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Stage */}
            <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption */}
            <div className="p-6">
              <h3 className="font-alexandria font-bold text-lg text-slate-900 dark:text-white mb-1.5">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedPhoto.desc}
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}