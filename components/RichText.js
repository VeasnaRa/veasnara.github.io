// Renders plain config strings (e.g. siteConfig.aboutSection.content) as paragraphs.
// Supports two bits of markdown so site.config.js stays plain text:
//   [École Nationale Supérieure ... (ENSIIE)](https://www.ensiie.fr/)   → link
//   **Data Science**                                                    → bold

// One alternation so links and bold are matched in the order they appear:
// group 1/2 = link label/url, group 3 = bold text.
const INLINE_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*/g

function renderInline(text, keyPrefix) {
  const nodes = []
  let cursor = 0

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const [full, label, url, bold] = match

    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index))
    }

    if (bold !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b-${match.index}`}>{bold}</strong>)
    } else {
      const isExternal = /^https?:\/\//.test(url)
      nodes.push(
        <a
          key={`${keyPrefix}-a-${match.index}`}
          href={url}
          className="rich-link"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      )
    }

    cursor = match.index + full.length
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }

  return nodes
}

export default function RichText({ text, className }) {
  if (!text) return null

  // Blank lines separate paragraphs; single newlines and the indentation that
  // comes from writing the string as a template literal collapse to spaces.
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)

  return paragraphs.map((paragraph, index) => (
    <p key={index} className={className}>
      {renderInline(paragraph, index)}
    </p>
  ))
}
