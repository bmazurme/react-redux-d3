/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import initProduct from '../../mock/initialProduct';

export type ProductState = {
  data: TypeProduct[]
};

export const initialProductState: ProductState = {
  data: initProduct,
};

const slice = createSlice({
  name: 'product',
  initialState: initialProductState,
  reducers: {
    setProduct: (
      state,
      { payload: data }: PayloadAction<TypeProduct>,
    ) => ({ ...state, data: [...state.data, data] }),
    setProducts: (
      state,
      { payload: data }: PayloadAction<TypeProduct[]>,
    ) => ({ ...state, data }),
  },
});

export const { setProduct, setProducts } = slice.actions;

export default slice.reducer;

export const selectCurrentProduct = (state: RootState) => state.product.data;
