import React, { useState, useEffect } from 'react'
import type { FC, SyntheticEvent, FormEvent } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Toggle, Button, Divider, Collapsible, Input } from 'vtex.styleguide'

export interface BindingSectionProps {
  modalControl: (modalOpen: boolean) => void
  modalOpen: boolean
  setChosenBinding: (binding: Binding) => void
  setShowBindings: (id: string) => void
  setRedirectUrl: (bindingId: string, args: ExternalRedirectData) => void
}

interface BindingSectionPropsLocal extends BindingSectionProps {
  i: number
  binding: Binding
  configSettings: BindingsSaved
  hasAllabels: boolean
}

const AdminBindingSection: FC<BindingSectionPropsLocal> = ({
  binding,
  modalControl,
  modalOpen,
  setChosenBinding,
  setShowBindings,
  setRedirectUrl,
  configSettings,
  hasAllabels,
  i,
}) => {
  const [showAdvConfig, setShowAdvConfig] = useState(false)
  const [showRedirectUrl, setShowRedirectUrl] = useState(false)
  const [urlToRedirect, setUrlToRedirect] = useState('')
  const [edit, setEdit] = useState(false)
  const intl = useIntl()

  useEffect(() => {
    const { externalRedirectData } = configSettings

    if (externalRedirectData) {
      const { redirectUrl, url } = externalRedirectData

      if (redirectUrl) {
        setShowRedirectUrl(redirectUrl)
        setUrlToRedirect(url)
        setEdit(true)

        return
      }
    }

    setShowRedirectUrl(false)
    setUrlToRedirect('')
  }, [configSettings, showAdvConfig])

  const handleShowRedirectToggle = () => {
    setShowRedirectUrl(!showRedirectUrl)
    if (showRedirectUrl) {
      setRedirectUrl(binding.id, {
        url: '',
        redirectUrl: false,
      })
    } else {
      setEdit(false)
    }
  }

  const handleChangeRedirectUrl = (event: SyntheticEvent) => {
    setUrlToRedirect((event.currentTarget as HTMLInputElement).value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setRedirectUrl(binding.id, {
      url: urlToRedirect,
      redirectUrl: showRedirectUrl,
    })
  }

  const handleEditMode = (e: MouseEvent) => {
    e.preventDefault()
    setEdit(!edit)
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
            onChange={() => {
              setShowBindings(binding.id)
              if (!configSettings.show) {
                setChosenBinding(binding)
              } else {
                setChosenBinding({} as Binding)
              }
            }}
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
          {configSettings.show && !hasAllabels ? (
            <p className="absolute c-danger i-s">
              <FormattedMessage id="missing-labels" />
            </p>
          ) : null}
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
          <form onSubmit={handleSubmit} className="flex items-baseline">
            <div className="mv5 width-70">
              <Input
                value={urlToRedirect}
                disabled={!showRedirectUrl || edit}
                placeholder={intl.formatMessage({
                  id: 'external-url-placeholder',
                })}
                onChange={handleChangeRedirectUrl}
                pattern="^https?:\/\/.+"
              />
              <p className="t-small mw9">
                <FormattedMessage id="external-url-helper-text" />
              </p>
            </div>
            <div className="ml5">
              {edit ? (
                <Button
                  type="button"
                  variation="secondary"
                  disabled={!urlToRedirect}
                  onClick={handleEditMode}
                >
                  <FormattedMessage id="edit-url" />
                </Button>
              ) : (
                <Button type="submit" disabled={!urlToRedirect}>
                  <FormattedMessage id="save-url" />
                </Button>
              )}
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
