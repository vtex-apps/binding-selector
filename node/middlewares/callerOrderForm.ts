import { ForbiddenError } from '@vtex/api'

/**
 * Cart cookie written by VTEX Checkout. It is HttpOnly and holds
 * `__ofid=<orderFormId>` (older stores use `_ofid=`).
 */
export const ORDER_FORM_COOKIE = 'checkout.vtex.com'

const ORDER_FORM_ID = /^[A-Za-z0-9-]{1,64}$/
const ORDER_FORM_ID_IN_COOKIE = /_ofid=([^;&]+)/

/**
 * Reads every value of the cart cookie from the raw header. A request with
 * two cookies of the same name is ambiguous: the parser would otherwise take
 * the first one, which a script can control with a longer path.
 */
const readCookieValues = (header: string | undefined, name: string): string[] => {
  if (!header) {
    return []
  }

  return header
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${name}=`))
    .map((part) => part.slice(name.length + 1))
}

export const parseOrderFormId = (cookieValue?: string): string | null => {
  if (!cookieValue) {
    return null
  }

  const match = cookieValue.match(ORDER_FORM_ID_IN_COOKIE)
  const orderFormId = match?.[1].trim()

  return orderFormId && ORDER_FORM_ID.test(orderFormId) ? orderFormId : null
}

/**
 * Returns the orderFormId of the cart in the caller's cookie, or null when the
 * cookie is missing, duplicated with different values, or malformed.
 */
export const getCallerOrderFormId = (ctx: Context): string | null => {
  const values = readCookieValues(ctx.headers?.cookie, ORDER_FORM_COOKIE)

  if (!values.length) {
    return null
  }

  const orderFormIds = values.map(parseOrderFormId)

  if (orderFormIds.some((orderFormId) => !orderFormId)) {
    return null
  }

  const unique = new Set(orderFormIds)

  return unique.size === 1 ? [...unique][0] ?? null : null
}

/**
 * Returns the cart the caller owns. The mutation acts on this id and never on
 * the argument, so a caller cannot point the operation at another cart.
 *
 * The cookie identifies the cart the browser is using. It does not prove the
 * caller owns it: an API client that knows another cart id can send a matching
 * cookie. Use this to keep the mutation on the storefront cart, not as an
 * authorization boundary.
 */
export const requireCallerOrderForm = (ctx: Context): string => {
  const orderFormId = getCallerOrderFormId(ctx)

  if (!orderFormId) {
    throw new ForbiddenError('Caller has no cart to update')
  }

  return orderFormId
}
