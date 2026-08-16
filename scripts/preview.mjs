/**
 * Local preview server — the missing half of `python3 -m http.server`.
 *
 * The repo has no index.html at its root and the launchpad links out to
 * Vercel-style paths (`/`, `/dashboard?screen=…`). Vercel resolves those via
 * the `rewrites` block in vercel.json; a plain static server does not, so the
 * root shows a directory listing and every launchpad link 404s.
 *
 * This server reads vercel.json and applies the SAME rewrites, so local
 * behaviour matches the deployed site. No dependencies.
 *
 *   npm run preview            → $CONDUCTOR_PORT, else $PORT, else 4711
 *   npm run preview -- 5000    → force a port
 *
 * Port order matters: inside a Conductor workspace the server MUST bind
 * $CONDUCTOR_PORT so workspaces don't collide on a fixed port (see CLAUDE.md).
 * The 4711 fallback is only for running outside Conductor.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PORT = Number(process.argv[2]) || Number(process.env.CONDUCTOR_PORT) || Number(process.env.PORT) || 4711

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
}

let rewrites = []
try {
  const cfg = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'))
  rewrites = Array.isArray(cfg.rewrites) ? cfg.rewrites : []
} catch {
  console.warn('preview: no readable vercel.json — serving without rewrites')
}

/** Exact-match the rewrite sources, the way vercel.json declares them. */
const rewrite = (pathname) => {
  const hit = rewrites.find((r) => r.source === pathname)
  return hit ? hit.destination : pathname
}

const resolve = async (pathname) => {
  // Keep the request inside the repo — no ../ escapes.
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, safe)
  if (!file.startsWith(ROOT)) return null
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
  } catch {
    return null
  }
  try {
    await stat(file)
    return file
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  const file = await resolve(rewrite(pathname))
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    return res.end(`404 — nothing at ${pathname}\n\nTry http://localhost:${PORT}/ for the launchpad.\n`)
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, {
      'content-type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store', // always serve the file on disk while prototyping
    })
    res.end(body)
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
    res.end(`500 — ${err.message}\n`)
  }
}).listen(PORT, () => {
  console.log(`\n  Traverse Studio preview → http://localhost:${PORT}\n`)
  console.log(`  Launchpad          http://localhost:${PORT}/`)
  console.log(`  Dashboard          http://localhost:${PORT}/dashboard`)
  console.log(`  Component library  http://localhost:${PORT}/component-library/`)
  console.log(`\n  ${rewrites.length} rewrite${rewrites.length === 1 ? '' : 's'} loaded from vercel.json. Ctrl-C to stop.\n`)
})
