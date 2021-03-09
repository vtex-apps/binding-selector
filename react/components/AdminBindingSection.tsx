import React, { useState, useEffect } from 'react'
import type { FC, SyntheticEvent, FormEvent } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Toggle, Button, Divider, Collapsible, Input } from 'vtex.styleguide'

export interface BindingSectionProps {
  modalControl: (modalOpen: boolean) => void
  modalOpen: boolean
  setChosenBinding: (binding: Binding) => void
  setShowBindings: (id: string) => void
  setSetRedirectUrl: (bindingId: string, args: ExternalRedirectData) => void
}

interface BindingSectionPropsLocal extends BindingSectionProps {
  i: number
  binding: Binding
  configSettings: BindingsSaved
}

const AdminBindingSection: FC<BindingSectionPropsLocal> = ({
  binding,
  modalControl,
  modalOpen,
  setChosenBinding,
  setShowBindings,
  setSetRedirectUrl,
  configSettings,
  i,
}) => {
  const [showAdvConfig, setShowAdvConfig] = useState(false)
  const [showRedirectUrl, setShowRedirectUrl] = useState(false)
  const [urlToRedirect, setRedirectUrl] = useState('')
  const intl = useIntl()

  useEffect(() => {
    const { externalRedirectData } = configSettings

    if (externalRedirectData) {
      const { redirectUrl, url } = externalRedirectData

      if (redirectUrl) {
        setShowRedirectUrl(redirectUrl)
        setRedirectUrl(url)

        return
      }
    }

    setShowRedirectUrl(false)
    setRedirectUrl('')
  }, [configSettings, showAdvConfig])

  const handleShowRedirectToggle = () => {
    setShowRedirectUrl(!showRedirectUrl)
    if (showRedirectUrl) {
      setSetRedirectUrl(binding.id, {
        url: '',
        redirectUrl: false,
      })
    }
  }

  const handleChangeRedirectUrl = (event: SyntheticEvent) => {
    setRedirectUrl((event.currentTarget as HTMLInputElement).value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSetRedirectUrl(binding.id, {
      url: urlToRedirect,
      redirectUrl: showRedirectUrl,
    })
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
            checked={configSettings.show}
            label={
              configSettings.show ? (
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
            disabled={!configSettings.show}
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
            <FormattedMessage id="advanced-settings" />
          </span>
        }
        isOpen={showAdvConfig}
        onClick={() => setShowAdvConfig(!showAdvConfig)}
      >
        <div className="mt4">
          <Toggle
            checked={showRedirectUrl}
            label={<FormattedMessage id="set-external-url" />}
            onChange={handleShowRedirectToggle}
          />
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="mv5 width-70">
              <Input
                value={urlToRedirect}
                disabled={!showRedirectUrl}
                placeholder={intl.formatMessage({
                  id: 'external-url-placeholder',
                })}
                onChange={handleChangeRedirectUrl}
              />
            </div>
            <div className="ml5">
              <Button type="submit" disabled={!urlToRedirect}>
                <FormattedMessage id="save-url" />
              </Button>
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
