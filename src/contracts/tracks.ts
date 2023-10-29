import { z } from 'zod'
import { c } from '.'

export enum TrackSources {
  Spotify = 'spotify',
  YouTube = 'youtube',
}
export const TrackSource = z.nativeEnum(TrackSources)
export const TrackSchema = z.object({
  id: z.number(),
  source: TrackSource,
  title: z.string(),
  artist: z.string().optional().nullable(),
  url: z.string().url(),
  coverUrl: z.string().url().optional().nullable(),
  /**
   * @type {string} - UTC timestamp in milliseconds
   */
  createdAt: z.string(),
})

export const tracksContract = c.router({
  addMusicTrack: {
    method: 'POST',
    path: '/tracks',
    body: TrackSchema.omit({ id: true, createdAt: true }),
    responses: {
      201: TrackSchema,
      400: c.type<{ message: string }>(),
    },
    summary: 'Add a music track to your collection',
  },
  getAllMusicTracks: {
    method: 'GET',
    path: '/tracks',
    responses: {
      200: z.array(TrackSchema),
    },
  },
  getMetaForMedia: {
    method: 'GET',
    path: '/meta',
    query: z.object({
      source: TrackSource,
      url: z.string().url(),
    }),
    responses: {
      200: z.object({
        title: z.string(),
        artist: z.string().optional(),
        coverUrl: z.string().optional(),
      }),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
    summary: 'Get metadata for a specific media URL for a source',
  },
})
