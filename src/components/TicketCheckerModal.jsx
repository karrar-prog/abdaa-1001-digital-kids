import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { EventDB } from '../lib/supabase';

export default function TicketCheckerModal({ isOpen, onClose }) {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);
  const [stats, setStats] = useState({ total: 0, attended: 0 });

  const loadTickets = async () => {
    const list = await EventDB.getAllTickets();
    setTicketsList(list);
    const attended = list.filter(t => t.is_attended).length;
    setStats({ total: list.length, attended });
  };

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    setVerifyResult(null);

    try {
      const res = await EventDB.verifyAndCheckIn(inputCode);
      setVerifyResult(res);
      await loadTickets();
      if (res.found && !res.alreadyAttended) {
        setInputCode('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-right max-h-[92vh] overflow-y-auto border border-slate-200">
        
        <button 
          onClick={onClose}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-alexandria">
              بوابة المنظمين والتحقق الميداني
            </h3>
            <p className="text-xs text-slate-500">
              فحص التذاكر وتأكيد دخول الحاضرين لقصر الثقافة
            </p>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 block mb-1 font-medium">إجمالي التذاكر</span>
            <strong className="text-2xl font-black text-slate-900 font-alexandria">{stats.total}</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-700 block mb-1 font-medium">الحضور بالقاعة</span>
            <strong className="text-2xl font-black text-emerald-700 font-alexandria">{stats.attended}</strong>
          </div>
        </div>

        {/* Scanner Input Form */}
        <form onSubmit={handleVerify} className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            أدخل كود التذكرة (أو امسح رمز الـ QR):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="ABD-XXXX"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:border-brand-500 uppercase text-center font-bold"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'فحص...' : 'تحقق وتسجيل'}
            </button>
          </div>
        </form>

        {/* Result Message Box */}
        {verifyResult && (
          <div className={`p-4 rounded-2xl mb-6 border animate-fadeIn ${
            !verifyResult.found
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : verifyResult.alreadyAttended
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-start gap-3">
              {!verifyResult.found ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : verifyResult.alreadyAttended ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <strong className="block font-bold mb-1">{verifyResult.message}</strong>
                {verifyResult.ticket && (
                  <div className="text-xs space-y-1 text-slate-700 mt-2">
                    <div>الحاضر: <strong className="text-slate-900">{verifyResult.ticket.attendee_name}</strong></div>
                    <div>الصفة: {verifyResult.ticket.guest_type} (مرافقين: {verifyResult.ticket.companions_count})</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Tickets Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-700 font-alexandria">آخر التذاكر المسجلة</h4>
            <button 
              onClick={loadTickets} 
              className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {ticketsList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">لا توجد تذاكر مسجلة بعد.</p>
            ) : (
              ticketsList.map((t, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate">{t.attendee_name}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{t.booking_code} • {t.guest_type}</span>
                  </div>
                  <div className="shrink-0 mr-2">
                    {t.is_attended ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        داخل القاعة ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium">
                        لم يدخل
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
