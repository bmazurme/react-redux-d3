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
import { useCenteredTree, Point } from './helpers';
import makeDataSelector from '../../store/makeDataSelector';
import { setProducts, setVersion } from '../../store';
import { TypeProduct, TypeCluster, TypeGroup } from '../object';

type UseUserData = [Point, (v: HTMLDivElement | null) => void];

const containerStyles = { width: '100%', height: '100%', background: '#eee' };
const { confirm } = Modal;

const productSelector = makeDataSelector('product');
const groupSelector = makeDataSelector('group');
const clusterSelector = makeDataSelector('cluster');

export default function Main() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pr, setPr] = useState({
    name: '',
    description: '',
    cluster: '0',
    group: '0',
    id: 0,
  });
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const groupsDict = useSelector(groupSelector) as unknown as TypeGroup[];
  const clustersDict = useSelector(clusterSelector) as unknown as TypeCluster[];
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
          dispatch(setVersion(arr));
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
        .map(({ group }) => group))).map((grp) => ({
        name: groupsDict.find((x) => x.value === grp)?.label ?? '',
        attributes: {
          count: products.filter((x) => item === x.cluster)
            .filter((x) => grp === x.group).length ?? 0,
          groups: '===',
          id: grp,
          type: 'group',
        },
        children: products.filter((x) => item === x.cluster)
          .filter((x) => grp === x.group).map((prd) => ({
            name: prd.name,
            attributes: {
              id: prd.id,
              type: 'product',
            },
          })),
      })),
    })),
  };

  console.log(tree);

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
  const closeModal = () => setIsModalOpen(false);
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
              onClick={() => showModal(nodeDatum)}
              disabled={nodeDatum.attributes.type === 'group' || nodeDatum.attributes.type === 'cluster' || nodeDatum.attributes.type === 'clusters'}
            />,
            <Button
              key="delete"
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(nodeDatum)}
              disabled={nodeDatum.attributes.type === 'group' || nodeDatum.attributes.type === 'cluster' || nodeDatum.attributes.type === 'clusters'}
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
    </>
  );
}
