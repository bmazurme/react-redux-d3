import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import { useForm, Controller } from 'react-hook-form';

import {
  List, Typography, Button, Tooltip, Modal, Input, Row,
} from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import makeDataSelector from '../../store/makeDataSelector';
import { setClusters, setVersion } from '../../store';

import { TypeCluster, TypeProduct, TypeGroup } from '../object';

type FormPayload = {
  value: string;
  label: string;
};

const inputs = [{ name: 'label', placeholder: 'Cluster name', required: true }];
const { confirm } = Modal;
const clusterSelector = makeDataSelector('cluster');
const groupSelector = makeDataSelector('group');
const productSelector = makeDataSelector('product');

const buttonStyle = { width: 'calc(50% - 8px)', margin: '8px 8px 8px 0' };

export default function Clusters() {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeAddModal = () => setIsModalOpen(false);
  const clusters = useSelector(clusterSelector) as unknown as TypeCluster[];
  const groups = useSelector(groupSelector) as unknown as TypeGroup[];
  const products = useSelector(productSelector) as unknown as TypeProduct[];

  const showDeleteConfirm = (cluster: TypeCluster) => {
    confirm({
      title: 'Are you sure delete this cluster?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const arr = clusters.filter(({ value }) => value !== cluster.value);
        dispatch(setClusters(arr));
        // dispatch(setVersion(arr));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const { control, handleSubmit, reset } = useForm<FormPayload>({
    defaultValues: { value: '', label: '' },
  });

  const showModal = (cluster: TypeCluster) => {
    reset(cluster);
    setIsModalOpen(true);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const arr = clusters.map((item) => (item.value === data.value ? data : item));
      dispatch(setClusters(arr));
      dispatch(setVersion({
        products,
        groups,
        clusters: arr,
      }));
      setIsModalOpen(false);
    } catch ({ status, data: { reason } }) {
      errorHandler(new Error(`${status}: ${reason}`));
    }
  });

  return (
    <>
      <List
        header={<div>Clusters</div>}
        bordered
        dataSource={clusters}
        renderItem={(cluster) => (
          <List.Item>
            <Typography.Text mark>{cluster.label}</Typography.Text>
            <Tooltip title="Edit">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => showModal(cluster)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(cluster)}
                disabled={products.filter((x) => x.cluster === cluster.value).length > 0}
              />
            </Tooltip>
          </List.Item>
        )}
      />
      <Modal
        title="Cluster card"
        open={isModalOpen}
        onCancel={closeAddModal}
        footer={[]}
      >
        <form onSubmit={onSubmit} key="form">
          <Row>
            {inputs.map((input) => (
              <Controller
                key={input.name}
                name={input.name as keyof FormPayload}
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    {...input}
                    style={{ margin: '8px 0' }}
                  />
                )}
              />
            ))}
          </Row>
          <Button type="primary" onClick={closeAddModal} style={buttonStyle}>
            Cancel
          </Button>
          <Button htmlType="submit" type="primary" style={buttonStyle}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
