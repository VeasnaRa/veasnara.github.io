'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      matches.push({ level, text, id })
    }

    setHeadings(matches)

    // Observe heading elements for scroll spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1.0
      }
    )

    // Wait for DOM to be ready
    setTimeout(() => {
      const headingElements = document.querySelectorAll('h2[id], h3[id]')
      headingElements.forEach((element) => observer.observe(element))
    }, 100)

    return () => observer.disconnect()
  }, [content])

  if (headings.length === 0) {
    return null
  }

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          <List className="h-4 w-4" />
          <span>On This Page</span>
        </div>

        <nav className="space-y-2">
          {headings.map((heading, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(heading.id)}
              className={`block text-left text-sm transition-colors w-full ${
                heading.level === 3 ? 'pl-4' : ''
              } ${
                activeId === heading.id
                  ? 'text-gray-900 font-medium border-l-2 border-gray-900 pl-3'
                  : 'text-gray-600 hover:text-gray-900 border-l-2 border-transparent pl-3 hover:border-gray-300'
              }`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
