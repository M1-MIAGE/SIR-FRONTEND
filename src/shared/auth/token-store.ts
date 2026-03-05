import type { TokenPairResponseDto } from '@/features/auth/model/auth.types'

type AccessTokenState = Pick<TokenPairResponseDto, 'accessToken' | 'tokenType' | 'accessTokenExpiresAt'>

let accessTokenState: AccessTokenState | null = null

/**
 * In-memory access token store shared by HTTP interceptors and auth provider.
 *
 * Refresh token is intentionally excluded because it is handled by secure cookies.
 */
export const authTokenStore = {
  /**
   * Returns the currently cached access token, if any.
   */
  get: (): AccessTokenState | null => accessTokenState,
  /**
   * Saves access-token fields from a full token pair payload.
   *
   * @param nextTokenPair Token pair returned by authentication endpoints.
   */
  set: (nextTokenPair: TokenPairResponseDto): void => {
    accessTokenState = {
      accessToken: nextTokenPair.accessToken,
      tokenType: nextTokenPair.tokenType,
      accessTokenExpiresAt: nextTokenPair.accessTokenExpiresAt,
    }
  },
  /**
   * Clears any cached access token.
   */
  clear: (): void => {
    accessTokenState = null
  },
} as const
