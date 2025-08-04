import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { Toaster } from 'react-hot-toast';
import { CountryProvider } from "@/contexts/CountryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flickmax - Domains, Hosting & Email Solutions",
  description: "Get everything you need to succeed online. Domain registration, web hosting, professional email, and more.",
  keywords: "domain, hosting, email, website, web hosting, domain registration, professional email",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <CountryProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingCTA />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </CountryProvider>
      </body>
    </html>
  );
}
