import { execSync } from 'child_process'
import fs from 'fs'

const DEFAULT_COMMIT_PREFIX = 'root'

const COMMIT_PREFIX_TO_PATH = {
  app: 'app/',
  backend: 'backend/',
  core: 'packages/conceptual-market-core/',
  documentation: 'documentation/',
}

const commitMessageFile = process.argv[2]
const message = fs.readFileSync(commitMessageFile, 'utf8').trim()

const ALL_PREFIXES = [DEFAULT_COMMIT_PREFIX, ...Object.keys(COMMIT_PREFIX_TO_PATH)]

for (const pathPrefix of ALL_PREFIXES) {
  if (new RegExp(`^\\[${pathPrefix}\\]`).test(message)) process.exit(0)
}

// Get staged files
const files = execSync('git diff --cached --name-only', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)

let prefix = DEFAULT_COMMIT_PREFIX

for (const [pathPrefix, path] of Object.entries(COMMIT_PREFIX_TO_PATH)) {
  if (!files.every(f => f.startsWith(path))) continue

  prefix = pathPrefix

  break
}

// Prepend prefix
fs.writeFileSync(commitMessageFile, `[${prefix}] ${message}\n`)
