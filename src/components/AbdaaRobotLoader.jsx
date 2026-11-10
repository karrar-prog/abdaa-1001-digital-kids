import React from 'react';

/**
 * أيقونة التحميل الطفولية المتحركة المشتقة جرافيكياً من شعار نادي أبدع
 * (نصف الدماغ البرتقالي المبتسم ينبض ويغمز + نصف الترس الهندسي يدور + الهوائي يشع طاقة)
 */
export default function AbdaaRobotLoader({
  label = 'جارٍ تجهيز مختبر أبدع الذكي...',
  compact = false
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center select-none ${
        compact ? 'py-8' : 'py-16'
      }`}
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        {/* Glowing Aura Behind Robot */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-sky-400/35 via-amber-400/25 to-blue-500/30 blur-xl animate-pulse" />

        {/* Animated Vector Abdaa Club Robot Logo */}
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(21,57,91,0.18)] animate-float-slow"
        >
          <defs>
            <clipPath id="loaderHeadClip">
              <path d="M 236 164 L 276 164 C 356 164 412 220 412 300 L 412 362 C 412 392 388 414 358 414 L 154 414 C 124 414 100 392 100 362 L 100 300 C 100 220 156 164 236 164 Z" />
            </clipPath>
            <clipPath id="loaderRightGearClip">
              <rect x="274" y="180" width="138" height="225" />
            </clipPath>
          </defs>

          {/* Pulsing Energy Ring on Antenna */}
          <circle
            cx="256"
            cy="84"
            r="46"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="6"
            className=" opacity-60 animate-ping"
            style={{ transformOrigin: '256px 84px', animationDuration: '1.8s' }}
          />

          {/* Antenna */}
          <line
            x1="256"
            y1="116"
            x2="256"
            y2="164"
            stroke="#15395b"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <circle
            cx="256"
            cy="84"
            r="34"
            fill="#54c1de"
            stroke="#15395b"
            strokeWidth="24"
          />

          {/* Left & Right Ears */}
          <rect
            x="52"
            y="256"
            width="54"
            height="104"
            rx="24"
            fill="#54c1de"
            stroke="#15395b"
            strokeWidth="24"
            strokeLinejoin="round"
          />
          <rect
            x="406"
            y="256"
            width="54"
            height="104"
            rx="24"
            fill="#54c1de"
            stroke="#15395b"
            strokeWidth="24"
            strokeLinejoin="round"
          />

          {/* Split Head Background */}
          <g clipPath="url(#loaderHeadClip)">
            <rect x="90" y="150" width="166" height="280" fill="#86d1e6" />
            <rect x="256" y="150" width="170" height="280" fill="#aae3f2" />
          </g>

          {/* Left Half: Cute Smiling Orange Brain (Bouncing gently) */}
          <g
            style={{
              transformOrigin: '205px 286px',
              animation: 'wiggle-playful 2.2s ease-in-out infinite'
            }}
          >
            <path
              d="M 246 212
                 C 232 198, 206 202, 204 224
                 C 182 216, 162 234, 170 256
                 C 146 262, 144 296, 168 308
                 C 152 326, 166 356, 192 350
                 C 198 372, 232 376, 246 356
                 Z"
              fill="#f38b2a"
              stroke="#15395b"
              strokeWidth="20"
              strokeLinejoin="round"
            />
            {/* Brain Eye */}
            <circle cx="195" cy="292" r="11" fill="#15395b" />
            {/* Brain Smile */}
            <path
              d="M 212 312 Q 228 328 246 318"
              fill="none"
              stroke="#15395b"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </g>

          {/* Right Half: Spinning Orange Gear! */}
          <g clipPath="url(#loaderRightGearClip)">
            <g
              style={{
                transformOrigin: '278px 286px',
                animation: 'spin-slow 4.5s linear infinite'
              }}
            >
              {/* Full 8-tooth gear centered at (278, 286), clipped to right side */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect
                  key={angle}
                  x="264"
                  y="206"
                  width="28"
                  height="160"
                  rx="8"
                  fill="#f38b2a"
                  transform={`rotate(${angle} 278 286)`}
                />
              ))}
              <circle cx="278" cy="286" r="62" fill="#f38b2a" />
              <circle cx="278" cy="286" r="34" fill="#aae3f2" />
            </g>
          </g>
          {/* Gear Center Eye */}
          <circle cx="284" cy="286" r="12" fill="#15395b" />

          {/* Head Outer Navy Border */}
          <path
            d="M 236 164 L 276 164 C 356 164 412 220 412 300 L 412 362 C 412 392 388 414 358 414 L 154 414 C 124 414 100 392 100 362 L 100 300 C 100 220 156 164 236 164 Z"
            fill="none"
            stroke="#15395b"
            strokeWidth="26"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="mt-2 text-xs sm:text-sm font-alexandria font-extrabold text-sky-700 dark:text-sky-300 animate-pulse">
        {label}
      </p>
    </div>
  );
}
