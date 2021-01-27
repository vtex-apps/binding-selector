import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import './styles.global.css'

const BindingSelector: FC = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-binding-selector" />}
        />
      }
    >
      <PageBlock variation="full">
      </PageBlock>
    </Layout>
  )
}

export default BindingSelector
