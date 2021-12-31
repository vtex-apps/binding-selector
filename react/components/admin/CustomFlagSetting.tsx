import React, { useState } from 'react'
import type { FC } from 'react'
import { useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import {
  Toggle,
  ButtonWithIcon,
  IconEdit,
  Modal,
  Button,
  Dropzone,
  Alert,
} from 'vtex.styleguide'

import UPLOAD_MUTATION from '../../graphql/uploadFile.gql'

const edit = <IconEdit />

/* 512 KB */
const MAX_SIZE = 512000 as const

const RESET_ERROR = {
  error: false,
  size: 0,
  type: '',
}

interface IncomingFile {
  uploadFile: { fileUrl: string }
}

type Props = {
  customFlag: boolean
  handleFlagToggle: (active: boolean) => void
  handleSubmitFlag: (inmutableUrl: string) => Promise<void>
}

/**
 * Enables the advanced setting to upload a custom 'flag' as
 * an icon for the bindings.
 * @note Even when the user closes the modal when
 * uploading a file, it will still run on the background.
 * @param customFlag - controls weather the setting is
 * activated; a side effect of the display of the custom icon on
 * the binding summary
 * @param handleSubmitFlag - handler to update binding's settings
 */
const CustomFlagSetting: FC<Props> = ({
  customFlag = false,
  handleFlagToggle,
  handleSubmitFlag,
}) => {
  const [hasCustomFlag, toggleSetting] = useState(customFlag)
  const [isOpen, toggleModal] = useState(false)
  const [canUpload, setCanUpload] = useState(false)
  const [uploadingFile, setUploading] = useState(false)
  const [flag, prepareFile] = useState({})
  const [alert, handleAlert] = useState(RESET_ERROR)

  /**
   * Save file (returns file's immutable URL)
   * @see file-manager-graphql
   */
  const [saveFile] = useMutation<IncomingFile>(UPLOAD_MUTATION, {
    variables: { file: flag },
  })

  const handleToggle = () => {
    toggleSetting(!hasCustomFlag)
    handleFlagToggle(!hasCustomFlag)
  }

  const dropRejected = (file: File[]) => {
    setCanUpload(false)
    handleAlert({
      error: true,
      size: Math.floor(file[0].size / 1000),
      type: file[0].type,
    })
  }

  const dropAccepted = (file: File[]) => {
    setCanUpload(true)
    prepareFile(file[0])
  }
  /**
   * @todo: Add toast to display success or error for the user
   * Not only here, but for all other saving operations
   */

  const handleUpload = async () => {
    setUploading(true)

    try {
      const { data, errors } = await saveFile()

      if (errors) {
        throw new Error('Error saving custom flag')
      }

      const { fileUrl } = data?.uploadFile ?? {}

      if (fileUrl) {
        /* This will trigger a parent re-render */
        await handleSubmitFlag(fileUrl)
      }
    } catch (e) {
      console.error('Error saving data', { e })
    } finally {
      setUploading(false)
      toggleModal(false)
    }
  }

  return (
    <>
      <Toggle
        label={<FormattedMessage id="admin/custom-flag.toggle" />}
        checked={hasCustomFlag}
        onChange={() => handleToggle()}
        helpText={<FormattedMessage id="admin/custom-flag.helpText" />}
      />
      {hasCustomFlag && (
        <div className="mt4">
          <ButtonWithIcon
            onClick={() => toggleModal(!isOpen)}
            icon={edit}
            size="small"
          >
            {<FormattedMessage id="admin/custom-flag.cta" />}
          </ButtonWithIcon>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        title={<FormattedMessage id="admin/custom-flag.modal-title" />}
        size="auto"
        onClose={() => {
          toggleModal(!isOpen)
        }}
        bottomBar={
          <Button onClick={() => handleUpload()} disabled={!canUpload}>
            <FormattedMessage id="admin-save" />
          </Button>
        }
      >
        <div className="mb4">
          {alert.error && (
            <div className="mb4">
              <Alert onClose={() => handleAlert(RESET_ERROR)} type="error">
                <FormattedMessage
                  id="admin/custom-flag.modal-error"
                  values={{
                    size: alert.size,
                    type: alert.type,
                  }}
                />
              </Alert>
            </div>
          )}
          <Dropzone
            accept="image/*"
            onDropRejected={dropRejected}
            onDropAccepted={dropAccepted}
            onFileReset={() => {
              setCanUpload(false)
            }}
            isLoading={uploadingFile}
            maxSize={MAX_SIZE}
          >
            <div className="pt7">
              <div id="modal-description">
                <span className="f4">
                  <FormattedMessage id="admin/custom-flag.modal-dropzone-title" />{' '}
                </span>
                <span className="f4 c-link" style={{ cursor: 'pointer' }}>
                  <FormattedMessage id="admin/custom-flag.modal-dropzone-cta" />
                </span>
                <p className="f6 c-muted-2 tc">
                  <FormattedMessage
                    id="admin/custom-flag.modal-dropzone-limit"
                    values={{
                      max_size: MAX_SIZE / 1000,
                    }}
                  />
                </p>
              </div>
            </div>
          </Dropzone>
        </div>
      </Modal>
    </>
  )
}

export default CustomFlagSetting
