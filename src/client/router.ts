import { Index } from './pages'
import App from './App'
import { Browse } from './pages/browse'
import { RootRoute, Route, Router } from '@tanstack/react-router'
import AddMusicDialog from './components/dialogs/add-music-dialog'

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

const addTrackRoute = new Route({
  getParentRoute: () => indexRoute,
  path: '/add-track',
  component: AddMusicDialog,
})

const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([addTrackRoute]),
  browseRoute,
])

export const router = new Router({ routeTree })

// needed for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
