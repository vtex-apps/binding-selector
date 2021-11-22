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
  const [viewerCountry] = useState('')

  const {
    data: { currentBinding, bindingList, bindingsError, loadingBindings },
    actions: { setCurrentBindingInfo },
  } = useBinding()

  const [desiredBinding, setDesiredBinding] = useState(currentBinding.id)

  const bindingLocale = currentBinding?.defaultLocale
    ?.substr(3, 2)
    .toUpperCase()

  /* useEffect(() => {
    fetch('/_v/viewer-country').then((response) =>
      response.json().then((data) => console.log(data))
    )
  }, []) */

  useEffect(() => {
    if (localStorage.getItem('hasShownBindingBar') === 'true') {
      return
    }

    if (viewerCountry === bindingLocale) {
      return
    }

    setDisplay(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBinding])

  const handleActionBar = () => {
    localStorage.setItem('hasShownBindingBar', 'true')
    setDisplay(false)
  }

  const handleSelection = (id: string) => {
    setDesiredBinding(id)
  }

  const text = barText || (
    <FormattedMessage id="store/binding-bar.action-text" />
  )

  /* We calculate if a floating action bar, explaining that
  your current binding != current country, should be rendered */
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
