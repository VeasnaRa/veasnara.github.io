'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import siteConfig from '../site.config'

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            {siteConfig.name}
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-8">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                    pathname === item.path ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
