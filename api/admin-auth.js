import crypto from 'node:crypto';

const AUTH_SALT = 'abdaa-1001-masdar-sec-v4::';

const DEFAULT_HASHED_USERS = [
  {
    id: 'usr-karrar',
    username: 'karrar',
    aliases: ['كرار', 'masdar', 'karrar'],
    passwordHash: 'd235f8bcea39559c4d2e2ed03483f2631b3855cb25378d7a7d8426cbe3e6ef81',
    fullName: 'كرار حساني جاسم — إدارة شركة المصدر',
    role: 'super_admin',
    roleLabel: 'السوبر أدمن — كامل الصلاحيات وإدارة المستخدمين',
    customTabs: null,
    readOnly: false
  },
  {
    id: 'usr-firas',
    username: 'firas',
    aliases: ['فراس', 'الاستاذ فراس', 'الأستاذ فراس', 'أ. فراس', 'admin', 'firas'],
    passwordHash: '99be6e58bbe93f3ff096532c85f4067edb49a5566752ba0df3f90fd037e9dc7a',
    fullName: 'الأستاذ فراس نزار كريم — إدارة نادي أبدع',
    role: 'admin_manager',
    roleLabel: 'إدارة المنصة والمحتوى (كامل الصلاحيات عدا المستخدمين)',
    customTabs: null,
    readOnly: false
  },
  {
    id: 'usr-aliaa',
    username: 'aliaa',
    aliases: ['علياء', 'الدكتورة علياء', 'الدكتوره علياء', 'دكتورة علياء', 'د. علياء', 'aliaa'],
    passwordHash: '5282f290f43074711b7909cb033a55f8565fbc7f046e1a6f27c7bc78137f2ca5',
    fullName: 'الدكتورة علياء عبد الحسين لفتة — إدارة نادي أبدع',
    role: 'admin_manager',
    roleLabel: 'إدارة المنصة والمحتوى (كامل الصلاحيات عدا المستخدمين)',
    customTabs: null,
    readOnly: false
  },
  {
    id: 'usr-manar',
    username: 'manar',
    aliases: ['منار', 'الست منار', 'أستاذة منار', 'manar'],
    passwordHash: '7d814fd124d80fbbab0613f19e776f5369f5ec788515ecf1116ee65017f7a903',
    fullName: 'منار — إدارة نادي أبدع ومبادرة 1001 طفل رقمي',
    role: 'admin_manager',
    roleLabel: 'إدارة المنصة والمحتوى (كامل الصلاحيات عدا المستخدمين)',
    customTabs: null,
    readOnly: false
  },
  {
    id: 'usr-zahraa',
    username: 'zahraa',
    aliases: ['زهراء', 'الست زهراء', 'أستاذة زهراء', 'zahraa'],
    passwordHash: '0c983f4dc9e608b9d9838a7dbf30957daf0fdf38a0ea249be8276cc2e6568162',
    fullName: 'زهراء — صلاحية المشاهدة والطباعة فقط',
    role: 'viewer_print',
    roleLabel: 'مشاهدة وطباعة فقط (قراءة فقط)',
    customTabs: null,
    readOnly: true
  },
  {
    id: 'usr-reception',
    username: 'reception',
    aliases: ['استقبال'],
    passwordHash: '268f97a131fb4475a7aa4616f70dc564dc0bbec6b0a1f57957ace24574a286c4',
    fullName: 'فريق الاستقبال وتدقيق التذاكر',
    role: 'reception',
    roleLabel: 'لجنة الاستقبال والتذاكر والهويات',
    customTabs: null,
    readOnly: false
  },
  {
    id: 'usr-media',
    username: 'media',
    aliases: ['اعلام', 'إعلام'],
    passwordHash: 'f2da38ab74d6bf300f3963582f4124eb738707bf25a70ebf99faa0a03fa8451c',
    fullName: 'اللجنة الإعلامية وتحديث المحتوى',
    role: 'media_cms',
    roleLabel: 'لجنة الإعلام وإدارة المحتوى',
    customTabs: null,
    readOnly: false
  },
  {
    id: 'usr-judge',
    username: 'judge',
    aliases: ['تحكيم'],
    passwordHash: '175e9f0dfcbd847a4b2702ef935da62cd22e45d51ab4c9f69f61c66078fd9323',
    fullName: 'اللجنة العلمية والتحكيم',
    role: 'judging',
    roleLabel: 'لجنة التحكيم والمشاريع',
    customTabs: null,
    readOnly: false
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
      roleLabel: matched.roleLabel,
      customTabs: Array.isArray(matched.customTabs) ? matched.customTabs : null,
      readOnly: Boolean(matched.readOnly) || matched.role === 'viewer_print'
    }
  });
}
