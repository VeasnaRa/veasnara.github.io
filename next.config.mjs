/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // GitHub Pages deployment config
  // Remove basePath and assetPrefix if deploying to username.github.io
  // Keep them if deploying to username.github.io/repo-name
  basePath: process.env.NODE_ENV === 'production' ? '/Web-Blog' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Web-Blog/' : '',

  images: {
    unoptimized: true,
  },
};

export default nextConfig
