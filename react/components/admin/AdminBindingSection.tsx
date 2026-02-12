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
  setAdvancedSettings: (
    bindingId: string,
    type: SettingType,
    extraData: ExternalRedirectData | CustomFlagData
  ) => Promise<void>
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
  setAdvancedSettings,
  configSettings,
  hasAllabels,
  i,
}) => {
  const [showAdvConfig, setShowAdvConfig] = useState(false)
  const [showRedirectUrl, setShowRedirectUrl] = useState(false)
  const [urlToRedirect, setUrlToRedirect] = useState('')
  const [edit, setEdit] = useState(false)
  const intl = useIntl()

  const flag = configSettings.customFlagData

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
      setAdvancedSettings(binding.id, 'externalRedirectData', {
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

  const handleFlagToggle = (active: boolean) => {
    /* We should always try to keep the original url */
    setAdvancedSettings(binding.id, 'customFlagData', {
      ...(flag?.url ? { url: flag.url } : { url: '' }),
      isCustom: active,
    })
  }

  const handleSubmitRedirect = (e: FormEvent) => {
    e.preventDefault()
    setAdvancedSettings(binding.id, 'externalRedirectData', {
      url: urlToRedirect,
      redirectUrl: showRedirectUrl,
    })
  }

  const handleSubmitFlag = async (inmutableUrl: string) => {
    await setAdvancedSettings(binding.id, 'customFlagData', {
      url: inmutableUrl,
      isCustom: true,
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
              {flag?.isCustom && flag?.url ? (
                <img
                  src={flag.url}
                  alt={intl.formatMessage({ id: 'admin/flag.alt-text' })}
                  width="24"
                  height="24"
                  style={{ maxWidth: 24, maxHeight: 24 }}
                />
              ) : (
                <CountryFlag
                  iso2={binding.defaultLocale.substring(3, 5).toUpperCase()}
                />
              )}
            </Button>
          </span>
          <div className="flex flex-column mv5 flex-grow-1 flex-basis-33">
            <span className="b">
              <FormattedMessage
                id="admin/store"
                values={{
                  index: i + 1,
                  address: binding.canonicalBaseAddress,
                }}
              />
            </span>
            <span>
              <FormattedMessage
                id="admin/locale"
                values={{ locale: binding.defaultLocale }}
              />
            </span>
          </div>
        </div>

        <div className="flex items-center flex-basis-50 justify-end">
          {showRedirectUrl && (
            <div>
              <Tooltip
                label={
                  <FormattedMessage id="admin/redirect-url.tooltip-label" />
                }
              >
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
              <FormattedMessage id="admin/action" />
            </Button>
            {configSettings.show && !hasAllabels ? (
              <p className="absolute c-danger i-s">
                <FormattedMessage id="admin/missing-labels" />
              </p>
            ) : null}
          </div>

          <div className="flex flex-basis-25 justify-end">
            <Toggle
              checked={configSettings.show}
              semantic
              label={
                configSettings.show ? (
                  <FormattedMessage id="admin/hide-binding" />
                ) : (
                  <FormattedMessage id="admin/show-binding" />
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
            <FormattedMessage id="admin/advanced-settings" />
          </span>
        }
        isOpen={showAdvConfig}
        onClick={() => setShowAdvConfig(!showAdvConfig)}
      >
        <div className="mt7">
          <Toggle
            checked={showRedirectUrl}
            label={<FormattedMessage id="admin/set-external-url" />}
            onChange={handleShowRedirectToggle}
          />
          <form onSubmit={handleSubmitRedirect} className="mt4 flex">
            <div className="width-70">
              <Input
                value={urlToRedirect}
                disabled={!showRedirectUrl || edit}
                placeholder={intl.formatMessage({
                  id: 'admin/external-url-placeholder',
                })}
                onChange={handleChangeRedirectUrl}
                pattern="^https?:\/\/.+"
                helpText={<FormattedMessage id="admin/external-url-helper-text" />}
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
                  <FormattedMessage id="admin/edit-url" />
                </Button>
              ) : (
                <Button type="submit" disabled={!urlToRedirect}>
                  <FormattedMessage id="admin/save-url" />
                </Button>
              )}
            </div>
          </form>
        </div>
        <div className="mt7">
          <CustomFlagSetting
            customFlag={Boolean(flag?.isCustom)}
            handleFlagToggle={handleFlagToggle}
            handleSubmitFlag={handleSubmitFlag}
          />
        </div>
      </Collapsible>
    </>
  )
}

export default AdminBindingSection
