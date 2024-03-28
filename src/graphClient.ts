import { Client } from '@microsoft/microsoft-graph-client'

export const resources = {
  calendarView: {
    endpoint: '/me/calendarview',
    scopes: ['Calendars.Read'],
  },
}

export class GraphClient {
  private client: Client

  constructor(getAccessToken: () => Promise<string | null>) {
    this.client = Client.init({
      authProvider: async (done) => {
        const accessToken = await getAccessToken()
        done(null, accessToken)
      },
    })
  }

  async getCalendarView() {
    const now = new Date()
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    return this.client
      .api(resources.calendarView.endpoint)
      .header('Prefer', 'outlook.timezone="Asia/Tokyo"')
      .query({ startDateTime: now.toISOString(), endDateTime: endOfToday.toISOString() })
      .select('subject,organizer,start,end,location,body')
      .orderby('isAllDay,start/dateTime')
      .top(50)
      .get()
  }
}
