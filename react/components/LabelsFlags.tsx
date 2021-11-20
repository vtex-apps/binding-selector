import React from 'react'
import { CountryFlag } from 'vtex.country-flags'

export const getLabel = (binding: TranslationsAndSettings, display: string) => {
  const locale = binding.defaultLocale.substr(3, 2).toUpperCase()

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
