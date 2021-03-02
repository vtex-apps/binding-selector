import React from 'react'
import type { FC } from 'react'

import type { BindingSectionProps } from './AdminBindingSection'
import AdminBindingSection from './AdminBindingSection'

interface BindingListProps extends BindingSectionProps {
  bindings: Binding[]
}

const BindingList: FC<BindingListProps> = ({ bindings, ...props }) => {
  return (
    <div className="pt6">
      {bindings.map((binding, i) => (
        <div key={binding.id}>
          <AdminBindingSection binding={binding} i={i} {...props} />
        </div>
      ))}
    </div>
  )
}

export default BindingList
