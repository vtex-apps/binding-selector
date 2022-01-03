import React, { useState, useRef, useEffect } from 'react'
import type { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import Spinner from './Spinner'

interface Props {
  currentBinding: TranslationsAndSettings
  bindingInfo: TranslationsAndSettings[]
  onSelectBinding: (selectedBinding: TranslationsAndSettings) => void
  isLoading: boolean
}

const CSS_HANDLES = [
  'list',
  'listElement',
  'container',
  'active',
  'relativeContainer',
  'button',
  'buttonText',
] as const

const BindingSelectorDropdown: FC<Props> = ({
  currentBinding,
  bindingInfo,
  onSelectBinding,
  isLoading,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)
  const relativeContainer = useRef<HTMLDivElement | null>(null)

  const handleOutsideClick = (e: MouseEvent) => {
    if (!relativeContainer.current?.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleClick = () => {
    setOpen(!open)
  }

  const handleSelection = (binding: TranslationsAndSettings) => {
    setOpen(false)
    onSelectBinding(binding)
  }

  /**
   * @todo enable the dropdown to optionally include flag icons
   */
  return (
    <div
      className={`${handles.container} ${
        open ? handles.active : ''
      } flex items-center justify-center w3 relative`}
    >
      <div
        ref={relativeContainer}
        className={`${handles.relativeContainer} relative flex justify-center`}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <button
              type="button"
              onClick={handleClick}
              className={`${handles.button} link pa3 bg-transparent bn flex items-center pointer c-on-base`}
            >
              <span className={`${handles.buttonText}`}>
                {currentBinding.label}
              </span>
            </button>
            <ul
              hidden={!open}
              className={`absolute z-9999 list top-1 ph0 mh0 mt5 bg-base ${handles.list}`}
            >
              {bindingInfo
                .filter((binding) => {
                  return binding.id !== currentBinding.id && !binding.hide
                })
                .map((binding) => (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <li
                    key={binding.id}
                    className={`${handles.listElement} t-action--small pointer f5 pa3 hover-bg-muted-5 tc`}
                    onClick={() => {
                      handleSelection(binding)
                    }}
                    onKeyDown={() => {
                      handleSelection(binding)
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span>{binding.label}</span>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default BindingSelectorDropdown
