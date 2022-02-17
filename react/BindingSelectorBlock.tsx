import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useMutation, useLazyQuery, useQuery } from 'react-apollo'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import BindingSelectorDropdown from './components/BindingSelectorDropdown'
import updateSalesChannelMutation from './graphql/updateSalesChannel.gql'
import alternateHrefsQuery from './graphql/alternateHrefs.gql'
import { createRedirectUrl, getMatchRoute, transformUserRouteId } from './utils'
import shouldUpdateSalesChannel from './graphql/isSalesChannelUpdate.gql'
import BindingSelectorList from './components/BindingSelectorList'
import BindingSelectorSelect from './components/BindingSelectorSelect'
import { useBinding } from './hooks/useBindings'
import getOrderForm from './graphql/getOrderForm.gql'

interface GetOrderFormResponse {
  orderForm: {
    salesChannel: string
    orderFormId: string
    items: Array<{ id: string }>
  }
}

interface Props {
  /* How the list of bindings is rendered */
  layout: 'dropwdown' | 'list' | 'select'
  /* How we display each binding */
  display: FlagDisplay
}

const BindingSelectorBlock: FC<Props> = ({
  layout = 'dropdown',
  display = 'text',
}) => {
  const {
    data: { currentBinding, bindingList, bindingsError, loadingBindings },
    actions: { setCurrentBindingInfo },
  } = useBinding()

  const [HasRunSyncEffect, setHasRunSyncEffect] = useState(false)
  const [salesChannel, setSalesChannel] = useState('')
  const {
    route: {
      pageContext: { id, type },
      queryString,
    },
  } = useRuntime()

  const { updateQuantity } = useOrderItems()

  const queryVariables = {
    id: type === 'route' ? transformUserRouteId(id) : id,
    type: type === 'route' ? 'userRoute' : type,
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

  /**
   * @todo We are using this query only because the order-manager doesn't
   * expose the salesChannel. If we make a PR to checkout-graphql to add it
   * we could dispose of this query to avoid waiting for the block to render
   */
  const {
    data: orderFormResponse,
    loading: loadingOrderForm,
    error: orderFormError,
  } = useQuery<GetOrderFormResponse>(getOrderForm, {
    ssr: false,
  })

  const [loadingRedirect, setLoadingRedirect] = useState<boolean>(false)

  const { data: toogleSalesChannel } = useQuery<SalesChannelResponse>(
    shouldUpdateSalesChannel,
    {
      ssr: false,
    }
  )

  /**
   * This effect handles the redirect after user selects a new binding.
   * We are handling it here because we couldn't get the hreflang inside the handleSelection method, since the callback from useLazyCallback returns void
   */
  useEffect(() => {
    const { canonicalBaseAddress } = currentBinding
    const { hostname, protocol, hash } = window.location
    let path = ''

    // eslint-disable-next-line vtex/prefer-early-return
    if (hrefAltData) {
      const { routes = [] } = hrefAltData.internal

      path = getMatchRoute({ routes, currentBindingId: currentBinding.id })

      const keepSalesChannel = !toogleSalesChannel?.isSalesChannelUpdate

      const { channel } = JSON.parse(atob(window.__RUNTIME__.segmentToken))

      const urlToRedirect = createRedirectUrl({
        canonicalBaseAddress,
        hostname,
        protocol,
        path,
        hash,
        pageType: id,
        keepSalesChannel,
        /**
         * We try to use the salesChannel set on state, but the first load
         * will not have it - we trust that segmentToken on runtime will be right.
         * See more details in the useEffect below.
         */
        salesChannel: salesChannel || channel,
      })

      console.info(`Redirecting to ${urlToRedirect}`)

      window.location.href = urlToRedirect
    }
  }, [hrefAltData, currentBinding, id, toogleSalesChannel, salesChannel])

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
    currentBinding,
    toogleSalesChannel,
    updateSalesChannel,
    updateQuantity,
    HasRunSyncEffect,
    orderFormResponse,
  ])

  /**
   * This effect sets the target sales channel after the user changes binding
   * for the first time. This allows the user to change to a different binding multiple
   * times wihtout losing reference from the first one visited. It was necessary because
   * `window.__RUNTIME__.segmentToken` (for some weird reason) didn't keep sync'ed with the
   * sales channel in the session cookie.
   */
  useEffect(() => {
    if (queryString?.sc && !salesChannel) {
      setSalesChannel(queryString.sc)
    }
  }, [queryString, salesChannel])

  const handleSelection = async (
    selectedBinding: TranslationsAndSettings
  ): Promise<void> => {
    setLoadingRedirect(true)
    setCurrentBindingInfo(selectedBinding.id)

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

  const noBinding = !loadingBindings && !loadingOrderForm && !currentBinding.id

  const hasError = !!orderFormError || !!bindingsError

  if (hasError) {
    console.error('Error loading Binding Selector', {
      orderFormError,
      bindingsError,
    })

    return null
  }

  if (noBinding) {
    console.warn('No Binding assigned to the current Binding')

    return null
  }

  if (layout === 'list') {
    return (
      <BindingSelectorList
        bindingList={bindingList}
        currentBinding={currentBinding}
        onSelectBinding={handleSelection}
        display={display}
        /* Don't want to check for loadingRedirect */
        isLoading={loadingBindings || loadingOrderForm || !currentBinding.id}
      />
    )
  }

  if (layout === 'select') {
    if (display === 'combined' || display === 'flag') {
      console.error(
        'Binding selector: Native HTML <select> tag cannot render flags as options, please choose a different layout'
      )
    }

    return (
      <BindingSelectorSelect
        bindingList={bindingList}
        currentBinding={currentBinding}
        onSelectBinding={handleSelection}
        isLoading={isLoading}
      />
    )
  }

  return (
    <BindingSelectorDropdown
      bindingInfo={bindingList}
      currentBinding={currentBinding}
      onSelectBinding={handleSelection}
      isLoading={isLoading}
      display={display}
    />
  )
}

export default BindingSelectorBlock
