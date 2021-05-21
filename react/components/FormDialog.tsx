import type { SyntheticEvent, FormEvent, FC } from 'react'
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import saveBindingInfo from '../graphql/saveBindingInfo.gql'
import {
  removeBindingAdmin,
  setShowValues,
  createBindingsToLabel,
} from '../utils'
import AdminBindingLabelsList from './AdminBindingLabelsList'
import { useBinding } from '../hooks/useBindings'

interface FormDialogProps {
  open: boolean
  handleOnClose: () => void
  bindings: Binding[]
  chosenBinding: Binding
  bindingInfoQueryData: BindingsSaved[]
  setFetchedData: (binding: BindingsSaved[]) => void
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

  const [saveTranslatedInfo] = useMutation<BindingsSaved, DataMutation>(
    saveBindingInfo
  )

  const [translationsMap, setTranslationMap] = useState<
    Record<string, BindingTranslation>
  >({})

  const showBindings = setShowValues(bindingInfoQueryData)

  const {
    data: { bindingList },
    actions: { setCurrentBindingInfo },
  } = useBinding()

  useEffect(() => {
    setCurrentBindingInfo(chosenBinding.id)
  }, [chosenBinding.id, setCurrentBindingInfo])

  useEffect(() => {
    const bindingsToLabel = createBindingsToLabel(bindings, bindingList)

    setTranslationMap(bindingsToLabel)
  }, [bindingList, bindings])

  const handleChange = (event: SyntheticEvent) => {
    const { name, value } = event.target as HTMLInputElement

    setTranslationMap({
      ...translationsMap,
      [name]: {
        ...translationsMap[name],
        label: value,
      },
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const transformedData = bindingInfoQueryData.map<BindingsSaved>(
      (binding) => {
        if (binding.bindingId === chosenBinding.id) {
          return {
            ...binding,
            translatedLocales: Object.values(translationsMap),
          }
        }

        return binding
      }
    )

    saveTranslatedInfo({ variables: { data: transformedData } })

    setFetchedData(transformedData)

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
    setTranslationMap({
      ...translationsMap,
      [bindingId]: {
        ...translationsMap[bindingId],
        hide: status,
      },
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
            handleChange={handleChange}
            translationsMap={translationsMap}
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
