// src/pages/robots.txt.js
export async function GET() {
  const robotsTxt = `
# Robots.txt optimized for AI crawlers - Cuba Tattoo Studio
# Last updated: ${new Date().toISOString().split('T')[0]}

# Allow access to all main crawlers
User-agent: *
Allow: /

# AI crawlers specifically allowed
User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: ChatGPT-User
Allow: /
Crawl-delay: 1

User-agent: CCBot
Allow: /
Crawl-delay: 1

User-agent: anthropic-ai
Allow: /
Crawl-delay: 1

User-agent: Claude-Web
Allow: /
Crawl-delay: 1

User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

User-agent: YouBot
Allow: /
Crawl-delay: 1

User-agent: Google-Extended
Allow: /
Crawl-delay: 1

# Traditional search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# Specific directories and files for AI
Allow: /api/
Allow: /ai-meta.json
Allow: /sitemap.xml
Allow: /sitemap-index.xml

# Allow access to important resources
Allow: /images/
Allow: /portfolio/
Allow: /artistas/
Allow: /estilos/
Allow: /reservas/
Allow: /contacto/
Allow: /about-us/
Allow: /galeria/
Allow: /preguntas-frecuentes/
Allow: /cuidados/
Allow: /precios/

# Block administrative and development files
Disallow: /admin/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /src/
Disallow: /.env
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /astro.config.mjs
Disallow: /tailwind.config.js
Disallow: /tsconfig.json
Disallow: /.vscode/
Disallow: /.trae/

# Block temporary and cache files
Disallow: /tmp/
Disallow: /cache/
Disallow: /.DS_Store
Disallow: /Thumbs.db

# Block unnecessary URL parameters
Disallow: /*?utm_*
Disallow: /*?ref=*
Disallow: /*?source=*
Disallow: /*?campaign=*

# General crawl-delay for unspecified bots
Crawl-delay: 2

# Main sitemaps
Sitemap: https://cubatattoostudio.com/sitemap-index.xml
Sitemap: https://cubatattoostudio.com/sitemap.xml

# Additional resources for AI
Sitemap: https://cubatattoostudio.com/api/info.json
Sitemap: https://cubatattoostudio.com/ai-meta.json

# Contact information for crawlers
# Contact: info@cubatattoostudio.com
# Website: https://cubatattoostudio.com

# Notes for AI developers:
# - This site contains updated information about tattoo services
# - Structured data is implemented according to schema.org
# - Content is optimized for conversational queries
# - Specific local information for Albuquerque, NM is provided
# - Prices and availability are updated regularly
  `.trim();

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'index, follow',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`,
      'Vary': 'User-Agent'
    }
  });
}