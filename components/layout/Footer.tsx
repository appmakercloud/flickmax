'use client'

import Link from 'next/link'
import { Facebook, Twitter, Youtube, Instagram, Globe, Phone, Mail, Shield } from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import Image from 'next/image'

const footerLinks = {
  products: {
    title: 'Products',
    links: [
      { name: 'Domain Names', href: '/domains' },
      { name: 'Domain Transfer', href: '/domains/transfer' },
      { name: 'Web Hosting', href: '/hosting/web-hosting' },
      { name: 'Managed WordPress', href: '/hosting/managed-wordpress' },
      { name: 'Professional Email', href: '/email/professional' },
      { name: 'Website Builder', href: '/website-builder' },
      { name: 'SSL Certificates', href: '/security/ssl' },
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: 'https://www.secureserver.net/help?plid=590175', external: true },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Report Abuse', href: '/report-abuse' },
      { name: 'Resources', href: '/resources' },
      { name: 'Product Catalog', href: '/catalog' },
      { name: 'Site Map', href: '/sitemap' },
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Flickmax', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partners', href: '/partners' },
      { name: 'Affiliates', href: '/affiliates' },
      { name: 'Blog', href: '/blog' },
      { name: 'Investor Relations', href: '/investors' },
    ]
  },
  account: {
    title: 'My Account',
    links: [
      { name: 'My Products', href: 'https://www.secureserver.net/products?plid=590175', external: true },
      { name: 'Account Settings', href: 'https://account.secureserver.net/profile?plid=590175', external: true },
      { name: 'Renewals & Billing', href: '/account/billing' },
      { name: 'Create Account', href: 'https://sso.secureserver.net/account/create?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account', external: true },
      { name: 'Sign In', href: 'https://sso.secureserver.net/?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account', external: true },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/legal/privacy-policy' },
      { name: 'Terms of Service', href: '/legal/universal-terms-of-service-agreement' },
      { name: 'Legal Agreements', href: '/legal' },
      { name: 'Refund Policy', href: '/legal/refund-policy' },
    ]
  }
}

export default function Footer() {
  const { country } = useCountry()
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        {/* Top Section with Logo and Newsletter */}
        <div className="lg:flex lg:items-start lg:justify-between lg:gap-8 pb-8 mb-8 border-b border-gray-800">
          <div className="space-y-4 lg:max-w-xl">
            <Link 
              href="/" 
              className="inline-block group transform transition-all duration-300 hover:scale-105"
            >
              <Image 
                src="/flickmax-logo-variant1-dark.svg?v=13" 
                alt="Flickmax - Your Trusted Domain & Hosting Partner" 
                width={340}
                height={80}
                className="h-11 sm:h-12 w-auto transition-opacity duration-300 group-hover:opacity-90"
              />
            </Link>
            <p className="text-sm text-gray-400 max-w-md">
              Empowering your online presence with reliable domains, hosting, and email solutions. 
              Trusted by thousands of businesses worldwide.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Global Infrastructure</span>
              </div>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-8 lg:mt-0">
            <h3 className="text-sm font-semibold text-white mb-3">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest deals and updates.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footerLinks.products.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footerLinks.support.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.links.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footerLinks.company.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footerLinks.account.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.account.links.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footerLinks.legal.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-white">Sales & Support</p>
                <a href={`tel:${country.phoneNumber.replace(/[^0-9+]/g, '')}`} className="text-sm text-gray-400 hover:text-white">{country.phoneNumber}</a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-white">Email Us</p>
                <a href="mailto:support@flickmax.com" className="text-sm text-gray-400 hover:text-white">support@flickmax.com</a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-white">Global Support</p>
                <p className="text-sm text-gray-400">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            
            {/* Payment Methods */}
            <div className="mt-6 md:mt-0">
              <p className="text-xs text-gray-500 mb-2">Secure Payment Methods</p>
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="text-xs">Visa</span>
                <span className="text-xs">Mastercard</span>
                <span className="text-xs">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Flickmax.com. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}