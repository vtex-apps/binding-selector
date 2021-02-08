import type { FC } from 'react'
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'

import BindingSelectorList from './components/BindingSelectorList'
import getSalesChannel from './graphql/getSalesChannel.gql'

const fakeBindingsLabel: {
  [Identifier: string]: { [Identifier: string]: string }
} = {
  'pt-BR': {
    'pt-BR': 'Brasil',
    'it-IT': 'Itália',
    'en-US': 'EUA',
  },
  'it-IT': {
    'pt-BR': 'Brasile',
    'it-IT': 'Italia',
    'en-US': 'USA',
  },
  'en-US': {
    'pt-BR': 'Brazil',
    'it-IT': 'Italy',
    'en-US': 'US',
  },
}

const CSS_HANDLES = [
  'container',
  'relativeContainer',
  'button',
  'buttonTextClasses',
] as const

const BindingSelectorBlock: FC = () => {
  const [currentBinding, setCurrentBiding] = useState<string>('pt-BR')
  const [open, setOpen] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)
  const { binding: runtimeBinding } = useRuntime()
  const {
    error: tenantError,
    data,
    loading: loadingTenantInfo,
  } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const {
    error: orderFormError,
    loading: loadingOrderForm,
    orderForm,
  } = useOrderForm()

  // eslint-disable-next-line no-console
  console.log({ orderForm })
  // eslint-disable-next-line no-console
  console.log(data)

  // eslint-disable-next-line no-console
  console.log({ runtimeBinding })

  const handleClick = () => {
    setOpen(!open)
  }

  const handleSelection = (selectedBinding: string): void => {
    setCurrentBiding(selectedBinding)
    setOpen(false)
  }

  const isLoading = loadingTenantInfo || loadingOrderForm
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
                {fakeBindingsLabel[currentBinding][currentBinding]}
              </span>
            </button>
            <BindingSelectorList
              open={open}
              currentBinding={currentBinding}
              fakeBindingsLabel={fakeBindingsLabel}
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
