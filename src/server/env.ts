import { z } from 'zod'
export const ISOLATION_MODES = {
  Backend: 'backend',
  Frontend: 'frontend',
} as const

const envSchema = z.object({
  ISOLATION: z
    .enum([ISOLATION_MODES.Backend, ISOLATION_MODES.Frontend])
    .optional(),
  NODE_ENV: z.string().optional(),
})
type Environment = z.infer<typeof envSchema>
export let env: Environment = {}
try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    throw `Wrong environment variable value set for ${e.issues.at(0)
      ?.path}: ${e.issues.at(0)?.message}`
  }
}
