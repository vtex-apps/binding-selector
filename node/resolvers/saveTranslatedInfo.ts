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
  const savedTranslations: GetResponse = await vbase.getJSON(
    'account.binding',
    'configs'
  )

  let newDataToSave: TranslatedBinding[]

  const newData = {
    bindingId,
    translatedLocales,
  }

  if (savedTranslations.newDataToSave.length) {
    const filteredFromChosenId = savedTranslations.newDataToSave.filter(
      (item: { bindingId: string }) => item.bindingId !== bindingId
    )

    filteredFromChosenId.push(newData)
    newDataToSave = filteredFromChosenId
  } else {
    savedTranslations.newDataToSave.push(newData)
    newDataToSave = savedTranslations.newDataToSave
  }

  await vbase.saveJSON('account.binding', 'configs', {
    newDataToSave,
  })

  return newDataToSave
}
