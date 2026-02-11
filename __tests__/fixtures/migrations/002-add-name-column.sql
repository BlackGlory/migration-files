--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
ALTER TABLE test
  ADD COLUMN name TEXT;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
-- https://www.sqlite.org/faq.html#q11
CREATE TEMPORARY TABLE temp (
  id   INTEGER PRIMARY KEY
, name TEXT
);

INSERT INTO temp
SELECT id
     , name
  FROM test;

DROP TABLE test;

CREATE TABLE test (
  id INTEGER PRIMARY KEY
);

INSERT INTO test
SELECT id
  FROM temp;

DROP TABLE temp;
