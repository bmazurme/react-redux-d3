/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined,
} from '@ant-design/icons';

import Tree from 'react-d3-tree';

import ModalProduct from '../modal-product';
import ModalGroupEdit from '../modal-group-edit';
import ModalClusterEdit from '../modal-cluster-edit';
import ShowDeleteConfirm from '../show-delete-confirm/show-delete-confirm';

import { useCenteredTree, Point } from './helpers';
import {
  setProducts, setVersion,
  selectCurrentGroup, selectCurrentCluster, selectCurrentProduct,
} from '../../store';

import buildTree from './build-tree';

type UseUserData = [Point, (v: HTMLDivElement | null) => void];

const containerStyles = { width: '100%', height: '100%', background: '#eee' };

export default function TreeBlock() {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalProductOpen, setIsModalProductOpen] = useState(false);
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false);
  const [isModalClusterOpen, setIsModalClusterOpen] = useState(false);
  const [pr, setPr] = useState({
    name: '',
    description: '',
    cluster: '0',
    group: '0',
    id: 0,
  });
  const [grp, setGrp] = useState({ value: '', label: '', children: [] });
  const [cltr, setCltr] = useState<{ value: string, label: string, children: TypeNode[] }>({
    value: '', label: '', children: [],
  });
  const products = useSelector(selectCurrentProduct) as TypeProduct[];
  const groups = useSelector(selectCurrentGroup) as TypeGroup[];
  const clusters = useSelector(selectCurrentCluster) as TypeCluster[];

  const clustersArray = Array.from(new Set(products.map(({ cluster }) => cluster)));
  const groupsArray = Array.from(new Set(products.map(({ group }) => group)));

  const callback = (attributes: Record<string, string | number>) => {
    if (attributes.type === 'product') {
      const arr = products.filter(({ id }) => id !== attributes.id);
      dispatch(setProducts(arr));
      dispatch(setVersion({ products: arr, groups, clusters }));
    }
  };

  const tree = buildTree({
    clusters, groups, products, clustersArray, groupsArray,
  });

  const [translate, containerRef] = useCenteredTree() as unknown as UseUserData;
  const nodeSize = { x: 250, y: 250 };
  const separation = { siblings: 2, nonSiblings: 3 };
  const foreignObjectProps = {
    width: nodeSize.x, height: nodeSize.y, x: -125, y: -100,
  };

  const showModal = (product: TypeProduct & { attributes: Record<string, string | number> }) => {
    setPr(products.find((x) => x.id === product.attributes.id)!);
    setIsModalOpen(true);
  };

  const showModalGroup = (g: TypeGroup & { attributes: Record<string, string>,
    children: any }) => {
    setGrp({ ...groups.find((x) => x.value === g.attributes.id)!, children: g.children });
    setIsModalGroupOpen(true);
  };

  const showModalCluster = (c: TypeNode) => {
    setCltr({
      ...clusters.find((x) => x.value === c.attributes.id)!, children: c.children!,
    });
    setIsModalClusterOpen(true);
  };

  const disabled = (type: string) => type === 'group' || type === 'cluster' || type === 'clusters';

  const returnDialog = (nodeDatum: any) => {
    if (nodeDatum.attributes.type === 'group') {
      return showModalGroup(nodeDatum);
    }
    if (nodeDatum.attributes.type === 'cluster') {
      return showModalCluster(nodeDatum);
    }

    return showModal(nodeDatum);
  };

  const showModalProduct = () => setIsModalProductOpen(true);
  const closeModalProduct = () => setIsModalProductOpen(false);
  const closeModal = () => setIsModalOpen(false);
  const closeModalGroup = () => setIsModalGroupOpen(false);
  const closeModalCluster = () => setIsModalClusterOpen(false);
  const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps: obj }: any) => (
    <g>
      <foreignObject {...obj}>
        <Card
          title={nodeDatum.name}
          bordered={false}
          style={{ width: 250 }}
          actions={[
            <Button
              key="edit"
              size="small"
              shape="circle"
              icon={(
                <>
                  {!nodeDatum.__rd3t.collapsed
                    ? <EyeInvisibleOutlined key="invisible" />
                    : <EyeOutlined key="eye" />}
                </>
              )}
              onClick={toggleNode}
              disabled={nodeDatum.attributes.type === 'product'}
            />,
            <Button
              key="add"
              size="small"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => showModalProduct()}
              disabled={nodeDatum.attributes.type !== 'product'}
            />,
            <Button
              key="edit"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => returnDialog(nodeDatum)}
              disabled={nodeDatum.attributes.type === 'clusters'}
            />,
            <Button
              key="delete"
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => ShowDeleteConfirm(callback, nodeDatum.attributes)}
              disabled={disabled(nodeDatum.attributes.type)}
            />,
          ]}
        />
      </foreignObject>
    </g>
  );

  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={tree}
        orientation="vertical"
        nodeSize={nodeSize}
        separation={separation}
        translate={translate}
        pathFunc="step"
        renderCustomNodeElement={(rd3tProps) => renderForeignObjectNode({
          ...rd3tProps, foreignObjectProps,
        })}
      />
      <ModalProduct isOpen={isModalProductOpen} closeModal={closeModalProduct} />
      <ModalProduct isOpen={isModalOpen} closeModal={closeModal} currentProduct={pr} />
      <ModalGroupEdit isOpen={isModalGroupOpen} closeModal={closeModalGroup} currentGroup={grp} />
      {/* eslint-disable-next-line max-len */}
      <ModalClusterEdit isOpen={isModalClusterOpen} closeModal={closeModalCluster} currentCluster={cltr} />
    </div>
  );
}
