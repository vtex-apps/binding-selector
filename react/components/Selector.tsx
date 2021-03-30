import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Toggle } from 'vtex.styleguide'

import Spinner from './Spinner'
import FormDialog from './FormDialog'
import { removeBindingAdmin } from '../utils'
import AdminBindingList from './AdminBindingList'
import bindingInfo from '../graphql/bindingInfo.gql'
import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import getSalesChannel from '../graphql/getSalesChannel.gql'
import toggleSalesChannel from '../graphql/toggleSalesChannel.gql'
import isSalesChannelUpdate from '../graphql/isSalesChannelUpdate.gql'

interface DataMutation {
  data: BindingsSaved[]
}

interface MutationResponse {
  saveBindingInfo: BindingsSaved[]
}

const Selector: FC = () => {
  const [updateSalesChannel, setUpdateSalesChannel] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [chosenBinding, setChosenBinding] = useState<Binding>({} as Binding)
  const [fetchedData, setFetchedData] = useState<BindingsSaved[]>([])
  const { data: bindingData } = useQuery<TenantInfoResponse>(getSalesChannel, {
    ssr: false,
  })

  const [toggleSales] = useMutation<SalesChannelResponse>(toggleSalesChannel)

  const { data: translatedData, loading } = useQuery<BindingInfoResponse>(
    bindingInfo,
    {
      ssr: false,
    }
  )

  const [saveTranslatedInfo] = useMutation<MutationResponse, DataMutation>(
    saveBindingInfo
  )

  const { data: salesData } = useQuery<SalesChannelResponse>(
    isSalesChannelUpdate,
    {
      ssr: false,
    }
  )

  useEffect(() => {
    if (translatedData) {
      setFetchedData(translatedData?.bindingInfo ?? [])
    }
  }, [translatedData])

  useEffect(() => {
    if (salesData) {
      const salesChannelValue = salesData?.isSalesChannelUpdate ?? false

      setUpdateSalesChannel(salesChannelValue)
    }
  }, [salesData])

  const handleUpdateSalesChannel = () => {
    setUpdateSalesChannel(!updateSalesChannel)
    toggleSales({ variables: { salesChannel: !updateSalesChannel } })
  }

  const handleOnClose = () => setModalOpen(!modalOpen)

  const filteredBindings = removeBindingAdmin(bindingData?.tenantInfo.bindings)

  const handleShowBindings = async (bindingId: string) => {
    let found = false
    let currentToggleStatus = false
    const modifiedBindings = fetchedData.map((binding) => {
      if (binding.bindingId === bindingId) {
        found = true
        currentToggleStatus = binding.show
        const modifiedBinding = {
          ...binding,
          show: !binding.show,
        }

        return modifiedBinding
      }

      return binding
    })

    if (!currentToggleStatus) {
      setModalOpen(true)
    }

    const bindingsToSave = found
      ? modifiedBindings
      : [
          ...fetchedData,
          {
            bindingId,
            show: true,
            translatedLocales: [],
            externalRedirectData: null,
          },
        ]

    try {
      const savedData = await saveTranslatedInfo({
        variables: { data: bindingsToSave },
      })

      if (savedData.data) {
        setFetchedData(savedData.data.saveBindingInfo)
      }
    } catch (e) {
      console.error('error saving data', { e })
    }
  }

  const handleSetRedirectUrl = async (
    bindingId: string,
    externalRedirectData: ExternalRedirectData
  ) => {
    const transformedData = fetchedData.map((binding) => {
      if (binding.bindingId === bindingId) {
        return {
          ...binding,
          externalRedirectData,
        }
      }

      return binding
    })

    await saveTranslatedInfo({ variables: { data: transformedData } })
    setFetchedData(transformedData)
  }

  const bindingsToShow = fetchedData
    .filter(({ show }) => show)
    .map(({ bindingId }) => bindingId)

  return (
    <div>
      <FormDialog
        open={modalOpen}
        handleOnClose={handleOnClose}
        chosenBinding={chosenBinding}
        bindings={filteredBindings ?? []}
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
      {loading ? (
        <div className="w100 flex justify-center align-center pa7 ma7">
          <Spinner />
        </div>
      ) : (
        <AdminBindingList
          bindings={filteredBindings}
          modalControl={setModalOpen}
          modalOpen={modalOpen}
          setChosenBinding={setChosenBinding}
          setShowBindings={handleShowBindings}
          setRedirectUrl={handleSetRedirectUrl}
          configSettingsList={fetchedData}
          bindingsToShow={bindingsToShow}
        />
      )}
    </div>
  )
}

export default Selector
