import type { FC, FormEvent, SyntheticEvent } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Input, Button } from 'vtex.styleguide'

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

interface InfoArray {
  id: string
  label: string
  defaultLocale: string
  canonicalBaseAddress: string
}

interface Payload {
  chosenId: string
  translatedLocales: InfoArray[]
}

interface FieldInputProps {
  binding: Binding
  dataLocales: DataLocaleTypes
  handleChange: (e: SyntheticEvent) => void
  key: number
  showBindings: { [key: string]: boolean }
}

const FieldInput: FC<FieldInputProps> = (props) => {
  const { binding, dataLocales, handleChange, key, showBindings } = props

  return (
    <div key={key} className="flex items-center justify-center w-100">
      <div className="pa4 w-40">
        <label>
          {binding.canonicalBaseAddress} ({binding.defaultLocale})
        </label>
      </div>
      <div className="pa4 w-50">
        <Input
          disabled={!showBindings[binding.id]}
          required={showBindings[binding.id]}
          name={binding.id}
          onChange={(e: SyntheticEvent) => handleChange(e)}
          value={dataLocales[binding.defaultLocale]}
        />
      </div>
    </div>
  )
}

const FormDialog: FC<FormDialogProps> = (props) => {
  const { open, handleOnClose, bindings, chosenBinding, showBindings } = props
  const [dataLocales, setDataLocales] = useState<DataLocaleTypes>({})

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
          />
        )
      })

    return fields
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const payload = {} as Payload

    payload.chosenId = chosenBinding.id
    const translatedInfoArray = [] as InfoArray[]

    for (const [key, value] of Object.entries(dataLocales)) {
      const defaultLoc = bindings.filter((item) => item.id === key)[0]
        .defaultLocale

      const canonicalBase = bindings.filter((item) => item.id === key)[0]
        .canonicalBaseAddress

      translatedInfoArray.push({
        label: value,
        id: key,
        defaultLocale: defaultLoc,
        canonicalBaseAddress: canonicalBase,
      })
    }

    payload.translatedLocales = translatedInfoArray
    // eslint-disable-next-line no-console
    console.log('payload', payload)
  }

  return (
    <Modal isOpen={open} onClose={handleOnClose}>
      <form onSubmit={onSubmit}>
        <div className="pt6 tc">
          <FormattedMessage id="admin-modal" />
        </div>
        <div className="pt6 flex w-100 flex-column justify-center items-center">
          {showFields()}
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
