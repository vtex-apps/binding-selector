import type { FC } from 'react'
import React, { useState } from 'react'
import { useQuery, compose, useMutation } from 'react-apollo'
import type { InjectedIntl } from 'react-intl'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Toggle, Button, Input } from 'vtex.styleguide'
import saveTokenGQL from '../graphql/saveToken.gql'
import tokenGQL from '../graphql/token.gql'

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

interface BindingList {
  info: BindingsInfo
  i: number
  setModalOpen: (modalOpen: boolean) => void
  modalOpen: boolean
  setChosenBinding: (info: BindingsInfo) => void
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
  const [chosenBinding, setChosenBinding] = useState({})
  const { data: bindingData } = useQuery(accountLocalesQuery)

  const handleChange = () => setIsActive(!isActive)

  const handleToggle = () => setModalOpen(!modalOpen)

  const showBindings = () => {
    const infoSections = bindingData?.tenantInfo.bindings
      .filter((info: BindingsInfo) => {
        return info.canonicalBaseAddress.split('/')[1] !== 'admin'
      })
      .map((info: BindingsInfo, i: number) => {
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

  const [token, setToken] = useState('')
  useQuery(tokenGQL, { onCompleted: ({ token }) => setToken(token) })
  const [saveToken] = useMutation(saveTokenGQL)
  console.log('token', token)
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
      <Input
        placeholder="API Token"
        value={token}
        onChange={(e: any) => setToken(e.target.value)}
      />
      <Button
        onClick={() => {
          saveToken({ variables: { token } })
        }}
      >
        Salvar
      </Button>
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
