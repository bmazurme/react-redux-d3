/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

import initGroups from '../../mock/init-groups';

export type GroupState = {
  data: TypeGroup[]
};

export const initialGroupState: GroupState = {
  data: initGroups,
};

const slice = createSlice({
  name: 'group',
  initialState: initialGroupState,
  reducers: {
    setGroup: (
      state,
      { payload: data }: PayloadAction<TypeGroup>,
    ) => ({ ...state, data: [...state.data, data] }),
    setGroups: (
      state,
      { payload: data }: PayloadAction<TypeGroup[]>,
    ) => ({ ...state, data }),
  },
});

export const { setGroup, setGroups } = slice.actions;

export default slice.reducer;

export const selectCurrentGroup = (state: RootState) => state.group.data;
