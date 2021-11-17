import React from 'react'
import type { FC } from 'react'
import { Button, ButtonGroup } from 'vtex.styleguide'
import { CountryFlag } from 'vtex.country-flags'

interface Props {
  bindingList: TranslationsAndSettings[]
  onSelectBinding: (selectedBinding: TranslationsAndSettings) => void
  currentBinding: string
  display: string
}

const getLabel = (binding: TranslationsAndSettings, display: string) => {
  const locale = binding.defaultLocale.substr(0, 2).toUpperCase()

  if (display === 'flags') {
    return <CountryFlag iso2={locale} />
  }

  if (display === 'combined') {
    return (
      <>
        <CountryFlag iso2={locale} />
        <span className="ml3">{binding.label}</span>
      </>
    )
  }

  return binding.label
}

const ButtonList: FC<Props> = ({
  bindingList,
  onSelectBinding,
  currentBinding,
  display,
}) => {
  const mappedBindings = bindingList
    .filter((binding) => {
      return !binding.hide
    })
    .map((binding) => (
      <Button
        key={binding.id}
        disabled={binding.id === currentBinding}
        size="small"
        onClick={() => onSelectBinding(binding)}
      >
        {getLabel(binding, display)}
      </Button>
    ))

  return (
    <div className="ma7">
      <ButtonGroup buttons={mappedBindings} />
    </div>
  )
}

export default ButtonList
