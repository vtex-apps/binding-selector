import { AuthenticationError, ForbiddenError, UserInputError } from '@vtex/api'
import type { AxiosError } from 'axios'

const CHECKOUT_COOKIE = 'checkout.vtex.com'

export const checkoutCookieFormat = (orderFormId: string) => {
  return `${CHECKOUT_COOKIE}=__ofid=${orderFormId};`
}

export const statusToError = (e: AxiosError) => {
  if (!e.response) {
    throw e
  }

  const {
    response: { status },
  } = e

  switch (status) {
    case 401: {
      throw new AuthenticationError(e)
    }

    case 403: {
      throw new ForbiddenError(e)
    }

    case 400: {
      throw new UserInputError(e)
    }

    default:
      break
  }
}
