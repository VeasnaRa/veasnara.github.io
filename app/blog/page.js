import { getPageItems } from '../../lib/markdown'
import siteConfig from '../../site.config'
import DynamicPage from '../../components/DynamicPage'

export default function BlogPage() {
  const pageConfig = siteConfig.pages?.blog
  const posts = getPageItems('blog')

  // Ensure items are serializable (no functions, Date objects converted to strings)
  const serializablePosts = JSON.parse(JSON.stringify(posts))

  return (
    <div className="w-full">
      <div className="space-y-10 py-4">
        <header className="space-y-4">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900">
            Blog
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Latest Posts</h1>
          <p className="text-lg text-gray-600">Thoughts, ideas, and tutorials</p>
        </header>

        <DynamicPage items={serializablePosts} pageConfig={pageConfig} pageName="blog" />
      </div>
    </div>
  )
}
