import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Footer from "../components/Footer";
import ThemeProvider from "../components/ThemeProvider";
import SearchWrapper from "../components/SearchWrapper";
import siteConfig from "../site.config";
import { getAllContent } from "../lib/getAllContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords || [],
  authors: [{ name: siteConfig.author || siteConfig.name }],
  creator: siteConfig.author || siteConfig.name,
  metadataBase: new URL(siteConfig.siteUrl || 'https://example.com'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.profileImage || '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.social?.twitter?.replace('https://twitter.com/', '@') || '@yourusername',
    images: [siteConfig.profileImage || '/images/og-image.png'],
  },

  // Icons (only add if custom icons are specified)
  ...(siteConfig.icon || siteConfig.favicon || siteConfig.appleIcon ? {
    icons: {
      ...(siteConfig.icon && { icon: siteConfig.icon }),
      ...(siteConfig.favicon && { shortcut: siteConfig.favicon }),
      ...(siteConfig.appleIcon && { apple: siteConfig.appleIcon }),
    }
  } : {}),

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const allContent = getAllContent()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen transition-colors">
            <SearchWrapper allContent={allContent} />
            <main className="flex-1 w-full">
              <div className="mx-auto max-w-6xl px-6 pt-6 pb-6">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
