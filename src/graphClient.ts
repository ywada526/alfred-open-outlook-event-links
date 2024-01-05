import { Client } from '@microsoft/microsoft-graph-client'

export const getGraphClient = (getAccessToken: () => Promise<string | null>) => {
  return Client.init({
    authProvider: async (done) => {
      const accessToken = await getAccessToken()
      done(null, accessToken)
    },
  })
}

export const resources = {
  calendarView: {
    endpoint: '/me/calendarview',
    scopes: ['Calendars.Read'],
  },
}
