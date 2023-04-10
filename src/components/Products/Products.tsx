import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip, Modal, Input, Select, Row, Tabs,
} from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import makeDataSelector from '../../store/makeDataSelector';
import { setProducts, setVersion } from '../../store';

import { TypeGroup, TypeProduct, TypeCluster } from '../object';

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
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const clusters = useSelector(clusterSelector) as unknown as TypeCluster[];
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
        dispatch(setVersion(arr));
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
      dispatch(setVersion(arr));
      setIsModalOpen(false);
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <div style={{ overflow: 'auto', height: '100%' }}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Products',
              children: <List
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
              />,
            },
            {
              key: '2',
              label: 'Groups',
              children: <List
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
                        // onClick={() => showModal(group)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="primary"
                        size="small"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        // onClick={() => showDeleteConfirm(group)}
                      />
                    </Tooltip>
                  </List.Item>
                )}
              />,
            },
            {
              key: '3',
              label: 'Clusters',
              children: <List
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
                        // onClick={() => showModal(cluster)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="primary"
                        size="small"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        // onClick={() => showDeleteConfirm(cluster)}
                      />
                    </Tooltip>
                  </List.Item>
                )}
              />,
            },
          ]}
          onChange={onChange}
        />
      </div>

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
                render={({ field, fieldState }) => (
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
