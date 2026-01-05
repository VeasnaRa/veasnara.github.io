import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function generateStaticParams() {
  const blogDirectory = path.join(process.cwd(), 'content/blog')
  const files = fs.readdirSync(blogDirectory)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace('.md', '')
    }))
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const dateStr = data.date instanceof Date
    ? data.date.toLocaleDateString()
    : data.date

  return (
    <article className="w-full bg-white dark:bg-slate-950">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to blog
      </Link>

      <div className="space-y-8">
        <header className="space-y-4">
          <div className="inline-block rounded-lg bg-gray-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-gray-900 dark:text-white">
            Article
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            {data.title}
          </h1>
          {dateStr && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
              <Calendar className="h-5 w-5" />
              <time className="text-base">{dateStr}</time>
            </div>
          )}
        </header>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent"></div>

        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none w-full">
          <MDXRemote source={content} />
        </div>
      </div>
    </article>
  )
}
