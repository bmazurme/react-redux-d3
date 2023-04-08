/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeProduct } from '../../components/Main/object';

export type ProductState = {
  data: TypeProduct[]
};

export const initialProductState: ProductState = {
  data: [],
};

const slice = createSlice({
  name: 'product',
  initialState: initialProductState,
  reducers: {
    setProduct: (
      state,
      { payload: data }: PayloadAction<TypeProduct>,
    ) => ({ ...state, data: [...state.data, data] }),
  },
});

export const { setProduct } = slice.actions;

export default slice.reducer;

export const selectCurrentProduct = (state: RootState) => state.product.data;
