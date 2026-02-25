import type { TokenPairResponseDto } from '@/features/auth/model/auth.types'

type AccessTokenState = Pick<TokenPairResponseDto, 'accessToken' | 'tokenType' | 'accessTokenExpiresAt'>

let accessTokenState: AccessTokenState | null = null

export const authTokenStore = {
  get: (): AccessTokenState | null => accessTokenState,
  set: (nextTokenPair: TokenPairResponseDto): void => {
    accessTokenState = {
      accessToken: nextTokenPair.accessToken,
      tokenType: nextTokenPair.tokenType,
      accessTokenExpiresAt: nextTokenPair.accessTokenExpiresAt,
    }
  },
  clear: (): void => {
    accessTokenState = null
  },
} as const
