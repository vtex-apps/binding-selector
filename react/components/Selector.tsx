import type { FC } from 'react'
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Toggle } from 'vtex.styleguide'

import FormDialog from './FormDialog'
import getSalesChannel from '../graphql/getSalesChannel.gql'
import { removeBindingAdmin } from '../utils'
import AdminBindingList from './AdminBindingList'

interface ShowBindings {
  [key: string]: boolean
}

const Selector: FC = () => {
  const [updateSalesChannel, setUpdateSalesChannel] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [chosenBinding, setChosenBinding] = useState<Binding>(Object)
  const { data: bindingData } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const [showBindings, setShowBindings] = useState<ShowBindings>({})

  const handleUpdateSalesChannel = () =>
    setUpdateSalesChannel(!updateSalesChannel)

  const handleOnClose = () => setModalOpen(!modalOpen)

  const filteredBindings = removeBindingAdmin(bindingData?.tenantInfo.bindings)

  const handleShowBindings = (bindingId: string): void => {
    setShowBindings((state) => {
      return { ...state, ...{ [bindingId]: !state[bindingId] } }
    })
  }

  return (
    <div>
      <FormDialog
        open={modalOpen}
        handleOnClose={handleOnClose}
        chosenBinding={chosenBinding}
        bindings={filteredBindings ?? []}
      />
      <p className="pb4">
        <FormattedMessage id="admin-description" />
      </p>
      <Toggle
        checked={updateSalesChannel}
        label={<FormattedMessage id="admin-label" />}
        onChange={handleUpdateSalesChannel}
      />
      <AdminBindingList
        bindings={filteredBindings}
        modalControl={setModalOpen}
        modalOpen={modalOpen}
        setChosenBinding={setChosenBinding}
        showBindings={showBindings}
        setShowBindings={handleShowBindings}
      />
    </div>
  )
}

export default Selector
