import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Modal, Input, Select, Row,
} from 'antd';

import makeDataSelector from '../../store/makeDataSelector';
import { setProduct, setVersion } from '../../store';

import { TypeCluster, TypeGroup, TypeProduct } from '../object';

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

const selectStyle = { width: '100%', margin: '8px 0' };
const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

const productSelector = makeDataSelector('product');
const groupsSelector = makeDataSelector('group');
const clustersSelector = makeDataSelector('cluster');

const getId = (products: TypeProduct[]) => products.length
  ?? products.reduce((prev, cur) => (cur.id > prev.id ? cur : prev), { id: -Infinity }).id;

export default function ModalProducts({ isModalOpen, closeAddModal }
  : { isModalOpen: boolean, closeAddModal: () => void }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const groups = useSelector(groupsSelector) as unknown as TypeGroup[];
  const clusters = useSelector(clustersSelector) as unknown as TypeCluster[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: {
      name: '',
      description: '',
      cluster: '0',
      group: '0',
      id: 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      dispatch(setProduct({ ...data, id: getId(products) }));
      dispatch(setVersion({
        products: [...products, { ...data, id: getId(products) }],
        groups,
        clusters,
      }));
      reset();
      closeAddModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
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
  );
}
