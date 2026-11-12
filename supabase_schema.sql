-- ========================================================
-- سكربت قاعدة بيانات Supabase المؤمّن لنادي أبدع للمهارات الذكية
-- حفل تخرج مبادرة «1001 طفل رقمي» - النجف الأشرف
-- متوافق مع معايير حماية البيانات والخصوصية (Supabase RLS Best Practices)
-- ========================================================

-- 1. جدول الحجوزات والتذاكر وتأكيد الحضور (RSVP & Tickets)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    attendee_name TEXT NOT NULL CHECK (char_length(attendee_name) BETWEEN 2 AND 120),
    phone_number TEXT NOT NULL CHECK (char_length(phone_number) BETWEEN 7 AND 25),
    guest_type TEXT NOT NULL DEFAULT 'عائلة خريج' CHECK (char_length(guest_type) <= 60),
    companions_count INT DEFAULT 1 CHECK (companions_count BETWEEN 1 AND 5),
    notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 300),
    is_attended BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(booking_code);
CREATE INDEX IF NOT EXISTS idx_tickets_phone ON tickets(phone_number);

-- 2. جدول طلبات التطوع (Volunteers)
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
    phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 25),
    email TEXT CHECK (email IS NULL OR char_length(email) <= 150),
    field_of_interest TEXT CHECK (field_of_interest IS NULL OR char_length(field_of_interest) <= 120),
    notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول طلبات الرعاية والشراكة (Sponsors)
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL CHECK (char_length(organization_name) BETWEEN 2 AND 150),
    contact_person TEXT NOT NULL CHECK (char_length(contact_person) BETWEEN 2 AND 120),
    phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 25),
    email TEXT CHECK (email IS NULL OR char_length(email) <= 150),
    sponsorship_tier TEXT CHECK (sponsorship_tier IS NULL OR char_length(sponsorship_tier) <= 80),
    notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. تفعيل حماية الصفوف الصارمة (Row Level Security - RLS)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- سياسات الإدخال العام المقيدة (تسمح للزوار بحجز التذكرة أو إرسال طلب دون كشف بيانات الآخرين)
CREATE POLICY "anon_insert_tickets"
  ON tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (is_attended = false AND checked_in_at IS NULL);

CREATE POLICY "anon_insert_volunteers"
  ON volunteers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anon_insert_sponsors"
  ON sponsors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- سياسات القراءة والتعديل والحذف مقتصرة حصرياً على حسابات الإدارة الموثقة (app_metadata.role = 'admin')
CREATE POLICY "admin_select_tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "admin_update_tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'))
  WITH CHECK (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "admin_delete_tickets"
  ON tickets FOR DELETE
  TO authenticated
  USING (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "admin_manage_volunteers"
  ON volunteers FOR ALL
  TO authenticated
  USING (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'))
  WITH CHECK (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "admin_manage_sponsors"
  ON sponsors FOR ALL
  TO authenticated
  USING (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'))
  WITH CHECK (((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));
