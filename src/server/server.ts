import { createExpressEndpoints, initServer } from '@ts-rest/express'
import bodyParser from 'body-parser'
import express from 'express'
import { contract } from '../contract'
import ViteExpress from 'vite-express'
import { playlistsToTracks, playlists, tracks } from './schema'
import { eq } from 'drizzle-orm'
import { MetadataNotFoundError, getMetadataForUrl } from './api/metadata'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { sqlite } from './db'
import { desc } from 'drizzle-orm'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const s = initServer()
const db = drizzle(sqlite, { schema })
const router = s.router(contract, {
  resetAllData: async () => {
    db.delete(playlists).run()
    db.delete(tracks).run()
    return { status: 200, body: { success: true } }
  },

  removeAllPlaylists: async () => {
    db.delete(playlists).run()
    return { status: 200, body: { success: true } }
  },
  updatePlaylist: async ({ body: playlist, params: { id } }) => {
    const res = await db
      .update(playlists)
      .set(playlist)
      .where(eq(playlists.id, +id))
      .execute()
    if (res.changes === 0) {
      return { status: 404, body: { message: 'no playlist updated' } }
    }
    return { status: 200, body: { ...playlist, id: +id } }
  },
  getPlaylistTracks: async ({ params: { id } }) => {
    if (!Number.isInteger(+id))
      return {
        status: 400,
        body: { message: 'Invalid request, id should be a number' },
      }
    const result = await db.query.playlistsToTracks
      .findMany({
        where: eq(playlistsToTracks.playlistId, +id),
        with: { track: true },
      })
      .then((rows) => {
        if (rows.length < 0 || !rows?.at(0)?.track) return []
        return rows.map((row) => row.track!)
      })

    return { status: 200, body: result }
  },
  getPlaylist: async ({ params: { id } }) => {
    if (!Number.isInteger(+id))
      return {
        status: 400,
        body: { message: 'Invalid request, id should be a number' },
      }
    const result = await db.query.playlists.findFirst({
      where: eq(playlists.id, +id),
    })
    if (!result)
      return { status: 404, body: { message: `Playlist ${id} not found` } }

    return { status: 200, body: result }
  },
  removePlaylist: async ({ params: { id } }) => {
    try {
      db.delete(playlistsToTracks)
        .where(eq(playlistsToTracks.playlistId, +id))
        .run()
      db.delete(playlists).where(eq(playlists.id, +id)).run()
    } catch (e) {
      return { status: 404, body: { message: 'Error removing playlist' } }
    }
    return { status: 200, body: { deleted: true } }
  },
  getPlaylists: async () => {
    const result = db.select().from(playlists).orderBy(desc(playlists.id)).all()
    return {
      status: 200,
      body: result,
    }
  },
  addTrackToPlaylist: async ({ params: { id }, body: { id: trackId } }) => {
    if (!Number.isInteger(+id))
      return {
        status: 400,
        body: { message: 'Invalid request, id should be a number' },
      }
    db.insert(playlistsToTracks).values({ playlistId: +id, trackId }).run()
    return { status: 201, body: { success: true } }
  },
  createPlaylist: async ({ body: playlist }) => {
    const created = db
      .insert(playlists)
      .values(playlist)
      .returning({ id: playlists.id, name: playlists.name })
      .get()
    return { status: 201, body: created }
  },
  addMusicTrack: async ({ body: track }) => {
    const createdTrack = db.insert(tracks).values(track).returning().get()

    return { status: 201, body: createdTrack }
  },
  getAllMusicTracks: async () => {
    const result = db.select().from(tracks).all()

    return { status: 200, body: result }
  },
  getMetaForMedia: async ({ query: { url, source } }) => {
    try {
      const metadata = await getMetadataForUrl(url, source)
      return { status: 200, body: metadata }
    } catch (e) {
      if (e instanceof MetadataNotFoundError) {
        return { status: 404, body: { message: `${e}` } }
      }
      return { status: 500, body: { message: `${e}` } }
    }
  },
})

export const createAPIEndpoints = () => {
  createExpressEndpoints(contract, router, app)
}

export const startServer = () => {
  app.listen(3000)
}

export const startServerWithFrontend = () => {
  ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
  )
}
