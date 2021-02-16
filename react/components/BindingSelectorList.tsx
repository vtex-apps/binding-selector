import type { FC } from 'react'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
  open: boolean
  currentBinding: FilteredBinding
  bindingInfo: FilteredBinding[]
  onSelectBinding: (selectedBinding: FilteredBinding) => void
}

const CSS_HANDLES = ['list', 'listElement'] as const

const BindingSelectorList: FC<Props> = ({
  open,
  currentBinding,
  bindingInfo,
  onSelectBinding,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <ul
      hidden={!open}
      className={`${handles.list} absolute z-5 list top-1 ph0 mh0 mt5 bg-base`}
    >
      {bindingInfo
        .filter((binding) => {
          return binding.id !== currentBinding.id
        })
        .map((binding) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li
            key={binding.id}
            className={`${handles.listElement} t-action--small pointer f5 pa3 hover-bg-muted-5 tc`}
            onClick={() => {
              onSelectBinding(binding)
            }}
            onKeyDown={() => {
              onSelectBinding(binding)
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <span>{binding.label}</span>
          </li>
        ))}
    </ul>
  )
}

export default BindingSelectorList
