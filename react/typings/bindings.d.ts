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

interface AdjustedBinding {
  id: string
  label: string
  salesChannel: string
  defaultLocale: string
  canonicalBaseAddress: string
}

interface DataLocaleTypes {
  [key: string]: string
}

interface BindingsSaved {
  bindingId: string
  show: boolean
  translatedLocales: AdjustedBinding[]
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
  [bindingId: string]: AdjustedBinding[]
}
