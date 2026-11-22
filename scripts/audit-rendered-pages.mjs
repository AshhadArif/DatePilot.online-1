import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')
const sitemapPath = path.join(dist, 'sitemap.xml')

if (!fs.existsSync(sitemapPath)) {
  console.error('Missing dist/sitemap.xml. Run the production build first.')
  process.exit(1)
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8')
const routes = [...sitemap.matchAll(/<url><loc>(https:\/\/datepilot\.online[^<]*)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)].map((match) => {
  const url = match[1]
  const pathname = new URL(url).pathname.replace(/\/$/, '') || '/'
  return { url, pathname, lastmod: match[2], file: pathname === '/' ? 'index.html' : `${pathname.slice(1)}/index.html` }
})

const decode = (value) => value
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))

const visibleText = (html) => decode(html
  .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim())

const normalize = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const failures = []
const pages = []
const titleRoutes = new Map()
const descriptionRoutes = new Map()
const paragraphRoutes = new Map()
const routeSet = new Set(routes.map(({ pathname }) => pathname))

for (const route of routes) {
  const file = path.join(dist, route.file)
  if (!fs.existsSync(file)) {
    failures.push(`${route.pathname}: missing ${route.file}`)
    continue
  }

  const html = fs.readFileSync(file, 'utf8')
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim()
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '').trim()
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? ''
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? ''
  const schema = html.match(/<script id="datepilot-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1] ?? ''
  const h1s = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => visibleText(match[1]))
  const text = visibleText(main)
  const words = text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0
  const expectedCanonical = route.url
  const adScript = html.match(/<script\b[^>]*adsbygoogle\.js\?client=ca-pub-8166232264627968[^>]*><\/script>/is)?.[0] ?? ''
  const adsCode = Boolean(adScript && /\basync\b/i.test(adScript) && /crossorigin="anonymous"/i.test(adScript))

  if (!title) failures.push(`${route.pathname}: missing title`)
  if (!description) failures.push(`${route.pathname}: missing meta description`)
  if (canonical !== expectedCanonical) failures.push(`${route.pathname}: canonical is ${canonical || '(missing)'}`)
  if (h1s.length !== 1) failures.push(`${route.pathname}: expected one H1, found ${h1s.length}`)
  if (!main || words === 0) failures.push(`${route.pathname}: main content is empty`)
  if (!schema) failures.push(`${route.pathname}: missing structured data`)
  else {
    try {
      const graph = JSON.parse(schema)['@graph'] ?? []
      const pageNode = graph.find((node) => node.url === route.url)
      if (!pageNode) failures.push(`${route.pathname}: JSON-LD has no page entity for this URL`)
      else {
        if (pageNode.dateModified !== route.lastmod) failures.push(`${route.pathname}: JSON-LD dateModified does not match sitemap lastmod`)
        if (pageNode.datePublished) failures.push(`${route.pathname}: JSON-LD contains an unverified publication date`)
      }
    } catch {
      failures.push(`${route.pathname}: invalid JSON-LD`)
    }
  }
  if (!adsCode) failures.push(`${route.pathname}: AdSense review code missing or differs from expected snippet`)

  if (title) titleRoutes.set(title, [...(titleRoutes.get(title) ?? []), route.pathname])
  if (description) descriptionRoutes.set(description, [...(descriptionRoutes.get(description) ?? []), route.pathname])

  for (const match of main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const paragraph = normalize(visibleText(match[1]))
    if (paragraph.length >= 90) paragraphRoutes.set(paragraph, [...(paragraphRoutes.get(paragraph) ?? []), route.pathname])
  }

  for (const match of main.matchAll(/\bhref="(\/[^"#?]*)"/g)) {
    const target = match[1].replace(/\/$/, '') || '/'
    if (!routeSet.has(target)) failures.push(`${route.pathname}: internal link has no sitemap route (${target})`)
  }

  pages.push({ route: route.pathname, title, words, h1: h1s[0] ?? '' })
}

for (const [title, duplicates] of titleRoutes) {
  if (duplicates.length > 1) failures.push(`duplicate title "${title}": ${duplicates.join(', ')}`)
}
for (const duplicates of descriptionRoutes.values()) {
  if (duplicates.length > 1) failures.push(`duplicate description on ${duplicates.join(', ')}`)
}

const repeatedParagraphs = [...paragraphRoutes.entries()]
  .filter(([, usedBy]) => new Set(usedBy).size > 1)
  .map(([paragraph, usedBy]) => ({ text: paragraph, routes: [...new Set(usedBy)] }))
const adsTxtPath = path.join(dist, 'ads.txt')
const adsTxt = fs.existsSync(adsTxtPath) ? fs.readFileSync(adsTxtPath, 'utf8') : ''
if (!/google\.com,\s*pub-8166232264627968,\s*DIRECT,\s*f08c47fec0942fa0/i.test(adsTxt)) {
  failures.push('ads.txt missing the matching AdSense publisher record')
}

console.log(`Rendered routes: ${pages.length}/${routes.length}`)
console.log(`Unique titles: ${titleRoutes.size}/${pages.length}`)
console.log(`Unique descriptions: ${descriptionRoutes.size}/${pages.length}`)
console.log(`Main-content word range: ${Math.min(...pages.map(({ words }) => words))}-${Math.max(...pages.map(({ words }) => words))}`)
const editorialPages = pages.filter(({ route }) => route.startsWith('/guides/') || /^\/(calculators|calendar|time|converters)\//.test(route))
console.log(`Calculator and guide main-content word range: ${Math.min(...editorialPages.map(({ words }) => words))}-${Math.max(...editorialPages.map(({ words }) => words))}`)
console.log(`Repeated substantial paragraphs across routes: ${repeatedParagraphs.length}`)
if (repeatedParagraphs.length) {
  for (const item of repeatedParagraphs.slice(0, 20)) {
    console.log(`REPEATED ${item.routes.join(', ')}: ${item.text.slice(0, 180)}`)
  }
  if (repeatedParagraphs.length > 20) console.log(`... ${repeatedParagraphs.length - 20} more repeated paragraphs`)
}
if (failures.length) {
  console.error(`\nAudit findings (${failures.length}):\n- ${failures.join('\n- ')}`)
  process.exitCode = 1
} else {
console.log('Structural, navigation, metadata, JSON-LD, AdSense-code, and ads.txt checks passed.')
}
