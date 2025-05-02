import React from "react";

export const metadata = {
  title: "Inbox-Buddy Privacy Policy",
  description:
    "Learn how Inbox-Buddy handles your data and protects your privacy.",
  robots: "index, follow",
  openGraph: {
    title: "Inbox-Buddy Privacy Policy",
    description:
      "Discover how Inbox-Buddy safeguards your data and respects your privacy.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
    type: "website",
    images: [
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
    <div className="privacy-page min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          At Inbox-Buddy, your privacy is our priority. This Privacy Policy
          explains how we collect, use, store, and protect your data, including
          information obtained through Google OAuth.
        </p>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600">
              Inbox-Buddy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our AI-powered email assistant
              application (&quot;Service&quot;). By using the Service, you agree
              to the collection and use of information in accordance with this
              policy.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-600">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>
                <strong>Personal Information:</strong> When you sign up using
                Google OAuth, we collect your name, email address, and profile
                picture from your Google account.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how
                you interact with the Service, such as the features you use and
                the actions you take.
              </li>
              <li>
                <strong>Device Information:</strong> We collect information
                about the device you use to access the Service, including the
                device type, operating system, and browser type.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>To provide and maintain the Service.</li>
              <li>
                To personalize your experience and deliver tailored content.
              </li>
              <li>To improve the Service and develop new features.</li>
              <li>
                To communicate with you, including sending updates and
                notifications.
              </li>
              <li>To ensure the security and integrity of the Service.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-600">
              We do not share your personal information with third parties
              except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>
                With service providers who assist us in operating the Service
                (e.g., hosting providers), bound by confidentiality agreements.
              </li>
              <li>When required by law or to protect our rights.</li>
              <li>
                In connection with a merger, acquisition, or sale of assets,
                with your consent where required.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-600">
              We implement robust security measures to protect your data,
              including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>
                Encryption of data in transit using TLS 1.2+ and at rest using
                AES-256.
              </li>
              <li>
                Secure authentication via Google OAuth, ensuring we never store
                your passwords.
              </li>
              <li>
                Regular security audits and compliance with industry standards
                like GDPR, SOC 2, and ISO 27001.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Data Retention and Deletion
            </h2>
            <p className="text-gray-600">
              We retain your personal information only as long as necessary to
              provide the Service and fulfill the purposes outlined in this
              policy. You can request deletion of your data by contacting us,
              and we will comply unless we have a legal obligation to retain it.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. User Rights and Choices
            </h2>
            <p className="text-gray-600">
              You have the following rights regarding your data:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>
                Access and update your personal information through your account
                settings.
              </li>
              <li>
                Revoke access to your Google account data via your Google
                account settings.
              </li>
              <li>
                Request deletion of your data, subject to legal obligations.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Third-Party Services
            </h2>
            <p className="text-gray-600">
              The Service integrates with third-party services like Google OAuth
              for authentication. These services have their own privacy
              policies, and we encourage you to review them.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the &quot;Last Updated&quot; date.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="text-gray-600 mt-2">Email: inboxbuddy.ai@gmail.com</p>
          </section>
        </div>
        <p className="text-gray-500 text-sm mt-12 text-center">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
