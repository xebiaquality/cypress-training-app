import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'

export const sqlite = new Database(path.join(__dirname, 'sqlite.db'))
const db: BetterSQLite3Database = drizzle(sqlite)

export default db
