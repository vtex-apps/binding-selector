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

  for (const binding of bindingInfo) {
    if (binding.show) {
      bindnigsToShow[binding.bindingId] = true
      bindingExternalRedirect[binding.bindingId] = binding.externalRedirectData
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

            return {
              ...translation,
              externalRedirectData,
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

  return `${protocol}//${isMyVtex ? hostname : canonicalBaseAddress}${path}${
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

  for (const { id, label } of translatedBindings) {
    labelMap.set(id, label)
  }

  for (const bindingId of bindingsToShow) {
    if (!labelMap.has(bindingId) || !labelMap.get(bindingId)) {
      return false
    }
  }

  return true
}

export const createHideLabelMap = (
  translatedLocales: BindingTranslation[] = []
): Record<string, boolean> => {
  return translatedLocales.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr.hide,
    }
  }, {})
}
