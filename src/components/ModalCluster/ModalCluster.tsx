import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import { useForm, Controller } from 'react-hook-form';
import { Button, Modal, Input } from 'antd';

import { setCluster, setVersion, setClusters } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

type FormPayload = {
  value: string;
  label: string;
};

const clusterSelector = makeDataSelector('cluster');
const groupSelector = makeDataSelector('group');
const productSelector = makeDataSelector('product');

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

export default function ModalCluster({ isOpen, closeModal, currentCluster }
  : { isOpen: boolean, closeModal: () => void, currentCluster?: TypeCluster }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const clusters = useSelector(clusterSelector) as TypeCluster[];
  const groups = useSelector(groupSelector) as TypeGroup[];
  const products = useSelector(productSelector) as TypeProduct[];

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { value: '', label: '' },
  });

  const onSubmit = handleSubmit(async ({ label }) => {
    try {
      if (currentCluster) {
        const arr = clusters.map((item) => (item.value === currentCluster.value
          ? { ...item, label }
          : item));
        dispatch(setClusters(arr));
        dispatch(setVersion({ products, groups, clusters: arr }));
      } else {
        dispatch(setCluster({ value: clusters.length.toString(), label }));
        dispatch(setVersion({
          products,
          groups,
          clusters: [...clusters, { value: clusters.length.toString(), label }],
        }));
      }

      reset();
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  useEffect(() => {
    if (currentCluster) {
      reset(currentCluster);
    }
  }, [currentCluster]);

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
          render={({ field }) => (
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
