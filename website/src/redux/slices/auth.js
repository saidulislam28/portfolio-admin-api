import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: {
      loaded: false,
      loggedIn: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.auth.user = action.payload;
    },
    login: (state, action) => {
      state.auth.loaded = action.payload.loaded;
      state.auth.loggedIn = action.payload.loggedIn;
      state.auth.accessToken = action.payload.accessToken;
      state.auth.refreshToken = action.payload.refreshToken;
    },
    loadedLoggedIn: (state, action) => {
      state.auth.loaded = action.payload.loaded;
      state.auth.loggedIn = action.payload.loggedIn;
    },
    logout: (state, action) => {
      state.auth = {
        loaded: false,
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        user: null,
      };
    },
    setAuthData: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setUser, login, loadedLoggedIn, logout, setAuthData } =
  authSlice.actions;

export default authSlice.reducer;
