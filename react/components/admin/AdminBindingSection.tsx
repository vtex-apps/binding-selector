import React, { useState, useEffect } from 'react'
import type { FC, SyntheticEvent, FormEvent } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Toggle,
  Button,
  Divider,
  Collapsible,
  Input,
  Tooltip,
  IconExternalLink,
} from 'vtex.styleguide'
import { CountryFlag } from 'vtex.country-flags'

import CustomFlagSetting from './CustomFlagSetting'

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
  console.log(
    '%c configSettings ',
    'background: #fff; color: #333',
    configSettings
  )

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
      <div className="mt6">
        <Divider orientation="horizontal" />
      </div>
      <section
        key={binding.id}
        className="flex items-center justify-between mb3"
      >
        <div className="flex items-center flex-basis-50">
          <span className="mr4">
            <Button disabled size="small">
              <CountryFlag
                iso2={binding.defaultLocale.substring(3, 5).toUpperCase()}
              />
            </Button>
          </span>
          <div className="flex flex-column mv5 flex-grow-1 flex-basis-33">
            <span className="b">
              <FormattedMessage
                id="admin-store"
                values={{
                  index: i + 1,
                  address: binding.canonicalBaseAddress,
                }}
              />
            </span>
            <span>
              <FormattedMessage
                id="admin-locale"
                values={{ locale: binding.defaultLocale }}
              />
            </span>
          </div>
        </div>

        <div className="flex items-center flex-basis-50 justify-end">
          {showRedirectUrl && (
            <div>
              <Tooltip label="This binding has an external redirect URL">
                <span className="c-on-base pointer">
                  <IconExternalLink />
                </span>
              </Tooltip>
            </div>
          )}

          <div className="flex-basis-50 tc">
            <Button
              disabled={!configSettings.show}
              onClick={() => {
                modalControl(!modalOpen)
                setChosenBinding(binding)
              }}
              size="small"
              variation="secondary"
            >
              <FormattedMessage id="admin-action" />
            </Button>
            {configSettings.show && !hasAllabels ? (
              <p className="absolute c-danger i-s">
                <FormattedMessage id="missing-labels" />
              </p>
            ) : null}
          </div>

          <div className="flex flex-basis-25 justify-end">
            <Toggle
              checked={configSettings.show}
              semantic
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
        <div className="mt7">
          <Toggle
            checked={showRedirectUrl}
            label={<FormattedMessage id="set-external-url" />}
            onChange={handleShowRedirectToggle}
          />
          <form onSubmit={handleSubmit} className="mt4 flex">
            <div className="width-70">
              <Input
                value={urlToRedirect}
                disabled={!showRedirectUrl || edit}
                placeholder={intl.formatMessage({
                  id: 'external-url-placeholder',
                })}
                onChange={handleChangeRedirectUrl}
                pattern="^https?:\/\/.+"
                helpText={<FormattedMessage id="external-url-helper-text" />}
              />
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
        <div className="mt7">
          <CustomFlagSetting customFlag={false} />
        </div>
      </Collapsible>
    </>
  )
}

export default AdminBindingSection
