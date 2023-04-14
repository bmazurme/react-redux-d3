import React, { useState } from 'react';
import { Button, Col, Row } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import ModalEditProducts from '../ModalEditProduct';
import ModalGroup from '../ModalGroup';
import ModalCluster from '../ModalCluster';

export default function Container({ heading }: { heading: string | undefined }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false);
  const [isModalClusterOpen, setIsModalClusterOpen] = useState(false);

  const openAddModal = () => setIsModalOpen(true);
  const closeAddModal = () => setIsModalOpen(false);
  const openAddGroupModal = () => setIsModalGroupOpen(true);
  const closeAddGroupModal = () => setIsModalGroupOpen(false);
  const openAddClusterModal = () => setIsModalClusterOpen(true);
  const closeAddClusterModal = () => setIsModalClusterOpen(false);

  return (
    <>
      <Row>
        <Col span={3}>
          <Button
            type="primary"
            icon={<PlusSquareOutlined />}
            onClick={openAddModal}
          >
            Add Product
          </Button>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            icon={<PlusSquareOutlined />}
            onClick={openAddGroupModal}
          >
            Add group
          </Button>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            icon={<PlusSquareOutlined />}
            onClick={openAddClusterModal}
          >
            Add cluster
          </Button>
        </Col>
        <Col span={3}>{heading}</Col>
        <Col span={12} />
      </Row>

      <ModalEditProducts
        isOpen={isModalOpen}
        closeModal={closeAddModal}
      />
      <ModalGroup
        isOpen={isModalGroupOpen}
        closeModal={closeAddGroupModal}
      />
      <ModalCluster
        isOpen={isModalClusterOpen}
        closeModal={closeAddClusterModal}
      />
    </>
  );
}
