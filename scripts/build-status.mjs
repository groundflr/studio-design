#!/usr/bin/env node
/* ============================================================
   build-status.mjs — design-readiness generator

   Reads every prototype's <section class="screen"> markup and
   #prototype-manifest block, resolves each index entry's status
   via the inheritance rule (entry.status overrides, otherwise the
   target screen's data-status; absent = wip), cross-references
   features design.md files and git history, and writes:

     status.json  — the single generated source the index renders
     status.js    — same payload as window.__STATUS__, so the index
                    also works when opened via file:// (fetch of a
                    local JSON file is blocked there)

   Plain Node, no dependencies. Run: npm run status
   Shared parsing is exported for scripts/check-status.mjs.
   ============================================================ */
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const STATUSES = new Set(['ready', 'wip', 'explore', 'superseded'])

export function htmlFiles() {
  const out = []
  const walk = (dir) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name)
      if (name.isDirectory()) walk(p)
      else if (name.name.endsWith('.html')) out.push(p)
    }
  }
  walk(join(ROOT, 'prototypes'))
  return out.sort()
}

export function parseFile(file) {
  const html = readFileSync(file, 'utf8')
  const lines = html.split('\n')

  const screens = []
  const sectionRe = /<section[^>]*class="[^"]*\bscreen\b[^"]*"[^>]*>/g
  let m
  while ((m = sectionRe.exec(html)) !== null) {
    const tag = m[0]
    const attr = (name) => {
      const am = tag.match(new RegExp(name + '="([^"]*)"'))
      return am ? am[1] : null
    }
    const name = attr('data-screen-name') || attr('data-screen')
    if (!name) continue
    const line = html.slice(0, m.index).split('\n').length
    screens.push({
      name,
      nameAttr: attr('data-screen-name') ? 'data-screen-name' : 'data-screen',
      status: attr('data-status'),
      supersededBy: attr('data-superseded-by'),
      line,
      // section ends where the next screen section begins (screens are
      // siblings in every prototype); the last one is bounded below.
      endLine: null,
    })
  }
  screens.forEach((s, i) => {
    s.endLine = i + 1 < screens.length ? screens[i + 1].line - 1 : lines.length
  })

  const bodyMatch = html.match(/<body[^>]*\bdata-status="([^"]*)"/)
  const manifestMatch = html.match(
    /<script type="application\/json" id="prototype-manifest">\s*([\s\S]*?)\s*<\/script>/
  )
  let manifest = null
  if (manifestMatch) {
    try {
      manifest = JSON.parse(manifestMatch[1])
    } catch (e) {
      throw new Error(`${relative(ROOT, file)}: #prototype-manifest is not valid JSON — ${e.message}`)
    }
  }
  return { file, screens, bodyStatus: bodyMatch ? bodyMatch[1] : null, manifest }
}

export function resolveEntries(parsed, { warn = console.warn, fail } = {}) {
  const problems = []
  const error = (msg) => { problems.push(msg); (fail || warn)('✗ ' + msg) }

  const entries = []
  for (const p of parsed) {
    if (!p.manifest) continue
    const rel = relative(ROOT, p.file)
    const byName = new Map(p.screens.map((s) => [s.name, s]))

    // superseded integrity is a screen-level rule, checked per file
    for (const s of p.screens) {
      if (s.status === 'superseded' && (!s.supersededBy || !byName.has(s.supersededBy))) {
        error(`${rel}: screen "${s.name}" is superseded but data-superseded-by ` +
          (s.supersededBy ? `points at "${s.supersededBy}", which does not exist in the file` : 'is missing'))
      }
      if (s.status && !STATUSES.has(s.status)) {
        error(`${rel}: screen "${s.name}" has unknown data-status "${s.status}"`)
      }
    }

    for (const entry of p.manifest.entries || []) {
      const screen = byName.get(entry.screen)
      const pseudo = !screen && entry.screen === p.manifest.prototype && p.bodyStatus
      if (!screen && !pseudo) {
        error(`${rel}: manifest entry "${entry.label}" targets screen "${entry.screen}", which does not exist`)
        continue
      }
      const inherited = (screen ? screen.status : p.bodyStatus) || 'wip'
      const unmarked = screen ? !screen.status : !p.bodyStatus
      if (entry.status && entry.status === inherited) {
        warn(`⚠ ${rel}: entry "${entry.label}" has a redundant status override ` +
          `("${entry.status}" matches the inherited value) — delete it`)
      }
      if (entry.design && !existsSync(join(ROOT, entry.design))) {
        error(`${rel}: entry "${entry.label}" design path "${entry.design}" does not exist`)
      }
      entries.push({
        label: entry.label,
        url: entry.url,
        prototype: p.manifest.prototype,
        screen: entry.screen,
        group: entry.group,
        badge: entry.badge || null,
        description: entry.description,
        status: entry.status || inherited,
        statusSource: entry.status ? 'override' : 'screen',
        unmarked,
        supersededBy: screen ? screen.supersededBy || null : null,
        design: entry.design || null,
        designStatus: entry.design ? designStatus(entry.design) : null,
        _file: p.file,
        _screen: screen || null,
      })
    }
  }
  return { entries, problems }
}

