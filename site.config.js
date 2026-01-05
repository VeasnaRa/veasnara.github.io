module.exports = {
  // Site metadata
  name: "Chonky Orange",
  title: "My Portfolio",
  description: "Welcome to my personal website",

  // Profile picture (optional)
  // Place your image in public/images/ folder (e.g., public/images/profile.jpg)
  // Then set: profileImage: "/images/profile.jpg"
  // Leave as null to show initial letter instead
  profileImage: "/images/profile.png",

  // Current role and affiliation
  role: "PhD Student",
  affiliation: "Stanford University",

  // Short bio for hero section
  tagline: "Researcher, Developer & Open Source Enthusiast",

  // Longer introduction for about section (supports markdown)
  introduction: `I'm a passionate researcher and developer with a deep interest in advancing the field of machine learning and artificial intelligence. My work focuses on exploring the mathematical foundations of large language models and building accessible web technologies.

Currently, I'm working on projects that bridge the gap between theoretical research and practical applications, with a particular emphasis on making complex AI concepts more understandable and accessible to the broader community.`,

  // Research interests or topics
  // You can use a string for plain text, or an object with { name, icon } to add lucide-react icon names
  interests: [
    { name: "Machine Learning", icon: "Brain" },
    { name: "Natural Language Processing", icon: "MessageSquare" },
    { name: "Web Development", icon: "Code" },
    { name: "UI/UX Design", icon: "Palette" }
  ],

  // Add/remove navigation items here
  navigation: [
    { title: "Home", path: "/" },
    { title: "CV", path: "/cv" },
    { title: "Blog", path: "/blog" },
    { title: "Projects", path: "/projects" }
  ],

  // Social links for footer
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    email: "your.email@example.com"
  },

  // CV Display Options
  // Option 1: Use a PDF file - will be embedded with download button
  // Place your PDF in public/cv/ folder (e.g., public/cv/resume.pdf)
  // Then set: cvFile: "/cv/resume.pdf"
  //
  // Option 2: Use an image (PNG/JPG) - will be displayed as image
  // Place your image in public/cv/ folder (e.g., public/cv/resume.png)
  // Then set: cvFile: "/cv/resume.png"
  //
  // Option 3: Leave as null to render from content/cv.md (markdown)
  // The markdown option provides the best SEO and accessibility
  cvFile: "/cv/cv.png",

  // Page Display Configuration
  // Configure how each page should display content
  // Each page can have:
  //   - mode: "simple" (single markdown) or "grid" (card grid) or "list" (vertical list)
  //   - itemsPerPage: number of items per page for pagination (only for grid/list)
  //   - columns: number of columns for grid mode (1, 2, 3, or 4)
  pages: {
    projects: {
      mode: "grid",          // "simple" | "grid" | "list"
      itemsPerPage: 12,      // For grid/list mode pagination
      columns: 2             // For grid mode: 1, 2, 3, or 4 columns
    },
    blog: {
      mode: "list",          // "simple" | "grid" | "list"
      itemsPerPage: 6,       // For grid/list mode pagination
      columns: 4             // For grid mode: 1, 2, 3, or 4 columns
    }
    // Add more pages here as needed:
    // pagename: { mode: "grid", itemsPerPage: 9, columns: 3 }
  },

  // Home Page Content Configuration
  // Configure what content sections appear on the home page
  // Each section can show latest items from a specific page (blog, projects, etc.)
  homeSections: [
    {
      type: "blog",           // Type of content to display (matches folder name in content/)
      title: "Latest Posts",  // Section title
      count: 1,              // Number of items to show
      showViewAll: true,     // Show "View All" button
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
    }
    // Add more sections as needed:
    // {
    //   type: "publications",
    //   title: "Recent Publications",
    //   count: 3,
    //   showViewAll: true,
    //   viewAllText: "View All Publications",
    //   viewAllLink: "/publications"
    // }
  ]
}
