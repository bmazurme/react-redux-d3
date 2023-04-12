/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import initClusters from '../../mock/initClusters';

export type ClusterState = {
  data: TypeCluster[]
};

export const initialClusterState: ClusterState = {
  data: initClusters,
};

const slice = createSlice({
  name: 'cluster',
  initialState: initialClusterState,
  reducers: {
    setCluster: (
      state,
      { payload: data }: PayloadAction<TypeCluster>,
    ) => ({ ...state, data: [...state.data, data] }),
    setClusters: (
      state,
      { payload: data }: PayloadAction<TypeCluster[]>,
    ) => ({ ...state, data }),
  },
});

export const { setCluster, setClusters } = slice.actions;

export default slice.reducer;

export const selectCurrentCluster = (state: RootState) => state.cluster.data;
