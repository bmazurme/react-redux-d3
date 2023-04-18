/* eslint-disable max-len */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import ModalCluster from '../ModalCluster';
import ShowDeleteConfirm from '../core/ShowDeleteConfirm/ShowDeleteConfirm';

import {
  setClusters, setVersion,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

export default function Clusters() {
  const dispatch = useDispatch();
  const [cltr, setCltr] = useState<{ value: string, label: string }>({ value: '', label: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeAddModal = () => setIsModalOpen(false);

  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];
  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const products = useSelector(selectCurrentProduct) as TypeProduct[];

  const callback = (cluster: Record<string, string | number>) => {
    const arr = clusters.filter(({ value }) => value !== cluster.value);
    dispatch(setClusters(arr));
    dispatch(setVersion({ products, groups, clusters: arr }));
  };

  const showModal = (cluster: TypeCluster) => {
    setCltr(cluster);
    setIsModalOpen(true);
  };

  return (
    <>
      <List
        header={<div>Clusters</div>}
        bordered
        dataSource={clusters}
        renderItem={(cluster) => (
          <List.Item>
            <Typography.Text mark>{cluster.label}</Typography.Text>
            <Tooltip title="Edit">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => showModal(cluster)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => ShowDeleteConfirm(callback, cluster as Record<string, string | number>)}
                disabled={products.filter((x) => x.cluster === cluster.value).length > 0}
              />
            </Tooltip>
          </List.Item>
        )}
      />
      <ModalCluster isOpen={isModalOpen} closeModal={closeAddModal} currentCluster={cltr} />
    </>
  );
}
