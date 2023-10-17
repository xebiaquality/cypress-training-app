import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ISOLATION_MODES } from './env'
const createAPIEndpoints = vi.fn()
const startServer = vi.fn()
const startServerWithFrontend = vi.fn()
describe('Server startup behaviour', () => {
  beforeEach(() => {
    vi.mock('./server', () => ({
      createAPIEndpoints,
      startServer,
      startServerWithFrontend,
    }))
  })

  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('should start API with frontend when no ISOLATION env is set', async () => {
    await vi.importActual('./main')

    // expect endpoints to create
    expect(createAPIEndpoints).toBeCalled()

    // expect vite to start
    expect(startServerWithFrontend).toBeCalled()
  })

  it('should start only serverWithFrontend (vite) when env ISOLATION=frontend', async () => {
    vi.stubEnv('ISOLATION', ISOLATION_MODES.Frontend)

    await vi.importActual('./main')

    // expect endpoints to not be created
    expect(createAPIEndpoints).not.toBeCalled()

    // expect vite to start
    expect(startServerWithFrontend).toBeCalled()
  })

  it('should start only API (express) when env ISOLATION=backend', async () => {
    vi.stubEnv('ISOLATION', ISOLATION_MODES.Backend)

    await vi.importActual('./main')

    expect(createAPIEndpoints).toBeCalled()
    expect(startServer).toBeCalled()
    expect(startServerWithFrontend).not.toBeCalled()
  })

  it('should throw error when wrong ISOLATION env var is set', async () => {
    vi.stubEnv('ISOLATION', 'kaas')

    expect(vi.importActual('./main')).rejects.toThrow(
      /Wrong environment variable/
    )
  })
})
