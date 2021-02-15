/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react'
// import { withApollo, compose, graphql } from 'react-apollo'
import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime, canUseDOM } from 'vtex.render-runtime'
import { useQuery, useMutation, useLazyQuery } from 'react-apollo'
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'

import BindingSelectorList from './components/BindingSelectorList'
import getSalesChannel from './graphql/getSalesChannel.gql'
import updateSalesChannelMutation from './graphql/updateSalesChannel.gql'
import alternateHrefsQuery from './graphql/alternateHrefs.gql'
import { filterBindings } from './utils'

const CSS_HANDLES = [
  'container',
  'relativeContainer',
  'button',
  'buttonTextClasses',
] as const

const BindingSelectorBlock: FC = () => {
  const [currentBinding, setCurrentBiding] = useState<FilteredBinding>(
    {} as FilteredBinding
  )

  const [open, setOpen] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)
  // @ts-expect-error routes not typed in useRuntime
  const { route: { pageContext: { id, type }} } = useRuntime()

  const queryVariables = {
    id,
    type,
  }

  // eslint-disable-next-line no-console
  const [getAlternateHrefs, { data }] = useLazyQuery(alternateHrefsQuery, {
    variables: queryVariables,
  })

  const [bindingInfo, setBindingInfo] = useState<FilteredBinding[]>([])
  const { binding: runtimeBinding } = useRuntime()
  const {
    error: tenantError,
    data: tenantData,
    loading: loadingTenantInfo,
  } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const [updateSalesChannel] = useMutation<
    { updateSalesChannel: { orderFormId: string } },
    UpdateSalesChannelVariables
  >(updateSalesChannelMutation)

  const {
    error: orderFormError,
    loading: loadingOrderForm,
    orderForm,
  } = useOrderForm()

  useEffect(() => {
    if (tenantData) {
      const filteredBindings = filterBindings(tenantData.tenantInfo)

      setBindingInfo(filteredBindings)
    }
  }, [tenantData])

  useEffect(() => {
    if (runtimeBinding?.id) {
      const findBinding = bindingInfo.find(({ id }) => id === runtimeBinding.id)

      if (findBinding) {
        setCurrentBiding(findBinding)
      }
    }
  }, [bindingInfo, runtimeBinding])

  useEffect(() => {
    // This will not yet work for home page. Will retrieve the base url from tenant.
    console.log('dataHrefs', data?.internal?.routes)
  }, [data])

  const handleClick = () => {
    setOpen(!open)
  }

  const handleSelection = async (
    selectedBinding: FilteredBinding
  ): Promise<void> => {
    getAlternateHrefs()
    setCurrentBiding(selectedBinding)
    setOpen(false)
    try {
      await updateSalesChannel({
        variables: {
          orderFormId: orderForm.id,
          salesChannel: selectedBinding.salesChannel,
          locale: selectedBinding.label,
        },
      })
      // only works for Power Planet homepage. Need to be update when we get the right binding url and hreflang
      window.location.search = `?__bindingAddress=b2c.powerplanet.com/${selectedBinding.label.slice(
        0,
        2
      )}`
    } catch (e) {
      // How to handle when there is an error updating sales channel?
      console.error(e)
    }
  }

  const isLoading = loadingTenantInfo || loadingOrderForm || !currentBinding.id
  const hasError = !!orderFormError || !!tenantError

  if (hasError) {
    console.error('Error loading Binding Selector', {
      orderFormError,
      tenantError,
    })
  }

  return hasError ? null : (
    <div
      className={`${handles.container} flex items-center justify-center w3 relative`}
    >
      <div
        className={`${handles.relativeContainer} relative flex justify-center`}
      >
        {isLoading ? null : (
          <>
            <button
              type="button"
              onClick={handleClick}
              className={`${handles.button} link pa3 bg-transparent bn flex items-center pointer c-on-base`}
            >
              <span className={`${handles.buttonTextClasses}`}>
                {currentBinding.label}
              </span>
            </button>
            <BindingSelectorList
              open={open}
              currentBinding={currentBinding}
              bindingInfo={bindingInfo}
              onSelectBinding={handleSelection}
            />
          </>
        )}
      </div>
    </div>
  )
}

const BindingSelectorBlockWrapper = () => {
  return (
    <OrderFormProvider>
      <BindingSelectorBlock />
    </OrderFormProvider>
  )
}

export default BindingSelectorBlockWrapper
