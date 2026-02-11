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
### Filename
`^\d+-(.+)\.sql` also known as `{number}-{name}.sql`.

Examples:
- `001-initial.sql`
- `002-add-name-column.sql`

### Content
```
-{2,}
-- Up
-{2,}
.+
-{2,}
-- Down
-{2,}
.+
```

also known as

```sql
--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
{SQL_STATEMENTS}
--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
{SQL_STATEMENTS}
```

Example:
```sql
--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE foo (
  id INTEGER PRIMARY KEY
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE foo;
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
