import fs from 'fs/promises'
import { parseMigrationFile } from '@src/parse-migration-file'
import { getFixtureFilename } from './utils'
import { getErrorAsync } from 'return-style'

describe('parseMigrationFile', () => {
  describe('migration file', () => {
    test('LF', async () => {
      const filename = getFixtureFilename('001-initial.sql')
      const content = await fs.readFile(filename, 'utf-8')

      const result = parseMigrationFile(filename, content)

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

    test('CRLF', async () => {
      const filename = getFixtureFilename('001-initial.sql')
      const content = (await fs.readFile(filename, 'utf-8')).replace(/\n/g, '\r\n')

      const result = parseMigrationFile(filename, content)

      expect(result).toStrictEqual({
        version: 1
      , name: 'initial'
      , filename
      , up: 'CREATE TABLE test (' + '\r\n'
          + '  id INTEGER PRIMARY KEY' + '\r\n'
          + ');' + '\r\n'
          + '\r\n'
      , down: 'DROP TABLE test;' + '\r\n'
      })
    })
  })

  test('non-migration filename', async () => {
    const filename = getFixtureFilename('non-migration.sql')
    const content = await fs.readFile(getFixtureFilename('001-initial.sql'), 'utf-8')

    const result = await getErrorAsync(() => parseMigrationFile(filename, content))

    expect(result).toBeInstanceOf(Error)
  })

  test('non-migration content', async () => {
    const filename = getFixtureFilename('003-invalid.sql')
    const content = await fs.readFile(filename, 'utf-8')

    const result = await getErrorAsync(() => parseMigrationFile(filename, content))

    expect(result).toBeInstanceOf(Error)
  })
})
