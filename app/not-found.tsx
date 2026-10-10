import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">
          404
        </h1>
        <p className="text-lg text-[var(--color-muted)] mb-6">
          页面未找到
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
