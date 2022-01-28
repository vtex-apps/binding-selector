interface Binding {
  id: string
  defaultLocale: string
  canonicalBaseAddress: string
  extraContext: {
    portal: {
      salesChannel: string
    }
  }
}

interface SalesChannelResponse {
  isSalesChannelUpdate: boolean
}

interface TenantInfoResponse {
  tenantInfo: {
    bindings: Binding[]
  }
}

interface BindingInfoResponse {
  bindingInfo: BindingsSaved[]
}

interface BindingTranslation {
  id: string
  label: string
  salesChannel: string
  defaultLocale: string
  canonicalBaseAddress: string
  hide: boolean
}

interface DataLocaleTypes {
  [key: string]: string
}

interface BindingsSaved {
  bindingId: string
  show: boolean
  translatedLocales: BindingTranslation[]
  externalRedirectData: ExternalRedirectData | null
  customFlagData: CustomFlagData | null
}

interface UpdateSalesChannelVariables {
  salesChannel: string
  orderFormId: string
}

interface AlternateHrefsVariables {
  id: string
  type: string
}

interface BindingsByBindingId {
  [bindingId: string]: TranslationsAndSettings[]
}

interface ExternalRedirectData {
  url: string
  redirectUrl: boolean
}

interface CustomFlagData {
  url: string
  isCustom: boolean
}

interface TranslationsAndSettings extends BindingTranslation {
  externalRedirectData: ExternalRedirectData | null
  customFlagData: CustomFlagData | null
}

interface ShowBindings {
  [key: string]: boolean
}

type FlagDisplay = 'text' | 'flag' | 'combined'

type SettingType = 'externalRedirectData' | 'customFlagData'
