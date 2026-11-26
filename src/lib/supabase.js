import { createClient } from '@supabase/supabase-js';
import { sanitizeBloodType } from '../utils/print/printHelpers';

// إعدادات الاتصال السحابي الموحدة بقاعدة بيانات Supabase الرسمية للمشروع (محمية بالكامل بسياسات RLS)
const DEFAULT_CLOUD_SUPABASE_URL = 'https://ejhrptziicpalcwtwado.supabase.co';
const DEFAULT_CLOUD_PUBLISHABLE_KEY = 'sb_publishable_kcUNAQCbAtYPuLlVvlbE4Q_DTTX_Q73';

const ADMIN_SESSION_STORAGE_KEY = 'abdaa_admin_session_v1';
const ADMIN_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 أيام افتراضياً

let activeAdminRpcSecret = '';
export function setActiveAdminRpcSecret(secret) {
  activeAdminRpcSecret = String(secret || '').trim();
}
export function hasActiveAdminRpcSecret() {
  return Boolean(activeAdminRpcSecret);
}

function encodeSessionSecret(secret) {
  try {
    const raw = String(secret || '');
    return btoa(unescape(encodeURIComponent(raw))).split('').reverse().join('');
  } catch {
    return '';
  }
}

function decodeSessionSecret(token) {
  try {
    if (!token) return '';
    return decodeURIComponent(escape(atob(String(token).split('').reverse().join(''))));
  } catch {
    return '';
  }
}

export function savePersistedAdminSession(user, rpcSecret, rememberDevice = true) {
  if (typeof window === 'undefined' || !user) return;
  try {
    const { password: _p, passwordHash: _h, ...safeUser } = user;
    const payload = JSON.stringify({
      user: safeUser,
      token: encodeSessionSecret(rpcSecret),
      savedAt: Date.now(),
      expiresAt: Date.now() + ADMIN_SESSION_TTL_MS
    });
    if (rememberDevice) {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, payload);
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, payload);
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore storage quota errors
  }
}

export function loadPersistedAdminSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) ||
      sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.user || (parsed.expiresAt && Date.now() > parsed.expiresAt)) {
      clearPersistedAdminSession();
      return null;
    }
    const secret = decodeSessionSecret(parsed.token);
    if (secret) {
      activeAdminRpcSecret = secret;
    }
    return { user: parsed.user, hasSecret: Boolean(secret) };
  } catch {
    return null;
  }
}

export function updatePersistedAdminUser(updatedUser) {
  if (typeof window === 'undefined' || !updatedUser) return;
  try {
    const { password: _p, passwordHash: _h, ...safeUser } = updatedUser;
    const localRaw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify({ ...parsed, user: safeUser }));
      return;
    }
    const sessRaw = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (sessRaw) {
      const parsed = JSON.parse(sessRaw);
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify({ ...parsed, user: safeUser }));
    }
  } catch {
    // ignore storage errors
  }
}

export function clearPersistedAdminSession() {
  activeAdminRpcSecret = '';
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    sessionStorage.removeItem('abdaa_admin_last_tab');
  } catch {
    // ignore
  }
}

// قراءة بيانات Supabase من متغيرات البيئة أو السحابة الافتراضية المعتمدة
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('abdaa_supabase_url') : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('abdaa_supabase_key') : '';

  const supabaseUrl = localUrl || envUrl || DEFAULT_CLOUD_SUPABASE_URL;
  const supabaseKey = localKey || envKey || DEFAULT_CLOUD_PUBLISHABLE_KEY;

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
// طبقة البيانات السحابية الموحدة (Supabase Cloud + نسخة محلية فورية)
// ========================================================

const LOCAL_STORAGE_KEY_TICKETS = 'abdaa_event_tickets';
const LOCAL_STORAGE_KEY_VOLUNTEERS = 'abdaa_event_volunteers';
const LOCAL_STORAGE_KEY_SPONSORS = 'abdaa_event_sponsors';
const LOCAL_STORAGE_KEY_BATCH2 = 'abdaa_batch2_applicants';
const LOCAL_STORAGE_KEY_EVALUATIONS = 'abdaa_project_evaluations';
const LOCAL_STORAGE_KEY_PRIDE = 'abdaa_pride_wall';
const LOCAL_STORAGE_KEY_ID_CARDS = 'abdaa_issued_id_cards_v1';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapCloudPrideRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    senderName: row.sender_name ?? row.senderName ?? '',
    relation: row.relation ?? 'ولي أمر / عائلة خريج',
    childName: row.child_name ?? row.childName ?? 'أبطال مبادرة 1001 طفل رقمي',
    badge: row.badge ?? '🎓 فخر العائلة',
    message: row.message ?? '',
    likes: Number(row.likes ?? 1),
    created_at: row.created_at ?? new Date().toISOString()
  };
}

