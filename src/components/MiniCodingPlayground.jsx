import React, { useState } from 'react';
import {
  Bot,
  Star,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Code2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  GraduationCap,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickPop, playRobotBeep, playSuccessChime } from '../utils/soundEffects';

const LEVELS = [
  {
    id: 1,
    badge: 'المستوى 1 • للأعمار (7 – 9 سنوات)',
    title: 'مهمة المستكشف الصغير: التقط نجمة الطاقة ⭐',
    hint: 'أضف 3 لبنات (تقدم لليسار ⬅️) ليصل روبوت أبدع إلى النجمة الذهبية!',
    start: { r: 1, c: 0 },
    goal: { r: 1, c: 3 },
    obstacles: [
      { r: 0, c: 1 },
      { r: 2, c: 2 }
    ]
  },
  {
    id: 2,
    badge: 'المستوى 2 • للأعمار (10 – 11 سنة)',
    title: 'مهمة البنّاء المبتكر: تجاوز الحاجز الصخري 🧱',
    hint: 'تحرك للأسفل ⬇️ ثم تقدم نحو اليسار ⬅️ لتتجاوز الحاجز وتلتقط النجمة!',
    start: { r: 0, c: 0 },
    goal: { r: 2, c: 3 },
    obstacles: [
      { r: 0, c: 1 },
      { r: 1, c: 2 }
    ]
  },
  {
    id: 3,
    badge: 'المستوى 3 • للأعمار (12 – 14 سنة)',
    title: 'مهمة القائد التقني: خوارزمية المتاهة الذكية 🚀',
    hint: 'خطط مسار الروبوت للأعلى واليسار بدقة للوصول إلى منصة التتويج!',
    start: { r: 2, c: 0 },
    goal: { r: 0, c: 4 },
    obstacles: [
      { r: 2, c: 1 },
      { r: 0, c: 2 },
      { r: 1, c: 3 }
    ]
  }
];

// In RTL grid, col 0 is on the RIGHT and col 4 is on the LEFT, so moving towards goal increases `c` (visually leftward in RTL)
const COMMANDS = [
  { id: 'FORWARD', label: 'تقدم للأمام ⬅️', dc: 1, dr: 0, color: 'bg-sky-500 hover:bg-sky-400 text-white', pill: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'UP', label: 'اصعد للأعلى ⬆️', dc: 0, dr: -1, color: 'bg-indigo-500 hover:bg-indigo-400 text-white', pill: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'DOWN', label: 'انزل للأسفل ⬇️', dc: 0, dr: 1, color: 'bg-amber-500 hover:bg-amber-400 text-slate-950', pill: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'BACK', label: 'تراجع للخلف ➡️', dc: -1, dr: 0, color: 'bg-slate-600 hover:bg-slate-500 text-white', pill: 'bg-slate-200 text-slate-800 border-slate-300' }
];

