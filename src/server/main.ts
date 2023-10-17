import { env, ISOLATION_MODES } from './env'
import {
  createAPIEndpoints,
  startServer,
  startServerWithFrontend,
} from './server'

if (env?.ISOLATION) {
  if (env?.ISOLATION === ISOLATION_MODES.Backend) {
    createAPIEndpoints()
    startServer()
  }

  if (env?.ISOLATION === ISOLATION_MODES.Frontend) {
    startServerWithFrontend()
  }
} else {
  createAPIEndpoints()
  startServerWithFrontend()
}
