import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Instrument_Serif,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/json-ld";
import { AtlasBot } from "@/components/ui/atlas-bot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "Profiled | Build Your Professional Portfolio",
    template: "%s | Profiled",
  },
  description:
    "Create a stunning, minimal portfolio that stands out. Get your own subdomain, beautiful design, and easy editing. Built for developers, designers, and creators.",
  keywords: [
    "Portfolio Builder",
    "Developer Portfolio",
    "Resume Website",
    "No-Code Portfolio",
    "Personal Website Builder",
    "Next.js Portfolio",
    "React Portfolio",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Profiled Team" }],
  creator: "Profiled",
  metadataBase: new URL("https://profiled.site"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://profiled.site",
    title: "Profiled | Build Your Professional Portfolio",
    description:
      "Create a stunning, minimal portfolio that stands out. Get your own subdomain, beautiful design, and easy editing.",
    siteName: "Profiled",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Profiled - Professional Portfolio Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profiled | Build Your Professional Portfolio",
    description:
      "Create a stunning, minimal portfolio that stands out. Get your own subdomain, beautiful design, and easy editing.",
    images: ["/og-image.png"],
    creator: "@profiled",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${playfair.variable} ${cormorant.variable} ${instrumentSerif.variable} min-h-screen bg-[#050505] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-500`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
        <AtlasBot />
        <Analytics />
        <JsonLd />
      </body>
    </html>
  );
}
