import { jwtDecode } from 'jwt-decode'
import { alfyCacheClient } from '../alfyCacheClient.js'
import type { AccessTokenProvider } from './accessTokenProvider.js'

export class DirectlyAccessTokenProvider implements AccessTokenProvider {
  getAccessToken = async () => {
    const result = await this.verifyAccessToken()
    return result.valid ? result.accessToken : null
  }

  verifyAccessToken = async () => {
    const accessToken = alfyCacheClient.accessToken.get()
    if (!accessToken)
      return { valid: false, reason: 'ACCESS_TOKEN env is not set' } as const

    const decoded = jwtDecode(accessToken)
    if (!decoded.exp)
      return { valid: false, reason: 'no exp found in jwt' } as const

    const expired = new Date(decoded.exp * 1000) < new Date()
    if (expired)
      return { valid: false, reason: 'access token is expired' } as const

    return { valid: true, accessToken } as const
  }

  logout = async () => {
    alfyCacheClient.accessToken.delete()
  }
}
