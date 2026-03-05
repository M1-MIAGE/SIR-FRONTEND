import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

/**
 * Typed and validated runtime environment configuration.
 */
export const env = {
  apiBaseUrl: parsedEnv.data.VITE_API_BASE_URL,
} as const
