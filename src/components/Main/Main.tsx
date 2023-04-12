/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Modal } from 'antd';
import {
  EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ExclamationCircleFilled,
} from '@ant-design/icons';

import Tree from 'react-d3-tree';

import ModalProductEdit from '../ModalProductEdit';
import ModalEditGroup from '../ModalEditGroup';
import ModalEditCluster from '../ModalEditCluster';

import makeDataSelector from '../../store/makeDataSelector';
import { useCenteredTree, Point } from './helpers';
import { setProducts, setVersion } from '../../store';

type TypeNode = {
  name: string;
  attributes: { id: string };
  children: TypeNode[];
}

type UseUserData = [Point, (v: HTMLDivElement | null) => void];

const containerStyles = { width: '100%', height: '100%', background: '#eee' };
const { confirm } = Modal;

const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');

export default function Main() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    value: '',
    label: '',
    children: [],
  });
  const products = useSelector(productSelector) as TypeProduct[];
  const groupsDict = useSelector(groupSelector) as TypeGroup[];
  const clustersDict = useSelector(clusterSelector) as TypeCluster[];

  const clusters = Array.from(new Set(products.map(({ cluster }) => cluster)));
  const groups = Array.from(new Set(products.map(({ group }) => group)));
  const showDeleteConfirm = (product: TypeProduct
    & { id: number, attributes: Record<string, string | number> }) => {
    confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        if (product.attributes.type === 'product') {
          const arr = products.filter(({ id }) => id !== product.attributes.id);
          dispatch(setProducts(arr));
          dispatch(setVersion({
            products: arr,
            groups: groupsDict,
            clusters: clustersDict,
          }));
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const tree = {
    name: 'Clusters',
    attributes: {
      count: clusters.length,
      groups: groups.length,
      type: 'clusters',
    },
    children: clusters.map((item) => ({
      name: clustersDict.find((x) => x.value === item)?.label ?? '',
      attributes: {
        count: Array.from(new Set(products.filter((x) => item === x.cluster))).length ?? 0,
        groups: Array.from(new Set(products.filter((x) => item === x.cluster)
          .map(({ group }) => group))).length ?? 0,
        id: item,
        type: 'cluster',
      },
      children: Array.from(new Set(products.filter((x) => item === x.cluster)
        .map(({ group }) => group))).map((g) => ({
        name: groupsDict.find((x) => x.value === g)?.label ?? '',
        attributes: {
          count: products.filter((x) => item === x.cluster)
            .filter((x) => g === x.group).length ?? 0,
          groups: '===',
          id: g,
          type: 'group',
        },
        children: products.filter((x) => item === x.cluster)
          .filter((x) => g === x.group).map((prd) => ({
            name: prd.name,
            attributes: {
              id: prd.id,
              type: 'product',
            },
          })),
      })),
    })),
  };

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
    setGrp({ ...groupsDict.find((x) => x.value === g.attributes.id)!, children: g.children });
    setIsModalGroupOpen(true);
  };

  const showModalCluster = (c: TypeNode) => {
    setCltr({
      ...clustersDict.find((x) => x.value === c.attributes.id)!,
      children: c.children,
    });
    setIsModalClusterOpen(true);
  };

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
            <>
              {nodeDatum.__rd3t.collapsed
                ? <EyeInvisibleOutlined onClick={toggleNode} key="invisible" />
                : <EyeOutlined onClick={toggleNode} key="eye" />}
            </>,
            <Button
              key="edit"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => (nodeDatum.attributes.type === 'group'
                ? showModalGroup(nodeDatum)
                : nodeDatum.attributes.type === 'cluster'
                  ? showModalCluster(nodeDatum)
                  : showModal(nodeDatum)
              )}
              disabled={nodeDatum.attributes.type === 'clusters'}
            />,
            <Button
              key="delete"
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(nodeDatum)}
              disabled={nodeDatum.attributes.type === 'group'
                || nodeDatum.attributes.type === 'cluster'
                || nodeDatum.attributes.type === 'clusters'}
            />,
          ]}
        />
      </foreignObject>
    </g>
  );

  return (
    <>
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
      </div>
      <ModalProductEdit
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        pr={pr}
      />
      <ModalEditGroup
        isOpen={isModalGroupOpen}
        closeModal={closeModalGroup}
        currentGroup={grp}
      />
      <ModalEditCluster
        isOpen={isModalClusterOpen}
        closeModal={closeModalCluster}
        currentCluster={cltr}
      />
    </>
  );
}
