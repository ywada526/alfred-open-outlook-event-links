import type { ICachePlugin, TokenCacheContext } from '@azure/msal-node'
import { alfyCacheClient } from '../alfyCacheClient.js'

const beforeCacheAccess = async (cacheContext: TokenCacheContext) => {
  const cache = alfyCacheClient.msalCache.get()
  if (cache)
    cacheContext.tokenCache.deserialize(cache)
}

const afterCacheAccess = async (cacheContext: TokenCacheContext) => {
  if (cacheContext.cacheHasChanged)
    alfyCacheClient.msalCache.set(cacheContext.tokenCache.serialize())
}

export const cachePlugin: ICachePlugin = {
  beforeCacheAccess,
  afterCacheAccess,
}
