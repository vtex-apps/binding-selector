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
  const { orderFormId, salesChannel, locale } = args
  const { checkout } = clients
  const orderForm = await checkout.getOrderForm(orderFormId)
  const { clientPreferencesData } = orderForm
  const updatedClientPreferencesData = {
    ...clientPreferencesData,
    locale,
    // @ts-expect-error There is a misspelling in the type definition
    optinNewsLetter: clientPreferencesData?.optinNewsLetter ?? false,
  }

  const updatedOrderFormPromise = checkout.updateSalesChannel(
    orderFormId,
    salesChannel,
    updatedClientPreferencesData
  )

  if (!orderForm.items.length) {
    return updatedOrderFormPromise
  }

  await updatedOrderFormPromise

  return checkout.addItems(orderFormId, orderForm.items, salesChannel)
}
