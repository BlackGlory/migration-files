import { promises as fs } from 'fs'
import * as path from 'path'
import { compareNumbersAscending } from 'extra-sort'
import { isntUndefined } from '@blackglory/prelude'
import { parseMigrationFilename } from './migration-file'

export async function findMigrationFilenames(dirname: string): Promise<string[]> {
  const filenames = await fs.readdir(dirname)

  return filenames
    .map(filename => {
      const result = parseMigrationFilename(filename)
      if (result) {
        return {
          filename: path.join(dirname, filename)
        , version: result.version
        }
      }
    })
    .filter(isntUndefined)
    .sort((a, b) => compareNumbersAscending(a.version, b.version))
    .map(x => x.filename)
}
