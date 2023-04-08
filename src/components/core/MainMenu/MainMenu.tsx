/* eslint-disable max-len */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Col, Row, Modal, Input, Select,
} from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import { store, setProduct } from '../../../store';
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

const productSelector = makeDataSelector('product');
const getId = (products: TypeProduct[]) => products.length
  ?? products.reduce((prev, cur) => (cur.id > prev.id ? cur : prev), { id: -Infinity }).id;

export default function Container({ heading }: { heading: string | undefined }) {
  const errorHandler = useErrorHandler();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAddModal = () => setIsModalOpen(true);
  const closeAddModal = () => setIsModalOpen(false);
  const dispatch = useDispatch();
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  // console.log(products);

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: {
      name: '',
      description: '',
      cluster: 0,
      group: 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name, description, cluster, group,
      } = data;
      dispatch(setProduct({
        id: getId(products),
        name,
        description,
        cluster,
        group,
      }));
      console.log(name, description, cluster, group);
      reset();
      setIsModalOpen(false);
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
    <>
      <Row>
        <Col span={4}>
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={openAddModal}>
            Add Product
          </Button>
        </Col>
        <Col span={4}>{heading}</Col>
        <Col span={16} />
      </Row>
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
