import type { FC, FormEvent, SyntheticEvent } from 'react'
import React, { useState, useEffect, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Input, Button } from 'vtex.styleguide'
import { useMutation, useQuery } from 'react-apollo'

import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import bindingInfo from '../graphql/bindingInfo.gql'

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
}

interface DataLocaleTypes {
  [key: string]: string
}

interface FieldInputProps {
  binding: Binding
  dataLocales: DataLocaleTypes
  handleChange: (e: SyntheticEvent) => void
  key: number
  showBindings: { [key: string]: boolean }
  showEditValue: InfoBinding[]
  showEdit: boolean
}

interface DataMutation {
  data: BindingsSaved[]
}

const FieldInput: FC<FieldInputProps> = (props: FieldInputProps) => {
  const {
    binding,
    dataLocales,
    handleChange,
    key,
    showBindings,
    showEditValue,
    showEdit,
  } = props

  const labelText = showEditValue?.filter((bind) => bind.id === binding.id)[0]

  const LabelTextField = () => {
    if (labelText?.label) {
      return <p>{labelText?.label}</p>
    }

    return <Input disabled />
  }

  return (
    <div key={key} className="flex items-center justify-center w-100">
      <div className="pa4 w-40">
        <label>
          {binding.canonicalBaseAddress} ({binding.defaultLocale})
        </label>
      </div>
      <div className="pa4 w-50">
        {showEdit ? (
          LabelTextField()
        ) : (
          <Input
            disabled={!showBindings[binding.id]}
            required={showBindings[binding.id]}
            name={binding.id}
            onChange={(e: SyntheticEvent) => handleChange(e)}
            value={dataLocales[binding.defaultLocale]}
          />
        )}
      </div>
    </div>
  )
}

const FormDialog: FC<FormDialogProps> = (props: FormDialogProps) => {
  const { open, handleOnClose, bindings, chosenBinding, showBindings } = props
  const [dataLocales, setDataLocales] = useState<DataLocaleTypes>({})
  const [saveTranslatedInfo] = useMutation<BindingsSaved>(saveBindingInfo)

  const { data: translatedData, refetch } = useQuery<BindingInfoResponse>(
    bindingInfo,
    {
      ssr: false,
    }
  )

  const [fetchedData, setFetchedData] = useState<BindingsSaved[]>([])

  const [showEdit, setShowEdit] = useState<boolean>(false)
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
    setFetchedData(translatedData?.bindingInfo ?? [])
    const translatedLabels = getTranslatedLabels(
      translatedData?.bindingInfo ?? []
    )

    setTranslatedLocales(translatedLabels ?? [])
    setShowEdit(!!translatedLabels)
  }, [chosenBinding.id, getTranslatedLabels, translatedData?.bindingInfo])

  const handleChange = (event: SyntheticEvent) => {
    const { name, value } = event.target as HTMLButtonElement

    setDataLocales({ ...dataLocales, [name]: value })
  }

  const showFields = () => {
    const fields = bindings
      ?.filter((binding: Binding) => {
        return binding.canonicalBaseAddress.split('/')[1] !== 'admin'
      })
      .map((binding: Binding, i: number) => {
        return (
          <FieldInput
            binding={binding}
            dataLocales={dataLocales}
            handleChange={handleChange}
            key={i}
            showBindings={showBindings}
            showEditValue={translatedLocales ?? []}
            showEdit={showEdit}
          />
        )
      })

    return fields
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

    if (fetchedData.length) {
      const filteredFromChosenId = fetchedData.filter(
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
    setShowEdit(true)
    handleOnClose()
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setShowEdit(true)
        handleOnClose()
      }}
    >
      <form onSubmit={onSubmit}>
        <div className="pt6 tc">
          <FormattedMessage id="admin-modal" />
        </div>
        <div className="pt6 flex w-100 flex-column justify-center items-center">
          {showFields()}
          {showEdit ? (
            <div className="pr4">
              <Button
                onClick={() => {
                  setShowEdit(false)
                }}
              >
                <FormattedMessage id="admin-edit" />
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </form>
    </Modal>
  )
}

export default FormDialog
