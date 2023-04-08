/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeProduct } from '../../components/Main/object';

export type HistoryState = {
  data: TypeProduct[]
};

export const initialHistoryState: HistoryState = {
  data: [],
};

const slice = createSlice({
  name: 'history',
  initialState: initialHistoryState,
  reducers: {
    setHistory: (
      state,
      { payload: data }: PayloadAction<TypeProduct[]>,
    ) => ({ ...state, data }),
  },
});

export const { setHistory } = slice.actions;

export default slice.reducer;

export const selectCurrentHistory = (state: RootState) => state.history.data;
