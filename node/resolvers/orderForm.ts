import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'

export const updateSalesChannel = (
  _: unknown,
  args: {
    orderFormId: string
    salesChannel: string
    clientPreferencesData: CheckoutOrderForm['clientPreferencesData']
  },
  ctx: Context
): Promise<CheckoutOrderForm> => {
  const { clients } = ctx
  const { orderFormId, salesChannel, clientPreferencesData } = args

  const { checkout } = clients

  return checkout.updateSalesChannel(
    orderFormId,
    salesChannel,
    clientPreferencesData
  )
}
