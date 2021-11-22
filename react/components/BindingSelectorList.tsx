import React, { useState } from 'react'
import type { FC } from 'react'
import { Button, ButtonGroup } from 'vtex.styleguide'

import { getLabel } from './LabelsFlags'

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
    <div>
      <ButtonGroup buttons={mappedBindings} />
    </div>
  )
}

export default BindingSelectorList
