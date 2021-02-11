import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'

export const updateSalesChannel = (
  _: unknown,
  args: {
    orderForm: string
    salesChannel: string
    clientPreferencesData: CheckoutOrderForm['clientPreferencesData']
  },
  ctx: Context
): Promise<CheckoutOrderForm> => {
  const { clients } = ctx
  const { orderForm, salesChannel, clientPreferencesData } = args

  const { checkout } = clients

  return checkout.updateSalesChannel(
    orderForm,
    salesChannel,
    clientPreferencesData
  )
}
