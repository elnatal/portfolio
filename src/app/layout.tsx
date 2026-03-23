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

const SITE_URL = "https://elnatal.com";
const OWNER_NAME = "Elnatal Debebe";
const OWNER_TITLE = "Lead Software Engineer";
const SITE_DESCRIPTION =
  "Software Engineer & Full-Stack Developer with 7+ years of experience building scalable systems, marketplaces, and healthcare platforms. Passionate about clean architecture, microservices, and delivering impactful software.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${OWNER_NAME} — ${OWNER_TITLE}`,
    template: `%s | ${OWNER_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Elnatal Debebe",
    "Lead Software Engineer",
    "Full-Stack Developer",
    "Go",
    "Golang",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Software Engineer Ethiopia",
    "Addis Ababa developer",
    "microservices",
    "scalable systems",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
  ],
  authors: [{ name: OWNER_NAME, url: SITE_URL }],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: `${OWNER_NAME} — Portfolio`,
    title: `${OWNER_NAME} — ${OWNER_TITLE}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    firstName: "Elnatal",
    lastName: "Debebe",
    username: "elnatal",
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER_NAME} — ${OWNER_TITLE}`,
    description: SITE_DESCRIPTION,
    creator: "@elnatal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
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
