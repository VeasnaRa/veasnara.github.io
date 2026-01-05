'use client'

import { Download } from 'lucide-react'
import siteConfig from '../site.config'

export default function CVButtons({ showDownload = true }) {
  const cvFile = siteConfig.cvFile
  const isPdf = cvFile && cvFile.toLowerCase().endsWith('.pdf')

  return (
    <div className="flex gap-3 print:hidden">
      {showDownload && cvFile && (
        <a
          href={cvFile}
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Download className="h-4 w-4" />
          Download {isPdf ? 'PDF' : 'CV'}
        </a>
      )}
    </div>
  )
}
