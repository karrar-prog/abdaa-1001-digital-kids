import { createClient } from '@supabase/supabase-js';

// قراءة بيانات Supabase من متغيرات البيئة أو من إعدادات المتصفح المحلية
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('abdaa_supabase_url');
  const localKey = localStorage.getItem('abdaa_supabase_key');

  const supabaseUrl = localUrl || envUrl;
  const supabaseKey = localKey || envKey;

  const isConfigured = Boolean(supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co'));

  return { supabaseUrl, supabaseKey, isConfigured };
};

const config = getSupabaseConfig();

export const supabase = config.isConfigured 
  ? createClient(config.supabaseUrl, config.supabaseKey)
  : null;

export const isSupabaseReady = () => {
  const { isConfigured } = getSupabaseConfig();
  return isConfigured;
};

export const saveSupabaseCredentials = (url, key) => {
  if (url && key) {
    localStorage.setItem('abdaa_supabase_url', url.trim());
    localStorage.setItem('abdaa_supabase_key', key.trim());
    window.location.reload();
  }
};

// ========================================================
// طبقة البيانات الموحدة (تعمل مع Supabase أو مع التخزين المحلي كنسخة احتياطية)
// ========================================================

const LOCAL_STORAGE_KEY_TICKETS = 'abdaa_event_tickets';
const LOCAL_STORAGE_KEY_VOLUNTEERS = 'abdaa_event_volunteers';
const LOCAL_STORAGE_KEY_SPONSORS = 'abdaa_event_sponsors';

// تهيئة تذاكر افتراضية لتسهيل التجربة
const initLocalData = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS)) {
    const demoTickets = [
      {
        id: '1',
        booking_code: 'ABD-1001-DEMO',
        attendee_name: 'عائلة فراس نزار كريم',
        phone_number: '07810746655',
        guest_type: 'عائلة خريج (VIP)',
        companions_count: 2,
        is_attended: false,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(demoTickets));
  }
};

initLocalData();

export const EventDB = {
  // 1. إنشاء تذكرة جديدة
  async createTicket(ticketData) {
    const newTicket = {
      booking_code: `ABD-${Math.floor(1000 + Math.random() * 9000)}`,
      attendee_name: ticketData.name,
      phone_number: ticketData.phone,
      guest_type: ticketData.guestType || 'عائلة خريج',
      companions_count: parseInt(ticketData.companions || 1, 10),
      notes: ticketData.notes || '',
      is_attended: false,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .insert([newTicket])
          .select()
          .single();

        if (error) throw error;
        return { success: true, ticket: data, source: 'supabase' };
      } catch (err) {
        console.warn('Supabase insert failed, saving locally:', err.message);
      }
    }

    // حفظ محلي في حال عدم ربط Supabase بعد
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    local.push(newTicket);
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(local));
    return { success: true, ticket: newTicket, source: 'local' };
  },

  // 2. البحث عن تذكرة وتأكيد الدخول (Check-in Scanner)
  async verifyAndCheckIn(code) {
    const cleanCode = code.trim().toUpperCase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('booking_code', cleanCode)
          .single();

        if (error || !data) return { found: false, message: 'رمز التذكرة غير موجود' };

        if (data.is_attended) {
          return { found: true, alreadyAttended: true, ticket: data, message: 'هذه التذكرة تم مسحها وتسجيل دخولها مسبقاً!' };
        }

        // تحديث الحضور
        const { data: updated, error: updateErr } = await supabase
          .from('tickets')
          .update({ is_attended: true, checked_in_at: new Date().toISOString() })
          .eq('booking_code', cleanCode)
          .select()
          .single();

        if (updateErr) throw updateErr;

        return { found: true, alreadyAttended: false, ticket: updated, message: 'تم تأكيد الدخول بنجاح! مرحباً بكم في الحفل.' };
      } catch (err) {
        console.warn('Supabase checkin error, trying local:', err);
      }
    }

    // فحص في التخزين المحلي
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    const index = local.findIndex(t => t.booking_code.toUpperCase() === cleanCode);

    if (index === -1) {
      return { found: false, message: 'رمز التذكرة غير موجود في السجل.' };
    }

    const t = local[index];
    if (t.is_attended) {
      return { found: true, alreadyAttended: true, ticket: t, message: 'هذه التذكرة تم تسجيل دخولها مسبقاً!' };
    }

    local[index].is_attended = true;
    local[index].checked_in_at = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(local));

    return { found: true, alreadyAttended: false, ticket: local[index], message: 'تم تأكيد الدخول بنجاح! مرحباً بكم في قصر الثقافة.' };
  },

  // 3. جلب كل التذاكر للإحصائيات والمنظمين
  async getAllTickets() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Failed fetching tickets from supabase:', e);
      }
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
  },

  // 4. إرسال طلب تطوع
  async submitVolunteer(data) {
    if (supabase) {
      try {
        const { error } = await supabase.from('volunteers').insert([data]);
        if (!error) return { success: true };
      } catch (e) {
        console.warn('Volunteer submit error:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
    local.push({ ...data, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY_VOLUNTEERS, JSON.stringify(local));
    return { success: true };
  },

  // 5. إرسال طلب رعاية
  async submitSponsor(data) {
    if (supabase) {
      try {
        const { error } = await supabase.from('sponsors').insert([data]);
        if (!error) return { success: true };
      } catch (e) {
        console.warn('Sponsor submit error:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
    local.push({ ...data, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY_SPONSORS, JSON.stringify(local));
    return { success: true };
  }
};
