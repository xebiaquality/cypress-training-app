import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export enum TrackSources {
  Spotify = 'spotify',
  YouTube = 'youtube',
}
const TrackSource = z.nativeEnum(TrackSources)
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

const PlaylistSchema = z.object({
  id: z.number(),
  name: z.string(),
  tracks: z.array(TrackSchema),
})

export const contract = c.router(
  {
    resetAllData: {
      method: 'GET',
      path: '/reset',
      responses: {
        200: c.type<{ success: true }>(),
      },
      summary: 'flush all data',
    },

    createPlaylist: {
      method: 'POST',
      path: '/playlists',
      responses: {
        201: PlaylistSchema.omit({ tracks: true }),
      },
      body: z.object({
        name: z.string(),
      }),
      summary: 'Create a post',
    },
    removeAllPlaylists: {
      method: 'GET',
      path: '/playlists/remove-all',
      responses: {
        200: c.type<{ success: true }>(),
      },
      summary: 'Delete all playlists',
    },
    getPlaylistTracks: {
      method: 'GET',
      path: `/playlists/:id/tracks`,
      responses: {
        200: z.array(TrackSchema),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
      },
      summary: 'Get a playlist by id',
    },
    getPlaylist: {
      method: 'GET',
      path: `/playlists/:id`,
      responses: {
        200: PlaylistSchema.omit({ tracks: true }),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
      },
      summary: 'Get a playlist by id',
    },
    removePlaylist: {
      method: 'DELETE',
      path: `/playlists/:id`,
      body: z.optional(PlaylistSchema.omit({ tracks: true })),
      responses: {
        200: c.type<{ deleted: true }>(),
        404: c.type<{ message: string }>(),
      },
      summary: 'Remove a playlist by id',
    },
    getPlaylists: {
      method: 'GET',
      path: `/playlists`,
      responses: {
        200: z.array(PlaylistSchema.omit({ tracks: true })),
      },
      summary: 'Get all playlists',
    },
    updatePlaylist: {
      method: 'PATCH',
      path: `/playlists/:id`,
      body: PlaylistSchema.omit({ tracks: true, id: true }),
      responses: {
        200: PlaylistSchema.omit({ tracks: true }),
        404: c.type<{ message: string }>(),
      },
    },
    addTrackToPlaylist: {
      method: 'POST',
      path: `/playlists/:id/tracks`,
      body: TrackSchema.pick({ id: true }),
      responses: {
        201: c.type<{ success: true }>(),
        404: c.type<{ message: string }>(),
        400: c.type<{ message: string }>(),
      },
    },
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
  },
  { pathPrefix: '/api' }
)
