import { useCallback, useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'

import getBindingInfo from '../graphql/bindingInfo.gql'
import { getCurrentBindingAndList } from '../utils'

export const useBinding = () => {
  const [bindingList, setBindingList] = useState<TranslationsAndSettings[]>([])

  const [currentBinding, setCurrentBinding] = useState<TranslationsAndSettings>(
    {} as TranslationsAndSettings
  )

  const {
    data: bindingData,
    loading: loadingBindings,
    error: bindingsError,
  } = useQuery<BindingInfoResponse>(getBindingInfo)

  const { binding: runtimeBinding } = useRuntime()

  const setCurrentBindingInfo = useCallback(
    (selectedBindingId: string): void => {
      if (bindingData) {
        const bindingInfo = getCurrentBindingAndList({
          bindingData,
          selectedBindingId,
        })

        if (bindingInfo) {
          setBindingList(bindingInfo.currentList)
          setCurrentBinding(
            bindingInfo.currentBinding ?? ({} as TranslationsAndSettings)
          )
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
