/* Core */
import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

/* Instruments */
// import { middleware } from "./middleware";
import { reducer } from "./rootReducer";

const configureStoreDefaultOptions = { reducer };

export const makeReduxStore = (options = configureStoreDefaultOptions) => {
  const store = configureStore(options);

  return store;
};

export const reduxStore = configureStore({
  reducer,
  // middleware: (getDefaultMiddleware) => {
  //   return process.env.NODE_ENV === "development"
  //     ? getDefaultMiddleware().concat(middleware)
  //     : getDefaultMiddleware();
  // },
});
export const useDispatch = () => useReduxDispatch();
export const useSelector = useReduxSelector;
