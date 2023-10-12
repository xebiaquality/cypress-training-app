import { Index } from './pages'
import App from './App'
import { Browse } from './pages/browse'
import { RootRoute, Route, Router } from '@tanstack/react-router'
import AddMusicDialog from './components/dialogs/add-music-dialog'
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
    const response = await client.getPlaylist.query({ params: { id } })
    if (response.status === 200) {
      return response.body
    }
    if (response.status === 404) {
      throw response.body.message
    }
    throw 'Unexpected response'
  },
}).update({ component: Playlist })

const addTrackRoute = new Route({
  getParentRoute: () => indexRoute,
  path: '/add-track',
  component: AddMusicDialog,
})

const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([addTrackRoute]),
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
