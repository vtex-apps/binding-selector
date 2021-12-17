import type { SyntheticEvent } from 'react'
import React from 'react'

import FieldInput from './FieldInput'

const AdminBindingLabelsList = ({
  bindings = [],
  activeBindings,
  translationsMap,
  ...props
}: {
  bindings: Binding[]
  activeBindings: Record<string, boolean>
  translationsMap: Record<string, BindingTranslation>
  handleChange: (e: SyntheticEvent) => void
  handleHideLabel: ({
    bindingId,
    status,
  }: {
    bindingId: string
    status: boolean
  }) => void
}) => {
  return (
    <>
      {bindings.map((binding) => {
        return (
          <FieldInput
            key={binding.id}
            binding={binding}
            showValue={activeBindings[binding.id]}
            translationInfo={translationsMap[binding.id]}
            {...props}
          />
        )
      })}
    </>
  )
}

export default AdminBindingLabelsList
