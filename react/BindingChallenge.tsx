import React, { useState, useEffect } from 'react'
import { ButtonWithIcon, IconClose } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useBinding } from './hooks/useBindings'
import BindingSelectorBlock from './BindingSelectorBlock'

const close = <IconClose />

interface Props {
  barText: string
}

const BindingChallenge = ({ barText }: Props) => {
  const [show, setDisplay] = useState(false)
  const [viewerCountry, setViewerCountry] = useState<string | null>(null)

  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  useEffect(() => {
    fetch('/_v/binding-selector/viewer-country').then((response) =>
      response.text().then((countryISO: string | null) => {
        !countryISO || setViewerCountry(countryISO)
      })
    )
  }, [])

  useEffect(() => {
    if (!viewerCountry || !currentBinding.defaultLocale) {
      return
    }

    if (localStorage.getItem('hasShownBindingBar') === 'true') {
      return
    }

    /* viewer country is ISO2
    so we compare the last 2 digits of the locale
    i.e es-ES === ES
    */
    const bindingLocale = currentBinding.defaultLocale
      ?.substr(3, 2)
      .toUpperCase()

    if (viewerCountry === bindingLocale) {
      return
    }

    setDisplay(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBinding, viewerCountry])

  const handleActionBar = () => {
    localStorage.setItem('hasShownBindingBar', 'true')
    setDisplay(false)
  }

  const text = barText || (
    <FormattedMessage id="store/binding-bar.action-text" />
  )

  const shouldShowActionBar =
    show && !bindingsError && !loadingBindings && currentBinding.id

  if (!shouldShowActionBar) {
    return null
  }

  return (
    <div className="flex items-center justify-center shadow-active w-100 bg-base pa4 tc">
      <span>{text}</span>
      <span className="mh5 w-10">
        <BindingSelectorBlock layout="selector" display="text" />
      </span>
      <span>
        <ButtonWithIcon
          size="small"
          icon={close}
          variation="tertiary"
          onClick={() => {
            handleActionBar()
          }}
        />
      </span>
    </div>
  )
}

BindingChallenge.schema = {
  title: 'admin/editor.binding-bar.title',
  description: 'admin/editor.binding-bar.description',
  type: 'object',
  properties: {
    barText: {
      title: 'admin/editor.binding-bar.barText.title',
      type: 'string',
    },
  },
}

export default BindingChallenge
