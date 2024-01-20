import { findMigrationFilenames } from '@src/find-migration-filenames'
import { getFixturePath, getFixtureFilename } from './utils'

test('findMigrationFilenames', async () => {
  const dirname = getFixturePath()

  const result = await findMigrationFilenames(dirname)

  expect(result).toEqual([
    getFixtureFilename('001-initial.sql')
  , getFixtureFilename('002-add-name-column.sql')
  , getFixtureFilename('003-invalid.sql')
  ])
})
