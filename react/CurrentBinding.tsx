import React from 'react'
import type { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useBinding } from './hooks/useBindings'
import Spinner from './components/Spinner'
import { getLabel } from './components/LabelsFlags'

const CSS_HANDLES = ['currentBinding'] as const

interface Props {
  /* How we display the current binding */
  display: Display
}

const CurrentBinding: FC<Props> = ({ display = 'text' }) => {
  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  const handles = useCssHandles(CSS_HANDLES)

  const isLoading = loadingBindings

  const noBinding = !isLoading && !currentBinding.id

  const hasError = !!bindingsError

  if (hasError) {
    console.error('Error loading current Binding', {
      bindingsError,
    })

    return null
  }

  if (noBinding) {
    console.warn('No Binding assigned to the current Binding', {
      bindingsError,
    })

    return null
  }

  return (
    <div
      className={`${handles.currentBinding} flex items-center justify-center h-100 mh4`}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span>{getLabel(currentBinding, display)}</span>
      )}
    </div>
  )
}

export default CurrentBinding
