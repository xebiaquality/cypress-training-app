import { playlistsContract } from './contracts/playlist'
import { tracksContract } from './contracts/tracks'
import { c } from './contracts'

export const contract = c.router(
  {
    playlists: playlistsContract,
    tracks: tracksContract,
    resetAllData: {
      method: 'GET',
      path: '/reset',
      responses: {
        200: c.type<{ success: true }>(),
      },
      summary: 'flush all data',
    },
  },
  { pathPrefix: '/api' }
)
