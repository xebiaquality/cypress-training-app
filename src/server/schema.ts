import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { TrackSources } from '../contracts/tracks'

export const playlists = sqliteTable('playlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
})
export const playlistsRelations = relations(playlists, ({ many }) => ({
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

export const playlistsToTracks = sqliteTable('playlists_tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playlistId: integer('playlist_id').references(() => playlists.id),
  trackId: integer('track_id').references(() => tracks.id),
})

export const tracksToPlaylistsRelations = relations(
  playlistsToTracks,
  ({ one }) => ({
    playlist: one(playlists, {
      fields: [playlistsToTracks.playlistId],
      references: [playlists.id],
      relationName: 'playlists',
    }),
    track: one(tracks, {
      fields: [playlistsToTracks.trackId],
      references: [tracks.id],
      relationName: 'tracks',
    }),
  })
)
