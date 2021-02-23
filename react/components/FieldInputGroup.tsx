import type { FC } from 'react'
import React from 'react'

import FieldInput from './FieldInput'

interface FieldInputGroupProps {
  bindings: Binding[]
  showBindings: { [key: string]: boolean }
  bindingInfoQueryData: BindingsSaved[]
  handleChange: (event: SyntheticEvent) => void
  dataLocales: DataLocaleTypes
  translatedLocales: InfoBinding[]
}

const FieldInputGroup: FC<FieldInputGroupProps> = ({
  bindings,
  bindingInfoQueryData,
  dataLocales,
  handleChange,
  showBindings,
  translatedLocales,
}) => {
  bindings
    ?.filter((binding: Binding) => {
      return binding.canonicalBaseAddress.split('/')[1] !== 'admin'
    })
    .map((binding: Binding, i: number) => {
      const [showBinding] =
        bindingInfoQueryData.filter((bind) => bind.bindingId === binding.id) ??
        []

      const showValue = showBinding?.show

      return (
        <FieldInput
          binding={binding}
          dataLocales={dataLocales}
          handleChange={handleChange}
          key={i}
          showBindings={showBindings}
          showEditValue={translatedLocales ?? []}
          showValue={showValue}
        />
      )
    })
}

export default FieldInputGroup
