import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";

import Selector from "./components/Selector";

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
  );
};

export default BindingSelector;
