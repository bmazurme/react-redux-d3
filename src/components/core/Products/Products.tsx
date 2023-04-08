import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  List, Typography, Button, Tooltip, Modal, Input, Select, Row,
} from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import makeDataSelector from '../../../store/makeDataSelector';

import groups from '../../../../mock/groups';
import clusters from '../../../../mock/clusters';

import { TypeProduct } from '../../Main/object';

type FormPayload = {
  name: string;
  description: string;
  cluster: number;
  group: number;
};

const inputs = [
  { name: 'name', placeholder: 'Product name', required: true },
  { name: 'description', placeholder: 'Description name' },
];
const { confirm } = Modal;
const showDeleteConfirm = () => {
  confirm({
    title: 'Are you sure delete this task?',
    icon: <ExclamationCircleFilled />,
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

const productSelector = makeDataSelector('product');

export default function Products() {
  const errorHandler = useErrorHandler();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentProduct, setCurrentProduct] = useState({
  //   name: '',
  //   description: '',
  //   cluster: 0,
  //   group: 0,
  // });
  const closeAddModal = () => setIsModalOpen(false);
  const products = useSelector(productSelector) as unknown as TypeProduct[];

  const { control, handleSubmit, setValue } = useForm<FormPayload>({
    defaultValues: {
      name: '',
      description: '',
      cluster: 0,
      group: 0,
    },
  });
  const showModal = (product: any) => {
    setValue('name', { firstName: 'value' });

    setIsModalOpen(true);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name, description, cluster, group,
      } = data;
      console.log(name, description, cluster, group);
      setIsModalOpen(false);
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
    <>
      <List
        header={<div>Products</div>}
      // footer={<div>Footer</div>}
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
                onClick={showDeleteConfirm}
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
                  defaultValue="0"
                  style={{ width: '100%', margin: '8px 0' }}
                  onChange={(e) => field.onChange(e)}
                  options={groups}
                />
              )}
            />
            <Controller
              name={'cluster' as keyof FormPayload}
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="0"
                  style={{ width: '100%', margin: '8px 0' }}
                  onChange={(e) => field.onChange(e)}
                  options={clusters}
                />
              )}
            />
          </Row>
          <Button
            type="primary"
            onClick={closeAddModal}
            style={{ width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' }}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            style={{ width: 'calc(50% - 8px)', margin: '8px 0 8px 8px' }}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </>

  );
}
