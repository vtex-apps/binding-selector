interface TranslatedInfo {
  id: string
  label: string
  canonicalBaseAddress: string
  defaultLocale: string
}

interface TranslatedBinding {
  bindingId: string
  translatedLocales: [TranslatedInfo]
}

interface GetResponse {
  newDataToSave: [TranslatedBinding]
}

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

  let newDataToSave: TranslatedBinding[]

  const newData = {
    bindingId,
    translatedLocales,
  }

  try {
    const savedTranslations: GetResponse = await vbase.getJSON(
      'account.binding',
      'configs'
    )

    if (savedTranslations.newDataToSave?.length) {
      const filteredFromChosenId = savedTranslations.newDataToSave.filter(
        (item: { bindingId: string }) => item.bindingId !== bindingId
      )

      filteredFromChosenId.push(newData)
      newDataToSave = filteredFromChosenId
    } else {
      newDataToSave = []
      newDataToSave.push(newData)
    }

    await vbase.saveJSON('account.binding', 'configs', {
      newDataToSave,
    })

    return newDataToSave
  } catch {
    newDataToSave = []
    newDataToSave.push(newData)

    await vbase.saveJSON('account.binding', 'configs', {
      newDataToSave,
    })

    return newDataToSave
  }
}
