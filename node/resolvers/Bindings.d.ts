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
  dataSave: [TranslatedBinding]
}
