# CV Folder

Place your CV file here to display it on the CV page.

## Supported Formats:

You can use any of these three options:

### Option 1: PDF File (Recommended for applications)
- Best for: Downloadable CV for job applications
- Display: Embedded PDF viewer with download button
- File types: `.pdf`

### Option 2: Image File
- Best for: Visual CV designs created in design tools
- Display: Full-width responsive image with download button
- File types: `.png`, `.jpg`, `.jpeg`

### Option 3: Markdown (Default - Best for SEO)
- Best for: SEO, accessibility, and searchability
- Display: Professional formatted text with styling
- File: Edit `content/cv.md`
- No file upload needed, just edit the markdown file

## How to Setup:

1. **For PDF or Image:**
   - Export/save your CV file
   - Place it in this folder (e.g., `resume.pdf` or `cv.png`)
   - Update `site.config.js`:
     ```javascript
     cvFile: "/cv/resume.pdf"  // or "/cv/resume.png"
     ```

2. **For Markdown (Default):**
   - Edit `content/cv.md` with your information
   - Keep `cvFile: null` in `site.config.js`

## Tips:

- Use descriptive filenames (e.g., `firstname-lastname-cv.pdf`)
- Keep file size under 2MB for faster loading
- PDF/Image files will take priority over markdown if `cvFile` is set
- All formats support printing via the Print button
