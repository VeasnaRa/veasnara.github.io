import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function getAllContent() {
  const contentDirectory = path.join(process.cwd(), 'content')

  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const allContent = []

  // Get all folders in content directory
  const folders = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  // Process each folder (blog, projects, publications, etc.)
  for (const folder of folders) {
    const folderPath = path.join(contentDirectory, folder)
    const files = fs.readdirSync(folderPath)

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const filePath = path.join(folderPath, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      const slug = file.replace('.md', '')

      allContent.push({
        category: folder,
        slug: slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date instanceof Date
          ? data.date.toLocaleDateString()
          : data.date || '',
        tags: data.tags || [],
        tech: data.tech || '',
      })
    }
  }

  // Sort by date (newest first)
  allContent.sort((a, b) => {
    const dateA = new Date(a.date || 0)
    const dateB = new Date(b.date || 0)
    return dateB - dateA
  })

  return allContent
}
