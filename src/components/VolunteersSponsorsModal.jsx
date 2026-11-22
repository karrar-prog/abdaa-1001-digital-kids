import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Building,
  CheckCircle,
  Copy,
  Check,
  Printer,
  Share2,
  ShieldCheck,
  Calendar,
  Shirt,
  Phone,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventDB } from '../lib/supabase';
import { generateOfficialQrDataUrl } from '../utils/qrVerify';
import { openMembershipIdCardPrintWindow } from '../utils/printEngine';

const VOLUNTEER_COMMITTEES = [
  'لجنة الاستقبال وتدقيق التذاكر والـ QR',
  'لجنة تنظيم القاعة ومرافقة عوائل الخريجين',
  'لجنة الإشراف على معرض الـ 40 مشروعاً ابتكارياً',
  'لجنة المسرح والتتويج والدروع (172 خريجاً)',
  'اللجنة الإعلامية والتصوير الفوتوغرافي والفيديو',
  'لجنة الدعم التقني والشاشات والصوتيات'
];

const ACADEMIC_ROLES = [
  'طالب جامعي',
  'خريج جامعي',
  'مبرمج / مهندس تقني',
  'معلم / كادر تربوي',
  'مصور / صانع محتوى إعلامي',
  'ناشط في العمل التطوعي والمجتمعي'
];

const AVAILABILITY_OPTIONS = [
  'متفرغ ليوم الحفل + البروفة التحضيرية كاملة',
  'متفرغ ليوم الاحتفالية كاملاً (من الصباح حتى الختام)',
  'متفرغ للفترة المسائية وقت انطلاق الحفل (1:30 ظهراً – 6:00 مساءً)'
];

