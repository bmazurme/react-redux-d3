import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import { useForm, Controller } from 'react-hook-form';
import { Button, Modal, Input } from 'antd';

import {
  setCluster, setVersion, setClusters,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

import { buttonOkStyle, buttonCancelStyle } from '../styleModal';

type FormPayload = {
  value: string;
  label: string;
};

export default function ModalCluster({ isOpen, closeModal, currentCluster }
  : { isOpen: boolean, closeModal: () => void, currentCluster?: TypeCluster }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];
  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const products = useSelector(selectCurrentProduct) as TypeProduct[];

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
        const clusterNew = { value: clusters.length.toString(), label };
        dispatch(setCluster(clusterNew));
        dispatch(setVersion({ products, groups, clusters: [...clusters, clusterNew] }));
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
