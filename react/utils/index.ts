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

export const removeBindingAdmin = (bindings: Binding[] = []): Binding[] => {
  return bindings.filter(
    (binding) => binding.canonicalBaseAddress.split('/')[1] !== 'admin'
  )
}

interface RedirectUrlArgs {
  canonicalBaseAddress: string
  hostname: Window['location']['hostname']
  protocol: Window['location']['protocol']
  path: string
}

export const createRedirectUrl = ({
  canonicalBaseAddress,
  hostname,
  protocol,
  path,
}: RedirectUrlArgs): string => {
  const queryString = `?__bindingAddress=${canonicalBaseAddress}`
  const isMyVtex = hostname.indexOf('myvtex') !== -1

  return `${protocol}//${isMyVtex ? hostname : canonicalBaseAddress}${path}/${
    isMyVtex ? queryString : ''
  }`
}

interface MatchRoute {
  currentBindingId: string
  routes: [RoutesByBinding] | []
}

export const getMatchRoute = ({
  currentBindingId,
  routes,
}: MatchRoute): string => {
  const { route } =
    routes.find(
      ({ binding }: { binding: string }) => binding === currentBindingId
    ) ?? {}

  return route ?? ''
}
