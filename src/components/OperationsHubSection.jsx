import React from 'react';
import {
  Camera,
  ShieldCheck,
  Tv,
  Award,
  Gift,
  HeartHandshake,
  CreditCard,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function OperationsHubSection({
  onOpenChecker,
  onOpenAdmin,
  onOpenStagePresentation,
  onOpenJudgingPortal,
  onOpenRaffle,
  onOpenVolunteerSponsor,
  onNavigateView
}) {
  const portals = [
    {
      id: 'scanner',
      badge: 'لجنة الاستقبال والبوابة',
      title: 'ماسح الكاميرا المباشر للتذاكر والهويات',
      desc: 'فتح كاميرا الهاتف الخلفية لمسح رموز QR لتذاكر الضيوف وهويات الأعضاء وتأكيد الدخول الفوري مع التنبيه الصوتي.',
      actionLabel: 'فتح كاميرا الفحص المباشر',
      icon: Camera,
      accent: 'from-emerald-600 to-teal-700',
      border: 'border-emerald-300/70 dark:border-emerald-800/80',
      onClick: onOpenChecker
    },
    {
      id: 'admin',
      badge: 'الإدارة العليا والهويات 🪪',
      title: 'لوحة التحكم الشاملة وخدمة هويات الانتماء',
      desc: 'إصدار وطباعة هويات العضوية الرسمية (فردية وجماعية للكروبات والمدربين)، إدارة المحتوى، التذاكر، والنسخ الاحتياطي.',
      actionLabel: 'دخول لوحة الإدارة المركزية',
      icon: ShieldCheck,
      accent: 'from-sky-600 to-indigo-700',
      border: 'border-sky-300/70 dark:border-sky-800/80',
      onClick: onOpenAdmin
    },
    {
      id: 'stage',
      badge: 'قاعة قصر الثقافة • شاشة LED',
      title: 'نظام العرض العملاق لتكريم الـ 168 خريجاً',
      desc: 'واجهة عرض مسرحية بدقة عالية لاستعراض المجموعات العشر وأسماء الخريجين أثناء التتويج مع مؤثرات الاحتفال.',
      actionLabel: 'تشغيل شاشة المسرح العملاقة',
      icon: Tv,
      accent: 'from-amber-500 to-orange-600',
      border: 'border-amber-300/70 dark:border-amber-800/80',
      onClick: () => onOpenStagePresentation(0)
    },
    {
      id: 'judging',
      badge: 'اللجنة العلمية • 100 درجة',
      title: 'بوابة التحكيم العلمي ولوحة الصدارة (40 مشروعاً)',
      desc: 'تقييم مشاريع المعرض وفق 5 معايير علمية محوكمة واحتساب الترتيب التلقائي للمراكز الأولى حسب الفئات العمرية.',
      actionLabel: 'فتح بوابة لجنة التحكيم',
      icon: Award,
      accent: 'from-indigo-600 to-purple-700',
      border: 'border-indigo-300/70 dark:border-indigo-800/80',
      onClick: () => onOpenJudgingPortal(null)
    },
    {
      id: 'raffle',
      badge: 'فقرة المسرح التفاعلية',
      title: 'منصة السحب العشوائي والقرعة الحية',
      desc: 'إجراء السحب المباشر أمام الجمهور لجوائز المشاريع الأربعين وتذاكر عائلات الخريجين الحاضرين في القاعة.',
      actionLabel: 'تشغيل منصة السحب والجوائز',
      icon: Gift,
      accent: 'from-rose-500 to-amber-600',
      border: 'border-rose-300/70 dark:border-rose-800/80',
      onClick: onOpenRaffle
    },
    {
      id: 'community-forms',
      badge: 'الشراكات والعمل التطوعي',
      title: 'بوابة طلبات الرعاية والتطوع التنظيمي',
      desc: 'استقبال طلبات انضمام المتطوعين للجان التنظيمية وطلبات المؤسسات والشركات الراغبة برعاية الدفعات القادمة.',
      actionLabel: 'فتح استمارة الرعاية والتطوع',
      icon: HeartHandshake,
      accent: 'from-teal-600 to-cyan-700',
      border: 'border-teal-300/70 dark:border-teal-800/80',
      onClick: onOpenVolunteerSponsor
    }
  ];

  return (
    <section id="ops" className="py-14 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 dark:bg-sky-950 text-amber-300 text-xs font-extrabold mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              <span>مركز العمليات الميدانية واللجان التنظيمية • يوم الحفل</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-alexandria text-slate-900 dark:text-white">
              بوابة المنظمين وإدارة الاحتفالية
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl">
              تم تجميع كافة أنظمة التشغيل الميداني (فحص الكاميرا، إصدار الهويات، شاشة المسرح، التحكيم، والقرعة) في هذه البوابة المستقلة لتسهيل عمل اللجان دون إرباك الزوار.
            </p>
          </div>

          {onNavigateView && (
            <button
              type="button"
              onClick={() => onNavigateView('home')}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500 text-xs font-black flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Home className="w-4 h-4 text-sky-600" />
              <span>العودة لواجهة الاحتفالية العامة</span>
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border ${item.border} p-6 shadow-[0_12px_35px_-12px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between text-right`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-alexandria text-slate-900 dark:text-white leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={item.onClick}
                  className={`w-full py-3 px-4 rounded-2xl bg-gradient-to-l ${item.accent} hover:opacity-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md transition cursor-pointer`}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
