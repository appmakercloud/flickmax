'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown, ShoppingCart, User } from 'lucide-react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { CountrySelectorCompact } from '@/components/ui/CountrySelector'
import { useCart } from '@/contexts/CartContext'
import CartPanel from '@/components/cart/CartPanel'

const navigation = {
  domains: {
    title: 'Domains',
    items: [
      { name: 'Domain Name Search', href: '/domains/search' },
      { name: 'Domain Transfer', href: '/domains/transfer' },
      { name: 'Domain Pricing', href: '/domains/pricing' },
      { name: 'WHOIS Lookup', href: '/domains/whois' },
    ]
  },
  hosting: {
    title: 'Hosting',
    items: [
      { name: 'Web Hosting', href: '/hosting/web-hosting' },
      { name: 'WordPress Hosting', href: '/hosting/wordpress' },
      { name: 'VPS Hosting', href: '/hosting/vps' },
      { name: 'Dedicated Servers', href: '/hosting/dedicated' },
    ]
  },
  email: {
    title: 'Email & Marketing',
    items: [
      { name: 'Professional Email', href: '/email/professional' },
      { name: 'Email Marketing', href: '/email/marketing' },
      { name: 'Website Builder', href: '/website-builder' },
    ]
  }
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartPanelOpen, setCartPanelOpen] = useState(false)
  const { cartItemsCount } = useCart()

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Flickmax</span>
              <span className="ml-2 text-sm text-gray-500">.com</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {Object.entries(navigation).map(([key, section]) => (
              <HeadlessMenu key={key} as="div" className="relative">
                <HeadlessMenu.Button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  {section.title}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </HeadlessMenu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <HeadlessMenu.Items className="absolute left-0 z-10 mt-3 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {section.items.map((item) => (
                        <HeadlessMenu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              {item.name}
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                      ))}
                    </div>
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            ))}
            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <CountrySelectorCompact />
            <button 
              onClick={() => setCartPanelOpen(true)}
              className="relative text-gray-700 hover:text-gray-900"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="hidden lg:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden rounded-md p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 pb-3 pt-4">
            {Object.entries(navigation).map(([key, section]) => (
              <div key={key} className="mb-4">
                <h3 className="px-3 text-sm font-medium text-gray-900">{section.title}</h3>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-6 px-3">
              <Link
                href="/signup"
                className="block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Cart Panel */}
      <CartPanel isOpen={cartPanelOpen} onClose={() => setCartPanelOpen(false)} />
    </header>
  )
}