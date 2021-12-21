import React from 'react'
import type { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useBinding } from './hooks/useBindings'
import Spinner from './components/Spinner'
import { renderBinding } from './components/LabelsFlags'

const CSS_HANDLES = ['currentBinding'] as const

interface Props {
  /* How we display the current binding */
  display: FlagDisplay
}

/**
 * @returns an icon or string showing which is
 * the current binding, useful as a modal-trigger
 */
const CurrentBinding: FC<Props> = ({ display = 'text' }) => {
  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  const handles = useCssHandles(CSS_HANDLES)
  const noBinding = !loadingBindings && !currentBinding.id
  const hasError = !!bindingsError
  const flag = currentBinding.customFlagData

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
      {loadingBindings ? (
        <Spinner />
      ) : (
        <>
          {flag?.isCustom && flag.url ? (
            <img
              src={flag.url}
              alt="A flag of the binding's locale"
              width="24"
              height="24"
              style={{ maxWidth: 24, maxHeight: 24 }}
            />
          ) : (
            renderBinding(currentBinding, display)
          )}
        </>
      )}
    </div>
  )
}

export default CurrentBinding
