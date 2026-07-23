/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  distDir: process.env.HDU_NEXT_DIST_DIR || ".next",
};

export default nextConfig;
