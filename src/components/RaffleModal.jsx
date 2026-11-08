import React, { useState, useEffect, useRef } from 'react';
import { X, Gift, Trophy, Sparkles, Play, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENT_DETAILS } from '../data/eventData';
import { EventDB } from '../lib/supabase';

const PRIZE_TIERS = [
  'جائزة درع أبدع الذهبي لأفضل مشروع ابتكاري (7–14 سنة)',
  'جائزة التميز في الذكاء الاصطناعي والروبوتات – رعاية شركة المصدر',
  'جائزة المبتكر الصغير الواعد (فئة 7–9 سنوات)',
  'جائزة لجنة نقابة المبرمجين العراقيين للمشاريع التطبيقية',
  'جائزة قرعة جمهور وعائلات الخريجين – قصر الثقافة'
];

export default function RaffleModal({ isOpen, onClose }) {
  const [poolType, setPoolType] = useState('projects'); // 'projects' | 'attendees'
  const [selectedPrize, setSelectedPrize] = useState(PRIZE_TIERS[0]);
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rollingItem, setRollingItem] = useState(null);
  const [currentWinner, setCurrentWinner] = useState(null);
  const spinRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadPool = async () => {
      const projectItems = EVENT_DETAILS.projectsSample.map((p) => ({
        id: `proj-${p.id}`,
        code: p.code || `ABD-PRJ-0${p.id}`,
        title: p.title,
        subtitle: `${p.students} • جناح #${p.id}`,
        badge: p.ageLabel || p.track,
        source: 'projects'
      }));

      let attendeeItems = [];
      try {
        const tickets = await EventDB.getAllTickets();
        attendeeItems = (tickets || []).map((t, idx) => ({
          id: `att-${idx}`,
          code: t.booking_code,
          title: t.attendee_name,
          subtitle: `${t.guest_type} • مرافقين (${t.companions_count || 1})`,
          badge: 'تذكرة حضور مؤكدة',
          source: 'attendees'
        }));
      } catch {
        // fallback
      }

      if (attendeeItems.length === 0) {
        attendeeItems = [
          { id: 'att-demo-1', code: 'ABD-8821', title: 'عائلة الخريج رضا فراس نزار', subtitle: 'بلوك B • مقعد B-4', badge: 'عائلة طفل متخرج', source: 'attendees' },
          { id: 'att-demo-2', code: 'ABD-4092', title: 'عائلة الخريجة فاطمة حيدر الحسني', subtitle: 'بلوك B • مقعد C-2', badge: 'عائلة طفل متخرج', source: 'attendees' },
          { id: 'att-demo-3', code: 'ABD-7715', title: 'عائلة الخريجة سارة مصطفى العبادي', subtitle: 'بلوك C • مقعد A-5', badge: 'عائلة طفل متخرج', source: 'attendees' },
          { id: 'att-demo-4', code: 'ABD-3190', title: 'عائلة الخريج كرار حيدر الموسوي', subtitle: 'بلوك C • مقعد B-6', badge: 'عائلة طفل متخرج', source: 'attendees' }
        ];
      }

      setCandidates([...projectItems, ...attendeeItems]);
    };

    loadPool();
    return () => {
      if (spinRef.current) clearInterval(spinRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const eligiblePool = candidates.filter(
    (c) => c.source === poolType && !winners.some((w) => w.id === c.id)
  );

  const startDraw = () => {
    if (isSpinning || eligiblePool.length === 0) return;
    setCurrentWinner(null);
    setIsSpinning(true);

    let ticks = 0;
    const maxTicks = 32;

    spinRef.current = setInterval(() => {
      ticks++;
      const rand = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
      setRollingItem(rand);

      if (ticks >= maxTicks) {
        clearInterval(spinRef.current);
        const finalWinner = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
        setRollingItem(finalWinner);
        const winEntry = { ...finalWinner, prize: selectedPrize };
        setCurrentWinner(winEntry);
        setWinners((prev) => [winEntry, ...prev]);
        setIsSpinning(false);

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.55 }
          });
        } catch {
          // ignore
        }
      }
    }, 80);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-[0_25px_70px_rgba(0,0,0,0.65)] text-right max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-5 top-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>منصة السحب التفاعلي المباشر • مسرح قصر الثقافة</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
            قرعة وجوائز احتفالية «1001» طفل رقمي
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            نظام السحب العشوائي المباشر لتكريم مشاريع المبتكرين الصغار (7–14 سنة) وحاملي تذاكر الحضور
          </p>
        </div>

        {/* Pool & Prize Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1.5">
              1. فئة السحب:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setPoolType('projects'); setCurrentWinner(null); setRollingItem(null); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                  poolType === 'projects'
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                المشاريع الابتكارية
              </button>
              <button
                type="button"
                onClick={() => { setPoolType('attendees'); setCurrentWinner(null); setRollingItem(null); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                  poolType === 'attendees'
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                تذاكر جمهور القاعة
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1.5">
              2. الجائزة المخصصة للسحب:
            </label>
            <select
              value={selectedPrize}
              onChange={(e) => setSelectedPrize(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {PRIZE_TIERS.map((pr, idx) => (
                <option key={idx} value={pr}>{pr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Spinning Stage Display */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-400/50 text-center relative overflow-hidden mb-6 shadow-inner">
          {rollingItem ? (
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono text-xs font-bold">
                {rollingItem.code} • {rollingItem.badge}
              </span>
              <h4 className={`text-xl sm:text-2xl font-black font-alexandria ${currentWinner ? 'text-amber-400' : 'text-white'}`}>
                {rollingItem.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                {rollingItem.subtitle}
              </p>
              {currentWinner && (
                <div className="mt-4 pt-3 border-t border-white/10 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-400 bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/40">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>الفائز بـ: {currentWinner.prize}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 space-y-2">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
              <p className="text-sm font-bold text-slate-300">
                جاهز لبدء السحب العشوائي ({eligiblePool.length} مرشح في القائمة)
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            disabled={isSpinning || eligiblePool.length === 0}
            onClick={startDraw}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{isSpinning ? 'جاري السحب العشوائي...' : 'ابدأ السحب المباشر الآن'}</span>
          </button>

          {winners.length > 0 && (
            <button
              type="button"
              onClick={() => { setWinners([]); setCurrentWinner(null); setRollingItem(null); }}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="إعادة ضبط القائمة"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Winners Log */}
        {winners.length > 0 && (
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <h5 className="text-xs font-bold text-amber-300 mb-2">سجل الفائزين في هذه الجلسة:</h5>
            {winners.map((w, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-amber-400/30 text-xs"
              >
                <div>
                  <strong className="text-white block">{w.title}</strong>
                  <span className="text-[11px] text-amber-300">{w.prize}</span>
                </div>
                <span className="font-mono font-bold text-sky-400">{w.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
