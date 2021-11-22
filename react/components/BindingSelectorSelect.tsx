import React, { useState } from 'react'
import { EXPERIMENTAL_Select as Select } from 'vtex.styleguide'

interface Props {
  bindingList: TranslationsAndSettings[]
  currentBinding: TranslationsAndSettings
  onSelectBinding: (selectedBinding: TranslationsAndSettings) => void
  isLoading: boolean
}

const BindingSelectorSelect = ({
  bindingList,
  currentBinding,
  onSelectBinding,
  isLoading,
}: Props) => {
  const [currentOption, setCurrentOption] = useState(currentBinding.id)

  const options = bindingList.map((binding) => {
    return { label: binding.label, value: binding.id }
  })

  const selectedOption = options.find((option) => {
    return option.value === currentOption
  })

  const handleChange = (optionValue: string) => {
    setCurrentOption(optionValue)
    onSelectBinding(
      bindingList[
        bindingList.findIndex((binding) => binding.id === optionValue)
      ]
    )
  }

  return (
    <Select
      size="small"
      options={options}
      value={[selectedOption]}
      loading={isLoading}
      multi={false}
      clearable={false}
      searchable={false}
      onChange={(e: any) => {
        handleChange(e.value)
      }}
    />
  )
}

export default BindingSelectorSelect
