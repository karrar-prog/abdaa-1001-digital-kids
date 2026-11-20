-- ============================================================================
-- سكربت قاعدة بيانات Supabase السحابية الكاملة لنادي أبدع للمهارات الذكية
-- احتفالية تخرج مبادرة «1001 طفل رقمي» — النجف الأشرف
-- يغطي: التذاكر، المتطوعين، الرعاة، الدفعة الثانية، الـ CMS السحابي،
-- جدار الفخر، تقييمات التحكيم، الهويات الرسمية، والمستخدمين والصلاحيات.
-- ============================================================================

-- 1. جدول الحجوزات والتذاكر وتأكيد الحضور
CREATE TABLE IF NOT EXISTS public.abdaa_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  attendee_name TEXT NOT NULL CHECK (char_length(attendee_name) BETWEEN 2 AND 120),
  phone_number TEXT NOT NULL CHECK (char_length(phone_number) BETWEEN 7 AND 25),
  guest_type TEXT NOT NULL DEFAULT 'عائلة خريج',
  companions_count INT NOT NULL DEFAULT 1 CHECK (companions_count BETWEEN 1 AND 5),
  notes TEXT,
  is_attended BOOLEAN NOT NULL DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. جدول المتطوعين
CREATE TABLE IF NOT EXISTS public.abdaa_volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_code VARCHAR(30) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INT,
  academic_status TEXT,
  committee TEXT NOT NULL,
  availability TEXT,
  tshirt_size VARCHAR(10),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'قيد المراجعة والاعتماد',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. جدول طلبات الرعاية والشراكة
CREATE TABLE IF NOT EXISTS public.abdaa_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  sponsorship_tier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. جدول مسجلي الدفعة الثانية (6 – 14 سنة)
CREATE TABLE IF NOT EXISTS public.abdaa_batch2_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_code VARCHAR(30) UNIQUE NOT NULL,
  child_name TEXT NOT NULL,
  age INT NOT NULL,
  age_stage TEXT NOT NULL,
  school_name TEXT,
  preferred_track TEXT NOT NULL,
  priority_category TEXT,
  parent_name TEXT,
  parent_phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. جدول إدارة محتوى الموقع السحابي (Cloud CMS: main & mentors)
CREATE TABLE IF NOT EXISTS public.abdaa_site_cms (
  key TEXT PRIMARY KEY CHECK (key IN ('main', 'mentors')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. جدول رسائل جدار الفخر والتهاني
CREATE TABLE IF NOT EXISTS public.abdaa_pride_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL CHECK (char_length(sender_name) BETWEEN 2 AND 120),
  relation TEXT NOT NULL DEFAULT 'ولي أمر / عائلة خريج',
  child_name TEXT NOT NULL DEFAULT 'أبطال مبادرة 1001 طفل رقمي',
  badge TEXT NOT NULL DEFAULT '🎓 فخر العائلة',
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 2 AND 1000),
  likes INT NOT NULL DEFAULT 1 CHECK (likes >= 0),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. جدول تقييمات لجنة التحكيم العلمية
CREATE TABLE IF NOT EXISTS public.abdaa_project_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT NOT NULL,
  project_title TEXT NOT NULL,
  age_group TEXT NOT NULL DEFAULT '6–14 سنة',
  judge_name TEXT NOT NULL,
  judge_role TEXT NOT NULL DEFAULT 'لجنة التحكيم العلمية',
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score INT NOT NULL CHECK (total_score BETWEEN 0 AND 100),
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_code, judge_name)
);

-- 8. جدول أرشيف هويات العضوية والانتماء الصادرة (للوحة الإدارة فقط عبر RPC)
CREATE TABLE IF NOT EXISTS public.abdaa_issued_id_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role_title TEXT,
  track TEXT,
  age_stage TEXT,
  blood_type TEXT,
  phone TEXT,
  city_or_school TEXT,
  issue_date TEXT,
  expiry_date TEXT,
  badge_color TEXT DEFAULT '#0284c7',
  photo_data_url TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. جدول حسابات الإدارة واللجان التنظيمية (مشفر SHA-256، عبر RPC فقط)
CREATE TABLE IF NOT EXISTS public.abdaa_admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'reception', 'media_cms', 'judging')),
  role_label TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- تفعيل حماية RLS على جميع الجداول
ALTER TABLE public.abdaa_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_batch2_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_site_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_pride_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_project_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_issued_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abdaa_admin_users ENABLE ROW LEVEL SECURITY;

-- ملاحظة: دوال الـ RPC المطبقة سحابياً في مشروع Supabase تشمل:
-- abdaa_authenticate_user, abdaa_verify_admin, abdaa_admin_fetch_all,
-- abdaa_admin_save_cms, abdaa_admin_reset_cms, abdaa_admin_save_users,
-- abdaa_admin_upsert_id_card, abdaa_save_evaluation, abdaa_like_pride_message,
-- abdaa_admin_toggle_ticket, abdaa_admin_delete_record, abdaa_admin_archive_record,
-- abdaa_checkin_ticket, abdaa_get_reserved_seat_notes.
