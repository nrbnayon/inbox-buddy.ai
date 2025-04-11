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
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http",
        hostname: "192.168.10.33",
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
        : "https://3afb-115-127-156-9.ngrok-free.app/api/v1",
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://ai-chat-bot-assistant-server.vercel.app/api/v1"
        : "https://3afb-115-127-156-9.ngrok-free.app/api/v1",
  },
  devIndicators: false,
};

export default nextConfig;
