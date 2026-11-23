import React, { useState } from 'react';
import { Search, RefreshCw, Download, MessageCircle, Printer, Trash2, CreditCard, Copy, Check } from 'lucide-react';
import { EventDB } from '../../lib/supabase';

export default function OperationsDataTabs({
  activeTab,
  searchQuery,
  setSearchQuery,
  loading,
  loadAllData,
  handleExportCSV,
  tickets,
  setTickets,
  handleWhatsAppTicket,
  handleReprintTicket,
  batch2List,
  setBatch2List,
  handleWhatsAppBatch2,
  handleReprintBatch2,
  handlePrefillIdCardAndOpen,
  evaluations,
  setEvaluations,
  prideMessages,
  setPrideMessages,
  volunteers,
  setVolunteers,
  sponsorsReq,
  setSponsorsReq,
  readOnly = false
}) {
  const [copiedVolLink, setCopiedVolLink] = useState(false);
  const q = searchQuery.trim().toLowerCase();
  const volLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/volunteer`
      : 'https://abdaa-1001-digital-kids.vercel.app/volunteer';

  const handleCopyVolLink = () => {
    navigator.clipboard?.writeText(volLink);
    setCopiedVolLink(true);
    setTimeout(() => setCopiedVolLink(false), 2500);
  };

  const handleWhatsAppVolunteer = (v) => {
    const digits = String(v.phone || '').replace(/\D/g, '');
    const intl = digits.startsWith('07') ? `964${digits.slice(1)}` : digits;
    const msg = `مرحباً بالمتطوع المبدع (${v.full_name}) 🌟\nتم اعتماد طلب تطوعك بنجاح ضمن (${v.committee || v.field_of_interest}) في احتفالية تخرج مبادرة «1001» طفل رقمي بنادي أبدع للمهارات الذكية.\nكود المتطوع: ${v.volunteer_code || 'ABD-VOL'}\nنلتقيكم في البروفة التحضيرية في قصر الثقافة – النجف الأشرف.`;
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
            {['volunteers', 'tickets', 'batch2', 'evaluations', 'community'].includes(activeTab) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم، رقم الهاتف، أو الكود..."
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadAllData}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>تحديث</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير Excel (CSV)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: VOLUNTEERS DATABASE */}
            {activeTab === 'volunteers' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/70 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-alexandria font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                      الرابط الرسمي المباشر لاستمارة المتطوعين ({volunteers.length} متطوع مسجل)
                    </h4>
                    <p className="text-[11px] font-mono text-teal-800 dark:text-teal-300 mt-0.5 dir-ltr text-right">
                      {volLink}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVolLink}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    {copiedVolLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedVolLink ? 'تم نسخ الرابط لإرساله للمتطوعين ✓' : 'نسخ رابط استمارة المتطوعين'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                      <tr>
                        <th className="p-3">كود المتطوع</th>
                        <th className="p-3">الاسم الثلاثي</th>
                        <th className="p-3">اللجنة التنظيمية</th>
                        <th className="p-3">الصفة / العمر / القياس</th>
                        <th className="p-3">التفرغ والملاحظات</th>
                        <th className="p-3">الهاتف</th>
                        <th className="p-3 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {volunteers.filter(
                        (v) =>
                          !q ||
                          String(v.full_name || '').toLowerCase().includes(q) ||
                          String(v.phone || '').includes(q) ||
                          String(v.committee || v.field_of_interest || '').toLowerCase().includes(q) ||
                          String(v.volunteer_code || '').toLowerCase().includes(q)
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                            لا يوجد متطوعون مسجلون حالياً — انسخ الرابط أعلاه وأرسله للمتطوعين ليبدأ التسجيل الفوري.
                          </td>
                        </tr>
                      ) : (
                        volunteers
                          .filter(
                            (v) =>
                              !q ||
                              String(v.full_name || '').toLowerCase().includes(q) ||
                              String(v.phone || '').includes(q) ||
                              String(v.committee || v.field_of_interest || '').toLowerCase().includes(q) ||
                              String(v.volunteer_code || '').toLowerCase().includes(q)
                          )
                          .map((v, i) => (
                            <tr key={v.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 font-mono font-black text-teal-600 dark:text-teal-400">
                                {v.volunteer_code || `ABD-VOL-${i + 1}`}
                              </td>
                              <td className="p-3 font-bold text-slate-900 dark:text-white">{v.full_name}</td>
                              <td className="p-3 font-bold text-sky-700 dark:text-sky-300">
                                {v.committee || v.field_of_interest}
                              </td>
                              <td className="p-3 text-slate-500">
                                {v.academic_status || 'متطوع'}
                                {v.age ? ` • ${v.age} سنة` : ''}
                                {v.tshirt_size ? ` • قياس ${v.tshirt_size}` : ''}
                              </td>
                              <td className="p-3 text-slate-500 max-w-[200px] truncate" title={v.notes || v.availability}>
                                {v.availability || 'يوم الحفل'}
                                {v.notes ? ` — ${v.notes}` : ''}
                              </td>
                              <td className="p-3 font-mono font-bold">{v.phone}</td>
                              <td className="p-3 flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppVolunteer(v)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>واتساب</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePrefillIdCardAndOpen({
                                      fullName: v.full_name,
                                      membershipId: v.volunteer_code || `ABD-VOL-2026-${String(i + 1).padStart(3, '0')}`,
                                      roleTitle: 'عضو لجنة تنظيمية ومتطوع معتمد — احتفالية 1001',
                                      track: v.committee || v.field_of_interest || 'اللجنة التنظيمية',
                                      ageStage: `${v.academic_status || 'متطوع'}${v.age ? ` (${v.age} سنة)` : ''}`,
                                      phone: v.phone || '07810746655',
                                      cityOrSchool: 'قصر الثقافة — النجف الأشرف',
                                      bloodType: v.tshirt_size || 'O+',
                                      badgeColor: '#0d9488'
                                    })
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-slate-950 font-black flex items-center gap-1 transition cursor-pointer"
                                  title="إصدار هوية متطوع رسمية"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>هوية</span>
                                </button>
                                {!readOnly && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const updated = await EventDB.deleteVolunteer(v.id || v.volunteer_code);
                                      setVolunteers(updated);
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                    title="حذف المتطوع"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: TICKETS */}
            {activeTab === 'tickets' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">رقم التذكرة</th>
                      <th className="p-3">اسم الحاجز</th>
                      <th className="p-3">الصفة</th>
                      <th className="p-3">المقعد / الملاحظات</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {tickets
                      .filter(
                        (t) =>
                          !q ||
                          String(t.attendee_name || '').toLowerCase().includes(q) ||
                          String(t.booking_code || '').toLowerCase().includes(q) ||
                          String(t.phone_number || t.phone || '').includes(q)
                      )
                      .map((t, i) => (
                        <tr key={t.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-black text-sky-600 dark:text-sky-400">
                            {t.booking_code}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{t.attendee_name}</td>
                          <td className="p-3 text-slate-500">{t.guest_type}</td>
                          <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                            {t.seat_label || t.notes || 'عام'}
                          </td>
                          <td className="p-3 font-mono">{t.phone_number || t.phone}</td>
                          <td className="p-3">
                            {readOnly ? (
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  t.is_attended
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {t.is_attended ? 'حاضر ✓' : 'مسجل'}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = await EventDB.toggleTicketAttendance(t.id || t.booking_code);
                                  setTickets(updated);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                                  t.is_attended
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {t.is_attended ? 'حاضر ✓' : 'مسجل (اضغط للتحضير)'}
                              </button>
                            )}
                          </td>
                          <td className="p-3 flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleWhatsAppTicket(t)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReprintTicket(t)}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة</span>
                            </button>
                            {!readOnly && (
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = await EventDB.deleteTicket(t.id || t.booking_code);
                                  setTickets(updated);
                                }}
                                className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                title="حذف الحجز"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 7: BATCH 2 */}
            {activeTab === 'batch2' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">رقم الترشيح</th>
                      <th className="p-3">اسم الطفل</th>
                      <th className="p-3">العمر / المرحلة</th>
                      <th className="p-3">المسار المطلوب</th>
                      <th className="p-3">ولي الأمر والهاتف</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {batch2List
                      .filter(
                        (c) =>
                          !q ||
                          String(c.child_name || '').toLowerCase().includes(q) ||
                          String(c.candidate_code || '').toLowerCase().includes(q) ||
                          String(c.parent_phone || '').includes(q)
                      )
                      .map((c, i) => (
                        <tr key={c.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-black text-amber-600 dark:text-amber-400">
                            {c.candidate_code}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{c.child_name}</td>
                          <td className="p-3 text-slate-500">
                            {c.age || c.child_age} سنة • {c.age_stage}
                          </td>
                          <td className="p-3 font-bold text-sky-600 dark:text-sky-400">{c.preferred_track}</td>
                          <td className="p-3">
                            <span className="font-bold block">{c.parent_name}</span>
                            <span className="font-mono text-slate-400">{c.parent_phone}</span>
                          </td>
                          <td className="p-3 flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleWhatsAppBatch2(c)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReprintBatch2(c)}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>بطاقة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePrefillIdCardAndOpen({
                                  fullName: c.child_name,
                                  membershipId: c.candidate_code || `ABD-B2-2026-${i + 101}`,
                                  roleTitle: 'عضو منتسب — الدفعة الثانية (1001 طفل رقمي)',
                                  track: c.preferred_track || 'البرمجة والذكاء الاصطناعي',
                                  ageStage: c.age_stage || `${c.age || 10} سنوات`,
                                  phone: c.parent_phone || '07810746655',
                                  cityOrSchool: c.school_name || 'النجف الأشرف',
                                  badgeColor: '#d97706'
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 font-black flex items-center gap-1 transition cursor-pointer"
                              title={readOnly ? 'طباعة هوية انتماء رسمية' : 'إصدار هوية انتماء رسمية'}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>هوية</span>
                            </button>
                            {!readOnly && (
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = await EventDB.deleteBatch2Student(c.id || c.candidate_code);
                                  setBatch2List(updated);
                                }}
                                className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                title="حذف الطلب"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 8: EVALUATIONS */}
            {activeTab === 'evaluations' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">المشروع</th>
                      <th className="p-3">الفئة العمرية</th>
                      <th className="p-3">المحكّم</th>
                      <th className="p-3">الدرجة (من 100)</th>
                      <th className="p-3">الملاحظات</th>
                      {!readOnly && <th className="p-3 text-center">إجراء</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {evaluations.length === 0 ? (
                      <tr>
                        <td colSpan={readOnly ? 5 : 6} className="p-8 text-center text-slate-400">
                          لا توجد تقييمات مسجلة حتى الآن.
                        </td>
                      </tr>
                    ) : (
                      evaluations
                        .filter(
                          (ev) =>
                            !q ||
                            String(ev.project_title || '').toLowerCase().includes(q) ||
                            String(ev.project_code || '').toLowerCase().includes(q) ||
                            String(ev.judge_name || '').toLowerCase().includes(q)
                        )
                        .map((ev, i) => (
                        <tr key={ev.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            <span className="font-mono text-sky-600 ml-1">{ev.project_code}</span>
                            {ev.project_title}
                          </td>
                          <td className="p-3 text-slate-500">{ev.age_group}</td>
                          <td className="p-3 font-bold">
                            {ev.judge_name} <span className="text-slate-400">({ev.judge_role})</span>
                          </td>
                          <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            {ev.total_score} / 100
                          </td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{ev.notes || '—'}</td>
                          {!readOnly && (
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = await EventDB.deleteProjectEvaluation(ev.id);
                                  if (setEvaluations) setEvaluations(updated);
                                }}
                                className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                title="حذف التقييم"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 9: COMMUNITY (Wall of Pride + Volunteers & Sponsor Requests) */}
            {activeTab === 'community' && (
              <div className="space-y-6">
                {/* Pride Wall Messages */}
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-alexandria mb-3">
                    رسائل جدار الفخر والتهاني ({prideMessages.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prideMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-black text-slate-900 dark:text-white">
                              {msg.senderName}
                            </strong>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                              {msg.relation}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{msg.message}</p>
                        </div>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = await EventDB.deletePrideMessage(msg.id);
                              setPrideMessages(updated);
                            }}
                            className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer shrink-0"
                            title="حذف الرسالة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volunteers & Sponsors Requests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-black text-sky-600 dark:text-sky-400 mb-3">
                      طلبات التطوع في اللجان ({volunteers.length})
                    </h4>
                    <div className="space-y-2">
                      {volunteers.map((v, i) => (
                        <div
                          key={v.id || i}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="block text-slate-900 dark:text-white">{v.full_name}</strong>
                            <span className="text-slate-500">
                              {v.field_of_interest || v.committee} • {v.phone}
                            </span>
                          </div>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = await EventDB.deleteVolunteer(v.id);
                                setVolunteers(updated);
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 mb-3">
                      طلبات الرعاية الواردة ({sponsorsReq.length})
                    </h4>
                    <div className="space-y-2">
                      {sponsorsReq.map((s, i) => (
                        <div
                          key={s.id || i}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="block text-slate-900 dark:text-white">
                              {s.organization_name}
                            </strong>
                            <span className="text-slate-500">
                              {s.sponsorship_tier} • {s.phone}
                            </span>
                          </div>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = await EventDB.deleteSponsor(s.id);
                                setSponsorsReq(updated);
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
    </>
  );
}
