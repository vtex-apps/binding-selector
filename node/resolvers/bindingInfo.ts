export const bindingInfo = async (_: unknown, __: unknown, ctx: Context) => {
  const { clients } = ctx

  const { vbase } = clients

  try {
    const savedTranslations: GetResponse = await vbase.getJSON(
      'account.binding',
      'configs'
    )

    return savedTranslations.data
  } catch (e) {
    const { status } = e.response

    if (status === 404) {
      return []
    }

    throw e
  }
}
