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
        hostname: "46.202.159.90",
      },
      {
        protocol: "https",
        hostname: "server.inbox-buddy.ai",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/images/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // env: {
  //   NEXT_PUBLIC_API_BASE_URL:
  //     process.env.NEXT_PUBLIC_NODE_ENV === "production"
  //       ? "https://ai-chat-bot-assistant-server.vercel.app/api/v1"
  //       : "http://192.168.10.32:4000/api/v1",
  //   API_BASE_URL:
  //     process.env.NEXT_PUBLIC_NODE_ENV === "production"
  //       ? "https://ai-chat-bot-assistant-server.vercel.app/api/v1"
  //       : "http://192.168.10.32:4000/api/v1",
  // },

  devIndicators: false,
};

export default nextConfig;
