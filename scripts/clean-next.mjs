import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

const targets = [
  ".next",
  path.join("node_modules", ".cache"),
]

function rmSafe(relPath) {
  const abs = path.join(root, relPath)
  try {
    fs.rmSync(abs, { recursive: true, force: true })
    // eslint-disable-next-line no-console
    console.log(`[clean] removed ${relPath}`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[clean] skip ${relPath}: ${e?.message || e}`)
  }
}

for (const t of targets) rmSafe(t)

