export const bindingInfo = async (_: unknown, __: unknown, ctx: Context) => {
  const { clients } = ctx
  const { vbase } = clients
  const savedTranslations: GetResponse = await vbase.getJSON(
    'account.binding',
    'configs'
  )

  return savedTranslations.data
}
