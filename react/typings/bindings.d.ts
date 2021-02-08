interface Binding {
  id: string
  defaultLocale: string
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
