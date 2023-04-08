import { CSSProperties } from 'react';

const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  height: '100%',
  width: '100%',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#000',
};

const siderStyle: CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};

const containerStyle: CSSProperties = {
  width: '100%', height: 'calc(100vh - 20px)', margin: 0, padding: 0,
};

export {
  headerStyle,
  contentStyle,
  siderStyle,
  footerStyle,
  containerStyle,
};
