import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  MessageSquareHeart,
  Send,
  UserCheck,
  Award,
  SmilePlus
} from 'lucide-react';
import { EventDB } from '../lib/supabase';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';

const BADGE_OPTIONS = [
  '🎓 فخر العائلة',
  '🤖 مبتكر المستقبل',
  '🚀 جيل الخوارزمي',
  '⭐ نجم البرمجة',
  '❤️ دعواتنا لكم بالتوفيق'
];

const RELATIONS = [
  'ولي أمر / عائلة خريج',
  'أستاذ أو معلم مدرسة',
  'ضيف احتفالية قصر الثقافة',
  'صديق أو قريب العائلة'
];

export default function WallOfPrideSection() {
  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState(RELATIONS[0]);
  const [childName, setChildName] = useState('');
  const [badge, setBadge] = useState(BADGE_OPTIONS[0]);
  const [messageText, setMessageText] = useState('');
  const [submittedBanner, setSubmittedBanner] = useState(false);

  useEffect(() => {
    EventDB.getPrideMessages().then((data) => {
      setMessages(data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;

    const res = await EventDB.submitPrideMessage({
      senderName,
      relation,
      childName: childName.trim() || 'جميع أبطال مبادرة 1001 طفل رقمي',
      badge,
      message: messageText
    });

    if (res.success) {
      setMessages(res.list);
      setSenderName('');
      setChildName('');
      setMessageText('');
      setSubmittedBanner(true);
      playSuccessChime();
      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.75 }
        });
      } catch {
        // ignore
      }
      setTimeout(() => setSubmittedBanner(false), 4500);
    }
  };

  const handleLike = async (id) => {
    playClickPop();
    const updated = await EventDB.likePrideMessage(id);
    setMessages(updated);
  };

  return (
    <section id="pride-wall" className="py-20 bg-gradient-to-b from-sky-50/60 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden border-t border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold mb-4 shadow-xs">
            <MessageSquareHeart className="w-4 h-4 text-rose-500" />
            <span>جدار الفخر والتهاني التفاعلي • رسائل العوائل والضيوف</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-alexandria font-black text-slate-900 dark:text-white tracking-tight">
            كلمات فخر من <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-500 to-sky-600">قلوب الآباء والأمهات</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            اكتب كلمة تهنئة أو رسالة تشجيعية لطفلك أو لأبطال الدفعة الأولى (170 خريجاً وخريجة) لتبقى ذكرى خالدة في سجل احتفالية قصر الثقافة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Add Pride Message Form */}
          <div className="lg:col-span-5 frosted-glass rounded-3xl p-6 sm:p-7">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
                <SmilePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-alexandria font-extrabold text-lg text-slate-900 dark:text-white">
                  أضف بطاقة تهنئة وفخر
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تظهر رسالتك مباشرة على جدار الاحتفالية الرقمي
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  اسم المهنئ (ولي الأمر / العائلة / الضيف) *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="مثال: والدة البطل رضا / عائلة الحسني..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                    الصفة / القرابة
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {RELATIONS.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                    مهداة إلى الطفل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="اسم الطفل الخريج..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  اختر وسام التهنئة الطفولي
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BADGE_OPTIONS.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => {
                        playClickPop();
                        setBadge(b);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        badge === b
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  رسالة الفخر والتهنئة *
                </label>
                <textarea
                  rows={3}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="اكتب كلمتك التشجيعية لأبطالنا الصغار..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              {submittedBanner && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>تم نشر بطاقة التهنئة على جدار الفخر بنجاح! شكراً لمشاركتكم فرحة أطفالنا.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 hover:from-rose-600 hover:to-sky-600 text-white font-alexandria font-extrabold text-sm shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>انشر بطاقة الفخر والتهنئة الآن 🎉</span>
              </button>
            </form>
          </div>

          {/* Right Column: Cards Feed */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-3xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {item.badge}
                    </span>
                    <button
                      onClick={() => handleLike(item.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-extrabold border border-rose-200/70 dark:border-rose-800 transition-transform active:scale-125 cursor-pointer"
                      title="أعجبني"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{item.likes || 1}</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-4">
                    «{item.message}»
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-alexandria font-extrabold text-xs text-slate-900 dark:text-white">
                      {item.senderName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.relation} • إهداء إلى: <strong className="text-sky-600 dark:text-sky-400">{item.childName}</strong>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
