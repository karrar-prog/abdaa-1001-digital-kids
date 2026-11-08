import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Unlock,
  Ticket,
  GraduationCap,
  Award,
  Users,
  Download,
  MessageCircle,
  RefreshCw,
  Search,
  Printer,
  CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';
import { EventDB } from '../lib/supabase';
import { openTicketPrintWindow, openCandidateCardPrintWindow } from '../utils/printEngine';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [batch2List, setBatch2List] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [t, b2, ev, vol, sp] = await Promise.all([
        EventDB.getAllTickets(),
        EventDB.getAllBatch2Students(),
        EventDB.getAllProjectEvaluations(),
        EventDB.getAllVolunteers(),
        EventDB.getAllSponsors()
      ]);
      setTickets(t || []);
      setBatch2List(b2 || []);
      setEvaluations(ev || []);
      setVolunteers(vol || []);
      setSponsors(sp || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isUnlocked) {
      loadAllData();
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.trim() === '1001' || pin.trim() === '2026') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('رمز الإدارة غير صحيح. جرب الرمز المعتمد: 1001');
    }
  };

  const formatWhatsAppPhone = (phone) => {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.startsWith('07')) return `964${digits.slice(1)}`;
    if (digits.startsWith('964')) return digits;
    return digits;
  };

  const handleWhatsAppTicket = (t) => {
    const intlPhone = formatWhatsAppPhone(t.phone);
    const msg = `مرحباً بكم من إدارة نادي أبدع للمهارات الذكية 🌟\nنؤكد حجز مقعدكم الرسمي في احتفالية تخرج الدفعة الأولى لمبادرة «1001» طفل رقمي على مسرح قصر الثقافة.\n🎟 رقم التذكرة: ${t.booking_code}\n💺 المقعد: ${t.seat_label || 'مقعد عام'} (${t.block_name || 'القاعة الرئيسية'})\nنسعد بحضوركم الساعة 2:00 ظهراً للاطلاع على معرض الـ 40 مشروعاً.`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleWhatsAppBatch2 = (c) => {
    const intlPhone = formatWhatsAppPhone(c.parent_phone);
    const msg = `مرحباً بولي أمر المبتكر الصغير (${c.child_name}) 🌟\nتم استلام طلب ترشيح طفلكم بنجاح ضمن الدفعة الثانية لمبادرة «1001» طفل رقمي في نادي أبدع للمهارات الذكية.\n📌 رقم الترشيح: ${c.candidate_code}\n🎯 المرحلة: ${c.age_stage}\n💻 المسار: ${c.preferred_track}\nسيتم التواصل معكم لتحديد موعد المقابلة العلمية والورش التدريبية المجانية.`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExportCSV = () => {
    let rows = [];
    let filename = `abdaa-1001-${activeTab}.csv`;

    if (activeTab === 'tickets') {
      rows = [
        ['رقم التذكرة', 'الاسم الكامل', 'الهاتف', 'الصفة', 'البلوك', 'المقعد', 'عدد المرافقين'],
        ...tickets.map((t) => [
          t.booking_code,
          t.attendee_name,
          t.phone,
          t.guest_type,
          t.block_name || '',
          t.seat_label || '',
          t.companions_count || 1
        ])
      ];
    } else if (activeTab === 'batch2') {
      rows = [
        ['رقم الترشيح', 'اسم الطفل', 'العمر', 'المرحلة العمرية', 'المسار المفضل', 'المدرسة', 'ولي الأمر', 'الهاتف'],
        ...batch2List.map((c) => [
          c.candidate_code,
          c.child_name,
          c.child_age,
          c.age_stage,
          c.preferred_track,
          c.school_name,
          c.parent_name,
          c.parent_phone
        ])
      ];
    } else if (activeTab === 'evaluations') {
      rows = [
        ['كود المشروع', 'اسم المشروع', 'الفئة العمرية', 'اسم المحكم', 'الصفة', 'الدرجة النهائية', 'الملاحظات'],
        ...evaluations.map((ev) => [
          ev.project_code,
          ev.project_title,
          ev.age_group,
          ev.judge_name,
          ev.judge_role,
          ev.total_score,
          ev.notes || ''
        ])
      ];
    } else {
      rows = [
        ['النوع', 'الاسم / الجهة', 'التفاصيل', 'الهاتف'],
        ...volunteers.map((v) => ['متطوع', v.full_name, v.committee, v.phone]),
        ...sponsors.map((s) => ['شريك راعٍ', s.organization_name, s.sponsorship_tier, s.phone])
      ];
    }

    const csvContent =
      '\uFEFF' +
      rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintTicketAdmin = async (t) => {
    const qrUrl = await QRCode.toDataURL(
      JSON.stringify({ code: t.booking_code, name: t.attendee_name, seat: t.seat_label }),
      { width: 220, margin: 1 }
    );
    openTicketPrintWindow(t, qrUrl);
  };

  const handlePrintBatch2Admin = async (c) => {
    const qrUrl = await QRCode.toDataURL(
      JSON.stringify({ code: c.candidate_code, name: c.child_name, age: c.child_age }),
      { width: 220, margin: 1 }
    );
    openCandidateCardPrintWindow(c, qrUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b-2 border-amber-400 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black text-amber-300 block">
                نادي أبدع للمهارات الذكية • غرفة العمليات التنظيمية
              </span>
              <h3 className="text-base sm:text-lg font-black">
                لوحة تحكم الإدارة واللجنة المنظمة (حجوزات القاعة • الدفعة الثانية • التحكيم)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <>
                <button
                  type="button"
                  onClick={loadAllData}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>تحديث</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير CSV / Excel</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isUnlocked ? (
            <div className="max-w-md mx-auto my-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-slate-900">دخول اللجنة المنظمة وإدارة نادي أبدع</h4>
              <p className="text-xs text-slate-600">
                تتيح هذه اللوحة متابعة مقاعد قصر الثقافة المحجوزة، طلبات التسجيل في الدفعة الثانية (أعمار 7–14 سنة)، ودرجات تحكيم المشاريع الـ 40.
              </p>
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  dir="ltr"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="أدخل رمز الإدارة (1001)"
                  className="w-full text-center tracking-widest font-mono text-lg font-black py-3 px-4 rounded-2xl border-2 border-slate-300 focus:border-sky-600 outline-none bg-white"
                />
                {pinError && <p className="text-xs font-bold text-rose-600">{pinError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-sky-700 text-white font-black text-sm flex items-center justify-center gap-2 transition"
                >
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span>فتح لوحة التحكم</span>
                </button>
              </form>
              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                💡 رمز الإدارة المعتمد للمعاينة: <strong className="font-mono text-sky-700">1001</strong>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className={`p-4 rounded-2xl border text-right transition ${
                    activeTab === 'tickets'
                      ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Ticket className="w-5 h-5 text-sky-600" />
                    <span className="text-2xl font-black text-slate-900">{tickets.length}</span>
                  </div>
                  <div className="text-xs font-black text-slate-700 mt-1">حجوزات مقاعد القاعة</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('batch2')}
                  className={`p-4 rounded-2xl border text-right transition ${
                    activeTab === 'batch2'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    <span className="text-2xl font-black text-slate-900">{batch2List.length}</span>
                  </div>
                  <div className="text-xs font-black text-slate-700 mt-1">مرشحو الدفعة الثانية (7–14)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('evaluations')}
                  className={`p-4 rounded-2xl border text-right transition ${
                    activeTab === 'evaluations'
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-2xl font-black text-slate-900">{evaluations.length}</span>
                  </div>
                  <div className="text-xs font-black text-slate-700 mt-1">تقييمات اللجنة العلمية</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('volunteers')}
                  className={`p-4 rounded-2xl border text-right transition ${
                    activeTab === 'volunteers'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="text-2xl font-black text-slate-900">
                      {volunteers.length + sponsors.length}
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-700 mt-1">المتطوعون وطلبات الرعاية</div>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، رقم الهاتف، الكود، أو المسار..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              {/* Tab 1: Tickets */}
              {activeTab === 'tickets' && (
                <div className="space-y-2.5 max-h-[48vh] overflow-y-auto">
                  {tickets
                    .filter(
                      (t) =>
                        !searchQuery.trim() ||
                        String(t.attendee_name).includes(searchQuery) ||
                        String(t.booking_code).includes(searchQuery) ||
                        String(t.phone).includes(searchQuery)
                    )
                    .map((t) => (
                      <div
                        key={t.booking_code}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                              {t.booking_code}
                            </span>
                            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                              مقعد: {t.seat_label || 'عام'} ({t.block_name || 'القاعة الرئيسية'})
                            </span>
                            <span className="text-xs font-bold text-slate-500">{t.guest_type}</span>
                          </div>
                          <h4 className="font-black text-sm text-slate-900 mt-1">{t.attendee_name}</h4>
                          <p className="text-xs text-slate-500" dir="ltr">
                            {t.phone} • المرافقون: {t.companions_count || 1}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePrintTicketAdmin(t)}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>طباعة التذكرة</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWhatsAppTicket(t)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>تأكيد واتساب</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Tab 2: Batch 2 Candidates */}
              {activeTab === 'batch2' && (
                <div className="space-y-2.5 max-h-[48vh] overflow-y-auto">
                  {batch2List
                    .filter(
                      (c) =>
                        !searchQuery.trim() ||
                        String(c.child_name).includes(searchQuery) ||
                        String(c.candidate_code).includes(searchQuery) ||
                        String(c.preferred_track).includes(searchQuery)
                    )
                    .map((c) => (
                      <div
                        key={c.candidate_code}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                              {c.candidate_code}
                            </span>
                            <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                              العمر: {c.child_age} سنوات ({c.age_stage})
                            </span>
                            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                              {c.preferred_track}
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-slate-900 mt-1">
                            {c.child_name} <span className="text-xs font-bold text-slate-500">({c.school_name})</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            ولي الأمر: {c.parent_name} • هاتف: <span dir="ltr">{c.parent_phone}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePrintBatch2Admin(c)}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>بطاقة المرشح</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWhatsAppBatch2(c)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>ترحيب واتساب</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Tab 3: Evaluations */}
              {activeTab === 'evaluations' && (
                <div className="space-y-2.5 max-h-[48vh] overflow-y-auto">
                  {evaluations.map((ev, i) => (
                    <div
                      key={ev.id || i}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                            {ev.project_code}
                          </span>
                          <span className="text-xs font-bold text-slate-600">{ev.age_group}</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 mt-1">{ev.project_title}</h4>
                        <p className="text-xs text-slate-500">
                          المحكم: <strong>{ev.judge_name}</strong> ({ev.judge_role})
                          {ev.notes ? ` — "${ev.notes}"` : ''}
                        </p>
                      </div>
                      <div className="bg-amber-50 border border-amber-300 px-4 py-2 rounded-xl text-center">
                        <span className="text-lg font-black text-amber-800">{ev.total_score}</span>
                        <span className="text-xs text-amber-700 font-bold"> / 100</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Volunteers & Sponsors */}
              {activeTab === 'volunteers' && (
                <div className="space-y-3 max-h-[48vh] overflow-y-auto">
                  {volunteers.length === 0 && sponsors.length === 0 ? (
                    <div className="text-center py-8 text-xs font-bold text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                      لا توجد طلبات تطوع أو رعاية مسجلة في هذه الجلسة بعد.
                    </div>
                  ) : (
                    <>
                      {volunteers.map((v, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              متطوع تنظيمي
                            </span>
                            <h4 className="font-black text-sm text-slate-900 mt-1">{v.full_name}</h4>
                            <p className="text-xs text-slate-500">
                              اللجنة: {v.committee} • الهاتف: {v.phone}
                            </p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                      ))}
                      {sponsors.map((s, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[11px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                              طلب رعاية رسمية ({s.sponsorship_tier})
                            </span>
                            <h4 className="font-black text-sm text-slate-900 mt-1">{s.organization_name}</h4>
                            <p className="text-xs text-slate-600">
                              المسؤول: {s.contact_person} • الهاتف: {s.phone}
                            </p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-amber-600" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
