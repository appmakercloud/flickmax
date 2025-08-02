import Link from 'next/link'
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

const footerLinks = {
  products: {
    title: 'Products',
    links: [
      { name: 'Domain Names', href: '/domains' },
      { name: 'Web Hosting', href: '/hosting/web' },
      { name: 'WordPress Hosting', href: '/hosting/wordpress' },
      { name: 'Professional Email', href: '/email/professional' },
      { name: 'Website Builder', href: '/website-builder' },
      { name: 'SSL Certificates', href: '/ssl' },
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Report Abuse', href: '/report-abuse' },
      { name: 'Resources', href: '/resources' },
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Flickmax', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partners', href: '/partners' },
      { name: 'Legal', href: '/legal' },
      { name: 'Blog', href: '/blog' },
    ]
  },
  account: {
    title: 'My Account',
    links: [
      { name: 'Manage Account', href: '/account' },
      { name: 'Renewals & Billing', href: '/account/billing' },
      { name: 'Create Account', href: '/signup' },
    ]
  }
}

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div>
              <span className="text-2xl font-bold text-white">Flickmax</span>
              <span className="ml-2 text-sm text-gray-400">.com</span>
            </div>
            <p className="text-sm text-gray-400">
              Empowering your online presence with reliable domains, hosting, and email solutions.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  {footerLinks.products.title}
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.products.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  {footerLinks.support.title}
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.support.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  {footerLinks.company.title}
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.company.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  {footerLinks.account.title}
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.account.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Flickmax.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}