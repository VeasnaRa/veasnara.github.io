import { Tag } from 'lucide-react'

export default function Tags({ tags }) {
  if (!tags || tags.length === 0) {
    return null
  }

  // Handle both string and array formats
  const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-gray-500" />
      {tagArray.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
