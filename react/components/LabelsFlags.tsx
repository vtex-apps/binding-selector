import React from 'react'
import { CountryFlag } from 'vtex.country-flags'

interface Props {
  binding: TranslationsAndSettings
  display: FlagDisplay
  flag: CustomFlagData | null
}

const LabelOption = ({ binding, display, flag }: Props) => {
  const locale = binding.defaultLocale.substring(3, 5).toUpperCase()

  const flagToDisplay = () =>
    flag?.isCustom && flag.url ? (
      <img
        src={flag.url}
        alt="A flag of the binding's locale"
        width="24"
        height="24"
        style={{ maxWidth: 24, maxHeight: 24 }}
      />
    ) : (
      <CountryFlag iso2={locale} />
    )

  if (display === 'flag') {
    return flagToDisplay()
  }

  if (display === 'combined') {
    return (
      <>
        {flagToDisplay()}
        <span className="ml3">{binding.label}</span>
      </>
    )
  }

  return <p>{binding.label}</p>
}

export default LabelOption
