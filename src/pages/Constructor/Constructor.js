import React from 'react';

import {
  Breadcrumbs,
  Challenges,
  Sidebar,
  VerticalMenu,
  Workarea,
} from 'components/admin';

import Layout from 'containers/admin/Layout';

export default () => {
  return (
    <Layout>
      <div className="Constructor">
        <div className="Constructor__block1">
          <Breadcrumbs />
        </div>
        <div className="Constructor__block2">
          <VerticalMenu />
        </div>
        <div className="Constructor__block3">
          <Sidebar>
            <Challenges />
          </Sidebar>
        </div>
        <div className="Constructor__block4">
          <Workarea />
        </div>
      </div>
    </Layout>
  );
}
