import React from 'react';

import { Tabs } from 'antd';

import Products from '../../Products';
import Groups from '../../_groups';
import Clusters from '../../clusters';

export default function Sidebar() {
  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Products',
            children: <Products />,
          },
          {
            key: '2',
            label: 'Groups',
            children: <Groups />,
          },
          {
            key: '3',
            label: 'Clusters',
            children: <Clusters />,
          },
        ]}
      />
    </div>
  );
}
