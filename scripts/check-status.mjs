#!/usr/bin/env node
/* ============================================================
   check-status.mjs — design-readiness validation

   Exits non-zero on:
     - a superseded screen with no data-superseded-by, or one
       pointing at a screen that doesn't exist in the same file
     - a manifest entry whose screen doesn't resolve
     - a manifest design path that doesn't exist on disk
     - a redundant status override (matches the inherited value)
     - status.json stale relative to the prototype files

   Run: npm run check:status
   ============================================================ */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { htmlFiles, parseFile, resolveEntries } from './build-status.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
let failed = false
const fail = (msg) => { failed = true; console.error('✗ ' + String(msg).replace(/^✗ /, '')) }

let parsed
try {
  parsed = htmlFiles().map(parseFile)
} catch (e) {
  fail(e.message)
  process.exit(1)
}

// Structural rules. In the check, a redundant override is an error, not a warning.
const { entries } = resolveEntries(parsed, { warn: (m) => fail(m.replace(/^⚠ /, '')), fail })

// Staleness: recompute the git-independent shape and compare against status.json.
const VOLATILE = new Set(['lastTouched', 'sha'])
const shape = (list) =>
  JSON.stringify(list.map((e) => {
    const out = {}
    for (const k of Object.keys(e).sort()) {
      if (!VOLATILE.has(k) && !k.startsWith('_')) out[k] = e[k]
    }
    return out
  }))

try {
  const disk = JSON.parse(readFileSync(join(ROOT, 'status.json'), 'utf8'))
  if (shape(disk.entries) !== shape(entries)) {
    fail('status.json is stale relative to the prototype files — run npm run status')
  }
} catch (e) {
  fail('status.json is missing or unreadable — run npm run status')
}

if (failed) process.exit(1)
console.log(`check:status — ok (${entries.length} entries, ${parsed.filter((p) => p.manifest).length} manifests)`)