function mapCloudEvalRow(row) {
  if (!row) return null;
  const code = String(row.project_code || row.projectCode || 'ABD-PRJ-01');
  const title = row.project_title || row.projectTitle || code;
  const ageGroup = row.age_group || row.ageGroup || '6–14 سنة';
  const judgeName = row.judge_name || row.judgeName || 'محكم علمي';
  const judgeRole = row.judge_role || row.judgeRole || 'لجنة التحكيم العلمية';
  const totalScore = Number(row.total_score ?? row.totalScore ?? 0);
  return {
    id: row.id || `eval-${code}-${judgeName}`,
    project_code: code,
    projectCode: code,
    project_title: title,
    projectTitle: title,
    age_group: ageGroup,
    ageGroup,
    judge_name: judgeName,
    judgeName,
    judge_role: judgeRole,
    judgeRole,
    criteria: row.criteria || {},
    total_score: totalScore,
    totalScore,
    notes: row.notes || '',
    evaluated_at: row.evaluated_at || row.evaluatedAt || new Date().toISOString()
  };
}

function mapCloudIdCardRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    membershipId: row.membership_id ?? row.membershipId ?? '',
    fullName: row.full_name ?? row.fullName ?? '',
    roleTitle: row.role_title ?? row.roleTitle ?? '',
    track: row.track ?? '',
    ageStage: row.age_stage ?? row.ageStage ?? '',
    bloodType: sanitizeBloodType(row.blood_type ?? row.bloodType ?? ''),
    phone: row.phone ?? '',
    cityOrSchool: row.city_or_school ?? row.cityOrSchool ?? '',
    issueDate: row.issue_date ?? row.issueDate ?? '',
    expiryDate: row.expiry_date ?? row.expiryDate ?? '',
    badgeColor: row.badge_color ?? row.badgeColor ?? '#0284c7',
    photoDataUrl: row.photo_data_url ?? row.photoDataUrl ?? '',
    issuedAt: row.issued_at
      ? new Date(row.issued_at).toLocaleDateString('ar-IQ')
      : row.issuedAt || ''
  };
}

// تهيئة بيانات افتراضية محلية للعمل دون اتصال
const initLocalData = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS)) {
    const demoTickets = [
      {
        id: '1',
        booking_code: 'ABD-1001-DEMO',
        attendee_name: 'عائلة فراس نزار كريم',
        phone_number: '07810746655',
        guest_type: 'عائلة طفل متخرج',
        companions_count: 2,
        notes: 'بلوك B • مقعد B-4 — ولي أمر الخريجين رضا ومريم ومحمد',
        is_attended: true,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(demoTickets));
  }

  if (!localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE)) {
    const demoPride = [
      {
        id: 'pw-1',
        senderName: 'عائلة فراس نزار كريم',
        relation: 'ولي أمر الخريجين (رضا ومريم ومحمد)',
        childName: 'رضا ومريم ومحمد فراس نزار كريم',
        badge: '🎓 فخر العائلة',
        message: 'فخورون جداً برؤية أبنائنا الثلاثة يتخرجون في الدفعة الأولى لمبادرة 1001 طفل رقمي ويبتكرون مشاريع ذكية تخدم النجف الأشرف والعراق. شكراً لنادي أبدع وشركة المصدر!',
        likes: 28,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(demoPride));
  }
};

initLocalData();

