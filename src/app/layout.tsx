import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ChatWidget } from "@/components/portfolio/chat-widget";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elnatal Debebe — Lead Software Engineer",
  description:
    "Full-Stack Software Engineer specializing in scalable systems, microservices, and modern web applications.",
  keywords: [
    "Software Engineer",
    "Full-Stack Developer",
    "Go",
    "TypeScript",
    "Node.js",
    "Elnatal Debebe",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <SessionProvider>
          {children}
          <ChatWidget />
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
