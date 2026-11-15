export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeImageSrc(url, fallback = '') {
  const raw = String(url ?? '').trim();
  if (!raw) return fallback;
  if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[a-zA-Z0-9+/=\s]+$/i.test(raw)) {
    return escapeHtml(raw);
  }
  if (/^(https?:\/\/|blob:|\/)/i.test(raw)) {
    return escapeHtml(raw);
  }
  return fallback;
}

export function sanitizeHexColor(color, fallback = '#0284c7') {
  const raw = String(color ?? '').trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(raw) ? raw : fallback;
}

/**
 * 1. طباعة بطاقة الخريج الرقمية الرسمية (نسختين: النهارية البيضاء + الليلية الكحلية مثل نظام الفارابي)
 */
