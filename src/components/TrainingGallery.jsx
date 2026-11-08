import React, { useState } from 'react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Sparkles, Cpu, Award, Users, BookOpen } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'تجميع وبرمجة أذرع الروبوت الهيدروليكية',
    category: 'robotics',
    categoryLabel: 'مختبرات الروبوت',
    image: '/gallery/training_1.jpg',
    description: 'الطلاب أثناء تركيب المكونات الميكانيكية وتوصيل الدوائر الإلكترونية مع وحدة التحكم المصغرة.',
    stats: 'ورشة عملية مكثفة'
  },
  {
    id: 2,
    title: 'جلسات كتابة الشيفرات البرمجية ومحاكاة الذكاء الاصطناعي',
    category: 'coding',
    categoryLabel: 'البرمجة والخوارزميات',
    image: '/gallery/training_2.jpg',
    description: 'تدريب الطلاب على خوارزميات بايثون ومنصة سكراتش وتطبيقها في حل المشكلات الحقيقية.',
    stats: 'تطبيق خوارزميات الرؤية'
  },
  {
    id: 3,
    title: 'اختبار حساسات المسار وتجنب العقبات',
    category: 'robotics',
    categoryLabel: 'مختبرات الروبوت',
    image: '/gallery/training_3.jpg',
    description: 'معايرة مستشعرات الأشعة تحت الحمراء والألتراسونيك على الحلبة التجريبية لنادي أبدع.',
    stats: 'دقة عالية في المعايرة'
  },
  {
    id: 4,
    title: 'ورش العمل التفاعلية والعمل الجماعي للفرق',
    category: 'teamwork',
    categoryLabel: 'فرق العمل والابتكار',
    image: '/gallery/training_4.jpg',
    description: 'مناقشات العصف الذهني وتقسيم المهام بين أعضاء الفرق الأربعين لإنجاز نماذج التخرج.',
    stats: '40 فريقاً مبتكراً'
  },
  {
    id: 5,
    title: 'استعراض النماذج الأولية أمام لجان التحكيم',
    category: 'stage',
    categoryLabel: 'التقييم والجاهزية',
    image: '/gallery/training_5.jpg',
    description: 'عرض تجريبي للابتكارات الطلابية للتأكد من جاهزيتها للعرض في قصر الثقافة أمام الجمهور.',
    stats: 'تقييم شامل وملاحظات'
  },
  {
    id: 6,
    title: 'البوستر والمنهاج الشامل لمبادرة 1001 طفل رقمي',
    category: 'stage',
    categoryLabel: 'التقييم والجاهزية',
    image: '/gallery/rollup_innovation.jpg',
    description: 'الرؤية الوطنية لإعداد أجيال متقنة للذكاء الاصطناعي وهندسة البرمجيات بالنجف الأشرف.',
    stats: 'رؤية مستقبلية'
  },
  {
    id: 7,
    title: 'بروفة المسرح والتكريم الرسمي في قصر الثقافة',
    category: 'stage',
    categoryLabel: 'التقييم والجاهزية',
    image: '/gallery/stage_prep.jpg',
    description: 'الاستعدادات النهائية لفقرات صعود الخريجين ومنح الدروع وشهادات التقدير بحضور الشخصيات الرسمية.',
    stats: 'مسرح قصر الثقافة'
  },
  {
    id: 8,
    title: 'تطوير ألعاب تفاعلية بمحرك Scratch التعليمي',
    category: 'coding',
    categoryLabel: 'البرمجة والخوارزميات',
    image: '/gallery/training_6.jpg',
    description: 'بناء ألعاب هادفة ترسخ مفاهيم التفكير المنطقي والرياضيات والأمن الرقمي للأطفال.',
    stats: 'إبداع برمجي'
  }
];

export default function TrainingGallery() {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredItems = activeTab === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-sky-950/70 border border-brand-200 dark:border-sky-800 text-brand-700 dark:text-sky-300 font-bold text-xs shadow-sm mb-4">
            <Camera className="w-4 h-4 text-brand-600 dark:text-sky-400" />
            <span>كواليس التدريب وصناعة الأبطال</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-alexandria tracking-tight">
            معرض الصور والابتكار الحي
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-tajawal leading-relaxed">
            لقطات توثيقية ترصد شغف أطفالنا ومسيرتهم في مختبرات الروبوت، كتابة الأكواد، وتطوير 40 نموذجاً ذكياً وصولاً إلى خشبة المسرح.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
            }`}
          >
            <span>جميع المشاهد</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'all' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
              {GALLERY_ITEMS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('robotics')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'robotics'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
            }`}
          >
            <Cpu className="w-4 h-4 text-sky-500" />
            <span>مختبرات الروبوت والذكاء الاصطناعي</span>
          </button>

          <button
            onClick={() => setActiveTab('coding')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'coding'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>البرمجة والخوارزميات</span>
          </button>

          <button
            onClick={() => setActiveTab('stage')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'stage'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>الاستعداد والجاهزية</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group bg-slate-50 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-sky-600 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                
                {/* Category Pill */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-sm">
                    {item.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-alexandria font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-sky-600 dark:text-sky-400">
                  <span>{item.stats}</span>
                  <span className="text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-0.5">
                    تكبير الصورة
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={closeLightbox}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Top Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  {filteredItems[lightboxIndex].categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {lightboxIndex + 1} من {filteredItems.length}
                </span>
              </div>
              <button
                onClick={closeLightbox}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Image Stage */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px]">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />

              {/* Prev / Next controls */}
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition"
                title="الصورة التالية"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition"
                title="الصورة السابقة"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Caption */}
            <div className="p-6 bg-white dark:bg-slate-900">
              <h3 className="font-alexandria font-extrabold text-lg text-slate-900 dark:text-white">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 font-tajawal leading-relaxed">
                {filteredItems[lightboxIndex].description}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
