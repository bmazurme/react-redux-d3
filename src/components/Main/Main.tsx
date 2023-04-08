/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Modal } from 'antd';
import {
  EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ExclamationCircleFilled,
} from '@ant-design/icons';
import Tree from 'react-d3-tree';
import { useCenteredTree, Point } from './helpers';
import makeDataSelector from '../../store/makeDataSelector';

import { store, setProducts } from '../../store';
import { TypeProduct } from './object';
import clustersDict from '../../../mock/clusters';
import groupsDict from '../../../mock/groups';

const containerStyles = {
  width: '100%',
  height: '100%',
  background: '#eee',
};
const { confirm } = Modal;

type UseUserData = [Point, (v: HTMLDivElement | null) => void]

const productSelector = makeDataSelector('product');

export default function Main() {
  const dispatch = useDispatch();
  const products = useSelector(productSelector) as unknown as TypeProduct[];
  const clusters = Array.from(new Set(products.map(({ cluster }) => cluster)));
  const groups = Array.from(new Set(products.map(({ group }) => group)));

  const showDeleteConfirm = (product: TypeProduct & { id: number, attributes: Record<string, string | number> }) => {
    confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log(product);
        if (product.attributes.type === 'product') {
          const arr = products.filter(({ id }) => id !== product.attributes.id);
          dispatch(setProducts(arr));
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }: any) => (
    <g>
      {/* <circle r={15} onClick={toggleNode} /> */}
      <foreignObject {...foreignObjectProps}>
        <Card
          title={nodeDatum.name}
          bordered={false}
          style={{ width: 250 }}
          actions={[
            <EditOutlined key="edit" />,
            <>
              {nodeDatum.__rd3t.collapsed
                ? <EyeInvisibleOutlined onClick={toggleNode} key="invisible" />
                : <EyeOutlined onClick={toggleNode} key="eye" />}
            </>,
            <Button
              key="delete"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => showDeleteConfirm(nodeDatum)}
              disabled={nodeDatum.attributes.type === 'group' || nodeDatum.attributes.type === 'cluster'}
            />,
          ]}
        >
          {/* <span>{nodeDatum.attributes.count}</span>
          <span>{nodeDatum.attributes.groups}</span> */}
        </Card>
      </foreignObject>
    </g>
  );

  const tree = {
    name: 'Clusters',
    attributes: {
      count: clusters.length,
      groups: groups.length,
    },
    children: clusters.map((item) => ({
      name: clustersDict.find((x) => x.value === item)?.label ?? '',
      attributes: {
        count: Array.from(new Set(products.filter((x) => item === x.cluster))).length ?? 0,
        groups: Array.from(new Set(products.filter((x) => item === x.cluster).map(({ group }) => group))).length ?? 0,
        id: item,
        type: 'cluster',
      },
      children: Array.from(new Set(products.filter((x) => item === x.cluster).map(({ group }) => group))).map((grp) => ({
        name: groupsDict.find((x) => x.value === grp)?.label ?? '',
        attributes: {
          count: products.filter((x) => item === x.cluster).filter((x) => grp === x.group).length ?? 0,
          groups: '===',
          id: grp,
          type: 'group',
        },
        children: products.filter((x) => item === x.cluster).filter((x) => grp === x.group).map((prd) => ({
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

  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={tree}
        orientation="vertical"
        nodeSize={nodeSize}
        separation={separation}
        translate={translate}
        pathFunc="step"
        renderCustomNodeElement={(rd3tProps) => renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })}
      />
    </div>
  );
}
function useStyles() {
  throw new Error('Function not implemented.');
}
