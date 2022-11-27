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
