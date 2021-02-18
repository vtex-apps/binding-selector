import React from 'react'
import type { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Toggle, Button } from 'vtex.styleguide'

interface BindingListProps {
  bindings: Binding[]
  modalControl: (modalOpen: boolean) => void
  modalOpen: boolean
  setChosenBinding: (binding: Binding) => void
  showBindings: { [key: string]: boolean }
  setShowBindings: (id: string) => void
}

const BindingList: FC<BindingListProps> = ({
  bindings,
  modalControl,
  modalOpen,
  setChosenBinding,
  showBindings,
  setShowBindings,
}) => {
  return (
    <div className="pt6">
      {bindings.map((binding, i) => (
        <section key={binding.id} className="flex items-center justify-between">
          <div className="flex-grow-1" style={{ flexBasis: '33%' }}>
            <p>
              <FormattedMessage
                id="admin-store"
                values={{ index: i + 1, address: binding.canonicalBaseAddress }}
              />
            </p>
            <p>
              <FormattedMessage
                id="admin-locale"
                values={{ locale: binding.defaultLocale }}
              />
            </p>
          </div>
          <div className="flex-grow-1 flex justify-left">
            <Toggle
              checked={showBindings[binding.id]}
              label={
                showBindings[binding.id] ? (
                  <FormattedMessage id="admin-hide-binding" />
                ) : (
                  <FormattedMessage id="admin-show-binding" />
                )
              }
              onChange={() => setShowBindings(binding.id)}
            />
          </div>
          <div>
            <Button
              disabled={!showBindings[binding.id]}
              onClick={() => {
                modalControl(!modalOpen)
                setChosenBinding(binding)
              }}
            >
              <FormattedMessage id="admin-action" />
            </Button>
          </div>
        </section>
      ))}
    </div>
  )
}

export default BindingList
