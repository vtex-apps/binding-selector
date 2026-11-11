import { updateSalesChannel } from '../orderForm'

const CALLER_CART = 'caller-cart-1'
const OTHER_CART = 'other-cart-2'

const makeContext = (cookie: string | undefined, items: unknown[] = []) => {
  const checkout = {
    getOrderForm: jest.fn().mockResolvedValue({ items }),
    addItems: jest.fn().mockResolvedValue({ items }),
  }

  const warn = jest.fn()

  const ctx = ({
    headers: { cookie },
    vtex: { logger: { warn } },
    clients: { checkout },
  } as unknown) as Context

  return { ctx, checkout, warn }
}

const args = (orderFormId: string) => ({
  orderFormId,
  salesChannel: '2',
  locale: 'pt-BR',
})

describe('updateSalesChannel', () => {
  it('updates the cart from the caller cookie', async () => {
    const { ctx, checkout } = makeContext(
      `checkout.vtex.com=__ofid=${CALLER_CART}`
    )

    await updateSalesChannel(null, args(CALLER_CART), ctx)

    expect(checkout.getOrderForm).toHaveBeenCalledWith(CALLER_CART)
  })

  it('re-adds the items of the caller cart', async () => {
    const items = [{ id: '31', quantity: 1 }]
    const { ctx, checkout } = makeContext(
      `checkout.vtex.com=__ofid=${CALLER_CART}`,
      items
    )

    await updateSalesChannel(null, args(CALLER_CART), ctx)

    expect(checkout.addItems).toHaveBeenCalledWith(CALLER_CART, items, '2')
  })

  it('ignores an argument that points to another cart', async () => {
    const { ctx, checkout, warn } = makeContext(
      `checkout.vtex.com=__ofid=${CALLER_CART}`
    )

    await updateSalesChannel(null, args(OTHER_CART), ctx)

    expect(checkout.getOrderForm).toHaveBeenCalledWith(CALLER_CART)
    expect(checkout.getOrderForm).not.toHaveBeenCalledWith(OTHER_CART)
    expect(warn).toHaveBeenCalled()
  })

  it('rejects a caller with no cart cookie', async () => {
    const { ctx, checkout } = makeContext(undefined)

    await expect(
      updateSalesChannel(null, args(OTHER_CART), ctx)
    ).rejects.toThrow('Caller has no cart to update')

    expect(checkout.getOrderForm).not.toHaveBeenCalled()
    expect(checkout.addItems).not.toHaveBeenCalled()
  })
})
