// Custom components for MDX rendering
// These components add IDs to headings for Table of Contents linking
import CodeBlock from './CodeBlock'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const mdxComponents = {
  h2: ({ children, ...props }) => {
    const text = typeof children === 'string' ? children : children?.toString() || ''
    const id = slugify(text)
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }) => {
    const text = typeof children === 'string' ? children : children?.toString() || ''
    const id = slugify(text)
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    )
  },
  pre: ({ children, ...props }) => {
    // Extract the code content for copying
    const code = children?.props?.children || ''
    return <CodeBlock {...props} raw={code}>{children}</CodeBlock>
  }
}
