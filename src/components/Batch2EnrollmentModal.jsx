import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  GraduationCap,
  Cpu,
  Bot,
  Brain,
  ShieldCheck,
  Printer,
  Share2,
  CheckCircle2,
  School,
  Phone,
  User,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventDB } from '../lib/supabase';
import { openCandidateCardPrintWindow } from '../utils/printEngine';
import { generateOfficialQrDataUrl } from '../utils/qrVerify';

const TRACK_OPTIONS = [
  { id: 'البرمجة والتطبيقات', label: 'البرمجة والتطبيقات (Programming)', icon: Cpu, desc: 'تطوير الألعاب والقصص التفاعلية وتطبيقات الويب' },
  { id: 'تصميم وبرمجة الروبوتات', label: 'تصميم وبرمجة الروبوتات (Robotics)', icon: Bot, desc: 'تركيب الروبوتات وبرمجة الحساسات والمتحكمات الدقيقة' },
  { id: 'الذكاء الاصطناعي', label: 'الذكاء الاصطناعي (AI & Vision)', icon: Brain, desc: 'تعلم الآلة والرؤية الحاسوبية والمشاريع الذكية' },
  { id: 'الأمن السيبراني', label: 'الأمن السيبراني (Cybersecurity)', icon: ShieldCheck, desc: 'التشفير وحماية الهوية الرقمية والاستخدام الآمن' }
];

