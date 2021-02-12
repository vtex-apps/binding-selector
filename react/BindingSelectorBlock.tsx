/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { withApollo, compose, graphql } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import BindingSelectorList from './components/BindingSelectorList'
import alternateHrefsQuery from './graphql/alternateHrefs.gql'

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
] as const

interface Hrefs {
  binding: string
  url: string
}

const BindingSelectorBlock: FC = (props: any) => {
  const [currentBinding, setCurrentBiding] = useState<string>('pt-BR')
  const [open, setOpen] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)
  // @ts-expect-error routes not typed in useRuntime
  const { route: { pageContext: { id, type }} } = useRuntime()

  const queryVariables = {
    id,
    type,
  }

  const handleClick = () => {
    setOpen(!open)
  }

  const getAltHrefs = async (): Promise<any> => {
    try {
      const result = await props.client.query({
        query: alternateHrefsQuery,
        variables: queryVariables,
      })

      return result
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelection = async (selectedBinding: string): Promise<any> => {
    const data = await getAltHrefs()
    console.log('dataHref', data?.internal?.routes)
    setCurrentBiding(selectedBinding)
    setOpen(false)
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
        <BindingSelectorList
          open={open}
          currentBinding={currentBinding}
          fakeBindingsLabel={fakeBindingsLabel}
          onSelectBinding={handleSelection}
        />
      </div>
    </div>
  )
}

const withAlternateHrefs = graphql(alternateHrefsQuery, {
  name: 'alternateHrefs',
})

export default compose(withApollo, withAlternateHrefs)(BindingSelectorBlock)
