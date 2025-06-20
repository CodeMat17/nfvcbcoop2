import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";

const APP_NAME = 'NFVCB Cooperative';
const APP_DEFAULT_TITLE = "NFVCB Coop";
const APP_TITLE_TEMPLATE = "%s - NFVCB Coop";
const APP_DESCRIPTION = "Financial Empowerment for Members";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFVCB Cooperative",
  description: "Financial Empowerment for Members",
  manifest: "/manifest.json",

  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = { themeColor: "#16a34a" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>
          <PWAInstaller />
          <PWAInstallPrompt />
          {children}
        </ConvexClientProvider>

        <Toaster />
      </body>
    </html>
  );
}
