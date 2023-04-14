import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Select } from 'antd';

import { setProducts, setVersion } from '../../store';
import makeDataSelector from '../../store/makeDataSelector';

type FormPayload = {
  cluster: string;
};

const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');
const productSelector = makeDataSelector('product');

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };
const selectStyle = { width: '100%', margin: '8px 0' };

export default function ModalClusterEdit({ isOpen, closeModal, currentCluster }
  : { isOpen: boolean, closeModal: () => void, currentCluster?: any }) {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  const groups = useSelector(groupSelector) as TypeGroup[];
  const clusters = useSelector(clusterSelector) as TypeCluster[];
  const products = useSelector(productSelector) as TypeProduct[];

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
            <Select
              {...field}
              style={selectStyle}
              options={clusters}
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
