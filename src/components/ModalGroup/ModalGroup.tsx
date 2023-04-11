import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Input } from 'antd';

import { setGroup, setGroups, setVersion } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

import { TypeCluster, TypeGroup, TypeProduct } from '../object';

type FormPayload = {
  value: string;
  label: string;
};

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');
const productSelector = makeDataSelector('product');

export default function ModalGroup({ isOpen, closeModal, currentGroup }
  : { isOpen: boolean, closeModal: () => void, currentGroup?: TypeGroup }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const clusters = useSelector(clusterSelector) as unknown as TypeCluster[];
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { value: '', label: '' },
  });

  const onSubmit = handleSubmit(async ({ label }) => {
    try {
      if (currentGroup) {
        const arr = groups.map((item) => (item.value === currentGroup.value
          ? { ...item, label }
          : item));
        dispatch(setGroups(arr));
        dispatch(setVersion({ products, groups: arr, clusters }));
      } else {
        dispatch(setGroup({ value: groups.length.toString(), label }));
        dispatch(setVersion({
          products,
          groups: [...groups, { value: groups.length.toString(), label }],
          clusters,
        }));
      }

      reset();
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  useEffect(() => {
    if (currentGroup) {
      reset(currentGroup);
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
