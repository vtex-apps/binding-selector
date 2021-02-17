import type { FC } from 'react'
import React, { useState } from 'react'
import { useQuery, compose } from 'react-apollo'
import type { InjectedIntl } from 'react-intl'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Toggle, Button } from 'vtex.styleguide'

import FormDialog from './FormDialog'
import getSalesChannel from '../graphql/getSalesChannel.gql'
import translatedInfo from '../graphql/translatedInfo.gql'

interface SelectorProps {
  intl: InjectedIntl
}

interface BindingList {
  info: Binding
  i: number
  setModalOpen: (modalOpen: boolean) => void
  modalOpen: boolean
  setChosenBinding: (info: Binding) => void
  key: number
}

const BindingList: FC<BindingList> = (props: BindingList) => {
  const { info, i, setModalOpen, modalOpen, setChosenBinding, key } = props

  return (
    <section key={key} className="flex items-center justify-between">
      <div>
        <p>
          <FormattedMessage
            id="admin-store"
            values={{ index: i + 1, address: info.canonicalBaseAddress }}
          />
        </p>
        <p>
          <FormattedMessage
            id="admin-locale"
            values={{ locale: info.defaultLocale }}
          />
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

const Selector: FC<SelectorProps> = (props: SelectorProps) => {
  const { intl } = props
  const [isActive, setIsActive] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [chosenBinding, setChosenBinding] = useState<Binding>(Object)
  const { data: bindingData } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const { data: translatedData } = useQuery(translatedInfo, {
    ssr: false,
  })

  console.log('translatedData', translatedData)
  const handleChange = () => setIsActive(!isActive)

  const handleToggle = () => setModalOpen(!modalOpen)

  const showBindings = () => {
    const infoSections = bindingData?.tenantInfo.bindings
      .filter((info: Binding) => {
        return info.canonicalBaseAddress.split('/')[1] !== 'admin'
      })
      .map((info: Binding, i: number) => {
        return (
          <BindingList
            key={i}
            info={info}
            i={i}
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            setChosenBinding={setChosenBinding}
          />
        )
      })

    return infoSections
  }

  return (
    <div>
      <FormDialog
        open={modalOpen}
        handleToggle={handleToggle}
        chosenBinding={chosenBinding}
        bindings={bindingData?.tenantInfo.bindings ?? []}
      />
      <p className="pb4">
        <FormattedMessage id="admin-description" />
      </p>
      <Toggle
        checked={isActive}
        label={intl.formatMessage({ id: 'admin-label' })}
        onChange={handleChange}
      />
      <div className="pt6">{showBindings()}</div>
    </div>
  )
}

export default compose(injectIntl)(Selector)
