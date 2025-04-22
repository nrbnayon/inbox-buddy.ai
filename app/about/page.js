import SecurityCard from "./components/SecurityCard";
import Image from "next/image";
import encryption from "@/public/encryption.png";
import authentication from "@/public/authentication.png";
import compliance from "@/public/compliance.png";

export const metadata = {
  title: "Inbox-Buddy Security: Prioritizing Your Data Protection",
  description:
    "Discover how Inbox-Buddy ensures your data's security with bank-grade encryption, secure authentication, and enterprise-grade compliance. Your privacy is our priority.",
  keywords:
    "Inbox-Buddy security, AI email assistant security, data protection, encryption, secure authentication, GDPR compliance, enterprise compliance",
  robots:
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? "index, follow"
      : "noindex, nofollow",
  openGraph: {
    title: "Inbox-Buddy Security: Robust Data Protection",
    description:
      "Learn about Inbox-Buddy's commitment to security with advanced encryption, secure authentication, and compliance with GDPR, SOC 2, and ISO 27001 standards.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/security`,
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/4xy8d9ZS/Frame-2.webp",
        width: 1000,
        height: 600,
        alt: "Inbox-Buddy Security Features",
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

export default function page() {
  return (
    <div className="security-page min-h-screen flex items-center justify-center pt-4 md:py-20">
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
            Security isn&apos;t a feature. It&apos;s a priority
          </h1>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Studies show that almost 70% of workers use OpenAI for everyday
            work, potentially feeding models with sensitive information.
            That&apos;s where we come in.
          </p>
        </div>

        <div className="space-y-6">
          <SecurityCard
            icon={
              <Image
                src={encryption}
                alt="encryption image"
                className="size-[76px]"
              />
            }
            title="Bank-Grade Encryption"
            description="All data is encrypted both in transit (TLS 1.2+) and at rest (AES-256) to ensure end-to-end security. We never store or process your data beyond what's required to deliver insights. Your information remains yours and yours alone—we can't see it, share it, or use it for any other purpose."
          />

          <SecurityCard
            icon={
              <Image
                src={authentication}
                alt="authentication image"
                className="size-[76px]"
              />
            }
            title="Secure Authentication"
            description="Login is protected by OAuth-based authentication, meaning we never see or store your passwords. We also enforce two-factor authentication (2FA) to prevent unauthorized access. You decide what the AI can access, and you can revoke permissions anytime. Our integrations follow the least privilege principle, ensuring minimal access to only the necessary data."
          />

          <SecurityCard
            icon={
              <Image
                src={compliance}
                alt="compliance image"
                className="size-[76px]"
              />
            }
            title="Enterprise-Grade Compliance"
            description="We adhere to industry-leading security and privacy standards, including GDPR, SOC 2, and ISO 27001 (as applicable), so your organization stays compliant. Your trust is our top priority. With Inbox-Buddy, you can confidently automate your workflow while knowing your data is safe, private, and under your control."
          />
        </div>
      </div>
    </div>
  );
}
