import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import TableOfContents from '../../../components/TableOfContents'
import { mdxComponents } from '../../../components/MDXComponents'
import Tags from '../../../components/Tags'

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
    <div className="w-full bg-white dark:bg-slate-950">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to blog
      </Link>

      <div className="grid xl:grid-cols-[1fr_280px] gap-12">
        <article className="min-w-0">
          <div className="space-y-6">
            <header className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-block rounded-lg bg-gray-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-white">
                  Article
                </div>
                {dateStr && (
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <time className="text-sm">{dateStr}</time>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                {data.title}
              </h1>

              {data.tags && <Tags tags={data.tags} />}
            </header>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent"></div>

            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none w-full">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [
                      rehypeKatex,
                      [rehypePrettyCode, {
                        theme: 'github-dark',
                        keepBackground: false
                      }]
                    ]
                  }
                }}
              />
            </div>
          </div>
        </article>

        <TableOfContents content={content} />
      </div>
    </div>
  )
}
