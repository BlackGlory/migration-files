export interface IMigration {
  filename: string
  version: number
  name: string
  up: string
  down: string
}
