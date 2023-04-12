import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import { useForm, Controller } from 'react-hook-form';
import {
  Button, Modal, Input, Select, Row,
} from 'antd';

import makeDataSelector from '../../store/makeDataSelector';
import { setProducts, setVersion } from '../../store';

type FormPayload = {
  name: string;
  description: string;
  cluster: string;
  group: string;
  id: number;
};

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 0 8px 8px' };
const selectStyle = { width: '100%', margin: '8px 0' };

const inputs = [
  { name: 'name', placeholder: 'Product name', required: true },
  { name: 'description', placeholder: 'Description name' },
];
const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');

export default function Main({ isModalOpen, closeModal, pr }
  : { isModalOpen: boolean, closeModal: () => void, pr: TypeProduct }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const products = useSelector(productSelector) as TypeProduct[];
  const groupsDict = useSelector(groupSelector) as TypeGroup[];
  const clustersDict = useSelector(clusterSelector) as TypeCluster[];

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
      const arr = products.map((item) => (item.id === data.id ? data : item));
      dispatch(setProducts(arr));
      dispatch(setVersion({
        products: arr,
        groups: groupsDict,
        clusters: groupsDict,
      }));
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  useEffect(() => {
    reset(pr);
  }, [isModalOpen]);

  return (
    <Modal
      title="Product card"
      open={isModalOpen}
      onCancel={closeModal}
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
                options={groupsDict}
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
                options={clustersDict}
              />
            )}
          />
        </Row>
        <Button type="primary" onClick={closeModal} style={buttonStyle}>
          Cancel
        </Button>
        <Button htmlType="submit" type="primary" style={buttonStyle}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
