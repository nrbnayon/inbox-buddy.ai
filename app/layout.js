// app\layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Index.AI",
  description: "Your AI based email inbox",
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
          <Toaster position="top-center" />
        </BackgroundWrapper>
      </body>
    </html>
  );
}
