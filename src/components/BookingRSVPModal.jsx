import React, { useState, useRef } from 'react';
import { X, Ticket, CheckCircle, Printer, AlertCircle, Armchair, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventDB } from '../lib/supabase';
import { openTicketPrintWindow } from '../utils/printEngine';
import { generateOfficialQrDataUrl } from '../utils/qrVerify';

const HALL_BLOCKS = [
  {
    id: 'block-A',
    code: 'A',
    name: 'البلوك الرسمي (A) — مقدمة المسرح',
    subtitle: 'للشخصيات الرسمية والوفود والجهات الراعية (VIP)',
    reserved: ['A-1', 'A-2', 'A-3', 'B-2']
  },
  {
    id: 'block-B',
    code: 'B',
    name: 'بلوك عائلات الخريجين (B) — وسط يمين',
    subtitle: 'مخصص لأولياء أمور وعائلات الأطفال المتخرجين',
    reserved: ['A-4', 'B-3', 'C-5']
  },
  {
    id: 'block-C',
    code: 'C',
    name: 'بلوك عائلات الخريجين (C) — وسط يسار',
    subtitle: 'مخصص لأولياء أمور وعائلات الأطفال المتخرجين',
    reserved: ['A-2', 'B-6', 'D-1']
  },
  {
    id: 'block-D',
    code: 'D',
    name: 'البلوك العام والإعلام (D) — أجنحة القاعة',
    subtitle: 'مخصص للضيوف والتربويين والتغطية الإعلامية',
    reserved: ['A-5', 'C-2']
  }
];

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingRSVPModal({ isOpen, onClose }) {
  const [selectedBlock, setSelectedBlock] = useState(HALL_BLOCKS[1]); // default block-B for families
  const [selectedSeat, setSelectedSeat] = useState('B-5');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guestType: 'عائلة طفل متخرج',
    companions: '1',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const ticketRef = useRef(null);

  if (!isOpen) return null;

  const handleSelectBlock = (block) => {
    setSelectedBlock(block);
    // Pick first available seat in this block
    const firstFree = `${SEAT_ROWS[1]}-4`;
    setSelectedSeat(block.reserved.includes(firstFree) ? 'C-4' : firstFree);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !selectedSeat) return;

    setLoading(true);

    try {
      const seatFullLabel = `بلوك ${selectedBlock.code} • مقعد ${selectedSeat}`;
      const enrichedFormData = {
        ...formData,
        notes: `${seatFullLabel}${formData.notes ? ` — ${formData.notes}` : ''}`
      };

      const res = await EventDB.createTicket(enrichedFormData);
      if (res.success && res.ticket) {
        const enrichedTicket = {
          ...res.ticket,
          seat_label: selectedSeat,
          block_name: selectedBlock.name
        };
        setTicketResult(enrichedTicket);

        const url = await generateOfficialQrDataUrl({
          type: 'ticket',
          code: enrichedTicket.booking_code,
          name: enrichedTicket.attendee_name,
          role: enrichedTicket.guest_type,
          track: `${selectedBlock.name} — مقعد ${selectedSeat}`
        }, 260);
        setQrDataUrl(url);

        try {
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (ticketResult) {
      openTicketPrintWindow(ticketResult, qrDataUrl);
    } else {
      window.print();
    }
  };

  const handleReset = () => {
    setTicketResult(null);
    setQrDataUrl('');
    setFormData({
      name: '',
      phone: '',
      guestType: 'عائلة طفل متخرج',
      companions: '1',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl text-right max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        
        <button 
          onClick={onClose}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!ticketResult ? (
          <div>
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-alexandria">
                  خريطة القاعة وحجز مقعد الحضور الرسمي
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  احتفالية تخرج مبادرة «1001» طفل رقمي – قصر الثقافة في النجف الأشرف
                </p>
              </div>
            </div>

            {/* Interactive Hall Block & Seat Map (Adapted from Al-Farabi Booking System) */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800">
              <div className="text-center mb-3">
                <div className="inline-block w-3/4 py-1.5 rounded-t-2xl bg-gradient-to-r from-slate-800 via-sky-700 to-slate-800 text-amber-300 text-[11px] font-extrabold tracking-wider shadow-xs">
                  ★ منصة مسرح قصر الثقافة ومعرض الـ 40 ابتكاراً ★
                </div>
              </div>

              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                1. اختر البلوك المفضل في القاعة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {HALL_BLOCKS.map((blk) => {
                  const isActive = selectedBlock.id === blk.id;
                  return (
                    <button
                      key={blk.id}
                      type="button"
                      onClick={() => handleSelectBlock(blk)}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-sky-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-extrabold font-alexandria">{blk.name}</strong>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {blk.code}
                        </span>
                      </div>
                      <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                        {blk.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Seat Matrix */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2. اختر رقم المقعد في ({selectedBlock.name}):
                </span>
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                  المقعد المحدد: {selectedBlock.code}-{selectedSeat}
                </span>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="min-w-[360px] space-y-1.5">
                  {SEAT_ROWS.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-1.5" dir="ltr">
                      <span className="w-5 text-[11px] font-mono font-bold text-slate-400 text-center">
                        {row}
                      </span>
                      {SEAT_COLS.map((col) => {
                        const seatCode = `${row}-${col}`;
                        const isReserved = selectedBlock.reserved.includes(seatCode);
                        const isChosen = selectedSeat === seatCode;
                        return (
                          <button
                            key={seatCode}
                            type="button"
                            disabled={isReserved}
                            onClick={() => setSelectedSeat(seatCode)}
                            className={`w-9 h-7 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center ${
                              isReserved
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through'
                                : isChosen
                                ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 dark:border-white shadow-sm scale-105 cursor-pointer'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-500 cursor-pointer'
                            }`}
                            title={isReserved ? 'مقعد محجوز' : `مقعد ${seatCode}`}
                          >
                            {seatCode}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-white dark:bg-slate-900 border border-slate-300 inline-block" /> متاح
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> اختيارك الحالي
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800 inline-block" /> محجوز مسبقاً
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الكامل (ولي الأمر / الضيف الكريم) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فراس نزار كريم"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="078XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-left dir-ltr transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    صفة الحضور
                  </label>
                  <select
                    value={formData.guestType}
                    onChange={(e) => setFormData({ ...formData, guestType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="عائلة طفل متخرج">عائلة طفل متخرج</option>
                    <option value="شخصية رسمية (VIP)">شخصية رسمية (VIP)</option>
                    <option value="جهة راعية أو داعمة">جهة راعية أو داعمة</option>
                    <option value="إعلامي وصحفي">إعلامي / تغطية صحفية</option>
                    <option value="مهتم وزائر عام">مهتم وزائر عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عدد المرافقين
                  </label>
                  <select
                    value={formData.companions}
                    onChange={(e) => setFormData({ ...formData, companions: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="1">مرافق واحد (1)</option>
                    <option value="2">مرافقان (2)</option>
                    <option value="3">3 مرافقين</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم الطفل الخريج أو ملاحظات (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: ولي أمر الطالب رضا فراس..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>
                  تولّد التذكرة الإلكترونية الرسمية فوراً وبشكل مجاني مع تثبيت المقعد (<strong>{selectedBlock.code}-{selectedSeat}</strong>) ورمز <strong>QR</strong> للدخول المباشر والمشاركة في القرعة التفاعلية.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'جاري تثبيت المقعد والحجز...' : `تأكيد حجز المقعد (${selectedBlock.code}-${selectedSeat}) واستخراج التذكرة`}
              </button>

            </form>
          </div>
        ) : (
          /* Ticket Result View */
          <div ref={ticketRef} className="text-center py-2">
            
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-alexandria">
              تم تثبيت مقعدك وتأكيد الحضور بنجاح!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              احتفظ بهذه التذكرة أو اطبعها لإبرازها عند بوابة قصر الثقافة
            </p>

            {/* Printable Ticket Card */}
            <div className="bg-slate-50 dark:bg-slate-800/90 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-right relative overflow-hidden mb-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3.5 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase block">
                    نادي أبدع للمهارات الذكية
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-alexandria">
                    تذكرة حضور مبادرة «1001» طفل رقمي
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  مؤكدة ✓
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">اسم الحاضر:</span>
                  <strong className="text-slate-800 dark:text-white">{ticketResult.attendee_name}</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">كود التذكرة:</span>
                  <strong className="text-sky-600 dark:text-sky-400 font-mono text-sm">{ticketResult.booking_code}</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">البلوك والمقعد المخصص:</span>
                  <strong className="text-amber-600 dark:text-amber-400 font-alexandria">
                    بلوك {selectedBlock.code} — مقعد ({ticketResult.seat_label})
                  </strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">الصفة والمرافقين:</span>
                  <strong className="text-slate-800 dark:text-white">{ticketResult.guest_type} (+{ticketResult.companions_count})</strong>
                </div>
              </div>

              {/* QR Code Container */}
              {qrDataUrl && (
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border border-slate-200 mx-auto max-w-[210px]">
                  <img src={qrDataUrl} alt="Ticket QR Code" className="w-36 h-36 object-contain" />
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{ticketResult.booking_code}</span>
                </div>
              )}

            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التذكرة الرسمية (نافذة طباعة مستقلة)</span>
              </button>
              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                حجز تذكرة أخرى
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
