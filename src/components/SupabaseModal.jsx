import React, { useState } from 'react';
import { Database, CheckCircle, Copy, ExternalLink, X, ShieldAlert, KeyRound } from 'lucide-react';
import { isSupabaseReady, saveSupabaseCredentials } from '../lib/supabase';

export default function SupabaseModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(localStorage.getItem('abdaa_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('abdaa_supabase_key') || '');
  const [copied, setCopied] = useState(false);
  const isReady = isSupabaseReady();

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (url && key) {
      saveSupabaseCredentials(url, key);
    }
  };

  const copySqlSchema = () => {
    const sqlCode = `-- سكربت قاعدة بيانات Supabase لنادي أبدع
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    attendee_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    guest_type TEXT NOT NULL DEFAULT 'عائلة خريج',
    companions_count INT DEFAULT 1,
    notes TEXT,
    is_attended BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    field_of_interest TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    sponsorship_tier TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Allow public update tickets" ON tickets FOR UPDATE USING (true);
CREATE POLICY "Allow public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert sponsors" ON sponsors FOR INSERT WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-brand-500/30 rounded-2xl p-6 md:p-8 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute left-6 top-6 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-alexandria">إعداد قاعدة بيانات Supabase (سوبا بيس)</h3>
            <p className="text-sm text-slate-400">تخزين الحجوزات والتذاكر وقوائم المتطوعين والرعاة سحابياً</p>
          </div>
        </div>

        {/* Free Tier Notice */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-200">
            <strong className="block font-semibold mb-1">هل يحتاج Supabase إلى مال؟</strong>
            <span>لا أبداً! خطة Supabase المجانية (Free Tier) تكفي لـ 50,000 مستخدم نشط شهرياً و 500 ميغابايت قاعدة بيانات، وهي مجانية بالكامل مدى الحياة ومناسبة جداً لتنظيم الفعالية بدون دفع أي فلس.</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <div>
              <span className="font-semibold text-white block">حالة الاتصال الحالية:</span>
              <span className="text-xs text-slate-400">
                {isReady 
                  ? 'متصل بنجاح مع خادم Supabase السحابي ⚡' 
                  : 'يعمل بالنظام المحلي الاحتياطي الذكي (الحجوزات والتذاكر والـ QR تعمل ومحفوظة حالياً)'}
              </span>
            </div>
          </div>
          <a 
            href="https://supabase.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/30"
          >
            فتح Supabase.com <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step 1: SQL Schema */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            1. كود إنشاء الجداول (انسخه والصقه في نافذة SQL Editor في Supabase بضغطة زر):
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={copySqlSchema}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm font-medium text-brand-300 hover:text-white transition"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'تم نسخ كود SQL بنجاح!' : 'نسخ كود الجداول (SQL Schema)'}
            </button>
          </div>
        </div>

        {/* Step 2: Keys Input */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="text-sm font-semibold text-slate-300">
            2. ضع روابط مشروعك من Supabase (Project Settings → API):
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">رابط المشروع (Project URL):</label>
            <input 
              type="url" 
              placeholder="https://xyzcompany.supabase.co" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 text-left dir-ltr"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">المفتاح العام (anon public key):</label>
            <input 
              type="text" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 text-left dir-ltr"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-accent-teal hover:from-brand-500 hover:to-accent-cyan text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition"
            >
              حفظ وربط قاعدة البيانات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
