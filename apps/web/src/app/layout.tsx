import type { Metadata, Viewport } from "next";
import { Sora, Instrument_Sans } from "next/font/google";
import { BRAND } from "../lib/brand";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND} | Send money from the UK to Jamaica and the Caribbean`,
  description: `${BRAND} is a UK-based money transfer app for the Caribbean. See the exchange rate, fee and total cost upfront, and track every transfer. Coming soon to iOS and Android.`,
};

export const viewport: Viewport = {
  themeColor: "#07050F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body className="bg-[#07050F] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
