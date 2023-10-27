import { Index } from './pages'
import App from './App'
import { Browse } from './pages/browse'
import { RootRoute, Route, Router } from '@tanstack/react-router'
import { Playlist } from './pages/playlist'
import { client } from './client'

const rootRoute = new RootRoute({
  component: App,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})

const browseRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: Browse,
})

export const playlistRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/playlists/$id',
  loader: async ({ params: { id } }) => {
    const response = await client.getPlaylistTracks.query({ params: { id } })
    if (response.status === 200) {
      return { tracks: response.body }
    }
    if (response.status === 404) {
      throw response.body.message
    }
    throw 'Unexpected response'
  },
}).update({ component: Playlist })

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  playlistRoute,
])

export const router = new Router({ routeTree })

// needed for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
