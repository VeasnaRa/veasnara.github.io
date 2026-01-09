import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, ArrowLeft, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import TableOfContents from '../../../components/TableOfContents'
import { mdxComponents } from '../../../components/MDXComponents'
import Tags from '../../../components/Tags'
import siteConfig from '../../../site.config'

// Generate metadata for individual posts
export async function generateMetadata({ params }) {
  const { page, slug } = await params
  const filePath = path.join(process.cwd(), 'content', page, `${slug}.md`)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return {
      title: 'Not Found',
      description: 'Page not found'
    }
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)

  const postTitle = data.title || slug
  const postDescription = data.description || data.excerpt || `${postTitle} - ${siteConfig.name}`
  const postImage = data.thumbnail || siteConfig.profileImage || '/images/og-image.png'
  const postUrl = `${siteConfig.siteUrl}/${page}/${slug}`

  // Format date for article metadata
  const publishedTime = data.date instanceof Date
    ? data.date.toISOString()
    : data.date
      ? new Date(data.date).toISOString()
      : undefined

  return {
    title: postTitle,
    description: postDescription,
    keywords: data.tags || [],
    authors: [{ name: siteConfig.author || siteConfig.name }],
    openGraph: {
      title: `${postTitle} | ${siteConfig.title}`,
      description: postDescription,
      url: postUrl,
      type: 'article',
      publishedTime,
      authors: [siteConfig.author || siteConfig.name],
      tags: data.tags || [],
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: postTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${postTitle} | ${siteConfig.title}`,
      description: postDescription,
      images: [postImage],
      creator: siteConfig.social?.twitter?.replace('https://twitter.com/', '@') || '@yourusername',
    },
  }
}

export async function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), 'content')

  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const folders = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  const allParams = []

  for (const folder of folders) {
    const folderPath = path.join(contentDirectory, folder)
    const files = fs.readdirSync(folderPath)

    const slugs = files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        page: folder,
        slug: file.replace('.md', '')
      }))

    allParams.push(...slugs)
  }

  return allParams
}

export const dynamicParams = false

export default async function DynamicPost({ params }) {
  const { page, slug } = await params
  const filePath = path.join(process.cwd(), 'content', page, `${slug}.md`)

  // Check if file exists, if not show 404
  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  // Check if htmlSource is specified in frontmatter
  let htmlContent = null
  if (data.htmlSource) {
    const htmlPath = path.join(process.cwd(), 'public', data.htmlSource)
    if (fs.existsSync(htmlPath)) {
      const fullHtml = fs.readFileSync(htmlPath, 'utf8')
      const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
      if (bodyMatch) {
        htmlContent = bodyMatch[1]

        // Remove R Markdown header elements (title, author, date) to avoid duplicates
        htmlContent = htmlContent.replace(/<h1[^>]*class="title[^"]*"[^>]*>[\s\S]*?<\/h1>/i, '')
        htmlContent = htmlContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '')
        htmlContent = htmlContent.replace(/<h3[^>]*class="author[^"]*"[^>]*>[\s\S]*?<\/h3>/gi, '')
        htmlContent = htmlContent.replace(/<h4[^>]*class="author[^"]*"[^>]*>[\s\S]*?<\/h4>/gi, '')
        htmlContent = htmlContent.replace(/<p[^>]*class="author[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '')
        htmlContent = htmlContent.replace(/<h4[^>]*class="date[^"]*"[^>]*>[\s\S]*?<\/h4>/gi, '')
        htmlContent = htmlContent.replace(/<p[^>]*class="date[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '')
      } else {
        htmlContent = fullHtml
      }
    }
  }

  // Get CSS and JS files from frontmatter
  const cssFiles = data.cssFiles || []
  const jsFiles = data.jsFiles || []

  const dateStr = data.date instanceof Date
    ? data.date.toLocaleDateString()
    : data.date

  return (
    <div className="w-full ">
      <Link
        href={`/${page}`}
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to {page}
      </Link>

      <div className="grid xl:grid-cols-[1fr_280px] gap-12">
        <article className="min-w-0">
          <div className="space-y-6">
            <header className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-block rounded-lg bg-gray-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-white capitalize">
                  {page}
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

              {data.tech && (
                <p className="text-sm text-gray-500 dark:text-slate-400 italic">{data.tech}</p>
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-gray-700 dark:hover:bg-slate-200 transition-colors text-sm font-medium"
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
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                      <Github className="h-4 w-4" />
                      View Code
                    </a>
                  )}
                </div>
              )}
            </header>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent"></div>

            {htmlContent ? (
              <>
                {/* Load MathJax for R Markdown math rendering */}
                <script
                  src="https://mathjax.rstudio.com/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
                  async
                ></script>

                {/* Load custom CSS files */}
                {cssFiles.length > 0 && cssFiles.map((cssFile, index) => (
                  <link key={index} rel="stylesheet" href={cssFile} />
                ))}

                <div
                  className="prose prose-lg prose-gray dark:prose-invert max-w-none w-full rmarkdown-content"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Load custom JS files */}
                {jsFiles.length > 0 && jsFiles.map((jsFile, index) => (
                  <script key={index} src={jsFile} async></script>
                ))}
              </>
            ) : (
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none w-full">
                <MDXRemote
                  source={content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkMath, remarkGfm],
                      rehypePlugins: [
                        rehypeSlug,
                        [rehypeAutolinkHeadings, {
                          behavior: 'wrap',
                          properties: { className: ['anchor'] }
                        }],
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
            )}
          </div>
        </article>

        <TableOfContents content={content} />
      </div>
    </div>
  )
}