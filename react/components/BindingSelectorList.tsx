import React, { useState } from 'react'
import type { FC } from 'react'
import { Button, ButtonGroup } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { getLabel } from './LabelsFlags'

const CSS_HANDLES = ['listContainer'] as const

interface Props {
  bindingList: TranslationsAndSettings[]
  onSelectBinding: (selectedBinding: TranslationsAndSettings) => void
  currentBinding: TranslationsAndSettings
  display: string
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
    .map((binding) => (
      <Button
        key={binding.id}
        disabled={binding.id === currentBinding.id}
        isLoading={(loading && binding.id === currentBinding.id) || isLoading}
        onClick={() => {
          onSelectBinding(binding)
          setLoading(true)
        }}
      >
        {getLabel(binding, display)}
      </Button>
    ))

  return (
    <div className={`${handles.listContainer}`}>
      <ButtonGroup buttons={mappedBindings} />
    </div>
  )
}

export default BindingSelectorList
