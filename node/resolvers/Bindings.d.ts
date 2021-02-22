interface TranslatedInfo {
  id: string
  label: string
  canonicalBaseAddress: string
  defaultLocale: string
}

interface TranslatedBinding {
  bindingId: string
  show: boolean
  translatedLocales: [TranslatedInfo]
}

interface GetResponse {
  data: [TranslatedBinding]
}

interface GetSalesChannel {
  salesChannel: boolean
}
