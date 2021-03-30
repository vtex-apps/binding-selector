import React from 'react'
import type { FC } from 'react'

import type { BindingSectionProps } from './AdminBindingSection'
import AdminBindingSection from './AdminBindingSection'
import { hasAllTranslations } from '../utils'

interface BindingListProps extends BindingSectionProps {
  bindings: Binding[]
  configSettingsList: BindingsSaved[]
  bindingsToShow: string[]
}

const BindingList: FC<BindingListProps> = ({
  bindings,
  configSettingsList,
  bindingsToShow,
  ...props
}) => {
  return (
    <div className="pt6">
      {bindings.map((binding, i) => {
        const configSettings =
          configSettingsList.find(
            ({ bindingId }) => bindingId === binding.id
          ) ?? ({} as BindingsSaved)

        const hasAllLabels = hasAllTranslations({
          bindingsToShow,
          translatedBindings: configSettings.translatedLocales ?? [],
        })

        return (
          <div key={binding.id}>
            <AdminBindingSection
              binding={binding}
              configSettings={configSettings}
              i={i}
              hasAllabels={hasAllLabels}
              {...props}
            />
          </div>
        )
      })}
    </div>
  )
}

export default BindingList
