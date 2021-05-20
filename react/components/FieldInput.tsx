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
  showValue: boolean
  hiddenLabel: boolean
  handleHideLabel: ({
    bindingId,
    status,
  }: {
    bindingId: string
    status: boolean
  }) => void
}

const FieldInput: FC<FieldInputProps> = (props: FieldInputProps) => {
  const {
    binding,
    dataLocales,
    handleChange,
    showValue,
    hiddenLabel,
    handleHideLabel,
  } = props

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
          disabled={!showValue || hiddenLabel}
          required={showValue || !hiddenLabel}
          name={binding.id}
          onChange={(e: SyntheticEvent) => handleChange(e)}
          value={label}
        />
        <div className="ml3 flex items-center">
          <Checkbox
            disabled={!showValue}
            id={`hide-label-${binding.id}`}
            checked={hiddenLabel}
            onChange={() =>
              handleHideLabel({ status: !hiddenLabel, bindingId: binding.id })
            }
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
