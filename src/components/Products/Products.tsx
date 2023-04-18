/* eslint-disable max-len */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import ModalProduct from '../ModalProduct';
import ShowDeleteConfirm from '../core/ShowDeleteConfirm/ShowDeleteConfirm';

import {
  setProducts, setVersion,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

export default function Products() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pr, setPr] = useState({
    name: '',
    description: '',
    cluster: '0',
    group: '0',
    id: 0,
  });

  const products = useSelector(selectCurrentProduct) as TypeProduct[];
  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];

  const callback = (product: Record<string, string | number>) => {
    const arr = products.filter(({ id }) => id !== product.id);
    dispatch(setProducts(arr));
    dispatch(setVersion({ products: arr, groups, clusters }));
  };

  const showModal = (product: TypeProduct) => {
    setPr(product);
    setIsModalOpen(true);
  };
  const closeAddModal = () => setIsModalOpen(false);

  return (
    <>
      <List
        header={<div>Products</div>}
        bordered
        dataSource={products}
        renderItem={(product) => (
          <List.Item>
            <Typography.Text mark>{product.name}</Typography.Text>
            <Tooltip title="Edit">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => showModal(product)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => ShowDeleteConfirm(callback, product as Record<string, string | number>)}
              />
            </Tooltip>
          </List.Item>
        )}
      />
      <ModalProduct isOpen={isModalOpen} closeModal={closeAddModal} currentProduct={pr} />
    </>
  );
}
