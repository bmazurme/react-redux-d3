import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Select } from 'antd';

import { setProducts, setVersion } from '../../store';
import { groupSelector, clusterSelector, productSelector } from '../../store/selectors';

import { buttonOkStyle, buttonCancelStyle, selectStyle } from '../styleModal';

type FormPayload = {
  group: string;
  cluster: string;
};

export default function ModalGroupEdit({ isOpen, closeModal, currentGroup }
  : { isOpen: boolean, closeModal: () => void, currentGroup?: any }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const groups = useSelector(groupSelector) as TypeGroup[];
  const clusters = useSelector(clusterSelector) as TypeCluster[];
  const products = useSelector(productSelector) as TypeProduct[];

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { group: '', cluster: '' },
  });

  const onSubmit = handleSubmit(async ({ group, cluster }) => {
    try {
      const ids = currentGroup.children.map((x: TypeNode) => x.attributes.id);
      const modProducts = products
        .map((x) => (ids.some((id: number) => id === x.id) ? { ...x, group, cluster } : x));

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
      reset({ group: val?.group, cluster: val?.cluster });
    }
  }, [currentGroup]);

  return (
    <Modal title="Group card" open={isOpen} onCancel={closeModal} footer={[]}>
      <form onSubmit={onSubmit} key="form">
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
