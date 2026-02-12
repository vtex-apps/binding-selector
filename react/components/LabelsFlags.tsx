import React from 'react'
import { useIntl } from 'react-intl'
import { CountryFlag } from 'vtex.country-flags'

interface Props {
  binding: TranslationsAndSettings
  display: FlagDisplay
  flag: CustomFlagData | null
}

const LabelOption = ({ binding, display, flag }: Props) => {
  const intl = useIntl()
  const locale = binding.defaultLocale.substring(3, 5).toUpperCase()

  const flagAltText = intl.formatMessage({ id: 'store/flag.alt-text' })

  const flagToDisplay = () =>
    flag?.isCustom && flag.url ? (
      <img
        src={flag.url}
        alt={flagAltText}
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

  return <span>{binding.label}</span>
}

export default LabelOption
