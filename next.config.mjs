/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  distDir: process.env.HDU_NEXT_DIST_DIR || ".next",
};

// bundle-analyzer 仅在本地 ANALYZE=true 时启用，且对未安装做容错（不影响 Vercel 构建）
let config = nextConfig;
if (process.env.ANALYZE === "true") {
  try {
    const { default: bundleAnalyzer } = await import("@next/bundle-analyzer");
    config = bundleAnalyzer({ enabled: true })(nextConfig);
  } catch {
    // @next/bundle-analyzer 未安装，跳过
  }
}

export default config;