function designStatus(relPath) {
  try {
    const md = readFileSync(join(ROOT, relPath), 'utf8')
    const m = md.match(/^\*\*Status:\*\*\s*(.+)$/m)
    return m ? m[1].trim() : null
  } catch {
    return null
  }
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
}

const fileDateCache = new Map()
function lastTouched(file, screen) {
  const rel = relative(ROOT, file)
  if (screen) {
    try {
      // Regex form of -L: git finds the section tag in each commit's own
      // blob, so uncommitted line shifts in the working tree don't skew
      // which range the history is read for.
      const span = Math.max(1, screen.endLine - screen.line)
      const out = git(['log', '-1', '-s',
        `-L/<section[^>]*${screen.nameAttr}="${screen.name}"/,+${span}:${rel}`, '--format=%aI|%h'])
      const line = out.split('\n').find((l) => l.includes('|'))
      if (line) {
        const [iso, sha] = line.split('|')
        return { iso, sha }
      }
    } catch { /* fall through to file-level */ }
  }
  if (!fileDateCache.has(rel)) {
    try {
      const [iso, sha] = git(['log', '-1', '--format=%aI|%h', '--', rel]).split('|')
      fileDateCache.set(rel, iso ? { iso, sha } : { iso: null, sha: null })
    } catch {
      fileDateCache.set(rel, { iso: null, sha: null })
    }
  }
  return fileDateCache.get(rel)
}

export function build({ withGit = true } = {}) {
  const parsed = htmlFiles().map(parseFile)
  const failures = []
  const { entries, problems } = resolveEntries(parsed, {
    warn: (m) => console.warn(m),
    fail: (m) => { failures.push(m); console.error(m) },
  })
  if (failures.length) {
    console.error(`\n${failures.length} error(s) — status.json not written.`)
    process.exit(1)
  }

  for (const e of entries) {
    const t = withGit ? lastTouched(e._file, e._screen) : { iso: null, sha: null }
    e.lastTouched = t.iso || null
    e.sha = t.sha || null
    delete e._file
    delete e._screen
  }

  const counts = { ready: 0, wip: 0, explore: 0, superseded: 0 }
  for (const e of entries) counts[e.status]++

  return {
    generated: new Date().toISOString(),
    counts,
    entries,
  }
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedDirectly) {
  const status = build()
  writeFileSync(join(ROOT, 'status.json'), JSON.stringify(status, null, 2) + '\n')
  writeFileSync(
    join(ROOT, 'status.js'),
    '// Generated by scripts/build-status.mjs — do not edit.\n' +
      'window.__STATUS__ = ' + JSON.stringify(status, null, 2) + '\n'
  )
  const c = status.counts
  console.log(
    `status.json — ${status.entries.length} entries · ` +
      `${c.ready} ready · ${c.wip} wip · ${c.explore} exploring · ${c.superseded} superseded`
  )
}
