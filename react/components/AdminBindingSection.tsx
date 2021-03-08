import React, { useState } from 'react'
import type { FC, SyntheticEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Toggle, Button, Divider, Collapsible, Input } from 'vtex.styleguide'

export interface BindingSectionProps {
  modalControl: (modalOpen: boolean) => void
  modalOpen: boolean
  setChosenBinding: (binding: Binding) => void
  showBindings: { [key: string]: boolean }
  setShowBindings: (id: string) => void
}

interface BindingSectionPropsLocal extends BindingSectionProps {
  i: number
  binding: Binding
}

const AdminBindingSection: FC<BindingSectionPropsLocal> = ({
  binding,
  modalControl,
  modalOpen,
  setChosenBinding,
  showBindings,
  setShowBindings,
  i,
}) => {
  const [showAdvConfig, setShowAdvConfig] = useState(false)
  const [showRedirectUrl, setshowRedirectUrl] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')

  const handleChange = (event: SyntheticEvent) => {
    setRedirectUrl((event.currentTarget as HTMLInputElement).value)
  }

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log(redirectUrl)
  }

  return (
    <>
      <section key={binding.id} className="flex items-center justify-between">
        <div className="flex-grow-1 flex-basis-33">
          <p>
            <FormattedMessage
              id="admin-store"
              values={{
                index: i + 1,
                address: binding.canonicalBaseAddress,
              }}
            />
          </p>
          <p>
            <FormattedMessage
              id="admin-locale"
              values={{ locale: binding.defaultLocale }}
            />
          </p>
        </div>
        <div className="flex-grow-1 flex justify-left">
          <Toggle
            checked={showBindings[binding.id]}
            label={
              showBindings[binding.id] ? (
                <FormattedMessage id="admin-hide-binding" />
              ) : (
                <FormattedMessage id="admin-show-binding" />
              )
            }
            onChange={() => setShowBindings(binding.id)}
          />
        </div>
        <div>
          <Button
            disabled={!showBindings[binding.id]}
            onClick={() => {
              modalControl(!modalOpen)
              setChosenBinding(binding)
            }}
          >
            <FormattedMessage id="admin-action" />
          </Button>
        </div>
      </section>
      <Collapsible
        header={
          <span className="c-action-primary hover-c-action-primary fw5">
            Advanced settings
          </span>
        }
        isOpen={showAdvConfig}
        onClick={() => setShowAdvConfig(!showAdvConfig)}
      >
        <div className="mt4">
          <Toggle
            checked={showRedirectUrl}
            label="Set Redirect URL"
            onChange={() => setshowRedirectUrl(!showRedirectUrl)}
          />
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="mv5 width-70">
              <Input
                value={redirectUrl}
                disabled={!showRedirectUrl}
                placeholder="Redirect URL"
                onChange={handleChange}
              />
            </div>
            <div className="ml5">
              <Button disabled={!redirectUrl}>Save URL</Button>
            </div>
          </form>
        </div>
      </Collapsible>
      <div className="mt5">
        <Divider orientation="horizontal" />
      </div>
    </>
  )
}

export default AdminBindingSection
