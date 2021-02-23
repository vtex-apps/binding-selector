import type { FC, SyntheticEvent } from 'react'
import React from 'react'
import { Input } from 'vtex.styleguide'

interface DataLocaleTypes {
  [key: string]: string
}

interface FieldInputProps {
  binding: Binding
  dataLocales: DataLocaleTypes
  handleChange: (e: SyntheticEvent) => void
  key: number
  showBindings: { [key: string]: boolean }
  showEditValue: FilteredBinding[]
  showValue: boolean
}

const FieldInput: FC<FieldInputProps> = (props: FieldInputProps) => {
  const {
    binding,
    dataLocales,
    handleChange,
    key,
    showBindings,
    showValue,
  } = props

  const label =
    dataLocales[binding.id] && showValue ? dataLocales[binding.id] : ''

  return (
    <div key={key} className="flex items-center justify-center w-100">
      <div className="pa4 w-40">
        <label>
          {binding.canonicalBaseAddress} ({binding.defaultLocale})
        </label>
      </div>
      <div className="pa4 w-50">
        <Input
          disabled={!showBindings[binding.id]}
          required={showBindings[binding.id]}
          name={binding.id}
          onChange={(e: SyntheticEvent) => handleChange(e)}
          value={label}
        />
      </div>
    </div>
  )
}

export default FieldInput