export default function Batch2EnrollmentModal({ isOpen, onClose, initialAge = 10, initialTrack = '' }) {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(initialAge || 10);
  const [schoolName, setSchoolName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [preferredTrack, setPreferredTrack] = useState(initialTrack || 'تصميم وبرمجة الروبوتات');
  const [experienceLevel, setExperienceLevel] = useState('مبتدئ (شغوف بالتعلم)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredCandidate, setRegisteredCandidate] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (initialAge >= 7 && initialAge <= 14) {
      setChildAge(initialAge);
    }
    if (initialTrack) {
      setPreferredTrack(initialTrack);
    }
  }, [initialAge, initialTrack]);

  if (!isOpen) return null;

  const getAgeStageInfo = (age) => {
    const n = Number(age);
    if (n <= 9) {
      return {
        stage: '7 – 9 سنوات (مرحلة المستكشف الرقمي)',
        badgeColor: 'bg-sky-500/15 text-sky-700 border-sky-300',
        curriculum: 'البرمجة الكتلية Scratch 3.0 + مبادئ الروبوتات الميكانيكية + الأمان الرقمي المبسط'
      };
    }
    if (n <= 11) {
      return {
        stage: '10 – 11 سنة (مرحلة البنّاء المبتكر)',
        badgeColor: 'bg-indigo-500/15 text-indigo-700 border-indigo-300',
        curriculum: 'برمجة Arduino Uno والحساسات + تطوير مواقع الويب التفاعلية + نماذج الذكاء الاصطناعي'
      };
    }
    return {
      stage: '12 – 14 سنة (مرحلة القائد التقني)',
      badgeColor: 'bg-amber-500/15 text-amber-800 border-amber-300',
      curriculum: 'لغة Python المتقدمة + الرؤية الحاسوبية OpenCV + أنظمة إنترنت الأشياء ESP32 والأمن السيبراني'
    };
  };

  const currentStage = getAgeStageInfo(childAge);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!childName.trim() || !parentPhone.trim()) return;

    setSubmitting(true);
    try {
      const res = await EventDB.submitBatch2Student({
        childName: childName.trim(),
        childAge: Number(childAge),
        schoolName: schoolName.trim() || 'مدارس النجف الأشرف',
        parentName: parentName.trim() || 'ولي أمر الطالب',
        parentPhone: parentPhone.trim(),
        preferredTrack,
        experienceLevel,
        notes: notes.trim()
      });
      const record = res?.applicant || res;

      const url = await generateOfficialQrDataUrl({
        type: 'b2',
        code: record.candidate_code,
        name: record.child_name,
        role: record.age_stage,
        track: record.preferred_track
      }, 240);

      setQrDataUrl(url);
      setRegisteredCandidate(record);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setRegisteredCandidate(null);
    setQrDataUrl('');
    setChildName('');
    setSchoolName('');
    setParentName('');
    setParentPhone('');
    setNotes('');
  };

  const handleShareWhatsApp = () => {
    if (!registeredCandidate) return;
    const text = `🎉 تم تسجيل المبتكر الصغير (${registeredCandidate.child_name} - العمر ${registeredCandidate.child_age} سنوات) كمرشح رسمي في الدفعة الثانية لمبادرة «1001» طفل رقمي بنادي أبدع للمهارات الذكية!\n📌 رقم الترشيح: ${registeredCandidate.candidate_code}\n📚 المرحلة: ${registeredCandidate.age_stage}\n💻 المسار: ${registeredCandidate.preferred_track}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-900 via-sky-950 to-slate-900 text-white px-6 py-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                  الأعمار 7 – 14 سنة • مجاناً 100%
                </span>
                <span className="text-xs text-sky-300 font-bold">الدفعة الثانية (2026 - 2027)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-0.5">
                التسجيل المبكر لأطفال الدفعة الثانية – مبادرة «1001» طفل رقمي
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!registeredCandidate ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Age Selector (7 to 14) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <label className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    1. اختر عمر الطفل لتحديد المرحلة الأكاديمية تلقائياً (7 – 14 سنة):
                  </label>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${currentStage.badgeColor}`}>
                    {currentStage.stage}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[7, 8, 9, 10, 11, 12, 13, 14].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setChildAge(age)}
                      className={`py-2.5 rounded-xl font-black text-sm transition-all border ${
                        Number(childAge) === age
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/25 scale-105'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {age} <span className="text-[10px] font-bold block opacity-85">سنوات</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-600 mt-3 bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <strong className="text-sky-700">المنهج المخصص لهذا العمر: </strong>
                  {currentStage.curriculum}
                </p>
              </div>

              {/* Child & Parent Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    اسم الطفل الثلاثي *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="مثال: علي حيدر النجفي"
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    اسم المدرسة الحالية
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="مثال: مدرسة الموهوبين / سما العراق"
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    اسم ولي الأمر *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="الاسم الكامل لولي الأمر"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    رقم هاتف ولي الأمر (واتساب) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="078XXXXXXXX"
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm font-bold text-slate-900 text-right outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Track Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2">
                  2. المسار التقني المفضل للطفل:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TRACK_OPTIONS.map((t) => {
                    const Icon = t.icon;
                    const active = preferredTrack === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPreferredTrack(t.id)}
                        className={`text-right p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                          active
                            ? 'bg-sky-50/90 border-sky-600 ring-2 ring-sky-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">{t.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    مستوى خبرة الطفل السابقة
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white outline-none"
                  >
                    <option value="مبتدئ (شغوف بالتعلم)">مبتدئ (لا توجد خبرة سابقة – شغوف بالتعلم)</option>
                    <option value="متوسط (جرب Scratch أو ألعاب البرمجة)">متوسط (جرب Scratch أو تركيب الروبوتات)</option>
                    <option value="متقدم (لديه مشروع أو مشاركة سابقة)">متقدم (لديه مشروع أو مهارة برمجية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    موهبة إضافية أو ملاحظات (اختياري)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: يحب الرسم، الرياضيات، فك وتركيب الأجهزة..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-l from-sky-600 via-blue-700 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 text-white font-black text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition"
              >
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span>{submitting ? 'جاري إصدار بطاقة الترشيح...' : 'إصدار بطاقة مرشح الدفعة الثانية فوراً (مجاناً)'}</span>
              </button>
            </form>
          ) : (
            /* Candidate Card View */
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-black text-sm">تم تثبيت ترشيح الطفل في الدفعة الثانية بنجاح!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    احتفظ ببطاقة الترشيح أدناه أو اطبعها لإبرازها في جناح التسجيل خلال الحفل في قصر الثقافة.
                  </p>
                </div>
              </div>

              {/* Official Candidate Badge Preview */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
                  <div>
                    <span className="text-[11px] font-black text-amber-300 block">
                      نادي أبدع للمهارات الذكية • مبادرة 1001 طفل رقمي
                    </span>
                    <h4 className="text-lg font-black text-white mt-0.5">
                      بطاقة مرشح الدفعة الثانية (أولوية القبول)
                    </h4>
                  </div>
                  <div className="bg-amber-400 text-slate-950 font-mono font-black text-sm px-3.5 py-1.5 rounded-xl">
                    {registeredCandidate.candidate_code}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 items-center">
                  <div className="sm:col-span-2 space-y-2.5 text-right">
                    <div>
                      <span className="text-xs text-slate-400 block">اسم المبتكر المرشح:</span>
                      <span className="text-xl font-black text-sky-300">{registeredCandidate.child_name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block">العمر والمرحلة:</span>
                        <strong className="text-white">{registeredCandidate.child_age} سنوات ({registeredCandidate.age_stage})</strong>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block">المسار المختار:</span>
                        <strong className="text-amber-300">{registeredCandidate.preferred_track}</strong>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>ولي الأمر:</strong> {registeredCandidate.parent_name} ({registeredCandidate.parent_phone})
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-white text-slate-900 p-3 rounded-2xl border-2 border-amber-400 mx-auto">
                    {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-28 h-28 object-contain" />}
                    <span className="text-[10px] font-black text-slate-700 mt-1">امسح للتحقق في الحفل</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => openCandidateCardPrintWindow(registeredCandidate, qrDataUrl)}
                  className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة بطاقة الترشيح (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر واتساب</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center gap-2 transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>تسجيل طفل آخر من العائلة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
