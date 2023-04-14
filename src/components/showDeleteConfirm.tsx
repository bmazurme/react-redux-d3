import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons/lib/icons';

const { confirm } = Modal;

const showDeleteConfirm = (
  callback: (c: Record<string, string | number>) => void,
  cluster: Record<string, string | number>,
) => {
  confirm({
    title: 'Are you sure delete this object?',
    icon: <ExclamationCircleFilled />,
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      callback(cluster);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

export default showDeleteConfirm;
