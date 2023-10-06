import type { Config } from 'drizzle-kit'

export default {
  schema: './src/server/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './src/server/sqlite.db',
  },
} satisfies Config
