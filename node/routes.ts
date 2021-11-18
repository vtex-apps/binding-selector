import { method } from '@vtex/api'

import { errorHandler, viewerCountry } from './middlewares'

const routes = {
  viewerCountry: method({
    GET: [errorHandler, viewerCountry],
  }),
}

export { routes }
