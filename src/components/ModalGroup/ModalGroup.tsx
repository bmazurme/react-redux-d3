import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Input } from 'antd';

import {
  setGroup, setVersion, setGroups,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

import { buttonOkStyle, buttonCancelStyle } from '../styleModal';

type FormPayload = {
  label: string;
  cluster: string;
};

export default function ModalGroup({ isOpen, closeModal, currentGroup }
  : { isOpen: boolean, closeModal: () => void, currentGroup?: Record<string, string> }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];
  const products = useSelector(selectCurrentProduct) as TypeProduct[];

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { label: '', cluster: '' },
  });

  const onSubmit = handleSubmit(async ({ label }) => {
    try {
      if (currentGroup) {
        const groupsNew = groups.map((x) => (x.value === currentGroup.value ? { ...x, label } : x));
        dispatch(setGroups(groupsNew));
        dispatch(setVersion({ products, clusters, groups: [...groupsNew] }));
      } else {
        const groupNew = { value: groups.length.toString(), label };
        dispatch(setGroup(groupNew));
        dispatch(setVersion({ products, clusters, groups: [...groups, groupNew] }));
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
    } else {
      reset();
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
          render={({ field }) => (
            <Input
              {...field}
              name="label"
              placeholder="Group name"
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
