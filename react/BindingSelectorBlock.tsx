import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderItemsProvider, useOrderItems } from 'vtex.order-items/OrderItems'

import BindingSelectorList from './components/BindingSelectorList'
import getSalesChannel from './graphql/getSalesChannel.gql'
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
  const [bindingInfo, setBindingInfo] = useState<FilteredBinding[]>([])
  const { binding: runtimeBinding } = useRuntime()
  const {
    error: tenantError,
    data: tenantData,
    loading: loadingTenantInfo,
  } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const { addItem } = useOrderItems()

  const {
    error: orderFormError,
    loading: loadingOrderForm,
    orderForm,
    setOrderForm,
  } = useOrderForm()

  // eslint-disable-next-line no-console
  console.log({ orderForm })

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

  const handleClick = () => {
    setOpen(!open)
  }

  const handleSelection = (selectedBinding: FilteredBinding): void => {
    setCurrentBiding(selectedBinding)
    fetch(
      // `/api/checkout/pub/orderForm/${orderForm.id}`,
      `/api/checkout/pub/orderForm/${orderForm.id}/attachments/clientPreferencesData?sc=${selectedBinding.salesChannel}`,
      {
        method: 'POST',
        body: JSON.stringify({
          locale: selectedBinding.label,
          optinNewsLetter:
            orderForm.clientPreferencesData.optInNewsletter ?? false,
        }),
      }
    )
      .then((r) => r.json())
      .then((orderResponse) => {
        setOrderForm({
          clientPreferencesData: {
            locale: selectedBinding.label,
            optinNewsLetter:
              orderForm.clientPreferencesData.optInNewsletter ?? false,
          },
        })
        // eslint-disable-next-line no-console
        console.log({ orderResponse })

        // const { storePreferencesData } = orderResponse
        // const updateStorePreference = {
        //   ...storePreferencesData,
        //   ...{ currencyCode: selectedBinding.defaultCurrency },
        // }
        addItem(orderResponse.items, null, selectedBinding.salesChannel)
        window.location.search = '?__bindingAddress=b2c.powerplanet.com/pt'
        // navigate({  to: '/?__bindingAddress=b2c.powerplanet.com/pt' })
        // return fetch(
        //   `/api/checkout/pub/orderForm/${orderForm.id}/attachments/storePreferencesData`,
        //   {
        //     method: 'POST',
        //     body: JSON.stringify(updateStorePreference),
        //   }
        // )
      })
    // eslint-disable-next-line no-console
    console.log('id', orderForm, 'sales', selectedBinding.salesChannel)
    setOpen(false)
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
      <OrderItemsProvider>
        <BindingSelectorBlock />
      </OrderItemsProvider>
    </OrderFormProvider>
  )
}

export default BindingSelectorBlockWrapper
