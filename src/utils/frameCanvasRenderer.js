// محرك رسم إطارات التخرج التذكارية الطفولية عالي الدقة (HTML5 Canvas 2D)
// يدعم صيغتي البوست المربع (1080×1080) والستوري الطولي (1080×1920) مع 8 ثيمات طفولية مرسومة بعناية

import { FRAME_STICKERS, PHOTO_FILTERS } from '../data/frameThemes';

const IMAGE_CACHE = new Map();

export function loadImageCached(src) {
  if (!src) return Promise.resolve(null);
  if (IMAGE_CACHE.has(src)) {
    return IMAGE_CACHE.get(src);
  }
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  // Cache static URLs (skip huge data URLs if too many)
  if (!src.startsWith('data:') || IMAGE_CACHE.size < 8) {
    IMAGE_CACHE.set(src, promise);
  }
  return promise;
}

// ---------- Low-level Playful Vector Illustration Helpers ----------

function drawStar(ctx, cx, cy, spikes, outerR, innerR, fill, stroke = null, lineWidth = 2) {
  ctx.save();
  ctx.beginPath();
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawFourPointSparkle(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.16, -size * 0.16, size, 0);
  ctx.quadraticCurveTo(size * 0.16, size * 0.16, 0, size);
  ctx.quadraticCurveTo(-size * 0.16, size * 0.16, -size, 0);
  ctx.quadraticCurveTo(-size * 0.16, -size * 0.16, 0, -size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCuteCloud(ctx, cx, cy, scale = 1, smiling = true) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Soft shadow
  ctx.shadowColor = 'rgba(56, 189, 248, 0.22)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-44, 10, 32, 0, Math.PI * 2);
  ctx.arc(-14, -14, 42, 0, Math.PI * 2);
  ctx.arc(28, -6, 36, 0, Math.PI * 2);
  ctx.arc(52, 12, 26, 0, Math.PI * 2);
  ctx.roundRect(-52, 6, 114, 34, 17);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-14, -14, 41, Math.PI * 1.05, Math.PI * 1.9);
  ctx.stroke();

  if (smiling) {
    // Cute kawaii eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-14, 10, 4.2, 0, Math.PI * 2);
    ctx.arc(16, 10, 4.2, 0, Math.PI * 2);
    ctx.fill();
    // Eye highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-15.5, 8.5, 1.5, 0, Math.PI * 2);
    ctx.arc(14.5, 8.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Rosy cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-25, 17, 7, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse(27, 17, 7, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Little smile
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(1, 13, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBalloon(ctx, cx, cy, rx, ry, color, tilt = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  // Curly string
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, ry + 8);
  ctx.bezierCurveTo(-14, ry + 36, 16, ry + 64, -6, ry + 96);
  ctx.stroke();

  // Balloon body
  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Balloon knot
  ctx.beginPath();
  ctx.moveTo(-6, ry + 8);
  ctx.lineTo(6, ry + 8);
  ctx.lineTo(0, ry - 2);
  ctx.closePath();
  ctx.fill();

  // Glossy shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
  ctx.beginPath();
  ctx.ellipse(-rx * 0.34, -ry * 0.28, rx * 0.18, ry * 0.32, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBuntingFlags(ctx, startX, startY, endX, endY, colors, count = 6) {
  ctx.save();
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 + 44;

  // Rope
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(midX, midY, endX, endY);
  ctx.stroke();

  for (let i = 0; i < count; i++) {
    const t1 = (i + 0.12) / count;
    const t2 = (i + 0.88) / count;
    const tm = (t1 + t2) / 2;
    const pt = (t) => ({
      x: (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX,
      y: (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY
    });
    const p1 = pt(t1);
    const p2 = pt(t2);
    const pm = pt(tm);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const tipX = pm.x - Math.sin(angle) * 34;
    const tipY = pm.y + Math.cos(angle) * 34;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(tipX, tipY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlanet(ctx, cx, cy, r, bodyColor, ringColor, tilt = -0.32) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  // Back ring half
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.9, r * 0.52, 0, Math.PI, Math.PI * 2);
  ctx.stroke();

  // Planet sphere
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.6, bodyColor);
  grad.addColorStop(1, '#9a3412');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Cute planet stripe
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(-r, -r * 0.25, r * 2, r * 0.22);
  ctx.fillRect(-r, r * 0.2, r * 2, r * 0.16);
  ctx.restore();

  // Front ring half
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.9, r * 0.52, 0, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawRocket(ctx, cx, cy, scale = 1, angle = -0.55) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // Flame
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(-16, 48);
  ctx.quadraticCurveTo(0, 96, 16, 48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(-9, 48);
  ctx.quadraticCurveTo(0, 76, 9, 48);
  ctx.closePath();
  ctx.fill();

  // Side fins
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(-24, 14);
  ctx.lineTo(-46, 52);
  ctx.lineTo(-18, 44);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(24, 14);
  ctx.lineTo(46, 52);
  ctx.lineTo(18, 44);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -64);
  ctx.bezierCurveTo(30, -28, 32, 22, 20, 48);
  ctx.lineTo(-20, 48);
  ctx.bezierCurveTo(-32, 22, -30, -28, 0, -64);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Nose cone
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(0, -64);
  ctx.quadraticCurveTo(15, -42, 18, -28);
  ctx.lineTo(-18, -28);
  ctx.quadraticCurveTo(-15, -42, 0, -64);
  ctx.closePath();
  ctx.fill();

  // Window
  ctx.fillStyle = '#38bdf8';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawCrown(ctx, cx, cy, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
  ctx.shadowBlur = 16;
  const grad = ctx.createLinearGradient(0, -45, 0, 35);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.5, '#fbbf24');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(-54, 28);
  ctx.lineTo(-64, -22);
  ctx.lineTo(-26, 2);
  ctx.lineTo(0, -42);
  ctx.lineTo(26, 2);
  ctx.lineTo(64, -22);
  ctx.lineTo(54, 28);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Gems
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(0, -42, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(-64, -22, 6, 0, Math.PI * 2);
  ctx.arc(64, -22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(0, 12, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.arc(-28, 14, 5, 0, Math.PI * 2);
  ctx.arc(28, 14, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawButterfly(ctx, cx, cy, scale = 1, wingA = '#f472b6', wingB = '#c084fc', tilt = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  // Upper wings
  ctx.fillStyle = wingA;
  ctx.beginPath();
  ctx.ellipse(-22, -12, 24, 18, -0.45, 0, Math.PI * 2);
  ctx.ellipse(22, -12, 24, 18, 0.45, 0, Math.PI * 2);
  ctx.fill();
  // Lower wings
  ctx.fillStyle = wingB;
  ctx.beginPath();
  ctx.ellipse(-16, 14, 16, 13, 0.4, 0, Math.PI * 2);
  ctx.ellipse(16, 14, 16, 13, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Wing dots
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(-24, -14, 6, 0, Math.PI * 2);
  ctx.arc(24, -14, 6, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillStyle = '#4a044e';
  ctx.beginPath();
  ctx.ellipse(0, 2, 5, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  // Antennae
  ctx.strokeStyle = '#4a044e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-2, -18);
  ctx.quadraticCurveTo(-12, -34, -18, -30);
  ctx.moveTo(2, -18);
  ctx.quadraticCurveTo(12, -34, 18, -30);
  ctx.stroke();

  ctx.restore();
}

function drawFlower(ctx, cx, cy, r = 18, petalColor = '#f472b6', centerColor = '#facc15') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = petalColor;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72, r * 0.56, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGear(ctx, cx, cy, outerR, color) {
  ctx.save();
  ctx.translate(cx, cy);
  const teeth = 8;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outerR : outerR * 0.75;
    const a = (i * Math.PI) / teeth;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, outerR * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCuteRobot(ctx, cx, cy, scale = 1, tilt = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  // Antenna
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(0, -68);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, -72, 10, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.roundRect(-58, -16, 14, 30, 7);
  ctx.roundRect(44, -16, 14, 30, 7);
  ctx.fill();

  // Head
  ctx.shadowColor = 'rgba(2, 132, 199, 0.25)';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(-46, -44, 92, 82, 24);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = 'transparent';

  // Face screen
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(-34, -28, 68, 48, 14);
  ctx.fill();

  // Glowing happy eyes
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(-14, -8, 8, 0, Math.PI * 2);
  ctx.arc(14, -8, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-16, -10, 3, 0, Math.PI * 2);
  ctx.arc(12, -10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Happy smile
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 3, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawCodeBlock(ctx, x, y, text, color, tilt = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-62, -22, 124, 44, 14);
  ctx.fill();
  // Puzzle notch
  ctx.beginPath();
  ctx.arc(-20, -22, 10, Math.PI, 0);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 20px "Alexandria", "Tajawal", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 2);
  ctx.restore();
}

function drawSmilingSun(ctx, cx, cy, r = 46) {
  ctx.save();
  ctx.translate(cx, cy);

  // Rays
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (r + 10), Math.sin(a) * (r + 10));
    ctx.lineTo(Math.cos(a) * (r + 24), Math.sin(a) * (r + 24));
    ctx.stroke();
  }

  // Sun circle
  const g = ctx.createRadialGradient(-10, -10, 6, 0, 0, r);
  g.addColorStop(0, '#fef08a');
  g.addColorStop(1, '#f59e0b');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Cute face
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(-14, -4, 4.5, 0, Math.PI * 2);
  ctx.arc(14, -4, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-22, 7, 7, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(22, 7, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 4, 11, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawGradCap(ctx, cx, cy, scale = 1, tilt = -0.06) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 14;

  // Base cap
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(-42, 4);
  ctx.lineTo(-42, 26);
  ctx.quadraticCurveTo(0, 42, 42, 26);
  ctx.lineTo(42, 4);
  ctx.closePath();
  ctx.fill();

  // Top diamond board
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(74, 0);
  ctx.lineTo(0, 26);
  ctx.lineTo(-74, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Golden tassel
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(54, 10);
  ctx.lineTo(58, 42);
  ctx.stroke();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(58, 46, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLaurelBranch(ctx, cx, cy, height, side = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(side, 1);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.45);
  ctx.quadraticCurveTo(-48, 0, 0, -height * 0.45);
  ctx.stroke();

  ctx.fillStyle = 'rgba(253, 224, 71, 0.78)';
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = -Math.sin(t * Math.PI) * 26;
    const y = height * 0.42 - t * height * 0.84;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.6 + t * 0.4);
    ctx.beginPath();
    ctx.ellipse(-10, 0, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate(1.1);
    ctx.beginPath();
    ctx.ellipse(10, 0, 13, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// ---------- Theme Background & Foreground Scene Decorators ----------

function drawThemeBackgroundDecor(ctx, theme, W, H, isStory) {
  const id = theme.id;

  if (id === 'rainbow') {
    // Sweeping pastel rainbow behind top header
    const bands = ['#fca5a5', '#fdba74', '#fde047', '#86efac', '#7dd3fc', '#d8b4fe'];
    const rCenterY = isStory ? 480 : 320;
    const baseR = isStory ? 540 : 470;
    ctx.save();
    ctx.globalAlpha = 0.42;
    bands.forEach((col, i) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.arc(W / 2, rCenterY, baseR - i * 22, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    // Soft pastel polka dots
    const dotColors = ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#a78bfa'];
    for (let i = 0; i < 24; i++) {
      const px = ((i * 197 + 60) % (W - 100)) + 50;
      const py = ((i * 263 + 80) % (H - 120)) + 60;
      ctx.fillStyle = dotColors[i % dotColors.length];
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(px, py, 8 + (i % 4) * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Bunting flags at top corners
    drawBuntingFlags(ctx, 40, 56, 320, 128, ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399', '#a855f7'], 5);
    drawBuntingFlags(ctx, W - 320, 128, W - 40, 56, ['#a855f7', '#34d399', '#38bdf8', '#fbbf24', '#f43f5e'], 5);

    // Kawaii clouds
    drawCuteCloud(ctx, 130, isStory ? 470 : 285, 0.92, true);
    drawCuteCloud(ctx, W - 135, isStory ? 1160 : 690, 0.88, true);
    drawStar(ctx, W - 110, isStory ? 440 : 250, 5, 24, 11, '#fbbf24', '#ffffff', 3);
    drawStar(ctx, 110, isStory ? 1240 : 745, 5, 22, 10, '#f472b6', '#ffffff', 3);
  } else if (id === 'party') {
    // Festive bunting
    drawBuntingFlags(ctx, 36, 52, 360, 140, ['#f43f5e', '#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6'], 6);
    drawBuntingFlags(ctx, W - 360, 140, W - 36, 52, ['#8b5cf6', '#10b981', '#0ea5e9', '#f59e0b', '#f43f5e'], 6);

    // Floating glossy balloons
    drawBalloon(ctx, 96, isStory ? 480 : 300, 38, 48, '#fb7185', -0.18);
    drawBalloon(ctx, 148, isStory ? 550 : 365, 30, 38, '#38bdf8', 0.12);
    drawBalloon(ctx, W - 96, isStory ? 490 : 305, 38, 48, '#fbbf24', 0.16);
    drawBalloon(ctx, W - 148, isStory ? 560 : 372, 30, 38, '#a855f7', -0.14);

    if (isStory) {
      drawBalloon(ctx, 105, 1320, 34, 44, '#34d399', -0.12);
      drawBalloon(ctx, W - 105, 1330, 34, 44, '#f472b6', 0.15);
    }

    // Confetti pieces
    const cColors = ['#f43f5e', '#f59e0b', '#0ea5e9', '#10b981', '#a855f7'];
    for (let i = 0; i < 36; i++) {
      const cx = ((i * 173 + 50) % (W - 80)) + 40;
      const cy = ((i * 227 + 60) % (H - 100)) + 50;
      // Keep center clear
      if (cx > 220 && cx < W - 220 && cy > (isStory ? 440 : 210) && cy < (isStory ? 1280 : 760)) continue;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(i * 0.7);
      ctx.fillStyle = cColors[i % cColors.length];
      ctx.globalAlpha = 0.72;
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-10, -4, 20, 8);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  } else if (id === 'space') {
    // Soft glowing nebulae
    const drawNebula = (x, y, r, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    drawNebula(200, 260, 260, 'rgba(56, 189, 248, 0.22)');
    drawNebula(W - 180, H * 0.65, 280, 'rgba(168, 85, 247, 0.24)');
    drawNebula(W / 2, H * 0.45, 420, 'rgba(14, 165, 233, 0.16)');

    // Twinkling stars
    for (let i = 0; i < 55; i++) {
      const sx = ((i * 193 + 45) % (W - 90)) + 45;
      const sy = ((i * 271 + 45) % (H - 90)) + 45;
      const r = 1.5 + (i % 4) * 1.1;
      ctx.fillStyle = i % 5 === 0 ? '#fde047' : i % 3 === 0 ? '#bae6fd' : '#ffffff';
      ctx.globalAlpha = 0.45 + (i % 5) * 0.11;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Orbital dashed arc
    ctx.save();
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.22)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.ellipse(W / 2, isStory ? 850 : 475, 480, isStory ? 470 : 320, -0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Saturn planet & crescent moon & rocket (positioned cleanly clear of corner stickers)
    drawPlanet(ctx, 118, isStory ? 390 : 210, 38, '#f97316', '#fde047', -0.28);
    // Crescent moon top-right
    ctx.save();
    ctx.translate(W - 110, isStory ? 380 : 205);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#12255b';
    ctx.beginPath();
    ctx.arc(-13, -7, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    drawRocket(ctx, 96, isStory ? 1340 : 845, 0.78, -0.58);
    drawFourPointSparkle(ctx, W - 98, isStory ? 1310 : 845, 22, '#fde047');
    drawFourPointSparkle(ctx, W - 210, isStory ? 360 : 195, 16, '#38bdf8');
  } else if (id === 'princess') {
    // Soft pastel fairy bubbles
    const bubbles = [
      [140, 240, 110, 'rgba(244, 114, 182, 0.14)'],
      [W - 150, 310, 130, 'rgba(192, 132, 252, 0.16)'],
      [160, H - 240, 140, 'rgba(251, 191, 36, 0.13)'],
      [W - 140, H - 260, 120, 'rgba(244, 114, 182, 0.14)']
    ];
    bubbles.forEach(([x, y, r, c]) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Butterflies & flowers & fairy sparkles
    drawButterfly(ctx, 112, isStory ? 475 : 295, 1.0, '#f472b6', '#c084fc', -0.25);
    drawButterfly(ctx, W - 112, isStory ? 1165 : 675, 0.96, '#c084fc', '#fb7185', 0.25);
    drawFlower(ctx, W - 108, isStory ? 465 : 270, 22, '#f9a8d4', '#fde047');
    drawFlower(ctx, 108, isStory ? 1235 : 725, 22, '#d8b4fe', '#fde047');
    drawFlower(ctx, 92, isStory ? 1660 : 940, 18, '#fda4af', '#fef08a');
    drawFlower(ctx, W - 92, isStory ? 1660 : 940, 18, '#f9a8d4', '#fef08a');

    for (let i = 0; i < 14; i++) {
      const sx = ((i * 211 + 80) % (W - 140)) + 70;
      const sy = ((i * 293 + 90) % (H - 160)) + 80;
      if (sx > 210 && sx < W - 210 && sy > (isStory ? 450 : 220) && sy < (isStory ? 1260 : 750)) continue;
      drawFourPointSparkle(ctx, sx, sy, 12 + (i % 3) * 5, i % 2 === 0 ? '#fbbf24' : '#ec4899');
    }
  } else if (id === 'robot') {
    // Blueprint tech dot grid
    ctx.fillStyle = 'rgba(2, 132, 199, 0.14)';
    for (let x = 60; x < W - 40; x += 48) {
      for (let y = 60; y < H - 40; y += 48) {
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Colorful gears
    drawGear(ctx, 102, isStory ? 460 : 275, 36, 'rgba(56, 189, 248, 0.45)');
    drawGear(ctx, 148, isStory ? 515 : 322, 22, 'rgba(251, 191, 36, 0.65)');
    drawGear(ctx, W - 102, isStory ? 1220 : 720, 38, 'rgba(99, 102, 241, 0.36)');

    // Scratch-like playful coding blocks
    drawCodeBlock(ctx, W - 122, isStory ? 445 : 265, 'ابدأ ▶', '#f59e0b', 0.1);
    drawCodeBlock(ctx, 122, isStory ? 1230 : 720, 'أبدع! 🚀', '#10b981', -0.09);

    // Friendly cartoon robot
    drawCuteRobot(ctx, W - 115, isStory ? 1560 : 880, 0.68, 0.08);
  } else if (id === 'superhero') {
    // Dynamic comic sunburst behind photo center
    const cx = W / 2;
    const cy = isStory ? 850 : 475;
    ctx.save();
    ctx.translate(cx, cy);
    const rays = 18;
    for (let i = 0; i < rays; i++) {
      const a1 = (i * Math.PI * 2) / rays;
      const a2 = a1 + Math.PI / rays;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(59, 130, 246, 0.09)' : 'rgba(250, 204, 21, 0.14)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(W, H), a1, a2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Comic lightning bolts
    const drawBolt = (x, y, scale, color, tilt) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(8, -42);
      ctx.lineTo(-22, 4);
      ctx.lineTo(-2, 4);
      ctx.lineTo(-14, 44);
      ctx.lineTo(24, -6);
      ctx.lineTo(4, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    drawBolt(105, isStory ? 470 : 285, 0.9, '#facc15', -0.2);
    drawBolt(W - 105, isStory ? 470 : 285, 0.9, '#ef4444', 0.22);
    drawStar(ctx, 112, isStory ? 1230 : 725, 8, 32, 18, '#facc15', '#1d4ed8', 4);
    drawStar(ctx, W - 112, isStory ? 1230 : 725, 8, 32, 18, '#38bdf8', '#1d4ed8', 4);
  } else if (id === 'nature') {
    // Rolling soft green hills at bottom
    ctx.save();
    ctx.fillStyle = 'rgba(134, 239, 172, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H - (isStory ? 340 : 200));
    ctx.quadraticCurveTo(W * 0.28, H - (isStory ? 440 : 265), W * 0.6, H - (isStory ? 310 : 185));
    ctx.quadraticCurveTo(W * 0.82, H - (isStory ? 240 : 145), W, H - (isStory ? 330 : 200));
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(52, 211, 153, 0.34)';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H - (isStory ? 230 : 130));
    ctx.quadraticCurveTo(W * 0.5, H - (isStory ? 340 : 210), W, H - (isStory ? 220 : 130));
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Smiling sun & happy clouds
    drawSmilingSun(ctx, W - 118, isStory ? 445 : 262, 42);
    drawCuteCloud(ctx, 128, isStory ? 460 : 275, 0.84, true);

    // Meadow flowers & butterflies
    drawFlower(ctx, 108, H - (isStory ? 270 : 165), 22, '#fb7185', '#fde047');
    drawFlower(ctx, 175, H - (isStory ? 220 : 120), 17, '#facc15', '#ffffff');
    drawFlower(ctx, W - 108, H - (isStory ? 265 : 165), 22, '#a78bfa', '#fde047');
    drawFlower(ctx, W - 175, H - (isStory ? 215 : 120), 17, '#38bdf8', '#fef08a');
    drawButterfly(ctx, 112, isStory ? 1200 : 700, 0.85, '#fbbf24', '#f97316', -0.2);
  } else if (id === 'royal') {
    // Royal golden radial aura behind photo
    const aura = ctx.createRadialGradient(W / 2, isStory ? 850 : 475, 40, W / 2, isStory ? 850 : 475, 470);
    aura.addColorStop(0, 'rgba(251, 191, 36, 0.24)');
    aura.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, H);

    // Golden laurels framing sides
    drawLaurelBranch(ctx, 102, isStory ? 850 : 480, isStory ? 640 : 440, 1);
    drawLaurelBranch(ctx, W - 102, isStory ? 850 : 480, isStory ? 640 : 440, -1);

    // Golden sparkles
    for (let i = 0; i < 20; i++) {
      const sx = ((i * 229 + 70) % (W - 140)) + 70;
      const sy = ((i * 281 + 70) % (H - 140)) + 70;
      if (sx > 210 && sx < W - 210 && sy > (isStory ? 440 : 210) && sy < (isStory ? 1270 : 755)) continue;
      drawFourPointSparkle(ctx, sx, sy, 10 + (i % 3) * 5, i % 3 === 0 ? '#bae6fd' : '#fde047');
    }
  }
}

// ---------- Photo Clipping Shapes ----------

function tracePhotoShapePath(ctx, shape, box) {
  const { x, y, w, h } = box;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.beginPath();
  if (shape === 'circle') {
    const r = Math.min(w, h) / 2;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (shape === 'arch') {
    const r = w / 2;
    const archCenterY = y + Math.min(r * 0.72, h * 0.44);
    ctx.moveTo(x, y + h - 38);
    ctx.lineTo(x, archCenterY);
    ctx.bezierCurveTo(x, y - 8, x + w, y - 8, x + w, archCenterY);
    ctx.lineTo(x + w, y + h - 38);
    ctx.quadraticCurveTo(x + w, y + h, x + w - 38, y + h);
    ctx.lineTo(x + 38, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - 38);
    ctx.closePath();
  } else if (shape === 'heart') {
    const s = Math.min(w, h) * 0.98;
    const topY = cy - s * 0.44;
    ctx.moveTo(cx, cy + s * 0.48);
    ctx.bezierCurveTo(cx - s * 0.62, cy + s * 0.12, cx - s * 0.56, topY - s * 0.04, cx - s * 0.25, topY);
    ctx.bezierCurveTo(cx - s * 0.08, topY + s * 0.02, cx, topY + s * 0.16, cx, topY + s * 0.22);
    ctx.bezierCurveTo(cx, topY + s * 0.16, cx + s * 0.08, topY + s * 0.02, cx + s * 0.25, topY);
    ctx.bezierCurveTo(cx + s * 0.56, topY - s * 0.04, cx + s * 0.62, cy + s * 0.12, cx, cy + s * 0.48);
    ctx.closePath();
  } else if (shape === 'scallop') {
    // Playful wavy cloud / stamp scalloped rounded box
    const rx = w / 2 - 14;
    const ry = h / 2 - 14;
    const lobes = 16;
    const amp = 14;
    const steps = 220;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      // Superellipse (squircle) + scalloped wave
      const exp = 0.72;
      const sx = Math.sign(cosA) * Math.pow(Math.abs(cosA), exp);
      const sy = Math.sign(sinA) * Math.pow(Math.abs(sinA), exp);
      const wave = Math.abs(Math.sin(a * (lobes / 2))) * amp;
      const px = cx + sx * (rx + wave);
      const py = cy + sy * (ry + wave);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    ctx.roundRect(x, y, w, h, 44);
  }
}

// ---------- Vinyl Die-Cut Sticker Badge ----------

function drawStickerMedallion(ctx, stickerId, cx, cy, radius, tilt = 0) {
  const sticker = FRAME_STICKERS.find((s) => s.id === stickerId);
  if (!sticker) return;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  // Outer white die-cut sticker rim + drop shadow
  ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = sticker.bg;
  ctx.strokeStyle = sticker.border;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Crisp emoji centered
  ctx.font = `${Math.round(radius * 1.08)}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sticker.emoji, 0, 3);

  ctx.restore();
}

// ---------- Auto-fit Arabic text helper ----------

function drawFittedText(ctx, text, x, y, maxWidth, startSize, minSize, fontWeight = '900', fontFamily = '"Alexandria", "Tajawal", sans-serif') {
  let size = startSize;
  ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 2;
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  }
  ctx.fillText(text, x, y);
}

// ---------- Main Exported Render Function ----------

export async function renderGraduationFrameToCanvas(canvas, options) {
  const {
    theme,
    format = 'square',
    photoSrc,
    heroName = 'بطل مبادرة 1001 طفل رقمي',
    subtitle = 'خريج الدفعة الأولى • قصر الثقافة – النجف الأشرف',
    badge = '🎓 خريج الدفعة الأولى • 1001 طفل رقمي',
    photoShape = 'rounded',
    photoFilter = 'natural',
    photoZoom = 1,
    photoOffsetX = 0,
    photoOffsetY = 0,
    stickers = []
  } = options;

  const isStory = format === 'story';
  const W = 1080;
  const H = isStory ? 1920 : 1080;

  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Wait briefly for web fonts if available
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 250))]);
    } catch {
      // ignore
    }
  }

  // Load images in parallel (cached)
  const [photoImg, logo1001, logoAbdaa, logoMasdar] = await Promise.all([
    loadImageCached(photoSrc),
    loadImageCached('/brand/logo-1001-kids.png'),
    loadImageCached('/brand/abdaa-logo.png'),
    loadImageCached('/brand/masdar-logo-full-clean.png')
  ]);

  ctx.save();
  ctx.direction = 'rtl';

  // 1. Background multi-stop gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, theme.bgStops[0]);
  bgGrad.addColorStop(0.52, theme.bgStops[1]);
  bgGrad.addColorStop(1, theme.bgStops[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Theme custom playful vector scenery
  drawThemeBackgroundDecor(ctx, theme, W, H, isStory);

  // 3. Outer double playful frame border
  ctx.save();
  ctx.strokeStyle = theme.outerBorder;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.roundRect(22, 22, W - 44, H - 44, isStory ? 62 : 52);
  ctx.stroke();

  ctx.strokeStyle = theme.innerBorder;
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.roundRect(40, 40, W - 80, H - 80, isStory ? 50 : 40);
  ctx.stroke();
  ctx.restore();

  // 4. Top Official Logos Header
  const topY = isStory ? 74 : 54;
  const pillH = isStory ? 74 : 62;

  // Abdaa Logo Pill (Top Right)
  if (logoAbdaa?.width) {
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.roundRect(W - 154, topY, 96, pillH, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    const ih = pillH - 14;
    const iw = Math.min((logoAbdaa.width / logoAbdaa.height) * ih, 78);
    ctx.drawImage(logoAbdaa, W - 154 + (96 - iw) / 2, topY + (pillH - ih) / 2, iw, ih);
    ctx.restore();
  }

  // Masdar Logo Pill (Top Left)
  if (logoMasdar?.width) {
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.roundRect(58, topY, 152, pillH, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    const maxW = 128;
    const maxH = pillH - 18;
    const ratio = Math.min(maxW / logoMasdar.width, maxH / logoMasdar.height);
    const iw = logoMasdar.width * ratio;
    const ih = logoMasdar.height * ratio;
    ctx.drawImage(logoMasdar, 58 + (152 - iw) / 2, topY + (pillH - ih) / 2, iw, ih);
    ctx.restore();
  }

  // 1001 Initiative Center Logo (with luminous white pill on dark themes for crisp contrast)
  if (logo1001?.width) {
    const logoH = isStory ? 124 : 84;
    const logoW = (logo1001.width / logo1001.height) * logoH;
    const logoY = isStory ? 150 : 48;
    ctx.save();
    if (theme.isDark) {
      ctx.shadowColor = 'rgba(251, 191, 36, 0.32)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.beginPath();
      ctx.roundRect((W - logoW) / 2 - 22, logoY - 8, logoW + 44, logoH + 16, 26);
      ctx.fill();
      ctx.shadowColor = 'transparent';
    } else {
      ctx.shadowColor = 'rgba(2, 132, 199, 0.16)';
      ctx.shadowBlur = 16;
    }
    ctx.drawImage(logo1001, (W - logoW) / 2, logoY, logoW, logoH);
    ctx.restore();
  }

  // Header Title
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.titleColor;
  if (isStory) {
    drawFittedText(ctx, 'احتفالية تخرج مبادرة «1001» طفل رقمي', W / 2, 322, 920, 40, 26);
    ctx.fillStyle = theme.subtitleColor;
    drawFittedText(ctx, 'الدفعة الأولى • نادي أبدع للمهارات الذكية – النجف الأشرف', W / 2, 372, 920, 25, 18, '700', '"Tajawal", sans-serif');
  } else {
    drawFittedText(ctx, 'احتفالية تخرج مبادرة «1001» طفل رقمي • نادي أبدع للمهارات الذكية', W / 2, 166, 920, 28, 20, '800');
  }

  // 5. Center Photo Frame Box (with extra top breathing room when crown/grad-cap topper is active)
  const hasTopper = theme.id === 'princess' || theme.id === 'royal';
  const topPad = hasTopper ? (isStory ? 24 : 20) : 0;
  const photoBox = isStory
    ? { x: 120, y: 444 + topPad, w: 840, h: 786 - topPad }
    : { x: 145, y: 204 + topPad, w: 790, h: 522 - topPad };

  // Soft outer glow behind photo
  ctx.save();
  ctx.shadowColor = theme.photoGlow;
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 12;
  tracePhotoShapePath(ctx, photoShape, photoBox);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Clip & draw photo with user zoom, pan, and color filter
  ctx.save();
  tracePhotoShapePath(ctx, photoShape, photoBox);
  ctx.clip();

  if (photoImg && photoImg.width && photoImg.height) {
    const filterObj = PHOTO_FILTERS.find((f) => f.id === photoFilter);
    if (filterObj && filterObj.css !== 'none' && 'filter' in ctx) {
      ctx.filter = filterObj.css;
    }
    const baseScale = Math.max(photoBox.w / photoImg.width, photoBox.h / photoImg.height);
    const scale = baseScale * Math.max(0.85, Math.min(2.6, photoZoom));
    const drawW = photoImg.width * scale;
    const drawH = photoImg.height * scale;
    const drawX = photoBox.x + (photoBox.w - drawW) / 2 + photoOffsetX;
    const drawY = photoBox.y + (photoBox.h - drawH) / 2 + photoOffsetY;
    ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
    ctx.filter = 'none';
  } else {
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(photoBox.x, photoBox.y, photoBox.w, photoBox.h);
  }
  ctx.restore();

  // Double Crisp Sticker-Like White + Theme Frame Border around photo
  ctx.save();
  tracePhotoShapePath(ctx, photoShape, photoBox);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 18;
  ctx.stroke();

  tracePhotoShapePath(ctx, photoShape, photoBox);
  ctx.strokeStyle = theme.photoStroke;
  ctx.lineWidth = 9;
  ctx.stroke();
  ctx.restore();

  // Theme Crown / Grad Cap Hero Topper cleanly nested at top center of the photo frame
  const topperY = photoShape === 'heart' ? photoBox.y + (isStory ? 54 : 34) : photoBox.y - 4;
  if (theme.id === 'princess') {
    drawCrown(ctx, W / 2, topperY, isStory ? 0.84 : 0.72);
  } else if (theme.id === 'royal') {
    drawGradCap(ctx, W / 2, topperY, isStory ? 0.88 : 0.74, -0.05);
  }

  // 6. User-Selected Playful Corner Stickers (up to 4 positions around photo)
  const stickerRadius = isStory ? 48 : 40;
  const cornerSlots = [
    { x: photoBox.x + photoBox.w - 16, y: photoBox.y + 18, tilt: 0.16 },
    { x: photoBox.x + 16, y: photoBox.y + 18, tilt: -0.16 },
    { x: photoBox.x + photoBox.w - 14, y: photoBox.y + photoBox.h - 28, tilt: -0.14 },
    { x: photoBox.x + 14, y: photoBox.y + photoBox.h - 28, tilt: 0.14 }
  ];
  stickers.slice(0, 4).forEach((stickerId, idx) => {
    const slot = cornerSlots[idx];
    if (slot) {
      drawStickerMedallion(ctx, stickerId, slot.x, slot.y, stickerRadius, slot.tilt);
    }
  });

  // 7. Graduation Badge Ribbon overlapping bottom of photo
  const badgeY = isStory ? 1244 : 736;
  const badgeH = isStory ? 78 : 64;
  ctx.save();
  ctx.font = `900 ${isStory ? 30 : 26}px "Alexandria", "Tajawal", sans-serif`;
  const cleanBadge = (badge || '🎓 خريج الدفعة الأولى • 1001 طفل رقمي').trim();
  const measuredBadgeW = ctx.measureText(cleanBadge).width + 86;
  const badgeW = Math.max(520, Math.min(860, measuredBadgeW));
  const badgeX = (W - badgeW) / 2;

  ctx.shadowColor = 'rgba(15, 23, 42, 0.24)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  const bGrad = ctx.createLinearGradient(badgeX, badgeY - badgeH / 2, badgeX + badgeW, badgeY + badgeH / 2);
  bGrad.addColorStop(0, theme.badgeBg[0]);
  bGrad.addColorStop(1, theme.badgeBg[1]);
  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY - badgeH / 2, badgeW, badgeH, badgeH / 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = theme.badgeText;
  drawFittedText(ctx, cleanBadge, W / 2, badgeY + 2, badgeW - 44, isStory ? 30 : 26, 18, '900');
  ctx.restore();

  // 8. Child Name & Proud Subtitle Card
  const nameCardX = isStory ? 96 : 112;
  const nameCardW = W - nameCardX * 2;
  const nameCardY = isStory ? 1350 : 792;
  const nameCardH = isStory ? 228 : 146;

  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = theme.nameBg;
  ctx.beginPath();
  ctx.roundRect(nameCardX, nameCardY, nameCardW, nameCardH, isStory ? 44 : 34);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = theme.nameBorder;
  ctx.lineWidth = 4.5;
  ctx.stroke();

  // Decorative mini stars inside name card flanks
  drawStar(ctx, nameCardX + 42, nameCardY + nameCardH / 2, 5, 16, 7, '#fbbf24');
  drawStar(ctx, nameCardX + nameCardW - 42, nameCardY + nameCardH / 2, 5, 16, 7, '#fbbf24');

  const displayHeroName = (heroName || '').trim() || 'بطل مبادرة 1001 طفل رقمي';
  const displaySubtitle = (subtitle || '').trim();

  ctx.fillStyle = theme.nameColor;
  if (displaySubtitle) {
    drawFittedText(
      ctx,
      displayHeroName,
      W / 2,
      nameCardY + (isStory ? 84 : 56),
      nameCardW - 120,
      isStory ? 54 : 44,
      26,
      '900'
    );
    ctx.fillStyle = theme.subtitleColor;
    drawFittedText(
      ctx,
      displaySubtitle,
      W / 2,
      nameCardY + (isStory ? 156 : 108),
      nameCardW - 110,
      isStory ? 28 : 22,
      16,
      '700',
      '"Tajawal", sans-serif'
    );
  } else {
    drawFittedText(
      ctx,
      displayHeroName,
      W / 2,
      nameCardY + nameCardH / 2 + 2,
      nameCardW - 120,
      isStory ? 56 : 46,
      26,
      '900'
    );
  }
  ctx.restore();

  // 9. Extra Celebration Stamp for Story Format
  if (isStory) {
    ctx.save();
    ctx.fillStyle = theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.88)';
    ctx.strokeStyle = theme.outerBorder;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(W / 2 - 260, 1608, 520, 60, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.titleColor;
    drawFittedText(ctx, '✨ يوم الجمعة 27/11/2026 • قصر الثقافة ✨', W / 2, 1639, 480, 24, 18, '800');
    ctx.restore();
  }

  // 10. Official Organizers Footer (clean breathing space above inner dashed border)
  ctx.save();
  ctx.fillStyle = theme.footerColor;
  const footerY = isStory ? 1734 : 990;
  drawFittedText(
    ctx,
    'المؤسس المنظم: نادي أبدع للمهارات الذكية  •  الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات',
    W / 2,
    footerY,
    920,
    isStory ? 24 : 21,
    15,
    '800',
    '"Tajawal", sans-serif'
  );
  if (isStory) {
    ctx.globalAlpha = 0.88;
    ctx.direction = 'ltr';
    drawFittedText(ctx, 'abdaa.masdar.company/frame', W / 2, 1794, 600, 24, 18, '800', '"Alexandria", sans-serif');
  }
  ctx.restore();

  ctx.restore();
}
