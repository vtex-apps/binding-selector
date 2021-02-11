import type { FC } from 'react'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
  open: boolean
  currentBinding: string
  fakeBindingsLabel: {
    [Identifier: string]: { [Identifier: string]: string }
  }
  onSelectBinding: (selectedBinding: string) => void
}

const CSS_HANDLES = ['list', 'listElement'] as const

const BindingSelectorList: FC<Props> = ({
  open,
  currentBinding,
  fakeBindingsLabel,
  onSelectBinding,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  // const { data: hrefData } = useQuery(alternateHrefQuery)

  return (
    <ul
      hidden={!open}
      className={`${handles.list} absolute z-5 list top-1 ph0 mh0 mt5 bg-base`}
    >
      {Object.keys(fakeBindingsLabel[currentBinding])
        .filter((binding) => {
          return binding !== currentBinding
        })
        .map((binding) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li
            key={binding}
            className={`${handles.listElement} t-action--small pointer f5 pa3 hover-bg-muted-5 tc`}
            onClick={() => {
              onSelectBinding(binding)
            }}
            onKeyDown={() => {
              onSelectBinding(binding)
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <span>{fakeBindingsLabel[currentBinding][binding]}</span>
          </li>
        ))}
    </ul>
  )
}

export default BindingSelectorList
