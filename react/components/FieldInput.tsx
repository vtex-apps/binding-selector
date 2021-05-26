import type { FC, SyntheticEvent } from 'react'
import React from 'react'
import { Input, Checkbox } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

interface FieldInputProps {
  binding: Binding
  handleChange: (e: SyntheticEvent) => void
  showValue: boolean
  translationInfo: BindingTranslation
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
    handleChange,
    showValue,
    handleHideLabel,
    translationInfo,
  } = props

  return (
    <div className="flex items-center justify-center w-100">
      <div className="pa4 w-40">
        <label>
          {binding.canonicalBaseAddress} ({binding.defaultLocale})
        </label>
      </div>
      <div className="pa4 w-50 flex items-center">
        <Input
          disabled={!showValue || translationInfo.hide}
          required={showValue || !translationInfo.hide}
          name={binding.id}
          onChange={(e: SyntheticEvent) => handleChange(e)}
          value={translationInfo.label}
        />
        <div className="ml3 flex items-center">
          <Checkbox
            disabled={!showValue}
            id={`hide-label-${binding.id}`}
            checked={!!translationInfo.hide}
            onChange={() =>
              handleHideLabel({
                status: !translationInfo.hide,
                bindingId: binding.id,
              })
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
