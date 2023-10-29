import { initServer } from '@ts-rest/express'
import db from '../db'
import { tracks } from '../schema'
import { MetadataNotFoundError, getMetadataForUrl } from '../api/metadata'
import { contract } from '../../contract'

const s = initServer()

export const tracksRouter = s.router(contract.tracks, {
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
