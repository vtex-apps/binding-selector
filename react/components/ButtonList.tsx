import React, { useState } from 'react'
import type { FC } from 'react'
import { Button, ButtonGroup } from 'vtex.styleguide'

import { getLabel } from './LabelsFlags'

interface Props {
  bindingList: TranslationsAndSettings[]
  onSelectBinding: (selectedBinding: TranslationsAndSettings) => void
  currentBinding: string
  display: string
}

const ButtonList: FC<Props> = ({
  bindingList,
  onSelectBinding,
  currentBinding,
  display,
}) => {
  const [loading, setLoading] = useState(false)

  const mappedBindings = bindingList
    .filter((binding) => {
      return !binding.hide
    })
    .map((binding) => (
      <Button
        key={binding.id}
        disabled={binding.id === currentBinding}
        isLoading={loading && binding.id === currentBinding}
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

export default ButtonList
