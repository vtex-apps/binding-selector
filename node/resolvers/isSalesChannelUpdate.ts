export const isSalesChannelUpdate = async (
  _: unknown,
  __: unknown,
  ctx: Context
) => {
  const { clients } = ctx
  const { vbase } = clients

  try {
    const salesChannelData: GetSalesChannel = await vbase.getJSON(
      'account.salesChannel',
      'configs'
    )

    return salesChannelData.salesChannel
  } catch (e) {
    const { status } = e.response

    if (status === 404) {
      return null
    }

    throw e
  }
}
