import type { FC, FormEvent, SyntheticEvent } from 'react'
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
  showEditValue: InfoBinding[]
  showEdit: boolean
  showBinding: BindingsSaved
}

const FieldInput: FC<FieldInputProps> = (props: FieldInputProps) => {
  const {
    binding,
    dataLocales,
    handleChange,
    key,
    showBindings,
    showEditValue,
    showEdit,
    showBinding,
  } = props

  const labelText = showBinding?.translatedLocales?.filter(
    (bind) => bind.id === binding.id
  )[0]?.label

  const initialValue = labelText ? labelText : ''
  console.log('binding', labelText)
  // console.log('hello', dataLocales)
  // console.log(dataLocales[binding.id])

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
          value={initialValue || dataLocales[binding.id]}
        />
      </div>
    </div>
  )
}

export default FieldInput
