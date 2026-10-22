/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  distDir: process.env.HDU_NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      // Media names are editable, so use bounded caching rather than immutable.
      ...["/images/:path*", "/uploads/:path*", "/welcome/:path+", "/promo/:path+", "/stickers/boy/:path+", "/stickers/girl/:path+", "/stickers/sheep-stickers-40.zip"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      })),
    ];
  },
};

export default nextConfig;
