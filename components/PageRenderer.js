'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, ExternalLink, Github } from 'lucide-react'

export default function PageRenderer({ items, mode, columns, pageName }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No items found.</p>
  }

  // Grid mode - card grid layout
  if (mode === 'grid') {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4'
    }

    return (
      <div className={`grid gap-6 ${gridCols[columns] || gridCols[2]}`}>
        {items.map(item => (
          <ItemCard key={item.slug} item={item} pageName={pageName} mode="grid" />
        ))}
      </div>
    )
  }

  // List mode - vertical stack
  return (
    <div className="grid gap-6">
      {items.map(item => (
        <ItemCard key={item.slug} item={item} pageName={pageName} mode="list" />
      ))}
    </div>
  )
}

function ItemCard({ item, pageName, mode }) {
  const isProject = item.demo || item.github
  const isBlog = item.date

  // Blog/list style card
  if (mode === 'list' || isBlog) {
    return (
      <Link href={`/${pageName}/${item.slug}`} className="block group">
        <article className="relative p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {item.date && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <time>{item.date}</time>
                </div>
              )}
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-2 transition-all" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
              {item.title}
            </h2>

            {item.tech && (
              <p className="text-sm text-gray-500 italic">{item.tech}</p>
            )}

            {(item.excerpt || item.description) && (
              <p className="text-gray-600 line-clamp-2">{item.excerpt || item.description}</p>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // Project/grid style card
  return (
    <article className="group relative p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
            {item.title}
          </h2>
          {item.tech && (
            <p className="text-sm text-gray-500 italic">{item.tech}</p>
          )}
          {item.date && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <time>{item.date}</time>
            </div>
          )}
        </div>

        {(item.description || item.excerpt) && (
          <p className="text-gray-600">{item.description || item.excerpt}</p>
        )}

        <div className="flex gap-3 pt-2 flex-wrap">
          {item.demo && (
            <a
              href={item.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </a>
          )}
          {item.github && (
            <a
              href={item.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          )}
          {!item.demo && !item.github && (
            <Link
              href={`/${pageName}/${item.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Read More
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
