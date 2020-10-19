import { readMigrations, readMigrationFile, Migration } from '@src/migrations-file'
import '@blackglory/jest-matchers'
import * as path from 'path'

describe('readMigrationFile(filename: string): Promise<Migration>', () => {
  it('return Promise<Migration>', async () => {
    const filename = getFixtureFilename('001-initial.sql')

    const result: Promise<Migration> = readMigrationFile(filename)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      version: 1
    , name: 'initial'
    , filename
    , up:
        'CREATE TABLE test (' + '\n'
      + '  id INTEGER PRIMARY KEY' + '\n'
      + ');' + '\n'
    , down:
        'DROP TABLE test;' + '\n'
    })
  })
})

describe('readMigrations(migrationsPath: string): Promise<Migration[]>', () => {
  it('return Promise<Migration[]>', async () => {
    const path = getFixturePath()

    const result: Promise<Migration[]> = readMigrations(path)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual([
      {
        version: 1
      , name: 'initial'
      , filename: getFixtureFilename('001-initial.sql')
      , up: 'CREATE TABLE test (' + '\n'
          + '  id INTEGER PRIMARY KEY' + '\n'
          + ');' + '\n'
      , down: 'DROP TABLE test;' + '\n'
      }
    , {
        version: 2
      , name: 'add name column'
      , filename: getFixtureFilename('002-add name column.sql')
      , up:
          'ALTER TABLE test' + '\n'
        + '  ADD COLUMN name TEXT;' + '\n'
      , down:
          '-- https://www.sqlite.org/faq.html#q11' + '\n'
        + 'BEGIN TRANSACTION;' + '\n'
        + '  CREATE TEMPORARY TABLE test_backup (' + '\n'
        + '    id   INTEGER PRIMARY KEY' + '\n'
        + '  , name TEXT' + '\n'
        + '  );' + '\n'
        + '  INSERT INTO test_backup' + '\n'
        + '        SELECT id, name FROM test;' + '\n'
        + '  DROP TABLE test;' + '\n'
        + '  CREATE TABLE test (' + '\n'
        + '    id' + '\n'
        + '  );' + '\n'
        + '  INSERT INTO test' + '\n'
        + '        SELECT id FROM test_backup;' + '\n'
        + '  DROP TABLE test_backup;' + '\n'
        + 'COMMIT;' + '\n'
      }
    ])
  })
})

function getFixturePath(): string {
  return path.join(__dirname, './fixtures/migrations')
}

function getFixtureFilename(filename: string): string {
  return path.join(getFixturePath(), filename)
}
