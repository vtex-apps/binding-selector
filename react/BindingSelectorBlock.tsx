import type { FC } from 'react'
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const fakeBindingsLabel: {
  [Identifier: string]: { [Identifier: string]: string }
} = {
  'pt-BR': {
    'pt-BR': 'Brasil',
    'it-IT': 'Itália',
    'en-US': 'EUA',
  },
  'it-IT': {
    'pt-BR': 'Brasile',
    'it-IT': 'Italia',
    'en-US': 'USA',
  },
  'en-US': {
    'pt-BR': 'Brazil',
    'it-IT': 'Italy',
    'en-US': 'US',
  },
}

const CSS_HANDLES = [
  'container',
  'relativeContainer',
  'button',
  'buttonTextClasses',
  'list',
  'listElement',
] as const

const BindingSelectorBlock: FC = () => {
  const [currentBinding, setCurrentBiding] = useState<string>('pt-BR')
  const [open, setOpen] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <div
      className={`${handles.container} flex items-center justify-center w3 relative`}
    >
      <div
        className={`${handles.relativeContainer} relative flex justify-center`}
      >
        <button
          type="button"
          onClick={handleClick}
          className={`${handles.button} link pa3 bg-transparent bn flex items-center pointer c-on-base`}
        >
          <span className={`${handles.buttonTextClasses}`}>
            {fakeBindingsLabel[currentBinding][currentBinding]}
          </span>
        </button>
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
                  setCurrentBiding(binding)
                  setOpen(false)
                }}
                onKeyDown={() => {
                  setCurrentBiding(binding)
                  setOpen(false)
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span>{fakeBindingsLabel[currentBinding][binding]}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default BindingSelectorBlock