const VEST_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function VolunteersSponsorsModal({ isOpen, onClose, initialTab = 'volunteer' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'volunteer');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [registeredVolunteer, setRegisteredVolunteer] = useState(null);
  const [volQrUrl, setVolQrUrl] = useState('');

  // Complete Volunteer Registration Form State
  const [volData, setVolData] = useState({
    full_name: '',
    phone: '',
    age: '21',
    academic_status: ACADEMIC_ROLES[0],
    committee: VOLUNTEER_COMMITTEES[0],
    availability: AVAILABILITY_OPTIONS[0],
    tshirt_size: 'L',
    notes: ''
  });

  // Sponsor Form State
  const [spoData, setSpoData] = useState({
    organization_name: '',
    contact_person: '',
    phone: '',
    email: '',
    sponsorship_tier: 'رعاية رئيسية للحدث',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const shareableVolunteerLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/volunteer`
      : 'https://abdaa-1001-digital-kids.vercel.app/volunteer';

  const handleCopyFormLink = () => {
    navigator.clipboard?.writeText(shareableVolunteerLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (!volData.full_name.trim() || !volData.phone.trim()) return;
    setLoading(true);
    try {
      const res = await EventDB.submitVolunteer(volData);
      const volRecord = res?.volunteer || {
        ...volData,
        volunteer_code: `ABD-VOL-${Math.floor(1000 + Math.random() * 9000)}`
      };

      const qrUrl = await generateOfficialQrDataUrl(
        {
          type: 'id',
          code: volRecord.volunteer_code,
          name: volRecord.full_name,
          role: 'متطوع تنظيمي معتمد — احتفالية 1001 طفل رقمي',
          track: volRecord.committee,
          extra: `${volRecord.academic_status} • قياس ${volRecord.tshirt_size}`
        },
        240
      );

      setVolQrUrl(qrUrl);
      setRegisteredVolunteer(volRecord);
      setSubmitted(true);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await EventDB.submitSponsor(spoData);
      setRegisteredVolunteer(null);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintVolunteerId = () => {
    if (!registeredVolunteer) return;
    openMembershipIdCardPrintWindow({
      fullName: registeredVolunteer.full_name,
      membershipId: registeredVolunteer.volunteer_code,
      roleTitle: 'عضو لجنة تنظيمية ومتطوع معتمد — احتفالية 1001',
      track: registeredVolunteer.committee,
      ageStage: `${registeredVolunteer.academic_status || 'متطوع'}${registeredVolunteer.age ? ` (${registeredVolunteer.age} سنة)` : ''}`,
      cityOrSchool: 'قصر الثقافة — النجف الأشرف',
      issueDate: '2026/11/15',
      expiryDate: '2026/12/31',
      phone: registeredVolunteer.phone,
      bloodType: registeredVolunteer.tshirt_size || 'L',
      badgeColor: '#0d9488',
      qrDataUrl: volQrUrl
    });
  };

  const handleShareWhatsAppConfirmation = () => {
    if (!registeredVolunteer) return;
    const msg = `✅ تم تسجيلي كمتطوع في احتفالية تخرج مبادرة «1001» طفل رقمي – نادي أبدع للمهارات الذكية!\n👤 الاسم: ${registeredVolunteer.full_name}\n🆔 كود المتطوع: ${registeredVolunteer.volunteer_code}\n📌 اللجنة: ${registeredVolunteer.committee}\n🔗 رابط استمارة المتطوعين: ${shareableVolunteerLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const resetAll = () => {
    setSubmitted(false);
    setRegisteredVolunteer(null);
    setVolQrUrl('');
    setVolData({
      full_name: '',
      phone: '',
      age: '21',
      academic_status: ACADEMIC_ROLES[0],
      committee: VOLUNTEER_COMMITTEES[0],
      availability: AVAILABILITY_OPTIONS[0],
      tshirt_size: 'L',
      notes: ''
    });
    setSpoData({
      organization_name: '',
      contact_person: '',
      phone: '',
      email: '',
      sponsorship_tier: 'رعاية رئيسية للحدث',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800/70 rounded-3xl shadow-2xl text-right my-auto max-h-[94vh] flex flex-col overflow-hidden">
        {/* Official Header */}
        <div className="bg-gradient-to-l from-slate-900 via-teal-950 to-sky-950 text-white px-5 sm:px-7 py-5 border-b-2 border-amber-400 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1.5 shadow-md shrink-0">
              <img src="/brand/abdaa-logo.png" alt="نادي أبدع" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                  احتفالية مبادرة «1001» طفل رقمي • قصر الثقافة
                </span>
                <button
                  type="button"
                  onClick={handleCopyFormLink}
                  className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/15 hover:bg-white/25 text-sky-200 px-2.5 py-0.5 rounded-full transition cursor-pointer"
                  title="نسخ الرابط المباشر لإرساله للمتطوعين"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'تم نسخ رابط الاستمارة ✓' : 'نسخ رابط المتطوعين'}</span>
                </button>
              </div>
              <h3 className="text-base sm:text-xl font-black font-alexandria mt-1">
                {activeTab === 'volunteer'
                  ? 'الاستمارة الرسمية لتسجيل المتطوعين واللجان التنظيمية'
                  : 'استمارة الشراكة والرعاية الرسمية للاحتفالية'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {!submitted ? (
            <>
              {/* Mode Switcher */}
              <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('volunteer')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                    activeTab === 'volunteer'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>استمارة المتطوعين</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sponsor')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                    activeTab === 'sponsor'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>رعاية الشركات والمؤسسات</span>
                </button>
              </div>

              {/* VOLUNTEER FORM */}
              {activeTab === 'volunteer' && (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/70 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                    <strong>مرحباً بك في فريق صناع الأثر بنادي أبدع وشركة المصدر!</strong> يرجى ملء بياناتك بدقة لاعتمادك ضمن اللجان التنظيمية لاحتفالية تخرج 172 طفلاً رقمياً وإصدار هوية التطوع الرسمية الخاصة بك.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5">
                        الاسم الثلاثي الكامل *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="مثال: علي حسن الربيعي"
                          value={volData.full_name}
                          onChange={(e) => setVolData({ ...volData, full_name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pr-10 pl-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5">
                        رقم الهاتف الفعّال (واتساب) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          placeholder="078XXXXXXXX"
                          value={volData.phone}
                          onChange={(e) => setVolData({ ...volData, phone: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pr-10 pl-3 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white text-right focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5">
                        الصفة الدراسية أو المهنية *
                      </label>
                      <select
                        value={volData.academic_status}
                        onChange={(e) => setVolData({ ...volData, academic_status: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                      >
                        {ACADEMIC_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5">
                          العمر
                        </label>
                        <input
                          type="number"
                          min="15"
                          max="65"
                          value={volData.age}
                          onChange={(e) => setVolData({ ...volData, age: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white text-center focus:outline-none focus:border-teal-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                          <Shirt className="w-3.5 h-3.5 text-teal-600" />
                          <span>قياس السترة</span>
                        </label>
                        <select
                          value={volData.tshirt_size}
                          onChange={(e) => setVolData({ ...volData, tshirt_size: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2.5 text-sm font-mono font-black text-slate-900 dark:text-white text-center focus:outline-none focus:border-teal-600"
                        >
                          {VEST_SIZES.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Committee Choice */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-2">
                      اختر اللجنة التنظيمية التي ترغب بالمساهمة فيها: *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {VOLUNTEER_COMMITTEES.map((comm) => {
                        const active = volData.committee === comm;
                        return (
                          <button
                            key={comm}
                            type="button"
                            onClick={() => setVolData({ ...volData, committee: comm })}
                            className={`p-3 rounded-xl border text-right text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                              active
                                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-400'
                            }`}
                          >
                            <ShieldCheck className={`w-4 h-4 shrink-0 ${active ? 'text-amber-300' : 'text-teal-600'}`} />
                            <span>{comm}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>أوقات التفرغ للحضور والبروفة التحضيرية:</span>
                    </label>
                    <select
                      value={volData.availability}
                      onChange={(e) => setVolData({ ...volData, availability: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                    >
                      {AVAILABILITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience & Notes */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5">
                      المهارات أو الخبرات التطوعية السابقة (اختياري)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="مثال: شاركت في تنظيم معارض جامعية، أجيد التصوير، أو التعامل مع الأطفال..."
                      value={volData.notes}
                      onChange={(e) => setVolData({ ...volData, notes: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-teal-600 via-emerald-600 to-sky-700 hover:opacity-95 text-white font-black text-sm shadow-lg shadow-teal-600/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'جارٍ تسجيل بياناتك وإصدار كود المتطوع...' : 'تأكيد التسجيل في فريق متطوعي احتفالية «1001»'}
                  </button>
                </form>
              )}

              {/* SPONSOR FORM */}
              {activeTab === 'sponsor' && (
                <form onSubmit={handleSponsorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                      اسم المؤسسة أو الشركة الراعية *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: شركة البرمجيات / مدارس..."
                      value={spoData.organization_name}
                      onChange={(e) => setSpoData({ ...spoData, organization_name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                        الشخص المسؤول *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="الاسم الكامل"
                        value={spoData.contact_person}
                        onChange={(e) => setSpoData({ ...spoData, contact_person: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="078XXXXXXXX"
                        value={spoData.phone}
                        onChange={(e) => setSpoData({ ...spoData, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white text-right focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                      طبيعة الشراكة أو الرعاية المطلوبة
                    </label>
                    <select
                      value={spoData.sponsorship_tier}
                      onChange={(e) => setSpoData({ ...spoData, sponsorship_tier: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="رعاية رئيسية للحدث">رعاية رئيسية للحدث (تغطية ودروع وتكريم على المسرح)</option>
                      <option value="شريك تقني وأكاديمي">شريك تقني وأكاديمي</option>
                      <option value="رعاية جوائز ودروع الأطفال">رعاية وتجهيز دروع وجوائز الأطفال الـ 172</option>
                      <option value="شريك ضيافة وإقامة">شريك الضيافة واستقبال الضيوف الرسميين</option>
                      <option value="تغطية إعلامية وفضائية">تغطية إعلامية وفضائية للحدث</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                      تفاصيل ومقترحات إضافية
                    </label>
                    <textarea
                      rows={3}
                      placeholder="كيف تود دعم المبادرة وتكريم الأطفال..."
                      value={spoData.notes}
                      onChange={(e) => setSpoData({ ...spoData, notes: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'جارٍ الإرسال...' : 'إرسال طلب الرعاية والشراكة'}
                  </button>
                </form>
              )}
            </>
          ) : registeredVolunteer ? (
            /* Volunteer Official Badge & QR Confirmation */
            <div className="space-y-5 text-center py-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                <CheckCircle className="w-4 h-4" />
                <span>تم حفظ بياناتك في سجل المتطوعين الرسمي بنجاح!</span>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 border-2 border-amber-400/70 shadow-xl text-right">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/brand/logo-1001-kids.png"
                        alt="شعار مبادرة 1001 طفل رقمي"
                        className="h-10 w-auto object-contain shrink-0"
                      />
                      <span className="text-[11px] font-black text-amber-300 block">
                        بطاقة اعتماد متطوع • مبادرة «1001» طفل رقمي
                      </span>
                    </div>
                    <h4 className="text-xl font-black font-alexandria">{registeredVolunteer.full_name}</h4>
                    <div className="inline-block font-mono text-xs font-black px-3 py-1 rounded-lg bg-white/10 text-teal-300 border border-teal-400/30">
                      {registeredVolunteer.volunteer_code}
                    </div>
                    <p className="text-xs text-slate-200 font-bold pt-1">
                      اللجنة: <span className="text-amber-300">{registeredVolunteer.committee}</span>
                    </p>
                    <p className="text-[11px] text-slate-300">
                      الصفة: {registeredVolunteer.academic_status} • قياس السترة: {registeredVolunteer.tshirt_size}
                    </p>
                  </div>

                  {volQrUrl && (
                    <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 text-center">
                      <img src={volQrUrl} alt="QR المتطوع" className="w-28 h-28 object-contain" />
                      <span className="block text-[9px] font-black text-slate-800 mt-1">رمز التحقق الرسمي</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintVolunteerId}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة هوية/باج المتطوع (الوجهين)</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsAppConfirmation}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر واتساب</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  تسجيل متطوع آخر
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-alexandria">
                شكراً لمبادرتكم الكريمة!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                تم حفظ طلب الرعاية في قاعدة البيانات المركزية، وسيتواصل معكم فريق إدارة نادي أبدع وشركة المصدر فوراً.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
