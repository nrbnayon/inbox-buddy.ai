// app\pricing\page.js
import { cookies } from "next/headers";
import PricingPlans from "./components/PricingPlans";

export const metadata = {
  title: "Inbox-Buddy Pricing: Affordable Plans for AI Email Management",
  description:
    "Explore Inbox-Buddy's pricing plans to streamline your email communication with AI. Choose a PICK A PLAN THAT FITS YOUR NEEDS. Affordable subscriptions for businesses and individuals.",
  keywords:
    "Inbox-Buddy pricing, AI email assistant pricing, email management plans, subscription plans, affordable AI tools",
  robots:
    process.env.NODE_ENV === "production"
      ? "index, follow"
      : "noindex, nofollow",
  openGraph: {
    title: "Inbox-Buddy Pricing: Affordable AI Email Plans",
    description:
      "Discover Inbox-Buddy's pricing plans designed for efficient email management. Affordable AI-powered subscriptions for all users.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/4xy8d9ZS/Frame-2.webp",
        width: 1000,
        height: 600,
        alt: "Inbox-Buddy Pricing Plans",
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

export default async function pricingPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken");
  return (
    <section className="flex flex-col h-full items-center justify-center mt-8 md:mt-28">
      <h1 className="font-bold text-5xl md:text-6xl text-center">
        Subscription that fit like a glove
      </h1>
      <PricingPlans accessToken={token?.value} />
    </section>
  );
}
