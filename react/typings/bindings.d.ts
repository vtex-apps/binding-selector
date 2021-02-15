interface Binding {
  id: string
  defaultLocale: string
  extraContext: {
    portal?: {
      salesChannel: string
    }
  }
  canonicalBaseAddress: string
}

interface TenantInfoResponse {
  tenantInfo: {
    bindings: Binding[]
  }
}

interface FilteredBinding {
  id: string
  label: string
  salesChannel: string
  canonicalBaseAddress: string
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
