// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.iconscout.com",
      },
      {
        protocol: "http",
        hostname: "192.168.10.33",
        port: "4000",
        pathname: "/uploads/images/**",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