export const EventDB = {
  // 0. تسجيل الدخول السحابي الموثق عبر Supabase RPC
  async authenticateUserCloud(username, password) {
    if (!supabase) return { available: false, ok: false, user: null };
    try {
      const { data, error } = await supabase.rpc('abdaa_authenticate_user', {
        p_username: username,
        p_password: password
      });
      if (error) {
        console.warn('Cloud auth RPC fallback:', error.message);
        return { available: false, ok: false, user: null };
      }
      if (data && typeof data === 'object') {
        return {
          available: true,
          ok: Boolean(data.ok),
          user: data.user || null
        };
      }
      return { available: true, ok: false, user: null };
    } catch (e) {
      console.warn('Cloud auth network fallback:', e);
      return { available: false, ok: false, user: null };
    }
  },

  // 0-ب. جلب محتوى الموقع العام (Cloud CMS) لجميع الزوار عند فتح الموقع
  async fetchPublicCMS() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('abdaa_site_cms')
        .select('key, payload, updated_at, updated_by');
      if (error || !Array.isArray(data)) return null;
      const result = { main: null, mentors: null, updatedAt: null };
      data.forEach((row) => {
        if (row.key === 'main' && row.payload && typeof row.payload === 'object' && Object.keys(row.payload).length > 0) {
          result.main = {
            ...row.payload,
            updatedAt: row.payload.updatedAt || row.updated_at || null
          };
          result.updatedAt = row.updated_at;
        }
        if (row.key === 'mentors') {
          if (Array.isArray(row.payload) && row.payload.length > 0) {
            result.mentors = row.payload;
          } else if (row.payload && Array.isArray(row.payload.items) && row.payload.items.length > 0) {
            result.mentors = row.payload.items;
          }
        }
      });
      return result;
    } catch (e) {
      console.warn('Public CMS fetch warning:', e);
      return null;
    }
  },

  // 0-ج. حفظ محتوى الـ CMS سحابياً عبر RPC موثق
  async saveCloudCMS(key, payload, updatedBy = '') {
    if (!supabase || !activeAdminRpcSecret) {
      return { ok: false, source: 'local' };
    }
    try {
      const normalizedPayload =
        key === 'mentors' && Array.isArray(payload) ? { items: payload } : payload;
      const { data, error } = await supabase.rpc('abdaa_admin_save_cms', {
        p_secret: activeAdminRpcSecret,
        p_key: key,
        p_payload: normalizedPayload,
        p_updated_by: updatedBy || null
      });
      if (error) throw error;
      return { ok: true, source: 'supabase', data };
    } catch (e) {
      console.warn('Cloud CMS save error:', e);
      return { ok: false, source: 'local', error: e?.message };
    }
  },

  async resetCloudCMS() {
    if (!supabase || !activeAdminRpcSecret) {
      return { ok: false, source: 'local' };
    }
    try {
      const { error } = await supabase.rpc('abdaa_admin_reset_cms', {
        p_secret: activeAdminRpcSecret
      });
      if (error) throw error;
      return { ok: true, source: 'supabase' };
    } catch (e) {
      console.warn('Cloud CMS reset error:', e);
      return { ok: false, source: 'local', error: e?.message };
    }
  },

  // 0-د. حفظ قائمة المستخدمين والصلاحيات سحابياً (للمدير العام فقط)
  async saveAdminUsersCloud(usersList) {
    if (!supabase || !activeAdminRpcSecret) {
      return { ok: false, source: 'local', users: usersList };
    }
    try {
      const { data, error } = await supabase.rpc('abdaa_admin_save_users', {
        p_secret: activeAdminRpcSecret,
        p_users: usersList
      });
      if (error) throw error;
      return {
        ok: true,
        source: 'supabase',
        users: Array.isArray(data) ? data : usersList
      };
    } catch (e) {
      console.warn('Cloud users save error:', e);
      return { ok: false, source: 'local', error: e?.message, users: usersList };
    }
  },

  // 0-هـ. جلب كامل بيانات لوحة التحكم في طلب سحابي واحد موحد
  async loadFullAdminWorkspace() {
    const cloud = await this.fetchAdminCloudSnapshot();
    const localTickets = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    const localBatch2 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
    const localVolunteers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
    const localSponsors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
    const localIdCards = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ID_CARDS) || '[]').map((card) => ({
      ...card,
      bloodType: sanitizeBloodType(card?.bloodType)
    }));

    if (cloud && typeof cloud === 'object') {
      const tickets = Array.isArray(cloud.tickets) ? cloud.tickets : localTickets;
      const batch2 = Array.isArray(cloud.batch2) ? cloud.batch2 : localBatch2;
      const volunteers = Array.isArray(cloud.volunteers) ? cloud.volunteers : localVolunteers;
      const sponsors = Array.isArray(cloud.sponsors) ? cloud.sponsors : localSponsors;
      const evaluations = Array.isArray(cloud.evaluations)
        ? cloud.evaluations.map(mapCloudEvalRow).filter(Boolean)
        : [];
      const pride = Array.isArray(cloud.pride)
        ? cloud.pride.map(mapCloudPrideRow).filter(Boolean)
        : [];
      const idCards = Array.isArray(cloud.id_cards)
        ? cloud.id_cards.map(mapCloudIdCardRow).filter(Boolean)
        : localIdCards;
      const users = Array.isArray(cloud.users) ? cloud.users : [];
      const cms = cloud.cms && typeof cloud.cms === 'object' ? cloud.cms : {};

      // تحديث الكاش المحلي بالنسخة السحابية الأحدث
      localStorage.setItem(LOCAL_STORAGE_KEY_EVALUATIONS, JSON.stringify(evaluations));
      localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(pride));
      localStorage.setItem(LOCAL_STORAGE_KEY_ID_CARDS, JSON.stringify(idCards));

      return {
        cloudConnected: true,
        currentUser: cloud.currentUser || null,
        tickets,
        batch2,
        volunteers,
        sponsors,
        evaluations,
        pride,
        idCards,
        users,
        cms
      };
    }

    const [evaluations, pride] = await Promise.all([
      this.getAllProjectEvaluations(),
      this.getPrideMessages()
    ]);

    return {
      cloudConnected: false,
      currentUser: null,
      tickets: localTickets,
      batch2: localBatch2,
      volunteers: localVolunteers,
      sponsors: localSponsors,
      evaluations,
      pride,
      idCards: localIdCards,
      users: [],
      cms: {}
    };
  },

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

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    local.unshift({ ...newTicket, id: `loc-${Date.now()}` });
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(local));

    if (supabase) {
      try {
        const { error } = await supabase.from('abdaa_tickets').insert([newTicket]);
        if (error) throw error;
        return { success: true, ticket: newTicket, source: 'supabase' };
      } catch (err) {
        console.warn('Supabase insert fallback to local:', err.message);
      }
    }

    return { success: true, ticket: newTicket, source: 'local' };
  },

  // 1-ب. جلب المقاعد المحجوزة فعلياً لمنع تكرار حجز نفس المقعد في القاعة
  async getReservedSeatsMap() {
    const map = { A: [], B: [], C: [], D: [] };
    const extractSeatFromNotes = (notesStr) => {
      if (!notesStr) return;
      const match = String(notesStr).match(/بلوك\s*([A-D])\s*•\s*مقعد\s*([A-E]-[1-8])/i);
      if (match) {
        const blockCode = match[1].toUpperCase();
        const seatCode = match[2].toUpperCase();
        if (map[blockCode] && !map[blockCode].includes(seatCode)) {
          map[blockCode].push(seatCode);
        }
      }
    };

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    local.forEach((t) => extractSeatFromNotes(t?.notes));

    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('abdaa_get_reserved_seat_notes');
        if (!error && Array.isArray(data)) {
          data.forEach((row) => extractSeatFromNotes(typeof row === 'string' ? row : row?.notes));
        }
      } catch {
        // fallback to local reserved seats
      }
    }

    return map;
  },

  // 2. البحث عن تذكرة وتأكيد الدخول
  async verifyAndCheckIn(code) {
    const cleanCode = code.trim().toUpperCase();

    if (supabase) {
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('abdaa_checkin_ticket', {
          p_code: cleanCode
        });
        if (!rpcErr && rpcRes && typeof rpcRes === 'object' && rpcRes.found) {
          return {
            found: true,
            alreadyAttended: Boolean(rpcRes.alreadyAttended),
            ticket: rpcRes.ticket,
            message: rpcRes.alreadyAttended
              ? 'هذه التذكرة تم مسحها وتسجيل دخولها مسبقاً!'
              : 'تم تأكيد الدخول بنجاح! مرحباً بكم في قصر الثقافة.'
          };
        }
      } catch (err) {
        console.warn('Supabase RPC checkin fallback:', err);
      }
    }

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    const index = local.findIndex((t) => t.booking_code.toUpperCase() === cleanCode);

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

    return {
      found: true,
      alreadyAttended: false,
      ticket: local[index],
      message: 'تم تأكيد الدخول بنجاح! مرحباً بكم في قصر الثقافة.'
    };
  },

  // 3. جلب البيانات المركزية السحابية للإدارة عبر دالة RPC المؤمنة
  async fetchAdminCloudSnapshot() {
    if (!supabase || !activeAdminRpcSecret) return null;
    try {
      const { data, error } = await supabase.rpc('abdaa_admin_fetch_all', {
        p_secret: activeAdminRpcSecret
      });
      if (!error && data && typeof data === 'object') {
        return data;
      }
    } catch (e) {
      console.warn('Admin cloud fetch warning:', e);
    }
    return null;
  },

  async getAllTickets() {
    const cloud = await this.fetchAdminCloudSnapshot();
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    if (cloud && Array.isArray(cloud.tickets)) {
      return cloud.tickets;
    }
    return local;
  },

  // 4. متطوع جديد
  async submitVolunteer(data) {
    const volunteerCode = data.volunteer_code || `ABD-VOL-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedAge = data.age ? Math.min(70, Math.max(15, parseInt(data.age, 10) || 22)) : null;
    const cloudRow = {
      volunteer_code: volunteerCode,
      full_name: String(data.full_name || '').trim(),
      phone: String(data.phone || '').trim(),
      age: parsedAge,
      academic_status: String(data.academic_status || '').trim() || 'متطوع مجتمعي',
      committee: String(data.committee || data.field_of_interest || 'استقبال وتنظيم الحضور').trim(),
      availability: String(data.availability || 'متفرغ يوم الحفل والبروفة التحضيرية').trim(),
      tshirt_size: String(data.tshirt_size || 'L').trim(),
      notes: String(data.notes || '').trim()
    };

    const localRecord = {
      ...cloudRow,
      field_of_interest: cloudRow.committee,
      id: `vol-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('abdaa_volunteers').insert([cloudRow]);
        if (error) {
          if (error.code === '42501') {
            return {
              success: false,
              closed: true,
              error: 'تم إغلاق استمارة تسجيل المتطوعين لاكتمال العدد المطلوب.'
            };
          }
          throw error;
        }
        const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
        local.unshift(localRecord);
        localStorage.setItem(LOCAL_STORAGE_KEY_VOLUNTEERS, JSON.stringify(local));
        return { success: true, volunteer: localRecord, source: 'supabase' };
      } catch (e) {
        console.warn('Volunteer cloud submit fallback:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
    local.unshift(localRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY_VOLUNTEERS, JSON.stringify(local));
    return { success: true, volunteer: localRecord, source: 'local' };
  },

  async getAllVolunteers() {
    const cloud = await this.fetchAdminCloudSnapshot();
    if (cloud && Array.isArray(cloud.volunteers)) {
      return cloud.volunteers;
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
  },

  // 5. طلب رعاية
  async submitSponsor(data) {
    const cloudRow = {
      organization_name: String(data.organization_name || '').trim(),
      contact_person: String(data.contact_person || '').trim(),
      phone: String(data.phone || '').trim(),
      email: String(data.email || '').trim() || null,
      sponsorship_tier: String(data.sponsorship_tier || 'شريك راعٍ وداعم').trim(),
      notes: String(data.notes || '').trim() || null
    };

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
    local.unshift({ ...cloudRow, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY_SPONSORS, JSON.stringify(local));

    if (supabase) {
      try {
        const { error } = await supabase.from('abdaa_sponsors').insert([cloudRow]);
        if (!error) return { success: true, source: 'supabase' };
      } catch (e) {
        console.warn('Sponsor submit error:', e);
      }
    }
    return { success: true, source: 'local' };
  },

  async getAllSponsors() {
    const cloud = await this.fetchAdminCloudSnapshot();
    if (cloud && Array.isArray(cloud.sponsors)) {
      return cloud.sponsors;
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
  },

  // 6. تسجيل طفل جديد في الدفعة الثانية
  async submitBatch2Student(form) {
    const rawAge = form.childAge ?? form.age ?? 10;
    const ageNum = Math.min(14, Math.max(6, parseInt(rawAge, 10) || 10));
    const ageStage =
      ageNum <= 9
        ? 'مرحلة المستكشف الرقمي (6 – 9 سنوات)'
        : ageNum <= 11
        ? 'مرحلة البنّاء المبتكر (10 – 11 سنة)'
        : 'مرحلة القائد التقني (12 – 14 سنة)';

    const candidateCode = `ABD-B2-${Math.floor(1000 + Math.random() * 9000)}`;
    const cloudRow = {
      candidate_code: candidateCode,
      child_name: form.childName.trim(),
      age: ageNum,
      age_stage: ageStage,
      school_name: form.schoolName?.trim() || 'مدارس النجف الأشرف',
      preferred_track: form.preferredTrack || 'تصميم وبرمجة الروبوتات',
      priority_category: form.priorityCategory || form.experienceLevel || 'تسجيل عام',
      parent_name: form.parentName?.trim() || '',
      parent_phone: form.parentPhone.trim(),
      notes: form.notes?.trim() || ''
    };

    const record = {
      ...cloudRow,
      id: `b2-${Date.now()}`,
      child_age: ageNum,
      created_at: new Date().toISOString()
    };

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
    local.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCH2, JSON.stringify(local));

    if (supabase) {
      try {
        await supabase.from('abdaa_batch2_students').insert([cloudRow]);
      } catch (e) {
        console.warn('Batch2 cloud insert fallback:', e);
      }
    }

    return { success: true, applicant: record };
  },

  async getAllBatch2Students() {
    const cloud = await this.fetchAdminCloudSnapshot();
    if (cloud && Array.isArray(cloud.batch2)) {
      return cloud.batch2;
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
  },

  // 7. تقييمات لجنة التحكيم للـ 40 مشروعاً (سحابياً في Supabase + محلياً)
  async saveProjectEvaluation(evalPayload) {
    const projCode = String(
      evalPayload.projectCode || evalPayload.project_code || `ABD-PRJ-${String(evalPayload.projectId || '01').padStart(2, '0')}`
    );
    const judgeName = String(evalPayload.judgeName || evalPayload.judge_name || 'محكم علمي').trim();
    const totalScore = Number(evalPayload.totalScore ?? evalPayload.total_score ?? 0);

    let savedSource = 'local';
    let savedRow = null;

    if (supabase && activeAdminRpcSecret) {
      try {
        const { data, error } = await supabase.rpc('abdaa_save_evaluation', {
          p_secret: activeAdminRpcSecret,
          p_project_code: projCode,
          p_project_title: evalPayload.projectTitle || evalPayload.project_title || projCode,
          p_age_group: evalPayload.ageGroup || evalPayload.age_group || '6–14 سنة',
          p_judge_name: judgeName,
          p_judge_role: evalPayload.judgeRole || evalPayload.judge_role || 'لجنة التحكيم العلمية',
          p_criteria: evalPayload.criteria || {},
          p_total_score: Math.round(totalScore),
          p_notes: evalPayload.notes || ''
        });
        if (!error && data) {
          savedSource = 'supabase';
          savedRow = mapCloudEvalRow(data);
        }
      } catch (e) {
        console.warn('Evaluation cloud save fallback:', e);
      }
    }

    const existing = await this.getAllProjectEvaluations();
    const normalizedEntry = savedRow || mapCloudEvalRow({
      id: `eval-${Date.now()}`,
      project_code: projCode,
      project_title: evalPayload.projectTitle || evalPayload.project_title || projCode,
      age_group: evalPayload.ageGroup || evalPayload.age_group || '6–14 سنة',
      judge_name: judgeName,
      judge_role: evalPayload.judgeRole || evalPayload.judge_role || 'لجنة التحكيم العلمية',
      criteria: evalPayload.criteria || {},
      total_score: totalScore,
      notes: evalPayload.notes || '',
      evaluated_at: new Date().toISOString()
    });

    const filtered = existing.filter(
      (ev) => !((ev.project_code || ev.projectCode) === projCode && (ev.judge_name || ev.judgeName) === judgeName)
    );
    const updated = [normalizedEntry, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY_EVALUATIONS, JSON.stringify(updated));
    return { success: true, source: savedSource, evaluations: updated };
  },

  async getAllProjectEvaluations() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('abdaa_project_evaluations')
          .select('*')
          .order('evaluated_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          const mapped = data.map(mapCloudEvalRow).filter(Boolean);
          localStorage.setItem(LOCAL_STORAGE_KEY_EVALUATIONS, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        console.warn('Cloud evaluations fetch fallback:', e);
      }
    }

    try {
      const raw = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EVALUATIONS) || '[]');
      if (Array.isArray(raw)) return raw.map(mapCloudEvalRow).filter(Boolean);
    } catch {
      // ignore
    }
    return [];
  },

  async deleteProjectEvaluation(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_archive_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'evaluations',
          p_id: id
        });
      } catch (e) {
        console.warn('Delete evaluation cloud warning:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EVALUATIONS) || '[]');
    const updated = local.filter((ev) => ev.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_EVALUATIONS, JSON.stringify(updated));
    return this.getAllProjectEvaluations();
  },

  // 8. جدار الفخر والتهاني التفاعلي (سحابياً في Supabase + محلياً)
  async getPrideMessages() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('abdaa_pride_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          const mapped = data.map(mapCloudPrideRow).filter(Boolean);
          localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        console.warn('Pride messages cloud fetch fallback:', e);
      }
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
  },

  async submitPrideMessage(payload) {
    const cloudInsert = {
      sender_name: payload.senderName.trim(),
      relation: payload.relation || 'ولي أمر / عائلة خريج',
      child_name: payload.childName?.trim() || 'أبطال مبادرة 1001 طفل رقمي',
      badge: payload.badge || '🎓 فخر العائلة',
      message: payload.message.trim(),
      likes: 1
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('abdaa_pride_messages')
          .insert([cloudInsert])
          .select()
          .single();
        if (!error && data) {
          const item = mapCloudPrideRow(data);
          const list = await this.getPrideMessages();
          return { success: true, source: 'supabase', item, list };
        }
      } catch (e) {
        console.warn('Pride message cloud insert fallback:', e);
      }
    }

    const record = mapCloudPrideRow({
      ...cloudInsert,
      id: `pw-${Date.now()}`,
      created_at: new Date().toISOString()
    });
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
    local.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(local));
    return { success: true, source: 'local', item: record, list: local };
  },

  async likePrideMessage(id) {
    if (supabase && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_like_pride_message', { p_id: id });
        return this.getPrideMessages();
      } catch (e) {
        console.warn('Pride like cloud fallback:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
    const updated = local.map((item) =>
      item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(updated));
    return updated;
  },

  async deletePrideMessage(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_archive_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'pride',
          p_id: id
        });
      } catch (e) {
        console.warn('Delete pride cloud warning:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
    const updated = local.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('abdaa-cms-updated'));
    return this.getPrideMessages();
  },

  // 9. أرشيف هويات العضوية والانتماء الصادرة (سحابياً + محلياً)
  async upsertIssuedIdCard(cardData) {
    const cleanCardData = {
      ...cardData,
      bloodType: sanitizeBloodType(cardData?.bloodType ?? cardData?.blood_type)
    };
    let cloudSaved = null;
    if (supabase && activeAdminRpcSecret) {
      try {
        const { data, error } = await supabase.rpc('abdaa_admin_upsert_id_card', {
          p_secret: activeAdminRpcSecret,
          p_card: cleanCardData
        });
        if (!error && data) {
          cloudSaved = mapCloudIdCardRow(data);
        }
      } catch (e) {
        console.warn('ID card cloud upsert fallback:', e);
      }
    }

    const entry = cloudSaved || {
      ...cleanCardData,
      id: `idcard-${Date.now()}`,
      issuedAt: new Date().toLocaleDateString('ar-IQ')
    };
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ID_CARDS) || '[]');
    const updated = [
      entry,
      ...local.filter((item) => item.membershipId !== entry.membershipId)
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_ID_CARDS, JSON.stringify(updated));
    return { ok: true, source: cloudSaved ? 'supabase' : 'local', card: entry, list: updated };
  },

  async deleteIssuedIdCard(id, membershipId) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_archive_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'id_cards',
          p_id: id
        });
      } catch (e) {
        console.warn('ID card cloud delete warning:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ID_CARDS) || '[]');
    const updated = local.filter((item) => item.id !== id && item.membershipId !== membershipId);
    localStorage.setItem(LOCAL_STORAGE_KEY_ID_CARDS, JSON.stringify(updated));
    return updated;
  },

  // 10. عمليات الحذف والتبديل الإدارية
  async deleteTicket(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_delete_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'tickets',
          p_id: id
        });
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    const updated = local.filter((t) => t.id !== id && t.booking_code !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(updated));
    return this.getAllTickets();
  },

  async toggleTicketAttendance(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_toggle_ticket', {
          p_secret: activeAdminRpcSecret,
          p_id: id
        });
        return this.getAllTickets();
      } catch {
        // fallback
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    const updated = local.map((t) => {
      if (t.id === id || t.booking_code === id) {
        const targetState = !t.is_attended;
        return {
          ...t,
          is_attended: targetState,
          checked_in_at: targetState ? new Date().toISOString() : null
        };
      }
      return t;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(updated));
    return updated;
  },

  async deleteBatch2Student(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_delete_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'batch2',
          p_id: id
        });
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
    const updated = local.filter((c) => c.id !== id && c.candidate_code !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCH2, JSON.stringify(updated));
    return this.getAllBatch2Students();
  },

  async deleteVolunteer(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_delete_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'volunteers',
          p_id: id
        });
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
    const updated = local.filter((v) => v.id !== id && v.volunteer_code !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_VOLUNTEERS, JSON.stringify(updated));
    return this.getAllVolunteers();
  },

  async deleteSponsor(id) {
    if (supabase && activeAdminRpcSecret && UUID_REGEX.test(String(id))) {
      try {
        await supabase.rpc('abdaa_admin_delete_record', {
          p_secret: activeAdminRpcSecret,
          p_table: 'sponsors',
          p_id: id
        });
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
    const updated = local.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_SPONSORS, JSON.stringify(updated));
    return this.getAllSponsors();
  },

  // ========================================================
  // 10. تقييم مشاريع المعرض بالنجوم (1 إلى 5 نجوم)
  // تقييم واحد لكل جهاز موبايل مع إمكانية التعديل لمدة ساعة واحدة ثم القفل
  // ========================================================
  getRaterDeviceId() {
    const DEVICE_KEY = 'abdaa_rater_device_id_v1';
    if (typeof window === 'undefined') return 'server-device-fallback';
    try {
      let existing = localStorage.getItem(DEVICE_KEY);
      if (existing && existing.length >= 8) return existing;
      const rand =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(DEVICE_KEY, rand);
      return rand;
    } catch {
      return `dev-session-${Date.now().toString(36)}`;
    }
  },

  _loadLocalProjectRatings() {
    if (typeof window === 'undefined') return {};
    try {
      const raw = JSON.parse(localStorage.getItem('abdaa_project_star_ratings_v1') || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch {
      return {};
    }
  },

  _saveLocalProjectRating(projectId, entry) {
    if (typeof window === 'undefined') return;
    try {
      const map = this._loadLocalProjectRatings();
      map[String(projectId)] = entry;
      localStorage.setItem('abdaa_project_star_ratings_v1', JSON.stringify(map));
    } catch {
      // ignore
    }
  },

  async getProjectRatingsSummary() {
    const summary = {};
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('abdaa_get_project_ratings_summary');
        if (!error && Array.isArray(data)) {
          data.forEach((row) => {
            summary[String(row.project_id)] = {
              avg: Number(row.avg_stars) || 0,
              count: Number(row.ratings_count) || 0
            };
          });
          return summary;
        }
      } catch {
        // fallback to local
      }
    }
    const localMap = this._loadLocalProjectRatings();
    Object.entries(localMap).forEach(([pid, rec]) => {
      if (rec && rec.stars >= 1 && rec.stars <= 5) {
        summary[String(pid)] = { avg: Number(rec.stars), count: 1 };
      }
    });
    return summary;
  },

  async getMyProjectRating(projectId) {
    const pid = Number(projectId);
    const deviceId = this.getRaterDeviceId();
    const HOUR_MS = 60 * 60 * 1000;

    if (supabase && pid > 0) {
      try {
        const { data, error } = await supabase.rpc('abdaa_get_device_project_rating', {
          p_project_id: pid,
          p_device_id: deviceId
        });
        if (!error && data && typeof data === 'object') {
          const expiresAtMs = data.expires_at ? new Date(data.expires_at).getTime() : 0;
          const createdAtMs = data.created_at ? new Date(data.created_at).getTime() : 0;
          if (data.rated) {
            this._saveLocalProjectRating(pid, {
              stars: Number(data.stars) || 0,
              createdAtMs,
              expiresAtMs
            });
          }
          return {
            rated: Boolean(data.rated),
            stars: Number(data.stars) || 0,
            locked: Boolean(data.locked),
            remainingSeconds: Number(data.remaining_seconds) || 0,
            expiresAtMs,
            avg: Number(data.avg_stars) || 0,
            count: Number(data.ratings_count) || 0
          };
        }
      } catch {
        // fallback to local
      }
    }

    const localRec = this._loadLocalProjectRatings()[String(pid)];
    if (!localRec || !localRec.stars) {
      return { rated: false, stars: 0, locked: false, remainingSeconds: 0, expiresAtMs: 0, avg: 0, count: 0 };
    }
    const expiresAtMs = localRec.expiresAtMs || (localRec.createdAtMs || Date.now()) + HOUR_MS;
    const remainingSeconds = Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000));
    return {
      rated: true,
      stars: Number(localRec.stars) || 0,
      locked: remainingSeconds <= 0,
      remainingSeconds,
      expiresAtMs,
      avg: Number(localRec.stars) || 0,
      count: 1
    };
  },

  async submitProjectRating(projectId, stars) {
    const pid = Number(projectId);
    const safeStars = Math.max(1, Math.min(5, Math.round(Number(stars) || 0)));
    const deviceId = this.getRaterDeviceId();
    const HOUR_MS = 60 * 60 * 1000;

    if (supabase && pid > 0) {
      try {
        const { data, error } = await supabase.rpc('abdaa_submit_project_rating', {
          p_project_id: pid,
          p_device_id: deviceId,
          p_stars: safeStars
        });
        if (!error && data && typeof data === 'object') {
          const expiresAtMs = data.expires_at ? new Date(data.expires_at).getTime() : Date.now() + HOUR_MS;
          const createdAtMs = data.created_at ? new Date(data.created_at).getTime() : Date.now();
          this._saveLocalProjectRating(pid, {
            stars: Number(data.stars) || safeStars,
            createdAtMs,
            expiresAtMs
          });
          return {
            ok: Boolean(data.ok),
            status: data.status || (data.ok ? 'created' : 'locked'),
            stars: Number(data.stars) || safeStars,
            locked: Boolean(data.locked),
            remainingSeconds: Number(data.remaining_seconds) || 0,
            expiresAtMs,
            avg: Number(data.avg_stars) || safeStars,
            count: Number(data.ratings_count) || 1
          };
        }
      } catch {
        // fallback to local
      }
    }

    const existing = this._loadLocalProjectRatings()[String(pid)];
    const now = Date.now();
    if (existing && existing.expiresAtMs && now > existing.expiresAtMs) {
      return {
        ok: false,
        status: 'locked',
        stars: Number(existing.stars) || safeStars,
        locked: true,
        remainingSeconds: 0,
        expiresAtMs: existing.expiresAtMs,
        avg: Number(existing.stars) || safeStars,
        count: 1
      };
    }

    const createdAtMs = existing?.createdAtMs || now;
    const expiresAtMs = existing?.expiresAtMs || createdAtMs + HOUR_MS;
    const status = existing ? 'updated' : 'created';
    this._saveLocalProjectRating(pid, { stars: safeStars, createdAtMs, expiresAtMs });
    return {
      ok: true,
      status,
      stars: safeStars,
      locked: false,
      remainingSeconds: Math.max(0, Math.floor((expiresAtMs - now) / 1000)),
      expiresAtMs,
      avg: safeStars,
      count: 1
    };
  }
};
