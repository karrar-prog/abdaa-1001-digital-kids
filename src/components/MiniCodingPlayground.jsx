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
  Zap,
  Lightbulb,
  CheckCircle2,
  ShieldAlert,
  Terminal,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickPop, playRobotBeep, playSuccessChime } from '../utils/soundEffects';

// In RTL grid, col 0 is on the RIGHT and col 4 is on the LEFT, so moving towards goal increases `c` (visually leftward in RTL)
const COMMANDS_MAP = {
  FORWARD: {
    id: 'FORWARD',
    label: 'تقدم لليسار',
    codeLabel: 'moveForward()',
    dc: 1,
    dr: 0,
    icon: ArrowLeft,
    btnStyle:
      'bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white border-sky-400/40 shadow-sky-500/20',
    slotStyle:
      'bg-sky-50 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
    badgeBg: 'bg-sky-500 text-white'
  },
  UP: {
    id: 'UP',
    label: 'اصعد للأعلى',
    codeLabel: 'moveUp()',
    dc: 0,
    dr: -1,
    icon: ArrowUp,
    btnStyle:
      'bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-indigo-400/40 shadow-indigo-500/20',
    slotStyle:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
    badgeBg: 'bg-indigo-500 text-white'
  },
  DOWN: {
    id: 'DOWN',
    label: 'انزل للأسفل',
    codeLabel: 'moveDown()',
    dc: 0,
    dr: 1,
    icon: ArrowDown,
    btnStyle:
      'bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-300/60 shadow-amber-500/20',
    slotStyle:
      'bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-500 text-slate-950'
  },
  BACK: {
    id: 'BACK',
    label: 'تراجع لليمين',
    codeLabel: 'moveBack()',
    dc: -1,
    dr: 0,
    icon: ArrowRight,
    btnStyle:
      'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white border-slate-500/40 shadow-slate-500/15',
    slotStyle:
      'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    badgeBg: 'bg-slate-600 text-white'
  }
};

const COMMANDS = [
  COMMANDS_MAP.FORWARD,
  COMMANDS_MAP.UP,
  COMMANDS_MAP.DOWN,
  COMMANDS_MAP.BACK
];

const LEVELS = [
  {
    id: 1,
    shortTitle: 'المستوى 1',
    ageTag: '7 – 9 سنوات',
    stageName: 'المستكشف الرقمي',
    title: 'مهمة المستكشف الصغير: التقط نجمة الطاقة ⭐',
    hint: 'أضف 3 أوامر (تقدم لليسار ⬅️) ليصل روبوت أبدع مباشرة إلى النجمة الذهبية!',
    optimalSteps: 3,
    solution: ['FORWARD', 'FORWARD', 'FORWARD'],
    start: { r: 1, c: 0 },
    goal: { r: 1, c: 3 },
    obstacles: [
      { r: 0, c: 1 },
      { r: 2, c: 2 }
    ]
  },
  {
    id: 2,
    shortTitle: 'المستوى 2',
    ageTag: '10 – 11 سنة',
    stageName: 'البنّاء المبتكر',
    title: 'مهمة البنّاء المبتكر: الالتفاف حول الحاجز الصخري 🧱',
    hint: 'انزل خطوتين للأسفل ⬇️ ثم تقدم 3 خطوات لليسار ⬅️ لتتجاوز الحاجز وتلتقط النجمة!',
    optimalSteps: 5,
    solution: ['DOWN', 'DOWN', 'FORWARD', 'FORWARD', 'FORWARD'],
    start: { r: 0, c: 0 },
    goal: { r: 2, c: 3 },
    obstacles: [
      { r: 0, c: 1 },
      { r: 1, c: 2 }
    ]
  },
  {
    id: 3,
    shortTitle: 'المستوى 3',
    ageTag: '12 – 14 سنة',
    stageName: 'القائد التقني',
    title: 'مهمة القائد التقني: خوارزمية المتاهة الذكية 🚀',
    hint: 'اصعد للأعلى ⬆️، تقدم خطوتين لليسار ⬅️، اصعد للأعلى ⬆️، ثم تقدم خطوتين لليسار ⬅️!',
    optimalSteps: 6,
    solution: ['UP', 'FORWARD', 'FORWARD', 'UP', 'FORWARD', 'FORWARD'],
    start: { r: 2, c: 0 },
    goal: { r: 0, c: 4 },
    obstacles: [
      { r: 2, c: 1 },
      { r: 0, c: 2 },
      { r: 1, c: 3 }
    ]
  }
];

const ROW_LABELS = ['أ', 'ب', 'ج'];
const MAX_STEPS = 8;

