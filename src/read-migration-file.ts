import fs from 'fs/promises'
import { go, assert } from '@blackglory/prelude'
import { parseMigrationFilename, parseMigrationText } from './migration-file'
import { IMigration } from './types'

export async function readMigrationFile(filename: string): Promise<IMigration> {
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
