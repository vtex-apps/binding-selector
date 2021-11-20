import React, { useState, useEffect } from 'react'
import { ButtonGroup, Button, ButtonWithIcon, IconClose } from 'vtex.styleguide'

import { useBinding } from './hooks/useBindings'

const close = <IconClose />

const BindingChallenge = () => {
  const [show, setDisplay] = useState(true)

  const {
    data: { currentBinding, bindingsError, loadingBindings },
  } = useBinding()

  /* We calculate if a floating action bar, explaining that
  your current binding != current country, should be rendered */
  const shouldShowActionBar = show && !bindingsError && !loadingBindings

  return (
    shouldShowActionBar && (
      <div className="flex items-center justify-center shadow-active w-100 bg-base pa5 tc">
        <span>
          BINDING ACTION BAR - You are browsing in <b>{currentBinding.label}</b>{' '}
          you can continue or choose a different Region
        </span>
        <span className="ml5">
          <ButtonGroup
            buttons={[
              <Button
                key={1}
                size="small"
                isActiveOfGroup
                variation="primary"
                onClick={() => setDisplay(false)}
              >
                Continue
              </Button>,
              <ButtonWithIcon
                key={2}
                size="small"
                icon={close}
                variation="tertiary"
                onClick={() => setDisplay(false)}
              />,
            ]}
          />
        </span>
      </div>
    )
  )
}

export default BindingChallenge
