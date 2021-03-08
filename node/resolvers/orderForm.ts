import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'

export const updateSalesChannel = async (
  _: unknown,
  args: {
    orderFormId: string
    salesChannel: string
    locale: string
  },
  ctx: Context
): Promise<CheckoutOrderForm> => {
  const { clients } = ctx
  const { orderFormId, salesChannel } = args
  const { checkout } = clients
  const orderForm = await checkout.getOrderForm(orderFormId)

  if (!orderForm.items.length) {
    return orderForm
  }

  return checkout.addItems(orderFormId, orderForm.items, salesChannel)
}
