export const isSalesChannelUpdate = async (
  _: unknown,
  __: unknown,
  ctx: Context
) => {
  const { clients } = ctx
  const { vbase } = clients
  const salesChannelData: GetSalesChannel = await vbase.getJSON(
    'account.salesChannel',
    'configs'
  )

  return salesChannelData.salesChannel
}
