import type { SyntheticEvent } from 'react'
import React from 'react'

import FieldInput from './FieldInput'

const AdminBindingLabelsList = ({
  bindings = [],
  activeBindings,
  ...props
}: {
  bindings: Binding[]
  activeBindings: Record<string, boolean>
  dataLocales: Record<string, string>
  handleChange: (e: SyntheticEvent) => void
}) => {
  return (
    <>
      {bindings.map((binding) => {
        return (
          <FieldInput
            key={binding.id}
            binding={binding}
            showValue={activeBindings[binding.id]}
            {...props}
          />
        )
      })}
    </>
  )
}

export default AdminBindingLabelsList
