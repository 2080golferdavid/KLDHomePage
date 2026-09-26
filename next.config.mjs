/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/api/brand/favicon" }];
  },
  async redirects() {
    return [{ source: "/officials", destination: "/about/officials", permanent: true }];
  },
};

export default nextConfig;
