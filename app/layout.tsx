import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import NavigationProgress from "@/components/layout/NavigationProgress";
import { Toaster } from 'react-hot-toast';
import { CountryProvider } from "@/contexts/CountryContext";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Flickmax - Domains, Hosting & Email Solutions",
  description: "Get everything you need to succeed online. Domain registration, web hosting, professional email, and more.",
  keywords: "domain, hosting, email, website, web hosting, domain registration, professional email",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
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
