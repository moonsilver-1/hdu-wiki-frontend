// 站点吉祥物：小山羊 Wiki 形象（用户提供的头像图）。
// 之前的手绘 SVG 小羊已被替换；四角星光装饰仍由 Sparkle 导出。
export default function WikiMascot() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mascot-wiki-256.png"
      alt="HDU Wiki 吉祥物小羊"
      draggable={false}
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
    />
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
