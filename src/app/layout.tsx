import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "PetBedNStay — Pet Boarding & Kennels Across All 50 US States",
    template: "%s | PetBedNStay",
  },
  description:
    "Find trusted pet boarding, dog kennels, and pet hotels across all 50 US states. Search free — compare facilities, read details, and contact them directly.",
  keywords: ["pet boarding", "dog boarding", "dog kennel", "pet hotel", "cat boarding", "pet sitter", "pet care near me", "boarding kennel"],
  alternates: { canonical: "https://petbednstay.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://petbednstay.com",
    siteName: "PetBedNStay",
    title: "PetBedNStay — Pet Boarding & Kennels Across All 50 US States",
    description:
      "Find trusted pet boarding, dog kennels, and pet hotels across all 50 US states. Free to search.",
  },
  twitter: { card: "summary_large_image" },
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
