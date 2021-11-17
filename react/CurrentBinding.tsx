import React from 'react'
import type { FC } from 'react'

import { useBinding } from './hooks/useBindings'
import Spinner from './components/Spinner'

const CurrentBinding: FC = () => {
  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  const isLoading = loadingBindings || !currentBinding.id

  const hasError = !!bindingsError

  if (hasError) {
    console.error('Error loading Current Binding', {
      bindingsError,
    })
  }

  return hasError ? null : (
    <div className="flex items-center justify-center h-100 mh4">
      {isLoading ? <Spinner /> : <span>{currentBinding.label}</span>}
    </div>
  )
}

export default CurrentBinding
