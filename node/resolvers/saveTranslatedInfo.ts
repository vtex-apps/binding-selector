interface TranslatedInfo {
  id: string
  label: string
  canonicalBaseAddress: string
  defaultLocale: string
}

interface TranslatedBinding {
  chosenId: string
  translatedLocales: [TranslatedInfo]
}

interface GetResponse {
  newDataToSave: [TranslatedBinding]
}

export const saveTranslatedInfo = async (
  _: unknown,
  args: {
    chosenId: string
    translatedLocales: [TranslatedInfo]
  },
  ctx: Context
) => {
  const { clients } = ctx
  const { chosenId, translatedLocales } = args
  const { vbase } = clients
  const savedTranslations: GetResponse = await vbase.getJSON(
    'account.binding',
    'configs'
  )

  let newDataToSave: TranslatedBinding[]

  const newData = {
    chosenId,
    translatedLocales,
  }

  if (savedTranslations.newDataToSave.length) {
    const filteredFromChosenId = savedTranslations.newDataToSave.filter(
      (item: { chosenId: string }) => item.chosenId !== chosenId
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
