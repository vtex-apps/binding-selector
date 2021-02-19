import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'

import getSalesChannel from '../graphql/getSalesChannel.gql'
import { filterBindings } from '../utils'

export const useBinding = () => {
  const [bindingList, setBindingList] = useState<FilteredBinding[]>([])

  const [currentBinding, setCurrentBinding] = useState<FilteredBinding>(
    {} as FilteredBinding
  )

  const {
    error: tenantError,
    data: tenantData,
    loading: loadingTenantInfo,
  } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const { binding: runtimeBinding } = useRuntime()

  /**
   * This effect run when we have info about all bindings.
   */
  useEffect(() => {
    if (tenantData) {
      const filteredBindings = filterBindings(tenantData.tenantInfo)

      setBindingList(filteredBindings)
    }
  }, [tenantData])

  /**
   * This effects uses sets the current binding user is on
   */
  useEffect(() => {
    if (runtimeBinding?.id) {
      const bindindFound = bindingList.find(
        ({ id: bindingId }) => bindingId === runtimeBinding.id
      )

      if (bindindFound) {
        setCurrentBinding(bindindFound)
      }
    }
  }, [bindingList, runtimeBinding])

  const bindingsError = tenantError
  const loadingBindings = loadingTenantInfo

  return {
    data: {
      currentBinding,
      bindingList,
      bindingsError,
      loadingBindings,
    },
    actions: {
      setCurrentBinding,
    },
  }
}
