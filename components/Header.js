'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import siteConfig from '../site.config'
import * as Icons from 'lucide-react'
import SearchModal from './SearchModal'

export default function Header({ allContent = [] }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)

  // Detect Mac for keyboard shortcut display
  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent))
  }, [])

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Helper function to render icon
  const renderIcon = (iconName) => {
    if (!iconName) return null
    const IconComponent = Icons[iconName]
    if (!IconComponent) return null
    return <IconComponent className="h-4 w-4" />
  }

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
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    pathname === item.path ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'
                  }`}
                >
                  {renderIcon(item.icon)}
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-gray-900 border border-gray-300"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white text-gray-500 text-xs font-semibold rounded border border-gray-300">
                {isMac ? '⌘' : 'Ctrl'}K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-gray-900"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {renderIcon(item.icon)}
                {item.title}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        allContent={allContent}
      />
    </header>
  )
}
