import React from 'react'
import type { FC } from 'react'

import { useBinding } from './hooks/useBindings'
import Spinner from './components/Spinner'
import { getLabel } from './components/LabelsFlags'

interface Props {
  /* How we display the current binding */
  display: Display
}

const CurrentBinding: FC<Props> = ({ display = 'text' }) => {
  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  const isLoading = loadingBindings

  const noBinding = !isLoading && !currentBinding.id

  const hasError = !!bindingsError

  if (hasError) {
    console.error('Error loading Current Binding', {
      bindingsError,
    })
  }

  if (noBinding) {
    return null
  }

  return hasError ? null : (
    <div className="flex items-center justify-center h-100 mh4">
      {isLoading ? (
        <Spinner />
      ) : (
        <span>{getLabel(currentBinding, display)}</span>
      )}
    </div>
  )
}

export default CurrentBinding
