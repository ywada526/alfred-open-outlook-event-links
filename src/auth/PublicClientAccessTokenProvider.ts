import {
  InteractionRequiredAuthError,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-node'
import type {
  AccountInfo,
  AuthenticationResult,
  Configuration,
} from '@azure/msal-node'
import open from 'open'
import { alfyCacheClient } from '../alfyCacheClient.js'
import { cachePlugin } from './cachePlugin.js'
import type { AccessTokenProvider } from './accessTokenProvider.js'

const msalConfig: Configuration = {
  auth: {
    clientId: '66d7de3f-81e4-415b-aca9-e90acfc578be',
    authority: 'https://login.microsoftonline.com/common/',
  },
  cache: {
    cachePlugin,
  },
  system: {
    loggerOptions: {
      loggerCallback(_, message) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
}

const publicClientApp = new PublicClientApplication(msalConfig)

export class PublicClientAccessTokenProvider implements AccessTokenProvider {
  private scopes: string[]

  constructor(scopes: string[]) {
    this.scopes = scopes
  }

  getAccessToken = async () => {
    const tokenCache = publicClientApp.getTokenCache()
    const homeAccountId = alfyCacheClient.homeAccountId.get()
    const account = homeAccountId ? await tokenCache.getAccountByHomeId(homeAccountId) : null

    let res: AuthenticationResult
    if (account) {
      try {
        res = await this.getTokenSilent({ scopes: this.scopes, account })
      }
      catch (e) {
        if (e instanceof InteractionRequiredAuthError)
          res = await this.getTokenInteractive({ scopes: this.scopes })
        else
          throw e
      }
    }
    else {
      res = await this.getTokenInteractive({ scopes: this.scopes })
      res.account?.homeAccountId && alfyCacheClient.homeAccountId.set(res.account.homeAccountId)
    }

    return res.accessToken
  }

  verifyAccessToken = async () => {
    // Return dummy token to skip this verification because it is not necessary for public client.
    // It is for DirectlyAccessTokenProvider.
    return { valid: true, accessToken: 'dummy' } as const
  }

  logout = async () => {
    const tokenCache = publicClientApp.getTokenCache()
    const homeAccountId = alfyCacheClient.homeAccountId.get()
    const account = homeAccountId ? await tokenCache.getAccountByHomeId(homeAccountId) : null
    if (account)
      await publicClientApp.getTokenCache().removeAccount(account)
    alfyCacheClient.homeAccountId.delete()
    alfyCacheClient.msalCache.delete()
  }

  private getTokenInteractive = async (tokenRequest: { scopes: string[], account?: AccountInfo }) => {
    const authResponse = await publicClientApp.acquireTokenInteractive({
      ...tokenRequest,
      openBrowser: async (url) => { await open(url) },
      successTemplate: 'Login successful! Please return to Alfred.',
      errorTemplate: 'Login failed!',
    })
    return authResponse
  }

  private getTokenSilent = async (tokenRequest: { scopes: string[], account: AccountInfo }) => {
    try {
      return await publicClientApp.acquireTokenSilent({ ...tokenRequest })
    }
    catch (e) {
      if (e instanceof InteractionRequiredAuthError)
        return await this.getTokenInteractive(tokenRequest)
      else
        throw e
    }
  }
}
