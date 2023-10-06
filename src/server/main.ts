import { createExpressEndpoints, initServer } from '@ts-rest/express'
import bodyParser from 'body-parser'
import express from 'express'
import { contract } from '../contract'
import ViteExpress from 'vite-express'
import { playlistTracks, playlists, tracks } from './schema'
import { eq } from 'drizzle-orm'
import { MetadataNotFoundError, getMetadataForUrl } from './api/metadata'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { sqlite } from './db'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const s = initServer()
const db = drizzle(sqlite, { schema })
const router = s.router(contract, {
  getPlaylist: async ({ params: { id } }) => {
    if (!Number.isInteger(+id))
      return {
        status: 400,
        body: { message: 'Invalid request, id should be a number' },
      }

    const playlist = db
      .select()
      .from(playlists)
      .where(eq(playlists.id, +id))
      .get()
    if (!playlist)
      return {
        status: 404,
        body: { message: `Playlist ${id} not found` },
      }

    return { status: 200, body: playlist }
  },
  getPlaylists: async () => {
    const result = db.select().from(playlists).all()
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
    db.insert(playlistTracks).values({ playlistId: +id, trackId }).run()
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

createExpressEndpoints(contract, router, app)

ViteExpress.listen(app, 3000, () =>
  console.log('Server is listening on port 3000...')
)
