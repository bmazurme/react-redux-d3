import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { StepsProps } from 'antd';
import { Popover, Steps } from 'antd';

import makeDataSelector from '../../store/makeDataSelector';
import { TypeProduct } from '../object';
import { setProducts } from '../../store';

const versionSelector = makeDataSelector('version');
const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
  <Popover content={(<span>{`step ${index} status: ${status}`}</span>)}>
    {dot}
  </Popover>
);

export default function Versions() {
  const [current, setCurrent] = useState(0);
  const versions = useSelector(versionSelector) as unknown as TypeProduct[][];
  const dispatch = useDispatch();
  const onChange = (value: number) => {
    setCurrent(value);
    dispatch(setProducts(versions[value]));
  };
  useEffect(() => setCurrent(versions.length), [versions.length]);

  return (
    <Steps
      current={current}
      progressDot={customDot}
      onChange={onChange}
      items={versions.map((x, i) => ({ title: i }))}
    />
  );
}
