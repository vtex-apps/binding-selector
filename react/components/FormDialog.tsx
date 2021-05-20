import type { SyntheticEvent, FormEvent, FC } from 'react'
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import { removeBindingAdmin, setShowValues, createHideLabelMap } from '../utils'
import AdminBindingLabelsList from './AdminBindingLabelsList'

interface FormDialogProps {
  open: boolean
  handleOnClose: () => void
  bindings: Binding[]
  chosenBinding: Binding
  bindingInfoQueryData: BindingsSaved[]
  setFetchedData: (binding: BindingsSaved[]) => void
}

interface DataLocaleTypes {
  [key: string]: string
}

interface DataMutation {
  data: BindingsSaved[]
}

const FormDialog: FC<FormDialogProps> = (props: FormDialogProps) => {
  const {
    open,
    handleOnClose,
    bindings,
    chosenBinding,
    bindingInfoQueryData,
    setFetchedData,
  } = props

  const [dataLocales, setDataLocales] = useState<DataLocaleTypes>({})
  const [saveTranslatedInfo] = useMutation<BindingsSaved>(saveBindingInfo)
  const [hideLabelMap, setHideLabelMap] = useState<Record<string, boolean>>({})
  const showBindings = setShowValues(bindingInfoQueryData)

  useEffect(() => {
    const [chosenBindingData] =
      bindingInfoQueryData.filter(
        (bind) => bind.bindingId === chosenBinding.id
      ) ?? []

    // eslint-disable-next-line vtex/prefer-early-return
    if (chosenBindingData?.translatedLocales?.length) {
      const initialLabels = {} as DataLocaleTypes

      chosenBindingData?.translatedLocales?.forEach((b) => {
        initialLabels[b.id] = b.label ? b.label : ''
      })
      setDataLocales(initialLabels)
      const hideLabelInfo = createHideLabelMap(
        chosenBindingData.translatedLocales
      )

      setHideLabelMap(hideLabelInfo)
    }
  }, [bindingInfoQueryData, chosenBinding.id])

  const handleChange = (event: SyntheticEvent) => {
    const { name, value } = event.target as HTMLButtonElement

    setDataLocales({ ...dataLocales, [name]: value })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const payload = {} as BindingsSaved
    const dataContainer = {} as DataMutation

    payload.bindingId = chosenBinding.id
    const translatedInfoArray = [] as BindingTranslation[]

    for (const [key, value] of Object.entries(dataLocales)) {
      const [
        {
          defaultLocale,
          canonicalBaseAddress,
          extraContext: {
            portal: { salesChannel },
          },
        },
      ] = bindings.filter(({ id }) => id === key)

      translatedInfoArray.push({
        label: value,
        id: key,
        defaultLocale,
        canonicalBaseAddress,
        salesChannel: salesChannel.toString(),
        hide: hideLabelMap[key],
      })
    }

    payload.translatedLocales = translatedInfoArray
    payload.show = !!showBindings[chosenBinding.id]

    if (bindingInfoQueryData.length) {
      const filteredFromChosenId = bindingInfoQueryData.filter(
        (item: { bindingId: string }) => item.bindingId !== chosenBinding.id
      )

      filteredFromChosenId.push(payload)

      dataContainer.data = filteredFromChosenId
    } else {
      const newArray = [] as BindingsSaved[]

      newArray.push(payload)
      dataContainer.data = newArray
    }

    saveTranslatedInfo({ variables: dataContainer })

    setFetchedData(dataContainer.data)

    handleOnClose()
  }

  const bindingsToBeLabeled = removeBindingAdmin(bindings)

  const handleHideLabel = ({
    bindingId,
    status,
  }: {
    bindingId: string
    status: boolean
  }) => {
    setHideLabelMap({
      ...hideLabelMap,
      [bindingId]: status,
    })
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        handleOnClose()
      }}
    >
      <form onSubmit={onSubmit}>
        <div className="pt6 tc">
          <FormattedMessage id="admin-modal" />
        </div>
        <div className="pt6 flex w-100 flex-column justify-center items-center">
          <AdminBindingLabelsList
            bindings={bindingsToBeLabeled}
            activeBindings={showBindings}
            dataLocales={dataLocales}
            handleChange={handleChange}
            hiddenLabels={hideLabelMap}
            handleHideLabel={handleHideLabel}
          />
          <div className="flex pt6">
            <div className="pr4">
              <Button variation="tertiary" onClick={() => handleOnClose()}>
                <FormattedMessage id="admin-cancel" />
              </Button>
            </div>
            <div>
              <Button type="submit">
                <FormattedMessage id="admin-save" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default FormDialog
