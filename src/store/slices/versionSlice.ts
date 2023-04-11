/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeCluster, TypeGroup, TypeProduct } from '../../components/object';

export type TypeVersion = {
  products: TypeProduct[];
  groups: TypeGroup[];
  clusters: TypeCluster[];
};

export type VersionState = {
  data: TypeVersion[]
};

export const initialVersionState: VersionState = {
  data: [],
};

const slice = createSlice({
  name: 'version',
  initialState: initialVersionState,
  reducers: {
    setVersion: (
      state,
      { payload: data }: PayloadAction<TypeVersion>,
    ) => ({
      ...state,
      data: [
        ...state.data, {
          products: data.products,
          groups: data.groups,
          clusters: data.clusters,
        },
      ],
    }),
  },
});

export const { setVersion } = slice.actions;

export default slice.reducer;

export const selectCurrentVersion = (state: RootState) => state.version.data;
