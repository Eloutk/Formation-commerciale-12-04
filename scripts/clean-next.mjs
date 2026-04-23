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
    fs.rmSync(abs, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 150,
    })
    // eslint-disable-next-line no-console
    console.log(`[clean] removed ${relPath}`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[clean] failed ${relPath}: ${e?.message || e}`)
    // eslint-disable-next-line no-console
    console.error(`[clean] Fermez le serveur Next (npm run dev) puis relancez npm run clean.`)
    process.exitCode = 1
  }
}

for (const t of targets) rmSafe(t)

