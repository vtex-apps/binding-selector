import React from 'react'
import { CountryFlag } from 'vtex.country-flags'

/**
 * @param display controls how the binding is shown, possible
 * values are 'text' for only the binding label, 'flag' for only
 * the flag icon and 'combined' for both
 * @returns JSX.Element | string - How the binding will be rendered
 */
export const renderBinding = (
  binding: TranslationsAndSettings,
  display: FlagDisplay
) => {
  const locale = binding.defaultLocale.substring(3, 5).toUpperCase()

  if (display === 'flag') {
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
