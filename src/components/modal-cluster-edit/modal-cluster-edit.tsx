import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Select } from 'antd';

import {
  setProducts, setVersion,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

import { buttonOkStyle, buttonCancelStyle, selectStyle } from '../styleModal';

type FormPayload = {
  cluster: string;
};

export default function ModalClusterEdit({ isOpen, closeModal, currentCluster }
  : { isOpen: boolean, closeModal: () => void, currentCluster?: any }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];
  const products = useSelector(selectCurrentProduct) as TypeProduct[];

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { cluster: '' },
  });

  const onSubmit = handleSubmit(async ({ cluster }) => {
    try {
      const ids = currentCluster.children
        .map((x: TypeNode) => (x.children!.map((c: TypeNode) => c.attributes.id))).flat();
      const modProducts = products
        .map((x) => (ids.some((id: number) => id === x.id) ? { ...x, cluster } : x));
      dispatch(setProducts(modProducts));
      dispatch(setVersion({ products: modProducts, groups, clusters }));
      reset();
      closeModal();
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  useEffect(() => {
    if (currentCluster) {
      const attributes = currentCluster.children[0]?.children[0]?.attributes;
      const val = products.find((x) => x.id === attributes?.id);
      reset({ cluster: val?.cluster });
    }
  }, [currentCluster]);

  return (
    <Modal
      title="Cluster card"
      open={isOpen}
      onCancel={closeModal}
      footer={[]}
    >
      <form onSubmit={onSubmit} key="form">
        <Controller
          name={'cluster' as keyof FormPayload}
          control={control}
          render={({ field }) => (
            <Select {...field} style={selectStyle} options={clusters} />
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
