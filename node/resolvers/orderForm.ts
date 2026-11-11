import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'

import { requireCallerOrderForm } from '../middlewares/callerOrderForm'

export const updateSalesChannel = async (
  _: unknown,
  args: {
    orderFormId: string
    salesChannel: string
    locale: string
  },
  ctx: Context
): Promise<CheckoutOrderForm> => {
  const orderFormId = requireCallerOrderForm(ctx)
  const { salesChannel } = args
  const { checkout } = ctx.clients

  if (args.orderFormId && args.orderFormId !== orderFormId) {
    ctx.vtex.logger.warn(
      'updateSalesChannel: ignoring the orderFormId argument because it differs from the caller cart'
    )
  }

  const orderForm = await checkout.getOrderForm(orderFormId)

  if (!orderForm.items.length) {
    return orderForm
  }

  return checkout.addItems(orderFormId, orderForm.items, salesChannel)
}
