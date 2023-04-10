import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { Button, Modal, Input } from 'antd';

import { setCluster } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

import { TypeGroup } from '../object';

type FormPayload = {
  value: string;
  label: string;
};

const clusterSelector = makeDataSelector('cluster');
const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

export default function ModalCluster({ isModalClusterOpen, closeAddClusterModal }
  : { isModalClusterOpen: boolean, closeAddClusterModal: () => void }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const clusters = useSelector(clusterSelector) as unknown as TypeGroup[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { value: '', label: '' },
  });

  const onSubmit = handleSubmit(async ({ label }) => {
    try {
      dispatch(setCluster({ value: clusters.length.toString(), label }));
      reset();
      closeAddClusterModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
    <Modal
      title="Group card"
      open={isModalClusterOpen}
      onCancel={closeAddClusterModal}
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
        <Button
          type="primary"
          onClick={closeAddClusterModal}
          style={buttonStyle}
        >
          Cancel
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          style={buttonStyle}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
}
