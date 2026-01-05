import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export function getMarkdownContent(slug) {
  const filePath = path.join(contentDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    frontMatter: data,
    content
  }
}

export function getBlogPosts() {
  const blogDirectory = path.join(contentDirectory, 'blog')
  const files = fs.readdirSync(blogDirectory)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '')
      const filePath = path.join(blogDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...data,
        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getProjects() {
  const projectsDirectory = path.join(contentDirectory, 'projects')

  // Check if projects directory exists
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const files = fs.readdirSync(projectsDirectory)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '')
      const filePath = path.join(projectsDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...data
      }
    })
}

// Universal function to get items for any page
export function getPageItems(pageName) {
  const pageDirectory = path.join(contentDirectory, pageName)

  // Check if page directory exists
  if (!fs.existsSync(pageDirectory)) {
    return []
  }

  const files = fs.readdirSync(pageDirectory)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '')
      const filePath = path.join(pageDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...data,
        // Auto-format date if it exists
        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date
      }
    })
    // Sort by date if date field exists, newest first
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date)
      }
      return 0
    })
}
