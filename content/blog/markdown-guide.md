---
title: "Markdown Writing Guide"
date: 2026-01-05
excerpt: "Complete guide to writing markdown content for this portfolio with all supported features"
tags: [markdown, guide, documentation, tutorial]
thumbnail: https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop
---

Welcome to the comprehensive markdown writing guide for this portfolio! This guide demonstrates all the markdown features supported by this site, from basic formatting to advanced features like LaTeX equations and syntax highlighting.

## Basic Text Formatting

You can apply various text styles:

- **Bold text** using `**bold text**`
- *Italic text* using `*italic text*`
- ***Bold and italic*** using `***bold and italic***`
- `Inline code` using backticks
- ~~Strikethrough~~ using `~~strikethrough~~`

You can also use <mark>highlighted text</mark>, <sub>subscript</sub>, and <sup>superscript</sup> with HTML tags.

## Headings

Use `##` for H2, `###` for H3, and so on. All headings are automatically added to the table of contents!

```markdown
## This is H2
### This is H3
#### This is H4
```

## Lists

### Ordered Lists (Numbered)

Create numbered lists with automatic numbering:

1. First item
2. Second item
3. Third item
   1. Nested item A
   2. Nested item B
4. Fourth item

**Markdown:**
```markdown
1. First item
2. Second item
   1. Nested item A
   2. Nested item B
```

### Unordered Lists (Bullets)

Create bullet lists with `-` or `*`:

- Bullet point one
- Bullet point two
  - Nested bullet
  - Another nested bullet
- Bullet point three

### Mixed Lists

You can even mix ordered and unordered lists:

1. First ordered item
   - Nested bullet point
   - Another nested bullet
2. Second ordered item
   - More nested bullets

### Task Lists

Create interactive checklists:

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

**Markdown:**
```markdown
- [x] Completed task
- [ ] Incomplete task
```

## Links and Images

### Links

Create clickable links:

Here's a [link to Google](https://google.com).

Auto-linked URLs also work: https://example.com

**Markdown:**
```markdown
[link text](https://url.com)
```

### Images

Add images with alt text:

```markdown
![Alt text](/path/to/image.jpg)
```

Images are automatically styled with rounded corners and proper spacing.

## Code Blocks

### Inline Code

Use `backticks` for inline code: `const x = 10`

### Code Blocks with Syntax Highlighting

This site supports syntax highlighting for many languages. Each code block has a **copy button** that appears on hover!

**JavaScript:**
```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(`Fibonacci(10) = ${result}`);
```

**Python:**
```python
def factorial(n):
    """Calculate factorial of n."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Usage
result = factorial(5)
print(f"5! = {result}")
```

**Bash:**
```bash
#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
  echo "Count: $i"
done
```

**Markdown for code blocks:**
````markdown
```language
your code here
```
````

## Mathematical Equations (LaTeX)

This site supports LaTeX equations using KaTeX!

### Inline Math

Write inline equations with single dollar signs: $E = mc^2$

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

**Markdown:**
```markdown
$E = mc^2$
```

### Display Math (Block)

Use double dollar signs for centered display equations:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

**Markdown:**
```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Matrix Notation

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

## Tables

Create professional tables with automatic styling:

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ Yes | H1-H6 |
| Lists | ✅ Yes | Ordered & unordered |
| Tables | ✅ Yes | With hover effects |
| Code | ✅ Yes | Syntax highlighting |
| Math | ✅ Yes | LaTeX via KaTeX |
| Dark Mode | ✅ Yes | Automatic theming |

**Markdown:**
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

Tables are:
- Fully responsive with horizontal scrolling on mobile
- Support hover effects
- Automatically styled for dark mode

## Blockquotes

Create emphasized quotes:

> "The best way to predict the future is to invent it."
> — Alan Kay

> This is a multi-paragraph blockquote.
>
> It can have multiple paragraphs and maintains proper spacing.

**Markdown:**
```markdown
> Quote text here
> — Author
```

## Horizontal Rules

Separate sections with horizontal lines:

---

**Markdown:**
```markdown
---
```

## Frontmatter (Metadata)

Every markdown file should start with frontmatter containing metadata:

```yaml
---
title: "Your Post Title"
date: 2026-01-05
excerpt: "Brief description for cards and SEO"
tags: [tag1, tag2, tag3]
thumbnail: "/images/thumbnail.jpg"
---
```

### Frontmatter Fields

**For Blog Posts:**
- `title` (required) - Post title
- `date` (required) - Publication date
- `excerpt` (optional) - Short description
- `tags` (optional) - Array of tags
- `thumbnail` (optional) - Image URL or path

**For Projects:**
- `title` (required) - Project name
- `description` (optional) - Project description
- `date` (optional) - Project date
- `tags` (optional) - Technology tags
- `tech` (optional) - Technology stack text
- `thumbnail` (optional) - Project image
- `demo` (optional) - Live demo URL
- `github` (optional) - GitHub repository URL

## Special Features

### Table of Contents

All H2 and H3 headings are automatically included in the sidebar table of contents. The active section is highlighted as you scroll.

### Copy Code Button

Hover over any code block to see the copy button in the top-right corner. Click it to copy the code to your clipboard!

### Tags

Tags are displayed as styled badges both in the frontmatter and on the page:

```yaml
tags: [javascript, react, nextjs]
```

### Syntax Highlighting

Supported languages include:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- Ruby
- PHP
- Shell/Bash
- SQL
- HTML/CSS
- And many more!

## Best Practices

### Writing Tips

1. **Use descriptive headings** - They appear in the table of contents
2. **Add alt text to images** - Improves accessibility and SEO
3. **Include code comments** - Help readers understand your examples
4. **Break up long content** - Use headings, lists, and visual elements
5. **Test your markdown** - Preview before publishing

### File Organization

```
content/
├── blog/
│   ├── post-one.md
│   ├── post-two.md
│   └── markdown-guide.md
├── projects/
│   ├── project-one.md
│   └── project-two.md
└── cv.md
```

### Image Paths

Images can be:
- External URLs: `https://example.com/image.jpg`
- Local files: `/images/my-image.jpg` (place in `public/images/`)
- Relative paths: `./assets/image.jpg`

## Example Template

Here's a complete example blog post:

```markdown
---
title: "Building a REST API with Node.js"
date: 2026-01-05
excerpt: "Learn how to build a scalable REST API using Node.js and Express"
tags: [nodejs, express, api, backend]
thumbnail: "/images/nodejs-api.jpg"
---

## Introduction

In this tutorial, we'll build a REST API from scratch using Node.js and Express.

## Prerequisites

Before we begin, make sure you have:
- Node.js installed (v18 or higher)
- Basic JavaScript knowledge
- A code editor

## Installation

First, install the required packages:

\`\`\`bash
npm install express dotenv
\`\`\`

## Building the API

Here's our main server file:

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Summary

You've now built a basic REST API! The key concepts are:

1. Setting up Express
2. Defining routes
3. Handling requests and responses

> "Code is like humor. When you have to explain it, it's bad." — Cory House
```

## Conclusion

This portfolio supports rich markdown content with:
- ✅ Full GitHub Flavored Markdown (GFM)
- ✅ LaTeX mathematical equations
- ✅ Syntax highlighting with copy button
- ✅ Responsive tables
- ✅ Task lists and checklists
- ✅ Auto-generated table of contents
- ✅ Dark mode support
- ✅ Tags and metadata

Now you're ready to create beautiful, feature-rich content for your portfolio! Happy writing! 🚀
