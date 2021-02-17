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

export const translatedInfo = async (_: unknown, __: unknown, ctx: Context) => {
  const { clients } = ctx
  const { vbase } = clients
  const savedTranslations: GetResponse = await vbase.getJSON(
    'account.binding',
    'configs'
  )

  return savedTranslations.newDataToSave
}
