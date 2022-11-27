import fs from 'fs/promises'
import { go, assert } from '@blackglory/prelude'
import { parseMigrationFilename, parseMigrationText, Migration } from './migration-file'

export async function readMigrationFile(filename: string): Promise<Migration> {
  const { name, version } = go(() => {
    const result = parseMigrationFilename(filename)
    assert(result, 'Invalid migration filename')
    return result
  })

  const text = await fs.readFile(filename, 'utf-8')
  const { up, down } = go(() => {
    const result = parseMigrationText(text)
    assert(result, 'Invalid Migration file')
    return result
  })

  return {
    filename
  , version
  , name
  , up
  , down
  }
}
