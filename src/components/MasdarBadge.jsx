import React, { useState, useEffect } from 'react';

export default function MasdarBadge({
  variant = 'default',
  labelText = 'الشريك التقني',
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <style>{`
        @keyframes masdarBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes masdarCardIn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes masdarLogoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes masdarPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      {variant === 'inline' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2.5 font-bold text-amber-500 dark:text-amber-400 hover:opacity-90 transition cursor-pointer"
        >
          <span>{labelText}:</span>
          <img
            src="/brand/masdar-logo-full-white.png"
            alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
            className="hidden dark:inline-block h-5 w-auto object-contain"
          />
          <img
            src="/brand/masdar-logo-full-clean.png"
            alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
            className="inline-block dark:hidden h-5 w-auto object-contain"
          />
          <span className="text-[10px] text-sky-500">▾</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          title="اضغط لعرض بطاقة الشريك التقني الرسمي"
          className={`inline-flex items-center justify-center gap-3 px-4 py-2 h-[50px] rounded-2xl transition-all duration-200 cursor-pointer border ${
            variant === 'footer'
              ? 'bg-white/5 hover:bg-white/10 border-white/15 hover:border-sky-400/60 text-white shadow-lg'
              : 'bg-white dark:bg-slate-900 hover:bg-sky-50/70 dark:hover:bg-slate-800/90 border-sky-200/90 dark:border-slate-700 hover:border-sky-500 text-slate-900 dark:text-white shadow-sm hover:shadow-md'
          } hover:-translate-y-0.5`}
        >
          <span
            className={`text-xs sm:text-[13px] font-extrabold inline-flex items-center gap-1.5 ${
              variant === 'footer'
                ? 'text-amber-300'
                : 'text-slate-800 dark:text-amber-300'
            }`}
          >
            <span>{labelText}</span>
            <span className="text-[10px] text-sky-500">▾</span>
          </span>

          {variant === 'footer' ? (
            <img
              src="/brand/masdar-logo-full-white.png"
              alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          ) : (
            <>
              <img
                src="/brand/masdar-logo-full-white.png"
                alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                className="hidden dark:inline-block h-6 sm:h-7 w-auto object-contain"
              />
              <img
                src="/brand/masdar-logo-full-clean.png"
                alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                className="inline-block dark:hidden h-6 sm:h-7 w-auto object-contain"
              />
            </>
          )}
        </button>
      )}

      {/* نافذة بطاقة شركة المصدر الاحترافية */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          dir="rtl"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          style={{ animation: 'masdarBackdropIn 0.22s ease-out forwards' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] rounded-[28px] p-6 sm:p-7 text-center overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-sky-200 dark:border-sky-500/30 shadow-[0_28px_75px_rgba(0,0,0,0.55)]"
            style={{ animation: 'masdarCardIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* إضاءة علوية هادئة */}
            <div
              className="absolute -top-9 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(35, 159, 219, 0.22) 0%, rgba(16, 185, 129, 0.08) 45%, transparent 72%)',
              }}
            />

            {/* زر الإغلاق العلوي */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:rotate-90 transition-all cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {/* رأس البطاقة والشعار */}
            <div className="pt-1 pb-5 border-b border-slate-200/80 dark:border-slate-800">
              <div
                className="relative inline-block mb-3.5"
                style={{ animation: 'masdarLogoFloat 3.6s ease-in-out infinite' }}
              >
                <div className="min-w-[170px] h-[74px] rounded-2xl bg-white dark:bg-white/5 border border-sky-200 dark:border-sky-500/35 px-5 py-3 shadow-lg inline-flex items-center justify-center mx-auto">
                  <img
                    src="/brand/masdar-logo-full-white.png"
                    alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                    className="hidden dark:inline-block h-10 w-auto object-contain"
                  />
                  <img
                    src="/brand/masdar-logo-full-clean.png"
                    alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                    className="inline-block dark:hidden h-10 w-auto object-contain"
                  />
                </div>

                {/* شارة التوثيق */}
                <span
                  title="شريك تقني معتمد"
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900"
                  style={{ animation: 'masdarPulseRing 2.4s infinite' }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
              </div>

              <div className="mb-2.5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 text-[11.5px] text-sky-700 dark:text-sky-300 font-extrabold">
                  الشريك التقني والراعي الرسمي للمنصة
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white font-alexandria leading-snug">
                شركة المصدر
                <span className="block text-sm font-extrabold text-slate-600 dark:text-slate-300 mt-1">
                  لتكنولوجيا المعلومات وتطوير البرمجيات
                </span>
              </h3>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[310px] mx-auto">
                حلول التحول الرقمي وتطوير الأنظمة البرمجية المتقدمة ورعاية مواهب الأطفال والمبتكرين في العراق.
              </p>
            </div>

            {/* روابط التواصل الـ 3 */}
            <div className="grid gap-2.5 pt-4">
              {/* 1. الموقع الرسمي */}
              <a
                href="https://www.masdar.company/en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-sky-400 flex items-center justify-between gap-3 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      الموقع الإلكتروني الرسمي
                    </span>
                    <strong dir="ltr" className="block text-sm font-extrabold text-slate-900 dark:text-white">
                      masdar.company
                    </strong>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-sky-500 transition">↗</span>
              </a>

              {/* 2. إنستغرام المصدر */}
              <a
                href="https://www.instagram.com/masdar.iq/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-pink-50/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-pink-400 flex items-center justify-between gap-3 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      إنستغرام المصدر
                    </span>
                    <strong dir="ltr" className="block text-sm font-extrabold text-slate-900 dark:text-white">
                      @masdar.iq
                    </strong>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-pink-500 transition">↗</span>
              </a>

              {/* 3. المدير التنفيذي */}
              <a
                href="https://www.instagram.com/prog.karrar/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-amber-400 flex items-center justify-between gap-3 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full p-0.5 shrink-0"
                    style={{
                      background:
                        'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    }}
                  >
                    <img
                      src="/karrar-ceo.png"
                      alt="كرار حساني - المدير التنفيذي"
                      className="w-full h-full object-cover rounded-full bg-white block"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      المدير التنفيذي
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm font-extrabold text-slate-900 dark:text-white">
                        كرار حساني
                      </strong>
                      <span dir="ltr" className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        @prog.karrar
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-amber-500 transition">↗</span>
              </a>
            </div>

            {/* زر إغلاق النافذة */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
