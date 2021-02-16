import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import Selector from './components/Selector'

import './styles.global.css'

const BindingSelector: FC = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader title={<FormattedMessage id="admin-binding-selector" />} />
      }
    >
      <PageBlock variation="full">
        <Selector />
      </PageBlock>
    </Layout>
  )
}

export default BindingSelector
