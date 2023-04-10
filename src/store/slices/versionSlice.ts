/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeProduct } from '../../components/object';

export type VersionState = {
  data: TypeProduct[][]
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
      { payload: data }: PayloadAction<TypeProduct[]>,
    ) => ({ ...state, data: [...state.data, data] }),
    // setProducts: (
    //   state,
    //   { payload: data }: PayloadAction<TypeProduct[]>,
    // ) => ({ ...state, data }),
  },
});

export const { setVersion } = slice.actions;

export default slice.reducer;

export const selectCurrentVersion = (state: RootState) => state.version.data;
