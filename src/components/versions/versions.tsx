import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Popover, Steps } from 'antd';
import type { StepsProps } from 'antd';

import {
  TypeVersion, setProducts, setGroups, setClusters,
  selectCurrentVersion,
} from '../../store';

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
  <Popover content={(<span>{`step ${index} status: ${status}`}</span>)}>
    {dot}
  </Popover>
);

export default function Versions() {
  const [current, setCurrent] = useState(0);
  const versions = useSelector(selectCurrentVersion) as TypeVersion[];
  const dispatch = useDispatch();
  const onChange = (value: number) => {
    setCurrent(value);
    dispatch(setProducts(versions[value].products));
    dispatch(setGroups(versions[value].groups));
    dispatch(setClusters(versions[value].clusters));
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
