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
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/images/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://ai-chat-bot-assistant-server.vercel.app/api/v1"
        : "http://192.168.10.33:4000/api/v1",
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://ai-chat-bot-assistant-server.vercel.app/api/v1"
        : "http://192.168.10.33:4000/api/v1",
  },
  devIndicators: false,
};

export default nextConfig;
