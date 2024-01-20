import path from 'path'

const migrationFilenameRegExp = /^(?<version>\d+)-(?<name>.+)\.sql/

export function parseMigrationFilename(
  filename: string
): {
  name: string
  version: number
} | undefined {
  const basename = path.basename(filename)
  const result = basename.match(migrationFilenameRegExp)
  if (!result) return

  const name = result.groups!.name
  const version = Number.parseInt(result.groups!.version, 10)

  return { name, version }
}

export function parseMigrationText(text: string): {
  up: string
  down: string
} | undefined {
  const upCommentBlockResult = text.match(/^(-+)\n^-- Up\n^\1\n/m)
  if (!upCommentBlockResult) return

  const upCommentBlockStart = upCommentBlockResult.index!
  const upCommentBlockEnd = upCommentBlockStart + upCommentBlockResult[0].length

  const textAfterUp = text.slice(upCommentBlockEnd)
  const downCommentBlockResult = textAfterUp.match(/^(-+)\n^-- Down\n^\1\n/m)
  if (!downCommentBlockResult) return

  const downCommentBlockStart = upCommentBlockEnd + downCommentBlockResult.index!
  const downCommentBlockEnd = downCommentBlockStart + downCommentBlockResult[0].length

  return {
    up: text.slice(upCommentBlockEnd, downCommentBlockStart)
  , down: text.slice(downCommentBlockEnd)
  }
}