export default function MiniCodingPlayground({ onOpenBatch2 }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = LEVELS[levelIdx];

  const [program, setProgram] = useState([]);
  const [robotPos, setRobotPos] = useState(currentLevel.start);
  const [visitedTrail, setVisitedTrail] = useState([`${currentLevel.start.r}-${currentLevel.start.c}`]);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('idle'); // 'idle' | 'win' | 'error'
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [completedLevels, setCompletedLevels] = useState([]);

  const selectLevel = (idx) => {
    if (isRunning) return;
    playClickPop();
    const lv = LEVELS[idx];
    setLevelIdx(idx);
    setProgram([]);
    setRobotPos(lv.start);
    setVisitedTrail([`${lv.start.r}-${lv.start.c}`]);
    setIsRunning(false);
    setStatusMsg('');
    setStatusType('idle');
    setActiveStepIdx(-1);
  };

  const addBlock = (cmd) => {
    if (isRunning || program.length >= MAX_STEPS) return;
    playClickPop();
    setProgram((prev) => [...prev, cmd]);
    setStatusMsg('');
    setStatusType('idle');
  };

  const removeBlockAt = (index) => {
    if (isRunning) return;
    playClickPop();
    setProgram((prev) => prev.filter((_, i) => i !== index));
    setRobotPos(currentLevel.start);
    setVisitedTrail([`${currentLevel.start.r}-${currentLevel.start.c}`]);
    setStatusMsg('');
    setStatusType('idle');
  };

  const fillSmartHint = () => {
    if (isRunning) return;
    playClickPop();
    const solvedBlocks = currentLevel.solution.map((key) => COMMANDS_MAP[key]);
    setProgram(solvedBlocks);
    setRobotPos(currentLevel.start);
    setVisitedTrail([`${currentLevel.start.r}-${currentLevel.start.c}`]);
    setStatusType('idle');
    setStatusMsg('💡 تم تركيب الخوارزمية المقترحة! اضغط «شغّل الكود الآن» لمشاهدة الروبوت يتحرك.');
  };

  const resetPlayground = () => {
    if (isRunning) return;
    playClickPop();
    setProgram([]);
    setRobotPos(currentLevel.start);
    setVisitedTrail([`${currentLevel.start.r}-${currentLevel.start.c}`]);
    setIsRunning(false);
    setStatusMsg('');
    setStatusType('idle');
    setActiveStepIdx(-1);
  };

  const runCode = async () => {
    if (isRunning || program.length === 0) return;
    setIsRunning(true);
    setStatusMsg('🤖 جاري تنفيذ الخوارزمية خطوة بخطوة...');
    setStatusType('idle');
    setRobotPos(currentLevel.start);
    setVisitedTrail([`${currentLevel.start.r}-${currentLevel.start.c}`]);

    let curR = currentLevel.start.r;
    let curC = currentLevel.start.c;

    for (let i = 0; i < program.length; i++) {
      setActiveStepIdx(i);
      await new Promise((r) => setTimeout(r, 420));

      const step = program[i];
      const nextR = curR + step.dr;
      const nextC = curC + step.dc;

      // Check boundaries (3 rows x 5 cols)
      if (nextR < 0 || nextR > 2 || nextC < 0 || nextC > 4) {
        setStatusType('error');
        setStatusMsg('⚠️ خرج الروبوت عن حدود الحلبة! احذف الخطوة الخاطئة أو اضغط «الحل الذكي 💡».');
        setIsRunning(false);
        setActiveStepIdx(-1);
        return;
      }

      // Check obstacle collision
      const hitObstacle = currentLevel.obstacles.some((o) => o.r === nextR && o.c === nextC);
      if (hitObstacle) {
        setStatusType('error');
        setStatusMsg('🧱 اصطدم الروبوت بالحاجز الصخري! جرّب الالتفاف من مربع آخر.');
        setIsRunning(false);
        setActiveStepIdx(-1);
        return;
      }

      curR = nextR;
      curC = nextC;
      setRobotPos({ r: curR, c: curC });
      setVisitedTrail((prev) => [...prev, `${curR}-${curC}`]);
      playRobotBeep();

      // Check win
      if (curR === currentLevel.goal.r && curC === currentLevel.goal.c) {
        playSuccessChime();
        try {
          confetti({ particleCount: 85, spread: 75, origin: { y: 0.62 } });
        } catch {
          // ignore
        }
        setCompletedLevels((prev) => (prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]));
        setStatusType('win');
        setStatusMsg('🎉 أحسنت يا مبرمج المستقبل! نجحت الخوارزمية ووصل «روبوت أبدع» إلى نجمة الابتكار!');
        setIsRunning(false);
        setActiveStepIdx(-1);
        return;
      }
    }

    setStatusType('error');
    setStatusMsg('💡 توقف الروبوت قبل الوصول للنجمة! أضف خطوات إضافية أو اضغط «الحل الذكي 💡».');
    setIsRunning(false);
    setActiveStepIdx(-1);
  };

  return (
    <section
      id="coding-playground"
      className="py-20 bg-gradient-to-b from-sky-50/70 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative Ambient Glows */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-sky-100 dark:from-amber-950/80 dark:to-sky-950/80 border border-amber-300/80 dark:border-amber-700/70 text-slate-900 dark:text-amber-300 font-extrabold text-xs shadow-xs mb-3.5">
            <Code2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>استوديو البرمجة التفاعلي للأطفال (الأعمار 7 – 14 سنة) 🎮</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria tracking-tight">
            العب وبرمج <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-amber-500">«روبوت أبدع»</span> الآن! 🤖✨
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            اختر المرحلة العمرية، ركّب اللبنات البرمجية بالترتيب الصحيح، وشغّل الكود لقيادة الروبوت نحو نجمة الابتكار تماماً كما يتدرب أبطال مبادرة «1001» طفل رقمي.
          </p>
        </div>

        {/* Main Studio Container */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-sky-200/90 dark:border-slate-800 shadow-[0_24px_60px_-15px_rgba(2,132,199,0.14)] overflow-hidden">
          
          {/* Top Studio Header Bar: Window Controls + Level Selector Tabs */}
          <div className="bg-slate-900 dark:bg-slate-950 px-5 sm:px-8 py-4 border-b border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Studio Brand Title */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <div className="flex items-center gap-2 text-white font-alexandria font-extrabold text-xs sm:text-sm">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>ABDAA BLOCKS IDE v2.6</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {completedLevels.length}/3 مراحل منجزة
              </span>
            </div>

            {/* 3 Age-Group Level Selector Cards */}
            <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
              {LEVELS.map((lv, idx) => {
                const isSelected = levelIdx === idx;
                const isDone = completedLevels.includes(lv.id);
                return (
                  <button
                    key={lv.id}
                    type="button"
                    onClick={() => selectLevel(idx)}
                    className={`px-3 sm:px-4 py-2 rounded-2xl text-right transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                      isSelected
                        ? 'bg-gradient-to-l from-sky-500 to-blue-600 text-white border-sky-300 shadow-lg shadow-sky-500/25 scale-[1.02]'
                        : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] sm:text-xs font-alexandria font-black flex items-center gap-1">
                        <span>{lv.shortTitle}</span>
                        <span className="hidden sm:inline opacity-80">• {lv.stageName}</span>
                      </div>
                      <div className={`text-[10px] font-bold ${isSelected ? 'text-sky-100' : 'text-amber-400'}`}>
                        الأعمار {lv.ageTag}
                      </div>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    ) : (
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {lv.id}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mission Brief & Smart Hint Strip */}
          <div className="bg-sky-50/70 dark:bg-slate-900/90 px-5 sm:px-8 py-3.5 border-b border-sky-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                {currentLevel.id}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-alexandria">
                  {currentLevel.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{currentLevel.hint}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                العدد المثالي: <strong className="text-sky-600 dark:text-sky-400">{currentLevel.optimalSteps} خطوات</strong>
              </span>
              <button
                type="button"
                onClick={fillSmartHint}
                disabled={isRunning}
                className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/90 hover:bg-amber-200 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-black flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="تركيب الحل الذكي تلقائياً"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>الحل الذكي 💡</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Interactive Workspace */}
          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
            
            {/* RIGHT COLUMN (6 cols): Command Palette + Structured 8-Slot Code Tray + Execution Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              
              {/* Step 1: Command Blocks Palette */}
              <div className="bg-slate-50/90 dark:bg-slate-950/60 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-alexandria font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[11px] flex items-center justify-center font-black">1</span>
                    <span>اختر لبنة الأمر البرمجي لإضافتها:</span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    انقر لإضافة خطوة
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COMMANDS.map((cmd) => {
                    const IconComponent = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        disabled={isRunning || program.length >= MAX_STEPS}
                        onClick={() => addBlock(cmd)}
                        className={`p-3 rounded-2xl border font-black text-right transition-all cursor-pointer btn-playful shadow-md disabled:opacity-40 flex flex-col justify-between gap-2 ${cmd.btnStyle}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono opacity-80 bg-black/15 px-1.5 py-0.5 rounded-md">
                            +1
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-alexandria font-extrabold leading-tight">
                            {cmd.label}
                          </div>
                          <div className="text-[10px] font-mono opacity-75 mt-0.5">
                            {cmd.codeLabel}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Structured 8-Slot Visual Code Workspace */}
              <div className="bg-slate-50/90 dark:bg-slate-950/60 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-alexandria font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] flex items-center justify-center font-black">2</span>
                    <span>تسلسل الخوارزمية المركّبة ({program.length}/{MAX_STEPS} خطوات):</span>
                  </span>

                  {program.length > 0 && !isRunning && (
                    <button
                      type="button"
                      onClick={resetPlayground}
                      className="text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 px-2.5 py-1 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح الكل</span>
                    </button>
                  )}
                </div>

                {/* 8 Organized Step Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-auto">
                  {Array.from({ length: MAX_STEPS }).map((_, slotIdx) => {
                    const step = program[slotIdx];
                    const isExecuting = activeStepIdx === slotIdx;
                    const isOptimalSlot = slotIdx < currentLevel.optimalSteps;

                    if (step) {
                      const StepIcon = step.icon;
                      return (
                        <div
                          key={slotIdx}
                          className={`relative p-2.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 ${
                            isExecuting
                              ? 'ring-4 ring-amber-400 bg-amber-400 text-slate-950 border-amber-500 scale-105 shadow-lg z-10'
                              : step.slotStyle
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-lg text-[11px] font-mono font-black flex items-center justify-center shrink-0 ${
                                isExecuting ? 'bg-slate-950 text-amber-400' : step.badgeBg
                              }`}
                            >
                              {slotIdx + 1}
                            </span>
                            <div className="truncate">
                              <div className="text-xs font-extrabold truncate flex items-center gap-1">
                                <StepIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{step.label}</span>
                              </div>
                              <div className="text-[9px] font-mono opacity-70 truncate">
                                {step.codeLabel}
                              </div>
                            </div>
                          </div>

                          {!isRunning && (
                            <button
                              type="button"
                              onClick={() => removeBlockAt(slotIdx)}
                              className="w-5 h-5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 flex items-center justify-center shrink-0 cursor-pointer"
                              title="حذف هذه الخطوة"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={slotIdx}
                        className={`p-2.5 rounded-2xl border-2 border-dashed flex items-center gap-2 min-h-[54px] transition-colors ${
                          isOptimalSlot
                            ? 'border-sky-300/70 dark:border-sky-800/60 bg-white/60 dark:bg-slate-900/50'
                            : 'border-slate-200 dark:border-slate-800/50 bg-slate-100/40 dark:bg-slate-900/20 opacity-65'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {slotIdx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {isOptimalSlot ? 'خانة أمر' : 'إضافي'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Run & Control Bar */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isRunning || program.length === 0}
                    onClick={runCode}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-alexandria font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 btn-playful cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{isRunning ? 'جاري تنفيذ الكود البرمجي...' : 'شغّل الكود البرمجي الآن ▶️'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetPlayground}
                    disabled={isRunning}
                    className="py-4 px-4 sm:px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة</span>
                  </button>
                </div>

                {/* Live Feedback / Win Banner */}
                {statusMsg && (
                  <div
                    className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-extrabold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                      statusType === 'win'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 shadow-lg shadow-emerald-500/10'
                        : statusType === 'error'
                        ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200'
                        : 'bg-sky-50 dark:bg-sky-950/80 border-sky-300 dark:border-sky-800 text-sky-950 dark:text-sky-200'
                    }`}
                  >
                    <span className="leading-relaxed">{statusMsg}</span>
                    {statusType === 'win' && (
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {levelIdx < LEVELS.length - 1 && (
                          <button
                            type="button"
                            onClick={() => selectLevel(levelIdx + 1)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-sm cursor-pointer"
                          >
                            المستوى التالي ⬅️
                          </button>
                        )}
                        {onOpenBatch2 && (
                          <button
                            type="button"
                            onClick={() => onOpenBatch2(10)}
                            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <GraduationCap className="w-4 h-4" />
                            <span>سجّل بالدفعة الثانية</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* LEFT COLUMN (6 cols): High-Tech 5x3 Interactive Simulation Stage */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex-1 p-5 sm:p-6 rounded-[28px] bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 border-2 border-sky-400/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                
                {/* Subtle Tech Grid Background Pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Stage Top Telemetry Bar */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-sky-400/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-alexandria font-black text-white">
                        حلبة محاكاة «روبوت أبدع»
                      </div>
                      <div className="text-[11px] text-sky-300 font-bold">
                        الإحداثيات الحالية: صف ({ROW_LABELS[robotPos.r]}) • عمود ({robotPos.c + 1})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 ${
                        statusType === 'win'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : isRunning
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
                          : 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          statusType === 'win'
                            ? 'bg-emerald-400'
                            : isRunning
                            ? 'bg-amber-400'
                            : 'bg-sky-400'
                        }`}
                      />
                      <span>
                        {statusType === 'win'
                          ? 'تم التقاط النجمة!'
                          : isRunning
                          ? `ينفذ خطوة ${activeStepIdx + 1}...`
                          : 'جاهز للانطلاق'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Column Numbers Header (1 to 5 in RTL) */}
                <div className="relative z-10 my-auto">
                  <div className="grid grid-cols-5 gap-2.5 sm:gap-3 mb-2 px-1" dir="rtl">
                    {[1, 2, 3, 4, 5].map((colNum) => (
                      <div
                        key={colNum}
                        className="text-center text-[11px] font-mono font-bold text-sky-300/70 bg-white/5 py-1 rounded-lg border border-white/5"
                      >
                        عمود {colNum}
                      </div>
                    ))}
                  </div>

                  {/* 5x3 Interactive Grid */}
                  <div className="grid grid-cols-5 gap-2.5 sm:gap-3" dir="rtl">
                    {[0, 1, 2].map((r) =>
                      [0, 1, 2, 3, 4].map((c) => {
                        const cellKey = `${r}-${c}`;
                        const isStart = currentLevel.start.r === r && currentLevel.start.c === c;
                        const isRobot = robotPos.r === r && robotPos.c === c;
                        const isGoal = currentLevel.goal.r === r && currentLevel.goal.c === c;
                        const isObstacle = currentLevel.obstacles.some((o) => o.r === r && o.c === c);
                        const isVisited = visitedTrail.includes(cellKey);

                        return (
                          <div
                            key={cellKey}
                            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all duration-300 select-none ${
                              isRobot
                                ? 'bg-gradient-to-br from-sky-500/40 to-blue-600/40 border-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.55)] scale-[1.04] z-10'
                                : isGoal
                                ? 'bg-gradient-to-br from-amber-400/25 to-orange-500/20 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                                : isObstacle
                                ? 'bg-slate-900/95 border-rose-500/40 shadow-inner'
                                : isVisited
                                ? 'bg-emerald-500/15 border-emerald-400/40'
                                : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/15'
                            }`}
                          >
                            {/* Coordinate Watermark */}
                            <span className="absolute top-1.5 right-2 text-[9px] font-mono font-bold text-white/30">
                              {ROW_LABELS[r]}{c + 1}
                            </span>

                            {/* Start Pad Badge */}
                            {isStart && !isRobot && (
                              <span className="text-[10px] font-extrabold text-sky-300/80 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/30">
                                البداية
                              </span>
                            )}

                            {/* Visited Trail Footprint */}
                            {isVisited && !isRobot && !isStart && !isGoal && (
                              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                            )}

                            {/* Active Robot Character */}
                            {isRobot && (
                              <div className="flex flex-col items-center">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white/80 animate-bounce">
                                  <Bot className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black text-white bg-sky-600/90 px-2 py-0.5 rounded-full -mt-1.5 shadow-xs">
                                  روبوت أبدع
                                </span>
                              </div>
                            )}

                            {/* Energy Star Goal */}
                            {!isRobot && isGoal && (
                              <div className="flex flex-col items-center animate-float-slow">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 border border-amber-300/60 flex items-center justify-center">
                                  <Star className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black text-amber-300 mt-1">
                                  نجمة الابتكار
                                </span>
                              </div>
                            )}

                            {/* Obstacle Block */}
                            {isObstacle && (
                              <div className="flex flex-col items-center opacity-90">
                                <span className="text-xl sm:text-2xl leading-none">🧱</span>
                                <span className="text-[9px] font-extrabold text-rose-300/90 mt-1">
                                  حاجز صخري
                                </span>
                              </div>
                            )}

                            {/* Default Empty Dot */}
                            {!isRobot && !isGoal && !isObstacle && !isStart && !isVisited && (
                              <span className="w-2 h-2 rounded-full bg-white/15" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Stage Legend Footer */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-sky-400/20 text-[11px] font-bold text-sky-200/90">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                      <span>🤖 روبوت أبدع</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                      <span>⭐ نجمة الهدف</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                      <span>🧱 حاجز</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      <span>✨ مسار الحركة</span>
                    </span>
                  </div>

                  <span className="font-mono text-amber-300">
                    STAGE {currentLevel.id}/3
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
