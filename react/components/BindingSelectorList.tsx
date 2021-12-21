import React, { useState } from 'react'
import type { FC } from 'react'
import { Button, ButtonGroup } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { renderBinding } from './LabelsFlags'

const CSS_HANDLES = ['listContainer'] as const

interface Props {
  bindingList: TranslationsAndSettings[]
  onSelectBinding: (selectedBinding: TranslationsAndSettings) => void
  currentBinding: TranslationsAndSettings
  display: FlagDisplay
  isLoading: boolean
}

const BindingSelectorList: FC<Props> = ({
  bindingList,
  onSelectBinding,
  currentBinding,
  display,
  isLoading,
}) => {
  const [loading, setLoading] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)

  const mappedBindings = bindingList
    .filter((binding) => {
      return !binding.hide
    })
    .map((binding) => {
      const flag = binding.customFlagData

      return (
        <Button
          key={binding.id}
          disabled={binding.id === currentBinding.id}
          isLoading={(loading && binding.id === currentBinding.id) || isLoading}
          onClick={() => {
            onSelectBinding(binding)
            setLoading(true)
          }}
        >
          {flag?.isCustom && flag.url ? (
            <img
              src={flag.url}
              alt="A flag of the binding's locale"
              width="24"
              height="24"
              style={{ maxWidth: 24, maxHeight: 24 }}
            />
          ) : (
            renderBinding(binding, display)
          )}
        </Button>
      )
    })

  return (
    <div className={`${handles.listContainer}`}>
      <ButtonGroup buttons={mappedBindings} />
    </div>
  )
}

export default BindingSelectorList
