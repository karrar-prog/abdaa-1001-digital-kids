-- ========================================================
-- سكربت قاعدة بيانات Supabase لنادي أبدع للمهارات الذكية
-- حفل تخرج مبادرة «1001 طفل رقمي» - النجف الأشرف
-- ========================================================

-- 1. جدول الحجوزات والتذاكر وتأكيد الحضور (RSVP & Tickets)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    attendee_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    guest_type TEXT NOT NULL DEFAULT 'عائلة خريج', -- عائلة خريج, VIP, راعي, إعلامي, زائر
    companions_count INT DEFAULT 1, -- عدد المرافقين (1 إلى 3)
    notes TEXT,
    is_attended BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرس لسرعة البحث بكود التذكرة أو الهاتف
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(booking_code);
CREATE INDEX IF NOT EXISTS idx_tickets_phone ON tickets(phone_number);

-- 2. جدول طلبات التطوع (Volunteers)
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    field_of_interest TEXT, -- استقبال وتنظيم, دعم فني وتقني, توثيق وإعلام
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول طلبات الرعاية والشراكة (Sponsors)
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    sponsorship_tier TEXT, -- رعاية ماسية, ذهبية, شريك تقني, تغطية إعلامية
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. تمكين الوصول العام للقراءة والإضافة (Row Level Security - RLS)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- سياسات تتيح للزوار تأكيد الحجز وإرسال الطلبات
CREATE POLICY "Allow public insert tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Allow public update ticket attendance" ON tickets FOR UPDATE USING (true);

CREATE POLICY "Allow public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert sponsors" ON sponsors FOR INSERT WITH CHECK (true);
