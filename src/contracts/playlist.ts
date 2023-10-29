import { z } from 'zod'
import { TrackSchema } from './tracks'
import { c } from '.'

export const PlaylistSchema = z.object({
  id: z.number(),
  name: z.string(),
  tracks: z.array(TrackSchema),
})

export const playlistsContract = c.router({
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
})
