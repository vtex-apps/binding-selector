import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { useMutation, useLazyQuery, useQuery } from 'react-apollo'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import BindingSelectorList from './components/BindingSelectorList'
import updateSalesChannelMutation from './graphql/updateSalesChannel.gql'
import alternateHrefsQuery from './graphql/alternateHrefs.gql'
import { createRedirectUrl, getMatchRoute } from './utils'
import shouldUpdateSalesChannel from './graphql/isSalesChannelUpdate.gql'
import Spinner from './components/Spinner'
import { useBinding } from './hooks/useBindings'
import getOrderForm from './graphql/getOrderForm.gql'

const CSS_HANDLES = [
  'container',
  'relativeContainer',
  'button',
  'buttonText',
] as const

interface GetOrderFormResponse {
  orderForm: {
    salesChannel: string
    orderFormId: string
    items: Array<{ id: string }>
  }
}

const BindingSelectorBlock: FC = () => {
  const {
    data: { currentBinding, bindingList, bindingsError, loadingBindings },
    actions: { setCurrentBindingInfo },
  } = useBinding()

  const [open, setOpen] = useState<boolean>(false)
  const [HasRunSyncEffect, setHasRunSyncEffect] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const {
    // @ts-expect-error routes not typed in useRuntime
    route: {
      pageContext: { id, type },
    },
  } = useRuntime()

  const { updateQuantity } = useOrderItems()

  const queryVariables = {
    id,
    type,
  }

  const [
    getAlternateHrefs,
    { data: hrefAltData },
  ] = useLazyQuery<QueryInternal>(alternateHrefsQuery, {
    variables: queryVariables,
  })

  const [updateSalesChannel] = useMutation<
    {
      updateSalesChannel: {
        orderFormId: string
        items: Array<{ quantity: number; uniqueId: string }>
      }
    },
    UpdateSalesChannelVariables
  >(updateSalesChannelMutation)

  const {
    data: orderFormResponse,
    loading: loadingOrderForm,
    error: orderFormError,
  } = useQuery<GetOrderFormResponse>(getOrderForm, {
    ssr: false,
  })

  const [loadingRedirect, setLoadingRedirect] = useState<boolean>(false)

  const { data: toogleSalesChannel } = useQuery<SalesChannelResponse>(
    shouldUpdateSalesChannel
  )

  /**
   * This effect handles the redirect after user selects a new binding.
   * We are handling it here because we couldn't get the hreflang inside the handleSelection method, since the callback from useLazyCallback returns void
   */
  useEffect(() => {
    const { canonicalBaseAddress } = currentBinding
    const { hostname, protocol } = window.location
    let path = ''

    // eslint-disable-next-line vtex/prefer-early-return
    if (hrefAltData) {
      const { routes = [] } = hrefAltData.internal

      path = getMatchRoute({ routes, currentBindingId: currentBinding.id })

      window.location.href = createRedirectUrl({
        canonicalBaseAddress,
        hostname,
        protocol,
        path,
      })
    }
  }, [hrefAltData, currentBinding])

  /**
   * This effect handles the synchronization between binding sales channel on page load and cart sales channel.
   * If different, it updates the cart sales channel to be the same as the one coming from the sales channel based on the binding url
   */
  useEffect(() => {
    const syncSalesChannel = async () => {
      const { data } = await updateSalesChannel({
        variables: {
          orderFormId: (orderFormResponse as GetOrderFormResponse).orderForm
            .orderFormId,
          salesChannel: currentBinding.salesChannel,
        },
      })

      const { items } = data?.updateSalesChannel ?? { items: [] }

      for (let i = 0; i < items.length; i++) {
        const { uniqueId, quantity } = items[i]

        // Trigger a re-render for cart component
        updateQuantity({
          uniqueId,
          quantity,
        })
      }
    }

    if (
      orderFormResponse?.orderForm.items.length &&
      currentBinding?.id &&
      toogleSalesChannel?.isSalesChannelUpdate
    ) {
      if (
        orderFormResponse.orderForm.salesChannel !==
          currentBinding.salesChannel &&
        !HasRunSyncEffect
      ) {
        syncSalesChannel()
      }

      setHasRunSyncEffect(true)
    }
  }, [
    orderFormResponse,
    currentBinding,
    toogleSalesChannel,
    updateSalesChannel,
    updateQuantity,
    HasRunSyncEffect,
  ])

  const handleClick = () => {
    setOpen(!open)
  }

  const handleSelection = async (
    selectedBinding: TranslationsAndSettings
  ): Promise<void> => {
    setLoadingRedirect(true)
    setCurrentBindingInfo(selectedBinding.id)
    setOpen(false)
    if (selectedBinding.externalRedirectData?.redirectUrl) {
      window.location.href = selectedBinding.externalRedirectData.url

      return
    }

    if (toogleSalesChannel?.isSalesChannelUpdate) {
      try {
        await updateSalesChannel({
          variables: {
            orderFormId: (orderFormResponse as GetOrderFormResponse).orderForm
              .orderFormId,
            salesChannel: selectedBinding.salesChannel,
          },
        })
      } catch (e) {
        // How to handle when there is an error updating sales channel?
        console.error(e)
      }
    }

    getAlternateHrefs()
  }

  const isLoading =
    loadingBindings || loadingOrderForm || !currentBinding.id || loadingRedirect

  const hasError = !!orderFormError || !!bindingsError

  if (hasError) {
    console.error('Error loading Binding Selector', {
      orderFormError,
      bindingsError,
    })
  }

  return hasError ? null : (
    <div
      className={`${handles.container} flex items-center justify-center w3 relative`}
    >
      <div
        className={`${handles.relativeContainer} relative flex justify-center`}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <button
              type="button"
              onClick={handleClick}
              className={`${handles.button} link pa3 bg-transparent bn flex items-center pointer c-on-base`}
            >
              <span className={`${handles.buttonText}`}>
                {currentBinding.label}
              </span>
            </button>
            <BindingSelectorList
              open={open}
              currentBinding={currentBinding}
              bindingInfo={bindingList}
              onSelectBinding={handleSelection}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default BindingSelectorBlock