export default function MiniCodingPlayground({ onOpenBatch2 }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = LEVELS[levelIdx];

  const [program, setProgram] = useState([]);
  const [robotPos, setRobotPos] = useState(currentLevel.start);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('idle'); // 'idle' | 'win' | 'error'
  const [activeStepIdx, setActiveStepIdx] = useState(-1);

  const selectLevel = (idx) => {
    playClickPop();
    const lv = LEVELS[idx];
    setLevelIdx(idx);
    setProgram([]);
    setRobotPos(lv.start);
    setIsRunning(false);
    setStatusMsg('');
    setStatusType('idle');
    setActiveStepIdx(-1);
  };

  const addBlock = (cmd) => {
    if (isRunning || program.length >= 8) return;
    playClickPop();
    setProgram((prev) => [...prev, cmd]);
    setStatusMsg('');
    setStatusType('idle');
  };

  const resetPlayground = () => {
    playClickPop();
    setProgram([]);
    setRobotPos(currentLevel.start);
    setIsRunning(false);
    setStatusMsg('');
    setStatusType('idle');
    setActiveStepIdx(-1);
  };

  const runCode = async () => {
    if (isRunning || program.length === 0) return;
    setIsRunning(true);
    setStatusMsg('🤖 جاري تنفيذ الكود البرمجي خطوة بخطوة...');
    setStatusType('idle');
    setRobotPos(currentLevel.start);

    let curR = currentLevel.start.r;
    let curC = currentLevel.start.c;

    for (let i = 0; i < program.length; i++) {
      setActiveStepIdx(i);
      await new Promise((r) => setTimeout(r, 380));

      const step = program[i];
      const nextR = curR + step.dr;
      const nextC = curC + step.dc;

      // Check boundaries (3 rows x 5 cols)
      if (nextR < 0 || nextR > 2 || nextC < 0 || nextC > 4) {
        setStatusType('error');
        setStatusMsg('⚠️ خرج الروبوت عن حدود المختبر! عدّل اللبنات البرمجية وحاول مجدداً.');
        setIsRunning(false);
        setActiveStepIdx(-1);
        return;
      }

      // Check obstacle collision
      const hitObstacle = currentLevel.obstacles.some((o) => o.r === nextR && o.c === nextC);
      if (hitObstacle) {
        setStatusType('error');
        setStatusMsg('🧱 اصطدم الروبوت بالحاجز! جرّب الالتفاف من مربع آخر.');
        setIsRunning(false);
        setActiveStepIdx(-1);
        return;
      }

      curR = nextR;
      curC = nextC;
      setRobotPos({ r: curR, c: curC });
      playRobotBeep();

      // Check win
      if (curR === currentLevel.goal.r && curC === currentLevel.goal.c) {
        playSuccessChime();
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        setStatusType('win');
        setStatusMsg('🎉 أحسنت يا مبرمج المستقبل! نجح الكود ووصل روبوت أبدع إلى نجمة الابتكار!');
        setIsRunning(false);
        setActiveStepIdx(-1);
        return;
      }
    }

    setStatusType('error');
    setStatusMsg('💡 توقف الروبوت قبل الوصول للنجمة! أضف خطوات إضافية وشغّل الكود.');
    setIsRunning(false);
    setActiveStepIdx(-1);
  };

  return (
    <section
      id="coding-playground"
      className="py-16 sm:py-20 bg-gradient-to-b from-sky-50/50 via-white to-slate-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-extrabold text-xs shadow-xs mb-3">
            <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>تجربة تفاعلية حية للأطفال (7 – 14 سنة) 🎮</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria">
            العب وبرمج «روبوت أبدع» الآن! 🤖✨
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
            ركّب اللبنات البرمجية بنفسك وقد الروبوت لتجاوز الحواجز والتقاط نجمة الابتكار كما يتعلم أبطالنا في مختبرات نادي أبدع.
          </p>
        </div>

        {/* Main Playground Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 sm:p-8 border-2 border-sky-200/90 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.12)]">
          {/* Level Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {LEVELS.map((lv, idx) => (
                <button
                  key={lv.id}
                  type="button"
                  onClick={() => selectLevel(idx)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer btn-playful ${
                    levelIdx === idx
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lv.badge}
                </button>
              ))}
            </div>

            <div className="text-xs font-extrabold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800">
              💡 {currentLevel.hint}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Right Column: Controls & Code Blocks */}
            <div className="lg:col-span-6 space-y-5 text-right">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-alexandria mb-1">
                  {currentLevel.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  1. اضغط على الأزرار الملونة لإضافة الأوامر البرمجية (حتى 8 خطوات):
                </p>
              </div>

              {/* Command Palette Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COMMANDS.map((cmd) => (
                  <button
                    key={cmd.id}
                    type="button"
                    disabled={isRunning || program.length >= 8}
                    onClick={() => addBlock(cmd)}
                    className={`py-3 px-3 rounded-2xl font-black text-xs shadow-sm btn-playful cursor-pointer disabled:opacity-50 ${cmd.color}`}
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>

              {/* Visual Code Sequence Tray */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-[104px]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>شريط الأوامر البرمجية ({program.length}/8):</span>
                  </span>
                  {program.length > 0 && !isRunning && (
                    <button
                      type="button"
                      onClick={resetPlayground}
                      className="text-[11px] font-extrabold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>مسح الكود</span>
                    </button>
                  )}
                </div>

                {program.length === 0 ? (
                  <div className="text-center py-4 text-xs font-bold text-slate-400">
                    انقر على أزرار الاتجاهات أعلاه لتركيب أول لبنة برمجية 🧩
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    {program.map((step, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                          activeStepIdx === i
                            ? 'ring-4 ring-amber-400 scale-110 bg-amber-400 text-slate-950 border-amber-500'
                            : step.pill
                        }`}
                      >
                        <span className="font-mono text-[10px] opacity-70">{i + 1}.</span>
                        <span>{step.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Run & Reset Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isRunning || program.length === 0}
                  onClick={runCode}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 btn-playful cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isRunning ? 'جاري تحريك الروبوت...' : 'شغّل الكود البرمجي الآن ▶️'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetPlayground}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة</span>
                </button>
              </div>

              {/* Status & Win Banner */}
              {statusMsg && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-extrabold flex flex-wrap items-center justify-between gap-3 ${
                    statusType === 'win'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                      : statusType === 'error'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200'
                      : 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 text-sky-900 dark:text-sky-200'
                  }`}
                >
                  <span>{statusMsg}</span>
                  {statusType === 'win' && (
                    <div className="flex items-center gap-2">
                      {levelIdx < LEVELS.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => selectLevel(levelIdx + 1)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs hover:bg-emerald-500 cursor-pointer"
                        >
                          المستوى التالي ⬅️
                        </button>
                      ) : null}
                      {onOpenBatch2 && (
                        <button
                          type="button"
                          onClick={() => onOpenBatch2(10)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-xs hover:bg-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>سجّل بالدفعة الثانية!</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Left Column: 5x3 Interactive Visual Grid */}
            <div className="lg:col-span-6">
              <div className="p-4 sm:p-6 rounded-[28px] bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border-2 border-sky-400/40 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-sky-200 font-bold mb-3 px-1">
                  <span>🤖 حلبة مختبر روبوت أبدع الذكي</span>
                  <span className="font-mono text-amber-300">GRID 5×3</span>
                </div>

                <div className="grid grid-cols-5 gap-2.5 sm:gap-3" dir="rtl">
                  {[0, 1, 2].map((r) =>
                    [0, 1, 2, 3, 4].map((c) => {
                      const isRobot = robotPos.r === r && robotPos.c === c;
                      const isGoal = currentLevel.goal.r === r && currentLevel.goal.c === c;
                      const isObstacle = currentLevel.obstacles.some((o) => o.r === r && o.c === c);

                      return (
                        <div
                          key={`${r}-${c}`}
                          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all duration-300 ${
                            isRobot
                              ? 'bg-sky-500/30 border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-105'
                              : isGoal
                              ? 'bg-amber-400/20 border-amber-400/70'
                              : isObstacle
                              ? 'bg-slate-800/90 border-slate-700'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          {isRobot && (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                          )}

                          {!isRobot && isGoal && (
                            <div className="flex flex-col items-center animate-float-slow">
                              <Star className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-amber-400 drop-shadow" />
                              <span className="text-[9px] font-black text-amber-300 mt-0.5">الهدف</span>
                            </div>
                          )}

                          {isObstacle && (
                            <div className="text-center">
                              <span className="text-lg sm:text-xl">🧱</span>
                              <span className="block text-[9px] font-bold text-slate-400">حاجز</span>
                            </div>
                          )}

                          {!isRobot && !isGoal && !isObstacle && (
                            <span className="w-2 h-2 rounded-full bg-white/15" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
