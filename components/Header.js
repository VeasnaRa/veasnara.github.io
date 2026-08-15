'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import siteConfig from '../site.config'
import * as Icons from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header({ allContent = [], searchOpen, setSearchOpen }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
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
  }, [setSearchOpen])

  // Helper function to render icon
  const renderIcon = (iconName) => {
    if (!iconName) return null
    const IconComponent = Icons[iconName]
    if (!IconComponent) return null
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <header className="site-header sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-colors">
      {/* Same width/padding as <main> in app/layout.js so the nav lines up
          with the page content below it. */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
            {siteConfig.name}
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-2">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  data-active={pathname === item.path}
                  className={`nav-chip${item.color ? ` nav-chip--${item.color}` : ''}`}
                >
                  {renderIcon(item.icon)}
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center justify-center nav-icon-btn"
              aria-label="Search"
              title={`Search (${isMac ? '⌘' : 'Ctrl+'}K)`}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden inline-flex items-center justify-center nav-icon-btn"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            <button
              className="md:hidden inline-flex items-center justify-center nav-icon-btn"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t dark:border-slate-800">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                data-active={pathname === item.path}
                className={`nav-chip nav-chip--block${item.color ? ` nav-chip--${item.color}` : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {renderIcon(item.icon)}
                {item.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
