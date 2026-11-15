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
const LOCAL_STORAGE_KEY_BATCH2 = 'abdaa_batch2_applicants';
const LOCAL_STORAGE_KEY_EVALUATIONS = 'abdaa_project_evaluations';
const LOCAL_STORAGE_KEY_PRIDE = 'abdaa_pride_wall';

// تهيئة بيانات افتراضية لتسهيل التجربة والعرض
const initLocalData = () => {
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
      },
      {
        id: '2',
        booking_code: 'ABD-2048',
        attendee_name: 'عائلة الطالبة فاطمة حيدر الحسني',
        phone_number: '07801122334',
        guest_type: 'عائلة طفل متخرج',
        companions_count: 2,
        notes: 'بلوك B • مقعد B-6',
        is_attended: false,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(demoTickets));
  }

  if (!localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2)) {
    const demoBatch2 = [
      {
        id: 'b2-1',
        candidate_code: 'ABD-B2-1042',
        child_name: 'أحمد حيدر الخفاجي',
        age: 11,
        age_stage: 'مرحلة البنّاء المبتكر (10 – 11 سنة)',
        school_name: 'مدرسة المتفوقين الابتدائية',
        preferred_track: 'تصميم وبرمجة الروبوتات',
        priority_category: 'موهوب / متفوق دراسياً',
        parent_name: 'حيدر الخفاجي',
        parent_phone: '07812345678',
        created_at: new Date().toISOString()
      },
      {
        id: 'b2-2',
        candidate_code: 'ABD-B2-1089',
        child_name: 'نور الهدى علي الموسوي',
        age: 9,
        age_stage: 'مرحلة المستكشف الرقمي (7 – 9 سنوات)',
        school_name: 'مدارس دار الزهراء الخيرية',
        preferred_track: 'البرمجة والتطبيقات',
        priority_category: 'رعاية الأيتام والمتعففين',
        parent_name: 'علي الموسوي',
        parent_phone: '07709876543',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCH2, JSON.stringify(demoBatch2));
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
      },
      {
        id: 'pw-2',
        senderName: 'والدة الطالبة فاطمة حيدر الحسني',
        relation: 'ولية أمر خريجة',
        childName: 'فاطمة حيدر الحسني',
        badge: '🤖 مبتكرة المستقبل',
        message: 'كانت أجمل رحلة علمية لابنتي فاطمة! تحولت ساعات استخدامها للأجهزة إلى شغف ببرمجة الروبوتات والذكاء الاصطناعي. مبارك لكل الـ 170 بطلاً وبطلة.',
        likes: 19,
        created_at: new Date().toISOString()
      },
      {
        id: 'pw-3',
        senderName: 'د. حيدر الكفيشي',
        relation: 'أستاذ جامعي وضيف الحفل',
        childName: 'جميع أبطال الدفعة الأولى (170 خريجاً)',
        badge: '🚀 جيل الخوارزمي',
        message: 'ما شاهدناه في معرض الـ 40 مشروعاً من أطفال بأعمار 7 إلى 14 سنة يثبت أن أطفال العراق يمتلكون عقولاً استثنائية متى ما توفرت لهم الحاضنة العلمية الصحيحة.',
        likes: 34,
        created_at: new Date().toISOString()
      },
      {
        id: 'pw-4',
        senderName: 'والد البطل علي حسين الموسوي',
        relation: 'ولي أمر خريج',
        childName: 'علي حسين الموسوي',
        badge: '⭐ نجم البرمجة',
        message: 'ألف مبارك لولدي علاوي ولكل زملائه في كروب الجزري! شكراً للأساتذة والمدربين الذين زرعوا الثقة وحب الابتكار في قلوب أطفالنا.',
        likes: 15,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(demoPride));
  }
};

initLocalData();

