/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeCluster } from '../../components/object';

export type ClusterState = {
  data: TypeCluster[]
};

export const initialClusterState: ClusterState = {
  data: [
    { value: '0', label: 'Cluster 1' },
    { value: '1', label: 'Cluster 2' },
    { value: '2', label: 'Cluster 3' },
    { value: '3', label: 'Cluster 4' },
  ],
};

const slice = createSlice({
  name: 'cluster',
  initialState: initialClusterState,
  reducers: {
    setCluster: (
      state,
      { payload: data }: PayloadAction<TypeCluster>,
    ) => ({ ...state, data: [...state.data, data] }),
  },
});

export const { setCluster } = slice.actions;

export default slice.reducer;

export const selectCurrentCluster = (state: RootState) => state.cluster.data;
