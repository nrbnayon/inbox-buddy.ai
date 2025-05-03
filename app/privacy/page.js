import React from "react";
import SecurityCard from "./components/SecurityCard";
import Image from "next/image";
import privacy from "@/public/privacy.png";
import dataProtection from "@/public/data-protection.png";
import userRights from "@/public/user-rights.png";

export const metadata = {
  title: "Inbox-Buddy Privacy Policy: Prioritizing Your Data Protection",
  description:
    "Discover how Inbox-Buddy ensures your data's privacy with bank-grade encryption, secure authentication, and enterprise-grade compliance. Your privacy is our priority.",
  keywords:
    "Inbox-Buddy Privacy Policy, AI email assistant privacy policy, data protection, encryption, secure authentication, GDPR compliance, enterprise compliance",
  robots:
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? "index, follow"
      : "noindex, nofollow",
  openGraph: {
    title: "Inbox-Buddy Privacy Policy: Robust Data Protection",
    description:
      "Learn about Inbox-Buddy's commitment to privacy with advanced encryption, secure authentication, and compliance with GDPR, SOC 2, and ISO 27001 standards.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/4xy8d9ZS/Frame-2.webp",
        width: 1000,
        height: 600,
        alt: "Inbox-Buddy Privacy Policy",
      },
      {
        url: `${process.env.NEXT_PUBLIC_ASSET_API_BASE_URL}/uploads/images/logo.png`,
        width: 1000,
        height: 600,
        alt: "Inbox-Buddy Logo",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page min-h-screen flex items-center justify-center pt-4 md:py-20">
      <div className="container max-w-4xl px-6 mx-auto">
        <div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your privacy is our commitment
          </h1>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At Inbox-Buddy, we believe in transparency and empowering users with
            control over their personal information. This policy explains how we
            handle your data with the utmost care.
          </p>
        </div>

        <div className="space-y-6">
          <SecurityCard
            icon={
              <Image
                src={privacy}
                alt="privacy image"
                className="size-[76px]"
              />
            }
            title="Information We Collect"
            description="We collect only essential data needed to provide our service: Personal Information (name, email, profile picture) through Google OAuth, and Usage Data about how you interact with our features. We never collect more than necessary, and you always know what information we have."
          />

          <SecurityCard
            icon={
              <Image
                src={dataProtection}
                alt="data protection image"
                className="size-[76px]"
              />
            }
            title="How We Protect Your Data"
            description="Your data is secured with bank-grade encryption (TLS 1.2+ in transit, AES-256 at rest) and secure authentication via Google OAuth. We implement strict data access controls, regular security audits, and comply with GDPR, SOC 2, and ISO 27001 standards to ensure your information remains protected."
          />

          <SecurityCard
            icon={
              <Image
                src={userRights}
                alt="user rights image"
                className="size-[76px]"
              />
            }
            title="Your Rights and Choices"
            description="You retain full control over your information. Access and update your personal data through account settings, revoke permissions at any time via Google account settings, and request data deletion by contacting us at inboxbuddy.ai@gmail.com. We retain your information only as long as needed to provide our services."
          />
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
