import fs from 'node:fs'
import path from 'node:path'

import { config } from 'dotenv'
import firebase from 'firebase-admin'

import initializeFirebase from '~firebase'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

if (!IS_PRODUCTION) {
  config({
    path: path.resolve(import.meta.dirname, '../../../.env.development'),
    override: true,
    quiet: true,
  })
}

type MigrationId = string | 'root' // A migration file name of 'root'

type Migration = { id: MigrationId }

// Extract and validate command-line parameters
const directionArg = process.argv[2]
const migrationCountArg = process.argv[3]
const migrationsPath = path.resolve(import.meta.dirname, '../migrations')
const migrationExtensionSuffix = '.ts'

async function readCurrentMigrationId() {
  const document = await firebase.firestore().collection('migrations').doc('current').get()

  const id = (document.exists ? (document.data() as Migration).id ?? 'root' : 'root') as MigrationId

  return id === 'root' ? 'root' : id + migrationExtensionSuffix
}

async function writeCurrentMigrationId(migrationId: string | null) {
  if (!migrationId) return

  const migration: Migration = { id: migrationId }
  await firebase.firestore().collection('migrations').doc('current').set(migration, { merge: true })
}

function listMigrationFiles() {
  return fs.readdirSync(migrationsPath)
    .filter(file => file.endsWith(migrationExtensionSuffix))
    .sort()
}

async function migrate(currentMigrationIndex: number, endMigrationIndex: number): Promise<MigrationId> {
  const migrations = listMigrationFiles()
  const offset = endMigrationIndex > currentMigrationIndex ? 1 : -1

  for (let i = currentMigrationIndex + Math.max(0, offset); offset > 0 ? i <= endMigrationIndex : i > endMigrationIndex; i += offset) {
    const migrationFile = migrations[i]
    const migrationExports = await import(path.join(migrationsPath, migrationFile))

    const direction = offset > 0 ? 'up' : 'down'
    if (!migrationExports[direction]) {
      console.warn(`⚠️ Migration file ${migrationFile} does not export a '${direction}' function. Skipping.`)

      continue
    }

    console.log('_________')
    console.log(`🪽 Running ${direction} migration: ${migrationFile}`)

    await migrationExports[direction](firebase.firestore())

    console.log('_________')
  }

  const nextMigrationId = endMigrationIndex === -1
    ? 'root'
    : migrations[endMigrationIndex].replace(migrationExtensionSuffix, '')

  return nextMigrationId
}

async function main() {
  // Validate direction parameter
  if (!directionArg || (directionArg !== 'up' && directionArg !== 'down')) {
    console.error('❌ Please specify "up" or "down" as the first argument.')
    process.exit(1)
  }

  const migrationCount = Number(migrationCountArg)

  // Validate migrationId parameter (optional)
  if (!migrationCount || Number.isNaN(migrationCount)) {
    console.error('❌ Please specify a migration id as the second argument.')
    process.exit(1)
  }

  await initializeFirebase()

  const migrations = listMigrationFiles()
  const currentMigrationId = await readCurrentMigrationId()
  const currentMigrationIndex = currentMigrationId === 'root' ? -1 : migrations.indexOf(currentMigrationId)
  const endMigrationIndex = directionArg === 'up'
    ? Math.min(currentMigrationIndex + migrationCount, migrations.length - 1)
    : Math.max(currentMigrationIndex - migrationCount, -1)

  if (endMigrationIndex === currentMigrationIndex) {
    console.log('🪽 No migrations to run.')

    return
  }

  console.log(`🪽 Running ${IS_PRODUCTION ? 'production' : 'development'} ${directionArg} migrations from ${currentMigrationId} to ${migrationCountArg}`)

  const nextMigrationId = await migrate(currentMigrationIndex, endMigrationIndex)

  await writeCurrentMigrationId(nextMigrationId)

  console.log('🪽 Migrations complete:', nextMigrationId)
}

main()
