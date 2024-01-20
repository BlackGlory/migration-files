import fs from 'fs/promises'
import { IMigration } from './types'
import { parseMigrationFile } from './parse-migration-file'

export async function readMigrationFile(filename: string): Promise<IMigration> {
  const content = await fs.readFile(filename, 'utf-8')

  return parseMigrationFile(filename, content)
}
