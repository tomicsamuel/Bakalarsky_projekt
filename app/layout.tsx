import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import "@/components/Confetti/confetti.css";
import "@/components/AnimatedStats/animated-stats.css";
import "@/components/FloatingElements/floating-elements.css";
import "@/components/AnimatedBackground/animated-background.css";
import "@/components/SidebarMenu/sidebar-menu.css";
import "@/components/ResultsDisplay/results-display.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FEI Finder – Nájdi si študijný program",
  description: "Zisti, ktorý študijný program na FEI TUKE je pre teba ten pravý",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
    >
        <a href="#main-content" className="skip-link">
          Preskočiť na hlavný obsah
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
