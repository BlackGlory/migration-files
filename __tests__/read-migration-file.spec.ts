import { readMigrationFile } from '@src/read-migration-file'
import { getFixtureFilename } from './utils'
import { getErrorAsync } from 'return-style'

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

  test('non-migration filename', async () => {
    const filename = getFixtureFilename('non-migration.sql')

    const result = await getErrorAsync(() => readMigrationFile(filename))

    expect(result).toBeInstanceOf(Error)
  })

  test('non-migration content', async () => {
    const filename = getFixtureFilename('003-invalid.sql')

    const result = await getErrorAsync(() => readMigrationFile(filename))

    expect(result).toBeInstanceOf(Error)
  })
})
