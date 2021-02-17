interface Binding {
  id: string
  defaultLocale: string
  canonicalBaseAddress: string
  extraContext: {
    portal?: {
      salesChannel: string
    }
  }
}

interface TenantInfoResponse {
  tenantInfo: {
    bindings: Binding[]
  }
}

interface InfoBinding {
  id: string
  label: string
  defaultLocale: string
  canonicalBaseAddress: string
}

interface FilteredBinding {
  id: string
  label: string
  salesChannel: string
  canonicalBaseAddress: string
}

interface BindingsSaved {
  bindingId: string
  translatedLocales: InfoBinding[]
}

interface UpdateSalesChannelVariables {
  salesChannel: string
  locale: string
  orderFormId: string
}

interface AlternateHrefsVariables {
  id: string
  type: string
}
