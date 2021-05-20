import type { SyntheticEvent } from 'react'
import React from 'react'

import FieldInput from './FieldInput'

const AdminBindingLabelsList = ({
  bindings = [],
  activeBindings,
  hiddenLabels,
  ...props
}: {
  bindings: Binding[]
  activeBindings: Record<string, boolean>
  hiddenLabels: Record<string, boolean>
  dataLocales: Record<string, string>
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
            hiddenLabel={!!hiddenLabels[binding.id]}
            {...props}
          />
        )
      })}
    </>
  )
}

export default AdminBindingLabelsList
