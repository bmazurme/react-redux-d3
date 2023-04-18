/* eslint-disable max-len */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import ModalGroup from '../ModalGroup';
import ShowDeleteConfirm from '../core/ShowDeleteConfirm/ShowDeleteConfirm';

import {
  setGroups, setVersion,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

export default function Groups() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grp, setGrp] = useState({ value: '', label: '' });
  const closeAddModal = () => setIsModalOpen(false);

  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];
  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const products = useSelector(selectCurrentProduct) as TypeProduct[];

  const callback = (group: Record<string, string | number>) => {
    const arr = groups.filter(({ value }) => value !== group.value);
    dispatch(setGroups(arr));
    dispatch(setVersion({ products, groups: arr, clusters }));
  };

  const showModal = (group: TypeGroup) => {
    setGrp(group);
    setIsModalOpen(true);
  };

  return (
    <>
      <List
        header={<div>Groups</div>}
        bordered
        dataSource={groups}
        renderItem={(group) => (
          <List.Item>
            <Typography.Text mark>{group.label}</Typography.Text>
            <Tooltip title="Edit">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => showModal(group)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => ShowDeleteConfirm(callback, group as Record<string, string | number>)}
                disabled={products.filter((x) => x.group === group.value).length > 0}
              />
            </Tooltip>
          </List.Item>
        )}
      />
      <ModalGroup isOpen={isModalOpen} closeModal={closeAddModal} currentGroup={grp} />
    </>
  );
}
