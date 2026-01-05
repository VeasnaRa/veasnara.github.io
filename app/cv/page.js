import { getMarkdownContent } from '../../lib/markdown'
import { MDXRemote } from 'next-mdx-remote/rsc'
import CVButtons from '../../components/CVButtons'
import siteConfig from '../../site.config'
import Image from 'next/image'

export default function CVPage() {
  const cvFile = siteConfig.cvFile
  const isPdf = cvFile && cvFile.toLowerCase().endsWith('.pdf')
  const isImage = cvFile && (cvFile.toLowerCase().endsWith('.png') || cvFile.toLowerCase().endsWith('.jpg') || cvFile.toLowerCase().endsWith('.jpeg'))

  // Only load markdown content if no file is provided
  let content = null
  if (!cvFile) {
    const markdownData = getMarkdownContent('cv')
    content = markdownData.content
  }

  return (
    <article className="w-full">
      <div className="space-y-8 py-4">
        <header className="space-y-4 print:space-y-2">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900 print:hidden">
            Curriculum Vitae
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight print:text-4xl">CV</h1>
            <CVButtons showDownload={!!cvFile} />
          </div>
        </header>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent print:hidden"></div>

        {/* PDF Embed */}
        {isPdf && (
          <div className="w-full">
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
              <iframe
                src={cvFile}
                className="w-full h-[800px] md:h-[1000px]"
                title="CV PDF"
              />
            </div>
          </div>
        )}

        {/* Image Display */}
        {isImage && (
          <div className="w-full flex justify-center">
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white max-w-4xl">
              <Image
                src={cvFile}
                alt="CV"
                width={800}
                height={1000}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        )}

        {/* Markdown Content with Professional Styling */}
        {!cvFile && content && (
          <div className="cv-content bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12 max-w-4xl mx-auto print:border-0 print:shadow-none print:p-0">
            <div className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b-2 prose-h2:border-gray-900
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-3 prose-ul:space-y-1
              prose-li:text-gray-700 prose-li:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              print:prose-h2:text-xl print:prose-h3:text-lg
              print:text-sm">
              <MDXRemote source={content} />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
