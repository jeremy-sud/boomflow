import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BOOMFLOW | Sistemas Ursol — Development Badges",
  description: "Professional recognition platform. Verified badges for Sistemas Ursol developers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  
  // Badge count comes from session callback (loaded from DB)
  const badgeCount = user?.badges?.length ?? 0;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <Sidebar user={user} badgeCount={badgeCount} />
          <main className="ml-64 min-h-screen p-8">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
