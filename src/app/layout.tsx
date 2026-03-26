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
const OWNER_LOCATION = "Addis Ababa, Ethiopia";
const SITE_DESCRIPTION =
  "Software Engineer specializing in designing and scaling distributed systems across fintech, healthcare, and SaaS. Focused on microservices architecture, performance optimization, and delivering reliable systems at production scale.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${OWNER_NAME} — ${OWNER_TITLE} | ${OWNER_LOCATION}`,
    template: `%s | ${OWNER_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Elnatal Debebe",
    // role
    "Lead Software Engineer",
    "Senior Software Engineer",
    "Full-Stack Developer",
    "Backend Developer",
    "Software Developer",
    "Web Developer",
    // role + location
    "Software Engineer Ethiopia",
    "Software Developer Ethiopia",
    "Full Stack Developer Ethiopia",
    "Backend Developer Ethiopia",
    "Web Developer Ethiopia",
    "Software Engineer Addis Ababa",
    "Developer Addis Ababa",
    "Programmer Ethiopia",
    // tech
    "Go",
    "Golang",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "GraphQL",
    "microservices",
    "distributed systems",
    "fintech",
    // location
    "Ethiopia tech",
    "Addis Ababa",
  ],
  authors: [{ name: OWNER_NAME, url: SITE_URL }],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: `${OWNER_NAME} — Portfolio`,
    title: `${OWNER_NAME} — ${OWNER_TITLE} | ${OWNER_LOCATION}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    firstName: "Elnatal",
    lastName: "Debebe",
    username: "elnatal",
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER_NAME} — ${OWNER_TITLE} | ${OWNER_LOCATION}`,
    description: SITE_DESCRIPTION,
    creator: "@elnatal",
  },
  other: {
    "geo.region": "ET-AA",
    "geo.placename": "Addis Ababa, Ethiopia",
    "geo.position": "9.0348;38.7507",
    "ICBM": "9.0348, 38.7507",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
