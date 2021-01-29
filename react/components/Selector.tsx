import React, { useState, FC } from 'react'
import { useQuery, compose } from 'react-apollo'
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl'
import { Toggle, Button } from 'vtex.styleguide'

import FormDialog from './FormDialog'
import accountLocalesQuery from '../graphql/accountLocales.gql'

interface SelectorProps {
  intl: InjectedIntl
}

interface BindingsInfo {
  id: string
  canonicalBaseAddress: string
  defaultLocale: string
}

const Selector: FC<SelectorProps> = (props: SelectorProps) => {
  const { intl } = props
  const [isActive, setIsActive] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [chosenBinding, setChosenBinding] = useState({})
  const { data: bindingData } = useQuery(accountLocalesQuery)

  const handleChange = () => setIsActive(!isActive)

  const handleToggle = () => setModalOpen(!modalOpen)

  const showBindings = () => {
    const infoSections = bindingData?.tenantInfo.bindings.map(
      (info: BindingsInfo, i: number) => {
        if (info.canonicalBaseAddress.split('/')[1] !== 'admin') {
          return (
            <section className="flex items-center justify-between">
              <div>
                <p>
                  {intl.formatMessage({ id: 'admin-store' })} {i}
                  {': '}
                  {info.canonicalBaseAddress}
                </p>
                <p>
                  {intl.formatMessage({ id: 'admin-locale' })}
                  {': '}
                  {info.defaultLocale}
                </p>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setModalOpen(!modalOpen)
                    setChosenBinding(info)
                  }}
                >
                  <FormattedMessage id="admin-action" />
                </Button>
              </div>
            </section>
          )
        }
      }
    )

    return infoSections
  }

  return (
    <div>
      <FormDialog
        open={modalOpen}
        handleToggle={handleToggle}
        chosenBinding={chosenBinding}
        bindings={bindingData?.tenantInfo.bindings}
      />
      <p className="pb4">
        <FormattedMessage id="admin-description" />
      </p>
      <Toggle
        checked={isActive}
        label={intl.formatMessage({ id: 'admin-label' })}
        onClick={handleChange}
      />
      <div className="pt6">{isActive && showBindings()}</div>
    </div>
  )
}

export default compose(injectIntl)(Selector)
