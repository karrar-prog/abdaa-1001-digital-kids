import React, { useState } from 'react';
import { X, HeartHandshake, UserCheck, Building, CheckCircle, Sparkles } from 'lucide-react';
import { EventDB } from '../lib/supabase';

export default function VolunteersSponsorsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('volunteer'); // 'volunteer' | 'sponsor'
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Volunteer state
  const [volData, setVolData] = useState({
    full_name: '',
    phone: '',
    email: '',
    field_of_interest: 'استقبال وتنظيم الحضور',
    notes: ''
  });

  // Sponsor state
  const [spoData, setSpoData] = useState({
    organization_name: '',
    contact_person: '',
    phone: '',
    email: '',
    sponsorship_tier: 'شريك راعٍ وداعم',
    notes: ''
  });

  if (!isOpen) return null;

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await EventDB.submitVolunteer(volData);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await EventDB.submitSponsor(spoData);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSubmitted(false);
    setVolData({
      full_name: '',
      phone: '',
      email: '',
      field_of_interest: 'استقبال وتنظيم الحضور',
      notes: ''
    });
    setSpoData({
      organization_name: '',
      contact_person: '',
      phone: '',
      email: '',
      sponsorship_tier: 'شريك راعٍ وداعم',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-brand-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-right max-h-[92vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute left-6 top-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            
            {/* Header Tabs */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white font-alexandria mb-3">
                انضم إلى صناع الأثر في الاحتفالية
              </h3>
              
              <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('volunteer')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    activeTab === 'volunteer'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>استمارة المتطوعين</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sponsor')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    activeTab === 'sponsor'
                      ? 'bg-accent-amber text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>استمارة الشركات والرعاة</span>
                </button>
              </div>
            </div>

            {/* Volunteer Form */}
            {activeTab === 'volunteer' && (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم الثلاثي *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علي حسن الربيعي"
                    value={volData.full_name}
                    onChange={(e) => setVolData({ ...volData, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف (واتساب) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="078XXXXXXXX"
                    value={volData.phone}
                    onChange={(e) => setVolData({ ...volData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 text-left dir-ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المجال الراغب بالتطوع فيه</label>
                  <select
                    value={volData.field_of_interest}
                    onChange={(e) => setVolData({ ...volData, field_of_interest: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="استقبال وتنظيم الحضور">فريق الاستقبال وتنظيم مقاعد الحضور</option>
                    <option value="الدعم الفني والتقني">الدعم التقني والصوتيات وشاشات العرض</option>
                    <option value="التصوير والتوثيق الإعلامي">التصوير الفوتوغرافي والفيديو والتوثيق</option>
                    <option value="إدارة معرض مشاريع الأطفال">الإشراف على معرض الـ 40 مشروعاً</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الخبرات السابقة أو ملاحظات</label>
                  <textarea
                    rows={3}
                    placeholder="أخبرنا باختصار عن تجاربك السابقة..."
                    value={volData.notes}
                    onChange={(e) => setVolData({ ...volData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال طلب الانضمام لفريق التنظيم'}
                </button>
              </form>
            )}

            {/* Sponsor Form */}
            {activeTab === 'sponsor' && (
              <form onSubmit={handleSponsorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المؤسسة أو الشركة الراعية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شركة البرمجيات / مدارس..."
                    value={spoData.organization_name}
                    onChange={(e) => setSpoData({ ...spoData, organization_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-amber"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">الشخص المسؤول *</label>
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكامل"
                      value={spoData.contact_person}
                      onChange={(e) => setSpoData({ ...spoData, contact_person: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-amber"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      placeholder="078XXXXXXXX"
                      value={spoData.phone}
                      onChange={(e) => setSpoData({ ...spoData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-amber text-left dir-ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">طبيعة الشراكة أو الرعاية المطلوبة</label>
                  <select
                    value={spoData.sponsorship_tier}
                    onChange={(e) => setSpoData({ ...spoData, sponsorship_tier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-amber"
                  >
                    <option value="رعاية رئيسية للحدث">رعاية رئيسية للحدث (تغطية ودروع وتكريم على المسرح)</option>
                    <option value="شريك تقني وأكاديمي">شريك تقني وأكاديمي</option>
                    <option value="رعاية جوائز ودروع الأطفال">رعاية وتجهيز دروع وجوائز الأطفال الـ 170</option>
                    <option value="شريك ضيافة وإقامة">شريك الضيافة واستقبال الضيوف الرسميين</option>
                    <option value="تغطية إعلامية وفضائية">تغطية إعلامية وفضائية للحدث</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">تفاصيل ومقترحات إضافية</label>
                  <textarea
                    rows={3}
                    placeholder="كيف تود دعم المبادرة وتكريم الأطفال..."
                    value={spoData.notes}
                    onChange={(e) => setSpoData({ ...spoData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-amber"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-accent-amber hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition disabled:opacity-50"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال طلب الرعاية والشراكة'}
                </button>
              </form>
            )}

          </div>
        ) : (
          /* Confirmation */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-alexandria">
              شكراً لمبادرتك الكريمة!
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              تم استلام بياناتك بنجاح وحفظها في قاعدة البيانات. سيتواصل معك فريق إدارة نادي أبدع لتنسيق التفاصيل.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={resetAll}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                تقديم طلب آخر
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
