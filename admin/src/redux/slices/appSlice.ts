import { createSlice } from '@reduxjs/toolkit';

export type InitialStateAppSlice = {
  appName: string;
};

const initialState: InitialStateAppSlice = {
  appName: '',
};

const postsSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppName(state, action) {
      state.appName = action.payload;
    },
  },
});

const { actions, reducer } = postsSlice;
export const { setAppName } = actions;
export default reducer;
