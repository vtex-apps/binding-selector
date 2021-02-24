import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Toggle } from 'vtex.styleguide'

import FormDialog from './FormDialog'
import { removeBindingAdmin } from '../utils'
import AdminBindingList from './AdminBindingList'
import bindingInfo from '../graphql/bindingInfo.gql'
import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import getSalesChannel from '../graphql/getSalesChannel.gql'
import toggleSalesChannel from '../graphql/toggleSalesChannel.gql'
import isSalesChannelUpdate from '../graphql/isSalesChannelUpdate.gql'

interface ShowBindings {
  [key: string]: boolean
}

interface DataMutation {
  data: BindingsSaved[]
}

const Selector: FC = () => {
  const [updateSalesChannel, setUpdateSalesChannel] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [chosenBinding, setChosenBinding] = useState<Binding>(Object)
  const [fetchedData, setFetchedData] = useState<BindingsSaved[]>([])
  const { data: bindingData } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const [toggleSales] = useMutation<SalesChannelResponse>(toggleSalesChannel)

  const { data: translatedData } = useQuery<BindingInfoResponse>(bindingInfo, {
    ssr: false,
  })

  const [saveTranslatedInfo] = useMutation<BindingsSaved>(saveBindingInfo)
  const { data: salesData } = useQuery<SalesChannelResponse>(
    isSalesChannelUpdate,
    {
      ssr: false,
    }
  )

  const [showBindings, setShowBindings] = useState<ShowBindings>({})

  useEffect(() => {
    const salesChannelValue = salesData?.isSalesChannelUpdate ?? false

    setUpdateSalesChannel(salesChannelValue)
    const setInitialShowValues = () => {
      const dataHolder = {} as ShowBindings

      translatedData?.bindingInfo.forEach((binding) => {
        dataHolder[binding.bindingId] = binding.show
      })

      return dataHolder
    }

    const initialShowValues = setInitialShowValues()

    setShowBindings(initialShowValues)
    setFetchedData(translatedData?.bindingInfo ?? [])
  }, [
    bindingData,
    salesData?.isSalesChannelUpdate,
    translatedData?.bindingInfo,
  ])

  const handleToggle = (id: string) => {
    const bindings = translatedData?.bindingInfo
    const chosenToggle = bindings?.filter((bind) => bind.bindingId === id)
    const filtered = bindings?.filter((bind) => bind.bindingId !== id)
    let editedChosen = {} as BindingsSaved
    const dataContainer = {} as DataMutation

    if (chosenToggle?.length) {
      const [extractedInfo] = chosenToggle

      extractedInfo.show = !showBindings[id]
      editedChosen = extractedInfo
    } else {
      const payload = {} as BindingsSaved

      payload.bindingId = id
      payload.show = true
      editedChosen = payload
    }

    filtered?.push(editedChosen)

    dataContainer.data = filtered ?? []
    saveTranslatedInfo({ variables: dataContainer })
  }

  const handleUpdateSalesChannel = () => {
    setUpdateSalesChannel(!updateSalesChannel)
    toggleSales({ variables: { salesChannel: !updateSalesChannel } })
  }

  const handleOnClose = () => setModalOpen(!modalOpen)

  const filteredBindings = removeBindingAdmin(bindingData?.tenantInfo.bindings)

  const handleShowBindings = (bindingId: string): void => {
    handleToggle(bindingId)
    setShowBindings((state) => {
      return { ...state, ...{ [bindingId]: !state[bindingId] } }
    })

    if (
      !translatedData?.bindingInfo.some((info) => info.bindingId === bindingId)
    ) {
      const hello = {} as BindingsSaved

      hello.bindingId = bindingId
      hello.show = false
      hello.translatedLocales = []
      translatedData?.bindingInfo.push(hello)
    }

    setFetchedData(translatedData?.bindingInfo ?? [])
  }

  return (
    <div>
      <FormDialog
        open={modalOpen}
        handleOnClose={handleOnClose}
        chosenBinding={chosenBinding}
        bindings={filteredBindings ?? []}
        showBindings={showBindings}
        bindingInfoQueryData={fetchedData ?? []}
        setFetchedData={setFetchedData}
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
