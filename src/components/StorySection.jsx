import React from 'react';
import { Trophy, Star, Sparkles, Heart, Quote, ArrowLeft, Rocket } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

export default function StorySection({ onOpenRSVP }) {
  return (
    <section id="story" className="py-14 sm:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-14 border border-slate-200 dark:border-slate-800 shadow-md relative transition-colors">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Story Content */}
            <div className="lg:col-span-7 space-y-5 text-right">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>قصة نجاح وإلهام عراقية رائدة</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria leading-snug">
                من شغف طفلين موهوبين.. <br />
                <span className="text-sky-600 dark:text-sky-400">
                  إلى حراك رقمي يحتضن 1001 طفل
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                تأسس <strong className="text-slate-900 dark:text-white">نادي أبدع للمهارات الذكية</strong> في النجف الأشرف في <strong>10 تشرين الأول 2025</strong> انطلاقاً من تجربة الأخوين 
                <span className="text-sky-700 dark:text-sky-300 font-bold"> مريم ومحمد فراس نزار </span>، اللذين حققا إنجازاً تاريخياً برفع اسم العراق بالفوز 
                <strong className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800"> بالمركز الأول في مسابقة الابتكار المتقدم بالبطولة العربية للروبوت والذكاء الاصطناعي لثلاث سنوات متتالية (2024–2026)</strong>.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                تحول هذا الشغف الشخصي إلى مبادرة مجتمعية وتعليمية مجانية بالكامل، استهدفت الأطفال من عمر 6 إلى 15 عاماً، مع إيلاء عناية خاصة بالأيتام وأبناء العائلات المتعففة وتشجيع الفتيات على خوض غمار البرمجة والابتكار.
              </p>

              {/* Founder Quote Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-r-4 border-sky-600 dark:border-sky-400 border border-slate-200/80 dark:border-slate-700/80 relative">
                <Quote className="w-8 h-8 text-sky-200 dark:text-sky-900/50 absolute top-3 left-3 pointer-events-none" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium font-tajawal leading-relaxed">
                  "الاستثمار في عقول الأطفال واحتضان طموحاتهم هو الطريق الحقيقي نحو بناء جيل واعٍ، مبدع، ومنتج للتكنولوجيا.. لا مجرد مستهلك لها."
                </p>
                <div className="mt-2 text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span>رسالة نادي أبدع للمهارات الذكية – النجف الأشرف</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenRSVP}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>احجز مقعدك بحفل التخرج مجاناً</span>
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>

            {/* Visual Trophy & Features Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-xl overflow-hidden text-right border border-slate-800">
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-lg shadow-amber-500/20 mb-3 sm:mb-4">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                    إنجاز عربي متواصل
                  </span>
                  <h3 className="text-base sm:text-xl font-bold text-white font-alexandria">
                    المركز الأول لـ 3 سنوات متتالية
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1">البطولة العربية للروبوت والذكاء الاصطناعي (2024 - 2026)</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-white block">مبادرة مجانية بالكامل</strong>
                      <span className="text-[10px] sm:text-xs text-slate-300">تكافؤ الفرص وحق اكتساب مهارات المستقبل لجميع أطفالنا</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300 shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-white block">اهتمام بالأيتام والمتعففين</strong>
                      <span className="text-[10px] sm:text-xs text-slate-300">بالتعاون مع مدارس دار الزهراء ورعاية الطفولة</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-white block">40 ابتكاراً طلابياً حياً</strong>
                      <span className="text-[10px] sm:text-xs text-slate-300">تعرض مباشرة أمام الجمهور والشركات والمؤسسات</span>
                    </div>
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