# migration-files
Utilities for SQL-based migration files.

## Install
```sh
npm install --save migration-files
# or
yarn add migration-files
```

## Usage
```ts
import { map } from 'extra-promise'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'

const filenames = await findMigrationFilenames('./migrations')
const migrations = await map(filenames, readMigrationFile)
```

## Migration format
001-initial.sql
```sql
--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE test (
  id INTEGER PRIMARY KEY
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE test;
```

002-add name column.sql
```sql
--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
ALTER TABLE test
  ADD COLUMN name TEXT;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
-- https://www.sqlite.org/faq.html#q11
BEGIN TRANSACTION;
  CREATE TEMPORARY TABLE test_backup (
    id   INTEGER PRIMARY KEY
  , name TEXT
  );
  INSERT INTO test_backup
        SELECT id, name FROM test;
  DROP TABLE test;
  CREATE TABLE test (
    id
  );
  INSERT INTO test
        SELECT id FROM test_backup;
  DROP TABLE test_backup;
COMMIT;
```

## API
```ts
interface IMigration {
  filename: string
  version: number
  name: string
  up: string
  down: string
}
```

### readMigrationFile
```ts
function readMigrationFile(filename: string): Promise<IMigration>
```

### findMigrationFilenames
```ts
function findMigrationFilenames(dirname: string): Promise<string[]>
```

### parseMigrationFile
```ts
function parseMigrationFile(filename: string, content: string): IMigration
```
