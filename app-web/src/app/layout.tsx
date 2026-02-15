import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { getUserByUsername } from "@/lib/data";
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
  title: "BOOMFLOW | Sistemas Ursol — Medallas de Desarrollo",
  description: "Plataforma de reconocimiento profesional. Medallas verificadas para desarrolladores de Sistemas Ursol.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  
  // Obtener cantidad de badges del usuario (de los datos mock por ahora)
  const userData = user?.username ? getUserByUsername(user.username) : null;
  const badgeCount = userData?.badges.length || 0;

  return (
    <html lang="es">
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
