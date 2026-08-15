import Link from 'next/link'
import { Mail, Briefcase, GraduationCap, ArrowRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import siteConfig from "../site.config";
import { getPageItems } from '../lib/markdown'
import RichText from '../components/RichText'

export async function generateMetadata() {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: siteConfig.siteUrl,
      type: 'website',
      images: [
        {
          url: siteConfig.profileImage || '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.profileImage || '/images/og-image.png'],
    },
  }
}

// "https://www.linkedin.com/in/veasna-ra/" → "veasna-ra"
// Pulls the handle out of a profile URL regardless of www./trailing slash.
function handleFromUrl(url) {
  const path = String(url || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
  const segments = path.split('/')
  return segments[segments.length - 1] || path
}

export default function Home() {
  // Get content for each home section based on config
  const homeSections = siteConfig.homeSections.map(section => ({
    ...section,
    items: getPageItems(section.type).slice(0, section.count)
  }))

  // Backwards compatibility: support both old 'introduction' and new 'aboutSection' config
  const aboutConfig = siteConfig.aboutSection || {
    show: true,
    title: "About",
    content: siteConfig.introduction || "Your Introduction"
  }

  // Layout configuration
  const showSidebar = siteConfig.layout?.showSidebar !== false && siteConfig.profileSection?.show !== false
  const sidebarPosition = siteConfig.layout?.sidebarPosition || "left"
  const contentWidth = `max-w-${siteConfig.layout?.contentWidth || "6xl"}`

  // Profile configuration
  const profileConfig = siteConfig.profileSection || {}
  const showImage = profileConfig.showImage !== false
  const showName = profileConfig.showName !== false
  const showRole = profileConfig.showRole !== false
  const showAffiliation = profileConfig.showAffiliation !== false
  const showInterests = profileConfig.showInterests !== false
  const imageShape = profileConfig.imageShape || "rounded"
  const imageSize = profileConfig.imageSize || "large"

  // Text shown next to each contact icon. An explicit label in
  // contactSection.labels wins; otherwise fall back to the handle in the URL.
  const contactLabels = siteConfig.contactSection?.labels || {}
  const githubLabel = contactLabels.github || `@${handleFromUrl(siteConfig.social?.github)}`
  const linkedinLabel = contactLabels.linkedin || handleFromUrl(siteConfig.social?.linkedin)
  const twitterLabel = contactLabels.twitter || `@${handleFromUrl(siteConfig.social?.twitter)}`

  // Image size mapping ("full" fills the width of the sidebar column)
  const imageSizeClasses = {
    small: "w-16 h-16",
    medium: "w-20 h-20",
    large: "w-28 h-28",
    xlarge: "w-40 h-40",
    xxlarge: "w-56 h-56",
    full: "w-full aspect-square"
  }
  const imageSizeClass = imageSizeClasses[imageSize] || imageSizeClasses.large

  // Image shape classes
  const imageShapeClasses = {
    rounded: "rounded-lg",
    square: "rounded-none",
    circle: "rounded-full",
    blob: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
    hexagon: "[clip-path:polygon(30%_0%,70%_0%,100%_50%,70%_100%,30%_100%,0%_50%)]",
    diamond: "rotate-45 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    squircle: "rounded-[25%]"
  }

  // Special wrapper needed for rotated shapes
  const needsWrapper = imageShape === "diamond" || imageShape === "hexagon"

  // Grid layout based on sidebar position and visibility.
  // The sidebar track is 360px = 320px of content + 40px of inner padding, so
  // the divider below sits exactly halfway between the two columns.
  // Below `lg` the grid collapses to a single column and `gap` becomes the
  // vertical spacing between the sidebar and the content.
  const gridClass = showSidebar
    ? sidebarPosition === "right"
      ? "grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-10"
      : "grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-10"
    : "flex justify-center"

  // Thin rule on the inner edge of the sidebar. Large screens only — on phones
  // the columns stack, where a vertical line would make no sense.
  const asideClass = sidebarPosition === "right"
    ? "space-y-6 lg:border-l lg:pl-10"
    : "space-y-6 lg:border-r lg:pr-10"

  return (
    <div className="w-full">
      <div className={gridClass}>

        {/* SIDEBAR */}
        {showSidebar && sidebarPosition === "left" && (
        <aside className={asideClass}>
          {/* Profile Section */}
          <div className="space-y-3">
            {showImage && (
              <div className={`${imageSizeClass} relative ${needsWrapper ? 'p-4' : ''}`}>
                <div className={`${needsWrapper ? 'absolute inset-4 w-full h-full' : 'w-full h-full'} ${imageShapeClasses[imageShape]} bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-600 overflow-hidden`}>
                  {siteConfig.profileImage ? (
                    <img
                      src={siteConfig.profileImage}
                      alt={siteConfig.name}
                      className={`w-full h-full object-cover ${imageShape === 'diamond' ? '-rotate-45' : ''}`}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${imageShape === 'diamond' ? '-rotate-45' : ''}`}>
                      <span className="text-4xl font-bold text-slate-700 dark:text-slate-300">{siteConfig.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {showName && (
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {siteConfig.name}
                </h1>
              )}
              <div className="space-y-1.5">
                {showRole && (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{siteConfig.role}</span>
                  </div>
                )}
                {showAffiliation && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{siteConfig.affiliation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Research Interests */}
          {showInterests && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {siteConfig.interests.map((interest, index) => {
                  const isObject = typeof interest === 'object'
                  const name = isObject ? interest.name : interest
                  const iconName = isObject ? interest.icon : null
                  const Icon = iconName ? Icons[iconName] : null

                  return (
                    <span
                      key={index}
                      className="px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      <span>{name}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contact */}
          {(siteConfig.contactSection?.show !== false) && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                {siteConfig.contactSection?.title || "Contact"}
              </h2>
              <div className="space-y-2 text-sm">
                {siteConfig.social.email && (siteConfig.contactSection?.showEmail !== false) && (
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{siteConfig.social.email}</span>
                  </a>
                )}
                {siteConfig.social.github && (siteConfig.contactSection?.showGithub !== false) && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="truncate">{githubLabel}</span>
                  </a>
                )}
                {siteConfig.social.linkedin && (siteConfig.contactSection?.showLinkedin !== false) && (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="truncate">{linkedinLabel}</span>
                  </a>
                )}
                {siteConfig.social.twitter && (siteConfig.contactSection?.showTwitter !== false) && (
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="truncate">{twitterLabel}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
        )}

        {/* CONTENT AREA */}
        <main className={`space-y-12 ${!showSidebar ? contentWidth : ''}`}>

          {/* About Section */}
          {aboutConfig.show && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{aboutConfig.title}</h2>
              <div className="prose prose-lg max-w-none">
                <RichText
                  text={aboutConfig.content}
                  className="text-gray-700 dark:text-slate-300 leading-relaxed"
                />
              </div>
            </section>
          )}

          {/* Dynamic Content Sections */}
          {homeSections.map((section, sectionIndex) => (
            <section key={sectionIndex} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                {section.showViewAll && section.items.length > 0 && (
                  <Link
                    href={section.viewAllLink}
                    className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {section.viewAllText}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className="space-y-4">
                {section.items.map(item => (
                  <Link
                    key={item.slug}
                    href={`/${section.type}/${item.slug}`}
                    className="group block"
                  >
                    <article className="p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            {item.title}
                          </h3>
                          {item.date && (
                            <time className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.date}</time>
                          )}
                        </div>
                        {(item.excerpt || item.description) && (
                          <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                            {item.excerpt || item.description}
                          </p>
                        )}
                        {item.tech && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 italic">{item.tech}</p>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {section.items.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <p className="text-sm">No {section.type} yet.</p>
                </div>
              )}
            </section>
          ))}

        </main>

        {/* RIGHT SIDEBAR (if position is right) */}
        {showSidebar && sidebarPosition === "right" && (
        <aside className={asideClass}>
          {/* Profile Section */}
          <div className="space-y-3">
            {showImage && (
              <div className={`${imageSizeClass} relative ${needsWrapper ? 'p-4' : ''}`}>
                <div className={`${needsWrapper ? 'absolute inset-4 w-full h-full' : 'w-full h-full'} ${imageShapeClasses[imageShape]} bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-600 overflow-hidden`}>
                  {siteConfig.profileImage ? (
                    <img
                      src={siteConfig.profileImage}
                      alt={siteConfig.name}
                      className={`w-full h-full object-cover ${imageShape === 'diamond' ? '-rotate-45' : ''}`}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${imageShape === 'diamond' ? '-rotate-45' : ''}`}>
                      <span className="text-4xl font-bold text-slate-700 dark:text-slate-300">{siteConfig.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {showName && (
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {siteConfig.name}
                </h1>
              )}
              <div className="space-y-1.5">
                {showRole && (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{siteConfig.role}</span>
                  </div>
                )}
                {showAffiliation && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{siteConfig.affiliation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Research Interests */}
          {showInterests && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {siteConfig.interests.map((interest, index) => {
                  const isObject = typeof interest === 'object'
                  const name = isObject ? interest.name : interest
                  const iconName = isObject ? interest.icon : null
                  const Icon = iconName ? Icons[iconName] : null

                  return (
                    <span
                      key={index}
                      className="px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      <span>{name}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contact */}
          {(siteConfig.contactSection?.show !== false) && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                {siteConfig.contactSection?.title || "Contact"}
              </h2>
              <div className="space-y-2 text-sm">
                {siteConfig.social.email && (siteConfig.contactSection?.showEmail !== false) && (
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{siteConfig.social.email}</span>
                  </a>
                )}
                {siteConfig.social.github && (siteConfig.contactSection?.showGithub !== false) && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="truncate">{githubLabel}</span>
                  </a>
                )}
                {siteConfig.social.linkedin && (siteConfig.contactSection?.showLinkedin !== false) && (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="truncate">{linkedinLabel}</span>
                  </a>
                )}
                {siteConfig.social.twitter && (siteConfig.contactSection?.showTwitter !== false) && (
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors break-all"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="truncate">{twitterLabel}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
        )}

      </div>
    </div>
  );
}
