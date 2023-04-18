import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Modal, Input, Select, Row,
} from 'antd';

import {
  setProducts, setVersion, setProduct,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

import { buttonOkStyle, buttonCancelStyle, selectStyle } from '../styleModal';

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

const getId = (products: TypeProduct[]) => products.length
  ?? products.reduce((prev, cur) => (cur.id > prev.id ? cur : prev), { id: -Infinity }).id;

export default function ModalEditProduct({ isOpen, closeModal, currentProduct }
  : { isOpen: boolean, closeModal: () => void, currentProduct?: any }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const products = useSelector(selectCurrentProduct) as TypeProduct[];
  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];

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
        const productNew = { ...data, id: getId(products) };
        dispatch(setProduct(productNew));
        dispatch(setVersion({ products: [...products, productNew], groups, clusters }));
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
              <Select {...field} style={selectStyle} options={clusters} />
            )}
          />
          <Controller
            name={'group' as keyof FormPayload}
            control={control}
            render={({ field }) => (
              <Select {...field} style={selectStyle} options={groups} />
            )}
          />
          {inputs.map((input) => (
            <Controller
              key={input.name}
              name={input.name as keyof FormPayload}
              control={control}
              render={({ field }) => (
                <Input {...field} {...input} style={{ margin: '8px 0' }} />
              )}
            />
          ))}
        </Row>
        <Button type="primary" onClick={closeModal} style={buttonCancelStyle}>
          Cancel
        </Button>
        <Button htmlType="submit" type="primary" style={buttonOkStyle}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
