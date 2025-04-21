import Hero from "@/components/home/Hero";

export const metadata = {
  title: "Inbox-Buddy: Your AI Email Assistant for Efficient Communication",
  description:
    "Inbox-Buddy is your AI-powered email assistant that streamlines communication, organizes your inbox, and boosts productivity. Join the waiting list today!",
  keywords:
    "AI email assistant, Inbox-Buddy, email management, productivity, communication",
  robots: "index, follow",
  openGraph: {
    title: "Inbox-Buddy: Your AI Email Assistant",
    description:
      "Streamline your email with Inbox-Buddy, the AI assistant that organizes your inbox and enhances productivity.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    width: 1000,
    height: 600,
    type: "website",
    images:
      "https://i.postimg.cc/4xy8d9ZS/Frame-2.webp" ||
      `${process.env.NEXT_PUBLIC_ASSET_API_BASE_URL}/uploads/images/logo.png`,
  },
};

export default async function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
