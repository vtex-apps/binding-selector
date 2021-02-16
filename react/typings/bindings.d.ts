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

interface FilteredBinding {
  id: string
  label: string
  salesChannel: string
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
