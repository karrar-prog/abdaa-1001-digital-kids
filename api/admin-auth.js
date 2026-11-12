import crypto from 'node:crypto';

const AUTH_SALT = 'abdaa-1001-masdar-sec-v4::';

const DEFAULT_HASHED_USERS = [
  {
    id: 'usr-karrar',
    username: 'karrar',
    aliases: ['كرار', 'masdar', 'karrar'],
    passwordHash: '487447f94814426cd5622b86ec59d889afcf3a1a9ff72a6885815b1d5e9e97b6',
    fullName: 'كرار حساني جاسم — إدارة شركة المصدر',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-firas',
    username: 'firas',
    aliases: ['فراس', 'admin', 'firas'],
    passwordHash: '5271af07d768d0613f597c324c290d57068e7b257be4ad6b6921c5cc6766e4c2',
    fullName: 'فراس نزار كريم — إدارة نادي أبدع',
    role: 'super_admin',
    roleLabel: 'مدير عام كامل الصلاحيات (أدمن)'
  },
  {
    id: 'usr-reception',
    username: 'reception',
    aliases: ['استقبال'],
    passwordHash: 'b62b8ddbe401e2fa5f0b27d36a90dc6e87c5638c8161bd46644a9d96bee3743f',
    fullName: 'فريق الاستقبال وتدقيق التذاكر',
    role: 'reception',
    roleLabel: 'لجنة الاستقبال والتذاكر والهويات'
  },
  {
    id: 'usr-media',
    username: 'media',
    aliases: ['اعلام', 'إعلام'],
    passwordHash: '8d52e68b9f8137a8036a7eca16ab4119d982028fef4c43c98854ca5f2094eeab',
    fullName: 'اللجنة الإعلامية وتحديث المحتوى',
    role: 'media_cms',
    roleLabel: 'لجنة الإعلام وإدارة المحتوى'
  },
  {
    id: 'usr-judge',
    username: 'judge',
    aliases: ['تحكيم'],
    passwordHash: '4ac295f439e73f8a4e0645054ea4727c8ccdb71e468abe3425f6f4f5f3ee82a2',
    fullName: 'اللجنة العلمية والتحكيم',
    role: 'judging',
    roleLabel: 'لجنة التحكيم والمشاريع'
  }
];

// Simple in-memory per-instance brute-force rate limiter
const attemptsByIp = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000;

function safeTimingEqualHex(hexA, hexB) {
  try {
    const bufA = Buffer.from(String(hexA || ''), 'hex');
    const bufB = Buffer.from(String(hexB || ''), 'hex');
    if (bufA.length !== bufB.length || bufA.length === 0) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const now = Date.now();
  const record = attemptsByIp.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      ok: false,
      error: 'تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار دقيقة واحدة والمحاولة مجدداً.'
    });
  }

  const { username = '', password = '' } = req.body || {};
  const uClean = String(username || '').trim().toLowerCase();
  const pClean = String(password || '').trim();

  if (!uClean || !pClean) {
    return res.status(400).json({ ok: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور.' });
  }

  let usersPool = DEFAULT_HASHED_USERS;
  if (process.env.ADMIN_USERS_JSON) {
    try {
      const envUsers = JSON.parse(process.env.ADMIN_USERS_JSON);
      if (Array.isArray(envUsers) && envUsers.length > 0) {
        usersPool = envUsers;
      }
    } catch {
      // fallback to default hashed users
    }
  }

  const candidateHash = crypto
    .createHash('sha256')
    .update(AUTH_SALT + pClean, 'utf8')
    .digest('hex');

  const matched = usersPool.find((u) => {
    const uname = String(u.username || '').trim().toLowerCase();
    const aliases = Array.isArray(u.aliases)
      ? u.aliases.map((a) => String(a).trim().toLowerCase())
      : [];
    const nameMatch = uname === uClean || aliases.includes(uClean);
    const passMatch = safeTimingEqualHex(u.passwordHash, candidateHash);
    return nameMatch && passMatch;
  });

  if (!matched) {
    record.count += 1;
    attemptsByIp.set(ip, record);
    return res.status(401).json({
      ok: false,
      error: 'اسم المستخدم أو كلمة المرور غير صحيحة.'
    });
  }

  attemptsByIp.delete(ip);
  return res.status(200).json({
    ok: true,
    user: {
      id: matched.id,
      username: matched.username,
      fullName: matched.fullName,
      role: matched.role,
      roleLabel: matched.roleLabel
    }
  });
}
