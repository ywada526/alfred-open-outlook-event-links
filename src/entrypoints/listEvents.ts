import process from 'node:process'
import alfy from 'alfy'
import { GraphClient } from '../graphClient.js'
import { accessTokenProvider } from '../auth/accessTokenProvider.js'
import { alfyCacheClient } from '../alfyCacheClient.js'

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

const graphClient = new GraphClient(accessTokenProvider.getAccessToken)
const res = alfyCacheClient.calendarViewResponse.get() ?? await graphClient.getCalendarView()

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
