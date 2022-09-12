import { promises as fs } from 'fs'
import * as path from 'path'
import { map } from 'extra-promise'
import { compareNumbersAscending } from 'extra-sort'

export interface Migration {
  filename: string
  version: number
  name: string
  up: string
  down: string
}

const filenameRegExp = /^(?<version>\d+)-(?<name>.+)\.sql/

export async function readMigrations(migrationsPath: string): Promise<Migration[]> {
  const filenames = await fs.readdir(migrationsPath)
  const migrationFilenames = filenames
    .filter(x => filenameRegExp.test(x))
    .map(x => path.join(migrationsPath, x))
  const migrations = await map(migrationFilenames, readMigrationFile)
  return migrations.sort((a, b) => compareNumbersAscending(a.version, b.version))
}

export async function readMigrationFile(filename: string): Promise<Migration> {
  const { name, version } = parseFilename(filename)
  const text = await fs.readFile(filename, 'utf-8')
  const { up, down } = parseFile(text)

  return {
    filename
  , version
  , name
  , up
  , down
  }
}

function parseFilename(filename: string): { name: string, version: number } {
  const basename = path.basename(filename)
  const result = basename.match(filenameRegExp)

  if (!result) throw new Error('It is not a migrations file.')

  const name = result.groups!.name
  const version = Number.parseInt(result.groups!.version, 10)

  return { name, version }
}

function parseFile(text: string): { up: string, down: string } {
  const upCommentBlockResult = text.match(/^(-+)\n^-- Up\n^\1\n/m)
  if (!upCommentBlockResult) throw new Error('Missing Up block')
  const upCommentBlockStart = upCommentBlockResult.index!
  const upCommentBlockEnd = upCommentBlockStart + upCommentBlockResult[0].length

  const textAfterUp = text.slice(upCommentBlockEnd)
  const downCommentBlockResult = textAfterUp.match(/^(-+)\n^-- Down\n^\1\n/m)
  if (!downCommentBlockResult) throw new Error('Missing Down block')
  const downCommentBlockStart = upCommentBlockEnd + downCommentBlockResult.index!
  const downCommentBlockEnd = downCommentBlockStart + downCommentBlockResult[0].length

  return {
    up: text.slice(upCommentBlockEnd, downCommentBlockStart)
  , down: text.slice(downCommentBlockEnd)
  }
}
