import type { SyntheticEvent } from 'react'
import React, { useState, useEffect, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import FieldInputGroup from './FieldInputGroup'

interface InfoArray {
  id: string
  label: string
  defaultLocale: string
  canonicalBaseAddress: string
}

interface FormDialogProps {
  open: boolean
  handleOnClose: () => void
  bindings: Binding[]
  chosenBinding: Binding
  showBindings: { [key: string]: boolean }
  bindingInfoQueryData: BindingsSaved[]
  setFetchedData: (binding: BindingsSaved[]) => void
}

interface DataLocaleTypes {
  [key: string]: string
}

interface DataMutation {
  data: BindingsSaved[]
}

const

const FormDialog: FC<FormDialogProps> = (props: FormDialogProps) => {
  const {
    open,
    handleOnClose,
    bindings,
    chosenBinding,
    showBindings,
    bindingInfoQueryData,
    setFetchedData,
  } = props

  const [dataLocales, setDataLocales] = useState<DataLocaleTypes>({})
  const [saveTranslatedInfo] = useMutation<BindingsSaved>(saveBindingInfo)
  const [translatedLocales, setTranslatedLocales] = useState<InfoBinding[]>([])

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
    const translatedInfoArray = [] as InfoArray[]

    for (const [key, value] of Object.entries(dataLocales)) {
      const defaultLoc = bindings.filter(
        (item: { id: string }) => item.id === key
      )[0].defaultLocale

      const canonicalBase = bindings.filter(
        (item: { id: string }) => item.id === key
      )[0].canonicalBaseAddress

      translatedInfoArray.push({
        label: value,
        id: key,
        defaultLocale: defaultLoc,
        canonicalBaseAddress: canonicalBase,
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
          <FieldInputGroup
            bindings={bindings}
            bindingInfoQueryData={bindingInfoQueryData}
            dataLocales={dataLocales}
            handleChange={handleChange}
            showBindings={showBindings}
            translatedLocales={translatedLocales}
          />
          <div className="flex pt6">
            <div className="pr4">
              <Button variation="tertiary">
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
