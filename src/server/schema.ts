import { relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { TrackSources } from '../contract'

export const playlists = sqliteTable('playlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
})
export const playlistRelations = relations(playlists, ({ many }) => ({
  tracks: many(tracks),
}))

export const tracks = sqliteTable('tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  source: text('source', {
    enum: [TrackSources.Spotify, TrackSources.YouTube],
  }).notNull(),
  title: text('title').notNull(),
  artist: text('artist'),
  url: text('url').notNull(),
  coverUrl: text('cover_url'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export const tracksRelations = relations(tracks, ({ many }) => ({
  playlists: many(playlists),
}))

export const playlistTracks = sqliteTable(
  'playlist_tracks',
  {
    playlistId: integer('playlist_id')
      .notNull()
      .references(() => playlists.id),
    trackId: integer('track_id')
      .notNull()
      .references(() => tracks.id),
  },
  (t) => ({
    pk: primaryKey(t.playlistId, t.trackId),
  })
)
