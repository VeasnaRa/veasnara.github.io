import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, ArrowLeft, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
    <article className="w-full bg-white">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to projects
      </Link>

      <div className="space-y-8">
        <header className="space-y-4">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900">
            Project
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            {dateStr && (
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-5 w-5" />
                <time className="text-base">{dateStr}</time>
              </div>
            )}

            {data.tech && (
              <span className="text-sm text-gray-500 italic">{data.tech}</span>
            )}
          </div>

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
          <MDXRemote source={content} />
        </div>
      </div>
    </article>
  )
}
