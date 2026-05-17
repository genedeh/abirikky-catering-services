import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Supermercado_One } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BasketProvider } from "@/context/BasketContext";

import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const supermercadoOne = Supermercado_One({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Abirikky",
  description: "Abirikky restaurant landing page",
  icons: {
    icon: [
      {
        url: "/logoMark.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
    shortcut: "/logoMark.png",
    apple: [
      {
        url: "/logoMark.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} ${supermercadoOne.variable}`}
    >
      <body className="font-body">
        <BasketProvider>
          <Header />
          {children}
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
