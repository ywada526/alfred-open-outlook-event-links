import process from 'node:process'
import alfy from 'alfy'
import { getGraphClient, resources } from '../graphClient.js'
import { accessTokenProvider } from '../auth/accessTokenProvider.js'

const result = await accessTokenProvider.verifyAccessToken()
if (!result.valid) {
  alfy.output([
    {
      title: result.reason,
      subtitle: 'Open Microsoft Graph Explorer to get an access token.',
      arg: 'https://developer.microsoft.com/en-us/graph/graph-explorer?request=me%2Fcalendarview&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com',
    },
  ])
  process.exit(1)
}

const graphClient = getGraphClient(accessTokenProvider.getAccessToken)

const now = new Date()
const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

const res = await graphClient
  .api(resources.calendarView.endpoint)
  .header('Prefer', 'outlook.timezone="Asia/Tokyo"')
  .query({ startDateTime: now.toISOString(), endDateTime: endOfToday.toISOString() })
  .select('subject,organizer,start,end,location,body')
  .orderby('isAllDay,start/dateTime')
  .top(50)
  .get()

const items = res.value.map((event: any) => {
  const urlRegex = /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/g
  return {
    title: event.subject,
    subtitle: `${event.start.dateTime.slice(0, 16)} - ${event.end.dateTime.slice(0, 16)}`,
    arg:
      `${event.location.displayName} ${event.body.content}`.match(urlRegex) || [],
  }
})

alfy.output(items)
