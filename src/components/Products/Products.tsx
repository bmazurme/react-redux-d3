import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip, Modal, Input, Select, Row,
} from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import makeDataSelector from '../../store/makeDataSelector';
import { setProducts, setVersion } from '../../store';

type FormPayload = {
  name: string;
  description: string;
  cluster: string;
  group: string;
  id: number;
};

const inputs = [
  { name: 'name', placeholder: 'Product name', required: true },
  { name: 'description', placeholder: 'Description name' },
];
const { confirm } = Modal;
const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');

const selectStyle = { width: '100%', margin: '8px 0' };
const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

export default function Products() {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeAddModal = () => setIsModalOpen(false);
  const products = useSelector(productSelector) as TypeProduct[];
  const groups = useSelector(groupSelector) as TypeGroup[];
  const clusters = useSelector(clusterSelector) as TypeCluster[];
  const showDeleteConfirm = (product: TypeProduct) => {
    confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const arr = products.filter(({ id }) => id !== product.id);
        dispatch(setProducts(arr));
        dispatch(setVersion({
          products: arr,
          groups,
          clusters,
        }));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: {
      name: '',
      description: '',
      cluster: '0',
      group: '0',
      id: 0,
    },
  });

  const showModal = (product: TypeProduct) => {
    reset(product);
    setIsModalOpen(true);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const arr = products.map((item) => (item.id === data.id ? data : item));
      dispatch(setProducts(arr));
      dispatch(setVersion({ products: arr, groups, clusters }));
      setIsModalOpen(false);
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

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
                onClick={() => showDeleteConfirm(product)}
              />
            </Tooltip>
          </List.Item>
        )}
      />
      <Modal
        title="Product card"
        open={isModalOpen}
        onCancel={closeAddModal}
        footer={[]}
      >
        <form onSubmit={onSubmit} key="form">
          <Row>
            {inputs.map((input) => (
              <Controller
                key={input.name}
                name={input.name as keyof FormPayload}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    {...input}
                    style={{ margin: '8px 0' }}
                  />
                )}
              />
            ))}
            <Controller
              name={'group' as keyof FormPayload}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={selectStyle}
                  options={groups}
                />
              )}
            />
            <Controller
              name={'cluster' as keyof FormPayload}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={selectStyle}
                  options={clusters}
                />
              )}
            />
          </Row>
          <Button type="primary" onClick={closeAddModal} style={buttonStyle}>
            Cancel
          </Button>
          <Button htmlType="submit" type="primary" style={buttonStyle}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
