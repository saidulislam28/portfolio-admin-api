/* Instruments */
import { authSlice, carehomeSlice } from "./slices";
import { commonSlice } from "./slices/common";

export const reducer = {
  auth: authSlice.reducer,
  common: commonSlice.reducer,
  carehome: carehomeSlice.reducer,
};
