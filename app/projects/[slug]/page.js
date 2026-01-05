import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, ArrowLeft, ExternalLink, Github } from 'lucide-react'
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
  const projectsDirectory = path.join(process.cwd(), 'content/projects')
  const files = fs.readdirSync(projectsDirectory)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace('.md', '')
    }))
}

export default async function ProjectPost({ params }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content/projects', `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const dateStr = data.date instanceof Date
    ? data.date.toLocaleDateString()
    : data.date

  return (
    <div className="w-full bg-white">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to projects
      </Link>

      <div className="grid xl:grid-cols-[1fr_280px] gap-12">
        <article className="min-w-0">
          <div className="space-y-6">
            <header className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-900">
                  Project
                </div>
                {dateStr && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <time className="text-sm">{dateStr}</time>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {data.title}
              </h1>

              {data.tech && (
                <p className="text-sm text-gray-500 italic">{data.tech}</p>
              )}

              {data.tags && (
                <Tags tags={data.tags} />
              )}

              {(data.demo || data.github) && (
                <div className="flex gap-3 pt-2">
                  {data.demo && (
                    <a
                      href={data.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                  {data.github && (
                    <a
                      href={data.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <Github className="h-4 w-4" />
                      View Code
                    </a>
                  )}
                </div>
              )}
            </header>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            <div className="prose prose-lg prose-gray max-w-none w-full">
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
