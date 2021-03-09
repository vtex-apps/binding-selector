import React from 'react'
import type { FC } from 'react'

import type { BindingSectionProps } from './AdminBindingSection'
import AdminBindingSection from './AdminBindingSection'

interface BindingListProps extends BindingSectionProps {
  bindings: Binding[]
  configSettingsList: BindingsSaved[]
}

const BindingList: FC<BindingListProps> = ({
  bindings,
  configSettingsList,
  ...props
}) => {
  return (
    <div className="pt6">
      {bindings.map((binding, i) => {
        const configSettings =
          configSettingsList.find(
            ({ bindingId }) => bindingId === binding.id
          ) ?? ({} as BindingsSaved)

        return (
          <div key={binding.id}>
            <AdminBindingSection
              binding={binding}
              configSettings={configSettings}
              i={i}
              {...props}
            />
          </div>
        )
      })}
    </div>
  )
}

export default BindingList