export const EventDB = {
  // 1. إنشاء تذكرة جديدة (متوافق مع سياسة anon_insert_tickets بدون كشف جدول التذاكر للعامة)
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
        const { error } = await supabase
          .from('tickets')
          .insert([newTicket]);

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
        const { data, error } = await supabase.rpc('get_reserved_seat_notes');
        if (!error && Array.isArray(data)) {
          data.forEach((row) => extractSeatFromNotes(typeof row === 'string' ? row : row?.notes));
        }
      } catch {
        // fallback to local reserved seats
      }
    }

    return map;
  },

  // 2. البحث عن تذكرة وتأكيد الدخول (Check-in Scanner عبر دالة RPC آمنة أو التخزين المحلي)
  async verifyAndCheckIn(code) {
    const cleanCode = code.trim().toUpperCase();

    if (supabase) {
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('checkin_ticket_by_code', {
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
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    if (supabase) {
      try {
        const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn('Failed fetching tickets from supabase:', e);
      }
    }
    return local;
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
    local.unshift({ ...data, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY_VOLUNTEERS, JSON.stringify(local));
    return { success: true };
  },

  async getAllVolunteers() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch {
        // fallback
      }
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
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
    local.unshift({ ...data, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY_SPONSORS, JSON.stringify(local));
    return { success: true };
  },

  async getAllSponsors() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('sponsors').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch {
        // fallback
      }
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
  },

  // 6. تسجيل طفل جديد في الدفعة الثانية (الأعمار 7 – 14 سنة)
  async submitBatch2Student(form) {
    const rawAge = form.childAge ?? form.age ?? 10;
    const ageNum = Math.min(14, Math.max(7, parseInt(rawAge, 10) || 10));
    const ageStage =
      ageNum <= 9
        ? 'مرحلة المستكشف الرقمي (7 – 9 سنوات)'
        : ageNum <= 11
        ? 'مرحلة البنّاء المبتكر (10 – 11 سنة)'
        : 'مرحلة القائد التقني (12 – 14 سنة)';

    const record = {
      id: `b2-${Date.now()}`,
      candidate_code: `ABD-B2-${Math.floor(1000 + Math.random() * 9000)}`,
      child_name: form.childName.trim(),
      age: ageNum,
      child_age: ageNum,
      age_stage: ageStage,
      school_name: form.schoolName?.trim() || 'مدارس النجف الأشرف',
      preferred_track: form.preferredTrack || 'تصميم وبرمجة الروبوتات',
      priority_category: form.priorityCategory || form.experienceLevel || 'تسجيل عام',
      parent_name: form.parentName?.trim() || '',
      parent_phone: form.parentPhone.trim(),
      notes: form.notes?.trim() || '',
      created_at: new Date().toISOString()
    };

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
    local.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCH2, JSON.stringify(local));

    return { success: true, applicant: record };
  },

  async getAllBatch2Students() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
  },

  // 7. حفظ وجلب تقييمات لجنة التحكيم للـ 40 مشروعاً (كمصفوفة موحدة متوافقة مع بوابة التحكيم والإدارة)
  async saveProjectEvaluation(evalPayload) {
    const existing = await this.getAllProjectEvaluations();
    const projCode = String(evalPayload.projectCode || evalPayload.project_code || `ABD-PRJ-${String(evalPayload.projectId || '01').padStart(2, '0')}`);
    const judgeName = String(evalPayload.judgeName || evalPayload.judge_name || 'محكم علمي').trim();
    const totalScore = Number(evalPayload.totalScore ?? evalPayload.total_score ?? 0);

    const normalizedEntry = {
      id: `eval-${Date.now()}`,
      project_code: projCode,
      projectCode: projCode,
      project_title: evalPayload.projectTitle || evalPayload.project_title || projCode,
      projectTitle: evalPayload.projectTitle || evalPayload.project_title || projCode,
      age_group: evalPayload.ageGroup || evalPayload.age_group || '7–14 سنة',
      ageGroup: evalPayload.ageGroup || evalPayload.age_group || '7–14 سنة',
      judge_name: judgeName,
      judgeName,
      judge_role: evalPayload.judgeRole || evalPayload.judge_role || 'لجنة التحكيم العلمية',
      judgeRole: evalPayload.judgeRole || evalPayload.judge_role || 'لجنة التحكيم العلمية',
      criteria: evalPayload.criteria || {},
      total_score: totalScore,
      totalScore,
      notes: evalPayload.notes || '',
      evaluated_at: new Date().toISOString()
    };

    const filtered = existing.filter(
      (ev) => !((ev.project_code || ev.projectCode) === projCode && (ev.judge_name || ev.judgeName) === judgeName)
    );
    const updated = [normalizedEntry, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY_EVALUATIONS, JSON.stringify(updated));
    return { success: true, evaluations: updated };
  },

  async getAllProjectEvaluations() {
    try {
      const raw = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EVALUATIONS) || '[]');
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === 'object') {
        // تحويل الصيغة الكائنية القديمة تلقائياً إلى مصفوفة نظيفة
        const migrated = Object.entries(raw).flatMap(([projKey, arr]) =>
          (Array.isArray(arr) ? arr : []).map((item, idx) => {
            const code = item.projectCode || item.project_code || (projKey !== 'undefined' ? `ABD-PRJ-${String(projKey).padStart(2, '0')}` : 'ABD-PRJ-01');
            const score = Number(item.totalScore ?? item.total_score ?? 0);
            return {
              id: item.id || `eval-mig-${idx}`,
              project_code: code,
              projectCode: code,
              project_title: item.projectTitle || item.project_title || code,
              age_group: item.ageGroup || item.age_group || '7–14 سنة',
              judge_name: item.judgeName || item.judge_name || 'محكم علمي',
              judge_role: item.judgeRole || item.judge_role || 'لجنة التحكيم',
              criteria: item.criteria || {},
              total_score: score,
              totalScore: score,
              notes: item.notes || '',
              evaluated_at: item.evaluatedAt || new Date().toISOString()
            };
          })
        );
        localStorage.setItem(LOCAL_STORAGE_KEY_EVALUATIONS, JSON.stringify(migrated));
        return migrated;
      }
    } catch {
      // ignore
    }
    return [];
  },

  // 8. جدار الفخر والتهاني التفاعلي لأولياء الأمور والزوار
  async getPrideMessages() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
  },

  async submitPrideMessage(payload) {
    const record = {
      id: `pw-${Date.now()}`,
      senderName: payload.senderName.trim(),
      relation: payload.relation || 'ولي أمر / عائلة خريج',
      childName: payload.childName?.trim() || 'أبطال مبادرة 1001 طفل رقمي',
      badge: payload.badge || '🎓 فخر العائلة',
      message: payload.message.trim(),
      likes: 1,
      created_at: new Date().toISOString()
    };

    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
    local.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(local));
    return { success: true, item: record, list: local };
  },

  async likePrideMessage(id) {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
    const updated = local.map((item) =>
      item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(updated));
    return updated;
  },

  async deletePrideMessage(id) {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRIDE) || '[]');
    const updated = local.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIDE, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('abdaa-cms-updated'));
    return updated;
  },

  async deleteTicket(id) {
    if (supabase) {
      try {
        await supabase.from('tickets').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    const updated = local.filter((t) => t.id !== id && t.booking_code !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(updated));
    return updated;
  },

  async toggleTicketAttendance(id) {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS) || '[]');
    let targetState = true;
    const updated = local.map((t) => {
      if (t.id === id || t.booking_code === id) {
        targetState = !t.is_attended;
        return {
          ...t,
          is_attended: targetState,
          checked_in_at: targetState ? new Date().toISOString() : null
        };
      }
      return t;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(updated));
    if (supabase) {
      try {
        await supabase
          .from('tickets')
          .update({
            is_attended: targetState,
            checked_in_at: targetState ? new Date().toISOString() : null
          })
          .eq('id', id);
      } catch {
        // ignore
      }
    }
    return updated;
  },

  async deleteBatch2Student(id) {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BATCH2) || '[]');
    const updated = local.filter((c) => c.id !== id && c.candidate_code !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCH2, JSON.stringify(updated));
    return updated;
  },

  async deleteVolunteer(id) {
    if (supabase) {
      try {
        await supabase.from('volunteers').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VOLUNTEERS) || '[]');
    const updated = local.filter((v) => v.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_VOLUNTEERS, JSON.stringify(updated));
    return updated;
  },

  async deleteSponsor(id) {
    if (supabase) {
      try {
        await supabase.from('sponsors').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPONSORS) || '[]');
    const updated = local.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_SPONSORS, JSON.stringify(updated));
    return updated;
  }
};
