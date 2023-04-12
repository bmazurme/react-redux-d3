import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Select } from 'antd';

import { setProducts, setVersion } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

type FormPayload = {
  group: string;
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
  const groups = useSelector(groupSelector) as TypeGroup[];
  const clusters = useSelector(clusterSelector) as TypeCluster[];
  const products = useSelector(productSelector) as TypeProduct[];
  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { group: '' },
  });

  const onSubmit = handleSubmit(async ({ group }) => {
    try {
      const ids = currentGroup.children
        .map((x: TypeNode) => x.attributes.id);
      const modProducts = products
        .map((x) => (ids.some((id: number) => id === x.id) ? { ...x, group } : x));
      dispatch(setProducts(modProducts));
      dispatch(setVersion({ products: modProducts, groups, clusters }));
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
      reset({ group: val?.group });
    }
  }, [currentGroup]);

  return (
    <Modal title="Group card" open={isOpen} onCancel={closeModal} footer={[]}>
      <form onSubmit={onSubmit} key="form">
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
