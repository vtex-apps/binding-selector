/**
 * filterBingings function filters out the bindings that should not be displayed based on admin setting.
 * It returns an array with objects that have the binding Id's as keys and an array with the translations for that binding as values.
 */

const filterBindings = ({
  bindingInfo = [],
}: BindingInfoResponse): BindingsByBindingId[] => {
  const bindingsById = []

  const bindnigsToShow: Record<string, boolean> = {}

  const bindingExternalRedirect: Record<
    string,
    ExternalRedirectData | null
  > = {}

  const bindingCustomFlag: Record<string, CustomFlagData | null> = {}

  for (const binding of bindingInfo) {
    if (binding.show) {
      bindnigsToShow[binding.bindingId] = true
      bindingExternalRedirect[binding.bindingId] = binding.externalRedirectData
      bindingCustomFlag[binding.bindingId] = binding.customFlagData
    }
  }

  for (const binding of bindingInfo) {
    if (binding.show) {
      const bindingIdAndLabels = {
        [binding.bindingId]: binding.translatedLocales
          // filter out translations for bindings set to not show
          .filter(({ id }) => bindnigsToShow[id])
          // map over the left ones to add externalRedirect info
          .map((translation) => {
            const externalRedirectData = bindingExternalRedirect[translation.id]
            const customFlagData = bindingCustomFlag[translation.id]

            return {
              ...translation,
              externalRedirectData,
              customFlagData,
            }
          }),
      }

      bindingsById.push(bindingIdAndLabels)
    }
  }

  return bindingsById
}

/**
 * Based on a binding Id, this function returns the information for all bindings for the binding Id passed in, with the translated labels as its value
 */
const findBinding = ({
  filteredBindings,
  selectedBindingId,
}: {
  filteredBindings: BindingsByBindingId[]
  selectedBindingId: string
}) => {
  return filteredBindings.find(
    (binding) => Object.keys(binding)[0] === selectedBindingId
  )
}

/**
 * This function gets the translation for the current binding, returning the selected one and all information for the other binidngs
 */

const filterCurrentAndListBinding = ({
  bindingsById,
  selectedBindingId,
}: {
  bindingsById: BindingsByBindingId
  selectedBindingId: string
}) => {
  const currentList = bindingsById[selectedBindingId]
  const currentBinding = currentList.find(({ id }) => id === selectedBindingId)

  return { currentList, currentBinding }
}

export const getCurrentBindingAndList = ({
  bindingData,
  selectedBindingId,
}: {
  bindingData: BindingInfoResponse
  selectedBindingId: string
}) => {
  const filteredBindings = filterBindings(bindingData)
  const bindindFound = findBinding({
    filteredBindings,
    selectedBindingId,
  })

  if (bindindFound) {
    return filterCurrentAndListBinding({
      bindingsById: bindindFound,
      selectedBindingId,
    })
  }
}

export const removeBindingAdmin = (bindings: Binding[] = []): Binding[] => {
  return bindings.filter(
    (binding) => binding.canonicalBaseAddress.split('/')[1] !== 'admin'
  )
}

interface CreateQueryStringArgs {
  isMyVtex: boolean
  canonicalBaseAddress: string
  keepSalesChannel: boolean
  salesChannel?: string
}

const createQueryString = ({
  isMyVtex,
  canonicalBaseAddress,
  keepSalesChannel,
  salesChannel,
}: CreateQueryStringArgs): string => {
  const bindingAddressQueryString = `__bindingAddress=${canonicalBaseAddress}`

  // Add `sc` search string will force the session to be that salesChannel
  const salesChannelQueryString = keepSalesChannel ? `sc=${salesChannel}` : ''

  if (isMyVtex) {
    return keepSalesChannel
      ? `?${bindingAddressQueryString}&${salesChannelQueryString}`
      : `?${bindingAddressQueryString}`
  }

  return keepSalesChannel ? `?${salesChannelQueryString}` : ''
}

interface RedirectUrlArgs {
  canonicalBaseAddress: string
  hostname: Window['location']['hostname']
  protocol: Window['location']['protocol']
  path: string
  hash: string
  pageType: string
  keepSalesChannel?: boolean
  salesChannel?: string
}

export const isMyAccount = (pageType: string): boolean =>
  pageType === 'store.account'

export const createRedirectUrl = ({
  canonicalBaseAddress,
  hostname,
  protocol,
  path,
  hash,
  pageType,
  keepSalesChannel = false,
  salesChannel,
}: RedirectUrlArgs): string => {
  const isMyVtex = hostname.indexOf('myvtex') !== -1

  const myAccount = isMyAccount(pageType)

  const queryString = createQueryString({
    keepSalesChannel,
    salesChannel,
    canonicalBaseAddress,
    isMyVtex,
  })

  return `${protocol}//${isMyVtex ? hostname : canonicalBaseAddress}${
    !myAccount ? path : '/account'
  }${queryString}${hash}`
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

export const transformUserRouteId = (id: string): string => {
  return id.replace('custom#', 'custom::')
}

export const setShowValues = (bindingList: BindingsSaved[]): ShowBindings => {
  return bindingList.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.bindingId]: cur.show,
    }
  }, {})
}

export const hasAllTranslations = ({
  bindingsToShow,
  translatedBindings,
}: {
  bindingsToShow: string[]
  translatedBindings: BindingTranslation[]
}): boolean => {
  const labelMap = new Map<string, string>()
  const hideLabelMap = new Map<string, boolean>()

  for (const { id, label, hide } of translatedBindings) {
    labelMap.set(id, label)
    hideLabelMap.set(id, hide)
  }

  for (const bindingId of bindingsToShow) {
    if (
      !labelMap.has(bindingId) ||
      (!hideLabelMap.get(bindingId) && !labelMap.get(bindingId))
    ) {
      return false
    }
  }

  return true
}

export const createBindingsToLabel = (
  bindings: Binding[],
  currentTranslations: BindingTranslation[]
): Record<string, BindingTranslation> => {
  const translationsMap: Record<string, Partial<BindingTranslation>> = {}

  for (const translation of currentTranslations) {
    translationsMap[translation.id] = {
      id: translation.id,
      label: translation.label,
      hide: !!translation.hide,
    }
  }

  return bindings.reduce((map, binding) => {
    const staticInfo = {
      canonicalBaseAddress: binding.canonicalBaseAddress,
      salesChannel: String(binding.extraContext.portal.salesChannel),
      defaultLocale: binding.defaultLocale,
    }

    if (translationsMap[binding.id]) {
      return {
        ...map,
        [binding.id]: {
          ...translationsMap[binding.id],
          ...staticInfo,
        },
      }
    }

    return {
      ...map,
      [binding.id]: {
        id: binding.id,
        label: '',
        hide: false,
        ...staticInfo,
      },
    }
  }, {})
}
