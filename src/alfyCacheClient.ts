import alfy from 'alfy'

export const alfyCacheClient = {
  homeAccountId: {
    get: () => alfy.cache.get('home-account-id') as string | undefined,
    set: (value: string) => alfy.cache.set('home-account-id', value),
    delete: () => alfy.cache.delete('home-account-id'),
  },
  msalCache: {
    get: () => alfy.cache.get('msal-cache') as string | undefined,
    set: (value: string) => alfy.cache.set('msal-cache', value),
    delete: () => alfy.cache.delete('msal-cache'),
  },
  accessToken: {
    get: () => alfy.cache.get('access-token') as string | undefined,
    set: (value: string) => alfy.cache.set('access-token', value),
    delete: () => alfy.cache.delete('access-token'),
  },
  calendarViewResponse: {
    get: () => alfy.cache.get('calendarViewResponse') as any,
    set: (value: any) => alfy.cache.set('calendarViewResponse', value),
    delete: () => alfy.cache.delete('calendarViewResponse'),
  },
}
