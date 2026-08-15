module.exports = {
  // Site metadata
  name: "Veasna RA",
  title: "VeasnaRa",
  description: "Hello and welcome to Veasna RA’s portfolio website",

  // SEO & Metadata
  siteUrl: "https://veasnara.github.io", // Your site URL (for SEO)
  author: "Veasna Ra", // Author name (for SEO)
  keywords: ["portfolio", "blog", "machine learning", "AI"], // Keywords for SEO

  // Favicon & Icons (optional - customize if needed)
  // By default, Next.js uses app/favicon.ico automatically
  // To customize, create icon files and update these paths:
  // - favicon.ico (32x32 or 16x16) - Standard favicon
  // - icon.png (512x512) - Modern browsers & PWA
  // - apple-icon.png (180x180) - Apple devices
  // You can place custom icons in public/ folder or use app/icon.png, app/apple-icon.png
  favicon: "/images/icon.ico", // Set to "/custom-favicon.ico" if using custom
  icon: null,    // Set to "/icon.png" if using custom
  appleIcon: null, // Set to "/apple-icon.png" if using custom

  // Profile picture (optional)
  // Place your image in public/images/ folder (e.g., public/images/profile.jpg)
  // Then set: profileImage: "/images/profile.jpg"
  // Leave as null to show initial letter instead
  profileImage: "/images/profile_vs.png",

  // Current role and affiliation
  role: "Master's (M2) student in Data Science",
  affiliation: "Université Paris-Saclay",
  

  // About section configuration
  aboutSection: {
    show: true,                      // Set to false to hide the About section
    title: "Hello! I'm Veasna RA",                  // Customize the section heading (e.g., "Bonjour", "Hello", "Introduction")
    // Blank lines start a new paragraph.
    // [label](https://url) makes a link, **text** makes it bold.
    content: `I am currently pursuing a **Master 2 in Data Science** at [Université Paris-Saclay](https://www.universite-paris-saclay.fr/en/education/masters-degree/innovation-enterprise-and-society/m2-innovation-marches-et-science-des-donnees-imsd) in France.
    This program focuses on Machine Learning, Deep Learning, Big Data, Economic Analysis and Quantitative Techniques.

    In parallel, I do a double degree in **engineering (Diplôme d’ingénieur)** at [ENSIIE](https://www.ensiie.fr/en), where I specialize in **Applied Mathematics**. This program emphasized Computer science and Mathematics,
    with a strong focus on algorithmic thinking, probability, statistics, optimization, machine learning, stochastic calculus, advanced programming, and projects.`


  },

  // Contact section configuration
  contactSection: {
    show: true,  // Set to false to hide the entire Contact section on home page
    title: "Contact",  // Customize the section heading
    showEmail: true,  // Set to false to hide email
    showGithub: true,  // Set to false to hide GitHub
    showLinkedin: true,  // Set to false to hide LinkedIn
    showTwitter: true,  // Set to false to hide Twitter

    // Text shown next to each icon (the link still points at your profile).
    // Set a value to null to show the handle from the URL instead,
    // e.g. github: null -> "@VeasnaRa", linkedin: null -> "veasna-ra"
    labels: {
      github: "GitHub",
      linkedin: "LinkedIn",
      twitter: null,
    },
  },

  // Profile section configuration (home page sidebar)
  profileSection: {
    show: true,  // Set to false to hide entire profile sidebar
    showImage: true,  // Set to false to hide profile image
    showName: true,  // Set to false to hide name
    showRole: true,  // Set to false to hide role
    showAffiliation: true,  // Set to false to hide affiliation
    showInterests: true,  // Set to false to hide interests section
    imageShape: "circle",  // Shape options:
                            // "rounded" - Rounded corners (default)
                            // "square" - Sharp corners
                            // "circle" - Full circle
                            // "blob" - Organic blob shape
                            // "hexagon" - Hexagonal shape
                            // "diamond" - Diamond/rotated square
                            // "squircle" - Apple-style squircle
    imageSize: "xlarge"  // "small" (64px), "medium" (80px), "large" (112px),
                         // "xlarge" (160px), "xxlarge" (224px), "full" (fills the sidebar)
  },

  // Layout configuration
  layout: {
    sidebarPosition: "left",  // "left" or "right"
    contentWidth: "6xl",  // "4xl", "5xl", "6xl", "7xl" - max width of content
    showSidebar: true  // Set to false to hide sidebar completely (full-width layout)
  },

  // Footer configuration
  footer: {
    show: true,  // Set to false to hide footer
    text: null,  // Custom footer text (null uses default: "© 2024 Your Name")
    showSocialLinks: true,  // Set to false to hide social icons in footer
    customLinks: []  // Add custom links: [{ text: "Privacy", url: "/privacy" }]
  },

  // Research interests or topics
  // You can use a string for plain text, or an object with { name, icon } to add lucide-react icon names
  interests: [
      { name: "Data Science", icon: "Database" },
      { name: "Machine Learning", icon: "Brain" },
      { name: "Deep Learning", icon: "BrainCircuit" },
      { name: "Artificial Intelligence", icon: "Bot" },
      { name: "Statistical Analysis", icon: "ChartLine"}
  ],
  
  // Add/remove navigation items here
  // Optional: "icon" is any Lucide React icon name
  // Optional: "color" is the rectangle background colour of the nav button.
  //           rose | amber | sky | mint | violet — omit it for plain grey.
  navigation: [
    { title: "Home", path: "/", icon: "Home", color: "sky" },
    { title: "CV", path: "/cv", icon: "FileText", color: "rose" },
    { title: "My Projects", path: "/projects", icon: "BookOpen", color: "amber" },
    //{ title: "Blog", path: "/blog", icon: "BookOpen", color: "mint" },
  ],

  // Social links for footer
  social: {
    github: "https://github.com/VeasnaRa",
    linkedin: "https://www.linkedin.com/in/veasna-ra/",
    email: "raveasna15@gmail.com"
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
  cvFile: null,
  
  // CV Page Configuration
  cvConfig: {
    showDownloadButton: true,  // Set to false to hide the download button
    showPrintButton: false,    // Visitors download the real PDF instead of printing the page

    // Language versions of the CV. Each entry needs:
    //   file: the markdown file in content/ (without .md)
    //   pdf:  optional PDF in public/ — the Download button only appears once
    //         that file actually exists, so a missing PDF never 404s.
    // Delete an entry (or the whole array) to go back to a single-language CV.
    languages: [
      { code: "en", label: "English",  file: "cv",    pdf: "/cv/CV_Veasna_RA_EN.pdf" },
      { code: "fr", label: "Français", file: "cv-fr", pdf: "/cv/CV_Veasna_RA_FR.pdf" }
    ]
  },

  // Page Display Configuration
  // Configure how each page should display content
  // Each page can have:
  //   - mode: "simple" (single markdown) or "grid" (card grid) or "list" (vertical list)
  //   - itemsPerPage: number of items per page for pagination (only for grid/list)
  //   - columns: number of columns for grid mode (1, 2, 3, or 4)
  pages: {
    // blog: {
    //   mode: "list",          // "simple" | "grid" | "list"
    //   itemsPerPage: 6,       // For grid/list mode pagination
    //   columns: 4            // For grid mode: 1, 2, 3, or 4 columns
    // },

    projects: {
      mode: "list",          // "simple" | "grid" | "list"
      itemsPerPage: 6,       // For grid/list mode pagination
      columns: 4            // For grid mode: 1, 2, 3, or 4 columns
    },

    // Add more pages here as needed:
    // pagename: { mode: "grid", itemsPerPage: 9, columns: 3 }
  },

  // Home Page Content Configuration
  // Configure what content sections appear on the home page
  // Each section can show latest items from a specific page (blog, projects, etc.)
  homeSections: [
    {
      type: "projects",           // Type of content to display (matches folder name in content/)
      title: "Latest Posts",  // Section title
      count: 3,              // Number of items to show
      showViewAll: true,     // Show "View All" button
      viewAllText: "View All Posts",
      viewAllLink: "/projects"
    }
  ]
}
