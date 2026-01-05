# Personal Portfolio Website

Static website for portfolio, blog, and CV.

## Quick Start

```bash
npm install
npm run dev
```

## How to Use

### Configure Site

Edit `site.config.js`:

```javascript
module.exports = {
  name: "Your Name",
  title: "My Portfolio",
  description: "...",

  // Profile picture (optional)
  profileImage: "/images/profile.jpg", // or null to show initial letter

  // Current role and affiliation
  role: "PhD Student",
  affiliation: "Stanford University",

  // Research interests (with optional icons)
  interests: [
    { name: "Machine Learning", icon: "Brain" },
    { name: "Web Development", icon: "Code" },
    "Photography" // plain text works too
  ],

  // Navigation items (with optional icons from Lucide React)
  navigation: [
    { title: "Home", path: "/", icon: "Home" },
    { title: "CV", path: "/cv", icon: "FileText" },
    { title: "Blog", path: "/blog", icon: "BookOpen" }
  ],

  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "your.email@example.com"
  }
}
```

### Add Profile Picture

1. Place your image in `public/images/` folder (e.g., `public/images/profile.jpg`)
2. Update `site.config.js`:
   ```javascript
   profileImage: "/images/profile.jpg"
   ```
3. Use `null` to show initial letter instead:
   ```javascript
   profileImage: null
   ```

**Tips:**
- Use square images (recommended: 400x400px or larger)
- Supported formats: JPG, PNG, WebP
- Keep file size under 500KB

### Customize Favicon & SEO

Make your site stand out with custom favicons and proper SEO metadata.

**Favicon Setup:**

1. Create your favicon files:
   - `favicon.ico` (32x32 or 16x16) - Standard favicon
   - `icon.png` (512x512) - Modern browsers & PWA
   - `apple-icon.png` (180x180) - Apple devices

2. Place them in the `public/` folder:
   ```
   public/
   ├── favicon.ico
   ├── icon.png
   └── apple-icon.png
   ```

3. Update `site.config.js`:
   ```javascript
   favicon: "/favicon.ico",
   icon: "/icon.png",
   appleIcon: "/apple-icon.png",
   ```

**SEO Settings:**

Configure SEO metadata in `site.config.js`:

```javascript
siteUrl: "https://yourdomain.com",
author: "Your Name",
keywords: ["portfolio", "blog", "your", "keywords"],
```

**What's Included:**
- ✅ Open Graph metadata (Facebook, LinkedIn sharing)
- ✅ Twitter Card metadata (Twitter sharing)
- ✅ Proper favicon support (all devices)
- ✅ SEO-friendly meta tags
- ✅ Google indexing optimization
- ✅ Dynamic page titles with template

