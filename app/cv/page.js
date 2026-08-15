import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import CVDocument from '../../components/CVDocument'
import { cvComponents } from '../../components/CVComponents'
import siteConfig from '../../site.config'

// Used when cvConfig.languages is not set: a single English CV from content/cv.md
const DEFAULT_LANGUAGES = [{ code: 'en', label: 'English', file: 'cv', pdf: null }]

/**
 * Every configured language whose markdown file actually exists. A PDF is only
 * advertised once the file is really sitting in public/, so a missing PDF hides
 * the download button instead of producing a broken link.
 */
function getCvVersions() {
  const languages = siteConfig.cvConfig?.languages || DEFAULT_LANGUAGES

  return languages.flatMap(language => {
    const markdownPath = path.join(process.cwd(), 'content', `${language.file}.md`)
    if (!fs.existsSync(markdownPath)) return []

    const { content } = matter(fs.readFileSync(markdownPath, 'utf8'))
    const hasPdf = Boolean(language.pdf) &&
      fs.existsSync(path.join(process.cwd(), 'public', language.pdf))

    if (language.pdf && !hasPdf) {
      console.warn(
        `[cv] public${language.pdf} not found — readers of the "${language.label}" CV will be offered another language's PDF, or none if there is none.`
      )
    }

    return [{
      code: language.code,
      label: language.label,
      pdf: hasPdf ? language.pdf : null,
      content
    }]
  })
}

export async function generateMetadata() {
  return {
    title: 'CV',
    description: `Curriculum Vitae of ${siteConfig.name} - ${siteConfig.role} at ${siteConfig.affiliation}`,
    openGraph: {
      title: `CV | ${siteConfig.title}`,
      description: `Curriculum Vitae of ${siteConfig.name} - ${siteConfig.role} at ${siteConfig.affiliation}`,
      url: `${siteConfig.siteUrl}/cv`,
      type: 'profile',
      images: [
        {
          url: siteConfig.profileImage || '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} CV`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `CV | ${siteConfig.title}`,
      description: `Curriculum Vitae of ${siteConfig.name} - ${siteConfig.role} at ${siteConfig.affiliation}`,
      images: [siteConfig.profileImage || '/images/og-image.png'],
    },
  }
}

export default function CVPage() {
  const cvFile = siteConfig.cvFile
  const isPdf = cvFile && cvFile.toLowerCase().endsWith('.pdf')
  const isImage = cvFile && /\.(png|jpe?g)$/i.test(cvFile)

  const showDownload = siteConfig.cvConfig?.showDownloadButton !== false
  const showPrint = siteConfig.cvConfig?.showPrintButton !== false

  // A configured cvFile (PDF or image) replaces the markdown CV entirely.
  const versions = cvFile
    ? [{
        code: 'file',
        label: 'CV',
        pdf: showDownload ? cvFile : null,
        node: isPdf ? (
          <div className="w-full cv-pdf-container">
            <div className="border-2 border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-slate-900">
              <iframe src={cvFile} className="w-full h-[800px] md:h-[1000px]" title="CV PDF" />
            </div>
          </div>
        ) : isImage ? (
          <div className="w-full flex justify-center">
            <div className="border-2 border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-slate-900 max-w-4xl cv-image-container">
              <Image src={cvFile} alt="CV" width={800} height={1000} className="w-full h-auto" priority />
            </div>
          </div>
        ) : null
      }]
    : getCvVersions().map(version => ({
        code: version.code,
        label: version.label,
        pdf: showDownload ? version.pdf : null,
        node: (
          <MDXRemote
            source={version.content}
            components={cvComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        )
      }))

  return (
    <article className="w-full">
      <div className="space-y-8 py-4">
        <header className="space-y-4 print:space-y-2">
          <div className="inline-block rounded-lg bg-gray-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-gray-900 dark:text-white print:hidden">
            Curriculum Vitae
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight print:text-4xl">
              {siteConfig.name}
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-700 dark:text-slate-300">
                {siteConfig.role}
              </p>
              <p className="text-base text-gray-600 dark:text-slate-400">
                {siteConfig.affiliation}
              </p>
            </div>
          </div>
        </header>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent print:hidden"></div>

        <CVDocument versions={versions} showPrint={showPrint} />
      </div>
    </article>
  )
}
