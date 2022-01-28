import type { SyntheticEvent, FC } from 'react'
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import saveBindingInfo from '../../graphql/saveBindingInfo.gql'
import {
  removeBindingAdmin,
  setShowValues,
  createBindingsToLabel,
} from '../../utils'
import AdminBindingLabelsList from './AdminBindingLabelsList'

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

  useEffect(() => {
    const bindingsToLabel = createBindingsToLabel(
      bindings,
      bindingInfoQueryData.find(
        (binding) => binding.bindingId === chosenBinding.id
      )?.translatedLocales ?? []
    )

    setTranslationMap(bindingsToLabel)
  }, [bindingInfoQueryData, bindings, chosenBinding.id])

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

  const handleOnSave = () => {
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
      title={<FormattedMessage id="admin-modal" />}
      onClose={handleOnClose}
      bottomBar={
        <div className="flex">
          <div className="pr4">
            <Button variation="tertiary" onClick={handleOnClose}>
              <FormattedMessage id="admin-cancel" />
            </Button>
          </div>
          <div>
            <Button onClick={handleOnSave}>
              <FormattedMessage id="admin-save" />
            </Button>
          </div>
        </div>
      }
    >
      <div className="pb6 pt3 flex w-100 flex-column justify-center items-center">
        <AdminBindingLabelsList
          bindings={bindingsToBeLabeled}
          activeBindings={showBindings}
          handleChange={handleChange}
          translationsMap={translationsMap}
          handleHideLabel={handleHideLabel}
        />
      </div>
    </Modal>
  )
}

export default FormDialog
