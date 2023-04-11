import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import { useForm, Controller } from 'react-hook-form';
import { Button, Modal, Input } from 'antd';

import { setCluster, setVersion } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

import { TypeCluster, TypeGroup, TypeProduct } from '../object';

type FormPayload = {
  value: string;
  label: string;
};

const clusterSelector = makeDataSelector('cluster');
const groupSelector = makeDataSelector('group');
const productSelector = makeDataSelector('product');
const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

export default function ModalCluster({ isOpen, closeModal }
  : { isOpen: boolean, closeModal: () => void }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const clusters = useSelector(clusterSelector) as unknown as TypeCluster[];
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { value: '', label: '' },
  });

  const onSubmit = handleSubmit(async ({ label }) => {
    try {
      dispatch(setCluster({ value: clusters.length.toString(), label }));
      dispatch(setVersion({
        products,
        groups,
        clusters: [...clusters, { value: clusters.length.toString(), label }],
      }));
      reset();
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
    <Modal
      title="Group card"
      open={isOpen}
      onCancel={closeModal}
      footer={[]}
    >
      <form onSubmit={onSubmit} key="form">
        <Controller
          name={'label' as keyof FormPayload}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              name="label"
              placeholder="Cluster name"
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
