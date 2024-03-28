import { alfyCacheClient } from '../alfyCacheClient.js'
import { accessTokenProvider } from '../auth/accessTokenProvider.js'
import { GraphClient } from '../graphClient.js'

const graphClient = new GraphClient(accessTokenProvider.getAccessToken)

graphClient.getCalendarView().then((res) => {
  alfyCacheClient.calendarViewResponse.set(res)
})
