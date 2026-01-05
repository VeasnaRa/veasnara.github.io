'use client'

import { useState, useRef } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CodeBlock({ children, ...props }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef(null)

  const extractCode = (node) => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractCode).join('')
    if (node?.props?.children) return extractCode(node.props.children)
    return ''
  }

  const handleCopy = async () => {
    try {
      // Try to get text from the pre element directly
      const preElement = preRef.current
      if (!preElement) return

      const codeText = preElement.textContent || preElement.innerText || ''

      await navigator.clipboard.writeText(codeText.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre ref={preRef} {...props}>{children}</pre>
    </div>
  )
}
