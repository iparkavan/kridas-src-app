import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: localStorage.getItem("token") === null ? false : true,
  tokenExpirationTime: localStorage.getItem("tokenExpirationTime"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken(state, action) {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.tokenExpirationTime = action.payload.tokenExpirationTime;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "tokenExpirationTime",
        action.payload.tokenExpirationTime
      );
    },
    logout(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.tokenExpirationTime = null;

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpirationTime");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
