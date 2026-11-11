import {
  getCallerOrderFormId,
  parseOrderFormId,
  requireCallerOrderForm,
} from '../callerOrderForm'

const contextWithCookie = (cookie?: string): Context =>
  (({
    headers: { cookie },
  } as unknown) as Context)

describe('parseOrderFormId', () => {
  it('reads the current cookie format', () => {
    expect(parseOrderFormId('__ofid=abc123')).toBe('abc123')
  })

  it('reads the legacy cookie format', () => {
    expect(parseOrderFormId('_ofid=abc123')).toBe('abc123')
  })

  it('returns null when the value has no orderFormId', () => {
    expect(parseOrderFormId('foo=bar')).toBeNull()
  })

  it('returns null when the value is absent', () => {
    expect(parseOrderFormId(undefined)).toBeNull()
  })

  it('returns null for an empty orderFormId', () => {
    expect(parseOrderFormId('__ofid=')).toBeNull()
  })

  it('returns null when the orderFormId has unsafe characters', () => {
    expect(parseOrderFormId('__ofid=../other')).toBeNull()
    expect(parseOrderFormId('__ofid=cart/1')).toBeNull()
    expect(parseOrderFormId('__ofid=%ZZ')).toBeNull()
  })

  it('returns null when the orderFormId is too long', () => {
    expect(parseOrderFormId(`__ofid=${'a'.repeat(65)}`)).toBeNull()
  })
})

describe('getCallerOrderFormId', () => {
  it('reads the cart from the checkout cookie', () => {
    expect(
      getCallerOrderFormId(contextWithCookie('checkout.vtex.com=__ofid=cart1'))
    ).toBe('cart1')
  })

  it('ignores other cookies in the header', () => {
    expect(
      getCallerOrderFormId(
        contextWithCookie(
          'vtex_segment=x; checkout.vtex.com=__ofid=cart1; CheckoutLocale=en-US'
        )
      )
    ).toBe('cart1')
  })

  it('returns null when the checkout cookie is absent', () => {
    expect(getCallerOrderFormId(contextWithCookie('vtex_segment=x'))).toBeNull()
    expect(getCallerOrderFormId(contextWithCookie())).toBeNull()
  })

  it('returns null when two checkout cookies carry different values', () => {
    expect(
      getCallerOrderFormId(
        contextWithCookie(
          'checkout.vtex.com=__ofid=cart1; checkout.vtex.com=__ofid=cart2'
        )
      )
    ).toBeNull()
  })

  it('accepts duplicated cookies with the same value', () => {
    expect(
      getCallerOrderFormId(
        contextWithCookie(
          'checkout.vtex.com=__ofid=cart1; checkout.vtex.com=__ofid=cart1'
        )
      )
    ).toBe('cart1')
  })

  it('returns null when one of the checkout cookies is malformed', () => {
    expect(
      getCallerOrderFormId(
        contextWithCookie('checkout.vtex.com=__ofid=cart1; checkout.vtex.com=x')
      )
    ).toBeNull()
  })
})

describe('requireCallerOrderForm', () => {
  it('returns the cart of the caller', () => {
    expect(
      requireCallerOrderForm(
        contextWithCookie('checkout.vtex.com=__ofid=cart1')
      )
    ).toBe('cart1')
  })

  it('rejects a caller with no cart cookie', () => {
    expect(() => requireCallerOrderForm(contextWithCookie())).toThrow(
      'Caller has no cart to update'
    )
  })
})
