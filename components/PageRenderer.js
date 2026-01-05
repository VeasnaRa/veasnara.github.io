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

  // List style card
  if (mode === 'list') {
    return (
      <Link href={`/${pageName}/${item.slug}`} className="block group">
        <article className="relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all duration-300">
          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            {item.thumbnail && (
              <div className="relative w-full h-48 md:h-full bg-gray-100 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className={`p-8 space-y-3 ${!item.thumbnail ? 'md:col-span-2' : ''}`}>
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
          </div>
        </article>
      </Link>
    )
  }

  // Project/grid style card
  return (
    <article className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-lg transition-all duration-300">
      <Link href={`/${pageName}/${item.slug}`} className="block">
        {item.thumbnail && (
          <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-4 space-y-2">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
            {item.title}
          </h2>

          {item.date && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <time>{item.date}</time>
            </div>
          )}

          {(item.description || item.excerpt) && (
            <p className="text-sm text-gray-600 line-clamp-2">{item.description || item.excerpt}</p>
          )}

          {item.tech && (
            <p className="text-xs text-gray-500 italic">{item.tech}</p>
          )}
        </div>
      </Link>

      {(item.demo || item.github) && (
        <div className="px-4 pb-4 flex gap-2">
          {item.demo && (
            <a
              href={item.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              Demo
            </a>
          )}
          {item.github && (
            <a
              href={item.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
            >
              <Github className="h-3 w-3" />
              Code
            </a>
          )}
        </div>
      )}
    </article>
  )
}
