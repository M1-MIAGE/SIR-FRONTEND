import type { TokenPairResponseDto } from '@/features/auth/model/auth.types'

let tokenPair: TokenPairResponseDto | null = null

export const authTokenStore = {
  get: (): TokenPairResponseDto | null => tokenPair,
  set: (nextTokenPair: TokenPairResponseDto): void => {
    tokenPair = nextTokenPair
  },
  clear: (): void => {
    tokenPair = null
  },
} as const
