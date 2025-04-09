// app\layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sooner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "IndexBuddy",
  description: "Your AI based email assistant",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("accessToken");
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <BackgroundWrapper>
          {!auth && <Navbar />}
          {children}
          <Toaster richColors position="top-center" />
        </BackgroundWrapper>
      </body>
    </html>
  );
}
