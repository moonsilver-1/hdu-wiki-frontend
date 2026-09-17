// 站点吉祥物：一只头顶发芽的小羊（新生 = 新 "羊"）。
// 纯 SVG，无外部依赖；在深色圆形底上效果最佳。
export default function WikiMascot() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="HDU Wiki 吉祥物小羊">
      {/* 头顶的小芽 */}
      <path
        d="M63 17 C63 11 60.5 8.5 57 7"
        stroke="#6fbf8f"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M57 7 C53 6.5 51 4.3 50.8 1 C55 1.5 57.2 3.5 57 7 Z"
        fill="#7ccb98"
      />
      <circle cx="64.5" cy="11.5" r="2.2" fill="#a5e0ba" />

      {/* 耳朵 */}
      <ellipse cx="25" cy="70" rx="8.5" ry="5.5" fill="#ffe4c8" transform="rotate(-20 25 70)" />
      <ellipse cx="95" cy="70" rx="8.5" ry="5.5" fill="#ffe4c8" transform="rotate(20 95 70)" />

      {/* 蓬松的羊毛 */}
      <g fill="#fdf9ff">
        <circle cx="32" cy="46" r="16" />
        <circle cx="46" cy="34" r="18" />
        <circle cx="63" cy="30" r="19" />
        <circle cx="80" cy="36" r="17" />
        <circle cx="92" cy="50" r="14" />
        <circle cx="25" cy="62" r="13" />
        <circle cx="95" cy="66" r="12" />
        <circle cx="60" cy="48" r="24" />
      </g>

      {/* 脸 */}
      <ellipse cx="60" cy="68" rx="27" ry="23.5" fill="#ffe7cd" />

      {/* 眼睛 */}
      <circle cx="49.5" cy="65" r="3.9" fill="#472b3f" />
      <circle cx="70.5" cy="65" r="3.9" fill="#472b3f" />
      <circle cx="51" cy="63.6" r="1.35" fill="#ffffff" />
      <circle cx="72" cy="63.6" r="1.35" fill="#ffffff" />

      {/* 开心张嘴 */}
      <path
        d="M53.5 72.5 C55 79.5 65 79.5 66.5 72.5 C62 74.6 58 74.6 53.5 72.5 Z"
        fill="#472b3f"
      />

      {/* 腮红 */}
      <ellipse cx="40.5" cy="72.5" rx="4.6" ry="2.7" fill="#ffb7ca" opacity="0.85" />
      <ellipse cx="79.5" cy="72.5" rx="4.6" ry="2.7" fill="#ffb7ca" opacity="0.85" />
    </svg>
  );
}

// 四角星光装饰，用在头像角标和 Hero 背景点缀上。
export function Sparkle({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 1 C13.2 7.8 16.2 10.8 23 12 C16.2 13.2 13.2 16.2 12 23 C10.8 16.2 7.8 13.2 1 12 C7.8 10.8 10.8 7.8 12 1 Z" />
    </svg>
  );
}
