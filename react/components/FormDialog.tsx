import type { SyntheticEvent, FormEvent, FC } from 'react'
import React, { useState, useEffect, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import FieldInput from './FieldInput'
import { setShowValues } from '../utils'

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
  const [translatedLocales, setTranslatedLocales] = useState<
    BindingTranslation[]
  >([])

  const showBindings = setShowValues(bindingInfoQueryData)

  const getTranslatedLabels = useCallback(
    (arr: BindingsSaved[]) => {
      const filtered = arr.filter(
        (binding: { bindingId: string }) =>
          binding.bindingId === chosenBinding.id
      )

      return filtered[0]?.translatedLocales
    },
    [chosenBinding.id]
  )

  useEffect(() => {
    setFetchedData(bindingInfoQueryData)
    const translatedLabels = getTranslatedLabels(bindingInfoQueryData ?? [])

    setTranslatedLocales(translatedLabels ?? [])

    const [chosenBindingData] =
      bindingInfoQueryData.filter(
        (bind) => bind.bindingId === chosenBinding.id
      ) ?? []

    const initialLabels = {} as DataLocaleTypes

    if (chosenBindingData?.translatedLocales?.length) {
      chosenBindingData?.translatedLocales?.forEach((b) => {
        initialLabels[b.id] = b.label ? b.label : ''
      })
    }

    setDataLocales(initialLabels)
  }, [
    chosenBinding.id,
    getTranslatedLabels,
    bindingInfoQueryData,
    setFetchedData,
  ])

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
    const translatedLabels = getTranslatedLabels(dataContainer.data)

    setTranslatedLocales(translatedLabels ?? [])
    handleOnClose()
  }

  const showFields = () => {
    const fields = bindings
      ?.filter((binding: Binding) => {
        return binding.canonicalBaseAddress.split('/')[1] !== 'admin'
      })
      .map((binding: Binding, i: number) => {
        const [showBinding] =
          bindingInfoQueryData.filter(
            (bind) => bind.bindingId === binding.id
          ) ?? []

        const showValue: boolean = showBinding?.show

        return (
          <FieldInput
            binding={binding}
            dataLocales={dataLocales}
            handleChange={handleChange}
            key={i}
            showBindings={showBindings}
            showEditValue={translatedLocales ?? []}
            showValue={showValue}
          />
        )
      })

    return fields
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
          {showFields()}
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
