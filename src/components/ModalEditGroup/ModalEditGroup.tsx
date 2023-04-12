/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Modal, Input, Select,
} from 'antd';

import { setGroups, setProducts, setVersion } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

import { TypeCluster, TypeGroup, TypeProduct } from '../object';

type FormPayload = {
  label: string;
  cluster: string;
};

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };
const selectStyle = { width: '100%', margin: '8px 0' };
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');
const productSelector = makeDataSelector('product');

export default function ModalEditGroup({ isOpen, closeModal, currentGroup }
  : { isOpen: boolean, closeModal: () => void, currentGroup?: any }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const clusters = useSelector(clusterSelector) as unknown as TypeCluster[];
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { label: '', cluster: '' },
  });

  const onSubmit = handleSubmit(async ({ label, cluster }) => {
    try {
      const arr = groups.map((item) => (item.value === currentGroup.value
        ? { ...item, label }
        : item));
      dispatch(setGroups(arr));
      const ids = currentGroup.children.map((x: any) => x.attributes.id);
      const modProducts = products.map((x) => (ids.some((id: any) => id === x.id) ? { ...x, cluster } : x));
      dispatch(setProducts(modProducts));
      dispatch(setVersion({ products: modProducts, groups: arr, clusters }));

      reset();
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  useEffect(() => {
    if (currentGroup) {
      const attributes = currentGroup.children[0]?.attributes;
      const val = products.find((x) => x.id === attributes?.id);
      reset({ label: currentGroup.label, cluster: val?.cluster });
    }
  }, [currentGroup]);

  return (
    <Modal
      title="Group card"
      open={isOpen}
      onCancel={closeModal}
      footer={[]}
    >
      <form onSubmit={onSubmit} key="form">
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
          name={'label' as keyof FormPayload}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              name="label"
              placeholder="Group name"
              required
              style={{ margin: '8px 0' }}
            />
          )}
        />
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
