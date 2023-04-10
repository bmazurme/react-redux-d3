/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { TypeGroup } from '../../components/object';

export type GroupState = {
  data: TypeGroup[]
};

export const initialGroupState: GroupState = {
  data: [
    { value: '0', label: 'Group 1' },
    { value: '1', label: 'Group 2' },
    { value: '2', label: 'Group 3' },
    { value: '3', label: 'Group 4' },
    { value: '4', label: 'Group 5' },
  ],
};

const slice = createSlice({
  name: 'group',
  initialState: initialGroupState,
  reducers: {
    setGroup: (
      state,
      { payload: data }: PayloadAction<TypeGroup>,
    ) => ({ ...state, data: [...state.data, data] }),
  },
});

export const { setGroup } = slice.actions;

export default slice.reducer;

export const selectCurrentGroup = (state: RootState) => state.group.data;
