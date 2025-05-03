import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sooner";
import { getUserProfile } from "@/lib/api/user";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Inbox-Buddy: Your AI-Powered Email Assistant for Efficient Communication",
  description:
    "Inbox-Buddy is your AI-powered email assistant that streamlines communication, organizes your inbox, and boosts productivity. Join the waiting list today!",
  keywords:
    "AI email assistant, Inbox-Buddy, email management, productivity, communication",
  robots: "index, follow",
  openGraph: {
    title: "Inbox-Buddy: Your AI-Powered Email Assistant",
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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const res = await getUserProfile(accessToken?.value);

  const user = res?.data;

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <BackgroundWrapper>
          {!accessToken?.value || !user?._id ? <Navbar /> : ""}
          {children}
          <Toaster richColors position="top-center" />
        </BackgroundWrapper>
      </body>
    </html>
  );
}
