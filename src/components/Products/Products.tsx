/* eslint-disable max-len */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import ModalEditProduct from '../ModalEditProduct';
import showDeleteConfirm from '../showDeleteConfirm';
import makeDataSelector from '../../store/makeDataSelector';
import { setProducts, setVersion } from '../../store';

const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');

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

  const products = useSelector(productSelector) as TypeProduct[];
  const groups = useSelector(groupSelector) as TypeGroup[];
  const clusters = useSelector(clusterSelector) as TypeCluster[];

  const closeAddModal = () => setIsModalOpen(false);

  const callback = (product: Record<string, string | number>) => {
    const arr = products.filter(({ id }) => id !== product.id);
    dispatch(setProducts(arr));
    dispatch(setVersion({ products: arr, groups, clusters }));
  };

  const showModal = (product: TypeProduct) => {
    setPr(product);
    setIsModalOpen(true);
  };

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
                onClick={() => showDeleteConfirm(callback, product as Record<string, string | number>)}
              />
            </Tooltip>
          </List.Item>
        )}
      />
      <ModalEditProduct
        isOpen={isModalOpen}
        closeModal={closeAddModal}
        currentProduct={pr}
      />
    </>
  );
}
