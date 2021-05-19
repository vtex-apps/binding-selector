import type { FC, SyntheticEvent } from 'react'
import React, { useState } from 'react'
import { Input, Checkbox } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

interface DataLocaleTypes {
  [key: string]: string
}

interface FieldInputProps {
  binding: Binding
  dataLocales: DataLocaleTypes
  handleChange: (e: SyntheticEvent) => void
  showBindings: { [key: string]: boolean }
  showEditValue: BindingTranslation[]
  showValue: boolean
}

const FieldInput: FC<FieldInputProps> = (props: FieldInputProps) => {
  const { binding, dataLocales, handleChange, showBindings, showValue } = props

  const [hide, setHide] = useState(false)

  const label =
    dataLocales[binding.id] && showValue ? dataLocales[binding.id] : ''

  return (
    <div className="flex items-center justify-center w-100">
      <div className="pa4 w-40">
        <label>
          {binding.canonicalBaseAddress} ({binding.defaultLocale})
        </label>
      </div>
      <div className="pa4 w-50 flex items-center">
        <Input
          disabled={!showBindings[binding.id] || hide}
          required={showBindings[binding.id] || !hide}
          name={binding.id}
          onChange={(e: SyntheticEvent) => handleChange(e)}
          value={label}
        />
        <div className="ml3 flex items-center">
          <Checkbox
            disabled={!showBindings[binding.id]}
            id={`hide-label-${binding.id}`}
            checked={hide}
            onChange={() => setHide(!hide)}
          />
          <label htmlFor={`hide-label-${binding.id}`} className="ml3">
            <FormattedMessage id="hide-label" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default FieldInput
