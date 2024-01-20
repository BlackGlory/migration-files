import { IMigration } from './types'
import { go, assert } from '@blackglory/prelude'
import { parseMigrationFilename, parseMigrationText } from './migration-file'

export function parseMigrationFile(filename: string, content: string): IMigration {
  const { name, version } = go(() => {
    const result = parseMigrationFilename(filename)
    assert(result, 'Invalid migration filename')
    return result
  })

  const { up, down } = go(() => {
    const result = parseMigrationText(content)
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
