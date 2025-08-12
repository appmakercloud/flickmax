import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import NavigationProgress from "@/components/layout/NavigationProgress";
import { Toaster } from 'react-hot-toast';
import { CountryProvider } from "@/contexts/CountryContext";
import { CartProvider } from "@/contexts/CartContext";

const openSans = Open_Sans({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-open-sans'
});

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
    <html lang="en" className={openSans.variable}>
      <body className={`${openSans.className} antialiased`} suppressHydrationWarning>
        <CountryProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            <ModernHeader />
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
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}
