export const bindingInfo = async (_: unknown, __: unknown, ctx: Context) => {
  const { clients } = ctx

  const { vbase } = clients

  try {
    const savedTranslations: GetResponse = await vbase.getJSON(
      'account.binding',
      'configs'
    )

    // eslint-disable-next-line no-console
    console.log(savedTranslations.data)

    return savedTranslations.data
  } catch (e) {
    const { status } = e.response

    if (status === 404) {
      return []
    }

    throw e
  }
}
