import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'
import * as schema from './schema'

export const sqlite = new Database(path.join(__dirname, 'sqlite.db'))
const db = drizzle(sqlite, { schema })

export default db
