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
        canonicalBaseAddress: binding.canonicalBaseAddress,
      }

      bindingsById.push(bindingInfo)
    }
  }

  return bindingsById
}
