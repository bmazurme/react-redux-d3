/* eslint-disable max-len */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Col, Row, Modal, Input, Select,
} from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import ModalGroup from '../ModalGroup';
import ModalCluster from '../ModalCluster';

import { setProduct } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

import { TypeProduct, TypeGroup, TypeCluster } from '../Main/object';

type FormPayload = {
  name: string;
  description: string;
  cluster: string;
  group: string;
};

const inputs = [
  { name: 'name', placeholder: 'Product name', required: true },
  { name: 'description', placeholder: 'Description name' },
];

const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');
const getId = (products: TypeProduct[]) => products.length
  ?? products.reduce((prev, cur) => (cur.id > prev.id ? cur : prev), { id: -Infinity }).id;

export default function Container({ heading }: { heading: string | undefined }) {
  const errorHandler = useErrorHandler();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false);
  const [isModalClusterOpen, setIsModalClusterOpen] = useState(false);
  const openAddModal = () => setIsModalOpen(true);
  const closeAddModal = () => setIsModalOpen(false);
  const openAddGroupModal = () => setIsModalGroupOpen(true);
  const closeAddGroupModal = () => setIsModalGroupOpen(false);
  const openAddClusterModal = () => setIsModalClusterOpen(true);
  const closeAddClusterModal = () => setIsModalClusterOpen(false);
  const dispatch = useDispatch();
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const clusters = useSelector(clusterSelector) as unknown as TypeCluster[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: {
      name: '',
      description: '',
      cluster: '0',
      group: '0',
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
        <Col span={3}>
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={openAddModal}>
            Add Product
          </Button>
        </Col>
        <Col span={3}>
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={openAddGroupModal}>
            Add group
          </Button>
        </Col>
        <Col span={3}>
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={openAddClusterModal}>
            Add cluster
          </Button>
        </Col>
        <Col span={3}>{heading}</Col>
        <Col span={12} />
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
                  {...field}
                  style={{ width: '100%', margin: '8px 0' }}
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
                  style={{ width: '100%', margin: '8px 0' }}
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

      <ModalGroup isModalGroupOpen={isModalGroupOpen} closeAddGroupModal={closeAddGroupModal} />
      <ModalCluster isModalClusterOpen={isModalClusterOpen} closeAddClusterModal={closeAddClusterModal} />
    </>
  );
}
