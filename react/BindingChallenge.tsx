import React, { useState, useEffect } from 'react'
import { ButtonWithIcon, IconClose } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'

import { useBinding } from './hooks/useBindings'
import BindingSelectorBlock from './BindingSelectorBlock'

const close = <IconClose />

const CSS_HANDLES = ['challengeBar', 'actionCTA', 'actionContainer'] as const

interface Props {
  barText: string
}

const BindingChallenge = ({ barText }: Props) => {
  const [show, setDisplay] = useState(false)
  const [viewerCountry, setViewerCountry] = useState<string | null>(null)
  const handles = useCssHandles(CSS_HANDLES)
  const { device } = useDevice()

  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  useEffect(() => {
    async function fetchViewerCountry() {
      try {
        const response = await fetch(`/_v/binding-selector/viewer-country`)
        const countryISO = await response.text()

        !countryISO || setViewerCountry(countryISO)
      } catch (e) {
        console.error(e)
      }
    }

    fetchViewerCountry()
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
  }, [currentBinding, viewerCountry])

  const handleActionBar = () => {
    localStorage.setItem('hasShownBindingBar', 'true')
    setDisplay(false)
  }

  const text = barText || (
    <FormattedMessage id="store/challenge-bar.action-text" />
  )

  const shouldShowActionBar =
    show && !bindingsError && !loadingBindings && currentBinding.id

  if (!shouldShowActionBar) {
    return null
  }

  return (
    <div
      className={`${
        handles.challengeBar
      } flex items-center justify-center shadow-active w-100 bg-base pa4 tc ${
        device === 'phone' ? 'flex-column' : ''
      }`}
    >
      <span
        className={`${handles.actionCTA} t-small ${
          device === 'phone' ? 'pb3' : ''
        }`}
      >
        {text}
      </span>
      <div className={`${handles.actionContainer} flex`}>
        <span className="mh5 w-10" style={{ width: 180 }}>
          <BindingSelectorBlock layout="select" display="text" redirectPage="home"/>
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
    </div>
  )
}

BindingChallenge.schema = {
  title: 'admin/editor.challenge-bar.title',
  type: 'object',
  properties: {
    barText: {
      title: 'admin/editor.challenge-bar.barText.title',
      type: 'string',
    },
  },
}

export default BindingChallenge
