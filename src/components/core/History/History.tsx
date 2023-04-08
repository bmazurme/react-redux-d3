import React from 'react';
import { Steps } from 'antd';

const data = [
  {
    title: 'Finished',
  },
  {
    title: 'In Progress',
  },
  {
    title: 'Waiting',
  },
  {
    title: 'Finished',
  },
  {
    title: 'In Progress',
  },
  {
    title: 'Waiting',
  },
];

export default function Container() {
  return (<Steps size="small" current={1} items={data} />);
}
