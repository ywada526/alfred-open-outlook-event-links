import process from 'node:process'
import { resources } from '../graphClient.js'
import { DirectlyAccessTokenProvider } from './DirectlyAccessTokenProvider.js'
import { PublicClientAccessTokenProvider } from './PublicClientAccessTokenProvider.js'

export interface AccessTokenProvider {
  getAccessToken: () => Promise<string | null>
  verifyAccessToken(): Promise<{ valid: true, accessToken: string } | { valid: false, reason: string }>
  logout(): Promise<void>
}

export const accessTokenProvider = process.env.USE_ACCESS_TOKEN_DIRECTLY
  ? new DirectlyAccessTokenProvider()
  : new PublicClientAccessTokenProvider(resources.calendarView.scopes)
