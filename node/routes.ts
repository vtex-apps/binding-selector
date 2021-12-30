import { method } from '@vtex/api'

import { viewerCountry } from './middlewares'

const routes = {
  viewerCountry: method({
    GET: [viewerCountry],
  }),
}

export { routes }
