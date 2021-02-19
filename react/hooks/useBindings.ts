import { useCallback, useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'

import getBindingInfo from '../graphql/bindingInfo.gql'
import { filterBindings } from '../utils'

export const useBinding = () => {
  const [bindingList, setBindingList] = useState<AdjustedBinding[]>([])

  const [currentBinding, setCurrentBinding] = useState<AdjustedBinding>(
    {} as AdjustedBinding
  )

  const {
    data: bindingData,
    loading: loadingBindings,
    error: bindingsError,
  } = useQuery<BindingInfoResponse>(getBindingInfo)

  const { binding: runtimeBinding } = useRuntime()

  const setCurrentBindingInfo = useCallback(
    (selectedBindingId: string): void => {
      // eslint-disable-next-line vtex/prefer-early-return
      if (bindingData) {
        const filteredBindings = filterBindings(bindingData)
        const bindindFound = filteredBindings.find(
          (binding) => Object.keys(binding)[0] === selectedBindingId
        )

        if (bindindFound) {
          setBindingList(bindindFound[selectedBindingId])
          const findCurrentBinding = bindindFound[selectedBindingId].find(
            ({ id }) => id === selectedBindingId
          )

          if (findCurrentBinding) {
            setCurrentBinding(findCurrentBinding)
          }
        }
      }
    },
    [bindingData]
  )

  /**
   * This effects uses sets the current binding user is on
   */
  useEffect(() => {
    if (bindingData && runtimeBinding?.id) {
      setCurrentBindingInfo(runtimeBinding.id)
    }
  }, [bindingData, runtimeBinding, setCurrentBindingInfo])

  return {
    data: {
      currentBinding,
      bindingList,
      bindingsError,
      loadingBindings,
    },
    actions: {
      setCurrentBindingInfo,
    },
  }
}
