import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {},
  reducers: {
    setValue: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setValue } = commonSlice.actions;

export default commonSlice.reducer;
