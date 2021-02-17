export const saveTranslatedInfo = async (
  _: unknown,
  args: {
    bindingId: string
    translatedLocales: [TranslatedInfo]
  },
  ctx: Context
) => {
  const { clients } = ctx
  const { bindingId, translatedLocales } = args
  const { vbase } = clients

  let dataSave: TranslatedBinding[]

  const newData = {
    bindingId,
    translatedLocales,
  }

  try {
    const savedTranslations: GetResponse = await vbase.getJSON(
      'account.binding',
      'configs'
    )

    if (savedTranslations?.dataSave?.length) {
      const filteredFromChosenId = savedTranslations.dataSave.filter(
        (item: { bindingId: string }) => item.bindingId !== bindingId
      )

      filteredFromChosenId.push(newData)
      dataSave = filteredFromChosenId
    } else {
      dataSave = []
      dataSave.push(newData)
    }

    await vbase.saveJSON('account.binding', 'configs', {
      dataSave,
    })

    return dataSave
  } catch {
    dataSave = []
    dataSave.push(newData)

    await vbase.saveJSON('account.binding', 'configs', {
      dataSave,
    })

    return dataSave
  }
}
