import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Intro from "@/components/Intro";
import MusicPlayer from "@/components/MusicPlayer";
import InstallBanner from "@/components/InstallBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RENOI Barberstreet — La valeur sûre | Ouagadougou",
    template: "%s | RENOI Barberstreet",
  },
  description:
    "Barbershop urbain premium à Ouagadougou. Coupes homme, barbe, soins. 2 salons : ZAD & SAABA. Ouvert 7j/7 de 9h à 21h. Réservez en ligne.",
  keywords: [
    "barbershop Ouagadougou",
    "coiffeur homme Burkina Faso",
    "salon coiffure Ouaga",
    "coupe dégradé Ouagadougou",
    "barber Burkina",
    "RENOI Barberstreet",
    "barber ZAD",
    "barber SAABA",
  ],
  authors: [{ name: "RENOI Barberstreet" }],
  creator: "RENOI Barberstreet",
  publisher: "RENOI Barberstreet",
  // Open Graph
  openGraph: {
    title: "RENOI Barberstreet — La valeur sûre",
    description: "Barbershop urbain premium à Ouagadougou. 2 salons. Réservez en ligne.",
    url: SITE_URL,
    siteName: "RENOI Barberstreet",
    locale: "fr_BF",
    type: "website",
    images: [
      {
        url: "/images/hero-salon.jpg",
        width: 1200,
        height: 630,
        alt: "RENOI Barberstreet — Barbershop Ouagadougou",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RENOI Barberstreet — La valeur sûre",
    description: "Barbershop urbain premium à Ouagadougou. Réservez en ligne.",
    images: ["/images/hero-salon.jpg"],
  },
  // PWA
  manifest: "/manifest.json",
  // Apple
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RENOI",
    startupImage: [
      { url: "/icons/icon-512.svg" },
    ],
  },
  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HairSalon",
      "@id": `${SITE_URL}/#zad`,
      "name": "RENOI Barberstreet — Salon ZAD",
      "description": "Barbershop urbain premium à Ouagadougou, secteur ZAD.",
      "url": SITE_URL,
      "telephone": "+22600000000",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ouagadougou",
        "addressCountry": "BF",
        "streetAddress": "Secteur ZAD",
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "09:00",
        "closes": "21:00",
      },
      "priceRange": "FCFA",
      "currenciesAccepted": "XOF",
      "paymentAccepted": "Cash, Mobile Money",
      "image": `${SITE_URL}/images/hero-salon.jpg`,
    },
    {
      "@type": "HairSalon",
      "@id": `${SITE_URL}/#saaba`,
      "name": "RENOI Barberstreet — Salon SAABA",
      "description": "Barbershop urbain premium à Ouagadougou, secteur SAABA.",
      "url": SITE_URL,
      "telephone": "+22600000001",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ouagadougou",
        "addressCountry": "BF",
        "streetAddress": "Secteur SAABA",
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "09:00",
        "closes": "21:00",
      },
      "priceRange": "FCFA",
      "currenciesAccepted": "XOF",
      "paymentAccepted": "Cash, Mobile Money",
      "image": `${SITE_URL}/images/hero-salon.jpg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "RENOI Barberstreet",
      "description": "Barbershop urbain premium à Ouagadougou",
      "inLanguage": "fr-BF",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F0E8] antialiased">
        <Intro />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppButton />
        <InstallBanner />
        <MusicPlayer />
      </body>
    </html>
  );
}
