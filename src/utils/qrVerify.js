import QRCode from 'qrcode';
import { EVENT_DETAILS } from '../data/eventData';

function toBase64UrlUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64UrlUtf8(token) {
  const padded = String(token || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + '='.repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * إنشاء رابط التحقق الرسمي المعتمد الذي يُفتح بأي كاميرا هاتف
 * @param {Object} doc
 * @param {'id'|'grad'|'mentor'|'ticket'|'b2'} doc.type
 * @param {string} doc.code
 * @param {string} doc.name
 * @param {string} [doc.role]
 * @param {string} [doc.track]
 * @param {string} [doc.extra]
 */
export function buildOfficialVerifyUrl(doc = {}) {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://abdaa-1001-digital-kids.vercel.app';

  const compact = {
    t: doc.type || 'id',
    c: String(doc.code || '').slice(0, 40),
    n: String(doc.name || '').slice(0, 90),
    r: String(doc.role || '').slice(0, 80),
    k: String(doc.track || '').slice(0, 80),
    x: String(doc.extra || '').slice(0, 60)
  };

  const token = toBase64UrlUtf8(JSON.stringify(compact));
  return `${origin}/?verify=${token}`;
}

export async function generateOfficialQrDataUrl(doc = {}, width = 240) {
  const url = buildOfficialVerifyUrl(doc);
  return QRCode.toDataURL(url, {
    width,
    margin: 1,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });
}

const DOC_TYPE_LABELS = {
  id: 'هوية عضوية وانتماء رسمية — نادي أبدع للمهارات الذكية',
  grad: 'شهادة وبطاقة تخرج رسمية — مبادرة 1001 طفل رقمي',
  mentor: 'شهادة شكر وتقدير — الهيئة التدريبية والإشراف العلمي',
  ticket: 'تذكرة حضور وحجز مقعد رسمي — قصر الثقافة',
  b2: 'بطاقة ترشيح رسمية — الدفعة الثانية (1001 طفل رقمي)'
};

/**
 * تحليل أي نص ممسوح من كاميرا الـ QR أو رابط ?verify=... أو كود مكتوب يدوياً
 */
export function parseOfficialVerification(rawInput = '') {
  const raw = String(rawInput || '').trim();
  if (!raw) return null;

  // 1. إذا كان رابطاً يحتوي على ?verify=...
  try {
    if (raw.includes('verify=')) {
      const match = raw.match(/[?&]verify=([A-Za-z0-9\-_]+)/);
      if (match?.[1]) {
        const jsonStr = fromBase64UrlUtf8(match[1]);
        const parsed = JSON.parse(jsonStr);
        if (parsed && parsed.c && parsed.n) {
          const type = parsed.t || 'id';
          return {
            valid: true,
            type,
            typeLabel: DOC_TYPE_LABELS[type] || DOC_TYPE_LABELS.id,
            code: parsed.c,
            name: parsed.n,
            role: parsed.r || '',
            track: parsed.k || '',
            extra: parsed.x || ''
          };
        }
      }
    }
  } catch {
    // متابعة للصيغ الأخرى
  }

  // 2. إذا كان رمزاً مشفراً بـ Base64URL مباشرة (من معامِل URL)
  try {
    if (/^[A-Za-z0-9\-_]{20,}$/.test(raw)) {
      const jsonStr = fromBase64UrlUtf8(raw);
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.c && parsed.n) {
        const type = parsed.t || 'id';
        return {
          valid: true,
          type,
          typeLabel: DOC_TYPE_LABELS[type] || DOC_TYPE_LABELS.id,
          code: parsed.c,
          name: parsed.n,
          role: parsed.r || '',
          track: parsed.k || '',
          extra: parsed.x || ''
        };
      }
    }
  } catch {
    // متابعة للصيغ الأخرى
  }

  // 3. صيغ الأنابيب السابقة (ABDAA-ID|... أو ABDAA-1001|... أو ABDAA-B2|...)
  if (raw.includes('|')) {
    const parts = raw.split('|').map((s) => s.trim());
    if (parts[0] === 'ABDAA-ID') {
      return {
        valid: true,
        type: 'id',
        typeLabel: DOC_TYPE_LABELS.id,
        code: parts[1] || 'ABD-ID',
        name: parts[2] || 'عضو معتمد',
        role: parts[3] || 'عضو نادي أبدع للمهارات الذكية',
        track: 'البرمجة والذكاء الاصطناعي والروبوتات',
        extra: 'النجف الأشرف'
      };
    }
    if (parts[0] === 'ABDAA-1001') {
      return {
        valid: true,
        type: 'ticket',
        typeLabel: DOC_TYPE_LABELS.ticket,
        code: parts[1] || '',
        name: parts[2] || 'ضيف الحفل',
        role: 'تذكرة حضور رسمية',
        track: 'مسرح قصر الثقافة',
        extra: ''
      };
    }
    if (parts[0] === 'ABDAA-B2') {
      return {
        valid: true,
        type: 'b2',
        typeLabel: DOC_TYPE_LABELS.b2,
        code: parts[1] || '',
        name: parts[2] || 'مرشح الدفعة الثانية',
        role: 'منتسب الدفعة الثانية',
        track: 'مبادرة 1001 طفل رقمي',
        extra: ''
      };
    }
  }

  // 4. صيغة JSON للشهادات السابقة
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const obj = JSON.parse(raw);
      if (obj.name && (obj.id || obj.code)) {
        return {
          valid: true,
          type: 'grad',
          typeLabel: DOC_TYPE_LABELS.grad,
          code: obj.code || obj.id,
          name: obj.name,
          role: 'خريج الدفعة الأولى — مبادرة 1001 طفل رقمي',
          track: obj.track || 'الروبوت والذكاء الاصطناعي',
          extra: 'امتياز مع مرتبة الشرف'
        };
      }
    } catch {
      // ignore
    }
  }

  // 5. البحث في سجل الهويات الصادرة أو قوائم الخريجين الـ 170 عند إدخال رقم هوية يدوياً
  const upper = raw.toUpperCase();
  if (typeof window !== 'undefined') {
    try {
      const issued = JSON.parse(localStorage.getItem('abdaa_issued_id_cards_v1') || '[]');
      const foundId = issued.find((item) => String(item.membershipId || '').toUpperCase() === upper);
      if (foundId) {
        return {
          valid: true,
          type: 'id',
          typeLabel: DOC_TYPE_LABELS.id,
          code: foundId.membershipId,
          name: foundId.fullName,
          role: foundId.roleTitle,
          track: foundId.track,
          extra: `صلاحية لغاية ${foundId.expiryDate || '2027/11/01'}`
        };
      }
    } catch {
      // ignore
    }
  }

  // فحص رقم هوية خريج قياسي ABD-ID-2026-XXXX أو 1001-XXXX
  const gradMatch = upper.match(/(?:ABD-ID-2026-|1001-)(\d{1,4})$/);
  if (gradMatch) {
    const serial = parseInt(gradMatch[1], 10);
    const cohorts = EVENT_DETAILS.cohorts || [];
    let counter = 0;
    for (const c of cohorts) {
      for (const st of c.students || []) {
        counter += 1;
        if (counter === serial) {
          const stName = typeof st === 'object' ? st.name : st;
          return {
            valid: true,
            type: 'grad',
            typeLabel: DOC_TYPE_LABELS.grad,
            code: upper,
            name: stName,
            role: 'خريج وعضو معتمد — الدفعة الأولى',
            track: c.track || 'البرمجة والذكاء الاصطناعي',
            extra: c.name || 'نادي أبدع للمهارات الذكية'
          };
        }
      }
    }
  }

  return null;
}
