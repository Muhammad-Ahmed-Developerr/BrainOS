import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "BrainOS – AI-Powered Mental Health Operating System",
    template: "%s | BrainOS"
  },
  description:
    "BrainOS is a premium AI-powered Personal Mental Health Operating System that monitors stress, burnout, focus, mood, sleep, and emotional wellbeing in real time.",
  keywords: [
    "mental health AI",
    "stress monitoring",
    "burnout prevention",
    "sleep analytics",
    "mood tracker",
    "focus optimization",
    "wellbeing OS"
  ],
  metadataBase: new URL("https://brainos.ai"),
  openGraph: {
    title: "BrainOS – AI-Powered Mental Health Operating System",
    description:
      "Synchronize your biometrics. Predict cognitive fatigue. Reclaim your mental clarity.",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainOS – AI-Powered Mental Health OS",
    description: "Real-time biosensor syncing, AI burnout forecasting, and premium daily check-ins."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className={`${plusJakarta.variable} font-sans min-h-full flex flex-col bg-white text-slate-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
