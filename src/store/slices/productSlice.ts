/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeProduct } from '../../components/Main/object';

export type ProductState = {
  data: TypeProduct[]
};

export const initialProductState: ProductState = {
  data: [
    {
      id: 0,
      name: 'Product 1',
      description: 'qwerty',
      cluster: '0',
      group: '0',
    },
    {
      id: 1,
      name: 'Product 2',
      description: 'qwerty',
      cluster: '0',
      group: '1',
    },
    {
      id: 2,
      name: 'Product 3',
      description: 'qwerty',
      cluster: '0',
      group: '2',
    },
    {
      id: 3,
      name: 'Product 4',
      description: 'qwerty',
      cluster: '0',
      group: '3',
    },
    {
      id: 4,
      name: 'Product 5',
      description: 'qwerty',
      cluster: '1',
      group: '4',
    },
  ],
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
