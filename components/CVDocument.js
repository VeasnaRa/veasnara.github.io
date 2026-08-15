'use client'

import { useState } from 'react'
import { Download, Printer } from 'lucide-react'

/**
 * Toolbar + body of the CV page.
 *
 * `versions` is an array of { code, label, pdf, node }. Every version is
 * rendered on the server and shipped with the page, so switching language is
 * instant and works on a fully static export. The language buttons only appear
 * when there is more than one version.
 */
export default function CVDocument({ versions = [], showPrint = true }) {
  const [activeCode, setActiveCode] = useState(versions[0]?.code)

  if (versions.length === 0) return null

  const current = versions.find(version => version.code === activeCode) || versions[0]

  // Offer the PDF of the language being read. If that one has no PDF yet, fall
  // back to any other language's PDF rather than hiding the button entirely —
  // and say which language it is.
  const fallback = current.pdf ? null : versions.find(version => version.pdf)
  const download = current.pdf
    ? { href: current.pdf, label: 'Download PDF' }
    : fallback
      ? { href: fallback.pdf, label: `Download PDF (${fallback.label})` }
      : null

  return (
    <>
      <div className="cv-toolbar print:hidden">
        {versions.length > 1 ? (
          <div className="cv-langs" role="group" aria-label="CV language">
            {versions.map(version => (
              <button
                key={version.code}
                type="button"
                onClick={() => setActiveCode(version.code)}
                data-active={version.code === current.code}
                aria-pressed={version.code === current.code}
                className="cv-lang"
              >
                {version.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="cv-actions">
          {download && (
            <a href={download.href} download className="cv-action">
              <Download className="h-4 w-4" />
              {download.label}
            </a>
          )}
          {showPrint && (
            <button
              type="button"
              onClick={() => window.print()}
              className="cv-action cv-action--ghost"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          )}
        </div>
      </div>

      <div className="cv-content prose max-w-none">{current.node}</div>
    </>
  )
}
