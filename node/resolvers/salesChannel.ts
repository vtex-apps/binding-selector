export const salesChannel = async (_: unknown, __: unknown, ctx: Context) => {
  const { clients } = ctx
  const { vbase } = clients
  const savedData: GetResponse = await vbase.getJSON(
    'account.salesChannel',
    'configs'
  )

  return savedData.data
}
