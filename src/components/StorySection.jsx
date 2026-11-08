import React from 'react';
import { Trophy, Star, Sparkles, Heart, Quote, ArrowLeft, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StorySection({ onOpenRSVP }) {
  const celebrateTrophy = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="story"
      className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/70 dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-10 lg:p-14 border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.06)] relative overflow-hidden transition-colors">
          {/* Soft ambient corner glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Story Content */}
            <div className="lg:col-span-7 space-y-5 text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-xs">
                <Trophy className="w-4 h-4 text-amber-500 animate-wiggle shrink-0" />
                <span>قصة نجاح وإلهام عراقية رائدة 🏆</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria leading-snug">
                من شغف طفلين موهوبين.. <br />
                <span className="bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  إلى حراك رقمي يحتضن 1001 طفل
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                تأسس <strong className="text-slate-900 dark:text-white">نادي أبدع للمهارات الذكية</strong> في النجف الأشرف في{' '}
                <strong>10 تشرين الأول 2025</strong> انطلاقاً من تجربة الأخوين المبدعين{' '}
                <span className="text-sky-700 dark:text-sky-300 font-black">مريم ومحمد فراس نزار</span>، اللذين رفعا اسم العراق عالياً بالفوز{' '}
                <strong className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-200/70 dark:border-amber-800">
                  بالمركز الأول في مسابقة الابتكار المتقدم بالبطولة العربية للروبوت والذكاء الاصطناعي لثلاث سنوات متتالية (2024–2026)
                </strong>
                .
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                تحول هذا الشغف الطفولي الملهم إلى مبادرة مجتمعية وتعليمية مجانية بالكامل، استهدفت الأطفال والناشئة من عمر{' '}
                <strong className="text-sky-700 dark:text-sky-300">7 إلى 14 سنة</strong>، مع إيلاء عناية خاصة بالأيتام وأبناء العائلات المتعففة وتشجيع الفتيات على خوض غمار البرمجة والابتكار.
              </p>

              {/* Founder Quote Card */}
              <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-slate-800/80 border-r-4 border-sky-500 border border-sky-100 dark:border-slate-700/80 relative">
                <Quote className="w-8 h-8 text-sky-200 dark:text-sky-900/50 absolute top-3 left-3 pointer-events-none" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold font-tajawal leading-relaxed">
                  "حينما يتعلم الطفل من طفل مثله، تتحول البرمجة والروبوتات من مادة صعبة إلى مغامرة شيقة يصنع فيها الأطفال مستقبلهم بأيديهم."
                </p>
                <div className="mt-2.5 text-xs font-extrabold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span>رسالة نادي أبدع للمهارات الذكية – النجف الأشرف</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={onOpenRSVP}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-500/20 btn-playful flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>احجز مقعدك بحفل التخرج مجاناً</span>
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Visual Trophy & Features Card */}
            <div className="lg:col-span-5">
              <div
                onClick={celebrateTrophy}
                className="rounded-[28px] p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950 text-white shadow-2xl overflow-hidden text-right border-2 border-amber-400/50 cursor-pointer group relative"
                title="اضغط للاحتفال بأبطال العرب!"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 shadow-xl shadow-amber-500/25 mb-4 animate-float-slow">
                    <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/30 mb-2">
                    <span>🌟 إنجاز عربي متواصل</span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white font-alexandria">
                    المركز الأول عربياً لـ 3 سنوات متتالية
                  </h3>
                  <p className="text-xs text-sky-200 mt-1">
                    البطولة العربية للروبوت والذكاء الاصطناعي (2024 - 2026)
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-white block">مبادرة مجانية بالكامل (7–14 سنة)</strong>
                      <span className="text-[11px] text-slate-300">
                        تكافؤ الفرص وحق اكتساب مهارات المستقبل لجميع أطفالنا
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300 shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-white block">رعاية خاصة للأيتام والمتعففين</strong>
                      <span className="text-[11px] text-slate-300">
                        بالتعاون مع مدارس دار الزهراء الخيرية وقسم رعاية الطفولة
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-white block">40 ابتكاراً طلابياً حياً</strong>
                      <span className="text-[11px] text-slate-300">
                        يشرحها الأطفال بأنفسهم أمام العائلات واللجان العلمية
                      </span>
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
