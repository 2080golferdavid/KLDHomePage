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
};

export default nextConfig;
