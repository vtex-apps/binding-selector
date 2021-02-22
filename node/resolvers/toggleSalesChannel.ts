export const toggleSalesChannel = async (
  _: unknown,
  args: {
    data: [TranslatedBinding]
  },
  ctx: Context
) => {
  const { clients } = ctx
  const { data } = args
  const { vbase } = clients

  await vbase.saveJSON('account.salesChannel', 'configs', {
    data,
  })

  return data
}