**Tools to Create Favicons:**
- [Favicon.io](https://favicon.io/) - Generate from text, image, or emoji
- [RealFaviconGenerator](https://realfavicongenerator.net/) - All formats at once
- Design tools: Figma, Canva, Photoshop

### Customize Navigation Icons

Navigation items support optional icons from [Lucide React](https://lucide.dev/icons).

**How to Add Icons:**

In `site.config.js`, add an `icon` field to any navigation item:

```javascript
navigation: [
  { title: "Home", path: "/", icon: "Home" },
  { title: "CV", path: "/cv", icon: "FileText" },
  { title: "Blog", path: "/blog", icon: "BookOpen" },
  { title: "Projects", path: "/projects", icon: "Code" },
  { title: "Publications", path: "/publications", icon: "GraduationCap" }
]
```

**Available Icons:**

Browse all available icons at [lucide.dev/icons](https://lucide.dev/icons). Use the exact icon name (case-sensitive):
- `Home`, `User`, `Mail`, `Phone`
- `FileText`, `Download`, `Upload`
- `BookOpen`, `Book`, `Library`
- `Code`, `Terminal`, `Cpu`
- `GraduationCap`, `Award`, `Trophy`
- And 1000+ more!

**Notes:**
- Icons are optional - you can mix items with and without icons
- Icons work on both desktop and mobile navigation
- Invalid icon names will be ignored (no error shown)

### Search Functionality

A powerful search feature is built-in to help users find content across all pages.

**Features:**
- Search across all blog posts, projects, publications, and custom pages
- Real-time search results as you type
- Search by title, description, tags, or category
- Beautiful modal interface with keyboard shortcuts
- Click the search icon in the header navigation to open
- Press `Escape` to close the search modal

**How to Use:**
1. Click the 🔍 search icon in the header (after navigation items)
2. Type your search query
3. Click on any result to navigate to that page
4. Results show the category, date, title, description, and tags

**What Gets Searched:**
- All markdown files in the `content/` folder
- Searches: title, description, tags, and category
- Results are sorted by date (newest first)
- Limited to 10 results for performance

### Add CV PDF Download (Optional)

1. Place your CV PDF in `public/cv/` folder (e.g., `public/cv/resume.pdf`)
2. Update `site.config.js`:
   ```javascript
   cvPdf: "/cv/resume.pdf"
   ```
3. The Download PDF button will appear on your CV page

**Features:**
- Download PDF button (only shows if you set `cvPdf`)
- Print button (works for the markdown content)
- SEO-friendly markdown content + downloadable PDF option

### Create Custom Pages

**Everything is content-driven!** No need to touch code in the `app/` folder. Simply add markdown files to the `content/` folder, and pages are automatically created.

This applies to **all pages** including blog, projects, and any custom collections you want to create.

#### Two Types of Pages

**1. Simple Pages (Single Markdown File)**

Use Case: About page, Contact page, Terms of Service, etc.

How to Create:
1. Create a file in `content/` folder: `content/about.md`
2. Add frontmatter and content:
   ```markdown
   ---
   title: About Me
   description: Learn more about me
   ---

   # About Me

   Your content here...
   ```
3. **That's it!** Page is automatically available at `/about`

Example:
- `content/about.md` → Available at `/about`
- `content/contact.md` → Available at `/contact`
- `content/terms.md` → Available at `/terms`

**2. Collection Pages (Folder with Multiple Items)**

Use Case: Publications, Gallery, Courses, Tutorials, etc.

How to Create:
1. Create a folder in `content/`: `content/publications/`
2. Add markdown files inside:
   ```
   content/publications/
   ├── paper-2024.md
   ├── paper-2023.md
   └── conference-talk.md
   ```
3. Each file has frontmatter:
   ```markdown
   ---
   title: My Research Paper
   date: 2024-01-15
   description: A study on...
   tags: [research, AI]
   ---

   # My Research Paper

   Content here...
   ```
4. **That's it!** Collection page is at `/publications` and each item at `/publications/paper-2024`

Example:
- `content/publications/` → Collection at `/publications`
- `content/publications/paper-2024.md` → Item at `/publications/paper-2024`
- `content/courses/` → Collection at `/courses`
- `content/courses/ml-101.md` → Item at `/courses/ml-101`

#### Configuring Display Mode

By default, collection pages use a 3-column grid. To customize, edit `site.config.js`:

```javascript
pages: {
  projects: {
    mode: "grid",          // "grid" or "list"
    itemsPerPage: 12,
    columns: 2
  },
  blog: {
    mode: "list",
    itemsPerPage: 6,
    columns: 4
  },
  // Add your new pages
  publications: {
    mode: "grid",          // Cards in grid
    itemsPerPage: 9,
    columns: 3             // 3 columns
  },
  courses: {
    mode: "list",          // Large cards with thumbnails
    itemsPerPage: 5,
    columns: 1
  }
}
```

#### Adding to Navigation

Edit `site.config.js`:

```javascript
navigation: [
  { title: "Home", path: "/" },
  { title: "CV", path: "/cv" },
  { title: "Blog", path: "/blog" },
  { title: "Projects", path: "/projects" },
  { title: "Publications", path: "/publications" },  // New!
  { title: "About", path: "/about" }                 // New!
]
```

#### Adding to Home Page

Show latest items on home page by editing `site.config.js`:

```javascript
homeSections: [
  {
    type: "blog",
    title: "Latest Posts",
    count: 1,
    showViewAll: true,
    viewAllText: "View All Posts",
    viewAllLink: "/blog"
  },
  {
    type: "projects",
    title: "Featured Projects",
    count: 2,
    showViewAll: true,
    viewAllText: "View All Projects",
    viewAllLink: "/projects"
  },
  // Add your new section
  {
    type: "publications",
    title: "Recent Publications",
    count: 3,
    showViewAll: true,
    viewAllText: "View All Publications",
    viewAllLink: "/publications"
  }
]
```

#### Complete Example: Adding a "Courses" Page

**Step 1:** Create folder and files
```
content/courses/
├── intro-to-ml.md
├── deep-learning.md
└── nlp-basics.md
```

**Step 2:** Add content to each file
```markdown
---
title: Introduction to Machine Learning
date: 2024-01-10
description: Learn ML fundamentals
tags: [ML, beginner]
thumbnail: /images/ml-course.png
---

# Introduction to Machine Learning

Course content here...
```

**Step 3:** Configure display in `site.config.js`
```javascript
pages: {
  // ... existing pages
  courses: {
    mode: "grid",
    itemsPerPage: 9,
    columns: 3
  }
}
```

**Step 4:** Add to navigation
```javascript
navigation: [
  // ... existing items
  { title: "Courses", path: "/courses" }
]
```

**Done!** Your courses page is now live at `/courses`!

#### Frontmatter Fields

All pages support these fields:

```markdown
---
title: Page Title                    # Required
date: 2024-01-15                    # Optional (for sorting)
description: Short description       # Optional
excerpt: Preview text               # Optional
tags: [tag1, tag2]                  # Optional
thumbnail: /images/thumb.png        # Optional (for cards)
tech: "React, Node.js"              # Optional (for projects)
demo: https://demo.com              # Optional (live demo link)
github: https://github.com/...      # Optional (code link)
---
```

#### Summary

**To create a new page:**
1. Add folder or file to `content/`
2. Add to navigation in `site.config.js` (optional)
3. Configure display in `pages` section (optional, for collections)
4. Add to home page in `homeSections` (optional)

**No code required!** Just markdown files and config changes.

### Dark Mode

The site includes automatic dark/light mode switching:

- **Toggle:** Click the moon/sun icon in the header
- **Persistence:** Your preference is saved in browser localStorage
- **Auto-styling:** New pages automatically support dark mode through global CSS overrides

**Adding custom pages?** Dark mode works automatically for common Tailwind classes (`text-gray-900`, `bg-white`, etc.). For explicit control, add dark mode variants:

```jsx
// Automatic (recommended)
<h1 className="text-gray-900">Title</h1>

// Explicit control (optional)
<h1 className="text-gray-900 dark:text-white">Title</h1>
```

**How it works:**
- Global CSS automatically converts common gray colors to light colors in dark mode
- Only applies to elements WITHOUT explicit `dark:` classes
- Works for all new pages without extra configuration

## Deploy to GitHub Pages

### Option 1: Deploy to `username.github.io` (User/Organization Page)

If you want your site at `https://username.github.io`:

1. **Fork or clone this repository**
2. **Rename the repository** to `username.github.io` (replace `username` with your GitHub username)
3. **Update `next.config.mjs`** - Remove the basePath and assetPrefix:
   ```javascript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```
4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
5. **Push your changes**:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push
   ```
6. **Wait for deployment** - The GitHub Action will automatically build and deploy
7. **Visit** `https://username.github.io`

### Option 2: Deploy to `username.github.io/repo-name` (Project Page)

If you want your site at `https://username.github.io/my-portfolio`:

1. **Fork or clone this repository**
2. **Update `next.config.mjs`** - Change the basePath to match your repo name:
   ```javascript
   const nextConfig = {
     output: 'export',
     basePath: process.env.NODE_ENV === 'production' ? '/my-portfolio' : '',
     assetPrefix: process.env.NODE_ENV === 'production' ? '/my-portfolio/' : '',
     images: {
       unoptimized: true,
     },
   };
   ```
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
4. **Push your changes**:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push
   ```
5. **Wait for deployment** - The GitHub Action will automatically build and deploy
6. **Visit** `https://username.github.io/my-portfolio`

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the site
npm run build

# The static files are in the 'out' folder
# Deploy the 'out' folder to any static hosting service
```

### Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
- Builds your site when you push to `main` or `master` branch
- Deploys to GitHub Pages
- No manual build commands needed!

Just edit your content, commit, and push:

```bash
git add .
git commit -m "Update content"
git push
```

### Troubleshooting

**404 errors after deployment:**
- Make sure the `basePath` in `next.config.mjs` matches your repository name
- For `username.github.io`, remove the basePath entirely
- For `username.github.io/repo-name`, set basePath to `/repo-name`

**GitHub Actions failing:**
- Check Settings → Pages → Source is set to "GitHub Actions"
- Verify you have write permissions for GitHub Pages in repository settings

**Images not loading:**
- Make sure images are in the `public` folder
- Use absolute paths: `/images/photo.jpg` not `./images/photo.jpg`
