import React from 'react';
import type { PropsWithChildren } from 'react';
import { Layout, Space } from 'antd';

import MainMenu from '../../MainMenu';
import Sidebar from '../../Sidebar';
import History from '../../Versions';

import {
  headerStyle, contentStyle, siderStyle, footerStyle, containerStyle,
} from './style';

type Props = PropsWithChildren<{ heading?: string; }>;

const {
  Header, Footer, Sider, Content,
} = Layout;

export default function Container({ children, heading }: Props) {
  return (
    <Space direction="vertical" style={{ width: '100%', margin: 0, padding: 0 }} size={[0, 0]}>
      <Layout style={containerStyle}>
        <Header style={headerStyle}>
          <MainMenu heading={heading} />
        </Header>
        <Layout>
          <Sider style={siderStyle}>
            <Sidebar />
          </Sider>
          <Content style={contentStyle}>{children}</Content>
        </Layout>
        <Footer style={footerStyle}>
          <History />
        </Footer>
      </Layout>
    </Space>
  );
}
