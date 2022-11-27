import { readMigrationFile } from '@src/read-migration-file'
import { getFixtureFilename } from './utils'
import { getErrorAsync } from 'return-style'
import '@blackglory/jest-matchers'

describe('readMigrationFile', () => {
  test('migration file', async () => {
    const filename = getFixtureFilename('001-initial.sql')

    const result = await readMigrationFile(filename)

    expect(result).toStrictEqual({
      version: 1
    , name: 'initial'
    , filename
    , up: 'CREATE TABLE test (' + '\n'
        + '  id INTEGER PRIMARY KEY' + '\n'
        + ');' + '\n'
        + '\n'
    , down: 'DROP TABLE test;' + '\n'
    })
  })

  test('non-migration file', async () => {
    const filename = getFixtureFilename('non-migration.sql')

    const result = await getErrorAsync(() => readMigrationFile(filename))

    expect(result).toBeInstanceOf(Error)
  })
})
