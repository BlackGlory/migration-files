import * as path from 'path'

export function getFixturePath(): string {
  return path.join(__dirname, './fixtures/migrations')
}

export function getFixtureFilename(filename: string): string {
  return path.join(getFixturePath(), filename)
}
