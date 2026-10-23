import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aethelgard.agency"),
  title: {
    default: "Monolith Studio | Fine-art Photography",
    template: "%s | Aethelgard",
  },
  description:
    "A high-motion client pitch portfolio with dynamic concept case studies for restaurants, real estate, SaaS, fashion, fitness, law, photography, and healthcare.",
  keywords: [
    "agency portfolio",
    "portfolio concepts",
    "dynamic case studies",
    "scrollytelling",
    "GSAP ScrollTrigger",
    "Next.js 15 portfolio",
    "Lenis smooth scroll",
  ],
  authors: [{ name: "Aethelgard Studio" }],
  creator: "Aethelgard Studio",
  openGraph: {
    title: "Monolith Studio | Fine-art Photography",
    description:
      "High-motion concept case studies built for client pitches and ready for real project data.",
    type: "website",
    siteName: "Aethelgard",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable} dark scroll-smooth`}>
      <body className="bg-[#0A0A0B] text-[#F5F5F7] antialiased selection:bg-accent-gold/30 selection:text-white">
        <SmoothScrollProvider>
          <NoiseOverlay />
          <CursorFollower />
          <div className="relative flex min-h-screen flex-col">{children}</div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
