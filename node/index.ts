import type { RecorderState, ParamsContext } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { resolvers } from './resolvers'

const TEN_SECONDS_MS = 10 * 1000

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: TEN_SECONDS_MS,
      },
    },
  },
  graphql: {
    resolvers,
  },
})
