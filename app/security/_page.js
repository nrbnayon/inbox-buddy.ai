import { LockIcon, ShieldIcon, DocumentIcon } from "./components/SecurityIcons";
import SecurityCard from "./components/SecurityCard";

export default function securityPage() {
  return (
    <div className="min-h-screen overflow-auto flex items-center justify-center  py-20">
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
            icon={<LockIcon />}
            title="Bank-Grade Encryption"
            description="All data is encrypted both in transit (TLS 1.2+) and at rest (AES-256) to ensure end-to-end security. We never store or process your data beyond what's required to deliver insights. Your information remains yours and yours alone—we can't see it, share it, or use it for any other purpose."
            delay={0.6}
          />

          <SecurityCard
            icon={<ShieldIcon />}
            title="Secure Authentication"
            description="Login is protected by OAuth-based authentication, meaning we never see or store your passwords. We also enforce two-factor authentication (2FA) to prevent unauthorized access. You decide what the AI can access, and you can revoke permissions anytime. Our integrations follow the least privilege principle, ensuring minimal access to only the necessary data."
            delay={0.8}
          />

          <SecurityCard
            icon={<DocumentIcon />}
            title="Enterprise-Grade Compliance"
            description="We adhere to industry-leading security and privacy standards, including GDPR, SOC 2, and ISO 27001 (as applicable), so your organization stays compliant. Your trust is our top priority. With Inbox-Buddy, you can confidently automate your workflow while knowing your data is safe, private, and under your control."
            delay={1.0}
          />
        </div>
      </div>
    </div>
  );
}
