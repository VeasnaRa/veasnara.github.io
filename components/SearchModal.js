'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import siteConfig from '../site.config'

export default function SearchModal({ isOpen, onClose, allContent }) {
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  // Search logic
  const results = useMemo(() => {
    if (!query.trim() || !allContent) return []

    const searchQuery = query.toLowerCase()

    return allContent
      .filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(searchQuery)
        const descriptionMatch = item.description?.toLowerCase().includes(searchQuery)
        const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
        const categoryMatch = item.category?.toLowerCase().includes(searchQuery)

        return titleMatch || descriptionMatch || tagsMatch || categoryMatch
      })
      .slice(0, 10) // Limit to 10 results
  }, [query, allContent])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  if (!mounted || !isOpen) return null

  // Helper to get icon for category
  const getCategoryIcon = (category) => {
    const iconMap = {
      blog: 'BookOpen',
      projects: 'Code',
      publications: 'GraduationCap'
    }
    const iconName = iconMap[category] || 'FileText'
    const IconComponent = Icons[iconName]
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-slate-700">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts, projects, publications..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-semibold rounded border border-gray-300 dark:border-slate-600">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Start typing to search across all content...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((item, index) => (
                  <Link
                    key={`${item.category}-${item.slug}-${index}`}
                    href={`/${item.category}/${item.slug}`}
                    onClick={onClose}
                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-gray-400 dark:text-slate-500">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-medium rounded capitalize">
                            {item.category}
                          </span>
                          {item.date && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-500">
                              <Calendar className="h-3 w-3" />
                              <time>{item.date}</time>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                +{item.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            {results.length > 0 ? (
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <p>
                  Showing {results.length} result{results.length !== 1 ? 's' : ''}
                  {results.length === 10 && ' (limited to 10)'}
                </p>
                <div className="hidden sm:flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600 font-semibold">↵</kbd>
                  <span>to select</span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600 font-semibold">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            ) : query.trim() ? (
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600 font-semibold">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600 font-semibold">
                    {isMac ? '⌘' : 'Ctrl'}K
                  </kbd>
                  <span>to open search</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
