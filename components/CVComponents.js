// Building blocks for the CV markdown (content/cv.md, content/cv-fr.md).
// These are handed to MDXRemote, so the CV stays a plain markdown file while
// still rendering the two-column timeline layout.
import { MapPin } from 'lucide-react'

// One timeline row: dates and place on the left, the entry itself on the right.
// `href` turns the title into a link (school website, GitHub repo, ...).
export function Entry({ date, location, title, subtitle, href, children }) {
  return (
    <section className="cv-entry">
      <div className="cv-entry-meta">
        {date && <p className="cv-entry-date">{date}</p>}
        {location && (
          <p className="cv-entry-location">
            <MapPin className="cv-entry-pin" aria-hidden="true" />
            <span>{location}</span>
          </p>
        )}
      </div>

      <div className="cv-entry-body">
        {title && (
          <h3 className="cv-entry-title">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
        )}
        {subtitle && <p className="cv-entry-subtitle">{subtitle}</p>}
        {children && <div className="cv-entry-content">{children}</div>}
      </div>
    </section>
  )
}

// Same grid, empty left column — for sections such as Skills or Languages that
// have no date but should still line up with the entries above them.
export function Block({ children }) {
  return (
    <section className="cv-entry">
      <div className="cv-entry-meta" />
      <div className="cv-entry-body">
        <div className="cv-entry-content">{children}</div>
      </div>
    </section>
  )
}

// The highlighted statement at the top of the CV.
export function Lead({ children }) {
  return <div className="cv-lead">{children}</div>
}

export const cvComponents = { Entry, Block, Lead }
