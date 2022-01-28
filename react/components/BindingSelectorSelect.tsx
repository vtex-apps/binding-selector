import React, { useState, useEffect } from 'react'
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
  const [currentBindingId, setCurrentBindingId] = useState(currentBinding.id)

  useEffect(() => {
    setCurrentBindingId(currentBinding.id)
  }, [currentBinding.id])

  /* memoize it */
  const bindings = bindingList.map((binding) => {
    return { label: binding.label, value: binding.id }
  })

  /* Value of the select.
  value: PropTypes.oneOfType([OptionShape, OptionsShape]) */
  const selectedBinding = bindings.find(({ value }) => {
    return value === currentBindingId
  })

  const handleChange = (selectedBindingId: string) => {
    setCurrentBindingId(selectedBindingId)
    onSelectBinding(
      bindingList[bindingList.findIndex(({ id }) => id === selectedBindingId)]
    )
  }

  return (
    <Select
      size="small"
      options={bindings}
      value={[selectedBinding]}
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
