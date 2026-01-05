import { getPageItems } from '../../lib/markdown'
import siteConfig from '../../site.config'
import DynamicPage from '../../components/DynamicPage'

export default function ProjectsPage() {
  const pageConfig = siteConfig.pages?.projects
  const items = getPageItems('projects')
  const serializableItems = JSON.parse(JSON.stringify(items))

  return (
    <div className="w-full">
      <div className="space-y-10 py-4">
        <header className="space-y-4">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900">
            Portfolio
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-lg text-gray-600">Things I've built and worked on</p>
        </header>

        <DynamicPage items={serializableItems} pageConfig={pageConfig} pageName="projects" />
      </div>
    </div>
  )
}
