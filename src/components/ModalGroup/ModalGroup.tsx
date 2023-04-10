import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Input } from 'antd';
import { setGroup } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

import { TypeGroup } from '../object';

type FormPayload = {
  value: string;
  label: string;
};

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };
const groupSelector = makeDataSelector('group');

export default function ModalGroup({ isModalGroupOpen, closeAddGroupModal }
  : { isModalGroupOpen: boolean, closeAddGroupModal: () => void }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { value: '', label: '' },
  });

  const onSubmit = handleSubmit(async ({ label }) => {
    try {
      dispatch(setGroup({ value: groups.length.toString(), label }));
      reset();
      closeAddGroupModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
    <Modal
      title="Group card"
      open={isModalGroupOpen}
      onCancel={closeAddGroupModal}
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
        <Button
          type="primary"
          onClick={closeAddGroupModal}
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
