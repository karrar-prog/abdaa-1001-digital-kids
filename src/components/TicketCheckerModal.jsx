import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  QrCode,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Camera,
  CameraOff,
  ShieldCheck
} from 'lucide-react';
import jsQR from 'jsqr';
import { EventDB } from '../lib/supabase';
import { parseOfficialVerification } from '../utils/qrVerify';
import { playSuccessChime } from '../utils/soundEffects';

export default function TicketCheckerModal({ isOpen, onClose }) {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);
  const [stats, setStats] = useState({ total: 0, attended: 0 });

  // Live Camera Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const lastScannedRef = useRef('');

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const loadTickets = useCallback(async () => {
    const list = await EventDB.getAllTickets();
    setTicketsList(list);
    const attended = list.filter((t) => t.is_attended).length;
    setStats({ total: list.length, attended });
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, loadTickets, stopCamera]);

  const executeCheckOrVerify = useCallback(
    async (rawCode, autoStopCam = false) => {
      const clean = String(rawCode || '').trim();
      if (!clean) return;

      setLoading(true);
      setVerifyResult(null);

      try {
        // 1. فحص ما إذا كان الكود يمثل وثيقة رسمية (هوية انتماء / شهادة خريج / مدرب / تذكرة)
        const parsedDoc = parseOfficialVerification(clean);
        const ticketCodeToCheck =
          parsedDoc?.type === 'ticket' && parsedDoc.code ? parsedDoc.code : clean;

        // 2. إذا كان تذكرة حضور أو كود يبدأ بـ ABD- (غير الهوية ABD-ID) نفحص جدول التذاكر لتسجيل الدخول
        if (!ticketCodeToCheck.toUpperCase().startsWith('ABD-ID-') && (!parsedDoc || parsedDoc.type === 'ticket')) {
          const res = await EventDB.verifyAndCheckIn(ticketCodeToCheck);
          if (res.found) {
            playSuccessChime();
            setVerifyResult(res);
            await loadTickets();
            if (!res.alreadyAttended) setInputCode('');
            if (autoStopCam) stopCamera();
            return;
          }
        }

        // 3. إذا كانت هوية عضوية وانتماء أو شهادة خريج أو مرشح دفعة ثانية معتمدة
        if (parsedDoc?.valid) {
          playSuccessChime();
          setVerifyResult({
            found: true,
            alreadyAttended: false,
            isOfficialDoc: true,
            doc: parsedDoc,
            message: `تم التحقق بنجاح: ${parsedDoc.typeLabel}`
          });
          setInputCode('');
          if (autoStopCam) stopCamera();
          return;
        }

        setVerifyResult({
          found: false,
          message: 'رمز التذكرة أو الهوية غير موجود في السجل.'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loadTickets, stopCamera]
  );

  const startCamera = async () => {
    setCameraError('');
    lastScannedRef.current = '';
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('متصفح الجهاز لا يدعم تشغيل الكاميرا مباشرة. يمكنك إدخال الرمز يدوياً.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play().catch(() => {});
          scanLoop();
        }
      }, 120);
    } catch {
      setCameraError('تعذر الوصول إلى الكاميرا. يرجى السماح بصلاحية الكاميرا في المتصفح.');
    }
  };

  const scanLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !streamRef.current) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (qr?.data && qr.data !== lastScannedRef.current) {
        lastScannedRef.current = qr.data;
        executeCheckOrVerify(qr.data, true);
        return;
      }
    }

    rafRef.current = requestAnimationFrame(scanLoop);
  };

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    executeCheckOrVerify(inputCode, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl text-right max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 my-auto">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-alexandria">
              بوابة الاستقبال وماسح الكاميرا الذكي (QR)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              فحص تذاكر قصر الثقافة، هويات الانتماء، وشهادات التخرج مباشرة بالكاميرا
            </p>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">
              إجمالي التذاكر
            </span>
            <strong className="text-2xl font-black text-slate-900 dark:text-white font-alexandria">
              {stats.total}
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-xs text-emerald-700 dark:text-emerald-300 block mb-0.5 font-bold">
              الحضور داخل القاعة
            </span>
            <strong className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-alexandria">
              {stats.attended}
            </strong>
          </div>
        </div>

        {/* Live Camera QR Scanner Box */}
        <div className="mb-5">
          {!cameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-l from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>تشغيل كاميرا الموبايل لمسح باركود التذكرة أو الهوية</span>
            </button>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-slate-950 border-2 border-sky-500 relative">
              <video
                ref={videoRef}
                className="w-full h-56 object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              {/* Scanning Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-44 h-44 rounded-2xl border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)] relative">
                  <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <div className="p-2.5 bg-slate-900 flex items-center justify-between text-white text-xs">
                <span className="font-bold text-amber-300">وجّه الكاميرا نحو رمز الـ QR...</span>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>إيقاف الكاميرا</span>
                </button>
              </div>
            </div>
          )}

          {cameraError && (
            <p className="text-xs font-bold text-rose-600 mt-2 text-center">{cameraError}</p>
          )}
        </div>

        {/* Manual Code Input Form */}
        <form onSubmit={handleVerify} className="mb-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            أو أدخل رقم التذكرة / رقم هوية العضوية يدوياً:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ABD-2048 أو ABD-ID-2026-0001"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 uppercase text-center font-bold"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm shadow-md transition disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {loading ? 'فحص...' : 'تحقق وتسجيل'}
            </button>
          </div>
        </form>

        {/* Result Message Box */}
        {verifyResult && (
          <div
            className={`p-4 rounded-2xl mb-5 border animate-fadeIn ${
              !verifyResult.found
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : verifyResult.alreadyAttended
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {!verifyResult.found ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : verifyResult.alreadyAttended ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : verifyResult.isOfficialDoc ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm flex-1">
                <strong className="block font-black mb-1">{verifyResult.message}</strong>
                {verifyResult.ticket && (
                  <div className="text-xs space-y-1 text-slate-700 mt-1.5">
                    <div>
                      الحاضر: <strong className="text-slate-900">{verifyResult.ticket.attendee_name}</strong>
                    </div>
                    <div>
                      الصفة: {verifyResult.ticket.guest_type} (مرافقين:{' '}
                      {verifyResult.ticket.companions_count})
                    </div>
                    {verifyResult.ticket.notes && (
                      <div className="text-sky-800 font-bold">المقعد: {verifyResult.ticket.notes}</div>
                    )}
                  </div>
                )}
                {verifyResult.doc && (
                  <div className="text-xs space-y-1 text-slate-800 mt-1.5 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                    <div>
                      الاسم المعتمد: <strong className="font-black">{verifyResult.doc.name}</strong>
                    </div>
                    <div>
                      الرقم التسلسلي:{' '}
                      <strong className="font-mono text-sky-700">{verifyResult.doc.code}</strong>
                    </div>
                    {verifyResult.doc.role && <div>الصفة: {verifyResult.doc.role}</div>}
                    {verifyResult.doc.track && <div>المسار: {verifyResult.doc.track}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Tickets Table */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-alexandria">
              آخر التذاكر المسجلة
            </h4>
            <button
              onClick={loadTickets}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث</span>
            </button>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {ticketsList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">لا توجد تذاكر مسجلة بعد.</p>
            ) : (
              ticketsList.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-800 dark:text-white block truncate">
                      {t.attendee_name}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {t.booking_code} • {t.guest_type}
                    </span>
                  </div>
                  <div className="shrink-0 mr-2">
                    {t.is_attended ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        داخل القاعة ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
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
