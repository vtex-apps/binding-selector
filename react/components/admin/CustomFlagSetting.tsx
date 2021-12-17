/* eslint-disable no-console */
import React, { useState } from 'react'
import type { FC } from 'react'
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

const edit = <IconEdit />

/* 512kb */
const MAX_SIZE = 512000

const UPLOAD_ERROR = {
  error: false,
  size: 0,
  type: '',
}

type Props = {
  customFlag: boolean
}

const CustomFlagSetting: FC<Props> = ({ customFlag = false }) => {
  const [hasCustomFlag, toggleSetting] = useState(customFlag)
  const [isOpen, toggleModal] = useState(false)
  const [canUpload, setCanUpload] = useState(false)
  const [uploadingFile, setUploading] = useState(false)
  const [alert, throwAlert] = useState(UPLOAD_ERROR)

  /* MUTATION => URL */

  /* USE EFFECT [URL] => saveTranlatingInfo & setFetchedData */

  const submitCustomFlag = () => {
    console.log('ALOHA')
    setUploading(true)
  }

  const dropAccepted = (file: File[]) => {
    console.log('accepted')
    console.log(file)
    setCanUpload(true)
  }

  const dropRejected = (file: File[]) => {
    console.log('rejected')
    console.log(file)
    setCanUpload(false)
    throwAlert({
      error: true,
      size: Math.floor(file[0].size / 1000),
      type: file[0].type,
    })
  }

  return (
    <>
      <Toggle
        label={<FormattedMessage id="admin/custom-flag.toggle" />}
        checked={hasCustomFlag}
        onChange={() => toggleSetting(!hasCustomFlag)}
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
          <Button onClick={() => submitCustomFlag()} disabled={!canUpload}>
            <FormattedMessage id="admin-save" />
          </Button>
        }
      >
        <div className="mb4">
          {alert.error && (
            <div className="mb4">
              <Alert onClose={() => throwAlert(UPLOAD_ERROR)} type="error">
                <FormattedMessage
                  id="admin/custom-flag.modal-error"
                  values={{
                    size: alert.size,
                    type: alert.type,
                  }}
                />
              </Alert>
              {console.log(alert.size, alert.type)}
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
