import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "PetBedNStay — Find Pet Hotels & Sitters Across the US",
    template: "%s | PetBedNStay",
  },
  description:
    "Discover trusted pet hotels, boarding facilities, and pet sitters across all 50 US states. Free to search, easy to find the perfect stay for your pet.",
  keywords: ["pet hotel", "pet boarding", "dog hotel", "cat boarding", "pet sitter", "pet care"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://petbednstay.com",
    siteName: "PetBedNStay",
    title: "PetBedNStay — Find Pet Hotels & Sitters Across the US",
    description:
      "Discover trusted pet hotels, boarding facilities, and pet sitters across all 50 US states.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-warm-50 text-stone-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
