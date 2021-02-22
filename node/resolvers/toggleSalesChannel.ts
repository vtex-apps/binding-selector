export const toggleSalesChannel = async (
  _: unknown,
  args: {
    salesChannel: boolean
  },
  ctx: Context
) => {
  const { clients } = ctx
  const { salesChannel } = args
  const { vbase } = clients

  await vbase.saveJSON('account.salesChannel', 'configs', {
    salesChannel,
  })

  return salesChannel
}
