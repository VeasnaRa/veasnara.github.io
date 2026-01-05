import PageRenderer from './PageRenderer'
import PaginationControls from './PaginationControls'

export default function DynamicPage({
  items,
  pageConfig,
  pageName,
  children // For simple markdown mode
}) {
  const mode = pageConfig?.mode || 'simple'
  const itemsPerPage = pageConfig?.itemsPerPage || 12
  const columns = pageConfig?.columns || 2

  // Simple mode - show markdown content
  if (mode === 'simple') {
    return children
  }

  // Grid or List mode with pagination
  if (items.length > itemsPerPage) {
    return (
      <PaginationControls
        items={items}
        mode={mode}
        columns={columns}
        itemsPerPage={itemsPerPage}
        pageName={pageName}
      />
    )
  }

  // Grid or List mode without pagination
  return <PageRenderer items={items} mode={mode} columns={columns} pageName={pageName} />
}
