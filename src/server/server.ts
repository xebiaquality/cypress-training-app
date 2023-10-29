import { createExpressEndpoints, initServer } from '@ts-rest/express'
import bodyParser from 'body-parser'
import express from 'express'
import { contract } from '../contract'
import ViteExpress from 'vite-express'
import { playlists, tracks } from './schema'
import db from './db'
import { playlistsRouter } from './routers/playlist'
import { tracksRouter } from './routers/tracks'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const s = initServer()
const router = s.router(contract, {
  resetAllData: async () => {
    db.delete(playlists).run()
    db.delete(tracks).run()
    return { status: 200, body: { success: true } }
  },
  playlists: playlistsRouter,
  tracks: tracksRouter,
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
