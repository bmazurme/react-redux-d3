import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Modal, Input, Select, Row,
} from 'antd';
import makeDataSelector from '../../store/makeDataSelector';
import { setProducts, setVersion, setProduct } from '../../store';

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

const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');

const getId = (products: TypeProduct[]) => products.length
  ?? products.reduce((prev, cur) => (cur.id > prev.id ? cur : prev), { id: -Infinity }).id;

const selectStyle = { width: '100%', margin: '8px 0' };
const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

export default function ModalEditProduct({ isOpen, closeModal, currentProduct }
  : { isOpen: boolean, closeModal: () => void, currentProduct?: any }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const products = useSelector(productSelector) as TypeProduct[];
  const groups = useSelector(groupSelector) as TypeGroup[];
  const clusters = useSelector(clusterSelector) as TypeCluster[];

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
      if (currentProduct) {
        const arr = products.map((item) => (item.id === data.id ? data : item));
        dispatch(setProducts(arr));
        dispatch(setVersion({ products: arr, groups, clusters }));
      } else {
        dispatch(setProduct({ ...data, id: getId(products) }));
        dispatch(setVersion({
          products: [...products, { ...data, id: getId(products) }],
          groups,
          clusters,
        }));
      }
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  useEffect(() => {
    if (currentProduct) {
      reset(currentProduct);
    } else {
      reset();
    }
  }, [currentProduct]);

  return (
    <Modal
      title="Product card"
      open={isOpen}
      onCancel={closeModal}
      footer={[]}
    >
      <form onSubmit={onSubmit} key="form">
        <Row>
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
