import { createSlice } from "@reduxjs/toolkit";

export const carehomeSlice = createSlice({
  name: "carehome",
  initialState: {},
  reducers: {
    setCareHomeData: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setCareHomeData } = carehomeSlice.actions;

export default carehomeSlice.reducer;
