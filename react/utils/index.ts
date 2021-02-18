export const filterBindings = ({
  bindings = [],
}: TenantInfoResponse['tenantInfo']): FilteredBinding[] => {
  const bindingsById = []

  for (const binding of bindings) {
    const salesChannelInfo = binding.extraContext.portal

    if (salesChannelInfo) {
      const bindingInfo = {
        id: binding.id,
        label: binding.defaultLocale,
        salesChannel: salesChannelInfo.salesChannel,
      }

      bindingsById.push(bindingInfo)
    }
  }

  return bindingsById
}

export const removeBindingAdmin = (bindings: Binding[] = []): Binding[] => {
  return bindings.filter(
    (binding) => binding.canonicalBaseAddress.split('/')[1] !== 'admin'
  )
}
