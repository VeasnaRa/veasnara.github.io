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

  navigation: [
    { title: "Home", path: "/" },
    { title: "CV", path: "/cv" },
    { title: "Blog", path: "/blog" }
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

### Write Content

**Pages:** Create `content/about.md` or `content/cv.md`

```markdown
---
title: About Me
---

# About Me

Your content here...
```

**Blog:** Create `content/blog/post-name.md`

```markdown
---
title: My Post
date: 2026-01-04
---

# My Post

Your content...
```

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
     // Remove or comment out these lines:
     // basePath: process.env.NODE_ENV === 'production' ? '/Web-Blog' : '',
     // assetPrefix: process.env.NODE_ENV === 'production' ? '/Web-Blog/' : '',
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
